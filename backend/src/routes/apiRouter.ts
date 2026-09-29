import { Router, Request, Response } from 'express';
import { validateBody } from '../middleware/validateRequest.js';
import { AICommandRequestSchema } from '../types/index.js';
import { AIController } from '../controllers/aiController.js';
import { PatientController } from '../controllers/patientController.js';
import { DoctorController } from '../controllers/doctorController.js';
import { BedController } from '../controllers/bedController.js';
import { InventoryController } from '../controllers/inventoryController.js';
import { AmbulanceController } from '../controllers/ambulanceController.js';
import { AppointmentController } from '../controllers/appointmentController.js';
import { TaskController } from '../controllers/taskController.js';
import { ApprovalController } from '../controllers/approvalController.js';
import { NetworkController } from '../controllers/networkController.js';
import { AnalyticsController } from '../controllers/analyticsController.js';
import { ActivityController } from '../controllers/activityController.js';
import { config } from '../config/index.js';

export const apiRouter = Router();

// Health Check Endpoint
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    system: 'CareFlow AI Hospital Operations Platform',
    timestamp: new Date().toISOString(),
    databaseMode: config.hasSupabase ? 'Supabase PostgreSQL (Live)' : 'Synthetic Resilient Store',
    aiEngine: config.hasGemini ? 'Google Gemini 2.5 Flash' : 'Deterministic Hybrid NLP',
  });
});

// AI Command Center Endpoint (Strictly Backend Gemini / Automation Engine)
apiRouter.post('/ai/command', validateBody(AICommandRequestSchema), AIController.executeCommand);

// Patients API
apiRouter.get('/patients', PatientController.getAll);
apiRouter.get('/patients/:id', PatientController.getById);
apiRouter.post('/patients', PatientController.create);
apiRouter.patch('/patients/:id', PatientController.update);

// Doctors & Staff API
apiRouter.get('/doctors', DoctorController.getAll);
apiRouter.get('/doctors/:id', DoctorController.getById);

// Beds & Wards API
apiRouter.get('/beds', BedController.getBeds);
apiRouter.get('/beds/wards', BedController.getWards);
apiRouter.get('/beds/rooms', BedController.getRooms);
apiRouter.patch('/beds/:id/status', BedController.updateBedStatus);

// Inventory API
apiRouter.get('/inventory', InventoryController.getAll);
apiRouter.get('/inventory/:id', InventoryController.getById);
apiRouter.post('/inventory/:id/restock', InventoryController.restock);

// Ambulances API
apiRouter.get('/ambulances', AmbulanceController.getAll);
apiRouter.get('/ambulances/:id', AmbulanceController.getById);
apiRouter.post('/ambulances/:id/dispatch', AmbulanceController.dispatch);

// Appointments API
apiRouter.get('/appointments', AppointmentController.getAll);
apiRouter.post('/appointments', AppointmentController.create);

// Tasks API
apiRouter.get('/tasks', TaskController.getAll);
apiRouter.post('/tasks', TaskController.create);
apiRouter.patch('/tasks/:id', TaskController.update);

// Approvals API
apiRouter.get('/approvals', ApprovalController.getAll);
apiRouter.post('/approvals', ApprovalController.create);
apiRouter.patch('/approvals/:id/resolve', ApprovalController.resolve);

// Hospital Network & Government Open Data Reference API
apiRouter.get('/network/facilities', NetworkController.getFacilities);
apiRouter.get('/network/ambulance-reference', NetworkController.getAmbulanceReference);

// Operational Analytics & Dashboard
apiRouter.get('/analytics/dashboard', AnalyticsController.getDashboardStats);
apiRouter.get('/analytics/metrics', AnalyticsController.getAnalyticsMetrics);

// Chronological Activity Timeline
apiRouter.get('/activity/timeline', ActivityController.getTimeline);
