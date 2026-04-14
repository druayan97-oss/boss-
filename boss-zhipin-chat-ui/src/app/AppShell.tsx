import { Link, Outlet } from 'react-router-dom';

const navItems = [
  { label: '榜单', to: '/' },
  { label: '猜 Boss', to: '/play' },
  { label: '本周简报', to: '/weekly' },
  { label: '我的档案', to: '/settings' },
];

export function AppShell() {
  return (
    <div className="app-shell min-h-screen text-slate-900">
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

        <button
          type="button"
          className="rounded-full border border-cyan-200/25 bg-cyan-300/15 px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_rgba(45,212,191,0.12)] transition hover:bg-cyan-300/25"
        >
          登录 / 注册
        </button>
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
