-- ====================================================================
-- CAREFLOW AI - INITIAL POSTGRESQL SCHEMA MIGRATION
-- Migration: 001_initial_schema.sql
-- Description: Hospital Operations Automation Database Schema
-- Compatible with: Supabase PostgreSQL 15+
-- ====================================================================

-- Enable pgcrypto / uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing schema if necessary (controlled)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS approvals CASCADE;
DROP TABLE IF EXISTS automation_runs CASCADE;
DROP TABLE IF EXISTS workflow_steps CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS checkups CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS ambulance_requests CASCADE;
DROP TABLE IF EXISTS ambulances CASCADE;
DROP TABLE IF EXISTS inventory_transactions CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS patient_status_history CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS beds CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS wards CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;
DROP TABLE IF EXISTS network_facilities CASCADE;

-- 1. HOSPITALS
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(100),
    total_bed_capacity INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. DEPARTMENTS
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    head_name VARCHAR(150),
    floor_level VARCHAR(20),
    contact_ext VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hospital_id, code)
);

-- 3. EMPLOYEES
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(100) NOT NULL,
    shift VARCHAR(50) DEFAULT 'Day', -- Day, Evening, Night, Rotational
    phone VARCHAR(50),
    email VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- active, on_leave, off_duty
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. DOCTORS
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    doctor_code VARCHAR(50) UNIQUE NOT NULL,
    specialization VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    shift VARCHAR(50) DEFAULT 'Morning', -- Morning, Evening, Night, On-Call
    availability VARCHAR(50) DEFAULT 'available', -- available, busy, on_call, off_duty
    workload INTEGER DEFAULT 0, -- Active patient count
    max_workload INTEGER DEFAULT 15,
    contact_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. WARDS
CREATE TABLE wards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    ward_code VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('icu', 'premium', 'semi_premium', 'general', 'emergency', 'observation')),
    floor_number VARCHAR(20),
    total_capacity INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hospital_id, ward_code)
);

-- 6. ROOMS
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id UUID REFERENCES wards(id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    room_type VARCHAR(50) DEFAULT 'Standard',
    max_beds INTEGER DEFAULT 2,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ward_id, room_number)
);

-- 7. BEDS
CREATE TABLE beds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id UUID REFERENCES wards(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    bed_number VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
    is_powered BOOLEAN DEFAULT TRUE,
    notes TEXT,
    last_cleaned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_id, bed_number)
);

-- 8. PATIENTS (Strictly Operational Data)
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(20) NOT NULL,
    admission_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    discharge_date TIMESTAMPTZ,
    ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    bed_id UUID REFERENCES beds(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    department VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'admitted' CHECK (status IN (
        'admitted',
        'resting',
        'under_observation',
        'needs_attention',
        'critical',
        'discharge_ready',
        'discharged'
    )),
    bill_amount NUMERIC(12, 2) DEFAULT 0.00,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. PATIENT STATUS HISTORY
CREATE TABLE patient_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100) DEFAULT 'System Automation',
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. SUPPLIERS
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(50),
    category VARCHAR(100),
    lead_time_days INTEGER DEFAULT 2,
    rating NUMERIC(3, 1) DEFAULT 4.5,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. INVENTORY ITEMS
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- Pharmaceuticals, PPE, Surgical, Consumables, Bedding
    quantity INTEGER NOT NULL DEFAULT 0,
    minimum_threshold INTEGER NOT NULL DEFAULT 10,
    unit VARCHAR(50) NOT NULL, -- units, boxes, vials, packs, pairs
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'normal' CHECK (status IN ('normal', 'low_stock', 'critical', 'out_of_stock')),
    unit_cost NUMERIC(10, 2) DEFAULT 0.00,
    storage_location VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. INVENTORY TRANSACTIONS
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- restock, usage, adjustment, transfer
    quantity_changed INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    reference_reason TEXT,
    performed_by VARCHAR(100) DEFAULT 'Operations Staff',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. AMBULANCES
CREATE TABLE ambulances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    ambulance_code VARCHAR(50) UNIQUE NOT NULL,
    driver VARCHAR(150) NOT NULL,
    driver_phone VARCHAR(50),
    vehicle_status VARCHAR(50) DEFAULT 'available' CHECK (vehicle_status IN ('available', 'dispatched', 'en_route', 'at_hospital', 'maintenance')),
    location TEXT NOT NULL,
    destination TEXT,
    current_request TEXT,
    equipment_level VARCHAR(50) DEFAULT 'Advanced Life Support (ALS)', -- Basic Life Support (BLS), ALS
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. AMBULANCE REQUESTS
CREATE TABLE ambulance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ambulance_id UUID REFERENCES ambulances(id) ON DELETE SET NULL,
    requester_name VARCHAR(150),
    requester_phone VARCHAR(50),
    pickup_location TEXT NOT NULL,
    dropoff_facility TEXT NOT NULL,
    urgency VARCHAR(50) DEFAULT 'high', -- normal, high, critical
    status VARCHAR(50) DEFAULT 'pending', -- pending, assigned, in_transit, completed, cancelled
    dispatch_time TIMESTAMPTZ,
    arrival_time TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 15. APPOINTMENTS
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(150) NOT NULL,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    doctor_name VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    type VARCHAR(50) DEFAULT 'Consultation', -- Consultation, Follow-up, Routine Checkup, Pre-op Review
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled', 'pending')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 16. CHECKUPS (Operational checkup tracking)
CREATE TABLE checkups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    scheduled_time TIMESTAMPTZ NOT NULL,
    completed_time TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 17. TASKS
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    department VARCHAR(100) NOT NULL,
    assigned_employee VARCHAR(150),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'escalated')),
    due_time TIMESTAMPTZ,
    source_workflow VARCHAR(150) DEFAULT 'Manual Ops',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 18. WORKFLOWS
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    trigger VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 19. WORKFLOW STEPS
CREATE TABLE workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    step_type VARCHAR(100) NOT NULL,
    action VARCHAR(200) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 20. AUTOMATION RUNS
CREATE TABLE automation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE SET NULL,
    workflow_name VARCHAR(150) NOT NULL,
    trigger_source VARCHAR(100) NOT NULL, -- ai_command_center, system_trigger, manual_request
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('started', 'in_progress', 'completed', 'failed')),
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    execution_details JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 21. APPROVALS
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(200) NOT NULL,
    requested_by VARCHAR(150) NOT NULL,
    approver VARCHAR(150),
    risk_level VARCHAR(50) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reason TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 22. NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- info, warning, urgent, success
    department VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 23. AUDIT LOGS (Traceability)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(150) NOT NULL,
    source VARCHAR(100) NOT NULL, -- ai_command, user_action, background_job
    entity_type VARCHAR(100) NOT NULL, -- patient, bed, inventory, ambulance, doctor, task
    entity_id VARCHAR(100),
    result VARCHAR(50) DEFAULT 'success',
    automation_run_id UUID REFERENCES automation_runs(id) ON DELETE SET NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 24. NETWORK FACILITIES (Government Reference Data)
CREATE TABLE network_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    facility_type VARCHAR(100) NOT NULL, -- Multi-Specialty, District Hospital, Primary Health Centre, Trauma Care
    ownership VARCHAR(100) DEFAULT 'Government', -- Public, Autonomous, PPP, Network Partner
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    pincode VARCHAR(20),
    total_beds INTEGER DEFAULT 0,
    icu_beds INTEGER DEFAULT 0,
    emergency_services BOOLEAN DEFAULT TRUE,
    ambulance_count INTEGER DEFAULT 0,
    contact_phone VARCHAR(50),
    source_attribution VARCHAR(255) DEFAULT 'Open Government Data (data.gov.in)',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_ward ON patients(ward_id);
CREATE INDEX idx_patients_doctor ON patients(doctor_id);
CREATE INDEX idx_beds_status ON beds(status);
CREATE INDEX idx_beds_ward ON beds(ward_id);
CREATE INDEX idx_inventory_status ON inventory_items(status);
CREATE INDEX idx_ambulances_status ON ambulances(vehicle_status);
CREATE INDEX idx_tasks_status_priority ON tasks(status, priority);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX idx_network_state_district ON network_facilities(state, district);
