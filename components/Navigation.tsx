'use client';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: 'discover', label: 'Discover', subtitle: 'Projects', icon: '🔍', color: 'from-emerald-500 to-green-500' },
    { id: 'dashboard', label: 'Dashboard', subtitle: 'Impact', icon: '📊', color: 'from-blue-500 to-purple-500' },
    { id: 'trip', label: 'Trip', subtitle: 'Plan', icon: '🗺️', color: 'from-purple-500 to-pink-500' },
    { id: 'profile', label: 'Profile', subtitle: 'Role', icon: '👤', color: 'from-pink-500 to-red-500' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-black/90 backdrop-blur-xl border-t border-gray-800/50 shadow-2xl pb-[env(safe-area-inset-bottom)] animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-4 gap-2 text-xs">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`relative px-3 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 animate-scale-in ${
              activeTab === tab.id 
                ? `bg-gradient-to-br ${tab.color} shadow-2xl scale-105` 
                : 'hover:bg-gray-800/50'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-2xl mb-2 transition-transform duration-200 hover:scale-110">{tab.icon}</div>
            <div className="font-bold text-sm">{tab.label}</div>
            <div className="text-gray-400 text-xs">{tab.subtitle}</div>
            {activeTab === tab.id && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
