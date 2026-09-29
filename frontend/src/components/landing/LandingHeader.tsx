import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, ShieldCheck } from 'lucide-react';

export const LandingHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">CareFlow</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 ml-1.5 px-1.5 py-0.5 rounded bg-brand-950/80 border border-brand-800/60">
              AI
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="#workflow" className="hover:text-white transition-colors">
            Architecture
          </a>
          <a href="#capabilities" className="hover:text-white transition-colors">
            Capabilities
          </a>
          <a href="#command-center" className="hover:text-white transition-colors">
            AI Command Center
          </a>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Operations Automation Only</span>
          </div>
        </nav>

        <div className="flex items-center space-x-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20 transition-all hover:translate-x-0.5"
          >
            <span>Launch Operations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
