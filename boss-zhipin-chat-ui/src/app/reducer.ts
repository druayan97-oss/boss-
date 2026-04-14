import type { AppState, BoardType, BossProfile, NominationRecord, PlaySession, ProfileState } from '@/types/domain';

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

function getStaticBoardTags(boss: BossProfile) {
  const tags: string[] = [];

  if (boss.lowSample) {
    tags.push('数据建设中');
  }

  if (boss.boardTags.includes('样本充足')) {
    tags.push('样本充足');
  }

  return tags;
}

function getNominationLabels(nominations: NominationRecord[], staticTags: string[]) {
  const labels: string[] = [];
  const staticTagSet = new Set(staticTags);

  for (const nomination of nominations) {
    for (const label of nomination.labels) {
      if (staticTagSet.has(label) || labels.includes(label)) {
        continue;
      }

      labels.push(label);
    }
  }

  return labels;
}

function updateBossSummary(state: AppState, nomination: NominationRecord) {
  const existing = state.nominations.find(
    (record) => record.bossId === nomination.bossId && record.submittedBy === nomination.submittedBy,
  );

  const nominations = existing
    ? state.nominations.map((record) => (record.id === existing.id ? nomination : record))
    : [nomination, ...state.nominations];

  const boss = state.bosses.find((item) => item.id === nomination.bossId);
  const staticTags = boss ? getStaticBoardTags(boss) : [];
  const boardTags = [
    ...staticTags,
    ...getNominationLabels(
      nominations.filter((record) => record.bossId === nomination.bossId),
      staticTags,
    ),
  ];

  const bosses = state.bosses.map((boss) =>
    boss.id === nomination.bossId
      ? {
          ...boss,
          jobTitle: nomination.jobTitle,
          jobDescription: nomination.jdText,
          boardTags,
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
          postLoginPath: null,
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
