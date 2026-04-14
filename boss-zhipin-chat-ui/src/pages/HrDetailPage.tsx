import { Fragment, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '@/app/state';
import { BoardType } from '@/types/domain';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PanelCard } from '@/components/ui/PanelCard';

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTagTone(tag: string): 'negative' | 'positive' | 'neutral' | 'simulation' {
  if (tag === '已读不回') {
    return 'negative';
  }

  if (tag === 'Nice HR') {
    return 'positive';
  }

  if (tag === '数据建设中') {
    return 'simulation';
  }

  return 'neutral';
}

export function HrDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useAppState();

  const boss = state.bosses.find((item) => item.id === id);
  const relatedNominations = useMemo(() => state.nominations.filter((nomination) => nomination.bossId === id), [id, state.nominations]);

  if (!boss) {
    return (
      <PanelCard className="space-y-3">
        <Badge tone="neutral">未找到</Badge>
        <h1 className="text-2xl font-semibold text-slate-900">这个 HR 不在当前榜单里</h1>
        <p className="text-sm leading-6 text-slate-600">请返回榜单，选择一个已经被种子数据覆盖的 Boss。</p>
      </PanelCard>
    );
  }

  return (
    <section className="space-y-6">
      <PanelCard className="space-y-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {boss.boardTags.map((tag) => (
                <Fragment key={tag}>
                  <Badge tone={getTagTone(tag)}>{tag}</Badge>
                </Fragment>
              ))}
              {boss.lowSample ? <Badge tone="simulation">数据建设中</Badge> : null}
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{boss.name}</h1>
              <p className="mt-2 text-sm text-slate-600">
                {boss.companyName} · {boss.roleTitle} · {boss.jobTitle}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[320px]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">提名数</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{boss.nominationCount}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">评分</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{boss.score}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">最近活跃</div>
              <div className="mt-2 text-base font-semibold text-slate-900">{boss.lastActiveLabel}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button tone="primary" onClick={() => navigate(`/play?bossId=${boss.id}&mode=targeted_sim`)}>
            练一局
          </Button>
          <Button tone="default" onClick={() => navigate(`/nominate?bossId=${boss.id}`)}>
            提名 / 更新提名
          </Button>
        </div>

        <p className="max-w-3xl text-sm leading-6 text-slate-600">{boss.jobDescription}</p>
      </PanelCard>

      <PanelCard className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">相关提名摘要</h2>
            <p className="mt-1 text-sm text-slate-600">来自当前种子数据的提名记录。</p>
          </div>
          <Badge tone="neutral">{relatedNominations.length} 条</Badge>
        </div>

        {relatedNominations.length ? (
          <div className="space-y-4">
            {relatedNominations.map((nomination) => (
              <div key={nomination.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {nomination.labels.map((label) => (
                        <Fragment key={label}>
                          <Badge tone={getTagTone(label)}>{label}</Badge>
                        </Fragment>
                      ))}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {nomination.hrName} · {nomination.companyName}
                    </h3>
                    <p className="text-sm text-slate-600">{nomination.jobTitle}</p>
                  </div>

                  <div className="text-sm text-slate-500">
                    <p>创建于 {formatDateTime(nomination.createdAt)}</p>
                    <p className="mt-1">更新于 {formatDateTime(nomination.updatedAt)}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-700">{nomination.greeting}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="暂无更多提名摘要，成为第一个补充信息的人。"
            description="当前对象还没有更多可展示的脱敏摘要，补一条提名后，这里会优先展示你的更新。"
            actionLabel="去提名"
            onAction={() => navigate(`/nominate?bossId=${boss.id}`)}
          />
        )}
      </PanelCard>
    </section>
  );
}
