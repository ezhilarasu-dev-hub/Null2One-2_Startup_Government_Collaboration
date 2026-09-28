/**
 * Procure Government Portal (Prototype) — Client-Side Mock API Interceptor for Vercel Deployments
 * Transparently falls back to pre-seeded localStorage dataset when running on Vercel or when backend is unreachable.
 */

const SEED_DATA = {
  challenges: [
    {
      id: 1,
      title: "Smart Waste Collection & Route Optimization",
      department: "Municipal Administration",
      problem_description: "Optimizing urban waste collection logistics and monitoring bin fill levels in real time across Ward 12 municipal sectors.",
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
      applications_count: 2,
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
    },
    {
      id: 6,
      title: "Decentralized Solar Cold Storage for Perishable Crops",
      department: "Department of Agriculture & Farmers Welfare",
      problem_description: "Off-grid 5MT solar thermal battery cold storage units at rural primary agricultural produce collection centres.",
      expected_outcome: "Slash post-harvest tomato and horticultural crop spoilage by 40% in remote farm clusters.",
      required_technology: "Phase Change Materials, Solar Thermal, IoT Temperature Logging",
      budget_range: "₹35,00,000 - ₹60,00,000",
      pilot_duration: "4 Months",
      eligibility_requirements: "DPIIT recognized, ICAR/NABARD validated pilot track record",
      expected_kpis: "Continuous 4°C storage across 72-hour cloudy weather spells",
      submission_deadline: "2026-12-10",
      status: "Open",
      stage: "Startup Discovery",
      applications_count: 2,
      created_at: "2026-09-27"
    },
    {
      id: 7,
      title: "AI Point-of-Care Diagnostic Screen for Rural Health Sub-Centres",
      department: "National Health Mission",
      problem_description: "Battery-powered handheld multi-vital analyzer screening anemia, ECG abnormalities, and vitals in offline primary health centers.",
      expected_outcome: "Immediate specialist tele-triage referral for high-risk obstetric and cardiovascular patients.",
      required_technology: "Edge AI Biosensors, Telemedicine, Low-Power Bluetooth",
      budget_range: "₹28,00,000 - ₹45,00,000",
      pilot_duration: "3 Months",
      eligibility_requirements: "DPIIT recognized, CDSCO approved or ISO 13485 certified",
      expected_kpis: "95% diagnostic concord with laboratory gold standards",
      submission_deadline: "2026-11-28",
      status: "Evaluation",
      stage: "Expert Evaluation",
      applications_count: 2,
      created_at: "2026-09-27"
    },
    {
      id: 8,
      title: "Autonomous Drone Surveillance for Forest Fire Early Warning",
      department: "Department of Environment & Forests",
      problem_description: "Autonomous thermal-infrared long-range drone patrols over dry deciduous forest tracts to detect micro-smoke plumes.",
      expected_outcome: "Alert fire ranger beat officers within 15 minutes of ignition to contain ground fires before crown burns.",
      required_technology: "Autonomous UAVs, Thermal Infrared, Edge Computer Vision",
      budget_range: "₹32,0,000 - ₹55,00,000",
      pilot_duration: "3 Months",
      eligibility_requirements: "DPIIT recognized, DGCA type-certified UAS manufacturer",
      expected_kpis: "Detection of 0.5m embers from 300m altitude within 10 minutes",
      submission_deadline: "2026-12-15",
      status: "Open",
      stage: "Startup Discovery",
      applications_count: 1,
      created_at: "2026-09-28"
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
    },
    {
      id: 9,
      name: "KrishiSheet ColdTech",
      founder: "Harpreet Singh & Simran Kaur",
      solution: "Decentralized Thermal Battery Solar Cold Storage",
      industry: "Agriculture Technology",
      technology: "Phase Change Materials / Solar Thermal / IoT",
      years_experience: 3,
      dpiit_recognized: 1,
      dpiit_number: "DIPP88312",
      team_size: 16,
      description: "KrishiSheet provides modular 5MT cold storage rooms powered by phase change thermal batteries with 72-hour thermal backup without diesel generators.",
      previous_projects: "Punjab Mandi Board pilot in Abohar kinnow citrus belt, Haryana HAFED validation.",
      is_eligible: 1,
      matchScore: 89,
      location: "Chandigarh, Punjab"
    },
    {
      id: 10,
      name: "VanaDrishti Drones",
      founder: "Alok Nanda & Ritu Rawat",
      solution: "Autonomous Thermal Forest Fire Early Alert UAS",
      industry: "Disaster Management & Forestry",
      technology: "Thermal UAV / Computer Vision / Satellite Relay",
      years_experience: 3,
      dpiit_recognized: 1,
      dpiit_number: "DIPP44902",
      team_size: 13,
      description: "VanaDrishti designs BVLOS long-endurance drones equipped with dual optical-thermal sensor payloads for continuous automated wildfire surveillance.",
      previous_projects: "Uttarakhand Forest Department pilot in Rajaji National Park corridor.",
      is_eligible: 1,
      matchScore: 91,
      location: "Dehradun, Uttarakhand"
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
      challenge_title: "Smart Waste Collection & Route Optimization",
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
      evaluation_score: 81.2,
      submitted_at: "2026-09-23"
    },
    {
      id: 3,
      challenge_id: 2,
      challenge_title: "Automated School Attendance Verification",
      department: "School Education Department",
      startup_id: 3,
      startup_name: "EduVision",
      dpiit_number: "DIPP89211",
      status: "Eligible",
      proposal_summary: "Edge TPU camera installations at entry gates of 50 model schools with instantaneous SMS gateway integration.",
      proposed_budget: "₹24,50,000",
      proposed_timeline: "90 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 87.5,
      submitted_at: "2026-09-22"
    },
    {
      id: 4,
      challenge_id: 3,
      challenge_title: "AI-Based Water Leakage Detection",
      department: "Public Works Department",
      startup_id: 4,
      startup_name: "AquaTech Labs",
      dpiit_number: "DIPP62310",
      status: "Under Review",
      proposal_summary: "Non-invasive ultrasonic clamp-on sensors with cellular NB-IoT telemetry to monitor water supply mains.",
      proposed_budget: "₹32,00,000",
      proposed_timeline: "90 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 78.0,
      submitted_at: "2026-09-25"
    },
    {
      id: 5,
      challenge_id: 5,
      challenge_title: "Automated Pothole Detection & Road Quality Mapping",
      department: "Urban Development Department",
      startup_id: 6,
      startup_name: "CivicPulse Insights",
      dpiit_number: "DIPP91122",
      status: "Eligible",
      proposal_summary: "Crowdsourced and municipal bus mounted vision sensors for automated road roughness index classification.",
      proposed_budget: "₹21,00,000",
      proposed_timeline: "60 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 83.4,
      submitted_at: "2026-09-26"
    },
    {
      id: 6,
      challenge_id: 6,
      challenge_title: "Decentralized Solar Cold Storage for Perishable Crops",
      department: "Department of Agriculture & Farmers Welfare",
      startup_id: 9,
      startup_name: "KrishiSheet ColdTech",
      dpiit_number: "DIPP88312",
      status: "Eligible",
      proposal_summary: "Installation of two 5MT phase-change thermal battery units at mandi yard with digital humidity sensors.",
      proposed_budget: "₹42,00,000",
      proposed_timeline: "120 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 89.0,
      submitted_at: "2026-09-27"
    },
    {
      id: 7,
      challenge_id: 7,
      challenge_title: "AI Point-of-Care Diagnostic Screen for Rural Health Sub-Centres",
      department: "National Health Mission",
      startup_id: 8,
      startup_name: "MedDrishti Telemedicine",
      dpiit_number: "DIPP77419",
      status: "Eligible",
      proposal_summary: "Deployment of 30 diagnostic backpack kits across remote tribal sub-centres with offline AI decision support.",
      proposed_budget: "₹34,00,000",
      proposed_timeline: "90 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 86.2,
      submitted_at: "2026-09-27"
    },
    {
      id: 8,
      challenge_id: 8,
      challenge_title: "Autonomous Drone Surveillance for Forest Fire Early Warning",
      department: "Department of Environment & Forests",
      startup_id: 10,
      startup_name: "VanaDrishti Drones",
      dpiit_number: "DIPP44902",
      status: "Eligible",
      proposal_summary: "Daily autonomous flight schedules over 20,000 hectares of forest reserve with real-time smoke plume coordinates.",
      proposed_budget: "₹44,00,000",
      proposed_timeline: "90 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 91.5,
      submitted_at: "2026-09-28"
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
    },
    {
      id: 2,
      application_id: 3,
      expert_name: "Prof. M. R. Nambiar",
      technical_score: 88,
      innovation_score: 86,
      feasibility_score: 89,
      cost_score: 84,
      team_score: 90,
      total_score: 87.5,
      comments: "EduVision edge TPU implementation satisfies STQC biometric standards. Highly viable for government school pilots.",
      decision: "Approved for Pilot",
      evaluated_at: "2026-09-26"
    },
    {
      id: 3,
      application_id: 6,
      expert_name: "Dr. S. K. Mahapatra",
      technical_score: 90,
      innovation_score: 92,
      feasibility_score: 88,
      cost_score: 82,
      team_score: 92,
      total_score: 89.0,
      comments: "KrishiSheet phase change thermal battery technology eliminates recurring diesel generator operating costs.",
      decision: "Approved for Pilot",
      evaluated_at: "2026-09-27"
    },
    {
      id: 4,
      application_id: 8,
      expert_name: "Er. Alok Ranjan",
      technical_score: 92,
      innovation_score: 94,
      feasibility_score: 90,
      cost_score: 88,
      team_score: 93,
      total_score: 91.5,
      comments: "VanaDrishti dual optical-thermal payload delivers high accuracy early ember detection even in dense canopies.",
      decision: "Approved for Pilot",
      evaluated_at: "2026-09-28"
    },
    {
      id: 5,
      application_id: 2,
      expert_name: "Dr. K. S. Sharma",
      technical_score: 82,
      innovation_score: 80,
      feasibility_score: 84,
      cost_score: 79,
      team_score: 81,
      total_score: 81.2,
      comments: "Route optimization algorithm requires additional validation under peak traffic congestion parameters.",
      decision: "Request Changes",
      evaluated_at: "2026-09-24"
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
    },
    {
      id: 2,
      challenge_id: 2,
      challenge_title: "Automated School Attendance Verification",
      department: "School Education Department",
      startup_id: 3,
      startup_name: "EduVision",
      status: "In Progress",
      start_date: "2026-08-15",
      milestones_completed: 2,
      kpi_achieved: "99.1% recognition",
      milestone1_title: "Edge TPU Hardware Installation (50 Schools)",
      milestone1_status: "Completed",
      milestone2_title: "Student Enrollment & Verification Pilot",
      milestone2_status: "Completed",
      milestone3_title: "Attendance Database Stress Testing",
      milestone3_status: "In Progress",
      milestone4_title: "STQC Security & Privacy Audit",
      milestone4_status: "In Progress"
    },
    {
      id: 3,
      challenge_id: 6,
      challenge_title: "Decentralized Solar Cold Storage for Perishable Crops",
      department: "Department of Agriculture & Farmers Welfare",
      startup_id: 9,
      startup_name: "KrishiSheet ColdTech",
      status: "In Progress",
      start_date: "2026-08-20",
      milestones_completed: 3,
      kpi_achieved: "38% spoilage reduction",
      milestone1_title: "Site Preparation & Thermal Chamber Assembly",
      milestone1_status: "Completed",
      milestone2_title: "Solar Rooftop & PCM Charging Integration",
      milestone2_status: "Completed",
      milestone3_title: "Tomato Produce Spoilage & Temperature Logging",
      milestone3_status: "Completed",
      milestone4_title: "ICAR Agricultural Audit & Certification",
      milestone4_status: "In Progress"
    },
    {
      id: 4,
      challenge_id: 8,
      challenge_title: "Autonomous Drone Surveillance for Forest Fire Early Warning",
      department: "Department of Environment & Forests",
      startup_id: 10,
      startup_name: "VanaDrishti Drones",
      status: "Completed",
      start_date: "2026-07-01",
      milestones_completed: 4,
      kpi_achieved: "12 min response alert",
      milestone1_title: "Base Station Antenna & UAV Commissioning",
      milestone1_status: "Completed",
      milestone2_title: "Thermal Mapping of High Risk Ridge Lines",
      milestone2_status: "Completed",
      milestone3_title: "Controlled Burn Flare Detection Verification",
      milestone3_status: "Completed",
      milestone4_title: "Forest Survey Directorate Sign-Off",
      milestone4_status: "Completed"
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
    },
    {
      id: 2,
      pilot_id: 2,
      startup_name: "EduVision",
      challenge_title: "Automated School Attendance Verification",
      accuracy_kpi: "99.1%",
      response_kpi: "1.8 sec/student",
      validation_status: "Validated",
      testing_agency: "STQC IT Directorate & Education Board",
      expert_comments: "Multi-face edge recognition achieved 99.1% accuracy across diverse classroom lighting conditions.",
      govt_feedback: "District Education Officer certified zero false absentees. Recommended for district-wide rollout."
    },
    {
      id: 3,
      pilot_id: 3,
      startup_name: "KrishiSheet ColdTech",
      challenge_title: "Decentralized Solar Cold Storage for Perishable Crops",
      accuracy_kpi: "38% Spoilage Drop",
      response_kpi: "64 hr backup hold",
      validation_status: "Validated",
      testing_agency: "ICAR Agricultural Engineering Institute",
      expert_comments: "Phase change thermal buffer maintained 4°C continuously across 3 consecutive monsoon overcast days.",
      govt_feedback: "Mandi Board certified significant income recovery for local tomato growers."
    },
    {
      id: 4,
      pilot_id: 4,
      startup_name: "VanaDrishti Drones",
      challenge_title: "Autonomous Drone Surveillance for Forest Fire Early Warning",
      accuracy_kpi: "7.4 km detection radius",
      response_kpi: "12 min response alert",
      validation_status: "Validated",
      testing_agency: "Forest Survey Directorate & Remote Sensing Center",
      expert_comments: "Thermal infrared sensors pinpointed test campfires under thick sal tree canopies within 12 minutes.",
      govt_feedback: "Chief Conservator of Forests issued technical validation clearance."
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
    },
    {
      id: 2,
      pilot_id: 2,
      startup_name: "EduVision",
      challenge_title: "Automated School Attendance Verification",
      department: "School Education Department",
      pilot_result: "99.1% Recognition Rate",
      evaluation_score: 87.5,
      decision: "Approved",
      decision_notes: "STQC certification submitted. Direct commercial purchase sanctioned for 150 government secondary schools."
    },
    {
      id: 3,
      pilot_id: 3,
      startup_name: "KrishiSheet ColdTech",
      challenge_title: "Decentralized Solar Cold Storage for Perishable Crops",
      department: "Department of Agriculture & Farmers Welfare",
      pilot_result: "38% Spoilage Reduction",
      evaluation_score: 89.0,
      decision: "Approved",
      decision_notes: "ICAR audit passed. Sanctioned for procurement under State Horticulture Development Mission."
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
      status: "SOLUTION SCALED"
    },
    {
      id: 2,
      startup_name: "EduVision",
      solution_name: "Automated School Attendance Verification",
      department: "School Education Department",
      scale_departments: 3,
      scale_districts: 12,
      total_deployments: 150,
      status: "READY FOR SCALE-UP"
    },
    {
      id: 3,
      startup_name: "VanaDrishti Drones",
      solution_name: "Autonomous Thermal Forest Fire Early Alert UAS",
      department: "Department of Environment & Forests",
      scale_departments: 2,
      scale_districts: 8,
      total_deployments: 16,
      status: "READY FOR SCALE-UP"
    }
  ],

  documents: [
    { id: 1, title: "Municipal Water Leakage Problem Specification", category: "Problem Statement", file_name: "PWD-CHAL-2026-03.pdf", file_size: "1.4 MB", upload_date: "2026-09-20", status: "Active" },
    { id: 2, title: "DPIIT Startup Recognition Certificate — WaterSense", category: "Startup Registration", file_name: "DIPP78214-CERT.pdf", file_size: "620 KB", upload_date: "2026-09-21", status: "Verified" },
    { id: 3, title: "Field Pilot Technical Proposal — WaterSense", category: "Technical Proposal", file_name: "WaterSense-Proposal-v2.pdf", file_size: "3.8 MB", upload_date: "2026-09-24", status: "Approved" },
    { id: 4, title: "Controlled Field Pilot Agreement (3 Months) — PWD & WaterSense", category: "Pilot Agreement", file_name: "Pilot-Agreement-PWD-WS.pdf", file_size: "2.1 MB", upload_date: "2026-08-01", status: "Signed" },
    { id: 5, title: "National Water Academy Third-Party Audit Report", category: "Validation Report", file_name: "NWA-Validation-Report-2026.pdf", file_size: "4.5 MB", upload_date: "2026-09-26", status: "Certified" },
    { id: 6, title: "Procurement Sanction Order (GFR Rule 149 Relaxation)", category: "Procurement Decision", file_name: "Procurement-Sanction-0926.pdf", file_size: "1.1 MB", upload_date: "2026-09-27", status: "Sanctioned" },
    { id: 7, title: "STQC Biometric Security Certification — EduVision", category: "Validation Report", file_name: "STQC-EDUV-2026.pdf", file_size: "2.9 MB", upload_date: "2026-09-26", status: "Certified" },
    { id: 8, title: "ICAR Agricultural Cold Chain Benchmark Validation Report", category: "Validation Report", file_name: "ICAR-KRISHI-0926.pdf", file_size: "3.4 MB", upload_date: "2026-09-27", status: "Certified" },
    { id: 9, title: "DGCA UAS Type Approval Certificate — VanaDrishti", category: "Startup Registration", file_name: "DGCA-UAS-VANA-2026.pdf", file_size: "1.8 MB", upload_date: "2026-07-15", status: "Verified" },
    { id: 10, title: "Multi-District Scale-Up Deployment Sanction Order", category: "Procurement Decision", file_name: "Scale-Sanction-Order-2026.pdf", file_size: "1.3 MB", upload_date: "2026-09-28", status: "Sanctioned" }
  ],

  notifications: [
    { id: 1, title: "New Application Received", message: "WaterSense submitted proposal for AI Water Leakage Detection.", is_read: 0 },
    { id: 2, title: "Pilot Benchmark Ready", message: "WaterSense completed Milestone 3 ground truth validation tests.", is_read: 0 },
    { id: 3, title: "Procurement Sanction Ready", message: "National Water Academy audit report received. Sanction order ready.", is_read: 0 },
    { id: 4, title: "New Candidate Proposal", message: "KrishiSheet ColdTech applied for Decentralized Solar Cold Storage.", is_read: 0 },
    { id: 5, title: "Evaluation Required", message: "VanaDrishti Drones proposal submitted for Forest Fire Early Warning.", is_read: 0 },
    { id: 6, title: "Scale-Up Authorization Completed", message: "Statewide expansion authorized for WaterSense across 5 departments.", is_read: 1 }
  ]
};

// Initialize localStorage with seed data if not present or needs updating
function getLocalStore() {
  const stored = localStorage.getItem('procure_portal_data');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // If store is older schema with fewer items, refresh with richer seed
      if (parsed.challenges && parsed.challenges.length >= 8) {
        return parsed;
      }
    } catch (e) {
      console.warn("Resetting corrupt store");
    }
  }
  localStorage.setItem('procure_portal_data', JSON.stringify(SEED_DATA));
  return JSON.parse(JSON.stringify(SEED_DATA));
}

function saveLocalStore(data) {
  localStorage.setItem('procure_portal_data', JSON.stringify(data));
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
      localStorage.removeItem('procure_portal_data');
      return mockResponse({ success: true, message: "Reset to initial state." });
    }

    return mockResponse({ message: "OK" });
  }

  return originalFetch(resource, options);
};

export default {};
