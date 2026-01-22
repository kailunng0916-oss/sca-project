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
    <div className="bg-black text-white min-h-screen relative overflow-hidden">
      {/* Netflix-style background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      {/* Ambient lighting effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 pt-4 pb-24 relative z-10">
        {activeTab === 'discover' && <Discover />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'trip' && <TripPlanner />}
        {activeTab === 'profile' && <Profile />}
      </main>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
