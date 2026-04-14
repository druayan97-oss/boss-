import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppStateProvider, useAppState } from '@/app/state';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reducer } from '@/app/reducer';
import { initialState } from '@/data/seed';
import { ToastViewport } from '@/components/ui/ToastViewport';
import { NominationPage } from '@/pages/NominationPage';

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

describe('nomination and settings flow', () => {
  it('shows not found when nominate has an invalid bossId', async () => {
    window.history.pushState({}, '', '/nominate?bossId=does-not-exist');
    const { default: App } = await import('@/App');
    render(<App />);

    expect(await screen.findByRole('heading', { name: '没有找到可提名的 Boss' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '推荐 Boss' })).not.toBeInTheDocument();
  });

  it('resyncs the nomination form when the query string changes', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/nominate',
          element: <NominationPage />,
        },
      ],
      {
        initialEntries: ['/nominate?bossId=boss-baidu-xu'],
      },
    );

    const user = userEvent.setup();
    render(
      <AppStateProvider>
        <RouterProvider router={router} />
      </AppStateProvider>,
    );

    expect(await screen.findByRole('heading', { name: '推荐 Boss' })).toBeInTheDocument();
    expect(screen.getByLabelText('招聘岗位')).toHaveValue('作者生态产品实习生');

    await user.clear(screen.getByLabelText('招聘岗位'));
    await user.type(screen.getByLabelText('招聘岗位'), '临时输入');

    await router.navigate('/nominate?bossId=boss-meituan-xing');

    await waitFor(() => {
      expect(screen.getByLabelText('招聘岗位')).toHaveValue('AI 产品经理');
      expect(screen.getByLabelText('职位描述（JD）')).toHaveValue('面向本地生活场景建设 AI 产品流程，协调策略、模型、业务和数据团队推进落地。');
      expect(screen.getByLabelText('标签')).toHaveValue('Nice HR');
    });
  });

  it('requires login before saving settings', async () => {
    const user = userEvent.setup();

    window.history.pushState({}, '', '/settings');
    const { default: App } = await import('@/App');
    render(<App />);

    await user.clear(screen.getByLabelText('招呼语'));
    await user.type(screen.getByLabelText('招呼语'), '您好，我先看看设置页会不会直接保存。');
    await user.click(screen.getByRole('button', { name: '保存档案' }));

    expect(screen.getByRole('dialog', { name: '登录后继续' })).toBeInTheDocument();
    expect(screen.queryByText('档案已保存')).not.toBeInTheDocument();
  });

  it('requires login before saving a nomination and persists profile edits with a toast', async () => {
    const user = userEvent.setup();

    window.history.pushState({}, '', '/nominate?bossId=boss-baidu-xu');
    const { default: App } = await import('@/App');
    render(<App />);

    expect(await screen.findByRole('heading', { name: '推荐 Boss' })).toBeInTheDocument();

    await user.clear(screen.getByLabelText('招聘岗位'));
    await user.type(screen.getByLabelText('招聘岗位'), '增长产品经理');
    await user.click(screen.getByRole('button', { name: '提交提名' }));

    expect(screen.getByRole('dialog', { name: '登录后继续' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '模拟登录' }));
    expect(screen.queryByRole('dialog', { name: '登录后继续' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '提交提名' }));

    expect(await screen.findByText('提名已提交')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/hr/boss-baidu-xu');

    await user.click(screen.getByRole('link', { name: '我的档案' }));

    await user.clear(screen.getByLabelText('招呼语'));
    await user.type(screen.getByLabelText('招呼语'), '您好，我想了解这个岗位在 AI 方向上的业务目标。');
    await user.selectOptions(screen.getByLabelText('院校层级'), 'overseas');
    await user.selectOptions(screen.getByLabelText('专业门类'), 'business');
    await user.click(screen.getByRole('button', { name: '保存档案' }));

    expect(await screen.findByText('档案已保存')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: '榜单' }));
    await user.click(screen.getByRole('link', { name: '我的档案' }));

    expect(screen.getByLabelText('招呼语')).toHaveValue('您好，我想了解这个岗位在 AI 方向上的业务目标。');
    expect(screen.getByLabelText('院校层级')).toHaveValue('overseas');
    expect(screen.getByLabelText('专业门类')).toHaveValue('business');
  });

  it('propagates add and remove changes to a Nice HR nomination into the HR detail page and Nice HR board', async () => {
    const user = userEvent.setup();

    window.history.pushState({}, '', '/nominate?bossId=boss-startup-yang');
    const { default: App } = await import('@/App');
    render(<App />);

    expect(await screen.findByRole('heading', { name: '推荐 Boss' })).toBeInTheDocument();

    await user.clear(screen.getByLabelText('标签'));
    await user.type(screen.getByLabelText('标签'), 'Nice HR');
    await user.click(screen.getByRole('button', { name: '提交提名' }));

    expect(screen.getByRole('dialog', { name: '登录后继续' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '模拟登录' }));
    await user.click(screen.getByRole('button', { name: '提交提名' }));

    expect(await screen.findByText('提名已提交')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: '杨先生' })).toBeInTheDocument();
    expect(screen.getAllByText('Nice HR', { selector: 'span' }).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('link', { name: '榜单' }));
    await user.click(screen.getByRole('button', { name: 'Nice HR' }));

    expect(await screen.findByRole('heading', { name: 'Nice HR 榜' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: '杨先生' })).toBeInTheDocument();

    await user.click(screen.getAllByRole('link', { name: '查看详情' })[1]);
    await user.click(screen.getByRole('button', { name: '提名 / 更新提名' }));

    await user.clear(screen.getByLabelText('标签'));
    await user.type(screen.getByLabelText('标签'), '数据建设中');
    await user.click(screen.getByRole('button', { name: '提交提名' }));

    expect(await screen.findByText('提名已更新')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: '杨先生' })).toBeInTheDocument();
    expect(screen.queryByText('Nice HR', { selector: 'span' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: '榜单' }));
    await user.click(screen.getByRole('button', { name: 'Nice HR' }));

    expect(await screen.findByRole('heading', { name: 'Nice HR 榜' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '杨先生' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '邢女士' })).toBeInTheDocument();
  });

  it('clears stale post-login paths after demo login', () => {
    const nextState = reducer(
      {
        ...initialState,
        auth: {
          ...initialState.auth,
          loginOpen: true,
          postLoginPath: '/nominate?bossId=boss-baidu-xu',
        },
      },
      { type: 'auth/login-demo' },
    );

    expect(nextState.auth.currentUserId).toBe('demo-user');
    expect(nextState.auth.loginOpen).toBe(false);
    expect(nextState.auth.postLoginPath).toBeNull();
  });

  it('auto-dismisses toasts independently', async () => {
    vi.useFakeTimers();
    function ToastHarness() {
      const { dispatch } = useAppState();

      return (
        <div>
          <button type="button" onClick={() => dispatch({ type: 'ui/toast', tone: 'success', message: '临时提示' })}>
            show
          </button>
          <ToastViewport />
        </div>
      );
    }

    try {
      render(
        <AppStateProvider>
          <ToastHarness />
        </AppStateProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'show' }));
      expect(screen.getByText('临时提示')).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(3300);
      });

      expect(screen.queryByText('临时提示')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
