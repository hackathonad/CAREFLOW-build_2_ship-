# CareFlow AI — Intelligent Hospital Operations Automation Platform

> **Hackathon Theme: Smart Automation**  
> *Deterministic hospital operational orchestration powered by structured Google Gemini AI parsing.*

---

## 📌 Problem Statement

Modern hospitals waste thousands of critical operational hours on manual phone calls, whiteboard rosters, and fragmented spreadsheets to coordinate:
- Inpatient admissions and emergency transfers
- Departmental bed matching and sanitation turnover
- Specialist physician workload assignments
- Medical oxygen and surgical consumable restocking
- Emergency ambulance dispatch and trauma triage alert routing
- Inter-departmental clinical task follow-ups and administrative authorizations

When manual communication bottlenecks occur, bed turnaround delays increase, physicians suffer unbalanced caseload fatigue, critical supplies drop below safety margins, and patient intake stalls.

---

## 💡 Solution: CareFlow AI

**CareFlow AI** is a production-style **Hospital Operations Automation Platform**. It bridges the gap between natural human intent and deterministic hospital protocol execution:

```
USER DIRECTIVE (Natural Language)
               ↓
BACKEND AI PARSER (Google Gemini 2.5 Flash)
               ↓
ZOD SCHEMA VALIDATION & INTENT CLASSIFICATION
               ↓
MISSING INFORMATION GUARDRAIL (Zero unsafe guesses)
               ↓
DETERMINISTIC AUTOMATION STATE ENGINE (Backend Only)
               ↓
SUPABASE POSTGRESQL + AUDIT TRAILS + DISPATCHED TASKS
               ↓
REAL-TIME OPERATIONAL UI (React + Tailwind CSS)
```

> [!IMPORTANT]
> **Strict Operational Scope**: CareFlow AI is strictly a **hospital operational coordination platform**, NOT a clinical diagnostic or treatment recommendation system. Medical care remains 100% in the hands of physicians.

---

## 🚀 Key Modules & Capabilities

### 1. 🤖 AI Command Center (Visible User Interface)
- Natural language operations dispatch (e.g. *"Admit patient Rahul Sharma to Cardiology"* or *"Dispatch an ambulance to Western Express Highway"*).
- Instant semantic intent detection and operational entity extraction.
- **Safety Guardrail**: Automatically detects missing mandatory parameters (e.g. missing clinic department or preferred appointment slot) and **pauses execution** until confirmed.
- Real-time preview of proposed actions and state execution telemetry.

### 2. 🛏️ Beds & Wards Topology
- Hierarchical multi-tier bed tracking: **ICU, Premium, Semi-Premium, General, Emergency, Observation**.
- Real-time room pod status visualization: **Available (Sterilized), Occupied, Reserved, Maintenance**.
- Interactive bed state modal with one-click status transitions and patient assignment.

### 3. 👥 Patient Operations Registry
- Full inpatient registry with age, gender, stay duration, attending physician, bill accrued, and operational status:
  `Admitted`, `Resting`, `Under Observation`, `Needs Attention`, `Critical`, `Discharge Ready`, `Discharged`.
- Detailed operational file modal with stay metrics, assigned bed/room, next-of-kin contact, and event history.

### 4. 🩺 Physician Workload Balancing
- Real-time duty roster tracking shift schedule, department, availability (`available`, `busy`, `on_call`, `off_duty`), and active caseload.
- Automated allocation algorithm assigns incoming patients to on-duty specialists with the lowest active caseload.

### 5. 📦 Supply & Consumables Inventory
- Real-time stock telemetry for Medical Oxygen (47L), Normal Saline IV, Nitrile Examination Gloves, Defibrillator Pads, and Suture Kits.
- Automated low-stock alerts and threshold-triggered purchase requisitions.
- Quick restock modal with instant balance re-calculation.

### 6. 🚑 Ambulance Fleet & Emergency Triage
- Fleet tracking with vehicle status (`available`, `dispatched`, `en_route`, `at_hospital`, `maintenance`), driver, and equipment tier (ALS/BLS).
- Rapid dispatch modal with automated waypoint assignment and trauma bay notification.

### 7. 📅 Outpatient Consultations
- Scheduled clinic appointments with patient name, doctor, department, time slot, and visit type.
- Instant consultation booking with automated case note preparation tasks.

### 8. 📋 Operational Tasks & Work Orders
- Traceable task roster categorized by department (ICU, Emergency, Biomedical, Billing, Inventory).
- Priority tagging (`Low`, `Medium`, `High`, `Critical`) and one-click completion.

### 9. 🛡️ Administrative Approvals & Risk Overrides
- Governance queue for high-cost replenishment orders, bed over-capacity surge triage, and exception authorizations.
- One-click authorization or rejection with supervisor attribution.

### 10. 🌐 National Health Network & Open Government Reference
- Integrated with Open Government Data (`data.gov.in`, `sikkim.data.gov.in`, `jk.data.gov.in`).
- Searchable directory of public tertiary hospitals, medical colleges, and regional trauma centers.
- Transparent source attribution with resilient local cache fallback.

### 11. 📊 Operational Analytics
- Telemetry dashboards tracking patient intake vs discharge velocity, task turnaround times, and automation decision latencies.

### 12. 📜 Immutable Audit Log
- Chronological, tamper-evident operational event stream recording every bed assignment, automated task, and dispatch run.

---

## 🏗️ Technical Architecture & Tech Stack

```
careflow-ai/
  frontend/                  # React 18 + Vite + TypeScript + Tailwind CSS
    src/
      components/
        landing/             # Header, Hero, Workflow, Features, Footer
        layout/              # AppLayout, Sidebar, Topbar
        dashboard/           # Stats, Alerts, ResourceOverview, Activity
        ai-command-center/   # CommandInput, Result, MissingRequirements, Actions
        patients/            # PatientTable, DetailModal, AdmitModal
        doctors/             # DoctorCard, DoctorTable
        beds/                # WardOccupancyView, BedStatusModal
        inventory/           # InventoryTable, RestockModal
        ambulances/          # AmbulanceCard, DispatchModal
        appointments/        # AppointmentTable, ScheduleModal
        tasks/               # TaskTable, CreateTaskModal
        approvals/           # ApprovalList
        network/             # NetworkFacilityCard
        analytics/           # AnalyticsOverview
        activity/            # ActivityTimeline
        shared/              # DataTable, StatusBadge, StatCard, Modal, EmptyState, LoadingState
      pages/                 # 15 Main routes
      services/              # Axios API clients
      types/                 # Strict TypeScript schemas

  backend/                   # Node.js + Express + TypeScript + Zod
    src/
      config/                # Validated environment loader
      middleware/            # Centralized error handler, request logger, Zod validator
      routes/                # Central API router
      controllers/           # 12 Domain controllers
      services/
        ai/                  # GeminiService (backend only) & AICommandService
        automation/          # AutomationEngine, WorkflowExecutor, ResourceAllocator
        government-data/     # GovernmentDataClient & open data services
        patients/            # Patient CRUD & admission engine
        beds/                # Bed allocation & room topology
        doctors/             # Caseload & roster management
        inventory/           # Inventory threshold & purchase order engine
        ambulances/          # Fleet dispatch & triage alerts
        tasks/               # Operational task orchestrator
        approvals/           # Administrative governance
        audit/               # Traceable event logging
      db/                    # Supabase client + resilient synthetic mock store

  database/
    migrations/
      001_initial_schema.sql # 24 PostgreSQL tables with constraints & indexes
    seed/
      seed.sql               # Rich synthetic demo hospital dataset
    raw-data/                # Curated open government reference datasets
    import/                  # Data loaders
```

---

## 🔒 Security & Safe AI Implementation

1. **Zero Client-Side Secrets**:
   - `GEMINI_API_KEY` exists **STRICTLY** in backend environment variables.
   - Frontend contains zero AI API keys and zero Supabase service-role keys.
2. **Deterministic Business Rules**:
   - Google Gemini classifies human requests into a strict allowlist of 10 authorized intents.
   - Gemini **NEVER** executes arbitrary SQL or modifies tables directly. All mutations occur via hardened backend service methods.
3. **Missing Parameter Safeguard**:
   - If required parameters are missing (e.g. clinic department or time), the automation engine halts and returns structured missing requirements.
4. **Immutable Audit Trails**:
   - Every state change writes an audit record capturing the actor, source, entity type, and parameters.

---

## 🛠️ Local Development & Quick Start

### Prerequisites
- Node.js v18+ or v20+
- npm v9+

### 1. Start Express Backend
```bash
cd careflow-ai/backend
npm install
npm run build
npm start
# Server starts at http://localhost:5000
# Health check available at http://localhost:5000/api/health
```

### 2. Start React Frontend
```bash
cd careflow-ai/frontend
npm install
npm run dev
# Vite dev server starts at http://localhost:5173
```

Visit **`http://localhost:5173`** to test the complete application!

---

## ⚙️ Environment Variables

### Backend (`careflow-ai/backend/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google Gemini API Key (Backend Only - NEVER expose to frontend or git)
GEMINI_API_KEY=your_gemini_api_key

# Supabase PostgreSQL Configuration (Backend Only)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Government Open Data API (data.gov.in)
GOV_DATA_API_KEY=your_gov_data_key
```

### Frontend (`careflow-ai/frontend/.env`)
```env
# ONLY public non-secret configuration
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Validated Test Scenarios

The system has been verified against the test cases:

1. **Patient Admission**:
   - Query: *"Admit patient Rahul Sharma to Cardiology."*
   - Result: Allocates available General/Cardio bed, assigns lowest-workload cardiologist, creates admission tasks, and notifies nursing.
2. **Missing Information Test**:
   - Query: *"Schedule a health checkup for Rahul."*
   - Result: Pauses execution; prompts for missing clinical department and preferred time slot.
3. **Bed Allocation**:
   - Query: *"Find a bed for patient P1005."*
   - Result: Reserves available bed in optimal ward and generates hold order.
4. **Inventory Replenishment**:
   - Query: *"Check which inventory items are below minimum stock."*
   - Result: Identifies critical items (e.g. Oxygen cylinders at 8/15), initiates replenishment request, and routes for approval.
5. **Ambulance Coordination**:
   - Query: *"Assign an ambulance to the emergency request."*
   - Result: Dispatches nearest ALS vehicle, sets route, and alerts trauma emergency dock.
6. **Task Creation**:
   - Query: *"Create a task for the ICU manager."*
   - Result: Generates high-priority work order for ICU supervisor.

---

## 🚢 Production Deployment

Detailed instructions for **Vercel** (Frontend), **Render** (Backend), and **Supabase** (Database) are documented in [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md).
