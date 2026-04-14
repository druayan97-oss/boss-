import type { ReactNode } from 'react';

interface PanelCardProps {
  className?: string;
  children?: ReactNode;
}

export function PanelCard({ className = '', children }: PanelCardProps) {
  return (
    <article
      className={[
        'rounded-[28px] border border-white/75 bg-white/88 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </article>
  );
}
