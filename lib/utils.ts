export const clampNum = (n: number | string | undefined): number => {
  const x = Number(n);
  return Number.isFinite(x) ? Math.max(0, x) : 0;
};

export const uuid = (): string => {
  return 'id_' + Math.random().toString(16).slice(2) + '_' + Date.now().toString(16);
};

export const humanTime = (iso: string): string => {
  return new Date(iso).toLocaleString();
};

export const badge = (tag: string): string => {
  const map: Record<string, string> = {
    biodiversity: 'bg-emerald-100 text-emerald-800',
    waste: 'bg-amber-100 text-amber-800',
    water: 'bg-sky-100 text-sky-800',
    culture: 'bg-fuchsia-100 text-fuchsia-800',
    community: 'bg-violet-100 text-violet-800',
    carbon: 'bg-slate-200 text-slate-800',
  };
  return map[tag] || 'bg-slate-100 text-slate-700';
};

export const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
