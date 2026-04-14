import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { initialState } from '@/data/seed';
import { STORAGE_KEY } from '@/app/storage';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  window.localStorage.clear();
  window.history.pushState({}, '', '/');

  class TestRequest {
    url: string;

    method: string;

    headers: Headers;

    signal: AbortSignal | null;

    constructor(input: string | URL, init: RequestInit = {}) {
      this.url = String(input);
      this.method = init.method ?? 'GET';
      this.headers = new Headers(init.headers);
      this.signal = init.signal ?? null;
    }

    clone() {
      return this;
    }
  }

  globalThis.Request = TestRequest as unknown as typeof Request;
});

afterEach(() => {
  cleanup();
});

describe('boundary states', () => {
  it('shows an empty board state when no bosses match the selected board', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...initialState,
        boards: { selectedBoard: 'nice_hr' },
        bosses: [],
      }),
    );

    const { default: App } = await import('@/App');

    window.history.pushState({}, '', '/board/nice_hr');
    render(<App />);

    expect(screen.getByText('暂无数据，成为第一个提名的人')).toBeInTheDocument();
  });

  it('shows low-sample overlays, empty states, and the leave-session confirmation dialog', async () => {
    const user = userEvent.setup();

    window.history.pushState({}, '', '/');
    const { default: BoardApp } = await import('@/App');
    render(<BoardApp />);

    expect(screen.getByText('数据建设中', { selector: 'div' })).toBeInTheDocument();
    cleanup();

    vi.resetModules();
    window.history.pushState({}, '', '/hr/boss-startup-yang');
    const { default: DetailApp } = await import('@/App');
    render(<DetailApp />);

    expect(screen.getByText('暂无更多提名摘要，成为第一个补充信息的人。')).toBeInTheDocument();
    cleanup();

    vi.resetModules();
    window.history.pushState({}, '', '/play');
    const { default: PlayApp } = await import('@/App');
    render(<PlayApp />);

    await user.click(screen.getByRole('button', { name: '开始随机练习' }));
    await user.click(screen.getByRole('button', { name: '离开本局' }));

    expect(screen.getByRole('dialog', { name: '确认离开本局' })).toBeInTheDocument();
  });

  it('does not reopen the leave dialog after leaving a session route and starting a new session', async () => {
    const user = userEvent.setup();

    window.history.pushState({}, '', '/play');
    const { default: PlayApp } = await import('@/App');
    render(<PlayApp />);

    await user.click(screen.getByRole('button', { name: '开始随机练习' }));
    await user.click(screen.getByRole('button', { name: '离开本局' }));

    expect(screen.getByRole('dialog', { name: '确认离开本局' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: '榜单' }));

    expect(screen.queryByRole('dialog', { name: '确认离开本局' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: '猜 Boss' }));
    await user.click(screen.getByRole('button', { name: '开始随机练习' }));

    expect(screen.queryByRole('dialog', { name: '确认离开本局' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '会回复' })).toBeInTheDocument();
  });
});
