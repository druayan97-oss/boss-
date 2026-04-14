import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '@/app/state';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PanelCard } from '@/components/ui/PanelCard';
import { getAccuracy } from '@/lib/play';
import { PlayLandingPage } from '@/pages/PlayLandingPage';

const modeLabels = {
  random_sim: '随机 Boss 风格模拟',
  targeted_sim: '指定 Boss 风格模拟',
} as const;

export function PlayResultPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useAppState();

  const session = useMemo(() => {
    if (id) {
      return state.play.sessions.find((item) => item.id === id) ?? null;
    }

    return state.play.activeSessionId
      ? state.play.sessions.find((item) => item.id === state.play.activeSessionId) ?? null
      : null;
  }, [id, state.play.activeSessionId, state.play.sessions]);

  const boss = useMemo(() => {
    if (!session) {
      return null;
    }

    return state.bosses.find((item) => item.id === session.bossId) ?? state.bosses[0] ?? null;
  }, [session, state.bosses]);

  if (!session || !boss) {
    return <PlayLandingPage />;
  }

  if (!session.finished) {
    return <Navigate replace to={`/play/session/${session.id}`} />;
  }

  const summary = getAccuracy(session);

  return (
    <section className="mx-auto max-w-3xl">
      <PanelCard className="space-y-7 border-cyan-100 bg-white/94 text-center">
        <div className="space-y-3">
          <Badge tone="simulation">结果页</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">你的准确率</h1>
          <p className="text-sm leading-6 text-slate-600">
            这局是 <span className="font-medium text-slate-800">{modeLabels[session.mode]}</span>，系统会按 6 轮练习素材统计你的判断表现。
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">准确率</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{summary.percentage}%</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">答对</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{summary.correct}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">总轮数</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{summary.total}</p>
          </div>
        </div>

        <div className="space-y-3 rounded-[24px] border border-cyan-100 bg-cyan-50/70 px-5 py-4 text-left">
          <p className="text-sm font-medium text-cyan-950">本局说明</p>
          <p className="text-sm leading-6 text-cyan-900">
            这位 Boss 的练习素材已经跑完。你可以回看当前模式、换一个 Boss 继续练，也可以直接回到榜单页。
          </p>
          <p className="text-sm leading-6 text-cyan-900">
            当前对象：{boss.name} · {boss.companyName} · {boss.jobTitle}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Button tone="primary" onClick={() => navigate('/play')}>
            再来一局
          </Button>
          <Button tone="default" onClick={() => navigate(`/play?bossId=${boss.id}&mode=targeted_sim`)}>
            换个 Boss
          </Button>
          <Button tone="ghost" onClick={() => navigate('/')}>
            回榜单
          </Button>
        </div>
      </PanelCard>
    </section>
  );
}
