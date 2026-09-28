/**
 * Procure Government Portal (Prototype) — Client-Side Mock API Interceptor for Vercel Deployments
 * Transparently falls back to pre-seeded localStorage dataset when running on Vercel or when backend is unreachable.
 */

const SEED_DATA = {
  challenges: [
    {
      id: 1,
      title: "Smart Waste Collection & Monitoring",
      department: "Municipal Administration",
      problem_description: "Optimizing urban waste collection logistics and monitoring bin fill levels in real time across Ward 12.",
      expected_outcome: "Reduction of route travel time, dynamic route generation, and zero uncollected overflow incidents.",
      required_technology: "IoT Sensors, Route Optimization, Edge Computing",
      budget_range: "₹15,00,000 - ₹25,00,000",
      pilot_duration: "3 Months",
      eligibility_requirements: "DPIIT recognized, min 2 years experience in IoT/Urban tech",
      expected_kpis: "30% response time reduction, 95% bin overflow prevention",
      submission_deadline: "2026-11-15",
      status: "Open",
      stage: "Startup Discovery",
      applications_count: 3,
      created_at: "2026-09-20"
    },
    {
      id: 2,
      title: "Automated School Attendance Verification",
      department: "School Education Department",
      problem_description: "Automated facial recognition & edge computer vision for multi-student attendance logging without bottlenecks in 50 government schools.",
      expected_outcome: "Elimination of manual paper registers, tamper-proof audit trails, and automatic absentee alerts.",
      required_technology: "Computer Vision, Edge ML, Cloud Sync",
      budget_range: "₹20,00,000 - ₹35,00,000",
      pilot_duration: "3 Months",
      eligibility_requirements: "DPIIT recognized, STQC / DPDP compliance certified",
      expected_kpis: "99% attendance capture under 2 seconds/student",
      submission_deadline: "2026-11-20",
      status: "Evaluation",
      stage: "Expert Evaluation",
      applications_count: 2,
      created_at: "2026-09-22"
    },
    {
      id: 3,
      title: "AI-Based Water Leakage Detection",
      department: "Public Works Department",
      problem_description: "Early acoustic sensor detection of subterranean pipeline leaks in municipal feeder lines.",
      expected_outcome: "Pinpoint leaks within 5m radius and stop non-revenue water wastage.",
      required_technology: "IoT Sensors, Acoustic Telemetry, Machine Learning",
      budget_range: "₹30,00,000 - ₹50,00,000",
      pilot_duration: "3 Months",
      eligibility_requirements: "DPIIT recognized, min 2 years experience in utility sensing",
      expected_kpis: "90% detection accuracy, response time < 30 mins",
      submission_deadline: "2026-11-30",
      status: "Pilot",
      stage: "Controlled Field Pilot",
      applications_count: 2,
      created_at: "2026-09-24"
    },
    {
      id: 4,
      title: "Real-Time Industrial Effluent Monitoring",
      department: "Pollution Control Board",
      problem_description: "Continuous BOD/COD and heavy metal spectrometry telemetry at industrial drainage discharge gates.",
      expected_outcome: "Instant notification of toxic effluent spills directly to pollution control enforcement officials.",
      required_technology: "Spectrometry, IoT Telemetry, Cloud Analytics",
      budget_range: "₹25,00,000 - ₹40,00,000",
      pilot_duration: "4 Months",
      eligibility_requirements: "DPIIT recognized, CPCB/SPCB approved sensor calibration",
      expected_kpis: "98% sensor uptime, zero false alarm calibration",
      submission_deadline: "2026-12-05",
      status: "Procurement Review",
      stage: "Procurement Sanction",
      applications_count: 1,
      created_at: "2026-09-25"
    },
    {
      id: 5,
      title: "Automated Pothole Detection & Road Quality Mapping",
      department: "Urban Development Department",
      problem_description: "Dashcam and smartphone accelerometer survey mapping of asphalt road distress and pothole severity across arterial ring roads.",
      expected_outcome: "Prioritized resurfacing work orders and rapid repair allocation before monsoon damage.",
      required_technology: "Edge Computer Vision, Accelerometer, GIS Mapping",
      budget_range: "₹18,00,000 - ₹28,00,000",
      pilot_duration: "2 Months",
      eligibility_requirements: "DPIIT recognized, experience in road audit telemetry",
      expected_kpis: "92% pothole classification accuracy, 48-hour repair turnaround",
      submission_deadline: "2026-10-31",
      status: "Scaled",
      stage: "Statewide Scale-Up",
      applications_count: 3,
      created_at: "2026-09-26"
    }
  ],

  startups: [
    {
      id: 1,
      name: "WaterSense",
      founder: "Vikramaditya Roy & Sneha Nair",
      solution: "Smart Water Leakage Detection",
      industry: "Water & Sanitation",
      technology: "IoT / ML / Acoustic Telemetry",
      years_experience: 4,
      dpiit_recognized: 1,
      dpiit_number: "DIPP78214",
      team_size: 18,
      description: "WaterSense builds acoustic pipe telemetry and edge ML sensors that pinpoint subsurface water leakages in municipal pipelines before surfacing.",
      previous_projects: "Bengaluru Smart City pilot (15km pipeline), Hyderabad HMWSSB trial (identified 42 undetected micro-leaks).",
      is_eligible: 1,
      matchScore: 92,
      location: "Bengaluru, Karnataka"
    },
    {
      id: 2,
      name: "EcoTrack",
      founder: "Ananya Sharma & Rahul Verma",
      solution: "AI Waste Monitoring & Route Optimization",
      industry: "Urban Infrastructure",
      technology: "AI / IoT / GIS Analytics",
      years_experience: 3,
      dpiit_recognized: 1,
      dpiit_number: "DIPP54129",
      team_size: 14,
      description: "EcoTrack provides optical ultrasonic bin sensors and automated algorithmic routing for municipal garbage trucks to slash fuel burn and stop bin overflows.",
      previous_projects: "Indore Municipal Corporation pilot (200 bins), Navi Mumbai waste route optimization study.",
      is_eligible: 1,
      matchScore: 88,
      location: "Indore, Madhya Pradesh"
    },
    {
      id: 3,
      name: "EduVision",
      founder: "Dr. Rajesh Iyer & Priya Menon",
      solution: "AI Attendance Analytics & Safety Monitoring",
      industry: "Education Technology",
      technology: "AI / Computer Vision / Edge TPU",
      years_experience: 2,
      dpiit_recognized: 1,
      dpiit_number: "DIPP89211",
      team_size: 11,
      description: "EduVision deploys tamper-proof computer vision edge cameras that automatically compute classroom attendance in under 2 seconds without bottlenecks.",
      previous_projects: "12 Kendriya Vidyalayas trial run, Pune district pilot (3,400 students recorded daily).",
      is_eligible: 1,
      matchScore: 85,
      location: "Pune, Maharashtra"
    },
    {
      id: 4,
      name: "AquaTech Labs",
      founder: "Karthik Swaminathan",
      solution: "Acoustic Pipeline Sensor Mesh",
      industry: "Water & Utilities",
      technology: "IoT / Acoustics / DSP",
      years_experience: 3,
      dpiit_recognized: 1,
      dpiit_number: "DIPP62310",
      team_size: 9,
      description: "AquaTech Labs manufactures clamp-on ultrasonic vibration sensors for municipal water distribution networks.",
      previous_projects: "Pilot with Pune Cantonment Board water main line.",
      is_eligible: 1,
      matchScore: 78,
      location: "Chennai, Tamil Nadu"
    },
    {
      id: 5,
      name: "PipeAI Innovations",
      founder: "Tanvi Deshmukh & Kunal Joshi",
      solution: "Autonomous Pipe Crawler Vision",
      industry: "Robotics & Smart Cities",
      technology: "Robotics / Computer Vision / Edge AI",
      years_experience: 2,
      dpiit_recognized: 1,
      dpiit_number: "DIPP41108",
      team_size: 8,
      description: "PipeAI produces tethered miniature autonomous robotic crawlers that navigate 150mm to 1200mm pipes to visually map structural fractures.",
      previous_projects: "Surat Smart City stormwater drain inspection contract.",
      is_eligible: 1,
      matchScore: 74,
      location: "Ahmedabad, Gujarat"
    },
    {
      id: 6,
      name: "CivicPulse Insights",
      founder: "Deepak Chawla & Meera Bansal",
      solution: "NLP Citizen Grievance Classifier",
      industry: "GovTech / Citizen Services",
      technology: "NLP / LLM / Vector Search",
      years_experience: 3,
      dpiit_recognized: 1,
      dpiit_number: "DIPP91122",
      team_size: 15,
      description: "CivicPulse analyzes citizen feedback across 14 official Indian languages, automatically assigning priority and routing to designated administrative divisions.",
      previous_projects: "Delhi CM Helpline automated ticket taxonomy pilot, Uttarakhand CM Portal.",
      is_eligible: 1,
      matchScore: 70,
      location: "New Delhi, Delhi"
    },
    {
      id: 7,
      name: "GreenWatts Grid",
      founder: "Sameer Kulkarni & Divya Hegde",
      solution: "Distributed Solar Peak Shaving & Storage",
      industry: "Renewable Energy",
      technology: "CleanTech / ML / Embedded IoT",
      years_experience: 5,
      dpiit_recognized: 1,
      dpiit_number: "DIPP33901",
      team_size: 22,
      description: "GreenWatts builds bidirectional grid-interactive inverters with predictive AI load forecasting to cut peak demand surcharges for government office complexes.",
      previous_projects: "Maharashtra State Secretariat (Mantralaya) energy storage pilot, BESCOM feeder pilot.",
      is_eligible: 1,
      matchScore: 68,
      location: "Bengaluru, Karnataka"
    },
    {
      id: 8,
      name: "MedDrishti Telemedicine",
      founder: "Dr. Vikram Sethi & Dr. Pooja Rao",
      solution: "Portable Battery-Powered Diagnostic Kiosk",
      industry: "Healthcare & MedTech",
      technology: "MedTech / Edge AI / Telemetry",
      years_experience: 4,
      dpiit_recognized: 1,
      dpiit_number: "DIPP77419",
      team_size: 19,
      description: "MedDrishti manufactures solar and battery-backed point-of-care diagnostic backpacks for primary health sub-centres with offline ECG and blood panel testing.",
      previous_projects: "Rajasthan National Health Mission rural sub-centres (45 clinics).",
      is_eligible: 1,
      matchScore: 65,
      location: "Jaipur, Rajasthan"
    }
  ],

  applications: [
    {
      id: 1,
      challenge_id: 3,
      challenge_title: "AI-Based Water Leakage Detection",
      department: "Public Works Department",
      startup_id: 1,
      startup_name: "WaterSense",
      dpiit_number: "DIPP78214",
      status: "Eligible",
      proposal_summary: "Deployment of 45 acoustic edge sensors across 12km feeder line with automated telemetry alerts.",
      proposed_budget: "₹38,50,000",
      proposed_timeline: "90 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 84.9,
      submitted_at: "2026-09-24"
    },
    {
      id: 2,
      challenge_id: 1,
      challenge_title: "Smart Waste Collection & Monitoring",
      department: "Municipal Administration",
      startup_id: 2,
      startup_name: "EcoTrack",
      dpiit_number: "DIPP54129",
      status: "Under Review",
      proposal_summary: "Automated ultrasonic fill-level sensors with daily dynamic collection truck dispatch optimization.",
      proposed_budget: "₹18,00,000",
      proposed_timeline: "60 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: null,
      submitted_at: "2026-09-23"
    }
  ],

  evaluations: [
    {
      id: 1,
      application_id: 1,
      expert_name: "Dr. K. S. Sharma",
      technical_score: 85,
      innovation_score: 90,
      feasibility_score: 82,
      cost_score: 78,
      team_score: 88,
      total_score: 84.9,
      comments: "WaterSense provides a validated acoustic edge detection algorithm with minimal false positive readings. Prototype is ready for municipal field pilot.",
      decision: "Approved for Pilot",
      evaluated_at: "2026-09-25"
    }
  ],

  pilots: [
    {
      id: 1,
      challenge_id: 3,
      challenge_title: "AI-Based Water Leakage Detection",
      department: "Public Works Department",
      startup_id: 1,
      startup_name: "WaterSense",
      status: "In Progress",
      start_date: "2026-08-01",
      milestones_completed: 3,
      kpi_achieved: "94.2% accuracy",
      milestone1_title: "Initial Sensor Mesh Deployment",
      milestone1_status: "Completed",
      milestone2_title: "Acoustic Frequency Calibration",
      milestone2_status: "Completed",
      milestone3_title: "Ground-Truth Leak Detection Testing",
      milestone3_status: "Completed",
      milestone4_title: "Third-Party Benchmark Validation",
      milestone4_status: "In Progress"
    }
  ],

  performance: [
    {
      id: 1,
      pilot_id: 1,
      startup_name: "WaterSense",
      challenge_title: "AI-Based Water Leakage Detection",
      accuracy_kpi: "94.2%",
      response_kpi: "22 min",
      validation_status: "Validated",
      testing_agency: "National Water Academy & CPWD",
      expert_comments: "Ground truth testing confirmed acoustic alert accuracy exceeded the 90% tender specification.",
      govt_feedback: "Verified by Executive Engineer field team. Recommended for commercial procurement."
    }
  ],

  procurement: [
    {
      id: 1,
      pilot_id: 1,
      startup_name: "WaterSense",
      challenge_title: "AI-Based Water Leakage Detection",
      department: "Public Works Department",
      pilot_result: "94.2% KPI Achievement",
      evaluation_score: 84.9,
      decision: "Approved",
      decision_notes: "Pilot performance validated by National Water Academy. Direct procurement approved under GFR Rule 149 relaxation."
    }
  ],

  scale: [
    {
      id: 1,
      startup_name: "WaterSense",
      solution_name: "Smart Water Leakage Detection",
      department: "Public Works Department",
      scale_departments: 5,
      scale_districts: 20,
      total_deployments: 25,
      status: "READY FOR SCALE-UP"
    }
  ],

  documents: [
    { id: 1, title: "Municipal Water Leakage Problem Specification", category: "Problem Statement", file_name: "PWD-CHAL-2026-03.pdf", file_size: "1.4 MB", upload_date: "2026-09-20", status: "Active" },
    { id: 2, title: "DPIIT Startup Recognition Certificate — WaterSense", category: "Startup Registration", file_name: "DIPP78214-CERT.pdf", file_size: "620 KB", upload_date: "2026-09-21", status: "Verified" },
    { id: 3, title: "Field Pilot Technical Proposal — WaterSense", category: "Technical Proposal", file_name: "WaterSense-Proposal-v2.pdf", file_size: "3.8 MB", upload_date: "2026-09-24", status: "Approved" },
    { id: 4, title: "Controlled Field Pilot Agreement (3 Months)", category: "Pilot Agreement", file_name: "Pilot-Agreement-PWD-WS.pdf", file_size: "2.1 MB", upload_date: "2026-08-01", status: "Signed" },
    { id: 5, title: "National Water Academy Third-Party Audit Report", category: "Validation Report", file_name: "NWA-Validation-Report-2026.pdf", file_size: "4.5 MB", upload_date: "2026-09-26", status: "Certified" },
    { id: 6, title: "Procurement Sanction Order (GFR Rule 149 Relaxation)", category: "Procurement Decision", file_name: "Procurement-Sanction-0926.pdf", file_size: "1.1 MB", upload_date: "2026-09-27", status: "Sanctioned" }
  ],

  notifications: [
    { id: 1, title: "New Application Received", message: "WaterSense submitted proposal for AI Water Leakage Detection.", is_read: 0 },
    { id: 2, title: "Pilot Ready for Review", message: "WaterSense completed Milestone 3 validation tests.", is_read: 0 },
    { id: 3, title: "Procurement Sanction Ready", message: "Audit report received. Sanction order pending signature.", is_read: 0 }
  ]
};

// Initialize localStorage with seed data if not present
function getLocalStore() {
  const stored = localStorage.getItem('procuresetu_data');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn("Resetting corrupt store");
    }
  }
  localStorage.setItem('procuresetu_data', JSON.stringify(SEED_DATA));
  return JSON.parse(JSON.stringify(SEED_DATA));
}

function saveLocalStore(data) {
  localStorage.setItem('procuresetu_data', JSON.stringify(data));
}

// Monkey-patch window.fetch to provide transparent Vercel fallback
const originalFetch = window.fetch;

window.fetch = async function (resource, options = {}) {
  const url = typeof resource === 'string' ? resource : resource.url;

  // Only handle /api calls
  if (url && url.startsWith('/api')) {
    try {
      const response = await originalFetch(resource, options);
      // If server responded cleanly, return standard response
      if (response.ok || (response.status >= 200 && response.status < 400)) {
        return response;
      }
      // If 404 or 502/503 (e.g. backend not present on static Vercel), fall through to mock
    } catch (err) {
      // Network failure / server not running: fall through to mock
    }

    // Handle with local mock store
    const store = getLocalStore();
    const method = (options.method || 'GET').toUpperCase();
    const parsedUrl = new URL(url, window.location.origin);
    const pathname = parsedUrl.pathname;

    const mockResponse = (data, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    // 1. Challenges
    if (pathname === '/api/challenges') {
      if (method === 'GET') {
        return mockResponse(store.challenges);
      }
      if (method === 'POST') {
        const body = JSON.parse(options.body || '{}');
        const newChallenge = {
          id: store.challenges.length + 1,
          ...body,
          stage: 'Startup Discovery',
          applications_count: 0,
          created_at: new Date().toISOString()
        };
        store.challenges.unshift(newChallenge);
        saveLocalStore(store);
        return mockResponse(newChallenge, 201);
      }
    }

    // 2. Startups
    if (pathname === '/api/startups') {
      return mockResponse(store.startups);
    }

    // 3. Applications
    if (pathname === '/api/applications') {
      if (method === 'GET') {
        return mockResponse(store.applications);
      }
      if (method === 'POST') {
        const body = JSON.parse(options.body || '{}');
        const ch = store.challenges.find(c => c.id === body.challenge_id) || store.challenges[0];
        const st = store.startups.find(s => s.id === body.startup_id) || store.startups[0];
        const newApp = {
          id: store.applications.length + 1,
          challenge_id: ch.id,
          challenge_title: ch.title,
          department: ch.department,
          startup_id: st.id,
          startup_name: st.name,
          dpiit_number: st.dpiit_number,
          status: 'Eligible',
          proposal_summary: body.proposal_summary,
          proposed_budget: body.proposed_budget || '₹35,00,000',
          proposed_timeline: body.proposed_timeline || '90 Days',
          checklist_dpiit: 1,
          checklist_documents: 1,
          checklist_technology: 1,
          checklist_experience: 1,
          checklist_compliance: 1,
          submitted_at: new Date().toISOString()
        };
        store.applications.unshift(newApp);
        saveLocalStore(store);
        return mockResponse(newApp, 201);
      }
    }

    // Checklist patch
    if (pathname.startsWith('/api/applications/') && pathname.endsWith('/checklist')) {
      const appId = parseInt(pathname.split('/')[3]);
      const body = JSON.parse(options.body || '{}');
      const app = store.applications.find(a => a.id === appId);
      if (app) {
        Object.assign(app, body);
        saveLocalStore(store);
        return mockResponse({ success: true, isEligible: true });
      }
    }

    // 4. Evaluations
    if (pathname === '/api/evaluations') {
      if (method === 'GET') {
        return mockResponse(store.evaluations);
      }
      if (method === 'POST') {
        const body = JSON.parse(options.body || '{}');
        const newEval = {
          id: store.evaluations.length + 1,
          ...body,
          total_score: Number((
            (body.technical_score * 0.3) +
            (body.innovation_score * 0.25) +
            (body.feasibility_score * 0.2) +
            (body.cost_score * 0.15) +
            (body.team_score * 0.1)
          ).toFixed(1)),
          evaluated_at: new Date().toISOString()
        };
        store.evaluations.unshift(newEval);
        saveLocalStore(store);
        return mockResponse(newEval, 201);
      }
    }

    // 5. Pilots
    if (pathname === '/api/pilots') {
      return mockResponse(store.pilots);
    }

    if (pathname.startsWith('/api/pilots/') && pathname.endsWith('/milestone')) {
      const pilotId = parseInt(pathname.split('/')[3]);
      const body = JSON.parse(options.body || '{}');
      const pilot = store.pilots.find(p => p.id === pilotId);
      if (pilot) {
        pilot[`milestone${body.milestoneNumber}_status`] = body.status;
        saveLocalStore(store);
        return mockResponse({ success: true });
      }
    }

    // 6. Performance
    if (pathname === '/api/performance') {
      return mockResponse(store.performance);
    }

    if (pathname.startsWith('/api/performance/') && pathname.endsWith('/validate')) {
      return mockResponse({ success: true, validationStatus: 'Validated' });
    }

    // 7. Procurement
    if (pathname === '/api/procurement') {
      return mockResponse(store.procurement);
    }

    if (pathname.startsWith('/api/procurement/') && pathname.endsWith('/decision')) {
      const body = JSON.parse(options.body || '{}');
      const doc = store.procurement[0];
      if (doc) doc.decision = body.action === 'Proceed to Procurement' ? 'Approved' : body.action;
      saveLocalStore(store);
      return mockResponse({ success: true });
    }

    // 8. Scale
    if (pathname === '/api/scale') {
      return mockResponse(store.scale);
    }

    if (pathname.startsWith('/api/scale/')) {
      const body = JSON.parse(options.body || '{}');
      if (store.scale[0]) {
        store.scale[0].status = 'SOLUTION SCALED';
        Object.assign(store.scale[0], body);
        saveLocalStore(store);
      }
      return mockResponse(store.scale[0] || { status: 'SOLUTION SCALED' });
    }

    // 9. Documents
    if (pathname === '/api/documents') {
      return mockResponse(store.documents);
    }

    // 10. Notifications
    if (pathname === '/api/notifications') {
      return mockResponse(store.notifications);
    }

    // 11. Search
    if (pathname === '/api/search') {
      const q = (parsedUrl.searchParams.get('q') || '').toLowerCase();
      const filteredCh = store.challenges.filter(c => c.title.toLowerCase().includes(q) || c.department.toLowerCase().includes(q));
      const filteredSt = store.startups.filter(s => s.name.toLowerCase().includes(q) || s.solution.toLowerCase().includes(q));
      return mockResponse({ challenges: filteredCh, startups: filteredSt, pilots: [] });
    }

    // 12. Reset
    if (pathname === '/api/reset') {
      localStorage.removeItem('procuresetu_data');
      return mockResponse({ success: true, message: "Reset to initial state." });
    }

    return mockResponse({ message: "OK" });
  }

  return originalFetch(resource, options);
};

export default {};
