'use client';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: 'discover', label: 'Discover', subtitle: 'Projects', icon: '🔍' },
    { id: 'dashboard', label: 'Dashboard', subtitle: 'Impact', icon: '📊' },
    { id: 'trip', label: 'Trip', subtitle: 'Plan', icon: '🗺️' },
    { id: 'profile', label: 'Profile', subtitle: 'Role', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-emerald-200/50 shadow-2xl pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-3xl mx-auto px-2 py-2 grid grid-cols-4 gap-1 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-2 py-3 rounded-2xl transition-all duration-200 hover:scale-105 ${
              activeTab === tab.id 
                ? 'bg-gradient-to-br from-emerald-100 to-green-100 border-2 border-emerald-300 shadow-lg' 
                : 'hover:bg-slate-50'
            }`}
          >
            <div className="text-lg mb-1">{tab.icon}</div>
            <div className="font-semibold">{tab.label}</div>
            <div className="text-slate-500">{tab.subtitle}</div>
          </button>
        ))}
      </div>
    </nav>
  );
}
