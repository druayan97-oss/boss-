import { Badge } from '@/components/ui/Badge';
import type { PlayTurn } from '@/types/domain';

interface SessionItemProps {
  turn: PlayTurn;
  index: number;
  active: boolean;
}

function getTurnState(turn: PlayTurn) {
  if (turn.actualDecision === 'reply') {
    return { tone: 'positive' as const, label: '已回复' };
  }

  if (turn.actualDecision === 'ignore') {
    return { tone: 'neutral' as const, label: '已忽略' };
  }

  return { tone: 'simulation' as const, label: '待答复' };
}

export function SessionItem({ turn, index, active }: SessionItemProps) {
  const state = getTurnState(turn);

  return (
    <article
      className={[
        'space-y-3 rounded-2xl border px-4 py-3 transition',
        active
          ? 'border-cyan-200 bg-cyan-50/85 shadow-[0_10px_24px_rgba(20,184,166,0.12)]'
          : 'border-slate-200/70 bg-white/80',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">第 {index + 1} 轮</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{turn.candidateSummary}</p>
        </div>

        <Badge tone={state.tone}>{state.label}</Badge>
      </div>

      <p className="text-sm leading-6 text-slate-600">{turn.greeting}</p>
    </article>
  );
}
