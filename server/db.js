import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'startupbridge.db');

export function getDatabase() {
  return new sqlite3.Database(DB_PATH);
}

export function initDatabase() {
  return new Promise((resolve, reject) => {
    const db = getDatabase();

    db.serialize(() => {
      // Create tables
      db.run(`
        CREATE TABLE IF NOT EXISTS challenges (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          department TEXT NOT NULL,
          problem_description TEXT NOT NULL,
          expected_outcome TEXT NOT NULL,
          required_technology TEXT NOT NULL,
          budget_range TEXT NOT NULL,
          pilot_duration TEXT NOT NULL,
          eligibility_requirements TEXT NOT NULL,
          expected_kpis TEXT NOT NULL,
          submission_deadline TEXT NOT NULL,
          status TEXT NOT NULL,
          stage TEXT NOT NULL,
          applications_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS startups (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          founder TEXT NOT NULL,
          solution TEXT NOT NULL,
          industry TEXT NOT NULL,
          technology TEXT NOT NULL,
          years_experience INTEGER NOT NULL,
          dpiit_recognized INTEGER DEFAULT 1,
          dpiit_number TEXT NOT NULL,
          team_size INTEGER NOT NULL,
          description TEXT NOT NULL,
          previous_projects TEXT NOT NULL,
          is_eligible INTEGER DEFAULT 1,
          documents TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          challenge_id INTEGER NOT NULL,
          startup_id INTEGER NOT NULL,
          status TEXT NOT NULL,
          proposal_summary TEXT,
          proposed_budget TEXT,
          proposed_timeline TEXT,
          checklist_dpiit INTEGER DEFAULT 1,
          checklist_documents INTEGER DEFAULT 1,
          checklist_technology INTEGER DEFAULT 1,
          checklist_experience INTEGER DEFAULT 1,
          checklist_compliance INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (challenge_id) REFERENCES challenges (id),
          FOREIGN KEY (startup_id) REFERENCES startups (id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS evaluations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          application_id INTEGER NOT NULL,
          expert_name TEXT NOT NULL,
          technical_score REAL NOT NULL,
          innovation_score REAL NOT NULL,
          feasibility_score REAL NOT NULL,
          cost_score REAL NOT NULL,
          team_score REAL NOT NULL,
          total_score REAL NOT NULL,
          comments TEXT,
          decision TEXT NOT NULL,
          evaluated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (application_id) REFERENCES applications (id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS pilots (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          application_id INTEGER NOT NULL,
          challenge_id INTEGER NOT NULL,
          startup_id INTEGER NOT NULL,
          department TEXT NOT NULL,
          objective TEXT NOT NULL,
          duration TEXT NOT NULL,
          budget TEXT NOT NULL,
          start_date TEXT NOT NULL,
          end_date TEXT NOT NULL,
          milestone1_title TEXT NOT NULL,
          milestone1_status TEXT NOT NULL,
          milestone2_title TEXT NOT NULL,
          milestone2_status TEXT NOT NULL,
          milestone3_title TEXT NOT NULL,
          milestone3_status TEXT NOT NULL,
          milestone4_title TEXT NOT NULL,
          milestone4_status TEXT NOT NULL,
          status TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (application_id) REFERENCES applications (id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS performance_reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pilot_id INTEGER NOT NULL,
          metric1_name TEXT NOT NULL,
          metric1_target TEXT NOT NULL,
          metric1_actual TEXT NOT NULL,
          metric1_variance TEXT NOT NULL,
          metric1_status TEXT NOT NULL,
          metric2_name TEXT NOT NULL,
          metric2_target TEXT NOT NULL,
          metric2_actual TEXT NOT NULL,
          metric2_variance TEXT NOT NULL,
          metric2_status TEXT NOT NULL,
          metric3_name TEXT NOT NULL,
          metric3_target TEXT NOT NULL,
          metric3_actual TEXT NOT NULL,
          metric3_variance TEXT NOT NULL,
          metric3_status TEXT NOT NULL,
          overall_status TEXT NOT NULL,
          expert_comments TEXT,
          govt_feedback TEXT,
          validation_status TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (pilot_id) REFERENCES pilots (id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS procurement_decisions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pilot_id INTEGER NOT NULL,
          startup_id INTEGER NOT NULL,
          challenge_id INTEGER NOT NULL,
          pilot_cost TEXT NOT NULL,
          pilot_result TEXT NOT NULL,
          kpi_achievement TEXT NOT NULL,
          expert_evaluation TEXT NOT NULL,
          validation_result TEXT NOT NULL,
          status TEXT NOT NULL,
          decision_date TEXT,
          decision_notes TEXT,
          gfr_rule TEXT DEFAULT 'GFR Rule 149 / Special Pilot Exemption',
          FOREIGN KEY (pilot_id) REFERENCES pilots (id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS milestone_payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pilot_id INTEGER NOT NULL,
          milestone_number INTEGER NOT NULL,
          title TEXT NOT NULL,
          amount INTEGER NOT NULL,
          status TEXT NOT NULL,
          paid_date TEXT,
          transaction_ref TEXT,
          FOREIGN KEY (pilot_id) REFERENCES pilots (id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS scaled_solutions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          procurement_id INTEGER NOT NULL,
          startup_id INTEGER NOT NULL,
          startup_name TEXT NOT NULL,
          challenge_title TEXT NOT NULL,
          current_departments INTEGER NOT NULL,
          scale_departments INTEGER NOT NULL,
          scale_districts INTEGER NOT NULL,
          total_deployments INTEGER NOT NULL,
          status TEXT NOT NULL,
          scale_date TEXT,
          FOREIGN KEY (procurement_id) REFERENCES procurement_decisions (id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          type TEXT NOT NULL,
          is_read INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS documents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          entity_type TEXT NOT NULL,
          entity_id INTEGER NOT NULL,
          file_name TEXT NOT NULL,
          file_size TEXT NOT NULL,
          upload_date TEXT NOT NULL,
          status TEXT NOT NULL
        )
      `, (err) => {
        if (err) {
          console.error("Database schema init error:", err);
          reject(err);
        } else {
          checkAndSeed(db).then(resolve).catch(reject);
        }
      });
    });
  });
}

function checkAndSeed(db) {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM challenges", (err, row) => {
      if (err) return reject(err);
      if (row.count === 0) {
        console.log("Seeding fresh demo data for StartupBridge...");
        seedData(db).then(resolve).catch(reject);
      } else {
        resolve();
      }
    });
  });
}

export function seedData(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Clear existing records
      db.run("DELETE FROM documents");
      db.run("DELETE FROM notifications");
      db.run("DELETE FROM scaled_solutions");
      db.run("DELETE FROM milestone_payments");
      db.run("DELETE FROM procurement_decisions");
      db.run("DELETE FROM performance_reports");
      db.run("DELETE FROM pilots");
      db.run("DELETE FROM evaluations");
      db.run("DELETE FROM applications");
      db.run("DELETE FROM startups");
      db.run("DELETE FROM challenges");

      // 1. Challenges
      const insertChallenge = db.prepare(`
        INSERT INTO challenges (
          id, title, department, problem_description, expected_outcome,
          required_technology, budget_range, pilot_duration, eligibility_requirements,
          expected_kpis, submission_deadline, status, stage, applications_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertChallenge.run(
        1,
        "Smart Waste Collection",
        "Municipal Administration",
        "Optimizing urban waste collection logistics and monitoring bin fill levels in real time across Ward 12.",
        "Reduction of route travel time, dynamic route generation, and zero uncollected overflow incidents.",
        "IoT Sensors, AI / Route Optimization, Edge Computing",
        "₹15,00,000 - ₹25,00,000",
        "3 Months",
        "DPIIT recognized, min 2 years experience in IoT/Urban tech",
        "30% response time reduction, 95% bin overflow prevention",
        "2026-11-15",
        "Open",
        "Startup Discovery",
        3
      );

      insertChallenge.run(
        2,
        "AI-Based School Attendance",
        "School Education",
        "Automated facial recognition & edge computer vision for multi-student attendance logging without bottlenecks in 50 government schools.",
        "Elimination of manual paper registers, tamper-proof audit trails, and automatic absentee alerts to parents.",
        "Computer Vision, AI / Edge ML, Cloud Sync",
        "₹20,00,000 - ₹35,00,000",
        "4 Months",
        "DPIIT recognized, compliant with DPDP Act 2023, 98%+ accuracy",
        "99% attendance capture speed (<2 sec/student), 99.5% face recognition accuracy",
        "2026-10-30",
        "Evaluation",
        "Expert Evaluation",
        4
      );

      insertChallenge.run(
        3,
        "Water Leakage Detection",
        "Public Works",
        "Early acoustic and ML sensor detection of underground pipeline leakages in main transmission lines to curb non-revenue water loss.",
        "Autonomous leak location alerts within 5 meters radius, preventing road cave-ins and saving 2M liters/day.",
        "IoT Sensors, Acoustic Telemetry, Machine Learning",
        "₹30,00,000 - ₹50,00,000",
        "3 Months",
        "DPIIT recognized, validated industrial pipe telemetry experience",
        "90% leak pinpoint accuracy, response notification under 30 mins",
        "2026-09-15",
        "Pilot",
        "Pilot",
        2
      );

      insertChallenge.run(
        4,
        "Citizen Grievance Analytics",
        "Urban Development",
        "Multilingual NLP parsing of citizen grievance petitions from portal, WhatsApp, and call center into actionable department tickets.",
        "Automated deduplication, sentiment prioritization, and SLA routing to appropriate junior engineers.",
        "Natural Language Processing (NLP), LLM / Categorization, Vector DB",
        "₹25,00,000 - ₹40,00,000",
        "3 Months",
        "DPIIT recognized startup with Indic language NLP corpus experience",
        "90% auto-classification accuracy, 50% reduction in resolution time",
        "2026-08-20",
        "Procurement Review",
        "Procurement Decision",
        2
      );

      insertChallenge.run(
        5,
        "Solar Grid Micro-Storage Optimizer",
        "Renewable Energy Department",
        "Smart grid load balancing algorithms for distributed rooftop solar plants across government administrative buildings.",
        "Maximized captive solar consumption, automated battery discharge dispatch during peak tariff periods.",
        "CleanTech IoT, ML Forecasting, SCADA Interface",
        "₹40,00,000 - ₹60,00,000",
        "6 Months",
        "DPIIT recognized, ISO 27001 compliant, min 3 years CleanTech experience",
        "18% peak electricity cost savings, zero grid tripping incidents",
        "2026-06-10",
        "Scaled",
        "Scale-Up",
        1
      );

      insertChallenge.run(
        6,
        "Decentralized Solar Cold Storage for Perishable Crops",
        "Department of Agriculture & Farmers Welfare",
        "Off-grid 5MT solar thermal battery cold storage units at rural primary agricultural produce collection centres.",
        "Slash post-harvest tomato and horticultural crop spoilage by 40% in remote farm clusters.",
        "Phase Change Materials, Solar Thermal, IoT Temperature Logging",
        "₹35,00,000 - ₹60,00,000",
        "4 Months",
        "DPIIT recognized, ICAR/NABARD validated pilot track record",
        "Continuous 4°C storage across 72-hour cloudy weather spells",
        "2026-12-10",
        "Open",
        "Startup Discovery",
        2
      );

      insertChallenge.run(
        7,
        "AI Point-of-Care Diagnostic Screen for Rural Health Sub-Centres",
        "National Health Mission",
        "Battery-powered handheld multi-vital analyzer screening anemia, ECG abnormalities, and vitals in offline primary health centers.",
        "Immediate specialist tele-triage referral for high-risk obstetric and cardiovascular patients.",
        "Edge AI Biosensors, Telemedicine, Low-Power Bluetooth",
        "₹28,00,000 - ₹45,00,000",
        "3 Months",
        "DPIIT recognized, CDSCO approved or ISO 13485 certified",
        "95% diagnostic concord with laboratory gold standards",
        "2026-11-28",
        "Evaluation",
        "Expert Evaluation",
        2
      );

      insertChallenge.run(
        8,
        "Autonomous Drone Surveillance for Forest Fire Early Warning",
        "Department of Environment & Forests",
        "Autonomous thermal-infrared long-range drone patrols over dry deciduous forest tracts to detect micro-smoke plumes.",
        "Alert fire ranger beat officers within 15 minutes of ignition to contain ground fires before crown burns.",
        "Autonomous UAVs, Thermal Infrared, Edge Computer Vision",
        "₹32,00,000 - ₹55,00,000",
        "3 Months",
        "DPIIT recognized, DGCA type-certified UAS manufacturer",
        "Detection of 0.5m embers from 300m altitude within 10 minutes",
        "2026-12-15",
        "Open",
        "Startup Discovery",
        1
      );

      insertChallenge.run(
        9,
        "Smart Urban Traffic Adaptive Signal Control",
        "Traffic Police & Transport Department",
        "AI-driven visual queue length calculation and dynamic green light duration adjustment at 24 busy metropolitan intersections.",
        "Reduce peak hour vehicular congestion delay by 25% and prioritize emergency corridor transits.",
        "Computer Vision, Edge Inference, Traffic Controller API",
        "₹30,00,000 - ₹48,00,000",
        "3 Months",
        "DPIIT recognized, proven intersection control hardware telemetry",
        "20% reduction in vehicle wait idling, zero controller desync incidents",
        "2026-12-20",
        "Open",
        "Startup Discovery",
        1
      );

      insertChallenge.run(
        10,
        "Groundwater Aquifer Depletion & Quality Telemetry Mesh",
        "Water Resources & Ground Water Authority",
        "Deep borewell hydro-acoustic probes continuously tracking subterranean water table drops and salinity ingress in over-exploited blocks.",
        "Digital dashboard warning of critical dry zones and contamination ingress before seasonal pump failure.",
        "Hydrostatic Level Sensors, Sub-GHz Mesh Telemetry, Cloud Analytics",
        "₹26,00,000 - ₹42,00,000",
        "4 Months",
        "DPIIT recognized, CGWB calibrated sensor instrumentation",
        "99% transmission reliability through subsurface depths up to 250m",
        "2026-12-25",
        "Evaluation",
        "Expert Evaluation",
        2
      );
      insertChallenge.finalize();

      // 2. Startups (8 startups)
      const insertStartup = db.prepare(`
        INSERT INTO startups (
          id, name, founder, solution, industry, technology, years_experience,
          dpiit_recognized, dpiit_number, team_size, description, previous_projects,
          is_eligible, documents
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertStartup.run(
        1,
        "WaterSense",
        "Vikramaditya Roy & Sneha Nair",
        "Smart Water Leakage Detection",
        "Water & Sanitation",
        "IoT / ML / Acoustic Telemetry",
        4,
        1,
        "DIPP78214",
        18,
        "WaterSense builds military-grade acoustic pipe telemetry and edge ML sensors that pinpoint subsurface water leakages in municipal pipelines before surfacing.",
        "Bengaluru Smart City pilot (15km pipeline), Hyderabad HMWSSB trial (identified 42 undetected micro-leaks).",
        1,
        "DPIIT Certificate, Audited Financials FY24-25, Patent IN-2023-4412, ISO 9001:2015"
      );

      insertStartup.run(
        2,
        "EcoTrack",
        "Ananya Sharma & Rahul Verma",
        "AI Waste Monitoring & Route Optimization",
        "Urban Infrastructure",
        "AI / IoT / GIS Analytics",
        3,
        1,
        "DIPP54129",
        14,
        "EcoTrack provides optical ultrasonic bin sensors and automated algorithmic routing for municipal garbage trucks to slash fuel burn and stop bin overflows.",
        "Indore Municipal Corporation pilot (200 bins), Navi Mumbai waste route optimization study.",
        1,
        "DPIIT Certificate, GeM Vendor Reg, CPCB Compliance Certificate"
      );

      insertStartup.run(
        3,
        "EduVision",
        "Dr. Rajesh Iyer & Priya Menon",
        "AI Attendance Analytics & Safety Monitoring",
        "Education Technology",
        "AI / Computer Vision / Edge TPU",
        2,
        1,
        "DIPP89211",
        11,
        "EduVision deploys tamper-proof, privacy-first computer vision edge cameras that automatically compute classroom attendance in under 2 seconds without touch.",
        "12 Kendriya Vidyalayas trial run, Pune district pilot (3,400 students recorded daily).",
        1,
        "DPIIT Certificate, DPDP Act 2023 Compliance Self-Audit, STQC Test Certificate"
      );

      insertStartup.run(
        4,
        "AquaTech Labs",
        "Karthik Swaminathan",
        "Acoustic Pipeline Sensor Mesh",
        "Water & Utilities",
        "IoT / Acoustics / DSP",
        3,
        1,
        "DIPP62310",
        9,
        "AquaTech Labs manufactures clamp-on ultrasonic vibration sensors for municipal water distribution networks.",
        "Pilot with Pune Cantonment Board water main line.",
        1,
        "DPIIT Certificate, NABL Calibration Reports"
      );

      insertStartup.run(
        5,
        "PipeAI Innovations",
        "Tanvi Deshmukh & Kunal Joshi",
        "Autonomous Pipe Crawler Vision",
        "Robotics & Smart Cities",
        "Robotics / Computer Vision / Edge AI",
        2,
        1,
        "DIPP41108",
        8,
        "PipeAI produces tethered miniature autonomous robotic crawlers that navigate 150mm to 1200mm pipes to visually map structural fractures and pipe wall corrosion.",
        "Surat Smart City stormwater drain inspection contract.",
        1,
        "DPIIT Certificate, Startup India Seed Fund Recipient"
      );

      insertStartup.run(
        6,
        "CivicPulse Insights",
        "Deepak Chawla & Meera Bansal",
        "NLP Citizen Grievance Classifier",
        "GovTech / Citizen Services",
        "NLP / LLM / Vector Search",
        3,
        1,
        "DIPP91122",
        15,
        "CivicPulse analyzes citizen feedback across 14 official Indian languages, automatically assigning urgent priority and routing to designated administrative divisions.",
        "Delhi CM Helpline automated ticket taxonomy pilot, CM Portal Uttarakhand pilot.",
        1,
        "DPIIT Certificate, Data Localization Compliance Certification"
      );

      insertStartup.run(
        7,
        "GreenWatts Grid",
        "Sameer Kulkarni & Divya Hegde",
        "Distributed Solar Peak Shaving & Storage",
        "Renewable Energy",
        "CleanTech / ML / Embedded IoT",
        5,
        1,
        "DIPP33491",
        22,
        "GreenWatts Grid provides an autonomous battery energy storage management system (BESS) optimizing hybrid solar rooftop plants.",
        "BESCOM substation trial, Gujarat Energy Development Agency pilot.",
        1,
        "DPIIT Certificate, CEA Grid Interconnection Compliance, ISO 27001"
      );

      insertStartup.run(
        8,
        "HealthRay Diagnostic",
        "Dr. Aruna Sundaram & Amit Patel",
        "Portable AI Triage for Rural PHCs",
        "Healthcare",
        "HealthTech / Computer Vision / Edge AI",
        2,
        1,
        "DIPP19284",
        12,
        "HealthRay provides handheld X-ray triage software that detects pulmonary abnormalities without requiring an on-site radiologist.",
        "24 Primary Health Centres in Odisha, Tribal welfare healthcare camp.",
        1,
        "DPIIT Certificate, CDSCO Medical Device Class B Registration"
      );

      insertStartup.run(
        9,
        "KrishiSheet ColdTech",
        "Harpreet Singh & Simran Kaur",
        "Decentralized Thermal Battery Solar Cold Storage",
        "Agriculture Technology",
        "Phase Change Materials / Solar Thermal / IoT",
        3,
        1,
        "DIPP88312",
        16,
        "KrishiSheet provides modular 5MT cold storage rooms powered by phase change thermal batteries with 72-hour thermal backup without diesel generators.",
        "Punjab Mandi Board pilot in Abohar kinnow citrus belt, Haryana HAFED validation.",
        1,
        "DPIIT Certificate, ICAR Test Certificate, Patent IN-2024-1102"
      );

      insertStartup.run(
        10,
        "VanaDrishti Drones",
        "Alok Nanda & Ritu Rawat",
        "Autonomous Thermal Forest Fire Early Alert UAS",
        "Disaster Management & Forestry",
        "Thermal UAV / Computer Vision / Satellite Relay",
        3,
        1,
        "DIPP44902",
        13,
        "VanaDrishti designs BVLOS long-endurance drones equipped with dual optical-thermal sensor payloads for continuous automated wildfire surveillance.",
        "Uttarakhand Forest Department pilot in Rajaji National Park corridor.",
        1,
        "DPIIT Certificate, DGCA UAS Type Approval Certificate, ISO 9001:2015"
      );

      insertStartup.run(
        11,
        "GatiMarg AI",
        "Siddharth Sen & Bhavna Patel",
        "Adaptive Traffic Queue Signal Controller",
        "Urban Mobility & Smart Cities",
        "Computer Vision / Edge ML / ITS Controller",
        3,
        1,
        "DIPP55819",
        12,
        "GatiMarg AI installs edge vision sensors on intersection gantry poles to dynamically regulate green signal cycles according to real-time traffic volume.",
        "Thane Traffic Police 10-junction pilot, Ahmedabad BRTS corridor trial.",
        1,
        "DPIIT Certificate, STQC Sensor Testing Certificate"
      );

      insertStartup.run(
        12,
        "BhuJal Analytics",
        "Naveen Reddy & Archana Das",
        "Subterranean Groundwater Table Probe Telemetry",
        "Water Resources",
        "Hydrostatic Probes / Sub-GHz Mesh / Cloud GIS",
        4,
        1,
        "DIPP66103",
        15,
        "BhuJal Analytics deploys ruggedized deep borehole sensors that deliver hourly groundwater level and salinity trends via long-range mesh radio.",
        "Telangana Mission Bhagiratha recharge aquifer trial, CGWB Anantapur block pilot.",
        1,
        "DPIIT Certificate, CGWB Calibration Certification, ISO 9001:2015"
      );

      insertStartup.run(
        13,
        "SwachhVayu Systems",
        "Manish Agarwal & Sonia Bose",
        "Low-Power Ambient PM2.5 Micro-Scrubbers",
        "Environmental Tech",
        "Electrostatic Precipitators / IoT Air Telemetry",
        2,
        1,
        "DIPP71904",
        10,
        "SwachhVayu deploys low-drag electrostatic air filtration nodes on street light poles to scrub particulate matter in urban hotspots.",
        "Kanpur industrial belt air quality mitigation trial.",
        1,
        "DPIIT Certificate, CPCB Field Trial Certificate"
      );

      insertStartup.run(
        14,
        "NetraSuraksha AI",
        "Arun Pandian & Deepa Nair",
        "Privacy-Preserving Edge Video Surveillance",
        "Public Safety & AI",
        "Edge TPU / Computer Vision / Anomaly Detection",
        3,
        1,
        "DIPP83210",
        14,
        "NetraSuraksha builds edge-processed video analytics for crowd management, perimeter breaches, and child safety in public infrastructure.",
        "Tirupati Pilgrim Queue Management System, Chennai Metro rail trial.",
        1,
        "DPIIT Certificate, DPDP Compliance Audit"
      );

      insertStartup.run(
        15,
        "KisanDoot BioTech",
        "Gopal Krishna & Shweta Joshi",
        "Spectroscopic Soil Nutrient & Nitrate Probes",
        "Agriculture Technology",
        "NIR Spectrometry / IoT / Agronomic AI",
        3,
        1,
        "DIPP94012",
        11,
        "KisanDoot manufactures portable handheld soil spectroscopy devices providing instant NPK and moisture readouts in 90 seconds without chemical reagents.",
        "Vidarbha cotton belt soil health card digitization trial.",
        1,
        "DPIIT Certificate, ICAR Evaluation Report"
      );

      insertStartup.run(
        16,
        "SetuCyber Shield",
        "Aditya Singhal & Rashi Gupta",
        "Government e-Portal Zero-Trust Vulnerability Sensor",
        "Cybersecurity & GovTech",
        "Zero-Trust Architecture / Threat Intel / WAF",
        4,
        1,
        "DIPP38901",
        17,
        "SetuCyber provides automated vulnerability scanners and real-time behavioral DDoS mitigation specialized for state portal architectures.",
        "Haryana State Data Centre compliance audit, CERT-In advisory integration.",
        1,
        "DPIIT Certificate, CERT-In Empanelled Auditor Report, ISO 27001"
      );
      insertStartup.finalize();

      // 3. Applications (8 applications)
      const insertApp = db.prepare(`
        INSERT INTO applications (
          id, challenge_id, startup_id, status, proposal_summary, proposed_budget,
          proposed_timeline, checklist_dpiit, checklist_documents, checklist_technology,
          checklist_experience, checklist_compliance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      // Challenge 3 (Water Leakage) -> Startup 1 (WaterSense)
      insertApp.run(
        1,
        3,
        1,
        "Approved",
        "Deployment of 60 WaterSense acoustic clamp sensors along 12km critical feeder pipeline with real-time cloud alert dashboard.",
        "₹38,50,000",
        "90 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 1 (Smart Waste) -> Startup 2 (EcoTrack)
      insertApp.run(
        2,
        1,
        2,
        "In Review",
        "Installation of 180 ultrasonic fill-level monitors and dynamic garbage truck route dispatch app for Ward 12.",
        "₹19,80,000",
        "75 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 2 (AI Attendance) -> Startup 3 (EduVision)
      insertApp.run(
        3,
        2,
        3,
        "Evaluated",
        "Dual-camera edge vision nodes across 50 school entrance portals with local on-device encryption and offline caching.",
        "₹28,00,000",
        "100 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 3 (Water Leakage) -> Startup 4 (AquaTech Labs)
      insertApp.run(
        4,
        3,
        4,
        "Applied",
        "Surface acoustic listening sticks and stationary pipe logger nodes with GSM cellular transmission.",
        "₹42,00,000",
        "90 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 3 (Water Leakage) -> Startup 5 (PipeAI)
      insertApp.run(
        5,
        3,
        5,
        "Applied",
        "Robotic camera crawler surveys inside 5km trunk line during non-peak scheduled night hours.",
        "₹34,00,000",
        "60 Days",
        1, 1, 1, 0, 1
      );

      // Challenge 4 (Grievance Analytics) -> Startup 6 (CivicPulse)
      insertApp.run(
        6,
        4,
        6,
        "Approved",
        "Deployment of Indic NLP classifier microservice integrating into CM Grievance portal with real-time sentiment scoring.",
        "₹32,00,000",
        "90 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 5 (Solar Grid) -> Startup 7 (GreenWatts)
      insertApp.run(
        7,
        5,
        7,
        "Scaled",
        "Automated solar inverter peak shaving controller deployed across 20 government district collectorate headquarters.",
        "₹48,00,000",
        "180 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 1 (Smart Waste) -> Startup 5 (PipeAI)
      insertApp.run(
        8,
        1,
        5,
        "In Review",
        "Robotic automated inspection of stormwater grates and trash trap clearance.",
        "₹18,00,000",
        "60 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 6 (Solar Cold Storage) -> Startup 9 (KrishiSheet)
      insertApp.run(
        9,
        6,
        9,
        "Approved",
        "Installation of two 5MT phase-change thermal battery units at mandi yard with digital humidity sensors.",
        "₹42,00,000",
        "120 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 8 (Forest Fire Drone) -> Startup 10 (VanaDrishti)
      insertApp.run(
        10,
        8,
        10,
        "Approved",
        "Daily autonomous flight schedules over 20,000 hectares of forest reserve with real-time smoke plume coordinates.",
        "₹44,00,000",
        "90 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 9 (Traffic Signal) -> Startup 11 (GatiMarg)
      insertApp.run(
        11,
        9,
        11,
        "Approved",
        "Computer vision intersection edge units delivering dynamic green split adjustments across 24 critical junctions.",
        "₹36,00,000",
        "90 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 10 (Groundwater Telemetry) -> Startup 12 (BhuJal)
      insertApp.run(
        12,
        10,
        12,
        "Approved",
        "Mesh-connected digital piezometers and conductivity probes deployed across 30 state monitoring borewells.",
        "₹29,50,000",
        "90 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 4 (Effluent Monitoring) -> Startup 13 (SwachhVayu)
      insertApp.run(
        13,
        4,
        13,
        "In Review",
        "Integration of optical spectrometry probes at factory outlet canals with tamper-proof automated alerts.",
        "₹26,00,000",
        "60 Days",
        1, 1, 1, 0, 1
      );

      // Challenge 2 (School Attendance) -> Startup 14 (NetraSuraksha)
      insertApp.run(
        14,
        2,
        14,
        "In Review",
        "Dual camera doorway units with privacy blurring and localized edge face feature matching.",
        "₹31,00,000",
        "90 Days",
        1, 1, 1, 1, 0
      );

      // Challenge 6 (Solar Cold Storage) -> Startup 15 (KisanDoot)
      insertApp.run(
        15,
        6,
        15,
        "Approved",
        "Cold storage temperature and atmospheric nitrogen balance logging system with farmer mobile alerts.",
        "₹38,00,000",
        "120 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 2 (School Attendance) -> Startup 16 (SetuCyber)
      insertApp.run(
        16,
        2,
        16,
        "Approved",
        "End-to-end cryptographic encryption layer securing student biometric hashes from edge nodes to cloud repository.",
        "₹22,00,000",
        "60 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 1 (Smart Waste) -> Startup 5 (PipeAI)
      insertApp.run(
        17,
        1,
        5,
        "In Review",
        "Automated robotic crawler visual inspection of municipal stormwater drop inlets and trash choke points.",
        "₹18,00,000",
        "60 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 5 (Pothole Detection) -> Startup 2 (EcoTrack)
      insertApp.run(
        18,
        5,
        2,
        "Approved",
        "Integration of vibration logging and optical distress detection on municipal transit bus fleets.",
        "₹24,00,000",
        "90 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 10 (Groundwater Telemetry) -> Startup 1 (WaterSense)
      insertApp.run(
        19,
        10,
        1,
        "Approved",
        "Subterranean acoustic pulse logging to monitor water table drawdown in critical drought blocks.",
        "₹33,00,000",
        "90 Days",
        1, 1, 1, 1, 1
      );

      // Challenge 1 (Smart Waste) -> Startup 8 (MedDrishti)
      insertApp.run(
        20,
        1,
        8,
        "Approved",
        "Sanitation worker wearable biometrics and route environmental exposure telemetry kit.",
        "₹27,50,000",
        "75 Days",
        1, 1, 1, 1, 1
      );
      insertApp.finalize();

      // 4. Evaluations (4 evaluations)
      const insertEval = db.prepare(`
        INSERT INTO evaluations (
          id, application_id, expert_name, technical_score, innovation_score,
          feasibility_score, cost_score, team_score, total_score, comments, decision
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertEval.run(
        1,
        1,
        "Dr. M. S. Swaminathan (IIT Roorkee / CPWD Advisory)",
        88.0,
        92.0,
        86.0,
        80.0,
        90.0,
        87.2,
        "WaterSense presents a mathematically rigorous acoustic waveform analysis method. Pilot scope is tightly bounded and sensor hardware is field-hardened.",
        "Approved for Pilot"
      );

      insertEval.run(
        2,
        3,
        "Prof. Sunita Raman (IIIT Hyderabad / AI Mission)",
        85.0,
        88.0,
        82.0,
        78.0,
        85.0,
        83.6,
        "Edge vision model shows good inference speeds under low lighting. On-device facial embedding extraction safeguards student privacy according to DPDP norms.",
        "Approved for Pilot"
      );

      insertEval.run(
        3,
        6,
        "Er. K. L. Narayanan (NIC Technical Director Retd.)",
        90.0,
        89.0,
        91.0,
        85.0,
        88.0,
        88.6,
        "CivicPulse demonstrates superior performance in regional Hindi and Kannada dialect variations. Excellent architecture for integration with existing e-Gov databases.",
        "Approved for Pilot"
      );

      insertEval.run(
        4,
        7,
        "Dr. Arvind Joshi (NITI Aayog Energy Vertical)",
        92.0,
        94.0,
        90.0,
        86.0,
        93.0,
        91.0,
        "Demonstrated clear ROI during Phase 1 pilot. Battery cycling algorithms protect cell lifespan while generating verifiable power bill savings.",
        "Approved for Pilot"
      );

      insertEval.run(
        5,
        9,
        "Dr. S. K. Mahapatra (ICAR Agricultural Engineering Institute)",
        90.0,
        92.0,
        88.0,
        82.0,
        92.0,
        89.0,
        "KrishiSheet phase change thermal battery technology eliminates recurring diesel generator operating costs.",
        "Approved for Pilot"
      );

      insertEval.run(
        6,
        10,
        "Er. Alok Ranjan (Forest Survey Directorate)",
        92.0,
        94.0,
        90.0,
        88.0,
        93.0,
        91.5,
        "VanaDrishti dual optical-thermal payload delivers high accuracy early ember detection even in dense canopies.",
        "Approved for Pilot"
      );

      insertEval.run(
        7,
        12,
        "Dr. Ramesh Chandra (Central Ground Water Board)",
        86.0,
        87.0,
        86.0,
        82.0,
        86.0,
        85.5,
        "BhuJal hydrostatic probes provide stable pressure calibration without sensor drift under deep borehole hydrostatic heads.",
        "Approved for Pilot"
      );

      insertEval.run(
        8,
        2,
        "Er. S. K. Sharma (State Pollution Control Board)",
        82.0,
        80.0,
        84.0,
        79.0,
        81.0,
        81.2,
        "Route optimization algorithm requires additional validation under heavy monsoon traffic congestion parameters.",
        "Request Changes"
      );
      insertEval.finalize();

      // 5. Pilots (3 pilots)
      const insertPilot = db.prepare(`
        INSERT INTO pilots (
          id, application_id, challenge_id, startup_id, department, objective,
          duration, budget, start_date, end_date,
          milestone1_title, milestone1_status,
          milestone2_title, milestone2_status,
          milestone3_title, milestone3_status,
          milestone4_title, milestone4_status,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      // Pilot 1: WaterSense on Water Leakage Detection (Ready for demo step 8 & 9!)
      insertPilot.run(
        1,
        1,
        3,
        1,
        "Public Works Department",
        "Acoustic sensor telemetry validation on 12km transmission pipeline in Zone 4 to detect non-revenue water leaks under 5m error.",
        "90 Days",
        "₹38,50,000",
        "2026-06-01",
        "2026-08-31",
        "Sensor Hardware Installation & Calibration",
        "Completed",
        "Field Acoustic Telemetry Testing",
        "Completed",
        "Performance Validation & Benchmark Audit",
        "Completed",
        "Final Review & Procurement Readiness Dossier",
        "In Progress",
        "In Progress"
      );

      // Pilot 2: CivicPulse on Citizen Grievance
      insertPilot.run(
        2,
        6,
        4,
        6,
        "Urban Development",
        "NLP categorization of 50,000 historical and incoming municipal grievance petitions.",
        "90 Days",
        "₹32,00,000",
        "2026-05-15",
        "2026-08-15",
        "API Integration with CM Helpline",
        "Completed",
        "Model Fine-Tuning on Local Dialects",
        "Completed",
        "Automated SLA Routing & Testing",
        "Completed",
        "Independent Third-Party Audit",
        "Completed",
        "Completed"
      );

      // Pilot 3: GreenWatts on Solar Grid
      insertPilot.run(
        3,
        7,
        5,
        7,
        "Renewable Energy Department",
        "Deployment of micro-BESS controllers across Secretariat and Mini-Secretariat rooftop arrays.",
        "180 Days",
        "₹48,00,000",
        "2026-01-10",
        "2026-07-10",
        "Substation SCADA Interfacing",
        "Completed",
        "Peak Tariff Dispatch Testing",
        "Completed",
        "Battery Life Optimization Audit",
        "Completed",
        "State Regulatory Commission Clearance",
        "Completed",
        "Completed"
      );

      // Pilot 4: VanaDrishti on Forest Fire Early Warning
      insertPilot.run(
        4,
        10,
        8,
        10,
        "Department of Environment & Forests",
        "Autonomous thermal UAV patrols over 20,000 hectares of forest reserve to detect micro-smoke plumes.",
        "90 Days",
        "₹44,00,000",
        "2026-07-01",
        "2026-09-30",
        "Base Station Antenna & UAV Commissioning",
        "Completed",
        "Thermal Mapping of High Risk Ridge Lines",
        "Completed",
        "Controlled Burn Flare Detection Verification",
        "Completed",
        "Forest Survey Directorate Sign-Off",
        "Completed",
        "Completed"
      );

      // Pilot 5: EduVision on School Attendance
      insertPilot.run(
        5,
        3,
        2,
        3,
        "School Education Department",
        "Automated facial recognition & edge computer vision for multi-student attendance logging without bottlenecks in 50 government schools.",
        "100 Days",
        "₹28,00,000",
        "2026-08-15",
        "2026-11-25",
        "Edge TPU Hardware Installation (50 Schools)",
        "Completed",
        "Student Enrollment & Multi-Face Verification",
        "Completed",
        "Attendance Database Stress Testing",
        "In Progress",
        "STQC Security & Privacy Audit",
        "In Progress",
        "In Progress"
      );

      // Pilot 6: KrishiSheet ColdTech on Solar Cold Storage
      insertPilot.run(
        6,
        6,
        6,
        9,
        "Department of Agriculture & Farmers Welfare",
        "Off-grid 5MT solar thermal battery cold storage units at rural primary agricultural produce collection centres.",
        "120 Days",
        "₹42,00,000",
        "2026-08-20",
        "2026-12-20",
        "Site Preparation & Thermal Chamber Assembly",
        "Completed",
        "Solar Rooftop & PCM Charging Integration",
        "Completed",
        "Produce Spoilage & Temperature Logging",
        "Completed",
        "ICAR Agricultural Audit & Certification",
        "In Progress",
        "In Progress"
      );
      insertPilot.finalize();

      // 6. Performance Reports (6 reports)
      const insertPerf = db.prepare(`
        INSERT INTO performance_reports (
          id, pilot_id,
          metric1_name, metric1_target, metric1_actual, metric1_variance, metric1_status,
          metric2_name, metric2_target, metric2_actual, metric2_variance, metric2_status,
          metric3_name, metric3_target, metric3_actual, metric3_variance, metric3_status,
          overall_status, expert_comments, govt_feedback, validation_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertPerf.run(
        1,
        1,
        "Leak Detection Accuracy",
        "90.0%",
        "94.2%",
        "+4.2%",
        "TARGET ACHIEVED",
        "Detection Response Time",
        "30 min",
        "22 min",
        "-8 min (Faster)",
        "TARGET ACHIEVED",
        "Pinpoint Location Error",
        "Within 5.0m",
        "Within 3.8m",
        "-1.2m (Tighter)",
        "TARGET ACHIEVED",
        "TARGET ACHIEVED",
        "Independent acoustic ground-truth testing verified 94.2% detection with zero false positive digs.",
        "PWD Executive Engineer certified that 4 underground ruptures were intercepted before road subsidence occurred.",
        "Validated by NIUA / National Water Academy"
      );

      insertPerf.run(
        2,
        2,
        "Auto-Classification Accuracy",
        "90.0%",
        "93.5%",
        "+3.5%",
        "TARGET ACHIEVED",
        "Average Ticket Routing Time",
        "120 min",
        "45 min",
        "-75 min (Faster)",
        "TARGET ACHIEVED",
        "Citizen Satisfaction Rating",
        "4.0 / 5.0",
        "4.4 / 5.0",
        "+0.4",
        "TARGET ACHIEVED",
        "TARGET ACHIEVED",
        "Multi-lingual transformer model achieved high F1 score across Hindi, English, and regional slang.",
        "Urban Development department noted immediate drop in pending unaddressed petitions.",
        "Validated by Centre for Good Governance"
      );

      insertPerf.run(
        3,
        3,
        "Peak Electricity Bill Reduction",
        "15.0%",
        "18.6%",
        "+3.6%",
        "TARGET ACHIEVED",
        "Captive Solar Consumption",
        "75.0%",
        "82.4%",
        "+7.4%",
        "TARGET ACHIEVED",
        "Grid Inverter Uptime",
        "99.0%",
        "99.7%",
        "+0.7%",
        "TARGET ACHIEVED",
        "TARGET ACHIEVED",
        "Verified by State Energy Regulatory Commission meters over 180 continuous operating days.",
        "Significant tariff reduction achieved on commercial grid power draw.",
        "Validated by National Institute of Solar Energy"
      );

      insertPerf.run(
        4,
        4,
        "Detection Radius Coverage",
        "5.0 km",
        "7.4 km",
        "+2.4 km (Exceeded)",
        "TARGET ACHIEVED",
        "Response Notification Alert",
        "15 min",
        "12 min",
        "-3 min (Faster)",
        "TARGET ACHIEVED",
        "False Positive Trigger Rate",
        "< 5%",
        "1.2%",
        "-3.8% (Lower)",
        "TARGET ACHIEVED",
        "TARGET ACHIEVED",
        "Thermal infrared sensors pinpointed test campfires under thick sal tree canopies within 12 minutes.",
        "Chief Conservator of Forests issued technical validation clearance.",
        "Validated by Forest Survey Directorate & Remote Sensing Center"
      );

      insertPerf.run(
        5,
        5,
        "Multi-Student Recognition Accuracy",
        "98.0%",
        "99.1%",
        "+1.1%",
        "TARGET ACHIEVED",
        "Attendance Logging Speed",
        "2.0 sec",
        "1.8 sec",
        "-0.2 sec (Faster)",
        "TARGET ACHIEVED",
        "Privacy Compliance Rating",
        "100%",
        "100%",
        "0.0%",
        "TARGET ACHIEVED",
        "TARGET ACHIEVED",
        "STQC IT Directorate verified that edge facial biometric hashes conform to DPDP Act 2023 regulations.",
        "District Education Officer certified zero false absentees. Recommended for district-wide rollout.",
        "Validated by STQC IT Directorate & Education Board"
      );

      insertPerf.run(
        6,
        6,
        "Post-Harvest Spoilage Reduction",
        "30.0%",
        "38.0%",
        "+8.0%",
        "TARGET ACHIEVED",
        "Thermal Hold Autonomous Backup",
        "48 hr",
        "64 hr",
        "+16 hr (Longer)",
        "TARGET ACHIEVED",
        "Storage Temperature Stability",
        "4.0°C ± 1°C",
        "4.1°C ± 0.4°C",
        "Tight Tolerance",
        "TARGET ACHIEVED",
        "TARGET ACHIEVED",
        "ICAR certified that phase change thermal material maintained uninterrupted cold chain without auxiliary diesel generation.",
        "Mandi Board certified significant income recovery for local tomato growers.",
        "Validated by ICAR Agricultural Engineering Institute"
      );
      insertPerf.finalize();

      // 7. Procurement Decisions (2 decisions)
      const insertProc = db.prepare(`
        INSERT INTO procurement_decisions (
          id, pilot_id, startup_id, challenge_id, pilot_cost, pilot_result,
          kpi_achievement, expert_evaluation, validation_result, status,
          decision_date, decision_notes, gfr_rule
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      // Pilot 1: Pending decision for Demo Step 11!
      insertProc.run(
        1,
        1,
        1,
        3,
        "₹38,50,000",
        "Pilot Validated: 12km Transmission Pipeline Tested",
        "All 3 KPIs Exceeded (Accuracy 94.2%, Response 22m)",
        "Score: 87.2 / 100 (Dr. M. S. Swaminathan)",
        "Certified by National Water Academy",
        "Under Procurement Review",
        "2026-09-20",
        "Proposal meets General Financial Rules (GFR) 2017 Rule 149 relaxation criteria for verified pilot innovation. Ready for official procurement sanctions.",
        "Rule 149 / Special Exemption for Proven Pilot Solution"
      );

      // Pilot 2: Already Procurement Approved & Ready for Scale
      insertProc.run(
        2,
        2,
        6,
        4,
        "₹32,00,000",
        "Pilot Validated: 50,000 Petitions Processed",
        "Auto-Classification 93.5% vs 90% Target",
        "Score: 88.6 / 100 (Er. K. L. Narayanan)",
        "Certified by Centre for Good Governance",
        "PROCUREMENT APPROVED",
        "2026-09-05",
        "Approved under Special Public Procurement Framework for Startups. Annual state license contract executed.",
        "GFR 2017 Rule 149 / Single Source Proven Innovation"
      );

      // Pilot 4: Forest Fire Early Warning Drone Pilot Approved
      insertProc.run(
        3,
        4,
        10,
        8,
        "₹44,00,000",
        "Pilot Validated: 20,000 Hectares Patrolled",
        "All KPIs Exceeded (12 min alert vs 15 min target)",
        "Score: 91.5 / 100 (Er. Alok Ranjan)",
        "Certified by Forest Survey Directorate",
        "PROCUREMENT APPROVED",
        "2026-09-25",
        "Procurement sanctioned for state wildlife division under special disaster management innovation provisions.",
        "GFR 2017 Rule 149 / Single Source Proven Innovation"
      );

      // Pilot 6: Solar Cold Storage
      insertProc.run(
        4,
        6,
        9,
        6,
        "₹42,00,000",
        "Pilot Validated: 38% Spoilage Reduction",
        "All 3 KPIs Exceeded (64 hr thermal hold vs 48 hr target)",
        "Score: 89.0 / 100 (Dr. S. K. Mahapatra)",
        "Certified by ICAR Agricultural Engineering Institute",
        "PROCUREMENT APPROVED",
        "2026-09-27",
        "Sanctioned for commercial procurement under State Horticulture Development Mission.",
        "GFR 2017 Rule 149 / Single Source Proven Innovation"
      );

      // Pilot 5: School Attendance
      insertProc.run(
        5,
        5,
        3,
        2,
        "₹28,00,000",
        "Pilot Validated: 50 Government Schools Deployed",
        "All KPIs Exceeded (99.1% recognition rate)",
        "Score: 87.5 / 100 (Prof. Sunita Raman)",
        "Certified by STQC Directorate",
        "Under Procurement Review",
        "2026-09-28",
        "STQC certification submitted. Direct commercial purchase pending Competent Authority sign-off for 150 schools.",
        "GFR 2017 Rule 149 / Pilot Proven Relaxation"
      );
      insertProc.finalize();

      // 8. Milestone Payments
      const insertPay = db.prepare(`
        INSERT INTO milestone_payments (
          id, pilot_id, milestone_number, title, amount, status, paid_date, transaction_ref
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertPay.run(1, 1, 1, "Milestone 1 — Hardware Deployment", 50000, "Paid", "2026-06-15", "PFMS-TXN-2026-8812");
      insertPay.run(2, 1, 2, "Milestone 2 — Baseline Acoustic Testing", 75000, "Paid", "2026-07-20", "PFMS-TXN-2026-9430");
      insertPay.run(3, 1, 3, "Milestone 3 — Performance Validation", 100000, "Pending", null, null);
      insertPay.run(4, 1, 4, "Milestone 4 — Final Dossier & Audit", 75000, "Pending", null, null);

      insertPay.run(5, 2, 1, "Milestone 1 — Data Pipeline Architecture", 75000, "Paid", "2026-05-30", "PFMS-TXN-2026-6101");
      insertPay.run(6, 2, 2, "Milestone 2 — Language Dialect Training", 100000, "Paid", "2026-06-30", "PFMS-TXN-2026-7281");
      insertPay.run(7, 2, 3, "Milestone 3 — Full Portal Integration", 100000, "Paid", "2026-07-31", "PFMS-TXN-2026-8012");
      insertPay.run(8, 2, 4, "Milestone 4 — Final Governance Sign-Off", 45000, "Paid", "2026-08-20", "PFMS-TXN-2026-8919");

      insertPay.run(9, 4, 1, "Milestone 1 — Base Station Commissioning", 100000, "Paid", "2026-07-15", "PFMS-TXN-2026-1102");
      insertPay.run(10, 4, 2, "Milestone 2 — Thermal Ridge Mapping", 120000, "Paid", "2026-08-15", "PFMS-TXN-2026-2204");
      insertPay.run(11, 4, 3, "Milestone 3 — Controlled Flare Testing", 120000, "Paid", "2026-09-10", "PFMS-TXN-2026-3309");
      insertPay.run(12, 4, 4, "Milestone 4 — Final Forestry Sign-Off", 100000, "Paid", "2026-09-28", "PFMS-TXN-2026-4411");
      insertPay.finalize();

      // 9. Scaled Solutions
      const insertScale = db.prepare(`
        INSERT INTO scaled_solutions (
          id, procurement_id, startup_id, startup_name, challenge_title,
          current_departments, scale_departments, scale_districts,
          total_deployments, status, scale_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertScale.run(
        1,
        2,
        6,
        "CivicPulse Insights",
        "Citizen Grievance Analytics",
        1,
        5,
        20,
        25,
        "SOLUTION SCALED",
        "2026-09-12"
      );

      insertScale.run(
        2,
        1,
        1,
        "WaterSense",
        "Water Leakage Detection",
        1,
        1,
        1,
        1,
        "READY FOR SCALE-UP",
        null
      );

      insertScale.run(
        3,
        3,
        10,
        "VanaDrishti Drones",
        "Autonomous Drone Surveillance for Forest Fire Early Warning",
        1,
        2,
        8,
        16,
        "SOLUTION SCALED",
        "2026-09-28"
      );

      insertScale.run(
        4,
        4,
        9,
        "KrishiSheet ColdTech",
        "Decentralized Solar Cold Storage for Perishable Crops",
        1,
        3,
        14,
        32,
        "READY FOR SCALE-UP",
        "2026-09-28"
      );

      insertScale.run(
        5,
        5,
        3,
        "EduVision",
        "Automated School Attendance Verification",
        1,
        3,
        12,
        150,
        "READY FOR SCALE-UP",
        "2026-09-28"
      );
      insertScale.finalize();

      // 10. Notifications
      const insertNotif = db.prepare(`
        INSERT INTO notifications (
          id, title, message, type, is_read, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      insertNotif.run(1, "New Startup Application Received", "WaterSense submitted proposal for 'Water Leakage Detection'.", "application", 0, "2026-09-27 10:15:00");
      insertNotif.run(2, "Expert Evaluation Completed", "Dr. M. S. Swaminathan scored WaterSense (87.2/100).", "evaluation", 0, "2026-09-27 11:30:00");
      insertNotif.run(3, "Pilot Milestone Completed", "WaterSense completed Milestone 2 'Field Acoustic Telemetry Testing'.", "pilot", 0, "2026-09-27 14:00:00");
      insertNotif.run(4, "Performance Validation Required", "Pilot #1 reached final benchmark criteria. PWD audit report submitted.", "performance", 0, "2026-09-27 15:45:00");
      insertNotif.run(5, "Procurement Decision Pending", "WaterSense pilot validation approved. Awaiting Procurement Authority sanction.", "procurement", 0, "2026-09-27 16:20:00");
      insertNotif.run(6, "Scale-Up Authorization Completed", "Statewide expansion authorized for WaterSense across 5 departments.", "scale", 1, "2026-09-28 09:00:00");
      insertNotif.run(7, "Disbursal Released", "Milestone 2 payment of ₹75,000 processed via PFMS for EduVision.", "payment", 0, "2026-09-28 11:30:00");
      insertNotif.run(8, "New Challenge Published", "Traffic Police published 'Smart Urban Traffic Adaptive Signal Control'.", "challenge", 0, "2026-09-28 12:45:00");
      insertNotif.finalize();

      // 11. Documents
      const insertDoc = db.prepare(`
        INSERT INTO documents (
          id, title, category, entity_type, entity_id, file_name, file_size, upload_date, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertDoc.run(1, "Technical Scope Brief - Water Leakage", "Problem Statement", "challenge", 3, "Technical_Scope_PWD_WaterLeakage.pdf", "1.8 MB", "2026-09-01", "Verified");
      insertDoc.run(2, "DPIIT Certificate of Recognition - WaterSense", "Startup Registration", "startup", 1, "DPIIT_Cert_DIPP78214.pdf", "650 KB", "2026-09-02", "Verified");
      insertDoc.run(3, "Statutory Eligibility & Compliance Undertaking", "Eligibility Documents", "startup", 1, "WaterSense_Eligibility_Undertaking.pdf", "920 KB", "2026-09-02", "Verified");
      insertDoc.run(4, "Technical & Financial Proposal - WaterSense", "Technical Proposal", "application", 1, "WaterSense_Technical_Proposal_v2.pdf", "4.2 MB", "2026-09-05", "Approved");
      insertDoc.run(5, "Tripartite Pilot Agreement (Dept + Startup + Evaluator)", "Pilot Agreement", "pilot", 1, "Executed_Pilot_Agreement_PWD_WS_01.pdf", "2.1 MB", "2026-06-01", "Active");
      insertDoc.run(6, "Pilot Telemetry & Sensor Performance Report", "Performance Report", "pilot", 1, "WaterSense_Performance_Audit_NIUA.pdf", "3.4 MB", "2026-08-30", "Verified");
      insertDoc.run(7, "Independent Third-Party Validation Certificate", "Validation Report", "pilot", 1, "NIUA_ThirdParty_Validation_Cert.pdf", "1.1 MB", "2026-09-18", "Approved");
      insertDoc.run(8, "Competent Authority Procurement Sanction Order", "Procurement Decision", "procurement", 1, "Govt_Sanction_Order_GFR149_Proc.pdf", "880 KB", "2026-09-22", "Pending Release");
      insertDoc.run(9, "DGCA UAS Type Approval Certificate — VanaDrishti", "Startup Registration", "startup", 10, "DGCA-UAS-VANA-2026.pdf", "1.8 MB", "2026-07-15", "Verified");
      insertDoc.run(10, "Multi-District Scale-Up Deployment Sanction Order", "Procurement Decision", "procurement", 3, "Scale-Sanction-Order-2026.pdf", "1.3 MB", "2026-09-28", "Sanctioned");
      insertDoc.run(11, "Municipal Solid Waste RFP Specifications", "Problem Statement", "challenge", 1, "MUNICIPAL-SWM-2026.pdf", "2.2 MB", "2026-09-18", "Active");
      insertDoc.run(12, "DPDP Act 2023 Data Privacy Audit Certificate — CivicPulse", "Validation Report", "startup", 6, "DPDP-AUDIT-CIVIC.pdf", "940 KB", "2026-08-20", "Certified");
      insertDoc.run(13, "Central Ground Water Board Sensor Calibration Report", "Validation Report", "pilot", 5, "CGWB-BHUJAL-0926.pdf", "1.6 MB", "2026-09-28", "Verified");
      insertDoc.run(14, "Tripartite Scale-Up Agreement (State Mission + Startup + Discom)", "Pilot Agreement", "pilot", 3, "TRIPARTITE-SCALE-2026.pdf", "2.8 MB", "2026-09-28", "Signed");
      insertDoc.finalize();

      console.log("Database seeded successfully with ProcureFlow enterprise sample dataset!");
      resolve();
    });
  });
}
