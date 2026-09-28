import express from 'express';
import cors from 'cors';
import { getDatabase, initDatabase, seedData } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DB
initDatabase()
  .then(() => {
    console.log("StartupBridge SQLite database ready.");
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
  });

// --- HELPER WRAPPERS ---
function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.all(sql, params, (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.get(sql, params, (err, row) => {
      db.close();
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.run(sql, params, function (err) {
      db.close();
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// ----------------------------------------------------
// AI STARTUP MATCHING ALGORITHM (DEMONSTRATION HEURISTIC)
// ----------------------------------------------------
function calculateAIMatch(challenge, startup) {
  let score = 50; // base score
  const matchFactors = [];

  const textToKeywords = (str) =>
    (str || '')
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);

  const challengeKeywords = [
    ...textToKeywords(challenge.title),
    ...textToKeywords(challenge.required_technology),
    ...textToKeywords(challenge.problem_description),
    ...textToKeywords(challenge.expected_kpis),
  ];

  const startupKeywords = [
    ...textToKeywords(startup.solution),
    ...textToKeywords(startup.technology),
    ...textToKeywords(startup.industry),
    ...textToKeywords(startup.description),
  ];

  // 1. Tech & Domain Keyword Overlap
  const matchingKeywords = challengeKeywords.filter((k) =>
    startupKeywords.includes(k)
  );
  const uniqueMatches = [...new Set(matchingKeywords)];

  if (uniqueMatches.length >= 4) {
    score += 24;
    matchFactors.push(`High Technology Alignment (${uniqueMatches.slice(0, 3).join(', ')})`);
  } else if (uniqueMatches.length >= 2) {
    score += 15;
    matchFactors.push(`Direct Tech Overlap (${uniqueMatches.join(', ')})`);
  } else if (uniqueMatches.length === 1) {
    score += 8;
    matchFactors.push(`Partial Match (${uniqueMatches[0]})`);
  } else {
    score -= 10;
  }

  // 2. Experience Factor
  const exp = startup.years_experience || 0;
  if (exp >= 4) {
    score += 10;
    matchFactors.push(`Proven Track Record (${exp} Years in Industry)`);
  } else if (exp >= 2) {
    score += 6;
    matchFactors.push(`Viable Experience (${exp} Years)`);
  }

  // 3. DPIIT Recognition
  if (startup.dpiit_recognized) {
    score += 8;
    matchFactors.push(`DPIIT Verified Startup (${startup.dpiit_number})`);
  }

  // Cap score between 35 and 96
  const finalScore = Math.min(96, Math.max(35, Math.round(score)));
  return {
    score: finalScore,
    matchFactors: matchFactors.length > 0 ? matchFactors : ['General GovTech Domain Viability']
  };
}

// ----------------------------------------------------
// 1. OVERVIEW & PIPELINE
// ----------------------------------------------------
app.get('/api/overview', async (req, res) => {
  try {
    const challengesCount = await dbGet("SELECT COUNT(*) as count FROM challenges WHERE status != 'Closed'");
    const applicationsCount = await dbGet("SELECT COUNT(*) as count FROM applications");
    const pilotsCount = await dbGet("SELECT COUNT(*) as count FROM pilots WHERE status = 'In Progress' OR status = 'Active'");
    const evaluationsCount = await dbGet("SELECT COUNT(*) as count FROM applications WHERE status = 'In Review' OR status = 'Applied'");
    const procurementCount = await dbGet("SELECT COUNT(*) as count FROM procurement_decisions WHERE status = 'Under Procurement Review'");
    const scaledCount = await dbGet("SELECT COUNT(*) as count FROM scaled_solutions WHERE status = 'SOLUTION SCALED'");

    // Pipeline stages with active items
    const pipeline = [
      { id: '01', name: 'Challenge', count: 5, stage: 'Challenge Identification', status: 'In Progress' },
      { id: '02', name: 'Discovery', count: 8, stage: 'Startup Discovery', status: 'Completed' },
      { id: '03', name: 'Evaluation', count: 4, stage: 'Expert Evaluation', status: 'In Progress' },
      { id: '04', name: 'Pilot', count: 3, stage: 'Pilot Management', status: 'In Progress' },
      { id: '05', name: 'Validation', count: 3, stage: 'Performance Validation', status: 'Completed' },
      { id: '06', name: 'Procurement', count: 2, stage: 'Procurement Decision', status: 'Approved' },
      { id: '07', name: 'Scale-Up', count: 2, stage: 'Scale-Up', status: 'In Progress' },
    ];

    res.json({
      cards: {
        activeChallenges: challengesCount.count,
        applicationsReceived: applicationsCount.count,
        pilotsRunning: pilotsCount.count,
        pendingEvaluations: evaluationsCount.count,
        procurementDecisions: procurementCount.count,
        solutionsScaled: scaledCount.count,
      },
      pipeline
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 2. CHALLENGES
// ----------------------------------------------------
app.get('/api/challenges', async (req, res) => {
  try {
    const rows = await dbAll("SELECT * FROM challenges ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/challenges/:id', async (req, res) => {
  try {
    const row = await dbGet("SELECT * FROM challenges WHERE id = ?", [req.params.id]);
    if (!row) return res.status(404).json({ error: "Challenge not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/challenges', async (req, res) => {
  try {
    const {
      title,
      department,
      problem_description,
      expected_outcome,
      required_technology,
      budget_range,
      pilot_duration,
      eligibility_requirements,
      expected_kpis,
      submission_deadline,
      status = 'Open'
    } = req.body;

    if (!title || !department || !problem_description) {
      return res.status(400).json({ error: "Title, Department, and Problem Description are required." });
    }

    const result = await dbRun(`
      INSERT INTO challenges (
        title, department, problem_description, expected_outcome,
        required_technology, budget_range, pilot_duration,
        eligibility_requirements, expected_kpis, submission_deadline,
        status, stage, applications_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `, [
      title,
      department,
      problem_description,
      expected_outcome || "Rapid operational enhancement and cost-effective deployment.",
      required_technology || "AI / IoT / Edge Systems",
      budget_range || "₹25,00,000 - ₹50,00,000",
      pilot_duration || "3 Months",
      eligibility_requirements || "DPIIT Recognized, min 2 years experience",
      expected_kpis || "90% Detection Accuracy, Under 30 mins response time",
      submission_deadline || "2026-11-30",
      status,
      status === 'Open' ? 'Startup Discovery' : 'Draft'
    ]);

    // Create Notification
    await dbRun(`
      INSERT INTO notifications (title, message, type)
      VALUES (?, ?, ?)
    `, [
      `New Challenge Published: ${title}`,
      `Department of ${department} has published a new procurement challenge.`,
      'challenge'
    ]);

    const created = await dbGet("SELECT * FROM challenges WHERE id = ?", [result.lastID]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 3. STARTUPS & AI MATCHING
// ----------------------------------------------------
app.get('/api/startups', async (req, res) => {
  try {
    const { challengeId, search, technology, industry } = req.query;
    let startups = await dbAll("SELECT * FROM startups ORDER BY id ASC");

    let challenge = null;
    if (challengeId) {
      challenge = await dbGet("SELECT * FROM challenges WHERE id = ?", [challengeId]);
    }

    // Compute AI Match score for each startup
    startups = startups.map((s) => {
      let aiResult;
      if (challenge) {
        aiResult = calculateAIMatch(challenge, s);
      } else {
        // Default water leakage matching if no challenge specified
        const defaultChallenge = {
          title: "Water Leakage Detection",
          required_technology: "IoT Sensors, Acoustic Telemetry, Machine Learning",
          problem_description: "underground pipeline leakages acoustic telemetry"
        };
        aiResult = calculateAIMatch(defaultChallenge, s);
      }
      return {
        ...s,
        matchScore: aiResult.score,
        matchFactors: aiResult.matchFactors
      };
    });

    // Filtering
    if (search) {
      const q = search.toLowerCase();
      startups = startups.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.solution.toLowerCase().includes(q) ||
        s.technology.toLowerCase().includes(q)
      );
    }
    if (technology && technology !== 'All') {
      startups = startups.filter(s => s.technology.toLowerCase().includes(technology.toLowerCase()));
    }
    if (industry && industry !== 'All') {
      startups = startups.filter(s => s.industry.toLowerCase().includes(industry.toLowerCase()));
    }

    // Sort by match score descending
    startups.sort((a, b) => b.matchScore - a.matchScore);

    res.json(startups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/startups/:id', async (req, res) => {
  try {
    const startup = await dbGet("SELECT * FROM startups WHERE id = ?", [req.params.id]);
    if (!startup) return res.status(404).json({ error: "Startup not found" });

    // Applications & matches for this startup
    const applications = await dbAll(`
      SELECT a.*, c.title as challenge_title, c.department
      FROM applications a
      JOIN challenges c ON a.challenge_id = c.id
      WHERE a.startup_id = ?
    `, [req.params.id]);

    res.json({
      ...startup,
      applications
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Match for a specific challenge and startup
app.post('/api/startups/:id/match', async (req, res) => {
  try {
    const { challengeId, challengeTitle, requiredTechnology, problemDescription } = req.body;
    const startup = await dbGet("SELECT * FROM startups WHERE id = ?", [req.params.id]);
    if (!startup) return res.status(404).json({ error: "Startup not found" });

    let challenge = null;
    if (challengeId) {
      challenge = await dbGet("SELECT * FROM challenges WHERE id = ?", [challengeId]);
    }
    if (!challenge) {
      challenge = {
        title: challengeTitle || "AI Water Leakage Detection",
        required_technology: requiredTechnology || "IoT, Acoustic Telemetry, ML",
        problem_description: problemDescription || "Water pipeline acoustic leak detection"
      };
    }

    const aiResult = calculateAIMatch(challenge, startup);
    res.json({
      startupId: startup.id,
      startupName: startup.name,
      matchScore: aiResult.score,
      matchFactors: aiResult.matchFactors,
      algorithm: "AI-assisted startup matching — Heuristic Feature Matrix (Prototype)"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 4. APPLICATIONS & ELIGIBILITY SCREENING
// ----------------------------------------------------
app.get('/api/applications', async (req, res) => {
  try {
    const rows = await dbAll(`
      SELECT a.*,
             c.title as challenge_title, c.department, c.status as challenge_status,
             s.name as startup_name, s.solution as startup_solution,
             s.dpiit_number, s.years_experience, s.technology as startup_tech
      FROM applications a
      JOIN challenges c ON a.challenge_id = c.id
      JOIN startups s ON a.startup_id = s.id
      ORDER BY a.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { challenge_id, startup_id, proposal_summary, proposed_budget, proposed_timeline } = req.body;
    if (!challenge_id || !startup_id) {
      return res.status(400).json({ error: "challenge_id and startup_id are required" });
    }

    // Check duplicate
    const existing = await dbGet(
      "SELECT id FROM applications WHERE challenge_id = ? AND startup_id = ?",
      [challenge_id, startup_id]
    );
    if (existing) {
      return res.status(400).json({ error: "Startup has already submitted an application for this challenge." });
    }

    const result = await dbRun(`
      INSERT INTO applications (
        challenge_id, startup_id, status, proposal_summary, proposed_budget,
        proposed_timeline, checklist_dpiit, checklist_documents, checklist_technology,
        checklist_experience, checklist_compliance
      ) VALUES (?, ?, 'Applied', ?, ?, ?, 1, 1, 1, 1, 1)
    `, [
      challenge_id,
      startup_id,
      proposal_summary || "Technical pilot proposal submitted for field evaluation.",
      proposed_budget || "₹35,00,000",
      proposed_timeline || "90 Days"
    ]);

    // Update challenge application count
    await dbRun("UPDATE challenges SET applications_count = applications_count + 1 WHERE id = ?", [challenge_id]);

    // Notification
    const startup = await dbGet("SELECT name FROM startups WHERE id = ?", [startup_id]);
    const challenge = await dbGet("SELECT title FROM challenges WHERE id = ?", [challenge_id]);
    await dbRun(`
      INSERT INTO notifications (title, message, type)
      VALUES (?, ?, ?)
    `, [
      `New Application from ${startup ? startup.name : 'Startup'}`,
      `Applied for ${challenge ? challenge.title : 'Challenge'}. Ready for eligibility screening.`,
      'application'
    ]);

    res.status(201).json({ id: result.lastID, message: "Application submitted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update eligibility checklist item
app.patch('/api/applications/:id/checklist', async (req, res) => {
  try {
    const { checklist_dpiit, checklist_documents, checklist_technology, checklist_experience, checklist_compliance } = req.body;
    const current = await dbGet("SELECT * FROM applications WHERE id = ?", [req.params.id]);
    if (!current) return res.status(404).json({ error: "Application not found" });

    const newDpiit = checklist_dpiit !== undefined ? checklist_dpiit : current.checklist_dpiit;
    const newDocs = checklist_documents !== undefined ? checklist_documents : current.checklist_documents;
    const newTech = checklist_technology !== undefined ? checklist_technology : current.checklist_technology;
    const newExp = checklist_experience !== undefined ? checklist_experience : current.checklist_experience;
    const newComp = checklist_compliance !== undefined ? checklist_compliance : current.checklist_compliance;

    const isAllChecked = (newDpiit && newDocs && newTech && newExp && newComp);
    const newStatus = isAllChecked ? 'In Review' : 'Eligibility Incomplete';

    await dbRun(`
      UPDATE applications SET
        checklist_dpiit = ?,
        checklist_documents = ?,
        checklist_technology = ?,
        checklist_experience = ?,
        checklist_compliance = ?,
        status = ?
      WHERE id = ?
    `, [newDpiit, newDocs, newTech, newExp, newComp, newStatus, req.params.id]);

    res.json({
      message: "Checklist updated",
      isEligible: isAllChecked === 1 || isAllChecked === true,
      status: newStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 5. EXPERT EVALUATION
// ----------------------------------------------------
app.get('/api/evaluations', async (req, res) => {
  try {
    const rows = await dbAll(`
      SELECT e.*,
             a.challenge_id, a.startup_id, a.proposal_summary, a.proposed_budget,
             c.title as challenge_title, c.department,
             s.name as startup_name, s.solution as startup_solution
      FROM evaluations e
      JOIN applications a ON e.application_id = a.id
      JOIN challenges c ON a.challenge_id = c.id
      JOIN startups s ON a.startup_id = s.id
      ORDER BY e.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/evaluations', async (req, res) => {
  try {
    const {
      application_id,
      expert_name = "Dr. M. S. Swaminathan (CPWD Advisory Panel)",
      technical_score,
      innovation_score,
      feasibility_score,
      cost_score,
      team_score,
      comments,
      decision // "Approved for Pilot" | "Reject"
    } = req.body;

    if (!application_id || technical_score === undefined || !decision) {
      return res.status(400).json({ error: "application_id, scores, and decision are required." });
    }

    const t = parseFloat(technical_score) || 0;
    const i = parseFloat(innovation_score) || 0;
    const f = parseFloat(feasibility_score) || 0;
    const c = parseFloat(cost_score) || 0;
    const tm = parseFloat(team_score) || 0;
    const total_score = Number(((t * 0.3) + (i * 0.25) + (f * 0.2) + (c * 0.15) + (tm * 0.1)).toFixed(1));

    const result = await dbRun(`
      INSERT INTO evaluations (
        application_id, expert_name, technical_score, innovation_score,
        feasibility_score, cost_score, team_score, total_score,
        comments, decision
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      application_id,
      expert_name,
      t, i, f, c, tm,
      total_score,
      comments || "Evaluated based on technical merit and pilot feasibility criteria.",
      decision
    ]);

    // Update application status
    const appStatus = decision === 'Approved for Pilot' ? 'Approved' : 'Rejected';
    await dbRun("UPDATE applications SET status = ? WHERE id = ?", [appStatus, application_id]);

    // If approved, create or update Pilot record
    if (decision === 'Approved for Pilot') {
      const app = await dbGet(`
        SELECT a.*, c.department, c.expected_outcome, c.pilot_duration, c.budget_range, s.name as startup_name
        FROM applications a
        JOIN challenges c ON a.challenge_id = c.id
        JOIN startups s ON a.startup_id = s.id
        WHERE a.id = ?
      `, [application_id]);

      const existingPilot = await dbGet("SELECT id FROM pilots WHERE application_id = ?", [application_id]);
      if (!existingPilot) {
        await dbRun(`
          INSERT INTO pilots (
            application_id, challenge_id, startup_id, department,
            objective, duration, budget, start_date, end_date,
            milestone1_title, milestone1_status,
            milestone2_title, milestone2_status,
            milestone3_title, milestone3_status,
            milestone4_title, milestone4_status,
            status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, '2026-10-01', '2026-12-31',
            'Initial Sensor Deployment & Site Setup', 'Pending',
            'Field Testing & Acoustic Calibration', 'Pending',
            'Performance Validation & Benchmarking', 'Pending',
            'Final Pilot Review & Audit', 'Pending',
            'In Progress'
          )
        `, [
          application_id,
          app.challenge_id,
          app.startup_id,
          app.department,
          app.expected_outcome || "Rapid field proof-of-concept testing",
          app.pilot_duration || "90 Days",
          app.proposed_budget || "₹38,50,000"
        ]);
      }

      await dbRun(`
        INSERT INTO notifications (title, message, type)
        VALUES (?, ?, ?)
      `, [
        "Expert Evaluation Completed - Approved for Pilot",
        `Application #${application_id} approved with score ${total_score}/100. Pilot workspace generated.`,
        'evaluation'
      ]);
    }

    res.status(201).json({
      id: result.lastID,
      total_score,
      decision,
      message: "Evaluation submitted successfully."
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 6. PILOT MANAGEMENT
// ----------------------------------------------------
app.get('/api/pilots', async (req, res) => {
  try {
    const rows = await dbAll(`
      SELECT p.*,
             c.title as challenge_title,
             s.name as startup_name, s.solution as startup_solution, s.founder,
             s.technology as startup_tech
      FROM pilots p
      JOIN challenges c ON p.challenge_id = c.id
      JOIN startups s ON p.startup_id = s.id
      ORDER BY p.id ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pilots/:id', async (req, res) => {
  try {
    const row = await dbGet(`
      SELECT p.*,
             c.title as challenge_title,
             s.name as startup_name, s.solution as startup_solution, s.founder
      FROM pilots p
      JOIN challenges c ON p.challenge_id = c.id
      JOIN startups s ON p.startup_id = s.id
      WHERE p.id = ?
    `, [req.params.id]);
    if (!row) return res.status(404).json({ error: "Pilot not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/pilots/:id/milestone', async (req, res) => {
  try {
    const { milestoneNumber, status } = req.body;
    if (!milestoneNumber || !status) {
      return res.status(400).json({ error: "milestoneNumber and status required" });
    }

    const field = `milestone${milestoneNumber}_status`;
    const allowedFields = ['milestone1_status', 'milestone2_status', 'milestone3_status', 'milestone4_status'];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ error: "Invalid milestone number" });
    }

    await dbRun(`UPDATE pilots SET ${field} = ? WHERE id = ?`, [status, req.params.id]);

    // Check if all milestones completed
    const pilot = await dbGet("SELECT * FROM pilots WHERE id = ?", [req.params.id]);
    if (
      pilot.milestone1_status === 'Completed' &&
      pilot.milestone2_status === 'Completed' &&
      pilot.milestone3_status === 'Completed' &&
      pilot.milestone4_status === 'Completed'
    ) {
      await dbRun("UPDATE pilots SET status = 'Completed' WHERE id = ?", [req.params.id]);
    }

    await dbRun(`
      INSERT INTO notifications (title, message, type)
      VALUES (?, ?, ?)
    `, [
      `Pilot #${req.params.id} Milestone Updated`,
      `Milestone ${milestoneNumber} marked as ${status}.`,
      'pilot'
    ]);

    res.json({ message: "Milestone status updated", milestoneNumber, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 7. PERFORMANCE & PILOT VALIDATION
// ----------------------------------------------------
app.get('/api/performance', async (req, res) => {
  try {
    const rows = await dbAll(`
      SELECT pr.*,
             p.objective as pilot_objective, p.department, p.status as pilot_status,
             c.title as challenge_title,
             s.name as startup_name, s.solution as startup_solution
      FROM performance_reports pr
      JOIN pilots p ON pr.pilot_id = p.id
      JOIN challenges c ON p.challenge_id = c.id
      JOIN startups s ON p.startup_id = s.id
      ORDER BY pr.id ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/performance/:pilotId/validate', async (req, res) => {
  try {
    const { action, expertComments, govtFeedback } = req.body;
    // action: 'Approve Pilot' | 'Request Improvement' | 'Reject Pilot'
    if (!action) return res.status(400).json({ error: "Action is required." });

    let validationStatus = 'Validated';
    let overallStatus = 'TARGET ACHIEVED';
    if (action === 'Approve Pilot') {
      validationStatus = 'Pilot Successfully Validated';
      overallStatus = 'TARGET ACHIEVED';
    } else if (action === 'Request Improvement') {
      validationStatus = 'Improvement Requested';
      overallStatus = 'NEEDS IMPROVEMENT';
    } else {
      validationStatus = 'Rejected';
      overallStatus = 'REJECTED';
    }

    await dbRun(`
      UPDATE performance_reports SET
        validation_status = ?,
        overall_status = ?,
        expert_comments = COALESCE(?, expert_comments),
        govt_feedback = COALESCE(?, govt_feedback),
        updated_at = CURRENT_TIMESTAMP
      WHERE pilot_id = ?
    `, [validationStatus, overallStatus, expertComments, govtFeedback, req.params.pilotId]);

    // Check procurement decision record
    if (action === 'Approve Pilot') {
      const pilot = await dbGet("SELECT * FROM pilots WHERE id = ?", [req.params.pilotId]);
      if (pilot) {
        const proc = await dbGet("SELECT id FROM procurement_decisions WHERE pilot_id = ?", [req.params.pilotId]);
        if (!proc) {
          await dbRun(`
            INSERT INTO procurement_decisions (
              pilot_id, startup_id, challenge_id, pilot_cost, pilot_result,
              kpi_achievement, expert_evaluation, validation_result, status,
              decision_date, gfr_rule
            ) VALUES (?, ?, ?, ?, 'Pilot Successfully Validated in Field',
              'All KPIs Achieved or Exceeded', 'Approved by Expert Committee',
              'Certified by National Water Academy', 'Under Procurement Review',
              '2026-09-27', 'Rule 149 / Special Exemption for Proven Pilot Solution'
            )
          `, [pilot.id, pilot.startup_id, pilot.challenge_id, pilot.budget]);
        }
      }
    }

    await dbRun(`
      INSERT INTO notifications (title, message, type)
      VALUES (?, ?, ?)
    `, [
      `Pilot #${req.params.pilotId} Validation: ${action}`,
      `Validation decision recorded: ${validationStatus}. Ready for procurement review.`,
      'performance'
    ]);

    res.json({ message: "Validation updated successfully", validationStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 8. PROCUREMENT DECISION
// ----------------------------------------------------
app.get('/api/procurement', async (req, res) => {
  try {
    const rows = await dbAll(`
      SELECT pd.*,
             c.title as challenge_title, c.department,
             s.name as startup_name, s.solution as startup_solution, s.founder,
             s.dpiit_number
      FROM procurement_decisions pd
      JOIN challenges c ON pd.challenge_id = c.id
      JOIN startups s ON pd.startup_id = s.id
      ORDER BY pd.id ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/procurement/:id/decision', async (req, res) => {
  try {
    const { action, notes } = req.body;
    // action: 'Proceed to Procurement' | 'Request Improvement' | 'Do Not Proceed'
    if (!action) return res.status(400).json({ error: "action is required" });

    let newStatus = 'Under Procurement Review';
    if (action === 'Proceed to Procurement') {
      newStatus = 'PROCUREMENT APPROVED';
    } else if (action === 'Request Improvement') {
      newStatus = 'REVISION REQUESTED';
    } else {
      newStatus = 'REJECTED';
    }

    await dbRun(`
      UPDATE procurement_decisions SET
        status = ?,
        decision_notes = COALESCE(?, decision_notes),
        decision_date = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newStatus, notes, req.params.id]);

    // If approved, ensure scale-up record exists
    if (action === 'Proceed to Procurement') {
      const proc = await dbGet("SELECT * FROM procurement_decisions WHERE id = ?", [req.params.id]);
      const startup = await dbGet("SELECT name FROM startups WHERE id = ?", [proc.startup_id]);
      const challenge = await dbGet("SELECT title FROM challenges WHERE id = ?", [proc.challenge_id]);

      const existingScale = await dbGet("SELECT id FROM scaled_solutions WHERE procurement_id = ?", [req.params.id]);
      if (!existingScale) {
        await dbRun(`
          INSERT INTO scaled_solutions (
            procurement_id, startup_id, startup_name, challenge_title,
            current_departments, scale_departments, scale_districts,
            total_deployments, status
          ) VALUES (?, ?, ?, ?, 1, 1, 1, 1, 'READY FOR SCALE-UP')
        `, [proc.id, proc.startup_id, startup.name, challenge.title]);
      } else {
        await dbRun("UPDATE scaled_solutions SET status = 'READY FOR SCALE-UP' WHERE id = ?", [existingScale.id]);
      }

      await dbRun(`
        INSERT INTO notifications (title, message, type)
        VALUES (?, ?, ?)
      `, [
        "Procurement Approved!",
        `Procurement sanctioned under GFR Rule 149 for ${startup ? startup.name : 'Startup'}. Solution is now ready for scale-up.`,
        'procurement'
      ]);
    }

    res.json({ message: "Procurement decision recorded", status: newStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 9. MILESTONE PAYMENTS
// ----------------------------------------------------
app.get('/api/payments', async (req, res) => {
  try {
    const rows = await dbAll(`
      SELECT mp.*,
             p.department,
             s.name as startup_name,
             c.title as challenge_title
      FROM milestone_payments mp
      JOIN pilots p ON mp.pilot_id = p.id
      JOIN challenges c ON p.challenge_id = c.id
      JOIN startups s ON p.startup_id = s.id
      ORDER BY mp.pilot_id, mp.milestone_number
    `);

    // Calculate totals
    const totalContractValue = rows.reduce((sum, r) => sum + r.amount, 0);
    const paidAmount = rows.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0);
    const pendingAmount = totalContractValue - paidAmount;

    res.json({
      payments: rows,
      summary: {
        totalContractValue,
        paidAmount,
        pendingAmount
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payments/:id/pay', async (req, res) => {
  try {
    const payment = await dbGet("SELECT * FROM milestone_payments WHERE id = ?", [req.params.id]);
    if (!payment) return res.status(404).json({ error: "Payment record not found" });

    const ref = `PFMS-TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    await dbRun(`
      UPDATE milestone_payments SET
        status = 'Paid',
        paid_date = ?,
        transaction_ref = ?
      WHERE id = ?
    `, [today, ref, req.params.id]);

    await dbRun(`
      INSERT INTO notifications (title, message, type)
      VALUES (?, ?, ?)
    `, [
      "Milestone Payment Disbursed (PFMS Demo)",
      `Payment of ₹${payment.amount.toLocaleString('en-IN')} released for ${payment.title}. Ref: ${ref}`,
      'payment'
    ]);

    res.json({ message: "Payment processed successfully", transactionRef: ref, status: 'Paid' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 10. SCALE-UP
// ----------------------------------------------------
app.get('/api/scale', async (req, res) => {
  try {
    const rows = await dbAll("SELECT * FROM scaled_solutions ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scale/:id', async (req, res) => {
  try {
    const { scale_departments, scale_districts, total_deployments } = req.body;
    const depts = parseInt(scale_departments) || 5;
    const dists = parseInt(scale_districts) || 20;
    const total = parseInt(total_deployments) || (depts * dists);

    await dbRun(`
      UPDATE scaled_solutions SET
        scale_departments = ?,
        scale_districts = ?,
        total_deployments = ?,
        status = 'SOLUTION SCALED',
        scale_date = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [depts, dists, total, req.params.id]);

    const scale = await dbGet("SELECT * FROM scaled_solutions WHERE id = ?", [req.params.id]);

    await dbRun(`
      INSERT INTO notifications (title, message, type)
      VALUES (?, ?, ?)
    `, [
      `Solution Scaled: ${scale ? scale.startup_name : 'Startup'}`,
      `Successfully scaled to ${depts} Departments and ${dists} Districts (${total} deployments).`,
      'scale'
    ]);

    res.json({
      message: "Solution scaled successfully",
      status: "SOLUTION SCALED",
      scale_departments: depts,
      scale_districts: dists,
      total_deployments: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 11. NOTIFICATIONS
// ----------------------------------------------------
app.get('/api/notifications', async (req, res) => {
  try {
    const rows = await dbAll("SELECT * FROM notifications ORDER BY id DESC LIMIT 20");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    await dbRun("UPDATE notifications SET is_read = 1 WHERE id = ?", [req.params.id]);
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 12. DOCUMENTS
// ----------------------------------------------------
app.get('/api/documents', async (req, res) => {
  try {
    const rows = await dbAll("SELECT * FROM documents ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 13. GLOBAL SEARCH
// ----------------------------------------------------
app.get('/api/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim().toLowerCase();
    if (!q) return res.json({ challenges: [], startups: [], pilots: [], documents: [] });

    const challenges = await dbAll(
      "SELECT id, title, department, status, stage FROM challenges WHERE lower(title) LIKE ? OR lower(department) LIKE ? OR lower(problem_description) LIKE ?",
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );

    const startups = await dbAll(
      "SELECT id, name, solution, industry, technology, years_experience FROM startups WHERE lower(name) LIKE ? OR lower(solution) LIKE ? OR lower(technology) LIKE ?",
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );

    const pilots = await dbAll(
      "SELECT p.id, p.department, p.status, c.title as challenge_title, s.name as startup_name FROM pilots p JOIN challenges c ON p.challenge_id = c.id JOIN startups s ON p.startup_id = s.id WHERE lower(p.department) LIKE ? OR lower(c.title) LIKE ? OR lower(s.name) LIKE ?",
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );

    const documents = await dbAll(
      "SELECT id, title, category, file_name FROM documents WHERE lower(title) LIKE ? OR lower(category) LIKE ? OR lower(file_name) LIKE ?",
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );

    res.json({ challenges, startups, pilots, documents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 14. RESET DEMO DATA
// ----------------------------------------------------
app.post('/api/reset', async (req, res) => {
  try {
    const db = getDatabase();
    await seedData(db);
    db.close();
    res.json({ message: "Database successfully reset to ProcureFlow initial state." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`ProcureFlow API Server running on http://localhost:${PORT}`);
});
