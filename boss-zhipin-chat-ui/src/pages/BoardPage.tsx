import { Fragment, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '@/app/state';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PanelCard } from '@/components/ui/PanelCard';
import { RankRow } from '@/components/board/RankRow';
import type { BoardType, BossProfile } from '@/types/domain';

const boardMeta: Record<BoardType, { title: string; tabLabel: string; boardTone: 'negative' | 'positive' | 'neutral' }> = {
  ghosted_hr: {
    title: '已读不回 HR 榜',
    tabLabel: '已读不回 HR',
    boardTone: 'negative',
  },
  blackhole_company: {
    title: '简历黑洞公司榜',
    tabLabel: '简历黑洞公司',
    boardTone: 'negative',
  },
  nice_hr: {
    title: 'Nice HR 榜',
    tabLabel: 'Nice HR',
    boardTone: 'positive',
  },
};

function isBoardType(value: string | undefined): value is BoardType {
  return value === 'ghosted_hr' || value === 'blackhole_company' || value === 'nice_hr';
}

function sortBosses(left: Pick<BossProfile, 'nominationCount' | 'score' | 'name'>, right: Pick<BossProfile, 'nominationCount' | 'score' | 'name'>) {
  if (right.nominationCount !== left.nominationCount) {
    return right.nominationCount - left.nominationCount;
  }

  if (right.score !== left.score) {
    return right.score - left.score;
  }

  return left.name.localeCompare(right.name, 'zh-Hans-CN');
}

export function BoardPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { state, dispatch } = useAppState();

  const routeBoard = isBoardType(params.type) ? params.type : undefined;
  const selectedBoard = routeBoard ?? 'ghosted_hr';
  const selectedMeta = boardMeta[selectedBoard];

  useEffect(() => {
    if (state.boards.selectedBoard !== selectedBoard) {
      dispatch({ type: 'boards/select', board: selectedBoard });
    }
  }, [dispatch, selectedBoard, state.boards.selectedBoard]);

  const visibleBosses = useMemo(() => {
    const bosses = selectedBoard === 'nice_hr' ? state.bosses.filter((boss) => boss.boardTags.includes('Nice HR')) : state.bosses;
    return [...bosses].sort(sortBosses);
  }, [selectedBoard, state.bosses]);

  function handleSelectBoard(board: BoardType) {
    dispatch({ type: 'boards/select', board });
    navigate(board === 'ghosted_hr' ? '/' : `/board/${board}`);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <PanelCard className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge tone={selectedMeta.boardTone}>{selectedMeta.tabLabel}</Badge>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{selectedMeta.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                综合提名数量与近期更新排序
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(boardMeta) as BoardType[]).map((board) => (
                <Fragment key={board}>
                  <Button tone={selectedBoard === board ? 'primary' : 'ghost'} onClick={() => handleSelectBoard(board)}>
                    {boardMeta[board].tabLabel}
                  </Button>
                </Fragment>
              ))}
            </div>
          </div>
        </PanelCard>

        {visibleBosses.length ? (
          <div className="space-y-4">
            {visibleBosses.map((boss, index) => (
              <Fragment key={boss.id}>
                <RankRow boss={boss} index={index} board={selectedBoard} />
              </Fragment>
            ))}
          </div>
        ) : (
          <EmptyState
            title="暂无数据，成为第一个提名的人"
            description="当前榜单还没有足够数据形成展示结果。补一条提名后，这里会优先出现最新变化。"
            actionLabel="去提名"
            onAction={() => navigate('/nominate')}
          />
        )}
      </div>

      <PanelCard className="flex h-fit flex-col gap-4 border-cyan-100 bg-white/92">
        <div className="space-y-3">
          <Badge tone="simulation">数据面板</Badge>
          <h2 className="text-xl font-semibold text-slate-900">去提名</h2>
          <p className="text-sm leading-6 text-slate-600">
            当前页面聚焦榜单浏览，不是聊天页。你可以直接去提名一个 Boss，或继续在榜单里切换查看。
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-4">
          <p className="text-sm font-medium text-cyan-900">当前选择</p>
          <p className="mt-1 text-sm text-cyan-800">{selectedMeta.title}</p>
          <p className="mt-2 text-xs leading-5 text-cyan-700">榜单会根据当前选项切换呈现方式，适配 HR 榜和公司榜两种浏览方式。</p>
        </div>

        <Button
          tone="primary"
          onClick={() => navigate('/nominate')}
        >
          去提名
        </Button>
      </PanelCard>
    </section>
  );
}
