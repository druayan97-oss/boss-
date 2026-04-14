import type { ReactNode } from 'react';

type BadgeTone = 'negative' | 'positive' | 'neutral' | 'simulation';

interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children?: ReactNode;
}

const toneClasses: Record<BadgeTone, string> = {
  negative: 'border-rose-200 bg-rose-50 text-rose-700',
  positive: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  neutral: 'border-slate-200 bg-slate-50 text-slate-600',
  simulation: 'border-cyan-200 bg-cyan-50 text-cyan-700',
};

export function Badge({ tone = 'neutral', className = '', children }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none',
        toneClasses[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
