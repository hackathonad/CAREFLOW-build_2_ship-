import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { patientService } from '../../services/patientService';
import { doctorService } from '../../services/doctorService';
import { bedService } from '../../services/bedService';
import { inventoryService } from '../../services/inventoryService';
import { ambulanceService } from '../../services/ambulanceService';
import { appointmentService } from '../../services/appointmentService';
import { taskService } from '../../services/taskService';
import { approvalService } from '../../services/approvalService';
import { analyticsService } from '../../services/analyticsService';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Smooth background sync after initial page has rendered
  useEffect(() => {
    // Gentle pre-sync after 4 seconds of idle time so user's active page has full bandwidth
    const timer = setTimeout(() => {
      analyticsService.getDashboard().catch(() => {});
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen text-slate-100 flex" style={{ background: '#060b17' }}>
      {/* Fixed Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Topbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
