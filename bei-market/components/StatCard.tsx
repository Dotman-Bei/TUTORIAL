'use client';

import React from 'react';

interface StatCardProps {
  label: string;
  value: string | React.ReactNode;
  subValue?: string;
  variant?: 'default' | 'positive' | 'negative';
}

export function StatCard({
  label,
  value,
  subValue,
  variant = 'default',
}: StatCardProps) {
  const variantClasses = {
    default: 'border-slate-700 bg-slate-800',
    positive: 'border-emerald-900 bg-emerald-950',
    negative: 'border-rose-900 bg-rose-950',
  };

  return (
    <div className={`rounded-lg border ${variantClasses[variant]} p-4`}>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="mt-2 font-mono">
        <div className="text-xl font-semibold text-slate-100">{value}</div>
        {subValue && <div className="mt-1 text-xs text-slate-400">{subValue}</div>}
      </div>
    </div>
  );
}
