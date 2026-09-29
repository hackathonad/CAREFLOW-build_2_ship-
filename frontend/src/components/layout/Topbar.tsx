import React from 'react';
import { Menu, Bot, Bell, Hospital, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopbarProps {
  onMenuToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuToggle }) => {
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });

  return (
    <header
      className="sticky top-0 z-30 h-[60px] px-4 sm:px-6 flex items-center justify-between topbar-gradient"
    >
      {/* Left: menu + hospital name */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Hospital identity */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex w-7 h-7 rounded-lg items-center justify-center bg-blue-500/10 border border-blue-500/20">
            <Hospital className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-200 leading-tight">
              Apex Metro Memorial Hospital
            </div>
            <div className="hidden md:flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Systems Operational
              </span>
              <span className="text-slate-700">·</span>
              <span className="text-[10px] font-mono text-slate-600">{currentTime} IST</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* AI Command Center shortcut */}
        <Link
          to="/ai-command-center"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200"
          style={{
            background: 'rgba(6, 182, 212, 0.08)',
            borderColor: 'rgba(6, 182, 212, 0.20)',
            color: '#67e8f9',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(6, 182, 212, 0.14)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(6, 182, 212, 0.30)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(6, 182, 212, 0.08)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(6, 182, 212, 0.20)';
          }}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Command</span>
        </Link>

        {/* Notification bell */}
        <Link
          to="/activity"
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors"
          title="Activity & Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </Link>

        {/* System status indicator */}
        <div
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px]"
          style={{
            background: 'rgba(255,255,255,0.02)',
            borderColor: 'rgba(255,255,255,0.07)',
          }}
        >
          <Cpu className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-500 font-medium">Dev Access</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>
    </header>
  );
};
