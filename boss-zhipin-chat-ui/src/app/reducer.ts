import type { AppState, BoardType, NominationRecord, PlaySession, ProfileState } from '@/types/domain';

export type Action =
  | { type: 'boards/select'; board: BoardType }
  | { type: 'auth/open-login'; path: string }
  | { type: 'auth/close-login' }
  | { type: 'auth/login-demo' }
  | { type: 'profile/save'; profile: ProfileState }
  | { type: 'nomination/save'; nomination: NominationRecord }
  | { type: 'play/start'; session: PlaySession }
  | { type: 'play/update'; session: PlaySession }
  | { type: 'ui/toast'; tone: 'success' | 'error'; message: string }
  | { type: 'ui/dismiss-toast'; id: string }
  | { type: 'ui/open-leave-confirm' }
  | { type: 'ui/close-leave-confirm' };

function makeToastId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `toast-${Date.now()}`;
}

function updateBossSummary(state: AppState, nomination: NominationRecord) {
  const existing = state.nominations.find(
    (record) => record.bossId === nomination.bossId && record.submittedBy === nomination.submittedBy,
  );

  const nominations = existing
    ? state.nominations.map((record) => (record.id === existing.id ? nomination : record))
    : [nomination, ...state.nominations];

  const bosses = state.bosses.map((boss) =>
    boss.id === nomination.bossId
      ? {
          ...boss,
          jobTitle: nomination.jobTitle,
          jobDescription: nomination.jdText,
          nominationCount: existing ? boss.nominationCount : boss.nominationCount + 1,
          lastActiveLabel: '刚刚更新',
        }
      : boss,
  );

  return { nominations, bosses };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'boards/select':
      return {
        ...state,
        boards: { selectedBoard: action.board },
      };
    case 'auth/open-login':
      return {
        ...state,
        auth: {
          ...state.auth,
          loginOpen: true,
          postLoginPath: action.path,
        },
      };
    case 'auth/close-login':
      return {
        ...state,
        auth: {
          ...state.auth,
          loginOpen: false,
        },
      };
    case 'auth/login-demo':
      return {
        ...state,
        auth: {
          currentUserId: 'demo-user',
          loginOpen: false,
          postLoginPath: state.auth.postLoginPath,
        },
      };
    case 'profile/save':
      return {
        ...state,
        profile: action.profile,
      };
    case 'nomination/save': {
      const { nominations, bosses } = updateBossSummary(state, action.nomination);
      return {
        ...state,
        nominations,
        bosses,
      };
    }
    case 'play/start':
      return {
        ...state,
        play: {
          activeSessionId: action.session.id,
          sessions: [action.session, ...state.play.sessions],
        },
      };
    case 'play/update':
      return {
        ...state,
        play: {
          activeSessionId: action.session.finished ? null : action.session.id,
          sessions: state.play.sessions.map((session) => (session.id === action.session.id ? action.session : session)),
        },
      };
    case 'ui/toast':
      return {
        ...state,
        ui: {
          ...state.ui,
          toasts: [...state.ui.toasts, { id: makeToastId(), tone: action.tone, message: action.message }],
        },
      };
    case 'ui/dismiss-toast':
      return {
        ...state,
        ui: {
          ...state.ui,
          toasts: state.ui.toasts.filter((toast) => toast.id !== action.id),
        },
      };
    case 'ui/open-leave-confirm':
      return {
        ...state,
        ui: {
          ...state.ui,
          confirmLeaveOpen: true,
        },
      };
    case 'ui/close-leave-confirm':
      return {
        ...state,
        ui: {
          ...state.ui,
          confirmLeaveOpen: false,
        },
      };
    default:
      return state;
  }
}
