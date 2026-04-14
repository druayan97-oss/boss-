import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AppState } from '@/types/domain';
import { initialState } from '@/data/seed';
import { applyDecision, createSession } from '@/lib/play';
import { STORAGE_KEY } from '@/app/storage';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function persistPlayState(session: ReturnType<typeof createSession>) {
  const state: AppState = {
    ...initialState,
    play: {
      activeSessionId: session.finished ? null : session.id,
      sessions: [session],
    },
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

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

describe('Boss simulation flow', () => {
  it('chooses a random boss for random simulations', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99);

    const session = createSession('random_sim', initialState.bosses);

    expect(session.bossId).toBe('boss-startup-yang');
    expect(session.turns.every((turn) => turn.bossId === 'boss-startup-yang')).toBe(true);

    randomSpy.mockRestore();
  });

  it('starts a random simulation session and reaches the result page', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/play');
    const { default: App } = await import('@/App');
    render(<App />);

    expect(screen.getByText('随机 Boss 风格模拟')).toBeInTheDocument();
    expect(screen.getByText('指定 Boss 风格模拟')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '开始随机练习' }));

    expect(await screen.findByRole('button', { name: '会回复' })).toBeInTheDocument();
    expect(screen.getByText('练习素材')).toBeInTheDocument();
    expect(window.location.pathname).toMatch(/^\/play\/session\/.+/);

    for (let index = 0; index < 6; index += 1) {
      await user.click(screen.getByRole('button', { name: index % 2 === 0 ? '会回复' : '不回复' }));
    }

    expect(await screen.findByText('你的准确率')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '再来一局' })).toBeInTheDocument();
    expect(window.location.pathname).toMatch(/^\/play\/result\/.+/);
  });

  it('redirects finished sessions away from the chat route', async () => {
    const session = createSession('random_sim', initialState.bosses);
    let finishedSession = session;

    for (let index = 0; index < 6; index += 1) {
      finishedSession = applyDecision(finishedSession, 'reply');
    }

    persistPlayState(finishedSession);
    window.history.pushState({}, '', `/play/session/${finishedSession.id}`);
    const { default: App } = await import('@/App');
    render(<App />);

    expect(await screen.findByText('你的准确率')).toBeInTheDocument();
    await waitFor(() => {
      expect(window.location.pathname).toBe(`/play/result/${finishedSession.id}`);
    });
    expect(screen.queryByRole('button', { name: '会回复' })).not.toBeInTheDocument();
  });

  it('redirects unfinished sessions away from the result route', async () => {
    const session = createSession('random_sim', initialState.bosses);

    persistPlayState(session);
    window.history.pushState({}, '', `/play/result/${session.id}`);
    const { default: App } = await import('@/App');
    render(<App />);

    expect(await screen.findByRole('button', { name: '会回复' })).toBeInTheDocument();
    await waitFor(() => {
      expect(window.location.pathname).toBe(`/play/session/${session.id}`);
    });
    expect(screen.queryByText('你的准确率')).not.toBeInTheDocument();
  });

  it('honors a preselected boss in targeted mode', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/play?bossId=boss-meituan-xing&mode=targeted_sim');
    const { default: App } = await import('@/App');
    render(<App />);

    expect(screen.getByText('已带入 Boss')).toBeInTheDocument();
    expect(screen.getByText('邢女士')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '开始指定练习' }));

    expect(await screen.findByRole('button', { name: '会回复' })).toBeInTheDocument();
    expect(screen.getByText('邢女士')).toBeInTheDocument();
    expect(window.location.pathname).toMatch(/^\/play\/session\/.+/);
  });

  it('does not fall back to another session for invalid explicit session or result ids', async () => {
    const session = createSession('random_sim', initialState.bosses);
    window.localStorage.setItem(
      'boss-direct-review-prototype-state',
      JSON.stringify({
        ...initialState,
        play: {
          activeSessionId: session.id,
          sessions: [session],
        },
      }),
    );

    window.history.pushState({}, '', `/play/session/not-a-real-session`);
    const { default: App } = await import('@/App');
    render(<App />);
    expect(await screen.findByRole('heading', { name: '开始一局 6 轮模拟' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '开始随机练习' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '会回复' })).not.toBeInTheDocument();
    cleanup();

    window.history.pushState({}, '', `/play/result/not-a-real-result`);
    render(<App />);
    expect(await screen.findByRole('heading', { name: '开始一局 6 轮模拟' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '开始指定练习' })).toBeInTheDocument();
    expect(screen.queryByText('你的准确率')).not.toBeInTheDocument();
  });
});
