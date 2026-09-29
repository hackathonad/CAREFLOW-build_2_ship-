import React from 'react';
import { Menu, Bot, Bell, Shield, Hospital } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopbarProps {
  onMenuToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuToggle }) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Mobile Hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Hospital Facility Indicator */}
        <div className="flex items-center space-x-2 text-slate-300">
          <Hospital className="w-4 h-4 text-brand-400" />
          <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-100">
            Apex Metro Memorial Hospital
          </span>
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
            Operational Data
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Quick Link to AI Command Center */}
        <Link
          to="/ai-command-center"
          className="hidden sm:inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-brand-600/10 hover:bg-brand-600/20 border border-brand-500/30 text-brand-400 text-xs font-medium transition-colors"
        >
          <Bot className="w-4 h-4" />
          <span>AI Command Center</span>
        </Link>

        {/* Notifications Shortcut */}
        <Link
          to="/activity"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors relative"
          title="Operational Activity & Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
        </Link>

        {/* Temporary Dev Mode Indicator */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-slate-500" />
          <span>Dev Access Enabled</span>
        </div>
      </div>
    </header>
  );
};
