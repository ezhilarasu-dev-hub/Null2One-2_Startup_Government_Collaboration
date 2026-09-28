# Procure Government Portal (Prototype)
### Public Procurement & Startup Portal

Procure Government Portal (Prototype) is a dedicated public procurement and startup collaboration portal built to standard government digital service specifications. It provides an evidence-based mechanism for government departments to discover verified deep-tech startups, execute structured field pilots, audit milestone telemetry, and transition proven innovations into direct commercial procurement under public procurement innovation provisions.

---

## 🏛️ System Architecture

- **Frontend**: React 18, Vite, Lucide Icons, Standard Government Web Accessible CSS Design System (Inter typography, government navy `#0B3355`, accessible contrast, clean data tables).
- **Backend**: Node.js & Express REST API.
- **Database**: SQLite database with auto-seeding.
- **Vercel & Offline Readiness**: Built-in mock API fallback interceptor (`client/src/utils/apiInterceptor.js`) ensures the application runs 100% interactively on Vercel serverless/static hosting without requiring external database setups.
- **Role Switching**: Instant role switching between Department, Startup, Evaluator, and Procurement Officer.

---

## 👥 Personas & Roles

1. **Department**: `Rajesh Kumar` (Executive Engineer, Public Works Department)
   - Operational challenge definition and 4-step wizard publishing.
   - Pilot tracking and operational oversight.
2. **Startup**: `Vikram Roy` (Founder & Director, WaterSense Solutions Pvt Ltd)
   - Startup discovery and capability matching.
   - 3-step application flow: `Eligibility → Proposal → Submit`.
3. **Evaluator**: `Dr. K. S. Sharma` (Technical Committee Member, State Technical Advisory Board)
   - 5-criteria objective scoring: Technical Fit, Innovation, Feasibility, Cost, Team.
   - Decision recommendations: `Approve for Pilot` or `Request Changes`.
4. **Procurement Officer**: `Priya Sharma` (Senior Procurement Officer, Public Procurement Division)
   - Commercial sanction decision under pilot innovation provisions.
   - Multi-department and district scale-up management.

---

## 🔄 End-to-End Workflow

1. **Challenges**: Define problem description, target KPIs, duration, and budget.
2. **Startups**: Discovery marketplace with search, industry/technology filters, and match scores.
3. **Applications**: Multi-step application submission and 5-point statutory eligibility checklist.
4. **Evaluations**: Objective technical evaluation scorecard.
5. **Pilots**: Dedicated workspace with 4 milestone gates and lifecycle progression.
6. **Performance**: Audited target vs. actual KPI indicators (Target, Actual, Variance) and validation sign-off.
7. **Procurement**: Evidence-based procurement decision with transparent consequences.
8. **Scale-Up**: Deployment expansion tracking (1 Department → 5 Departments, 20 Districts).

---

## 🚀 Local Development

### 1. Backend Server
```bash
cd server
npm install
node index.js
```
The REST API runs on `http://localhost:5000`.

### 2. Frontend Application
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Run Workflow Verification
```bash
node test_demo_flow.js
```

---

## 🌐 How to Host on Vercel (Step-by-Step Guidance)

The repository has been configured with `vercel.json` and a client-side API fallback, making it ready for instant Vercel deployment.

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Log in to Vercel**:
   Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.

2. **Import Git Repository**:
   - Click **"Add New..."** &rarr; **"Project"**.
   - Select the repository: `Null2One-2_Startup_Government_Collaboration`.

3. **Configure Project Settings**:
   - **Framework Preset**: Select `Vite` (Vercel automatically detects this via `vercel.json`).
   - **Root Directory**: Leave as `./` (or select `client` if deploying frontend directly).
   - **Build Command**: `cd client && npm install && npm run build` (Pre-configured in `vercel.json`).
   - **Output Directory**: `client/dist` (Pre-configured in `vercel.json`).

4. **Deploy**:
   - Click **"Deploy"**.
   - Vercel will build the frontend and provide your live production URL (e.g., `https://procuresetu.vercel.app`).

### Method 2: Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI globally if not already installed
npm install -g vercel

# 2. Deploy from the project root
vercel

# 3. Deploy to production
vercel --prod
```

Because of `client/src/utils/apiInterceptor.js`, your live Vercel deployment will immediately support all interactions:
- Creating and publishing challenges
- Searching startups and viewing profiles
- Submitting applications and verifying statutory checklists
- Scoring technical proposals and approving pilots
- Updating milestone deliverables
- Auditing KPI performance benchmarks
- Executing procurement decisions and statewide scale-up
