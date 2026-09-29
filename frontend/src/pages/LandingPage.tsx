import React from 'react';
import { LandingHeader } from '../components/landing/LandingHeader';
import { LandingHero } from '../components/landing/LandingHero';
import { LandingWorkflow } from '../components/landing/LandingWorkflow';
import { LandingFeatures } from '../components/landing/LandingFeatures';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingWorkflow />
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  );
};
