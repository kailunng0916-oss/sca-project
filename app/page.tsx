'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Discover from '@/components/Discover';
import Dashboard from '@/components/Dashboard';
import TripPlanner from '@/components/TripPlanner';
import Profile from '@/components/Profile';

export default function Home() {
  const [activeTab, setActiveTab] = useState('discover');

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 text-slate-900 min-h-screen relative overflow-hidden">
      {/* Fun background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-300 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-purple-300 rounded-full blur-xl"></div>
      </div>
      <Header />
      <main className="max-w-3xl mx-auto px-4 pt-4 pb-24 relative z-10">
        {activeTab === 'discover' && <Discover />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'trip' && <TripPlanner />}
        {activeTab === 'profile' && <Profile />}
      </main>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
