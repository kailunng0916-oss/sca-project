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
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 pt-4 pb-24">
        {activeTab === 'discover' && <Discover />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'trip' && <TripPlanner />}
        {activeTab === 'profile' && <Profile />}
      </main>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
