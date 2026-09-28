/**
 * Procure Government Portal (Prototype) — Client-Side Mock API Interceptor for Vercel Deployments
 * Transparently falls back to pre-seeded localStorage dataset when running on Vercel or when backend is unreachable.
 */

const SEED_DATA = {
  version: 4,
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
      applications_count: 3,
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
      applications_count: 3,
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
      applications_count: 2,
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
      applications_count: 3,
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
      applications_count: 1,
      created_at: "2026-09-27"
    },
    {
      id: 8,
      title: "Autonomous Drone Surveillance for Forest Fire Early Warning",
      department: "Department of Environment & Forests",
      problem_description: "Autonomous thermal-infrared long-range drone patrols over dry deciduous forest tracts to detect micro-smoke plumes.",
      expected_outcome: "Alert fire ranger beat officers within 15 minutes of ignition to contain ground fires before crown burns.",
      required_technology: "Autonomous UAVs, Thermal Infrared, Edge Computer Vision",
      budget_range: "₹32,00,000 - ₹55,00,000",
      pilot_duration: "3 Months",
      eligibility_requirements: "DPIIT recognized, DGCA type-certified UAS manufacturer",
      expected_kpis: "Detection of 0.5m embers from 300m altitude within 10 minutes",
      submission_deadline: "2026-12-15",
      status: "Pilot",
      stage: "Controlled Field Pilot",
      applications_count: 1,
      created_at: "2026-09-28"
    },
    {
      id: 9,
      title: "Smart Urban Traffic Adaptive Signal Control",
      department: "Traffic Police & Transport Department",
      problem_description: "AI-driven visual queue length calculation and dynamic green light duration adjustment at 24 busy metropolitan intersections.",
      expected_outcome: "Reduce peak hour vehicular congestion delay by 25% and prioritize emergency corridor transits.",
      required_technology: "Computer Vision, Edge Inference, Traffic Controller API",
      budget_range: "₹30,00,000 - ₹48,00,000",
      pilot_duration: "3 Months",
      eligibility_requirements: "DPIIT recognized, proven intersection control hardware telemetry",
      expected_kpis: "20% reduction in vehicle wait idling, zero controller desync incidents",
      submission_deadline: "2026-12-20",
      status: "Open",
      stage: "Startup Discovery",
      applications_count: 1,
      created_at: "2026-09-28"
    },
    {
      id: 10,
      title: "Groundwater Aquifer Depletion & Quality Telemetry Mesh",
      department: "Water Resources & Ground Water Authority",
      problem_description: "Deep borewell hydro-acoustic probes continuously tracking subterranean water table drops and salinity ingress in over-exploited blocks.",
      expected_outcome: "Digital dashboard warning of critical dry zones and contamination ingress before seasonal pump failure.",
      required_technology: "Hydrostatic Level Sensors, Sub-GHz Mesh Telemetry, Cloud Analytics",
      budget_range: "₹26,00,000 - ₹42,00,000",
      pilot_duration: "4 Months",
      eligibility_requirements: "DPIIT recognized, CGWB calibrated sensor instrumentation",
      expected_kpis: "99% transmission reliability through subsurface depths up to 250m",
      submission_deadline: "2026-12-25",
      status: "Evaluation",
      stage: "Expert Evaluation",
      applications_count: 2,
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
    },
    {
      id: 11,
      name: "GatiMarg AI",
      founder: "Siddharth Sen & Bhavna Patel",
      solution: "Adaptive Traffic Queue Signal Controller",
      industry: "Urban Mobility & Smart Cities",
      technology: "Computer Vision / Edge ML / ITS Controller",
      years_experience: 3,
      dpiit_recognized: 1,
      dpiit_number: "DIPP55819",
      team_size: 12,
      description: "GatiMarg AI installs edge vision sensors on intersection gantry poles to dynamically regulate green signal cycles according to real-time traffic volume.",
      previous_projects: "Thane Traffic Police 10-junction pilot, Ahmedabad BRTS corridor trial.",
      is_eligible: 1,
      matchScore: 84,
      location: "Mumbai, Maharashtra"
    },
    {
      id: 12,
      name: "BhuJal Analytics",
      founder: "Naveen Reddy & Archana Das",
      solution: "Subterranean Groundwater Table Probe Telemetry",
      industry: "Water Resources",
      technology: "Hydrostatic Probes / Sub-GHz Mesh / Cloud GIS",
      years_experience: 4,
      dpiit_recognized: 1,
      dpiit_number: "DIPP66103",
      team_size: 15,
      description: "BhuJal Analytics deploys ruggedized deep borehole sensors that deliver hourly groundwater level and salinity trends via long-range mesh radio.",
      previous_projects: "Telangana Mission Bhagiratha recharge aquifer trial, CGWB Anantapur block pilot.",
      is_eligible: 1,
      matchScore: 86,
      location: "Hyderabad, Telangana"
    },
    {
      id: 13,
      name: "SwachhVayu Systems",
      founder: "Manish Agarwal & Sonia Bose",
      solution: "Low-Power Ambient PM2.5 Micro-Scrubbers",
      industry: "Environmental Tech",
      technology: "Electrostatic Precipitators / IoT Air Telemetry",
      years_experience: 2,
      dpiit_recognized: 1,
      dpiit_number: "DIPP71904",
      team_size: 10,
      description: "SwachhVayu deploys low-drag electrostatic air filtration nodes on street light poles to scrub particulate matter in urban hotspots.",
      previous_projects: "Kanpur industrial belt air quality mitigation trial.",
      is_eligible: 1,
      matchScore: 79,
      location: "Lucknow, Uttar Pradesh"
    },
    {
      id: 14,
      name: "NetraSuraksha AI",
      founder: "Arun Pandian & Deepa Nair",
      solution: "Privacy-Preserving Edge Video Surveillance",
      industry: "Public Safety & AI",
      technology: "Edge TPU / Computer Vision / Anomaly Detection",
      years_experience: 3,
      dpiit_recognized: 1,
      dpiit_number: "DIPP83210",
      team_size: 14,
      description: "NetraSuraksha builds edge-processed video analytics for crowd management, perimeter breaches, and child safety in public infrastructure.",
      previous_projects: "Tirupati Pilgrim Queue Management System, Chennai Metro rail trial.",
      is_eligible: 1,
      matchScore: 82,
      location: "Coimbatore, Tamil Nadu"
    },
    {
      id: 15,
      name: "KisanDoot BioTech",
      founder: "Gopal Krishna & Shweta Joshi",
      solution: "Spectroscopic Soil Nutrient & Nitrate Probes",
      industry: "Agriculture Technology",
      technology: "NIR Spectrometry / IoT / Agronomic AI",
      years_experience: 3,
      dpiit_recognized: 1,
      dpiit_number: "DIPP94012",
      team_size: 11,
      description: "KisanDoot manufactures portable handheld soil spectroscopy devices providing instant NPK and moisture readouts in 90 seconds without chemical reagents.",
      previous_projects: "Vidarbha cotton belt soil health card digitization trial.",
      is_eligible: 1,
      matchScore: 86,
      location: "Nagpur, Maharashtra"
    },
    {
      id: 16,
      name: "SetuCyber Shield",
      founder: "Aditya Singhal & Rashi Gupta",
      solution: "Government e-Portal Zero-Trust Vulnerability Sensor",
      industry: "Cybersecurity & GovTech",
      technology: "Zero-Trust Architecture / Threat Intel / WAF",
      years_experience: 4,
      dpiit_recognized: 1,
      dpiit_number: "DIPP38901",
      team_size: 17,
      description: "SetuCyber provides automated vulnerability scanners and real-time behavioral DDoS mitigation specialized for state portal architectures.",
      previous_projects: "Haryana State Data Centre compliance audit, CERT-In advisory integration.",
      is_eligible: 1,
      matchScore: 81,
      location: "Gurugram, Haryana"
    }
  ],

  // EXACTLY 20 APPLICATIONS AS REQUESTED
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
      evaluation_score: 87.2,
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
      proposed_budget: "₹19,80,000",
      proposed_timeline: "75 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 0,
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
      proposed_budget: "₹28,00,000",
      proposed_timeline: "100 Days",
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
      proposed_budget: "₹34,00,000",
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
    },
    {
      id: 9,
      challenge_id: 3,
      challenge_title: "AI-Based Water Leakage Detection",
      department: "Public Works Department",
      startup_id: 5,
      startup_name: "PipeAI Innovations",
      dpiit_number: "DIPP41108",
      status: "Under Review",
      proposal_summary: "Robotic crawler internal pipe visual inspections inside 5km trunk line during night pressure tests.",
      proposed_budget: "₹32,00,000",
      proposed_timeline: "75 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 0,
      checklist_compliance: 1,
      evaluation_score: 75.5,
      submitted_at: "2026-09-25"
    },
    {
      id: 10,
      challenge_id: 6,
      challenge_title: "Decentralized Solar Cold Storage for Perishable Crops",
      department: "Department of Agriculture & Farmers Welfare",
      startup_id: 7,
      startup_name: "GreenWatts Grid",
      dpiit_number: "DIPP33901",
      status: "Eligible",
      proposal_summary: "Hybrid solar rooftop with integrated BESS battery pack to maintain chiller cold chain temperatures uninterrupted.",
      proposed_budget: "₹48,00,000",
      proposed_timeline: "150 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 88.0,
      submitted_at: "2026-09-26"
    },
    {
      id: 11,
      challenge_id: 9,
      challenge_title: "Smart Urban Traffic Adaptive Signal Control",
      department: "Traffic Police & Transport Department",
      startup_id: 11,
      startup_name: "GatiMarg AI",
      dpiit_number: "DIPP55819",
      status: "Eligible",
      proposal_summary: "Computer vision intersection edge units delivering dynamic green split adjustments across 24 critical junctions.",
      proposed_budget: "₹36,00,000",
      proposed_timeline: "90 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 84.0,
      submitted_at: "2026-09-27"
    },
    {
      id: 12,
      challenge_id: 10,
      challenge_title: "Groundwater Aquifer Depletion & Quality Telemetry Mesh",
      department: "Water Resources & Ground Water Authority",
      startup_id: 12,
      startup_name: "BhuJal Analytics",
      dpiit_number: "DIPP66103",
      status: "Eligible",
      proposal_summary: "Mesh-connected digital piezometers and conductivity probes deployed across 30 state monitoring borewells.",
      proposed_budget: "₹29,50,000",
      proposed_timeline: "90 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 85.5,
      submitted_at: "2026-09-28"
    },
    {
      id: 13,
      challenge_id: 4,
      challenge_title: "Real-Time Industrial Effluent Monitoring",
      department: "Pollution Control Board",
      startup_id: 13,
      startup_name: "SwachhVayu Systems",
      dpiit_number: "DIPP71904",
      status: "Under Review",
      proposal_summary: "Integration of optical spectrometry probes at factory outlet canals with tamper-proof automated alerts.",
      proposed_budget: "₹26,00,000",
      proposed_timeline: "60 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 0,
      checklist_compliance: 1,
      evaluation_score: 79.0,
      submitted_at: "2026-09-26"
    },
    {
      id: 14,
      challenge_id: 2,
      challenge_title: "Automated School Attendance Verification",
      department: "School Education Department",
      startup_id: 14,
      startup_name: "NetraSuraksha AI",
      dpiit_number: "DIPP83210",
      status: "Under Review",
      proposal_summary: "Dual camera doorway units with privacy blurring and localized edge face feature matching.",
      proposed_budget: "₹31,00,000",
      proposed_timeline: "90 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 0,
      evaluation_score: 82.5,
      submitted_at: "2026-09-24"
    },
    {
      id: 15,
      challenge_id: 6,
      challenge_title: "Decentralized Solar Cold Storage for Perishable Crops",
      department: "Department of Agriculture & Farmers Welfare",
      startup_id: 15,
      startup_name: "KisanDoot BioTech",
      dpiit_number: "DIPP94012",
      status: "Eligible",
      proposal_summary: "Cold storage temperature and atmospheric nitrogen balance logging system with farmer mobile alerts.",
      proposed_budget: "₹38,00,000",
      proposed_timeline: "120 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 86.0,
      submitted_at: "2026-09-27"
    },
    {
      id: 16,
      challenge_id: 2,
      challenge_title: "Automated School Attendance Verification",
      department: "School Education Department",
      startup_id: 16,
      startup_name: "SetuCyber Shield",
      dpiit_number: "DIPP38901",
      status: "Eligible",
      proposal_summary: "End-to-end cryptographic encryption layer securing student biometric hashes from edge nodes to cloud repository.",
      proposed_budget: "₹22,00,000",
      proposed_timeline: "60 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 80.5,
      submitted_at: "2026-09-25"
    },
    {
      id: 17,
      challenge_id: 1,
      challenge_title: "Smart Waste Collection & Route Optimization",
      department: "Municipal Administration",
      startup_id: 5,
      startup_name: "PipeAI Innovations",
      dpiit_number: "DIPP41108",
      status: "Under Review",
      proposal_summary: "Automated robotic crawler visual inspection of municipal stormwater drop inlets and trash choke points.",
      proposed_budget: "₹18,00,000",
      proposed_timeline: "60 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 76.0,
      submitted_at: "2026-09-24"
    },
    {
      id: 18,
      challenge_id: 5,
      challenge_title: "Automated Pothole Detection & Road Quality Mapping",
      department: "Urban Development Department",
      startup_id: 2,
      startup_name: "EcoTrack",
      dpiit_number: "DIPP54129",
      status: "Eligible",
      proposal_summary: "Integration of vibration logging and optical distress detection on municipal transit bus fleets.",
      proposed_budget: "₹24,00,000",
      proposed_timeline: "90 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 83.0,
      submitted_at: "2026-09-25"
    },
    {
      id: 19,
      challenge_id: 10,
      challenge_title: "Groundwater Aquifer Depletion & Quality Telemetry Mesh",
      department: "Water Resources & Ground Water Authority",
      startup_id: 1,
      startup_name: "WaterSense",
      dpiit_number: "DIPP78214",
      status: "Eligible",
      proposal_summary: "Subterranean acoustic pulse logging to monitor water table drawdown in critical drought blocks.",
      proposed_budget: "₹33,00,000",
      proposed_timeline: "90 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 87.0,
      submitted_at: "2026-09-27"
    },
    {
      id: 20,
      challenge_id: 1,
      challenge_title: "Smart Waste Collection & Route Optimization",
      department: "Municipal Administration",
      startup_id: 8,
      startup_name: "MedDrishti Telemedicine",
      dpiit_number: "DIPP77419",
      status: "Eligible",
      proposal_summary: "Sanitation worker wearable biometrics and route environmental exposure telemetry kit.",
      proposed_budget: "₹27,50,000",
      proposed_timeline: "75 Days",
      checklist_dpiit: 1,
      checklist_documents: 1,
      checklist_technology: 1,
      checklist_experience: 1,
      checklist_compliance: 1,
      evaluation_score: 84.5,
      submitted_at: "2026-09-28"
    }
  ],

  evaluations: [
    {
      id: 1,
      application_id: 1,
      expert_name: "Dr. M. S. Swaminathan (IIT Roorkee / CPWD Advisory)",
      technical_score: 88,
      innovation_score: 92,
      feasibility_score: 86,
      cost_score: 80,
      team_score: 90,
      total_score: 87.2,
      comments: "WaterSense presents a mathematically rigorous acoustic waveform analysis method. Field sensor hardware is IP68 ruggedized and field-hardened.",
      decision: "Approved for Pilot",
      evaluated_at: "2026-09-25"
    },
    {
      id: 2,
      application_id: 3,
      expert_name: "Prof. Sunita Raman (IIIT Hyderabad / AI Mission)",
      technical_score: 88,
      innovation_score: 86,
      feasibility_score: 89,
      cost_score: 84,
      team_score: 90,
      total_score: 87.5,
      comments: "EduVision edge TPU implementation satisfies STQC biometric standards. Highly viable for 50 government school entrance gates.",
      decision: "Approved for Pilot",
      evaluated_at: "2026-09-26"
    },
    {
      id: 3,
      application_id: 6,
      expert_name: "Dr. S. K. Mahapatra (ICAR Agricultural Engineering Institute)",
      technical_score: 90,
      innovation_score: 92,
      feasibility_score: 88,
      cost_score: 82,
      team_score: 92,
      total_score: 89.0,
      comments: "KrishiSheet phase change thermal battery technology eliminates recurring diesel generator operating costs for remote farm clusters.",
      decision: "Approved for Pilot",
      evaluated_at: "2026-09-27"
    },
    {
      id: 4,
      application_id: 8,
      expert_name: "Er. Alok Ranjan (Forest Survey Directorate)",
      technical_score: 92,
      innovation_score: 94,
      feasibility_score: 90,
      cost_score: 88,
      team_score: 93,
      total_score: 91.5,
      comments: "VanaDrishti dual optical-thermal payload delivers high accuracy early ember detection even in dense sal tree canopies.",
      decision: "Approved for Pilot",
      evaluated_at: "2026-09-28"
    },
    {
      id: 5,
      application_id: 5,
      expert_name: "Er. K. L. Narayanan (NIC Technical Director Retd.)",
      technical_score: 85,
      innovation_score: 84,
      feasibility_score: 86,
      cost_score: 80,
      team_score: 82,
      total_score: 83.4,
      comments: "CivicPulse road roughness algorithm matches IRC (Indian Roads Congress) surface specification requirements.",
      decision: "Approved for Pilot",
      evaluated_at: "2026-09-26"
    },
    {
      id: 6,
      application_id: 7,
      expert_name: "Dr. Aruna Sundaram (AIIMS / National Health Mission)",
      technical_score: 88,
      innovation_score: 86,
      feasibility_score: 85,
      cost_score: 84,
      team_score: 88,
      total_score: 86.2,
      comments: "MedDrishti point-of-care backpack demonstrates excellent battery autonomy and offline telemetry for tribal health sub-centres.",
      decision: "Approved for Pilot",
      evaluated_at: "2026-09-27"
    },
    {
      id: 7,
      application_id: 12,
      expert_name: "Dr. Ramesh Chandra (Central Ground Water Board)",
      technical_score: 86,
      innovation_score: 87,
      feasibility_score: 86,
      cost_score: 82,
      team_score: 86,
      total_score: 85.5,
      comments: "BhuJal hydrostatic probes provide stable pressure calibration without sensor drift under deep borehole hydrostatic heads.",
      decision: "Approved for Pilot",
      evaluated_at: "2026-09-28"
    },
    {
      id: 8,
      application_id: 2,
      expert_name: "Er. S. K. Sharma (State Pollution Control Board)",
      technical_score: 82,
      innovation_score: 80,
      feasibility_score: 84,
      cost_score: 79,
      team_score: 81,
      total_score: 81.2,
      comments: "Route optimization algorithm requires additional validation under heavy monsoon traffic congestion parameters.",
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
      milestone1_title: "Initial Sensor Mesh Deployment (60 Nodes)",
      milestone1_status: "Completed",
      milestone2_title: "Acoustic Telemetry & Baseline Calibration",
      milestone2_status: "Completed",
      milestone3_title: "Ground-Truth Leak Pinpoint Testing",
      milestone3_status: "Completed",
      milestone4_title: "Third-Party Benchmark Validation & Dossier",
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
      milestone2_title: "Student Enrollment & Multi-Face Verification",
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
      milestone3_title: "Produce Spoilage & Temperature Logging",
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
    },
    {
      id: 5,
      challenge_id: 4,
      challenge_title: "Real-Time Industrial Effluent Monitoring",
      department: "Pollution Control Board",
      startup_id: 6,
      startup_name: "CivicPulse Insights",
      status: "Completed",
      start_date: "2026-05-15",
      milestones_completed: 4,
      kpi_achieved: "93.5% auto-classification",
      milestone1_title: "Drainage Gate Sensor Fixturing",
      milestone1_status: "Completed",
      milestone2_title: "BOD/COD Spectrometry Telemetry Setup",
      milestone2_status: "Completed",
      milestone3_title: "Automated Pollution Alert Dispatch",
      milestone3_status: "Completed",
      milestone4_title: "Independent Third-Party CPCB Audit",
      milestone4_status: "Completed"
    },
    {
      id: 6,
      challenge_id: 5,
      challenge_title: "Automated Pothole Detection & Road Quality Mapping",
      department: "Urban Development Department",
      startup_id: 7,
      startup_name: "GreenWatts Grid",
      status: "Completed",
      start_date: "2026-01-10",
      milestones_completed: 4,
      kpi_achieved: "18.6% tariff savings",
      milestone1_title: "Substation SCADA Interfacing",
      milestone1_status: "Completed",
      milestone2_title: "Peak Tariff Dispatch Testing",
      milestone2_status: "Completed",
      milestone3_title: "Battery Life Optimization Audit",
      milestone3_status: "Completed",
      milestone4_title: "State Regulatory Commission Clearance",
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
      govt_feedback: "Verified by Executive Engineer field team. Recommended for commercial procurement under GFR 149."
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
    },
    {
      id: 5,
      pilot_id: 5,
      startup_name: "CivicPulse Insights",
      challenge_title: "Real-Time Industrial Effluent Monitoring",
      accuracy_kpi: "93.5% Auto-Detection",
      response_kpi: "45 min routing time",
      validation_status: "Validated",
      testing_agency: "Centre for Good Governance & CPCB",
      expert_comments: "Continuous spectrometry telemetry identified 100% of simulated toxic chemical discharge surges.",
      govt_feedback: "Pollution Control Board issued compliance certification."
    },
    {
      id: 6,
      pilot_id: 6,
      startup_name: "GreenWatts Grid",
      challenge_title: "Automated Pothole Detection & Road Quality Mapping",
      accuracy_kpi: "18.6% Bill Reduction",
      response_kpi: "82.4% Captive Solar",
      validation_status: "Validated",
      testing_agency: "National Institute of Solar Energy",
      expert_comments: "Verified by State Energy Regulatory Commission meters over 180 continuous operating days.",
      govt_feedback: "Significant tariff reduction achieved on commercial grid power draw."
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
      evaluation_score: 87.2,
      decision: "Under Procurement Review",
      decision_notes: "Pilot performance validated by National Water Academy. Direct procurement approved under GFR Rule 149 relaxation."
    },
    {
      id: 2,
      pilot_id: 5,
      startup_name: "CivicPulse Insights",
      challenge_title: "Real-Time Industrial Effluent Monitoring",
      department: "Pollution Control Board",
      pilot_result: "93.5% KPI Achievement",
      evaluation_score: 88.6,
      decision: "Approved",
      decision_notes: "Approved under Special Public Procurement Framework for Startups. Annual state license contract executed."
    },
    {
      id: 3,
      pilot_id: 4,
      startup_name: "VanaDrishti Drones",
      challenge_title: "Autonomous Drone Surveillance for Forest Fire Early Warning",
      department: "Department of Environment & Forests",
      pilot_result: "12 min Alert Response (All KPIs Exceeded)",
      evaluation_score: 91.5,
      decision: "Approved",
      decision_notes: "Procurement sanctioned for state wildlife division under special disaster management innovation provisions."
    },
    {
      id: 4,
      pilot_id: 3,
      startup_name: "KrishiSheet ColdTech",
      challenge_title: "Decentralized Solar Cold Storage for Perishable Crops",
      department: "Department of Agriculture & Farmers Welfare",
      pilot_result: "38% Spoilage Reduction",
      evaluation_score: 89.0,
      decision: "Approved",
      decision_notes: "ICAR audit passed. Sanctioned for procurement under State Horticulture Development Mission."
    },
    {
      id: 5,
      pilot_id: 2,
      startup_name: "EduVision",
      challenge_title: "Automated School Attendance Verification",
      department: "School Education Department",
      pilot_result: "99.1% Recognition Rate",
      evaluation_score: 87.5,
      decision: "Under Procurement Review",
      decision_notes: "STQC certification submitted. Direct commercial purchase pending Competent Authority sign-off."
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
    },
    {
      id: 2,
      startup_name: "CivicPulse Insights",
      solution_name: "Real-Time Industrial Effluent Monitoring",
      department: "Pollution Control Board",
      scale_departments: 5,
      scale_districts: 20,
      total_deployments: 25,
      status: "SOLUTION SCALED"
    },
    {
      id: 3,
      startup_name: "VanaDrishti Drones",
      solution_name: "Autonomous Thermal Forest Fire Early Alert UAS",
      department: "Department of Environment & Forests",
      scale_departments: 2,
      scale_districts: 8,
      total_deployments: 16,
      status: "SOLUTION SCALED"
    },
    {
      id: 4,
      startup_name: "KrishiSheet ColdTech",
      solution_name: "Decentralized Thermal Battery Solar Cold Storage",
      department: "Department of Agriculture & Farmers Welfare",
      scale_departments: 3,
      scale_districts: 14,
      total_deployments: 32,
      status: "READY FOR SCALE-UP"
    },
    {
      id: 5,
      startup_name: "EduVision",
      solution_name: "Automated School Attendance Verification",
      department: "School Education Department",
      scale_departments: 3,
      scale_districts: 12,
      total_deployments: 150,
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
    { id: 10, title: "Multi-District Scale-Up Deployment Sanction Order", category: "Procurement Decision", file_name: "Scale-Sanction-Order-2026.pdf", file_size: "1.3 MB", upload_date: "2026-09-28", status: "Sanctioned" },
    { id: 11, title: "Municipal Solid Waste RFP Specifications", category: "Problem Statement", file_name: "MUNICIPAL-SWM-2026.pdf", file_size: "2.2 MB", upload_date: "2026-09-18", status: "Active" },
    { id: 12, title: "DPDP Act 2023 Data Privacy Audit Certificate — CivicPulse", category: "Validation Report", file_name: "DPDP-AUDIT-CIVIC.pdf", file_size: "940 KB", upload_date: "2026-08-20", status: "Certified" },
    { id: 13, title: "Central Ground Water Board Sensor Calibration Report", category: "Validation Report", file_name: "CGWB-BHUJAL-0926.pdf", file_size: "1.6 MB", upload_date: "2026-09-28", status: "Verified" },
    { id: 14, title: "Tripartite Scale-Up Agreement (State Mission + Startup + Discom)", category: "Pilot Agreement", file_name: "TRIPARTITE-SCALE-2026.pdf", file_size: "2.8 MB", upload_date: "2026-09-28", status: "Signed" }
  ],

  notifications: [
    { id: 1, title: "New Application Received", message: "WaterSense submitted proposal for AI Water Leakage Detection.", is_read: 0 },
    { id: 2, title: "Pilot Benchmark Ready", message: "WaterSense completed Milestone 3 ground truth validation tests.", is_read: 0 },
    { id: 3, title: "Procurement Sanction Ready", message: "National Water Academy audit report received. Sanction order ready.", is_read: 0 },
    { id: 4, title: "New Candidate Proposal", message: "KrishiSheet ColdTech applied for Decentralized Solar Cold Storage.", is_read: 0 },
    { id: 5, title: "Evaluation Required", message: "VanaDrishti Drones proposal submitted for Forest Fire Early Warning.", is_read: 0 },
    { id: 6, title: "Scale-Up Authorization Completed", message: "Statewide expansion authorized for WaterSense across 5 departments.", is_read: 1 },
    { id: 7, title: "Disbursal Released", message: "Milestone 2 payment of ₹75,000 processed via PFMS for EduVision.", is_read: 0 },
    { id: 8, title: "New Challenge Published", message: "Traffic Police published 'Smart Urban Traffic Adaptive Signal Control'.", is_read: 0 }
  ],

  audit_logs: [
    { id: 1, action: "GFR 2017 Rule 149 Exemption Verified", entity: "Public Works Department", user: "R. K. Sharma (Procurement Officer)", timestamp: "2026-09-28 14:32:00" },
    { id: 2, action: "Milestone Disbursal Approved ₹1,00,000", entity: "PFMS Payment Gateway", user: "Finance Division", timestamp: "2026-09-28 11:15:00" },
    { id: 3, action: "Third-Party Benchmark Certified (94.2% accuracy)", entity: "National Water Academy", user: "Dr. M. S. Swaminathan", timestamp: "2026-09-27 16:45:00" },
    { id: 4, action: "DPIIT Statutory Verification Passed (DIPP78214)", entity: "Startup India Portal API", user: "System Automator", timestamp: "2026-09-27 10:20:00" },
    { id: 5, action: "Role Switched to State Procurement Authority", entity: "Session Controller", user: "Administrative User", timestamp: "2026-09-26 09:00:00" }
  ]
};

// Initialize localStorage with seed data if not present or needs updating
function getLocalStore() {
  // Clean legacy store keys if present
  try {
    localStorage.removeItem('startupbridge_mock_store');
  } catch (e) {}

  const stored = localStorage.getItem('procure_portal_data');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // If store is current version 4 and has all required sample records, return it
      if (
        parsed &&
        parsed.version === 4 &&
        Array.isArray(parsed.applications) &&
        parsed.applications.length >= 20 &&
        Array.isArray(parsed.challenges) &&
        parsed.challenges.length >= 10
      ) {
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
    const isLocalhost = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );

    // On localhost, attempt to fetch from backend server if running
    if (isLocalhost) {
      try {
        const response = await originalFetch(resource, options);
        const contentType = response.headers.get('content-type') || '';
        // Only return if it's a real JSON API response, not an HTML fallback
        if ((response.ok || (response.status >= 200 && response.status < 400)) && contentType.includes('application/json')) {
          return response;
        }
      } catch (err) {
        // Fall through to mock store
      }
    }

    // On Vercel / production or when backend is unavailable,
    // immediately serve from the rich pre-seeded mock store below!

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

    // 0. Overview
    if (pathname === '/api/overview') {
      return mockResponse({
        cards: {
          activeChallenges: store.challenges.length,
          applicationsReceived: store.applications.length,
          pilotsRunning: store.pilots.filter(p => p.status === 'In Progress').length,
          pendingEvaluations: store.evaluations.length,
          procurementDecisions: store.procurement.filter(p => p.decision === 'Approved').length,
          solutionsScaled: store.scale.filter(s => s.status === 'SOLUTION SCALED').length
        },
        pipeline: [
          { stage: 'Startup Discovery', count: store.challenges.filter(c => c.status === 'Open').length },
          { stage: 'Expert Evaluation', count: store.challenges.filter(c => c.status === 'Evaluation').length },
          { stage: 'Controlled Field Pilot', count: store.challenges.filter(c => c.status === 'Pilot').length },
          { stage: 'Performance Validation', count: store.performance.length },
          { stage: 'Procurement Sanction', count: store.procurement.length },
          { stage: 'Statewide Scale-Up', count: store.scale.length }
        ]
      });
    }

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
      const challengeId = parsedUrl.searchParams.get('challengeId');
      const search = parsedUrl.searchParams.get('search');
      let list = [...store.startups];

      if (challengeId) {
        list.sort((a, b) => b.matchScore - a.matchScore);
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(s => s.name.toLowerCase().includes(q) || s.solution.toLowerCase().includes(q));
      }
      return mockResponse(list);
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
          proposal_summary: body.proposal_summary || "Automated innovation proposal submission.",
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
        return mockResponse({ success: true, status: body.status });
      }
    }

    // 6. Performance
    if (pathname === '/api/performance') {
      return mockResponse(store.performance);
    }

    if (pathname.startsWith('/api/performance/') && pathname.endsWith('/validate')) {
      const pilotId = parseInt(pathname.split('/')[3]);
      const perf = store.performance.find(p => p.pilot_id === pilotId) || store.performance[0];
      if (perf) {
        perf.validation_status = 'Validated';
        saveLocalStore(store);
      }
      return mockResponse({ success: true, validationStatus: 'Pilot Successfully Validated' });
    }

    // 7. Procurement
    if (pathname === '/api/procurement') {
      return mockResponse(store.procurement);
    }

    if (pathname.startsWith('/api/procurement/') && pathname.endsWith('/decision')) {
      const procId = parseInt(pathname.split('/')[3]);
      const body = JSON.parse(options.body || '{}');
      const doc = store.procurement.find(p => p.id === procId) || store.procurement[0];
      if (doc) {
        doc.decision = body.action === 'Proceed to Procurement' ? 'PROCUREMENT APPROVED' : body.action;
        doc.decision_notes = body.notes || doc.decision_notes;
        saveLocalStore(store);
      }
      return mockResponse({ success: true, status: 'PROCUREMENT APPROVED' });
    }

    // 8. Scale
    if (pathname === '/api/scale') {
      return mockResponse(store.scale);
    }

    if (pathname.startsWith('/api/scale/')) {
      const scaleId = parseInt(pathname.split('/')[3]);
      const body = JSON.parse(options.body || '{}');
      const item = store.scale.find(s => s.id === scaleId) || store.scale[0];
      if (item) {
        item.status = 'SOLUTION SCALED';
        Object.assign(item, body);
        saveLocalStore(store);
      }
      return mockResponse(item || { status: 'SOLUTION SCALED' });
    }

    // 9. Documents
    if (pathname === '/api/documents') {
      return mockResponse(store.documents);
    }

    // 10. Notifications
    if (pathname === '/api/notifications') {
      return mockResponse(store.notifications);
    }

    if (pathname.startsWith('/api/notifications/') && pathname.endsWith('/read')) {
      const notifId = parseInt(pathname.split('/')[3]);
      const notif = store.notifications.find(n => n.id === notifId);
      if (notif) {
        notif.is_read = 1;
        saveLocalStore(store);
      }
      return mockResponse({ success: true });
    }

    // 11. Payments
    if (pathname === '/api/payments') {
      return mockResponse({
        summary: {
          totalContractValue: 1060000,
          paidAmount: 885000,
          pendingAmount: 175000
        },
        payments: [
          { id: 1, pilot_id: 1, milestone_number: 1, title: "Hardware Deployment", amount: 50000, status: "Paid", paid_date: "2026-06-15", transaction_ref: "PFMS-TXN-2026-8812" },
          { id: 2, pilot_id: 1, milestone_number: 2, title: "Baseline Acoustic Testing", amount: 75000, status: "Paid", paid_date: "2026-07-20", transaction_ref: "PFMS-TXN-2026-9430" },
          { id: 3, pilot_id: 1, milestone_number: 3, title: "Performance Validation", amount: 100000, status: "Pending", paid_date: null, transaction_ref: null }
        ]
      });
    }

    if (pathname.startsWith('/api/payments/') && pathname.endsWith('/pay')) {
      return mockResponse({ success: true, status: 'Paid', transactionRef: 'PFMS-TXN-2026-' + Math.floor(1000 + Math.random() * 9000) });
    }

    // 12. Search
    if (pathname === '/api/search') {
      const q = (parsedUrl.searchParams.get('q') || '').toLowerCase();
      const filteredCh = store.challenges.filter(c => c.title.toLowerCase().includes(q) || c.department.toLowerCase().includes(q));
      const filteredSt = store.startups.filter(s => s.name.toLowerCase().includes(q) || s.solution.toLowerCase().includes(q));
      const filteredPilots = store.pilots.filter(p => p.challenge_title.toLowerCase().includes(q) || p.startup_name.toLowerCase().includes(q));
      return mockResponse({ challenges: filteredCh, startups: filteredSt, pilots: filteredPilots });
    }

    // 13. Audit logs
    if (pathname === '/api/audit-logs') {
      return mockResponse(store.audit_logs || []);
    }

    // 14. Reset
    if (pathname === '/api/reset') {
      localStorage.removeItem('procure_portal_data');
      return mockResponse({ success: true, message: "Reset to initial state." });
    }

    return mockResponse({ message: "OK" });
  }

  return originalFetch(resource, options);
};

export default {};
