import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Users,
  Stethoscope,
  BedDouble,
  PackageSearch,
  Truck,
  CalendarDays,
  CheckSquare,
  ShieldCheck,
  Building2,
  BarChart3,
  History,
  Activity,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const primaryNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Command Center', path: '/ai-command-center', icon: Bot, highlight: true },
  ];

  const operationsNav = [
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Doctors & Staff', path: '/doctors', icon: Stethoscope },
    { name: 'Beds & Wards', path: '/beds', icon: BedDouble },
    { name: 'Inventory', path: '/inventory', icon: PackageSearch },
    { name: 'Ambulances', path: '/ambulances', icon: Truck },
    { name: 'Appointments', path: '/appointments', icon: CalendarDays },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Approvals', path: '/approvals', icon: ShieldCheck },
  ];

  const insightsNav = [
    { name: 'Hospital Network', path: '/hospital-network', icon: Building2 },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Activity Log', path: '/activity', icon: History },
  ];

  const renderNavGroup = (items: typeof primaryNav, title?: string) => (
    <div className="mb-6">
      {title && (
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {title}
        </div>
      )}
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? item.highlight
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'bg-slate-800 text-brand-400 font-semibold border-l-2 border-brand-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.highlight && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-700/70 text-brand-100">
                    Live
                  </span>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/90 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 overflow-y-auto">
          {/* Logo Header */}
          <NavLink to="/" className="flex items-center space-x-3 px-2 py-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white flex items-center">
                <span>CareFlow</span>
                <span className="ml-1 text-xs text-brand-400 font-semibold px-1 py-0.2 rounded bg-brand-950 border border-brand-800">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Smart Operations Hub</p>
            </div>
          </NavLink>

          {/* Navigation Groups */}
          {renderNavGroup(primaryNav)}
          {renderNavGroup(operationsNav, 'Hospital Operations')}
          {renderNavGroup(insightsNav, 'Intelligence & Registry')}
        </div>

        {/* Footer info box */}
        <div className="p-4 border-t border-slate-900 bg-slate-950">
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px]">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Smart Automation Engine</span>
              </span>
              <span className="text-[10px] text-slate-500">v1.0</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">
              Operational Data Active
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
