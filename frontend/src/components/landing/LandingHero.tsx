import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Cpu, Sparkles, Building2, BedDouble, Stethoscope } from 'lucide-react';

export const LandingHero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Theme: Smart Automation</span>
          <span className="text-slate-500">•</span>
          <span className="text-brand-300 font-semibold">Hospital Operations Platform</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight max-w-4xl mx-auto leading-tight">
          Intelligent automation for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-300">
            hospital operations.
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Coordinate patients, beds, doctors, inventory, ambulances and staff workflows through one
          intelligent operational platform. Deterministic hospital decisions powered by structured AI.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/ai-command-center"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-xl shadow-brand-600/25 transition-all hover:scale-[1.02]"
          >
            <Bot className="w-4 h-4" />
            <span>Open AI Command Center</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-200 font-semibold text-sm transition-all"
          >
            <Cpu className="w-4 h-4 text-slate-400" />
            <span>Operational Dashboard</span>
          </Link>
        </div>

        {/* Quick Highlights Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <BedDouble className="w-5 h-5 text-brand-400 mb-2" />
            <div className="text-sm font-semibold text-slate-200">Bed Allocation</div>
            <div className="text-xs text-slate-400 mt-1">Multi-tier ward & occupancy triage</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <Stethoscope className="w-5 h-5 text-sky-400 mb-2" />
            <div className="text-sm font-semibold text-slate-200">Physician Match</div>
            <div className="text-xs text-slate-400 mt-1">Workload & shift-aware assignment</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <Building2 className="w-5 h-5 text-indigo-400 mb-2" />
            <div className="text-sm font-semibold text-slate-200">Hospital Network</div>
            <div className="text-xs text-slate-400 mt-1">Government Open Data directory</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <Bot className="w-5 h-5 text-emerald-400 mb-2" />
            <div className="text-sm font-semibold text-slate-200">Backend Automation</div>
            <div className="text-xs text-slate-400 mt-1">Deterministic state machine execution</div>
          </div>
        </div>
      </div>
    </section>
  );
};
