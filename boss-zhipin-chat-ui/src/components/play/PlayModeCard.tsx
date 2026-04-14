import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PanelCard } from '@/components/ui/PanelCard';

interface PlayModeCardProps {
  badge: string;
  badgeTone?: 'negative' | 'positive' | 'neutral' | 'simulation';
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
  footer?: ReactNode;
}

export function PlayModeCard({
  badge,
  badgeTone = 'simulation',
  title,
  description,
  actionLabel,
  onClick,
  footer,
}: PlayModeCardProps) {
  return (
    <PanelCard className="flex h-full flex-col justify-between gap-6 border-white/80 bg-white/92">
      <div className="space-y-4">
        <Badge tone={badgeTone}>{badge}</Badge>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>

        {footer ? <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">{footer}</div> : null}
      </div>

      <Button tone="primary" className="w-full" onClick={onClick}>
        {actionLabel}
      </Button>
    </PanelCard>
  );
}
