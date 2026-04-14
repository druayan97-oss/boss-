import { Badge } from '@/components/ui/Badge';
import { PanelCard } from '@/components/ui/PanelCard';
import type { BossProfile } from '@/types/domain';

interface BossMetaCardProps {
  boss: BossProfile;
}

export function BossMetaCard({ boss }: BossMetaCardProps) {
  return (
    <PanelCard className="flex h-fit flex-col gap-5 border-cyan-100 bg-white/94">
      <div className="space-y-3">
        <Badge tone="simulation">练习素材</Badge>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{boss.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {boss.companyName} · {boss.roleTitle}
          </p>
          <p className="mt-1 text-sm text-slate-500">{boss.jobTitle}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">提名数</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{boss.nominationCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">评分</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{boss.score}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">最近活跃</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{boss.lastActiveLabel}</p>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-100 bg-slate-50/90 p-4">
        <p className="text-sm font-medium text-slate-900">练习说明</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{boss.jobDescription}</p>
      </div>
    </PanelCard>
  );
}
