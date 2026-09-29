-- ====================================================================
-- CAREFLOW AI - MINI VERIFICATION SEED (Fast Verification)
-- ====================================================================

SET search_path = public, extensions;

-- Clean existing demo data
TRUNCATE TABLE 
    public.audit_logs, public.notifications, public.approvals, public.automation_runs,
    public.workflow_steps, public.workflows, public.tasks, public.checkups,
    public.appointments, public.ambulance_requests, public.ambulances,
    public.inventory_transactions, public.inventory_items, public.suppliers,
    public.patient_status_history, public.patients, public.beds, public.rooms,
    public.wards, public.doctors, public.employees, public.departments,
    public.hospitals, public.network_facilities 
CASCADE;

-- 1 Hospital
INSERT INTO public.hospitals (id, name, code, address, city, state, phone, email, total_bed_capacity)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Apex Metro Memorial Hospital', 'APEX-METRO-01', '45 Healthcare Boulevard, Medical Enclave', 'Mumbai', 'Maharashtra', '+91-22-2890-4400', 'operations@apexmetro.org', 120);

-- 1 Department
INSERT INTO public.departments (id, hospital_id, name, code, head_name, floor_level, contact_ext)
VALUES ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Cardiology', 'CARD', 'Dr. Rajesh Sen', 'Floor 3', '301');

-- 1 Doctor
INSERT INTO public.doctors (id, hospital_id, department_id, name, doctor_code, specialization, department, shift, availability, workload, max_workload, contact_phone, status)
VALUES ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Dr. Rajesh Sen', 'DOC-CARD-01', 'Senior Interventional Cardiologist', 'Cardiology', 'Morning', 'available', 6, 15, '+91-98200-11221', 'active');

-- 1 Ward
INSERT INTO public.wards (id, hospital_id, department_id, name, ward_code, category, floor_number, total_capacity)
VALUES ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Intensive Care Wing A', 'WARD-ICU-A', 'icu', 'Floor 3', 12);

-- 1 Room
INSERT INTO public.rooms (id, ward_id, room_number, room_type, max_beds)
VALUES ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'ICU-301', 'Isolation ICU', 2);

-- 1 Bed
INSERT INTO public.beds (id, ward_id, room_id, bed_number, status, is_powered, notes)
VALUES ('f0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'ICU-B1', 'occupied', true, 'Connected to Ventilator A3');

-- 1 Patient
INSERT INTO public.patients (id, patient_code, name, age, gender, admission_date, discharge_date, ward_id, room_id, bed_id, doctor_id, department, status, bill_amount, emergency_contact, emergency_phone)
VALUES ('10000000-0000-0000-0000-000000000001', 'PAT-1001', 'Rahul Sharma', 54, 'Male', NOW() - INTERVAL '3 days', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Cardiology', 'critical', 65400.00, 'Anita Sharma', '+91-98111-22334');

-- Verification Query
SELECT 
    (SELECT count(*) FROM public.hospitals) AS hospitals,
    (SELECT count(*) FROM public.departments) AS departments,
    (SELECT count(*) FROM public.doctors) AS doctors,
    (SELECT count(*) FROM public.wards) AS wards,
    (SELECT count(*) FROM public.rooms) AS rooms,
    (SELECT count(*) FROM public.beds) AS beds,
    (SELECT count(*) FROM public.patients) AS patients;
