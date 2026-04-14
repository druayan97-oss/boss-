import { Fragment, type ReactNode } from 'react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '@/app/state';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MessageBubble } from '@/components/play/MessageBubble';
import { SessionItem } from '@/components/play/SessionItem';
import { BossMetaCard } from '@/components/play/BossMetaCard';
import { applyDecision } from '@/lib/play';
import type { TurnDecision } from '@/types/domain';
import { PlayLandingPage } from '@/pages/PlayLandingPage';

const modeLabels = {
  random_sim: '随机模拟',
  targeted_sim: '指定模拟',
} as const;

export function PlaySessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, dispatch } = useAppState();

  const session = useMemo(() => {
    if (id) {
      return state.play.sessions.find((item) => item.id === id) ?? null;
    }

    const activeSession = state.play.activeSessionId
      ? state.play.sessions.find((item) => item.id === state.play.activeSessionId) ?? null
      : null;

    return activeSession ?? state.play.sessions[0] ?? null;
  }, [id, state.play.activeSessionId, state.play.sessions]);

  const boss = useMemo(() => {
    if (!session) {
      return null;
    }

    return state.bosses.find((item) => item.id === session.bossId) ?? state.bosses[0] ?? null;
  }, [session, state.bosses]);

  if (!session || !boss || !session.turns.length) {
    return <PlayLandingPage />;
  }

  const activeTurnIndex = Math.min(session.turnIndex, session.turns.length - 1);
  const activeTurn = session.turns[activeTurnIndex];
  const answeredCount = session.turns.filter((turn) => turn.actualDecision).length;

  function submitDecision(decision: TurnDecision) {
    const nextSession = applyDecision(session, decision);
    dispatch({ type: 'play/update', session: nextSession });

    if (nextSession.finished) {
      navigate(`/play/result/${nextSession.id}`);
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
      <PanelColumn title="会话进度" subtitle={`第 ${Math.min(activeTurnIndex + 1, session.turns.length)} / ${session.turns.length} 轮`}>
        <div className="space-y-3">
          {session.turns.map((turn, index) => (
            <Fragment key={turn.id}>
              <SessionItem turn={turn} index={index} active={index === activeTurnIndex} />
            </Fragment>
          ))}
        </div>
      </PanelColumn>

      <div className="flex min-h-[34rem] flex-col overflow-hidden rounded-[32px] border border-white/80 bg-white/94 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Badge tone="simulation">{modeLabels[session.mode]}</Badge>
            <p className="text-sm text-slate-500">
              当前进度 {answeredCount} / {session.turns.length}，完成后会自动跳到结果页。
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
            第 {Math.min(activeTurnIndex + 1, session.turns.length)} 轮 · 练习素材
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 px-6 py-6">
          <div className="flex justify-start">
            <MessageBubble>{activeTurn.greeting}</MessageBubble>
          </div>

          <div className="mt-auto grid gap-3 sm:grid-cols-2">
            <Button tone="primary" className="w-full" onClick={() => submitDecision('reply')}>
              会回复
            </Button>
            <Button tone="default" className="w-full" onClick={() => submitDecision('ignore')}>
              不回复
            </Button>
          </div>
        </div>
      </div>

      <div className="xl:sticky xl:top-6">
        <BossMetaCard boss={boss} />
      </div>
    </section>
  );
}

function PanelColumn({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <aside className="flex h-fit flex-col gap-4 rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_54px_rgba(15,23,42,0.08)]">
      <div className="space-y-2">
        <Badge tone="neutral">会话轨迹</Badge>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      {children}
    </aside>
  );
}
