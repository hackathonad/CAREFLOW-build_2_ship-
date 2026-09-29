import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AICommandCenterPage } from './pages/AICommandCenterPage';
import { PatientsPage } from './pages/PatientsPage';
import { PatientDetailsPage } from './pages/PatientDetailsPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { BedsPage } from './pages/BedsPage';
import { InventoryPage } from './pages/InventoryPage';
import { AmbulancesPage } from './pages/AmbulancesPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { TasksPage } from './pages/TasksPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { HospitalNetworkPage } from './pages/HospitalNetworkPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ActivityPage } from './pages/ActivityPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page (Public Hero & Architecture Overview) */}
        <Route path="/" element={<LandingPage />} />

        {/* Hospital Operations Application Shell */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ai-command-center" element={<AICommandCenterPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:id" element={<PatientDetailsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/beds" element={<BedsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/ambulances" element={<AmbulancesPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
          <Route path="/hospital-network" element={<HospitalNetworkPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/activity" element={<ActivityPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
