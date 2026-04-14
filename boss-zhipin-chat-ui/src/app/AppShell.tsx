import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppState } from '@/app/state';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ToastViewport } from '@/components/ui/ToastViewport';

const navItems = [
  { label: '榜单', to: '/' },
  { label: '猜 Boss', to: '/play' },
  { label: '本周简报', to: '/weekly' },
  { label: '我的档案', to: '/settings' },
];

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();

  function handleOpenLogin() {
    dispatch({
      type: 'auth/open-login',
      path: `${location.pathname}${location.search}`,
    });
  }

  function handleDemoLogin() {
    const nextPath = state.auth.postLoginPath ?? `${location.pathname}${location.search}`;
    dispatch({ type: 'auth/login-demo' });
    navigate(nextPath);
  }

  return (
    <div className="app-shell min-h-screen text-slate-900">
      <ToastViewport />

      {state.auth.loginOpen ? (
        <Modal title="登录后继续">
          <p className="text-sm leading-6 text-slate-600">
            提名、保存档案等写入动作需要先模拟登录，登录后会返回你刚才正在看的页面。
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button tone="default" onClick={() => dispatch({ type: 'auth/close-login' })}>
              取消
            </Button>
            <Button tone="primary" onClick={handleDemoLogin}>
              模拟登录
            </Button>
          </div>
        </Modal>
      ) : null}

      <div className="app-aurora" aria-hidden="true">
        <span className="app-aurora__orb app-aurora__orb--left" />
        <span className="app-aurora__orb app-aurora__orb--center" />
        <span className="app-aurora__orb app-aurora__orb--right" />
      </div>

      <header className="app-header" role="banner">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 text-white">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
              Boss直评
            </span>
            <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-white/80">
              prototype
            </span>
          </Link>
          <span className="hidden h-6 w-px bg-white/10 sm:block" aria-hidden="true" />
          <nav className="flex items-center gap-1" aria-label="主导航">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="app-nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {state.auth.currentUserId ? (
          <div className="rounded-full border border-cyan-200/25 bg-cyan-300/15 px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_rgba(45,212,191,0.12)]">
            演示用户
          </div>
        ) : (
          <button
            type="button"
            className="rounded-full border border-cyan-200/25 bg-cyan-300/15 px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_rgba(45,212,191,0.12)] transition hover:bg-cyan-300/25"
            onClick={handleOpenLogin}
          >
            登录 / 注册
          </button>
        )}
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <section className="app-panel w-full">
          <div className="app-panel__frame">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
