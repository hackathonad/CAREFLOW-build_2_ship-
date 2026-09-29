import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, ShieldCheck } from 'lucide-react';

export const LandingHeader: React.FC = () => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(6,11,23,0.90)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #0059c2 0%, #0070f3 100%)',
              boxShadow: '0 4px 12px rgba(0,112,243,0.40)',
            }}
          >
            <Activity className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white">CareFlow</span>
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
              style={{
                background: 'rgba(0,112,243,0.15)',
                border: '1px solid rgba(0,112,243,0.30)',
                color: '#93c5fd',
              }}
            >
              AI
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#workflow" className="hover:text-slate-200 transition-colors">Architecture</a>
          <a href="#capabilities" className="hover:text-slate-200 transition-colors">Capabilities</a>
          <a href="#command-center" className="hover:text-slate-200 transition-colors">AI Command</a>
          <div
            className="flex items-center gap-1.5 text-xs text-emerald-400 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)' }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Operations Automation Only</span>
          </div>
        </nav>

        {/* CTA */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg, #0059c2 0%, #0070f3 100%)',
            boxShadow: '0 4px 12px rgba(0,112,243,0.30)',
          }}
        >
          <span>Launch Operations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
};
