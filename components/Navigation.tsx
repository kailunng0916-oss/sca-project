'use client';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: 'discover', label: 'Discover', subtitle: 'Projects' },
    { id: 'dashboard', label: 'Dashboard', subtitle: 'Impact' },
    { id: 'trip', label: 'Trip', subtitle: 'Plan' },
    { id: 'profile', label: 'Profile', subtitle: 'Role' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-3xl mx-auto px-2 py-2 grid grid-cols-4 gap-1 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-2 py-2 rounded-2xl hover:bg-slate-100 ${
              activeTab === tab.id ? 'bg-emerald-50 border border-emerald-200' : ''
            }`}
          >
            <div className="font-semibold">{tab.label}</div>
            <div className="text-slate-500">{tab.subtitle}</div>
          </button>
        ))}
      </div>
    </nav>
  );
}
