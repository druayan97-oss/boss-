import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import { WeeklyPage } from '@/pages/WeeklyPage';
import { BoardPage } from '@/pages/BoardPage';
import { HrDetailPage } from '@/pages/HrDetailPage';

function StubPage({ title, description }: { title: string; description: string }) {
  return (
    <article className="mx-auto max-w-3xl rounded-3xl border border-white/50 bg-white/75 p-8 shadow-[0_20px_70px_rgba(15,118,110,0.12)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-600/75">
        Prototype route
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-4 leading-7 text-slate-600">{description}</p>
    </article>
  );
}

const routeStubs = {
  board: <BoardPage />,
  hr: <HrDetailPage />,
  nominate: <StubPage title="推荐 Boss" description="后续会接入推荐提名流程与表单。" />,
  play: <StubPage title="猜 Boss" description="后续会接入 Boss 猜测与互动模拟流程。" />,
  session: <StubPage title="猜 Boss 会话" description="后续会接入单次会话的状态与内容。" />,
  result: <StubPage title="猜 Boss 结果" description="后续会接入会话结果、命中率与复盘。" />,
  settings: <StubPage title="我的档案" description="后续会接入个人设置与资料面板。" />,
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: routeStubs.board },
      { path: 'board/:type', element: routeStubs.board },
      { path: 'hr/:id', element: routeStubs.hr },
      { path: 'nominate', element: routeStubs.nominate },
      { path: 'play', element: routeStubs.play },
      { path: 'play/session/:id', element: routeStubs.session },
      { path: 'play/result/:id', element: routeStubs.result },
      { path: 'settings', element: routeStubs.settings },
      { path: 'weekly', element: <WeeklyPage /> },
    ],
  },
]);
