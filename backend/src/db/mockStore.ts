import {
  Patient,
  Doctor,
  Ward,
  Room,
  Bed,
  InventoryItem,
  Ambulance,
  Appointment,
  Task,
  Approval,
  AuditLog,
  Notification,
  NetworkFacility,
  Workflow,
  AutomationRun,
} from '../types/index.js';

export class MockDataStore {
  // 1. WARDS (6 core hospital categories)
  public wards: Ward[] = [
    { id: 'd0000000-0000-0000-0000-000000000001', name: 'Intensive Care Wing A', ward_code: 'WARD-ICU-A', category: 'icu', floor_number: 'Floor 3', total_capacity: 12 },
    { id: 'd0000000-0000-0000-0000-000000000002', name: 'Executive Private Suites', ward_code: 'WARD-PREM-1', category: 'premium', floor_number: 'Floor 5', total_capacity: 10 },
    { id: 'd0000000-0000-0000-0000-000000000003', name: 'Semi-Private Care Unit', ward_code: 'WARD-SEMI-1', category: 'semi_premium', floor_number: 'Floor 4', total_capacity: 16 },
    { id: 'd0000000-0000-0000-0000-000000000004', name: 'General Inpatient Ward A', ward_code: 'WARD-GEN-A', category: 'general', floor_number: 'Floor 2', total_capacity: 30 },
    { id: 'd0000000-0000-0000-0000-000000000005', name: 'Emergency Triage & Bay', ward_code: 'WARD-EMRG-T', category: 'emergency', floor_number: 'Ground Floor', total_capacity: 14 },
    { id: 'd0000000-0000-0000-0000-000000000006', name: 'Short Stay Observation', ward_code: 'WARD-OBS-1', category: 'observation', floor_number: 'Floor 1', total_capacity: 12 },
  ];

  // 2. ROOMS (20+ rooms across wards)
  public rooms: Room[] = [
    { id: 'e0000000-0000-0000-0000-000000000001', ward_id: 'd0000000-0000-0000-0000-000000000001', room_number: 'ICU-301', room_type: 'Isolation ICU', max_beds: 2 },
    { id: 'e0000000-0000-0000-0000-000000000002', ward_id: 'd0000000-0000-0000-0000-000000000001', room_number: 'ICU-302', room_type: 'General ICU', max_beds: 4 },
    { id: 'e0000000-0000-0000-0000-000000000003', ward_id: 'd0000000-0000-0000-0000-000000000001', room_number: 'ICU-303', room_type: 'Cardiac ICU', max_beds: 3 },
    { id: 'e0000000-0000-0000-0000-000000000004', ward_id: 'd0000000-0000-0000-0000-000000000001', room_number: 'ICU-304', room_type: 'Neuro ICU', max_beds: 3 },
    { id: 'e0000000-0000-0000-0000-000000000005', ward_id: 'd0000000-0000-0000-0000-000000000002', room_number: 'STE-501', room_type: 'Deluxe Private', max_beds: 1 },
    { id: 'e0000000-0000-0000-0000-000000000006', ward_id: 'd0000000-0000-0000-0000-000000000002', room_number: 'STE-502', room_type: 'Deluxe Private', max_beds: 1 },
    { id: 'e0000000-0000-0000-0000-000000000007', ward_id: 'd0000000-0000-0000-0000-000000000002', room_number: 'STE-503', room_type: 'Executive Suite', max_beds: 1 },
    { id: 'e0000000-0000-0000-0000-000000000008', ward_id: 'd0000000-0000-0000-0000-000000000002', room_number: 'STE-504', room_type: 'Executive Suite', max_beds: 1 },
    { id: 'e0000000-0000-0000-0000-000000000009', ward_id: 'd0000000-0000-0000-0000-000000000003', room_number: 'SEM-401', room_type: 'Twin Sharing', max_beds: 2 },
    { id: 'e0000000-0000-0000-0000-000000000010', ward_id: 'd0000000-0000-0000-0000-000000000003', room_number: 'SEM-402', room_type: 'Twin Sharing', max_beds: 2 },
    { id: 'e0000000-0000-0000-0000-000000000011', ward_id: 'd0000000-0000-0000-0000-000000000003', room_number: 'SEM-403', room_type: 'Twin Sharing', max_beds: 2 },
    { id: 'e0000000-0000-0000-0000-000000000012', ward_id: 'd0000000-0000-0000-0000-000000000003', room_number: 'SEM-404', room_type: 'Twin Sharing', max_beds: 2 },
    { id: 'e0000000-0000-0000-0000-000000000013', ward_id: 'd0000000-0000-0000-0000-000000000004', room_number: 'GEN-201', room_type: 'Ward Bay A', max_beds: 6 },
    { id: 'e0000000-0000-0000-0000-000000000014', ward_id: 'd0000000-0000-0000-0000-000000000004', room_number: 'GEN-202', room_type: 'Ward Bay B', max_beds: 6 },
    { id: 'e0000000-0000-0000-0000-000000000015', ward_id: 'd0000000-0000-0000-0000-000000000004', room_number: 'GEN-203', room_type: 'Ward Bay C', max_beds: 6 },
    { id: 'e0000000-0000-0000-0000-000000000016', ward_id: 'd0000000-0000-0000-0000-000000000004', room_number: 'GEN-204', room_type: 'Ward Bay D', max_beds: 6 },
    { id: 'e0000000-0000-0000-0000-000000000017', ward_id: 'd0000000-0000-0000-0000-000000000005', room_number: 'EMG-101', room_type: 'Acute Trauma Bay', max_beds: 4 },
    { id: 'e0000000-0000-0000-0000-000000000018', ward_id: 'd0000000-0000-0000-0000-000000000005', room_number: 'EMG-102', room_type: 'Resuscitation Bay', max_beds: 3 },
    { id: 'e0000000-0000-0000-0000-000000000019', ward_id: 'd0000000-0000-0000-0000-000000000005', room_number: 'EMG-103', room_type: 'Rapid Assessment', max_beds: 4 },
    { id: 'e0000000-0000-0000-0000-000000000020', ward_id: 'd0000000-0000-0000-0000-000000000006', room_number: 'OBS-101', room_type: 'Observation Unit 1', max_beds: 4 },
    { id: 'e0000000-0000-0000-0000-000000000021', ward_id: 'd0000000-0000-0000-0000-000000000006', room_number: 'OBS-102', room_type: 'Observation Unit 2', max_beds: 4 },
  ];

  // 3. DOCTORS & STAFF (25 specialists and clinical officers)
  public doctors: Doctor[] = [
    { id: 'c0000000-0000-0000-0000-000000000001', name: 'Dr. Rajesh Sen', doctor_code: 'DOC-CARD-01', specialization: 'Senior Interventional Cardiologist', department: 'Cardiology', shift: 'Morning', availability: 'available', workload: 6, max_workload: 15, contact_phone: '+91-98200-11221', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000002', name: 'Dr. Priya Varma', doctor_code: 'DOC-EMRG-01', specialization: 'Emergency Medicine Specialist', department: 'Emergency & Trauma', shift: 'Morning', availability: 'busy', workload: 9, max_workload: 12, contact_phone: '+91-98200-11222', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000003', name: 'Dr. Arvind Joshi', doctor_code: 'DOC-NEUR-01', specialization: 'Neurosurgeon', department: 'Neurology', shift: 'Morning', availability: 'available', workload: 4, max_workload: 10, contact_phone: '+91-98200-11223', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000004', name: 'Dr. Sanjana Rao', doctor_code: 'DOC-ORTH-01', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', shift: 'Evening', availability: 'available', workload: 5, max_workload: 14, contact_phone: '+91-98200-11224', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000005', name: 'Dr. Meera Nambiar', doctor_code: 'DOC-PEDI-01', specialization: 'Consultant Pediatrician', department: 'Pediatrics', shift: 'Morning', availability: 'available', workload: 3, max_workload: 15, contact_phone: '+91-98200-11225', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000006', name: 'Dr. Vikram Malhotra', doctor_code: 'DOC-SURG-01', specialization: 'Laparoscopic Surgeon', department: 'General Surgery', shift: 'Morning', availability: 'busy', workload: 7, max_workload: 12, contact_phone: '+91-98200-11226', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000007', name: 'Dr. Alok Nath', doctor_code: 'DOC-ICU-01', specialization: 'Critical Care Intensivist', department: 'Intensive Care Unit', shift: 'Night', availability: 'available', workload: 8, max_workload: 10, contact_phone: '+91-98200-11227', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000008', name: 'Dr. Kavita Desai', doctor_code: 'DOC-NEPH-01', specialization: 'Nephrologist', department: 'Nephrology', shift: 'Evening', availability: 'available', workload: 4, max_workload: 12, contact_phone: '+91-98200-11228', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000009', name: 'Dr. Harish Patel', doctor_code: 'DOC-RADI-01', specialization: 'Senior Radiologist', department: 'Radiology', shift: 'Morning', availability: 'available', workload: 2, max_workload: 20, contact_phone: '+91-98200-11229', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000010', name: 'Dr. Sunita Kulkarni', doctor_code: 'DOC-ONCO-01', specialization: 'Medical Oncologist', department: 'Oncology', shift: 'Morning', availability: 'on_call', workload: 5, max_workload: 12, contact_phone: '+91-98200-11230', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000011', name: 'Dr. Rohan Mehra', doctor_code: 'DOC-CARD-02', specialization: 'Clinical Cardiologist', department: 'Cardiology', shift: 'Evening', availability: 'available', workload: 5, max_workload: 15, contact_phone: '+91-98200-11231', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000012', name: 'Dr. Amit Bansal', doctor_code: 'DOC-EMRG-02', specialization: 'Trauma Resuscitation Specialist', department: 'Emergency & Trauma', shift: 'Night', availability: 'available', workload: 6, max_workload: 12, contact_phone: '+91-98200-11232', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000013', name: 'Dr. Neha Agarwal', doctor_code: 'DOC-NEUR-02', specialization: 'Stroke Specialist Neurologist', department: 'Neurology', shift: 'Evening', availability: 'available', workload: 3, max_workload: 10, contact_phone: '+91-98200-11233', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000014', name: 'Dr. Deepak Shinde', doctor_code: 'DOC-ORTH-02', specialization: 'Spine & Trauma Consultant', department: 'Orthopedics', shift: 'Morning', availability: 'busy', workload: 8, max_workload: 14, contact_phone: '+91-98200-11234', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000015', name: 'Dr. Ananya Roy', doctor_code: 'DOC-PEDI-02', specialization: 'Neonatologist', department: 'Pediatrics', shift: 'Night', availability: 'available', workload: 4, max_workload: 12, contact_phone: '+91-98200-11235', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000016', name: 'Dr. Suresh Pillai', doctor_code: 'DOC-SURG-02', specialization: 'Gastrointestinal Surgeon', department: 'General Surgery', shift: 'Evening', availability: 'available', workload: 4, max_workload: 12, contact_phone: '+91-98200-11236', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000017', name: 'Dr. Ritu Choudhury', doctor_code: 'DOC-ICU-02', specialization: 'Pulmonology & ICU Fellow', department: 'Intensive Care Unit', shift: 'Morning', availability: 'busy', workload: 7, max_workload: 10, contact_phone: '+91-98200-11237', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000018', name: 'Dr. Gaurav Kapoor', doctor_code: 'DOC-NEPH-02', specialization: 'Dialysis Clinical Director', department: 'Nephrology', shift: 'Morning', availability: 'available', workload: 3, max_workload: 12, contact_phone: '+91-98200-11238', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000019', name: 'Dr. Shalini Saxena', doctor_code: 'DOC-RADI-02', specialization: 'Interventional Radiologist', department: 'Radiology', shift: 'Evening', availability: 'available', workload: 4, max_workload: 16, contact_phone: '+91-98200-11239', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000020', name: 'Dr. Manish Trivedi', doctor_code: 'DOC-ONCO-02', specialization: 'Surgical Oncologist', department: 'Oncology', shift: 'Morning', availability: 'busy', workload: 6, max_workload: 10, contact_phone: '+91-98200-11240', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000021', name: 'Dr. Pooja Mathur', doctor_code: 'DOC-ANES-01', specialization: 'Chief Anesthesiologist', department: 'General Surgery', shift: 'Morning', availability: 'available', workload: 5, max_workload: 12, contact_phone: '+91-98200-11241', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000022', name: 'Dr. Sameer Khan', doctor_code: 'DOC-EMRG-03', specialization: 'Acute Care Physician', department: 'Emergency & Trauma', shift: 'Evening', availability: 'available', workload: 4, max_workload: 12, contact_phone: '+91-98200-11242', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000023', name: 'Dr. Vandana Swaminathan', doctor_code: 'DOC-CARD-03', specialization: 'Pediatric Cardiologist', department: 'Cardiology', shift: 'Morning', availability: 'on_call', workload: 3, max_workload: 12, contact_phone: '+91-98200-11243', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000024', name: 'Dr. Nikhil Bhatia', doctor_code: 'DOC-GENM-01', specialization: 'Internal Medicine Consultant', department: 'General Medicine', shift: 'Morning', availability: 'available', workload: 6, max_workload: 18, contact_phone: '+91-98200-11244', status: 'active' },
    { id: 'c0000000-0000-0000-0000-000000000025', name: 'Dr. Tanvi Parekh', doctor_code: 'DOC-DERM-01', specialization: 'Consultant Dermatologist', department: 'Dermatology', shift: 'Morning', availability: 'available', workload: 2, max_workload: 16, contact_phone: '+91-98200-11245', status: 'active' },
  ];

  // 4. BEDS (60 realistic beds across all wards)
  public beds: Bed[] = [];

  // 5. PATIENTS (60 synthetic patients)
  public patients: Patient[] = [];

  // 6. INVENTORY (25 hospital consumables and supplies)
  public inventory: InventoryItem[] = [
    { id: 'inv-001', name: 'Normal Saline IV (0.9% 500ml)', sku: 'MED-NS-500', category: 'Pharmaceuticals', quantity: 240, minimum_threshold: 100, unit: 'Bags', unit_cost: 45.0, status: 'normal', storage_location: 'Central Pharmacy Bay A' },
    { id: 'inv-002', name: 'Ringer Lactate IV Infusion 500ml', sku: 'MED-RL-500', category: 'Pharmaceuticals', quantity: 180, minimum_threshold: 80, unit: 'Bags', unit_cost: 52.0, status: 'normal', storage_location: 'Central Pharmacy Bay A' },
    { id: 'inv-003', name: 'Medical Oxygen Cylinders (47L)', sku: 'GAS-O2-47L', category: 'Gases', quantity: 8, minimum_threshold: 15, unit: 'Cylinders', unit_cost: 1450.0, status: 'critical', storage_location: 'Gas Manifold Depot' },
    { id: 'inv-004', name: 'Nitrous Oxide Cylinders (30L)', sku: 'GAS-N2O-30L', category: 'Gases', quantity: 12, minimum_threshold: 10, unit: 'Cylinders', unit_cost: 2100.0, status: 'normal', storage_location: 'Gas Manifold Depot' },
    { id: 'inv-005', name: 'Nitrile Examination Gloves (M)', sku: 'PPE-GLV-MED', category: 'PPE', quantity: 18, minimum_threshold: 50, unit: 'Boxes', unit_cost: 320.0, status: 'low_stock', storage_location: 'Surgical Stores Room 1' },
    { id: 'inv-006', name: 'Nitrile Examination Gloves (L)', sku: 'PPE-GLV-LRG', category: 'PPE', quantity: 45, minimum_threshold: 50, unit: 'Boxes', unit_cost: 320.0, status: 'low_stock', storage_location: 'Surgical Stores Room 1' },
    { id: 'inv-007', name: 'N95 Respirator Masks (Fluid Resistant)', sku: 'PPE-MSK-N95', category: 'PPE', quantity: 120, minimum_threshold: 60, unit: 'Boxes', unit_cost: 480.0, status: 'normal', storage_location: 'Surgical Stores Room 1' },
    { id: 'inv-008', name: 'Disposable Sterile PPE Coveralls (XL)', sku: 'PPE-COV-XL', category: 'PPE', quantity: 75, minimum_threshold: 40, unit: 'Kits', unit_cost: 650.0, status: 'normal', storage_location: 'Infection Control Bay' },
    { id: 'inv-009', name: 'Defibrillator Electrode Pads (Adult)', sku: 'MED-PAD-ADL', category: 'Emergency', quantity: 3, minimum_threshold: 10, unit: 'Pairs', unit_cost: 1850.0, status: 'critical', storage_location: 'Emergency Crash Cart Station' },
    { id: 'inv-010', name: 'Defibrillator Electrode Pads (Pediatric)', sku: 'MED-PAD-PED', category: 'Emergency', quantity: 6, minimum_threshold: 8, unit: 'Pairs', unit_cost: 1950.0, status: 'low_stock', storage_location: 'Emergency Crash Cart Station' },
    { id: 'inv-011', name: 'Emergency Suture Kit 3-0 Silk', sku: 'SRG-SUT-30S', category: 'Surgical', quantity: 0, minimum_threshold: 15, unit: 'Kits', unit_cost: 290.0, status: 'out_of_stock', storage_location: 'Minor OT Rack B' },
    { id: 'inv-012', name: 'Vicryl Absorbable Sutures 2-0', sku: 'SRG-SUT-VIC2', category: 'Surgical', quantity: 28, minimum_threshold: 20, unit: 'Kits', unit_cost: 540.0, status: 'normal', storage_location: 'Minor OT Rack B' },
    { id: 'inv-013', name: 'Endotracheal Tubes 7.5mm Cuffed', sku: 'SRG-ETT-75', category: 'Surgical', quantity: 32, minimum_threshold: 25, unit: 'Units', unit_cost: 180.0, status: 'normal', storage_location: 'Anesthesia Storage Bay' },
    { id: 'inv-014', name: 'Endotracheal Tubes 8.0mm Cuffed', sku: 'SRG-ETT-80', category: 'Surgical', quantity: 14, minimum_threshold: 25, unit: 'Units', unit_cost: 180.0, status: 'low_stock', storage_location: 'Anesthesia Storage Bay' },
    { id: 'inv-015', name: 'Disposable Syringes with Needle 5ml', sku: 'CON-SYR-5ML', category: 'Consumables', quantity: 1500, minimum_threshold: 500, unit: 'Units', unit_cost: 4.5, status: 'normal', storage_location: 'General Nursing Depot' },
    { id: 'inv-016', name: 'Disposable Syringes with Needle 10ml', sku: 'CON-SYR-10ML', category: 'Consumables', quantity: 850, minimum_threshold: 400, unit: 'Units', unit_cost: 6.0, status: 'normal', storage_location: 'General Nursing Depot' },
    { id: 'inv-017', name: 'IV Cannula 20G (Pink)', sku: 'CON-CAN-20G', category: 'Consumables', quantity: 420, minimum_threshold: 200, unit: 'Units', unit_cost: 32.0, status: 'normal', storage_location: 'General Nursing Depot' },
    { id: 'inv-018', name: 'IV Cannula 18G (Green)', sku: 'CON-CAN-18G', category: 'Consumables', quantity: 110, minimum_threshold: 150, unit: 'Units', unit_cost: 34.0, status: 'low_stock', storage_location: 'General Nursing Depot' },
    { id: 'inv-019', name: 'Blood Administration Infusion Sets', sku: 'CON-BLD-SET', category: 'Consumables', quantity: 65, minimum_threshold: 50, unit: 'Sets', unit_cost: 120.0, status: 'normal', storage_location: 'Blood Bank Antechamber' },
    { id: 'inv-020', name: 'Adrenaline (Epinephrine) 1mg/ml Amps', sku: 'MED-ADR-1MG', category: 'Emergency', quantity: 95, minimum_threshold: 40, unit: 'Ampoules', unit_cost: 85.0, status: 'normal', storage_location: 'Emergency Crash Cart Station' },
    { id: 'inv-021', name: 'Atropine Sulfate 0.6mg/ml Injections', sku: 'MED-ATR-06', category: 'Emergency', quantity: 80, minimum_threshold: 30, unit: 'Ampoules', unit_cost: 42.0, status: 'normal', storage_location: 'Emergency Crash Cart Station' },
    { id: 'inv-022', name: 'Rapid Diagnostic Antigen Troponin-I', sku: 'DIA-TRP-KIT', category: 'Diagnostic', quantity: 5, minimum_threshold: 25, unit: 'Kits', unit_cost: 890.0, status: 'critical', storage_location: 'Pathology Point-of-Care' },
    { id: 'inv-023', name: 'Arterial Blood Gas (ABG) Cartridges', sku: 'DIA-ABG-CRT', category: 'Diagnostic', quantity: 42, minimum_threshold: 30, unit: 'Cartridges', unit_cost: 650.0, status: 'normal', storage_location: 'ICU Satellite Lab' },
    { id: 'inv-024', name: 'Cefotaxime 1g Sterile Vial Injections', sku: 'MED-ANT-CEF1', category: 'Pharmaceuticals', quantity: 180, minimum_threshold: 100, unit: 'Vials', unit_cost: 115.0, status: 'normal', storage_location: 'Central Pharmacy Bay B' },
    { id: 'inv-025', name: 'Propofol 1% 20ml Anesthetic Vials', sku: 'MED-ANE-PRO2', category: 'Pharmaceuticals', quantity: 48, minimum_threshold: 30, unit: 'Vials', unit_cost: 240.0, status: 'normal', storage_location: 'OT Pharmacy Vault' },
  ];

  // 7. AMBULANCES (10 fleet vehicles)
  public ambulances: Ambulance[] = [
    { id: 'amb-001', ambulance_code: 'AMB-101', driver: 'Dinesh Rawat', driver_phone: '+91-98700-44101', vehicle_status: 'available', location: 'Hospital Emergency Ramp Bay 1', destination: null, current_request: null, equipment_level: 'Advanced Life Support (ALS)' },
    { id: 'amb-002', ambulance_code: 'AMB-102', driver: 'Sanjay Yadav', driver_phone: '+91-98700-44102', vehicle_status: 'dispatched', location: 'Western Express Highway Toll', destination: 'Andheri Metro Interchange', current_request: 'Cardiorespiratory Distress Transfer', equipment_level: 'Advanced Life Support (ALS)' },
    { id: 'amb-003', ambulance_code: 'AMB-103', driver: 'Mohan Lal', driver_phone: '+91-98700-44103', vehicle_status: 'en_route', location: 'S.V. Road Khar Junction', destination: 'Apex Metro Emergency Bay', current_request: 'Motor Vehicle Collision Victim', equipment_level: 'Critical Care Mobile ICU' },
    { id: 'amb-004', ambulance_code: 'AMB-104', driver: 'Kiran Gurav', driver_phone: '+91-98700-44104', vehicle_status: 'available', location: 'Hospital Emergency Ramp Bay 2', destination: null, current_request: null, equipment_level: 'Basic Life Support (BLS)' },
    { id: 'amb-005', ambulance_code: 'AMB-105', driver: 'Vinod Thorat', driver_phone: '+91-98700-44105', vehicle_status: 'at_hospital', location: 'Triage Decontamination Bay', destination: null, current_request: 'Patient Inflow Handover Complete', equipment_level: 'Basic Life Support (BLS)' },
    { id: 'amb-006', ambulance_code: 'AMB-106', driver: 'Satish Gaikwad', driver_phone: '+91-98700-44106', vehicle_status: 'maintenance', location: 'Fleet Workshop & Sanitation', destination: null, current_request: 'Routine Oxygen Flowmeter Calibration', equipment_level: 'Advanced Life Support (ALS)' },
    { id: 'amb-007', ambulance_code: 'AMB-107', driver: 'Raju Kamble', driver_phone: '+91-98700-44107', vehicle_status: 'available', location: 'Hospital North Gate Staging', destination: null, current_request: null, equipment_level: 'Neonatal Transport Unit' },
    { id: 'amb-008', ambulance_code: 'AMB-108', driver: 'Deepak More', driver_phone: '+91-98700-44108', vehicle_status: 'dispatched', location: 'Bandra-Worli Sea Link Exit', destination: 'Worli Naka Medical Center', current_request: 'Inter-hospital Organ Transport', equipment_level: 'Advanced Life Support (ALS)' },
    { id: 'amb-009', ambulance_code: 'AMB-109', driver: 'Prasad Sawant', driver_phone: '+91-98700-44109', vehicle_status: 'available', location: 'Hospital Emergency Ramp Bay 3', destination: null, current_request: null, equipment_level: 'Basic Life Support (BLS)' },
    { id: 'amb-010', ambulance_code: 'AMB-110', driver: 'Ganesh Shinde', driver_phone: '+91-98700-44110', vehicle_status: 'at_hospital', location: 'Discharge Patient Transfer Port', destination: null, current_request: 'Re-stocking Medical Supplies', equipment_level: 'Advanced Life Support (ALS)' },
  ];

  // 8. APPOINTMENTS (25 operational clinic visits)
  public appointments: Appointment[] = [
    { id: 'apt-001', patient_name: 'Anita Roy', doctor_name: 'Dr. Rajesh Sen', department: 'Cardiology', date: '2026-09-30', time: '10:00 AM', type: 'Consultation', status: 'upcoming', notes: 'Routine ECG and Holter review' },
    { id: 'apt-002', patient_name: 'Vikram Joshi', doctor_name: 'Dr. Sanjana Rao', department: 'Orthopedics', date: '2026-09-30', time: '10:30 AM', type: 'Post-op Followup', status: 'upcoming', notes: 'Knee arthroscopy suture line evaluation' },
    { id: 'apt-003', patient_name: 'Meena Saxena', doctor_name: 'Dr. Arvind Joshi', department: 'Neurology', date: '2026-09-30', time: '11:15 AM', type: 'Consultation', status: 'upcoming', notes: 'Migraine management and MRI report' },
    { id: 'apt-004', patient_name: 'Prakash Nair', doctor_name: 'Dr. Vikram Malhotra', department: 'General Surgery', date: '2026-09-30', time: '11:45 AM', type: 'Pre-op Assessment', status: 'upcoming', notes: 'Gallbladder ultrasound review' },
    { id: 'apt-005', patient_name: 'Sushila Sen', doctor_name: 'Dr. Kavita Desai', department: 'Nephrology', date: '2026-09-30', time: '12:30 PM', type: 'Dialysis Review', status: 'upcoming', notes: 'Electrolyte panel & fistula check' },
    { id: 'apt-006', patient_name: 'Kabir Verma', doctor_name: 'Dr. Meera Nambiar', department: 'Pediatrics', date: '2026-09-30', time: '02:00 PM', type: 'Immunization', status: 'upcoming', notes: 'MMR Booster and developmental milestones' },
    { id: 'apt-007', patient_name: 'Farhan Shaikh', doctor_name: 'Dr. Harish Patel', department: 'Radiology', date: '2026-09-30', time: '02:30 PM', type: 'Ultrasound Scan', status: 'upcoming', notes: 'Abdominal doppler assessment' },
    { id: 'apt-008', patient_name: 'Lata Mangeshkar', doctor_name: 'Dr. Sunita Kulkarni', department: 'Oncology', date: '2026-09-30', time: '03:15 PM', type: 'Chemotherapy Cycle', status: 'upcoming', notes: 'Pre-chemo blood counts clear' },
    { id: 'apt-009', patient_name: 'Rameshwar Lal', doctor_name: 'Dr. Rohan Mehra', department: 'Cardiology', date: '2026-09-30', time: '04:00 PM', type: 'Hypertension Followup', status: 'upcoming', notes: 'Target BP adjustment' },
    { id: 'apt-010', patient_name: 'Sheetal Shinde', doctor_name: 'Dr. Deepak Shinde', department: 'Orthopedics', date: '2026-09-30', time: '04:30 PM', type: 'Spine Checkup', status: 'upcoming', notes: 'Lumbar traction outcome report' },
    { id: 'apt-011', patient_name: 'Aditya Chopra', doctor_name: 'Dr. Nikhil Bhatia', department: 'General Medicine', date: '2026-10-01', time: '09:30 AM', type: 'Executive Health Check', status: 'upcoming', notes: 'Annual corporate profile' },
    { id: 'apt-012', patient_name: 'Bhavna Kothari', doctor_name: 'Dr. Tanvi Parekh', department: 'Dermatology', date: '2026-10-01', time: '10:00 AM', type: 'Consultation', status: 'upcoming', notes: 'Allergy patch test evaluation' },
    { id: 'apt-013', patient_name: 'Chetan Bhagat', doctor_name: 'Dr. Suresh Pillai', department: 'General Surgery', date: '2026-10-01', time: '10:45 AM', type: 'Followup', status: 'upcoming', notes: 'Post-appendectomy wound check' },
    { id: 'apt-014', patient_name: 'Divya Dutta', doctor_name: 'Dr. Neha Agarwal', department: 'Neurology', date: '2026-10-01', time: '11:30 AM', type: 'Consultation', status: 'upcoming', notes: 'Vertigo assessment' },
    { id: 'apt-015', patient_name: 'Eshaan Deol', doctor_name: 'Dr. Ananya Roy', department: 'Pediatrics', date: '2026-10-01', time: '12:15 PM', type: 'Pediatric Pulmonology', status: 'upcoming', notes: 'Asthma inhaler technique check' },
    { id: 'apt-016', patient_name: 'Girish Karnad', doctor_name: 'Dr. Gaurav Kapoor', department: 'Nephrology', date: '2026-10-01', time: '02:00 PM', type: 'Review', status: 'upcoming', notes: 'Creatinine baseline evaluation' },
    { id: 'apt-017', patient_name: 'Hema Malini', doctor_name: 'Dr. Vandana Swaminathan', department: 'Cardiology', date: '2026-10-01', time: '02:45 PM', type: 'Pediatric Cardiac Review', status: 'upcoming', notes: 'Congenital defect echo followup' },
    { id: 'apt-018', patient_name: 'Iqbal Ansari', doctor_name: 'Dr. Manish Trivedi', department: 'Oncology', date: '2026-10-01', time: '03:30 PM', type: 'Surgical Consult', status: 'upcoming', notes: 'Biopsy margin review' },
    { id: 'apt-019', patient_name: 'Jaya Bachchan', doctor_name: 'Dr. Shalini Saxena', department: 'Radiology', date: '2026-10-01', time: '04:15 PM', type: 'Guided Biopsy', status: 'upcoming', notes: 'Thyroid nodule FNAC' },
    { id: 'apt-020', patient_name: 'Kishore Kumar', doctor_name: 'Dr. Priya Varma', department: 'Emergency & Trauma', date: '2026-09-29', time: '08:00 AM', type: 'Emergency Review', status: 'completed', notes: 'Rib contusion discharge cleared' },
    { id: 'apt-021', patient_name: 'Leela Samson', doctor_name: 'Dr. Sanjana Rao', department: 'Orthopedics', date: '2026-09-29', time: '09:00 AM', type: 'Consultation', status: 'completed', notes: 'Plaster cast removed' },
    { id: 'apt-022', patient_name: 'Madhavan R', doctor_name: 'Dr. Rajesh Sen', department: 'Cardiology', date: '2026-09-29', time: '09:45 AM', type: 'Stress Echo', status: 'completed', notes: 'Stress test within normal limits' },
    { id: 'apt-023', patient_name: 'Nandita Das', doctor_name: 'Dr. Arvind Joshi', department: 'Neurology', date: '2026-09-29', time: '11:00 AM', type: 'EEG Review', status: 'completed', notes: 'No epileptiform activity detected' },
    { id: 'apt-024', patient_name: 'Om Puri', doctor_name: 'Dr. Vikram Malhotra', department: 'General Surgery', date: '2026-09-29', time: '12:00 PM', type: 'Hernia Consult', status: 'completed', notes: 'Scheduled for elective repair' },
    { id: 'apt-025', patient_name: 'Pankaj Kapur', doctor_name: 'Dr. Meera Nambiar', department: 'Pediatrics', date: '2026-09-29', time: '01:30 PM', type: 'Consultation', status: 'completed', notes: 'Viral pyrexia management resolved' },
  ];

  // 9. TASKS (25 operational tickets across hospital departments)
  public tasks: Task[] = [
    { id: 'tsk-001', title: 'Prepare ICU-B1 for Post-CABG Patient', description: 'Sterilize telemetry leads, prime arterial line monitor, and ensure ventilator circuit tested.', department: 'Intensive Care Unit', assigned_employee: 'Nurse In-Charge Anjali', priority: 'critical', status: 'in_progress', due_time: '11:30 AM', source_workflow: 'Admission Automation', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'tsk-002', title: 'Restock Medical Oxygen Manifold Bank 2', description: 'Connect fresh 47L cylinders to manifold line B. Verify pressure gauge at 4.2 bar.', department: 'Facilities & Gas Supply', assigned_employee: 'Technician Ramesh G', priority: 'critical', status: 'pending', due_time: '12:00 PM', source_workflow: 'Inventory Threshold Engine', created_at: new Date(Date.now() - 5400000).toISOString() },
    { id: 'tsk-003', title: 'Transport Emergency Blood Samples to Lab', description: 'Patient PAT-1004 cross-match for 2 units O-negative PRBC.', department: 'Emergency & Trauma', assigned_employee: 'Orderly Sunil P', priority: 'critical', status: 'in_progress', due_time: '11:15 AM', source_workflow: 'Emergency Triage Protocol', created_at: new Date(Date.now() - 1800000).toISOString() },
    { id: 'tsk-004', title: 'Discharge Summary Clearance: PAT-1003', description: 'Finalize pharmacy medication reconciliation and billing discharge slip.', department: 'Billing & Administration', assigned_employee: 'Billing Officer Rekha', priority: 'medium', status: 'pending', due_time: '01:00 PM', source_workflow: 'Discharge Automation', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'tsk-005', title: 'Sanitize & Prepare Bed GEN-B4 for Transfer', description: 'Terminal cleaning following patient discharge. Change linen, disinfect railings and call bell.', department: 'Bed Management', assigned_employee: 'Housekeeping Team Lead Manoj', priority: 'high', status: 'in_progress', due_time: '12:30 PM', source_workflow: 'Bed Allocation Engine', created_at: new Date(Date.now() - 4200000).toISOString() },
    { id: 'tsk-006', title: 'Defibrillator Daily Battery & Spike Check', description: 'Verify self-test status on Crash Carts in Floor 2, 3, 4 and Emergency Bay.', department: 'Biomedical Engineering', assigned_employee: 'Bio-Eng Karthik', priority: 'high', status: 'completed', due_time: '09:00 AM', source_workflow: 'Daily Safety Checklist', created_at: new Date(Date.now() - 14400000).toISOString() },
    { id: 'tsk-007', title: 'Procure Urgent Suture Kits 3-0 Silk', description: 'Stock at 0 units. Send emergency purchase order to certified supplier.', department: 'Materials & Procurement', assigned_employee: 'Procurement Specialist Deepa', priority: 'high', status: 'pending', due_time: '02:00 PM', source_workflow: 'Inventory Threshold Engine', created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 'tsk-008', title: 'Dialysis Machine 3 Filter Replacement', description: 'Replace reverse osmosis pre-filters and run disinfectant rinse cycle.', department: 'Nephrology', assigned_employee: 'Technician Altaf', priority: 'medium', status: 'in_progress', due_time: '03:00 PM', source_workflow: 'Equipment Maintenance SLA', created_at: new Date(Date.now() - 9000000).toISOString() },
    { id: 'tsk-009', title: 'Pre-Op Fasting Verification for OT-2 Case', description: 'Verify 8-hour NPO status and consent documentation for laparoscopic cholecystectomy.', department: 'General Surgery', assigned_employee: 'Staff Nurse Swapna', priority: 'high', status: 'pending', due_time: '01:30 PM', source_workflow: 'Surgical Pathway Automation', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'tsk-010', title: 'Ambulance AMB-106 Oxygen Pressure Calibration', description: 'Vehicle in maintenance. Replace faulty flow regulator and conduct leak test.', department: 'Fleet Operations', assigned_employee: 'Mechanic Jagdish', priority: 'medium', status: 'in_progress', due_time: '04:00 PM', source_workflow: 'Fleet Telemetry Alert', created_at: new Date(Date.now() - 12000000).toISOString() },
    { id: 'tsk-011', title: 'Pediatric Ward Milk Kitchen Sanitization', description: 'Daily bacteriological wipe-down and formula inventory logging.', department: 'Pediatrics', assigned_employee: 'Nurse Sunita K', priority: 'low', status: 'completed', due_time: '08:30 AM', source_workflow: 'Infection Control Protocol', created_at: new Date(Date.now() - 18000000).toISOString() },
    { id: 'tsk-012', title: 'Deliver IV Saline Batches to General Ward A', description: 'Deliver 60 bags of 0.9% Normal Saline from central pharmacy.', department: 'Pharmacy Dispatch', assigned_employee: 'Runner Sandeep', priority: 'medium', status: 'completed', due_time: '10:00 AM', source_workflow: 'Pharmacy Restock Engine', created_at: new Date(Date.now() - 11000000).toISOString() },
    { id: 'tsk-013', title: 'Emergency Bay Decontamination following Trauma Inflow', description: 'Deep clean Trauma Bay 1 after MVA resuscitation.', department: 'Emergency & Trauma', assigned_employee: 'Housekeeping Team B', priority: 'critical', status: 'completed', due_time: '10:15 AM', source_workflow: 'Trauma Triage Pathway', created_at: new Date(Date.now() - 9800000).toISOString() },
    { id: 'tsk-014', title: 'Review ICU Step-down Candidates for Transfer', description: 'Coordinate with Dr. Alok Nath regarding patients ready for Semi-Private beds.', department: 'Bed Management', assigned_employee: 'Bed Manager Geeta', priority: 'high', status: 'in_progress', due_time: '02:30 PM', source_workflow: 'Capacity Optimization Bot', created_at: new Date(Date.now() - 4800000).toISOString() },
    { id: 'tsk-015', title: 'Radiology PACS Archive Integrity Check', description: 'Verify redundant backup replication of MRI and CT scans for last 48 hours.', department: 'Health Informatics', assigned_employee: 'IT Specialist Praveen', priority: 'low', status: 'completed', due_time: '07:00 AM', source_workflow: 'Data Integrity Routine', created_at: new Date(Date.now() - 21600000).toISOString() },
    { id: 'tsk-016', title: 'Patient Meal Tray Dispatch - Low Sodium Ward Diet', description: 'Audit 32 cardiac patient dietary trays prior to lunchtime floor distribution.', department: 'Dietary Services', assigned_employee: 'Nutritionist Shweta', priority: 'medium', status: 'pending', due_time: '12:45 PM', source_workflow: 'Dietary Automation', created_at: new Date(Date.now() - 2400000).toISOString() },
    { id: 'tsk-017', title: 'Check Emergency Generator Diesel Fuel Reservoir', description: 'Verify tank level > 90% and run automated 15-minute onload transfer test.', department: 'Facilities & Engineering', assigned_employee: 'Engineer Naresh', priority: 'high', status: 'completed', due_time: '08:00 AM', source_workflow: 'Hospital Resiliency SLA', created_at: new Date(Date.now() - 19200000).toISOString() },
    { id: 'tsk-018', title: 'Cardiac Telemetry Lead Replacement on Ward GEN-B2', description: 'Replace worn 5-lead ECG monitoring cable for patient PAT-1008.', department: 'Biomedical Engineering', assigned_employee: 'Bio-Eng Karthik', priority: 'medium', status: 'pending', due_time: '03:15 PM', source_workflow: 'Nursing Ticket', created_at: new Date(Date.now() - 3000000).toISOString() },
    { id: 'tsk-019', title: 'Narcotics Register Dual-Verification Audit', description: 'Conduct shift-change physical count of Schedule H1 injectable narcotics.', department: 'Central Pharmacy', assigned_employee: 'Chief Pharmacist Iyer', priority: 'high', status: 'completed', due_time: '08:00 AM', source_workflow: 'Regulatory Compliance Bot', created_at: new Date(Date.now() - 17500000).toISOString() },
    { id: 'tsk-020', title: 'Verify Fire Exits & Corridor Clearances Floor 3', description: 'Ensure no gurneys or linen carts block emergency stairwell egress.', department: 'Safety & Security', assigned_employee: 'Safety Marshal Ajay', priority: 'medium', status: 'completed', due_time: '09:30 AM', source_workflow: 'NABH Compliance Audit', created_at: new Date(Date.now() - 13000000).toISOString() },
    { id: 'tsk-021', title: 'Cold-Chain Vaccine Refrigerator Temperature Logging', description: 'Log current temp (+4.1C) and verify automated SMS alert trigger.', department: 'Pediatrics', assigned_employee: 'Nurse Sunita K', priority: 'high', status: 'completed', due_time: '08:00 AM', source_workflow: 'Cold Chain Monitor', created_at: new Date(Date.now() - 18500000).toISOString() },
    { id: 'tsk-022', title: 'Prepare Isolation Antechamber for Infectious Intake', description: 'Ensure negative pressure differential active at Room ICU-301.', department: 'Infection Control', assigned_employee: 'Orderly Sunil P', priority: 'critical', status: 'in_progress', due_time: '01:00 PM', source_workflow: 'Admission Automation', created_at: new Date(Date.now() - 1500000).toISOString() },
    { id: 'tsk-023', title: 'Disinfect Wheelchairs and Gurneys at Patient Entrance', description: 'Sanitize 12 fleet transfer chairs and 4 hydraulic stretchers.', department: 'Hospital Support Services', assigned_employee: 'Housekeeping Team A', priority: 'low', status: 'completed', due_time: '09:45 AM', source_workflow: 'Daily Hygiene Schedule', created_at: new Date(Date.now() - 12500000).toISOString() },
    { id: 'tsk-024', title: 'Process OPD Medical Records Scanning Queue', description: 'Scan 45 morning outpatient paper consultation sheets into EMR.', department: 'Medical Records (MRD)', assigned_employee: 'MRD Clerk Tejas', priority: 'low', status: 'in_progress', due_time: '05:00 PM', source_workflow: 'Digital Record Migration', created_at: new Date(Date.now() - 6000000).toISOString() },
    { id: 'tsk-025', title: 'Hazardous Biomedical Waste Transfer to Storage Vault', description: 'Weigh and seal red, yellow, and blue waste bins from OTs and ICUs.', department: 'Waste Management', assigned_employee: 'Specialist Mukesh', priority: 'high', status: 'pending', due_time: '04:30 PM', source_workflow: 'Biomedical Waste SLA', created_at: new Date(Date.now() - 4000000).toISOString() },
  ];

  // 10. APPROVALS (8 governance and risk tickets)
  public approvals: Approval[] = [
    { id: 'appr-001', action: 'Bulk Restock: 50 Medical Oxygen Cylinders (47L)', requested_by: 'Inventory Automation Engine', approver: null, risk_level: 'critical', status: 'pending', reason: 'Current inventory is 8 cylinders (Safety threshold is 15). Critical emergency buffer at risk.', resolved_at: null, created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'appr-002', action: 'Emergency Off-Formulary Antibiotic Release', requested_by: 'Dr. Rajesh Sen', approver: 'Chief Medical Superintendent', risk_level: 'high', status: 'approved', reason: 'Patient PAT-1001 exhibiting severe multi-drug resistant Klebsiella pneumonia septic shock.', resolved_at: new Date(Date.now() - 3600000).toISOString(), created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 'appr-003', action: 'High-Cost Titanium Orthopedic Implant Purchase (₹1,24,000)', requested_by: 'Dr. Sanjana Rao', approver: null, risk_level: 'high', status: 'pending', reason: 'Complex comminuted femur fracture reconstruction scheduled in OT-1 tomorrow.', resolved_at: null, created_at: new Date(Date.now() - 5400000).toISOString() },
    { id: 'appr-004', action: 'Cross-District ALS Ambulance Transfer (Pune Trauma Center)', requested_by: 'Emergency Triage Director', approver: 'Hospital COO', risk_level: 'high', status: 'approved', reason: 'Specialized extracorporeal membrane oxygenation (ECMO) patient transfer.', resolved_at: new Date(Date.now() - 86400000).toISOString(), created_at: new Date(Date.now() - 90000000).toISOString() },
    { id: 'appr-005', action: 'Overtime Roster Authorization: 8 Night Nursing Staff', requested_by: 'Nursing Superintendent Mary', approver: null, risk_level: 'medium', status: 'pending', reason: 'Sudden surge in acute respiratory distress admissions requiring 1:1 nurse-to-patient ratio.', resolved_at: null, created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'appr-006', action: 'Biomedical Waste Disposal Vendor Contract Extension', requested_by: 'Operations Manager Kulkarni', approver: 'Director of Finance', risk_level: 'low', status: 'approved', reason: 'Standard quarterly renewal for certified autoclave incinerator provider.', resolved_at: new Date(Date.now() - 172800000).toISOString(), created_at: new Date(Date.now() - 180000000).toISOString() },
    { id: 'appr-007', action: 'Experimental Diagnostic Molecular Sequencing Panel', requested_by: 'Dr. Sunita Kulkarni', approver: 'Ethics Review Committee', risk_level: 'critical', status: 'rejected', reason: 'Lacks institutional review board clearance for phase-1 genomic protocol.', resolved_at: new Date(Date.now() - 43200000).toISOString(), created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'appr-008', action: 'Emergency Surgery Slot Preemption (OT-3 Rescheduled)', requested_by: 'Dr. Priya Varma', approver: 'Surgical Director Malhotra', risk_level: 'high', status: 'approved', reason: 'Emergency ruptured aortic aneurysm prioritized over elective laparoscopic repair.', resolved_at: new Date(Date.now() - 14400000).toISOString(), created_at: new Date(Date.now() - 18000000).toISOString() },
  ];

  // 11. AUDIT & ACTIVITY TIMELINE (30 chronological operational events)
  public auditLogs: AuditLog[] = [];

  // 12. NOTIFICATIONS (8 system alerts)
  public notifications: Notification[] = [
    { id: 'notif-001', title: 'Oxygen Stock Critical', message: 'Medical Oxygen cylinder reserve is at 8 units. Automated purchase requisition submitted.', type: 'urgent', department: 'Facilities & Gas Supply', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'notif-002', title: 'Ambulance AMB-101 Dispatched', message: 'Unit AMB-101 underway to Sector 62 Metro Station with ALS crew.', type: 'info', department: 'Emergency & Trauma', is_read: false, created_at: new Date(Date.now() - 5400000).toISOString() },
    { id: 'notif-003', title: 'ICU Bed Availability Low', message: 'Only 3 ICU beds remain available in Intensive Care Wing A.', type: 'warning', department: 'Bed Management', is_read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'notif-004', title: 'Automated Patient Admission', message: 'Rahul Sharma admitted to Cardiology under Dr. Rajesh Sen.', type: 'success', department: 'Cardiology', is_read: true, created_at: new Date(Date.now() - 9000000).toISOString() },
    { id: 'notif-005', title: 'Emergency Blood Requisition', message: 'Cross-match confirmed for 2 units O-negative PRBC for trauma bay.', type: 'urgent', department: 'Blood Bank', is_read: true, created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 'notif-006', title: 'Shift Handover Completed', message: 'Morning to evening clinical nursing handover concluded across all 6 wards.', type: 'info', department: 'Nursing Operations', is_read: true, created_at: new Date(Date.now() - 14400000).toISOString() },
    { id: 'notif-007', title: 'Inventory Reorder Suture Kit Silk 3-0', message: 'Current stock is 0. Supplier PO #4092 sent to Authorized Medical Distributor.', type: 'warning', department: 'Materials & Procurement', is_read: true, created_at: new Date(Date.now() - 18000000).toISOString() },
    { id: 'notif-008', title: 'System Security & Telemetry Heartbeat', message: 'Deterministic workflow execution guardrails operational with zero anomalies.', type: 'success', department: 'Operations Command', is_read: true, created_at: new Date(Date.now() - 21600000).toISOString() },
  ];

  // 13. HOSPITAL NETWORK (Government reference dataset)
  public networkFacilities: NetworkFacility[] = [];

  // 14. AUTOMATION RUNS
  public workflows: Workflow[] = [
    { id: 'wf-001', name: 'Patient Admission Automation', trigger: 'AI Command / Emergency Intake', description: 'Allocates bed, assigns on-duty specialist, and generates standardized clinical intake tasks.', status: 'active' },
    { id: 'wf-002', name: 'Emergency Ambulance Dispatch', trigger: 'Trauma Call / 108 Telemetry', description: 'Identifies nearest idle ALS/BLS unit, computes waypoint route, and alerts triage bay.', status: 'active' },
    { id: 'wf-003', name: 'Inventory Threshold Replenishment', trigger: 'Safety Threshold Breach', description: 'Monitors real-time stock and automatically creates purchase requisitions and storekeeper tasks.', status: 'active' },
    { id: 'wf-004', name: 'Bed Allocation & Turnaround', trigger: 'Discharge Order / Transfer Request', description: 'Locks sanitized beds, coordinates porter transfers, and alerts nursing supervisors.', status: 'active' },
  ];

  public automationRuns: AutomationRun[] = [];

  constructor() {
    this.initializeBedsAndPatients();
    this.initializeAuditLogs();
  }

  private initializeBedsAndPatients() {
    // Generate 60 synthetic beds across our 21 rooms and 6 wards
    const roomBedMap: { roomIndex: number; count: number; prefix: string; wardIndex: number }[] = [
      { roomIndex: 0, count: 2, prefix: 'ICU-B', wardIndex: 0 },
      { roomIndex: 1, count: 4, prefix: 'ICU-B', wardIndex: 0 },
      { roomIndex: 2, count: 3, prefix: 'ICU-B', wardIndex: 0 },
      { roomIndex: 3, count: 3, prefix: 'ICU-B', wardIndex: 0 },
      { roomIndex: 4, count: 1, prefix: 'STE-B', wardIndex: 1 },
      { roomIndex: 5, count: 1, prefix: 'STE-B', wardIndex: 1 },
      { roomIndex: 6, count: 1, prefix: 'STE-B', wardIndex: 1 },
      { roomIndex: 7, count: 1, prefix: 'STE-B', wardIndex: 1 },
      { roomIndex: 8, count: 2, prefix: 'SEM-B', wardIndex: 2 },
      { roomIndex: 9, count: 2, prefix: 'SEM-B', wardIndex: 2 },
      { roomIndex: 10, count: 2, prefix: 'SEM-B', wardIndex: 2 },
      { roomIndex: 11, count: 2, prefix: 'SEM-B', wardIndex: 2 },
      { roomIndex: 12, count: 6, prefix: 'GEN-B', wardIndex: 3 },
      { roomIndex: 13, count: 6, prefix: 'GEN-B', wardIndex: 3 },
      { roomIndex: 14, count: 6, prefix: 'GEN-B', wardIndex: 3 },
      { roomIndex: 15, count: 6, prefix: 'GEN-B', wardIndex: 3 },
      { roomIndex: 16, count: 4, prefix: 'EMG-B', wardIndex: 4 },
      { roomIndex: 17, count: 3, prefix: 'EMG-B', wardIndex: 4 },
      { roomIndex: 18, count: 4, prefix: 'EMG-B', wardIndex: 4 },
      { roomIndex: 19, count: 4, prefix: 'OBS-B', wardIndex: 5 },
      { roomIndex: 20, count: 3, prefix: 'OBS-B', wardIndex: 5 },
    ];

    let bedCounter = 1;
    let bedList: Bed[] = [];

    for (const mapping of roomBedMap) {
      const room = this.rooms[mapping.roomIndex];
      const ward = this.wards[mapping.wardIndex];

      for (let i = 1; i <= mapping.count; i++) {
        const bedId = `f0000000-0000-0000-0000-${String(bedCounter).padStart(12, '0')}`;
        const bedNumber = `${mapping.prefix}${bedCounter}`;

        // Distribute statuses realistically: ~60% occupied, ~30% available, ~5% reserved, ~5% maintenance
        let status: 'available' | 'occupied' | 'reserved' | 'maintenance' = 'occupied';
        if (bedCounter % 5 === 0) status = 'available';
        else if (bedCounter % 8 === 0) status = 'available';
        else if (bedCounter === 7 || bedCounter === 23) status = 'reserved';
        else if (bedCounter === 18 || bedCounter === 38) status = 'maintenance';

        bedList.push({
          id: bedId,
          ward_id: ward.id,
          ward_name: ward.name,
          ward_category: ward.category,
          room_id: room.id,
          room_number: room.room_number,
          bed_number: bedNumber,
          status,
          is_powered: ward.category === 'icu' || ward.category === 'emergency' || bedCounter % 2 === 0,
          patient_name: status === 'occupied' ? undefined : undefined,
          last_cleaned_at: new Date(Date.now() - (bedCounter * 3600000)).toISOString(),
        });

        bedCounter++;
      }
    }
    this.beds = bedList;

    // Synthetic Patient Demographic Roster (60 distinct records)
    const patientSeed = [
      { name: 'Rahul Sharma', age: 54, gender: 'Male', dept: 'Cardiology', status: 'critical', bill: 65400, docIdx: 0, contact: 'Anita Sharma', phone: '+91-98111-22334' },
      { name: 'Pooja Iyer', age: 42, gender: 'Female', dept: 'Cardiology', status: 'admitted', bill: 38200, docIdx: 0, contact: 'Karthik Iyer', phone: '+91-98222-33445' },
      { name: 'Rajesh Kulkarni', age: 61, gender: 'Male', dept: 'Neurology', status: 'resting', bill: 82000, docIdx: 2, contact: 'Sunita Kulkarni', phone: '+91-98333-44556' },
      { name: 'Sunita Devi', age: 38, gender: 'Female', dept: 'General Surgery', status: 'discharge_ready', bill: 45000, docIdx: 5, contact: 'Ramesh Devi', phone: '+91-98444-55667' },
      { name: 'Ramesh Gupta', age: 49, gender: 'Male', dept: 'Orthopedics', status: 'admitted', bill: 91500, docIdx: 3, contact: 'Geeta Gupta', phone: '+91-98555-66778' },
      { name: 'Meenakshi Sundaram', age: 29, gender: 'Female', dept: 'Pediatrics', status: 'under_observation', bill: 18200, docIdx: 4, contact: 'Sundaram P', phone: '+91-98666-77889' },
      { name: 'Amit Patel', age: 67, gender: 'Male', dept: 'Intensive Care Unit', status: 'critical', bill: 145000, docIdx: 6, contact: 'Jignesh Patel', phone: '+91-98777-88990' },
      { name: 'Kavita Joshi', age: 34, gender: 'Female', dept: 'Emergency & Trauma', status: 'needs_attention', bill: 29000, docIdx: 1, contact: 'Arun Joshi', phone: '+91-98888-99001' },
      { name: 'Suresh Rao', age: 72, gender: 'Male', dept: 'Nephrology', status: 'admitted', bill: 74300, docIdx: 7, contact: 'Vidya Rao', phone: '+91-98999-00112' },
      { name: 'Deepa Nair', age: 45, gender: 'Female', dept: 'Oncology', status: 'admitted', bill: 112000, docIdx: 9, contact: 'Madhavan Nair', phone: '+91-98101-11223' },
      { name: 'Anand Deshmukh', age: 58, gender: 'Male', dept: 'Cardiology', status: 'resting', bill: 53000, docIdx: 10, contact: 'Smita Deshmukh', phone: '+91-98202-22334' },
      { name: 'Preeti Verma', age: 31, gender: 'Female', dept: 'General Surgery', status: 'admitted', bill: 39500, docIdx: 5, contact: 'Vivek Verma', phone: '+91-98303-33445' },
      { name: 'Sanjay Saxena', age: 63, gender: 'Male', dept: 'Neurology', status: 'critical', bill: 125000, docIdx: 2, contact: 'Ritu Saxena', phone: '+91-98404-44556' },
      { name: 'Neha Tiwari', age: 27, gender: 'Female', dept: 'Emergency & Trauma', status: 'admitted', bill: 22400, docIdx: 11, contact: 'Alok Tiwari', phone: '+91-98505-55667' },
      { name: 'Mohammad Rizwan', age: 52, gender: 'Male', dept: 'Orthopedics', status: 'resting', bill: 68000, docIdx: 13, contact: 'Fatima Rizwan', phone: '+91-98606-66778' },
      { name: 'Ananya Sen', age: 8, gender: 'Female', dept: 'Pediatrics', status: 'admitted', bill: 31000, docIdx: 4, contact: 'Debabrata Sen', phone: '+91-98707-77889' },
      { name: 'Manoj Kumar', age: 46, gender: 'Male', dept: 'Intensive Care Unit', status: 'critical', bill: 180000, docIdx: 6, contact: 'Saroj Devi', phone: '+91-98808-88990' },
      { name: 'Shilpa Bhat', age: 39, gender: 'Female', dept: 'Nephrology', status: 'admitted', bill: 58000, docIdx: 7, contact: 'Narayana Bhat', phone: '+91-98909-99001' },
      { name: 'Vikramaditya Bose', age: 65, gender: 'Male', dept: 'Oncology', status: 'resting', bill: 97500, docIdx: 9, contact: 'Malini Bose', phone: '+91-98010-00112' },
      { name: 'Tarun Mathur', age: 50, gender: 'Male', dept: 'Cardiology', status: 'admitted', bill: 62000, docIdx: 0, contact: 'Reena Mathur', phone: '+91-98112-11223' },
      { name: 'Farida Begum', age: 68, gender: 'Female', dept: 'General Medicine', status: 'admitted', bill: 41000, docIdx: 23, contact: 'Imran Khan', phone: '+91-98213-22334' },
      { name: 'Gautam Singhania', age: 44, gender: 'Male', dept: 'Cardiology', status: 'resting', bill: 115000, docIdx: 10, contact: 'Rupal Singhania', phone: '+91-98314-33445' },
      { name: 'Harsha Vardhan', age: 36, gender: 'Male', dept: 'Orthopedics', status: 'discharge_ready', bill: 78000, docIdx: 3, contact: 'Swathi Vardhan', phone: '+91-98415-44556' },
      { name: 'Indira Pillai', age: 59, gender: 'Female', dept: 'Emergency & Trauma', status: 'under_observation', bill: 34000, docIdx: 1, contact: 'Gopinath Pillai', phone: '+91-98516-55667' },
      { name: 'Jagdish Chandra', age: 71, gender: 'Male', dept: 'Intensive Care Unit', status: 'critical', bill: 210000, docIdx: 16, contact: 'Pankaj Chandra', phone: '+91-98617-66778' },
      { name: 'Kiran Bedi', age: 48, gender: 'Female', dept: 'General Surgery', status: 'admitted', bill: 51000, docIdx: 15, contact: 'Baljit Singh', phone: '+91-98718-77889' },
      { name: 'Lalit Modi', age: 56, gender: 'Male', dept: 'Nephrology', status: 'resting', bill: 84000, docIdx: 17, contact: 'Sushil Modi', phone: '+91-98819-88990' },
      { name: 'Manjula Chettiar', age: 62, gender: 'Female', dept: 'Neurology', status: 'admitted', bill: 93000, docIdx: 12, contact: 'Muthuswamy C', phone: '+91-98920-99001' },
      { name: 'Naveen Jindal', age: 41, gender: 'Male', dept: 'Cardiology', status: 'admitted', bill: 89000, docIdx: 0, contact: 'Shallu Jindal', phone: '+91-98021-00112' },
      { name: 'Pallavi Sharda', age: 33, gender: 'Female', dept: 'Dermatology', status: 'admitted', bill: 28000, docIdx: 24, contact: 'Nalin Sharda', phone: '+91-98122-11223' },
      { name: 'Qadir Hussain', age: 55, gender: 'Male', dept: 'General Medicine', status: 'resting', bill: 36000, docIdx: 23, contact: 'Zeenat Hussain', phone: '+91-98223-22334' },
      { name: 'Radha Mohan', age: 66, gender: 'Female', dept: 'Oncology', status: 'admitted', bill: 138000, docIdx: 19, contact: 'Devendra Mohan', phone: '+91-98324-33445' },
      { name: 'Subhash Ghai', age: 74, gender: 'Male', dept: 'Cardiology', status: 'critical', bill: 175000, docIdx: 0, contact: 'Mukta Ghai', phone: '+91-98425-44556' },
      { name: 'Tanushree Dutta', age: 37, gender: 'Female', dept: 'Emergency & Trauma', status: 'under_observation', bill: 27500, docIdx: 21, contact: 'Ishita Dutta', phone: '+91-98526-55667' },
      { name: 'Umesh Yadav', age: 30, gender: 'Male', dept: 'Orthopedics', status: 'admitted', bill: 64000, docIdx: 3, contact: 'Tanya Yadav', phone: '+91-98627-66778' },
      { name: 'Vaishali Samant', age: 43, gender: 'Female', dept: 'General Surgery', status: 'discharge_ready', bill: 42000, docIdx: 5, contact: 'Abhijit Samant', phone: '+91-98728-77889' },
      { name: 'Wasim Akram', age: 51, gender: 'Male', dept: 'Intensive Care Unit', status: 'critical', bill: 195000, docIdx: 6, contact: 'Shaniera Akram', phone: '+91-98829-88990' },
      { name: 'Xavier Fernandes', age: 60, gender: 'Male', dept: 'Neurology', status: 'admitted', bill: 76000, docIdx: 2, contact: 'Maria Fernandes', phone: '+91-98930-99001' },
      { name: 'Yashwant Sinha', age: 77, gender: 'Male', dept: 'Nephrology', status: 'resting', bill: 88000, docIdx: 7, contact: 'Jayant Sinha', phone: '+91-98031-00112' },
      { name: 'Zoya Akhtar', age: 46, gender: 'Female', dept: 'Cardiology', status: 'admitted', bill: 71000, docIdx: 10, contact: 'Farhan Akhtar', phone: '+91-98132-11223' },
      { name: 'Abhay Deol', age: 40, gender: 'Male', dept: 'General Medicine', status: 'resting', bill: 33000, docIdx: 23, contact: 'Ajit Deol', phone: '+91-98233-22334' },
      { name: 'Bipasha Basu', age: 44, gender: 'Female', dept: 'Orthopedics', status: 'admitted', bill: 82500, docIdx: 13, contact: 'Karan Grover', phone: '+91-98334-33445' },
      { name: 'Chunky Pandey', age: 59, gender: 'Male', dept: 'Cardiology', status: 'resting', bill: 67000, docIdx: 0, contact: 'Bhavana Pandey', phone: '+91-98435-44556' },
      { name: 'Dia Mirza', age: 39, gender: 'Female', dept: 'Pediatrics', status: 'admitted', bill: 44000, docIdx: 14, contact: 'Vaibhav Rekhi', phone: '+91-98536-55667' },
      { name: 'Emraan Hashmi', age: 43, gender: 'Male', dept: 'General Surgery', status: 'discharge_ready', bill: 59000, docIdx: 15, contact: 'Parveen Shahani', phone: '+91-98637-66778' },
      { name: 'Fardeen Khan', age: 47, gender: 'Male', dept: 'Emergency & Trauma', status: 'under_observation', bill: 31000, docIdx: 1, contact: 'Natasha Madhvani', phone: '+91-98738-77889' },
      { name: 'Genelia DSouza', age: 35, gender: 'Female', dept: 'Orthopedics', status: 'admitted', bill: 75000, docIdx: 3, contact: 'Riteish Deshmukh', phone: '+91-98839-88990' },
      { name: 'Hrithik Roshan', age: 48, gender: 'Male', dept: 'Neurology', status: 'resting', bill: 110000, docIdx: 2, contact: 'Rakesh Roshan', phone: '+91-98940-99001' },
      { name: 'Ileana DCruz', age: 34, gender: 'Female', dept: 'General Medicine', status: 'admitted', bill: 37000, docIdx: 23, contact: 'Michael Dolan', phone: '+91-98041-00112' },
      { name: 'John Abraham', age: 50, gender: 'Male', dept: 'Emergency & Trauma', status: 'admitted', bill: 49000, docIdx: 11, contact: 'Priya Runchal', phone: '+91-98142-11223' },
      { name: 'Kareena Kapoor', age: 41, gender: 'Female', dept: 'Pediatrics', status: 'admitted', bill: 52000, docIdx: 4, contact: 'Saif Ali Khan', phone: '+91-98243-22334' },
      { name: 'Lara Dutta', age: 43, gender: 'Female', dept: 'Cardiology', status: 'resting', bill: 63000, docIdx: 10, contact: 'Mahesh Bhupathi', phone: '+91-98344-33445' },
      { name: 'Mallika Sherawat', age: 45, gender: 'Female', dept: 'General Surgery', status: 'discharge_ready', bill: 46000, docIdx: 5, contact: 'Mukesh Lamba', phone: '+91-98445-44556' },
      { name: 'Nawazuddin Siddiqui', age: 49, gender: 'Male', dept: 'Nephrology', status: 'admitted', bill: 81000, docIdx: 7, contact: 'Aaliya Siddiqui', phone: '+91-98546-55667' },
      { name: 'Prachi Desai', age: 33, gender: 'Female', dept: 'Dermatology', status: 'resting', bill: 24000, docIdx: 24, contact: 'Niranjan Desai', phone: '+91-98647-66778' },
      { name: 'Ranbir Kapoor', age: 39, gender: 'Male', dept: 'Orthopedics', status: 'admitted', bill: 92000, docIdx: 3, contact: 'Alia Bhatt', phone: '+91-98748-77889' },
      { name: 'Soha Ali Khan', age: 42, gender: 'Female', dept: 'Oncology', status: 'resting', bill: 118000, docIdx: 9, contact: 'Kunal Kemmu', phone: '+91-98849-88990' },
      { name: 'Tabu Hashmi', age: 51, gender: 'Female', dept: 'Neurology', status: 'admitted', bill: 87000, docIdx: 2, contact: 'Farah Naaz', phone: '+91-98950-99001' },
      { name: 'Urmila Matondkar', age: 49, gender: 'Female', dept: 'Cardiology', status: 'admitted', bill: 73000, docIdx: 0, contact: 'Mohsin Akhtar', phone: '+91-98051-00112' },
      { name: 'Vivek Oberoi', age: 46, gender: 'Male', dept: 'Intensive Care Unit', status: 'critical', bill: 165000, docIdx: 6, contact: 'Priyanka Alva', phone: '+91-98152-11223' },
    ];

    let occupiedBedIdx = 0;
    const occupiedBeds = this.beds.filter((b) => b.status === 'occupied');

    this.patients = patientSeed.map((p, idx) => {
      const patientId = `10000000-0000-0000-0000-${String(idx + 1).padStart(12, '0')}`;
      const patientCode = `PAT-${1001 + idx}`;
      const doc = this.doctors[p.docIdx] || this.doctors[0];
      const admissionTime = new Date(Date.now() - (idx + 1) * 43200000).toISOString();

      let assignedBed: Bed | undefined;
      if (occupiedBedIdx < occupiedBeds.length && p.status !== 'discharge_ready') {
        assignedBed = occupiedBeds[occupiedBedIdx];
        assignedBed.patient_name = p.name;
        occupiedBedIdx++;
      }

      return {
        id: patientId,
        patient_code: patientCode,
        name: p.name,
        age: p.age,
        gender: p.gender,
        admission_date: admissionTime,
        discharge_date: null,
        ward_id: assignedBed ? assignedBed.ward_id : 'd0000000-0000-0000-0000-000000000004',
        ward_name: assignedBed ? assignedBed.ward_name : 'General Inpatient Ward A',
        room_id: assignedBed ? assignedBed.room_id : 'e0000000-0000-0000-0000-000000000013',
        room_number: assignedBed ? assignedBed.room_number : 'GEN-201',
        bed_id: assignedBed ? assignedBed.id : 'f0000000-0000-0000-0000-000000000013',
        bed_number: assignedBed ? assignedBed.bed_number : 'GEN-B13',
        doctor_id: doc.id,
        doctor_name: doc.name,
        department: p.dept,
        status: p.status as any,
        bill_amount: p.bill,
        emergency_contact: p.contact,
        emergency_phone: p.phone,
        created_at: admissionTime,
        updated_at: new Date().toISOString(),
      };
    });
  }

  private initializeAuditLogs() {
    const actions = [
      { action: 'automated_admission_completed', entity: 'patient', entityId: 'PAT-1001', details: { patient: 'Rahul Sharma', bed: 'ICU-B1', doctor: 'Dr. Rajesh Sen' }, minsAgo: 5 },
      { action: 'ambulance_dispatched', entity: 'ambulance', entityId: 'AMB-101', details: { destination: 'Sector 62 Metro Station', driver: 'Dinesh Rawat', urgency: 'critical' }, minsAgo: 12 },
      { action: 'inventory_restocked', entity: 'inventory', entityId: 'inv-001', details: { item: 'Normal Saline IV (0.9% 500ml)', added: 50, newQty: 240 }, minsAgo: 25 },
      { action: 'bed_occupied', entity: 'bed', entityId: 'ICU-B2', details: { patient: 'Amit Patel', ward: 'Intensive Care Wing A' }, minsAgo: 40 },
      { action: 'task_created', entity: 'task', entityId: 'tsk-001', details: { title: 'Prepare ICU-B1 for Post-CABG Patient', department: 'ICU' }, minsAgo: 55 },
      { action: 'approval_created', entity: 'approval', entityId: 'appr-001', details: { action: 'Bulk Restock: 50 Medical Oxygen Cylinders', risk: 'critical' }, minsAgo: 70 },
      { action: 'appointment_scheduled', entity: 'appointment', entityId: 'apt-001', details: { patient: 'Anita Roy', doctor: 'Dr. Rajesh Sen', date: '2026-09-30' }, minsAgo: 85 },
      { action: 'bed_reserved', entity: 'bed', entityId: 'STE-B1', details: { reservedFor: 'Pooja Iyer', ward: 'Executive Private Suites' }, minsAgo: 110 },
      { action: 'automated_admission_completed', entity: 'patient', entityId: 'PAT-1002', details: { patient: 'Pooja Iyer', bed: 'STE-B1', doctor: 'Dr. Arvind Joshi' }, minsAgo: 130 },
      { action: 'ambulance_status_updated', entity: 'ambulance', entityId: 'AMB-103', details: { status: 'en_route', waypoint: 'Khar Junction' }, minsAgo: 155 },
      { action: 'inventory_threshold_breach', entity: 'inventory', entityId: 'inv-003', details: { item: 'Medical Oxygen Cylinders (47L)', current: 8, threshold: 15 }, minsAgo: 180 },
      { action: 'task_completed', entity: 'task', entityId: 'tsk-006', details: { title: 'Defibrillator Daily Battery & Spike Check', technician: 'Bio-Eng Karthik' }, minsAgo: 210 },
      { action: 'doctor_shift_started', entity: 'doctor', entityId: 'DOC-CARD-01', details: { doctor: 'Dr. Rajesh Sen', shift: 'Morning' }, minsAgo: 240 },
      { action: 'doctor_shift_started', entity: 'doctor', entityId: 'DOC-EMRG-01', details: { doctor: 'Dr. Priya Varma', shift: 'Morning' }, minsAgo: 245 },
      { action: 'automated_admission_completed', entity: 'patient', entityId: 'PAT-1007', details: { patient: 'Amit Patel', bed: 'ICU-B3', doctor: 'Dr. Alok Nath' }, minsAgo: 280 },
      { action: 'approval_approved', entity: 'approval', entityId: 'appr-002', details: { approver: 'Chief Medical Superintendent', action: 'Off-Formulary Antibiotic' }, minsAgo: 320 },
      { action: 'task_completed', entity: 'task', entityId: 'tsk-012', details: { title: 'Deliver IV Saline Batches', runner: 'Sandeep' }, minsAgo: 360 },
      { action: 'bed_cleaned', entity: 'bed', entityId: 'GEN-B4', details: { ward: 'General Inpatient Ward A', sanitationStatus: 'passed' }, minsAgo: 400 },
      { action: 'ambulance_at_hospital', entity: 'ambulance', entityId: 'AMB-105', details: { destination: 'Apex Metro Emergency Bay', triageBay: 'Bay 2' }, minsAgo: 450 },
      { action: 'system_health_audit', entity: 'system', entityId: 'SYS-SRV-01', details: { status: 'healthy', memoryRssMb: 114, activeDb: 'hybrid' }, minsAgo: 500 },
      { action: 'appointment_completed', entity: 'appointment', entityId: 'apt-020', details: { patient: 'Kishore Kumar', doctor: 'Dr. Priya Varma' }, minsAgo: 550 },
      { action: 'task_completed', entity: 'task', entityId: 'tsk-015', details: { title: 'Radiology PACS Archive Integrity Check' }, minsAgo: 600 },
      { action: 'inventory_restocked', entity: 'inventory', entityId: 'inv-015', details: { item: 'Disposable Syringes 5ml', added: 500 }, minsAgo: 650 },
      { action: 'doctor_allocation', entity: 'doctor', entityId: 'DOC-SURG-01', details: { doctor: 'Dr. Vikram Malhotra', assignedTo: 'Pre-op Ward' }, minsAgo: 720 },
      { action: 'automated_admission_completed', entity: 'patient', entityId: 'PAT-1017', details: { patient: 'Manoj Kumar', bed: 'ICU-B4', doctor: 'Dr. Alok Nath' }, minsAgo: 800 },
    ];

    this.auditLogs = actions.map((a, idx) => ({
      id: `audit-${1001 + idx}`,
      action: a.action,
      source: 'CareFlow Automated Core',
      entity_type: a.entity,
      entity_id: a.entityId,
      result: 'success',
      details: a.details,
      created_at: new Date(Date.now() - a.minsAgo * 60000).toISOString(),
    }));
  }
}

export const mockStore = new MockDataStore();
