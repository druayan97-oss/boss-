import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppState } from '@/app/state';
import { Badge } from '@/components/ui/Badge';
import { PanelCard } from '@/components/ui/PanelCard';
import { PlayModeCard } from '@/components/play/PlayModeCard';
import { createSession } from '@/lib/play';

type Mode = 'random_sim' | 'targeted_sim';

const modeLabels: Record<Mode, string> = {
  random_sim: '随机 Boss 风格模拟',
  targeted_sim: '指定 Boss 风格模拟',
};

function isMode(value: string | null): value is Mode {
  return value === 'random_sim' || value === 'targeted_sim';
}

export function PlayLandingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { state, dispatch } = useAppState();

  const bossId = params.get('bossId') ?? undefined;
  const modeParam = params.get('mode');
  const preselectedMode = isMode(modeParam) ? modeParam : undefined;

  const targetBoss = useMemo(() => {
    if (!bossId) {
      return null;
    }

    return state.bosses.find((boss) => boss.id === bossId) ?? null;
  }, [bossId, state.bosses]);

  function start(mode: Mode) {
    const session = createSession(mode, state.bosses, bossId);
    dispatch({ type: 'play/start', session });
    navigate(`/play/session/${session.id}`);
  }

  return (
    <section className="space-y-6">
      <PanelCard className="space-y-4 border-cyan-100 bg-white/92">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Badge tone="simulation">Boss 猜测训练</Badge>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">开始一局 6 轮模拟</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                这里提供两种练习入口：随机热身和指定 Boss 练习。你可以先快速跑一局，再回到结果页看准确率。
              </p>
            </div>
          </div>

          {targetBoss ? (
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/90 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">已带入 Boss</p>
              <p className="mt-2 text-sm font-medium text-cyan-950">{targetBoss.name}</p>
              <p className="mt-1 text-sm text-cyan-800">
                {targetBoss.companyName} · {targetBoss.jobTitle}
              </p>
            </div>
          ) : null}
        </div>

        {preselectedMode ? (
          <p className="text-sm text-slate-500">
            当前入口来自 <span className="font-medium text-slate-700">{modeLabels[preselectedMode]}</span> 的预设链接。
          </p>
        ) : null}
      </PanelCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <PlayModeCard
          badge="快速热身"
          title={modeLabels.random_sim}
          description="直接进入一局随机练习，适合快速把手感找回来。每局都固定为 6 轮，方便你连续对比表现。"
          actionLabel="开始随机练习"
          onClick={() => start('random_sim')}
          footer={
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900">适合场景</p>
              <p className="text-sm leading-6 text-slate-600">没有明确目标 Boss，先熟悉系统的答复与忽略节奏。</p>
            </div>
          }
        />

        <PlayModeCard
          badge="定向训练"
          title={modeLabels.targeted_sim}
          description={
            targetBoss
              ? `已预选 ${targetBoss.name}，会围绕这位 Boss 的练习素材开局。`
              : '围绕一位具体 Boss 展开练习；如果是从 HR 详情页进入，会自动带入当前对象。'
          }
          actionLabel="开始指定练习"
          onClick={() => start('targeted_sim')}
          footer={
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900">适合场景</p>
              <p className="text-sm leading-6 text-slate-600">你已经有明确对象，想直接检验对这位 Boss 的判断节奏。</p>
            </div>
          }
        />
      </div>
    </section>
  );
}
