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
  Zap,
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
    <div className="mb-5">
      {title && (
        <div className="px-3 mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600">
          {title}
        </div>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? item.highlight
                        ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(0,112,243,0.35)]'
                        : 'bg-white/[0.07] text-slate-100 nav-active-glow'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? item.highlight
                              ? 'text-white'
                              : 'text-blue-400'
                            : 'text-slate-600 group-hover:text-slate-400'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.highlight && (
                      <span className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
                      }`}>
                        AI
                      </span>
                    )}
                  </>
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
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #07091a 0%, #060b17 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="px-4 pt-5 pb-4 border-b border-white/[0.05]">
          <NavLink to="/" className="flex items-center gap-3 px-2 py-1" onClick={onClose}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #0059c2 0%, #0070f3 100%)',
                boxShadow: '0 4px 12px rgba(0, 112, 243, 0.4)',
              }}
            >
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>CareFlow</span>
                <span className="text-[10px] font-bold text-blue-300 px-1.5 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/25 tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-600 font-medium mt-0.5 truncate">
                Hospital Operations Platform
              </p>
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          {renderNavGroup(primaryNav)}

          {/* Divider */}
          <div className="mx-2 mb-4 border-t border-white/[0.05]" />

          {renderNavGroup(operationsNav, 'Hospital Operations')}

          {/* Divider */}
          <div className="mx-2 mb-4 border-t border-white/[0.05]" />

          {renderNavGroup(insightsNav, 'Intelligence & Registry')}
        </div>

        {/* Footer status box */}
        <div className="px-3 pb-4 pt-2 border-t border-white/[0.05]">
          <div
            className="rounded-lg p-3"
            style={{
              background: 'rgba(0, 112, 243, 0.05)',
              border: '1px solid rgba(0, 112, 243, 0.12)',
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse-green" />
                <span className="text-[11px] font-semibold text-slate-300">Smart Automation Engine</span>
              </div>
              <span className="text-[10px] font-mono text-slate-600">v1.0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-blue-500 flex-shrink-0" />
              <p className="text-[10px] text-slate-600">Operational Data Active</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
