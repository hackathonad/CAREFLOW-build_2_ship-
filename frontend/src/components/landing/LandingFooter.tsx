import React from 'react';
import { Activity, ShieldCheck, Heart, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingFooter: React.FC = () => {
  return (
    <footer
      className="py-12 text-xs"
      style={{
        background: 'rgba(6,11,23,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0059c2, #0070f3)', boxShadow: '0 4px 12px rgba(0,112,243,0.35)' }}
            >
              <Activity className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">CareFlow AI</div>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Hospital Operations Automation · Theme: Smart Automation
              </p>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-slate-500">
            <Link to="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link>
            <Link to="/ai-command-center" className="hover:text-slate-300 transition-colors">AI Command</Link>
            <Link to="/hospital-network" className="hover:text-slate-300 transition-colors">Network</Link>
            <Link to="/analytics" className="hover:text-slate-300 transition-colors">Analytics</Link>
          </div>

          {/* Compliance badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-emerald-500"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)' }}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">Non-Clinical Operational Only</span>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p className="text-slate-700">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline mx-0.5" /> for Hackathon · Smart Automation Theme · Production-style architecture.
          </p>
          <a
            href="https://github.com/hackathonad/CAREFLOW-build_2_ship-"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
