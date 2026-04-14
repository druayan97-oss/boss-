import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { PanelCard } from '@/components/ui/PanelCard';
import type { BoardType, BossProfile } from '@/types/domain';

interface RankRowProps {
  boss: BossProfile;
  index: number;
  board: BoardType;
}

function getRowTitle(board: BoardType, boss: BossProfile) {
  return board === 'blackhole_company' ? boss.companyName : boss.name;
}

function getRowSubtitle(board: BoardType, boss: BossProfile) {
  if (board === 'blackhole_company') {
    return `${boss.name} · ${boss.roleTitle}`;
  }

  return `${boss.companyName} · ${boss.roleTitle}`;
}

function getBoardTone(board: BoardType) {
  if (board === 'nice_hr') {
    return 'positive' as const;
  }

  if (board === 'blackhole_company') {
    return 'negative' as const;
  }

  return 'neutral' as const;
}

export function RankRow({ boss, index, board }: RankRowProps) {
  const boardTone = getBoardTone(board);

  return (
    <PanelCard className="relative overflow-hidden p-4 sm:p-5">
      {boss.lowSample ? (
        <div className="absolute right-4 top-4 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">
          数据建设中
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)]">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{getRowTitle(board, boss)}</h3>
            <Badge tone={boardTone}>{board === 'blackhole_company' ? '公司榜' : 'HR榜'}</Badge>
            {board === 'nice_hr' ? <Badge tone="positive">Nice HR</Badge> : null}
          </div>

          <p className="mt-1 text-sm text-slate-600">{getRowSubtitle(board, boss)}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{boss.jobDescription}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {boss.boardTags.map((tag) => (
              <span key={tag}>
                <Badge
                  tone={tag === '已读不回' ? 'negative' : tag === 'Nice HR' ? 'positive' : tag === '数据建设中' ? 'simulation' : 'neutral'}
                >
                  {tag}
                </Badge>
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <div className="text-left sm:text-right">
            <div className="text-sm font-semibold text-slate-900">提名 {boss.nominationCount}</div>
            <div className="mt-1 text-xs text-slate-500">最近活跃 {boss.lastActiveLabel}</div>
            <div className="mt-1 text-xs text-slate-500">评分 {boss.score}</div>
          </div>

          <Link
            to={`/hr/${boss.id}`}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            查看详情
          </Link>
        </div>
      </div>
    </PanelCard>
  );
}
