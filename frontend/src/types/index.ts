export type PatientStatus =
  | 'admitted'
  | 'resting'
  | 'under_observation'
  | 'needs_attention'
  | 'critical'
  | 'discharge_ready'
  | 'discharged';

export type WardCategory =
  | 'icu'
  | 'premium'
  | 'semi_premium'
  | 'general'
  | 'emergency'
  | 'observation';

export type BedStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export type InventoryStatus = 'normal' | 'low_stock' | 'critical' | 'out_of_stock';

export type AmbulanceStatus =
  | 'available'
  | 'dispatched'
  | 'en_route'
  | 'at_hospital'
  | 'maintenance';

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'pending';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'escalated';

export type ApprovalRisk = 'low' | 'medium' | 'high' | 'critical';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Patient {
  id: string;
  patient_code: string;
  name: string;
  age: number;
  gender: string;
  admission_date: string;
  discharge_date: string | null;
  ward_id: string | null;
  ward_name?: string;
  room_id: string | null;
  room_number?: string;
  bed_id: string | null;
  bed_number?: string;
  doctor_id: string | null;
  doctor_name?: string;
  department: string;
  status: PatientStatus;
  bill_amount: number;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  doctor_code: string;
  specialization: string;
  department: string;
  shift: string;
  availability: 'available' | 'busy' | 'on_call' | 'off_duty';
  workload: number;
  max_workload: number;
  contact_phone?: string;
  status: string;
}

export interface Ward {
  id: string;
  name: string;
  ward_code: string;
  category: WardCategory;
  floor_number: string;
  total_capacity: number;
  occupied_beds?: number;
}

export interface Room {
  id: string;
  ward_id: string;
  room_number: string;
  room_type: string;
  max_beds: number;
}

export interface Bed {
  id: string;
  ward_id: string;
  ward_name?: string;
  ward_category?: WardCategory;
  room_id: string;
  room_number?: string;
  bed_number: string;
  status: BedStatus;
  is_powered: boolean;
  notes?: string;
  patient_name?: string;
  last_cleaned_at?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minimum_threshold: number;
  unit: string;
  supplier_id?: string;
  supplier_name?: string;
  status: InventoryStatus;
  unit_cost: number;
  storage_location: string;
  updated_at?: string;
}

export interface Ambulance {
  id: string;
  ambulance_code: string;
  driver: string;
  driver_phone?: string;
  vehicle_status: AmbulanceStatus;
  location: string;
  destination: string | null;
  current_request: string | null;
  equipment_level: string;
  updated_at?: string;
}

export interface Appointment {
  id: string;
  patient_id?: string;
  patient_name: string;
  doctor_id?: string;
  doctor_name: string;
  department: string;
  date: string;
  time: string;
  type: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  department: string;
  assigned_employee: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_time: string;
  source_workflow: string;
  created_at: string;
}

export interface Approval {
  id: string;
  action: string;
  requested_by: string;
  approver: string | null;
  risk_level: ApprovalRisk;
  status: ApprovalStatus;
  reason: string;
  resolved_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  source: string;
  entity_type: string;
  entity_id: string | null;
  result: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface NetworkFacility {
  id: string;
  name: string;
  facility_type: string;
  ownership: string;
  state: string;
  district: string;
  pincode: string;
  total_beds: number;
  icu_beds: number;
  emergency_services: boolean;
  ambulance_count: number;
  contact_phone: string;
  source_attribution: string;
}

export interface DashboardStats {
  totalPatients: number;
  occupiedBeds: number;
  availableBeds: number;
  doctorsOnDuty: number;
  pendingTasks: number;
  activeAmbulances: number;
  lowStockItems: number;
  pendingApprovals: number;
  occupancyRate: number;
  totalAppointments?: number;
}

export interface AICommandResponse {
  intent: string;
  confidence: number;
  entities: {
    patientId?: string | null;
    patientName?: string | null;
    department?: string | null;
    wardCategory?: string | null;
    doctorName?: string | null;
    itemName?: string | null;
    quantity?: number | null;
    destination?: string | null;
    urgency?: string | null;
    date?: string | null;
    time?: string | null;
    taskTitle?: string | null;
  };
  missingInformation: string[];
  requiredActions: string[];
  priority: 'low' | 'normal' | 'high' | 'critical';
  explanation: string;
}

export interface CommandExecutionResult {
  success: boolean;
  message: string;
  automationRunId?: string;
  executedActions: string[];
  affectedEntities: {
    type: string;
    id: string;
    details?: Record<string, unknown>;
  }[];
  tasksCreated: string[];
  notificationsSent: string[];
  auditLogId?: string;
}

export interface CommandProcessingResult {
  parsed: AICommandResponse;
  execution: CommandExecutionResult | null;
  status: 'executed' | 'missing_requirements' | 'analyzed_only' | 'unrecognized';
  message: string;
  providerUsed?: string;
  modelUsed?: string;
}
