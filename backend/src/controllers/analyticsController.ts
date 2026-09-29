import { Request, Response, NextFunction } from 'express';
import { PatientService } from '../services/patients/patientService.js';
import { BedService } from '../services/beds/bedService.js';
import { DoctorService } from '../services/doctors/doctorService.js';
import { TaskService } from '../services/tasks/taskService.js';
import { AmbulanceService } from '../services/ambulances/ambulanceService.js';
import { InventoryService } from '../services/inventory/inventoryService.js';
import { ApprovalService } from '../services/approvals/approvalService.js';
import { AppointmentService } from '../services/appointments/appointmentService.js';

export class AnalyticsController {
  private static cachedDashboard: any = null;
  private static cachedDashboardTime = 0;

  public static invalidateDashboardCache() {
    AnalyticsController.cachedDashboard = null;
    AnalyticsController.cachedDashboardTime = 0;
  }

  public static async getDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
      if (AnalyticsController.cachedDashboard && Date.now() - AnalyticsController.cachedDashboardTime < 120000) {
        return res.json(AnalyticsController.cachedDashboard);
      }

      const [patients, beds, doctors, tasks, ambulances, inventory, approvals, appointments] =
        await Promise.all([
          PatientService.getAll(),
          BedService.getBeds(),
          DoctorService.getAll(),
          TaskService.getAll(),
          AmbulanceService.getAll(),
          InventoryService.getAll(),
          ApprovalService.getAll(),
          AppointmentService.getAll(),
        ]);

      const occupiedBeds = beds.filter((b) => b.status === 'occupied').length;
      const availableBeds = beds.filter((b) => b.status === 'available').length;
      const activePatients = patients.filter((p) => p.status !== 'discharged').length;
      const doctorsOnDuty = doctors.filter((d) => d.availability !== 'off_duty').length;
      const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
      const activeAmbulances = ambulances.filter(
        (a) => a.vehicle_status === 'dispatched' || a.vehicle_status === 'en_route'
      ).length;
      const lowStockItems = inventory.filter(
        (i) => i.status === 'low_stock' || i.status === 'critical' || i.status === 'out_of_stock'
      ).length;
      const pendingApprovals = approvals.filter((a) => a.status === 'pending').length;
      const totalCapacity = beds.length || 1;
      const occupancyRate = Math.round((occupiedBeds / totalCapacity) * 100);

      // Bed category breakdown
      const bedDistribution: Record<string, { total: number; occupied: number }> = {};
      beds.forEach((b) => {
        const cat = b.ward_category || 'general';
        if (!bedDistribution[cat]) bedDistribution[cat] = { total: 0, occupied: 0 };
        bedDistribution[cat].total += 1;
        if (b.status === 'occupied') bedDistribution[cat].occupied += 1;
      });

      // Priority alerts
      const alerts = [
        ...inventory
          .filter((i) => i.status === 'critical' || i.status === 'out_of_stock')
          .map((i) => ({
            id: `alert-inv-${i.id}`,
            type: 'urgent',
            title: `Critical Inventory Stock: ${i.name}`,
            message: `Only ${i.quantity} ${i.unit} remaining. Threshold is ${i.minimum_threshold}.`,
            time: 'Active now',
          })),
        ...patients
          .filter((p) => p.status === 'critical')
          .map((p) => ({
            id: `alert-pat-${p.id}`,
            type: 'critical',
            title: `Critical Patient in ${p.department}`,
            message: `${p.name} (${p.patient_code}) assigned to Bed ${p.bed_number || 'ICU'} requires intensive telemetry.`,
            time: 'Continuous monitoring',
          })),
        ...approvals
          .filter((a) => a.status === 'pending' && a.risk_level === 'critical')
          .map((a) => ({
            id: `alert-appr-${a.id}`,
            type: 'urgent',
            title: 'Critical Approval Pending',
            message: a.action,
            time: 'Action required',
          })),
      ];

      const responseData = {
        stats: {
          totalPatients: activePatients,
          occupiedBeds,
          availableBeds,
          doctorsOnDuty,
          pendingTasks,
          activeAmbulances,
          lowStockItems,
          pendingApprovals,
          occupancyRate,
          totalAppointments: appointments.length,
        },
        bedDistribution,
        alerts: alerts.slice(0, 5),
      };

      AnalyticsController.cachedDashboard = responseData;
      AnalyticsController.cachedDashboardTime = Date.now();

      res.json(responseData);
    } catch (error) {
      next(error);
    }
  }

  public static async getAnalyticsMetrics(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        patientTrends: [
          { day: 'Mon', admissions: 14, discharges: 11, emergency: 6 },
          { day: 'Tue', admissions: 18, discharges: 15, emergency: 9 },
          { day: 'Wed', admissions: 22, discharges: 18, emergency: 12 },
          { day: 'Thu', admissions: 19, discharges: 14, emergency: 7 },
          { day: 'Fri', admissions: 25, discharges: 20, emergency: 14 },
          { day: 'Sat', admissions: 16, discharges: 19, emergency: 8 },
          { day: 'Sun', admissions: 12, discharges: 10, emergency: 5 },
        ],
        taskEfficiency: {
          completedToday: 24,
          avgCompletionMinutes: 38,
          slaCompliancePercent: 96,
        },
        automationPerformance: {
          totalRunsThisWeek: 182,
          successRatePercent: 98.4,
          avgDecisionLatencyMs: 420,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
