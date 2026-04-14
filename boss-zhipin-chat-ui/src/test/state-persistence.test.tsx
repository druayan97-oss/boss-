import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initialState } from '@/data/seed';
import { loadState, saveState, STORAGE_KEY } from '@/app/storage';
import { AppStateProvider, useAppState } from '@/app/state';
import type { AppState } from '@/types/domain';

function Probe() {
  const { state } = useAppState();
  return (
    <div>
      <div data-testid="board">{state.boards.selectedBoard}</div>
      <div data-testid="boss-count">{String(state.bosses.length)}</div>
      <div data-testid="nomination-count">{String(state.nominations.length)}</div>
      <div data-testid="auth-current-user">{String(state.auth.currentUserId)}</div>
      <div data-testid="auth-login-open">{String(state.auth.loginOpen)}</div>
      <div data-testid="auth-path">{String(state.auth.postLoginPath)}</div>
      <div data-testid="profile-greeting">{state.profile.greeting}</div>
      <div data-testid="profile-school-tier">{state.profile.schoolTier}</div>
      <div data-testid="profile-track">{state.profile.studyTrack}</div>
      <div data-testid="play-active">{String(state.play.activeSessionId)}</div>
      <div data-testid="session-count">{String(state.play.sessions.length)}</div>
      <div data-testid="ui-toast-count">{String(state.ui.toasts.length)}</div>
      <div data-testid="ui-leave-open">{String(state.ui.confirmLeaveOpen)}</div>
    </div>
  );
}

describe('AppStateProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('hydrates the selected board from localStorage', () => {
    const snapshot: AppState = {
      auth: { currentUserId: null, loginOpen: false, postLoginPath: null },
      boards: { selectedBoard: 'nice_hr' },
      profile: {
        greeting: 'hello',
        schoolTier: '211',
        studyTrack: 'engineering',
      },
      bosses: [],
      nominations: [],
      play: { activeSessionId: null, sessions: [] },
      ui: { toasts: [], confirmLeaveOpen: false },
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));

    render(
      <AppStateProvider>
        <Probe />
      </AppStateProvider>,
    );

    expect(screen.getByTestId('board')).toHaveTextContent('nice_hr');
  });

  it('preserves nested defaults for partial persisted slices', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        auth: { currentUserId: 'demo-user' },
        boards: { selectedBoard: 'blackhole_company' },
        profile: { greeting: initialState.profile.greeting },
        play: { sessions: [] },
        ui: {},
      }),
    );

    render(
      <AppStateProvider>
        <Probe />
      </AppStateProvider>,
    );

    expect(screen.getByTestId('board')).toHaveTextContent('blackhole_company');
    expect(screen.getByTestId('boss-count')).toHaveTextContent(String(initialState.bosses.length));
    expect(screen.getByTestId('nomination-count')).toHaveTextContent(String(initialState.nominations.length));
    expect(screen.getByTestId('auth-current-user')).toHaveTextContent('demo-user');
    expect(screen.getByTestId('auth-login-open')).toHaveTextContent('false');
    expect(screen.getByTestId('auth-path')).toHaveTextContent('null');
    expect(screen.getByTestId('profile-greeting')).toHaveTextContent(initialState.profile.greeting);
    expect(screen.getByTestId('profile-school-tier')).toHaveTextContent(initialState.profile.schoolTier);
    expect(screen.getByTestId('profile-track')).toHaveTextContent(initialState.profile.studyTrack);
    expect(screen.getByTestId('play-active')).toHaveTextContent('null');
    expect(screen.getByTestId('session-count')).toHaveTextContent('0');
    expect(screen.getByTestId('ui-toast-count')).toHaveTextContent('0');
    expect(screen.getByTestId('ui-leave-open')).toHaveTextContent('false');
  });

  it('does not restore transient UI state after save/load', () => {
    const transientState: AppState = {
      ...initialState,
      play: {
        activeSessionId: 'session-transient',
        sessions: [
          {
            id: 'session-transient',
            mode: 'random_sim',
            bossId: 'boss-baidu-xu',
            turnIndex: 1,
            turns: [],
            finished: false,
          },
        ],
      },
      ui: {
        toasts: [{ id: 'toast-1', tone: 'success', message: 'Saved' }],
        confirmLeaveOpen: true,
      },
    };

    saveState(transientState);

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as AppState;
    expect(stored.play.activeSessionId).toBeNull();
    expect(stored.ui.toasts).toHaveLength(0);
    expect(stored.ui.confirmLeaveOpen).toBe(false);

    const hydrated = loadState();
    expect(hydrated.play.activeSessionId).toBeNull();
    expect(hydrated.ui.toasts).toHaveLength(0);
    expect(hydrated.ui.confirmLeaveOpen).toBe(false);
  });

  it('sanitizes dirty transient fields during load', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...initialState,
        auth: {
          ...initialState.auth,
          loginOpen: true,
        },
        play: {
          ...initialState.play,
          activeSessionId: 'session-dirty',
        },
        ui: {
          ...initialState.ui,
          toasts: [{ id: 'toast-dirty', tone: 'error', message: 'Dirty' }],
          confirmLeaveOpen: true,
        },
      }),
    );

    const hydrated = loadState();
    expect(hydrated.auth.loginOpen).toBe(false);
    expect(hydrated.play.activeSessionId).toBeNull();
    expect(hydrated.ui.toasts).toHaveLength(0);
    expect(hydrated.ui.confirmLeaveOpen).toBe(false);

    render(
      <AppStateProvider>
        <Probe />
      </AppStateProvider>,
    );

    expect(screen.getByTestId('auth-login-open')).toHaveTextContent('false');
    expect(screen.getByTestId('play-active')).toHaveTextContent('null');
    expect(screen.getByTestId('ui-toast-count')).toHaveTextContent('0');
    expect(screen.getByTestId('ui-leave-open')).toHaveTextContent('false');
  });

  it('falls back from invalid scalar values during load', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...initialState,
        boards: {
          selectedBoard: 123,
        },
        auth: {
          currentUserId: 456,
          loginOpen: 'yes',
          postLoginPath: 789,
        },
        profile: {
          greeting: 999,
          schoolTier: 'not-a-tier',
          studyTrack: 'not-a-track',
        },
        play: {
          ...initialState.play,
          activeSessionId: 321,
        },
        ui: {
          ...initialState.ui,
          confirmLeaveOpen: 'true',
        },
      }),
    );

    const hydrated = loadState();
    expect(hydrated.boards.selectedBoard).toBe(initialState.boards.selectedBoard);
    expect(hydrated.auth.currentUserId).toBeNull();
    expect(hydrated.auth.loginOpen).toBe(false);
    expect(hydrated.auth.postLoginPath).toBeNull();
    expect(hydrated.profile.greeting).toBe(initialState.profile.greeting);
    expect(hydrated.profile.schoolTier).toBe(initialState.profile.schoolTier);
    expect(hydrated.profile.studyTrack).toBe(initialState.profile.studyTrack);
    expect(hydrated.play.activeSessionId).toBeNull();
    expect(hydrated.ui.confirmLeaveOpen).toBe(false);

    render(
      <AppStateProvider>
        <Probe />
      </AppStateProvider>,
    );

    expect(screen.getByTestId('board')).toHaveTextContent(initialState.boards.selectedBoard);
    expect(screen.getByTestId('auth-current-user')).toHaveTextContent('null');
    expect(screen.getByTestId('auth-login-open')).toHaveTextContent('false');
    expect(screen.getByTestId('auth-path')).toHaveTextContent('null');
    expect(screen.getByTestId('profile-greeting')).toHaveTextContent(initialState.profile.greeting);
    expect(screen.getByTestId('profile-school-tier')).toHaveTextContent(initialState.profile.schoolTier);
    expect(screen.getByTestId('profile-track')).toHaveTextContent(initialState.profile.studyTrack);
    expect(screen.getByTestId('play-active')).toHaveTextContent('null');
    expect(screen.getByTestId('ui-toast-count')).toHaveTextContent('0');
    expect(screen.getByTestId('ui-leave-open')).toHaveTextContent('false');
  });

  it('falls back from malformed array records during load', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...initialState,
        nominations: [
          {
            id: 'broken-nomination',
            bossId: 'boss-baidu-xu',
            hrName: '徐女士',
            companyName: '百度',
            jobTitle: '作者生态产品实习生',
            jdText: 'payload',
            labels: ['已读不回'],
            greeting: 'hello',
            schoolTier: 'not-a-tier',
            studyTrack: 'not-a-track',
            createdAt: '2026-04-01T00:00:00.000Z',
            updatedAt: '2026-04-01T00:00:00.000Z',
            submittedBy: 'seed-user-x',
          },
        ],
        play: {
          ...initialState.play,
          sessions: [
            {
              id: 'broken-session',
              mode: 'random_sim',
              bossId: 'boss-baidu-xu',
              turnIndex: -1,
              turns: [{ nope: true }],
              finished: false,
            },
          ],
        },
      }),
    );

    const hydrated = loadState();
    expect(hydrated.nominations).toHaveLength(initialState.nominations.length);
    expect(hydrated.play.sessions).toHaveLength(0);

    render(
      <AppStateProvider>
        <Probe />
      </AppStateProvider>,
    );

    expect(screen.getByTestId('nomination-count')).toHaveTextContent(String(initialState.nominations.length));
    expect(screen.getByTestId('session-count')).toHaveTextContent('0');
  });
});
