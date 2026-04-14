import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initialState } from '@/data/seed';
import { STORAGE_KEY } from '@/app/storage';

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

describe('board and hr detail flow', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the ghosted home board even when persisted board state is nice_hr', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...initialState,
        boards: { selectedBoard: 'nice_hr' },
      }),
    );

    const { default: App } = await import('@/App');

    render(<App />);

    expect(await screen.findByRole('heading', { name: '已读不回 HR 榜' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
  });

  it('renders the board, switches tabs, and opens an HR detail page', async () => {
    const user = userEvent.setup();
    const { default: App } = await import('@/App');

    render(<App />);

    expect(screen.getByRole('heading', { name: '已读不回 HR 榜' })).toBeInTheDocument();
    expect(screen.getByText('综合提名数量与近期更新排序')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Nice HR' }));

    expect(screen.getByRole('heading', { name: 'Nice HR 榜' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/board/nice_hr');

    await user.click(screen.getAllByRole('link', { name: '查看详情' })[0]);

    expect(await screen.findByRole('heading', { name: '邢女士' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/hr/boss-meituan-xing');
    expect(window.location.search).toBe('');

    await user.click(screen.getByRole('button', { name: '练一局' }));

    expect(window.location.pathname).toBe('/play');
    expect(window.location.search).toBe('?bossId=boss-meituan-xing&mode=targeted_sim');

    window.history.back();
    expect(await screen.findByRole('heading', { name: '邢女士' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '提名 / 更新提名' }));

    expect(window.location.pathname).toBe('/nominate');
    expect(window.location.search).toBe('?bossId=boss-meituan-xing');
  });
});
