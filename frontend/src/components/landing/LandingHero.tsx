import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Bot, Cpu, Sparkles, Building2, BedDouble, Stethoscope,
  Shield, Zap, Activity,
} from 'lucide-react';

export const LandingHero: React.FC = () => {
  return (
    <section className="relative pt-28 pb-24 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 hero-grid opacity-100 pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Hackathon badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-medium"
          style={{
            background: 'rgba(0,112,243,0.08)',
            border: '1px solid rgba(0,112,243,0.20)',
            color: '#93c5fd',
          }}>
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Theme: Smart Automation</span>
          <span className="w-px h-3 bg-blue-500/30" />
          <span className="text-blue-300 font-semibold">Hospital Operations Platform</span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-100 tracking-tight max-w-5xl mx-auto leading-[1.05] mb-6">
          AI-powered automation for{' '}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #3392ff 0%, #06b6d4 50%, #67e8f9 100%)' }}
          >
            hospital operations.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Coordinate patients, beds, doctors, inventory, and ambulance dispatch through one
          intelligent command platform. Deterministic backend workflows. Government-grade reliability.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            to="/ai-command-center"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #0059c2 0%, #0070f3 100%)',
              boxShadow: '0 8px 32px rgba(0, 112, 243, 0.35)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,112,243,0.50)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,112,243,0.35)';
            }}
          >
            <Bot className="w-4 h-4" />
            <span>Open AI Command Center</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: '#e2e8f0',
            }}
          >
            <Cpu className="w-4 h-4 text-slate-400" />
            <span>Operational Dashboard</span>
          </Link>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          {[
            {
              icon: BedDouble,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/15',
              title: 'Bed Allocation',
              desc: 'Multi-tier ward & occupancy triage',
            },
            {
              icon: Stethoscope,
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/10 border-cyan-500/15',
              title: 'Physician Match',
              desc: 'Workload & shift-aware assignment',
            },
            {
              icon: Building2,
              color: 'text-purple-400',
              bg: 'bg-purple-500/10 border-purple-500/15',
              title: 'Hospital Network',
              desc: 'Government Open Data directory',
            },
            {
              icon: Bot,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/15',
              title: 'AI Automation',
              desc: 'Deterministic state machine execution',
            },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <div
              key={title}
              className={`p-4 rounded-xl border transition-all hover:-translate-y-0.5 ${bg}`}
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <Icon className={`w-5 h-5 ${color} mb-2.5`} />
              <div className="text-sm font-semibold text-slate-200 mb-1">{title}</div>
              <div className="text-[11px] text-slate-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-16">
          {[
            { icon: Shield, text: 'Operations-Only, No Clinical Diagnosis' },
            { icon: Zap, text: 'Gemini AI + Deterministic Fallback' },
            { icon: Activity, text: 'Real-time Operational Data' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs text-slate-600">
              <Icon className="w-3.5 h-3.5 text-slate-700" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
