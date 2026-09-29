-- ====================================================================
-- CAREFLOW AI - SYNTHETIC SEED DATA
-- Seed: seed.sql
-- Strictly synthetic hospital operations data. No real patient data.
-- ====================================================================

-- 1. DEMO HOSPITAL
INSERT INTO hospitals (id, name, code, address, city, state, phone, email, total_bed_capacity)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Apex Metro Memorial Hospital',
    'APEX-METRO-01',
    '45 Healthcare Boulevard, Medical Enclave',
    'Mumbai',
    'Maharashtra',
    '+91-22-2890-4400',
    'operations@apexmetro.org',
    120
) ON CONFLICT (code) DO NOTHING;

-- 2. DEPARTMENTS
INSERT INTO departments (id, hospital_id, name, code, head_name, floor_level, contact_ext) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Cardiology', 'CARD', 'Dr. Rajesh Sen', 'Floor 3', '301'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Emergency & Trauma', 'EMRG', 'Dr. Priya Varma', 'Ground Floor', '100'),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Neurology', 'NEUR', 'Dr. Arvind Joshi', 'Floor 4', '402'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Orthopedics', 'ORTH', 'Dr. Sanjana Rao', 'Floor 2', '205'),
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Pediatrics', 'PEDI', 'Dr. Meera Nambiar', 'Floor 2', '210'),
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'General Surgery', 'SURG', 'Dr. Vikram Malhotra', 'Floor 5', '501'),
('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'Intensive Care Unit', 'ICU', 'Dr. Alok Nath', 'Floor 3', '350'),
('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Nephrology', 'NEPH', 'Dr. Kavita Desai', 'Floor 4', '412'),
('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'Radiology', 'RADI', 'Dr. Harish Patel', 'Basement 1', '080'),
('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'Oncology', 'ONCO', 'Dr. Sunita Kulkarni', 'Floor 5', '520')
ON CONFLICT (hospital_id, code) DO NOTHING;

-- 3. DOCTORS
INSERT INTO doctors (id, hospital_id, name, doctor_code, specialization, department, shift, availability, workload, max_workload, contact_phone) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Dr. Rajesh Sen', 'DOC-CARD-01', 'Senior Interventional Cardiologist', 'Cardiology', 'Morning', 'available', 6, 15, '+91-98200-11221'),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Dr. Priya Varma', 'DOC-EMRG-01', 'Emergency Medicine Specialist', 'Emergency & Trauma', 'Morning', 'busy', 9, 12, '+91-98200-11222'),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'Dr. Arvind Joshi', 'DOC-NEUR-01', 'Neurosurgeon', 'Neurology', 'Morning', 'available', 4, 10, '+91-98200-11223'),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'Dr. Sanjana Rao', 'DOC-ORTH-01', 'Orthopedic Surgeon', 'Orthopedics', 'Evening', 'available', 5, 14, '+91-98200-11224'),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'Dr. Meera Nambiar', 'DOC-PEDI-01', 'Consultant Pediatrician', 'Pediatrics', 'Morning', 'available', 3, 15, '+91-98200-11225'),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'Dr. Vikram Malhotra', 'DOC-SURG-01', 'Laparoscopic Surgeon', 'General Surgery', 'Morning', 'busy', 7, 12, '+91-98200-11226'),
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', 'Dr. Alok Nath', 'DOC-ICU-01', 'Critical Care Intensivist', 'Intensive Care Unit', 'Night', 'available', 8, 10, '+91-98200-11227'),
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000008', 'Dr. Kavita Desai', 'DOC-NEPH-01', 'Nephrologist', 'Nephrology', 'Evening', 'available', 4, 12, '+91-98200-11228'),
('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000009', 'Dr. Harish Patel', 'DOC-RADI-01', 'Senior Radiologist', 'Radiology', 'Morning', 'available', 2, 20, '+91-98200-11229'),
('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000010', 'Dr. Sunita Kulkarni', 'DOC-ONCO-01', 'Medical Oncologist', 'Oncology', 'Morning', 'on_call', 5, 12, '+91-98200-11230'),
('c0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000001', 'Dr. Rohan Mehra', 'DOC-CARD-02', 'Clinical Cardiologist', 'Cardiology', 'Evening', 'available', 5, 15, '+91-98200-11231'),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000002', 'Dr. Amit Bansal', 'DOC-EMRG-02', 'Trauma Resuscitation Specialist', 'Emergency & Trauma', 'Night', 'available', 6, 12, '+91-98200-11232')
ON CONFLICT (doctor_code) DO NOTHING;

-- 4. WARDS
INSERT INTO wards (id, hospital_id, name, ward_code, category, floor_number, total_capacity) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Intensive Care Wing A', 'WARD-ICU-A', 'icu', 'Floor 3', 12),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Executive Private Suites', 'WARD-PREM-1', 'premium', 'Floor 5', 10),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Semi-Private Care Unit', 'WARD-SEMI-1', 'semi_premium', 'Floor 4', 16),
('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'General Inpatient Ward A', 'WARD-GEN-A', 'general', 'Floor 2', 30),
('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Emergency Triage & Bay', 'WARD-EMRG-T', 'emergency', 'Ground Floor', 14),
('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Short Stay Observation', 'WARD-OBS-1', 'observation', 'Floor 1', 12)
ON CONFLICT (hospital_id, ward_code) DO NOTHING;

-- 5. ROOMS
INSERT INTO rooms (id, ward_id, room_number, room_type, max_beds) VALUES
('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'ICU-301', 'Critical Care Pod', 2),
('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'ICU-302', 'Critical Care Pod', 2),
('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', 'STE-501', 'Single Deluxe Suite', 1),
('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000002', 'STE-502', 'Single Deluxe Suite', 1),
('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000003', 'SMP-401', 'Twin Sharing', 2),
('e0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000003', 'SMP-402', 'Twin Sharing', 2),
('e0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000004', 'GEN-201', 'Multi-Bed Dormitory', 4),
('e0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000004', 'GEN-202', 'Multi-Bed Dormitory', 4),
('e0000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000005', 'EMR-101', 'Resuscitation Bay', 2),
('e0000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000006', 'OBS-101', 'Observation Cubicle', 2)
ON CONFLICT (ward_id, room_number) DO NOTHING;

-- 6. BEDS
INSERT INTO beds (id, ward_id, room_id, bed_number, status, is_powered, notes) VALUES
('f0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'ICU-B1', 'occupied', true, 'Connected to Ventilator A3'),
('f0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'ICU-B2', 'available', true, 'Sanitized and calibrated'),
('f0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'ICU-B3', 'occupied', true, 'Continuous telemetry monitoring'),
('f0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'ICU-B4', 'maintenance', false, 'Sensor calibration in progress'),
('f0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003', 'STE-B1', 'occupied', true, 'Executive suite setup'),
('f0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000004', 'STE-B2', 'available', true, 'Deep cleaned and ready'),
('f0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000005', 'SMP-B1', 'occupied', true, 'Window view position'),
('f0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000005', 'SMP-B2', 'reserved', true, 'Reserved for post-op recovery'),
('f0000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000006', 'SMP-B3', 'available', true, 'Ready for intake'),
('f0000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000006', 'SMP-B4', 'available', true, 'Ready for intake'),
('f0000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000007', 'GEN-B1', 'occupied', true, 'Orthopedic traction frame attached'),
('f0000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000007', 'GEN-B2', 'occupied', true, 'Routine monitoring'),
('f0000000-0000-0000-0000-000000000013', 'd0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000007', 'GEN-B3', 'available', true, 'Cleaned and made'),
('f0000000-0000-0000-0000-000000000014', 'd0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000007', 'GEN-B4', 'available', true, 'Cleaned and made'),
('f0000000-0000-0000-0000-000000000015', 'd0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000009', 'EMR-B1', 'occupied', true, 'Trauma patient admitted'),
('f0000000-0000-0000-0000-000000000016', 'd0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000009', 'EMR-B2', 'available', true, 'Rapid intake standby'),
('f0000000-0000-0000-0000-000000000017', 'd0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000010', 'OBS-B1', 'occupied', true, 'Monitoring vitals 4hr'),
('f0000000-0000-0000-0000-000000000018', 'd0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000010', 'OBS-B2', 'available', true, 'Sterilized')
ON CONFLICT (room_id, bed_number) DO NOTHING;

-- 7. SYNTHETIC PATIENTS
INSERT INTO patients (id, patient_code, name, age, gender, admission_date, discharge_date, ward_id, room_id, bed_id, doctor_id, department, status, bill_amount, emergency_contact, emergency_phone) VALUES
('10000000-0000-0000-0000-000000000001', 'PAT-1001', 'Rahul Sharma', 54, 'Male', NOW() - INTERVAL '3 days', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Cardiology', 'critical', 65400.00, 'Anita Sharma', '+91-98111-22334'),
('10000000-0000-0000-0000-000000000002', 'PAT-1002', 'Pooja Iyer', 42, 'Female', NOW() - INTERVAL '2 days', NULL, 'd0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', 'Neurology', 'under_observation', 34200.00, 'Karthik Iyer', '+91-98222-33445'),
('10000000-0000-0000-0000-000000000003', 'PAT-1003', 'Amitabh Verma', 68, 'Male', NOW() - INTERVAL '5 days', NULL, 'd0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000004', 'Orthopedics', 'needs_attention', 48900.00, 'Suman Verma', '+91-98333-44556'),
('10000000-0000-0000-0000-000000000004', 'PAT-1004', 'Sneha Deshmukh', 29, 'Female', NOW() - INTERVAL '4 days', NULL, 'd0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000006', 'General Surgery', 'discharge_ready', 28500.00, 'Manoj Deshmukh', '+91-98444-55667'),
('10000000-0000-0000-0000-000000000005', 'PAT-1005', 'Karan Johar', 35, 'Male', NOW() - INTERVAL '1 day', NULL, 'd0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000002', 'Emergency & Trauma', 'admitted', 15200.00, 'Ritu Johar', '+91-98555-66778'),
('10000000-0000-0000-0000-000000000006', 'PAT-1006', 'Fatima Sheikh', 61, 'Female', NOW() - INTERVAL '6 days', NULL, 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000007', 'Intensive Care Unit', 'critical', 92400.00, 'Zubair Sheikh', '+91-98666-77889'),
('10000000-0000-0000-0000-000000000007', 'PAT-1007', 'Deepak Chopra', 48, 'Male', NOW() - INTERVAL '2 days', NULL, 'd0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000008', 'Nephrology', 'resting', 22800.00, 'Geeta Chopra', '+91-98777-88990'),
('10000000-0000-0000-0000-000000000008', 'PAT-1008', 'Ananya Roy', 8, 'Female', NOW() - INTERVAL '1 day', NULL, 'd0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000010', 'f0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000005', 'Pediatrics', 'under_observation', 11000.00, 'Subhash Roy', '+91-98888-99001'),
('10000000-0000-0000-0000-000000000009', 'PAT-1009', 'Vijay Singhania', 72, 'Male', NOW() - INTERVAL '9 days', NOW() - INTERVAL '1 day', NULL, NULL, NULL, 'c0000000-0000-0000-0000-000000000001', 'Cardiology', 'discharged', 115000.00, 'Alok Singhania', '+91-98999-00112')
ON CONFLICT (patient_code) DO NOTHING;

-- 8. SUPPLIERS
INSERT INTO suppliers (id, name, contact_person, email, phone, category, lead_time_days, rating) VALUES
('20000000-0000-0000-0000-000000000001', 'Bharat Medical Supplies Ltd', 'Ramesh Gupta', 'ramesh@bharatmed.com', '+91-22-6789-0001', 'Pharmaceuticals & Fluids', 1, 4.8),
('20000000-0000-0000-0000-000000000002', 'Lifeline Surgical Essentials', 'Simran Kaur', 'orders@lifelinesurgical.in', '+91-22-6789-0002', 'Surgical & Sterile Instruments', 2, 4.6),
('20000000-0000-0000-0000-000000000003', 'SafeGuard PPE & Hygiene Co', 'Anil Mehta', 'anil@safeguardcare.com', '+91-22-6789-0003', 'PPE & Consumables', 2, 4.4),
('20000000-0000-0000-0000-000000000004', 'Apex Cryo & Gas Logistics', 'Sanjay Patil', 'gasdispatch@apexcryo.com', '+91-22-6789-0004', 'Medical Oxygen & Gases', 1, 4.9)
ON CONFLICT DO NOTHING;

-- 9. INVENTORY ITEMS
INSERT INTO inventory_items (id, hospital_id, name, sku, category, quantity, minimum_threshold, unit, supplier_id, status, unit_cost, storage_location) VALUES
('30000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Medical Oxygen Cylinders (47L)', 'MED-OXY-47L', 'Gases', 8, 15, 'cylinders', '20000000-0000-0000-0000-000000000004', 'critical', 1850.00, 'Cryo Gas Manifold Room'),
('30000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Normal Saline IV (0.9% 500ml)', 'IV-NS-500ML', 'Fluids', 140, 50, 'bottles', '20000000-0000-0000-0000-000000000001', 'normal', 45.00, 'Central Pharmacy Bay B'),
('30000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Nitrile Examination Gloves (M)', 'PPE-GLV-MED', 'PPE', 18, 50, 'boxes', '20000000-0000-0000-0000-000000000003', 'low_stock', 320.00, 'Materials Store 2'),
('30000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Sterile Surgical Blades No. 11', 'SRG-BLD-11', 'Surgical', 45, 20, 'packs', '20000000-0000-0000-0000-000000000002', 'normal', 190.00, 'OT Prep Storage'),
('30000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Disposable Syringes 5ml with Needle', 'CNS-SYR-05ML', 'Consumables', 450, 100, 'units', '20000000-0000-0000-0000-000000000001', 'normal', 8.50, 'Ward Dispensary 1'),
('30000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Defibrillator Electrode Pads (Adult)', 'EQP-DEF-PAD', 'Emergency', 3, 10, 'sets', '20000000-0000-0000-0000-000000000002', 'critical', 1200.00, 'Crash Cart Stock Room'),
('30000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'High Efficiency N95 Respirators', 'PPE-MSK-N95', 'PPE', 80, 40, 'boxes', '20000000-0000-0000-0000-000000000003', 'normal', 450.00, 'Central Warehouse A'),
('30000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Emergency Suture Kit 3-0 Silk', 'SRG-SUT-30', 'Surgical', 0, 15, 'kits', '20000000-0000-0000-0000-000000000002', 'out_of_stock', 540.00, 'Emergency Triage Rack 3')
ON CONFLICT (sku) DO NOTHING;

-- 10. AMBULANCES
INSERT INTO ambulances (id, hospital_id, ambulance_code, driver, driver_phone, vehicle_status, location, destination, current_request, equipment_level) VALUES
('40000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'AMB-101', 'Dinesh Rawat', '+91-98100-33001', 'available', 'Apex Metro Ambulance Bay', NULL, NULL, 'Advanced Life Support (ALS)'),
('40000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'AMB-102', 'Sunil Jadhav', '+91-98100-33002', 'dispatched', 'Western Express Highway, Andheri', 'Apex Metro Emergency Bay', 'Cardiac distress transport', 'Advanced Life Support (ALS)'),
('40000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'AMB-103', 'Irfan Sheikh', '+91-98100-33003', 'en_route', 'SVT Junction, Bandra', 'Apex Metro Trauma Unit', 'Road accident casualty pickup', 'Advanced Life Support (ALS)'),
('40000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'AMB-104', 'Praveen Nair', '+91-98100-33004', 'at_hospital', 'Emergency Dock 2', 'Apex Metro Hospital', 'Patient offload in progress', 'Basic Life Support (BLS)'),
('40000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'AMB-105', 'Mukesh Tiwari', '+91-98100-33005', 'maintenance', 'Service Center Kurla', NULL, 'Routine brake overhaul', 'Basic Life Support (BLS)'),
('40000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'AMB-106', 'Ganesh Kadam', '+91-98100-33006', 'available', 'Apex Metro Ambulance Bay', NULL, NULL, 'Neonatal Transport Unit')
ON CONFLICT (ambulance_code) DO NOTHING;

-- 11. APPOINTMENTS
INSERT INTO appointments (id, patient_id, patient_name, doctor_id, doctor_name, department, date, time, type, status, notes) VALUES
('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Rahul Sharma', 'c0000000-0000-0000-0000-000000000001', 'Dr. Rajesh Sen', 'Cardiology', CURRENT_DATE, '02:30 PM', 'Consultation', 'upcoming', 'Follow-up ECG and echo evaluation'),
('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Pooja Iyer', 'c0000000-0000-0000-0000-000000000003', 'Dr. Arvind Joshi', 'Neurology', CURRENT_DATE, '04:00 PM', 'Pre-op Review', 'upcoming', 'Post-MRI neuro assessment'),
('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', 'Sneha Deshmukh', 'c0000000-0000-0000-0000-000000000006', 'Dr. Vikram Malhotra', 'General Surgery', CURRENT_DATE, '11:00 AM', 'Consultation', 'completed', 'Discharge clearance examination'),
('50000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000007', 'Deepak Chopra', 'c0000000-0000-0000-0000-000000000008', 'Dr. Kavita Desai', 'Nephrology', CURRENT_DATE + 1, '10:30 AM', 'Routine Checkup', 'upcoming', 'Renal profile test review')
ON CONFLICT DO NOTHING;

-- 12. TASKS
INSERT INTO tasks (id, title, description, department, assigned_employee, priority, status, due_time, source_workflow) VALUES
('60000000-0000-0000-0000-000000000001', 'Prepare Bed ICU-B2 for Cardiac Transfer', 'Sanitize and verify telemetry monitors for incoming cardiac patient', 'Intensive Care Unit', 'Nurse Sunita K', 'critical', 'in_progress', NOW() + INTERVAL '45 minutes', 'AI Admission Workflow'),
('60000000-0000-0000-0000-000000000002', 'Restock Emergency Suture Kits', 'Order emergency inventory batch from Lifeline Surgical', 'Inventory Operations', 'Store Mgr Rakesh', 'high', 'pending', NOW() + INTERVAL '2 hours', 'Inventory Threshold Engine'),
('60000000-0000-0000-0000-000000000003', 'Coordinate Discharge Billing for Sneha Deshmukh', 'Finalize insurance claims documentation and bill audit', 'Billing & Administration', 'Executive Anand', 'medium', 'pending', NOW() + INTERVAL '3 hours', 'Discharge Workflow'),
('60000000-0000-0000-0000-000000000004', 'Recalibrate Ventilator on Bed ICU-B4', 'Biomedical engineering routine sensor test and pressure check', 'Biomedical Engineering', 'Engr. Vikas S', 'high', 'in_progress', NOW() + INTERVAL '1 hour', 'Maintenance Alert'),
('60000000-0000-0000-0000-000000000005', 'Sterilize Emergency Bay 2 Resuscitation Cart', 'Replace used consumable trays and check laryngoscope batteries', 'Emergency & Trauma', 'Nurse Jayesh P', 'medium', 'completed', NOW() - INTERVAL '1 hour', 'Shift Handover')
ON CONFLICT DO NOTHING;

-- 13. APPROVALS
INSERT INTO approvals (id, action, requested_by, approver, risk_level, status, reason, created_at) VALUES
('70000000-0000-0000-0000-000000000001', 'Emergency Oxygen Bulk Restock (25 Cylinders)', 'CareFlow Inventory Bot', 'Medical Director Dr. Mehta', 'critical', 'pending', 'Stock level fallen below critical safety margin (8 remaining vs 15 min threshold)', NOW() - INTERVAL '30 minutes'),
('70000000-0000-0000-0000-000000000002', 'High-Cost Consumable Reorder (Defibrillator Pads)', 'Inventory Operations', 'Finance Head Mr. Verma', 'medium', 'approved', 'Reorder 10 sets of defibrillator electrode pads', NOW() - INTERVAL '2 hours'),
('70000000-0000-0000-0000-000000000003', 'Bed Reallocation Over-Capacity Override', 'Triage Officer Dr. Priya', 'Chief of Operations', 'high', 'pending', 'Move temporary observation bed into Semi-Private Bay 1 due to casualty surge', NOW() - INTERVAL '15 minutes')
ON CONFLICT DO NOTHING;

-- 14. WORKFLOWS & AUTOMATION
INSERT INTO workflows (id, name, trigger, description, status) VALUES
('80000000-0000-0000-0000-000000000001', 'Patient Admission Automation', 'patient_admission', 'Coordinates bed reservation, doctor assignment, documentation task, and nursing notification', 'active'),
('80000000-0000-0000-0000-000000000002', 'Bed Allocation Engine', 'bed_request', 'Automates bed matching based on medical department, ward tier, and readiness', 'active'),
('80000000-0000-0000-0000-000000000003', 'Inventory Threshold Replenishment', 'inventory_replenishment', 'Auto-generates purchase requests when hospital consumable drops below minimum', 'active'),
('80000000-0000-0000-0000-000000000004', 'Emergency Ambulance Dispatch', 'ambulance_coordination', 'Locates closest active vehicle, dispatches route, and alerts receiving trauma ward', 'active')
ON CONFLICT DO NOTHING;

-- 15. NETWORK FACILITIES (Government Open Data References)
INSERT INTO network_facilities (id, name, facility_type, ownership, state, district, pincode, total_beds, icu_beds, emergency_services, ambulance_count, contact_phone, source_attribution) VALUES
('90000000-0000-0000-0000-000000000001', 'King Edward Memorial (KEM) Hospital', 'Teaching & Tertiary Care', 'Government', 'Maharashtra', 'Mumbai', '400012', 1800, 150, true, 8, '+91-22-2410-7000', 'National Hospital Directory (data.gov.in)'),
('90000000-0000-0000-0000-000000000002', 'Sion Hospital (LTMMC)', 'Trauma & Multi-Specialty', 'Government', 'Maharashtra', 'Mumbai', '400022', 1400, 110, true, 6, '+91-22-2407-6381', 'National Hospital Directory (data.gov.in)'),
('90000000-0000-0000-0000-000000000003', 'Sir J.J. Group of Hospitals', 'Super Specialty Medical Center', 'Government', 'Maharashtra', 'Mumbai', '400008', 2000, 180, true, 10, '+91-22-2373-5555', 'National Hospital Directory (data.gov.in)'),
('90000000-0000-0000-0000-000000000004', 'Cooper Hospital (RNCH)', 'General & Emergency Center', 'Government', 'Maharashtra', 'Mumbai', '400056', 650, 45, true, 4, '+91-22-2620-7254', 'National Hospital Directory (data.gov.in)'),
('90000000-0000-0000-0000-000000000005', 'Indira Gandhi Govt Medical College & Hospital', 'Tertiary & Regional Center', 'Government', 'Maharashtra', 'Nagpur', '440018', 800, 60, true, 5, '+91-712-272-5274', 'Maharashtra Health Directory (data.gov.in)'),
('90000000-0000-0000-0000-000000000006', 'District Hospital Aundh', 'District Public Health Facility', 'Government', 'Maharashtra', 'Pune', '411027', 400, 25, true, 3, '+91-20-2728-0400', 'All India Health Centres Directory (sikkim.data.gov.in)')
ON CONFLICT DO NOTHING;

-- 16. NOTIFICATIONS
INSERT INTO notifications (id, title, message, type, department, is_read) VALUES
('a1000000-0000-0000-0000-000000000001', 'Critical Stock Warning', 'Medical Oxygen Cylinders stock is at 8 (Threshold: 15)', 'urgent', 'Inventory Operations', false),
('a1000000-0000-0000-0000-000000000002', 'High ICU Occupancy Alert', 'ICU Ward A is currently at 83% occupancy (10 of 12 beds occupied)', 'warning', 'Intensive Care Unit', false),
('a1000000-0000-0000-0000-000000000003', 'Ambulance Dispatched', 'Ambulance AMB-102 dispatched to Western Express Highway for urgent transport', 'info', 'Emergency & Trauma', true)
ON CONFLICT DO NOTHING;

-- 17. AUDIT LOGS
INSERT INTO audit_logs (id, action, source, entity_type, entity_id, result, details) VALUES
('b1000000-0000-0000-0000-000000000001', 'bed_assigned', 'ai_command', 'bed', 'f0000000-0000-0000-0000-000000000001', 'success', '{"patient_code": "PAT-1001", "bed": "ICU-B1", "reason": "Patient admission automation"}'),
('b1000000-0000-0000-0000-000000000002', 'replenishment_requested', 'background_job', 'inventory', '30000000-0000-0000-0000-000000000001', 'success', '{"item": "Medical Oxygen Cylinders", "quantity_needed": 20}'),
('b1000000-0000-0000-0000-000000000003', 'ambulance_dispatched', 'user_action', 'ambulance', '40000000-0000-0000-0000-000000000002', 'success', '{"destination": "Apex Metro Emergency Bay", "urgency": "high"}')
ON CONFLICT DO NOTHING;
