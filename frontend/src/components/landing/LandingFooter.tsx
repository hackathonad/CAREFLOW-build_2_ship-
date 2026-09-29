import React from 'react';
import { Activity, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">CareFlow AI</span>
              <p className="text-slate-500 text-[11px]">
                Hospital Operations Automation Platform • Theme: Smart Automation
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <Link to="/dashboard" className="hover:text-slate-200 transition-colors">
              Operational Dashboard
            </Link>
            <Link to="/ai-command-center" className="hover:text-slate-200 transition-colors">
              AI Command Center
            </Link>
            <Link to="/hospital-network" className="hover:text-slate-200 transition-colors">
              Hospital Network
            </Link>
          </div>

          <div className="flex items-center space-x-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strictly Non-Clinical Operational Management</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 text-center text-slate-600 text-[11px] flex items-center justify-center space-x-1">
          <span>Engineered with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>for Hackathon Theme Smart Automation. Production-style architecture.</span>
        </div>
      </div>
    </footer>
  );
};
