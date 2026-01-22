'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 p-3"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-w-xl mx-auto mt-6 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="p-3 border-b border-slate-200 flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold">{title}</div>
            {subtitle && <div className="text-xs text-slate-600 mt-1">{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs"
          >
            Close
          </button>
        </div>
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
}
