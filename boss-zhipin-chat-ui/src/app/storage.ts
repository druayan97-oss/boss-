import { initialState } from '@/data/seed';
import type { AppState } from '@/types/domain';

export const STORAGE_KEY = 'boss-direct-review-prototype-state';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isBoardType(value: unknown): value is AppState['boards']['selectedBoard'] {
  return value === 'ghosted_hr' || value === 'blackhole_company' || value === 'nice_hr';
}

function isSchoolTier(value: unknown): value is AppState['profile']['schoolTier'] {
  return (
    value === 'qingbei' ||
    value === 'c9' ||
    value === '211' ||
    value === 'double_non_first_tier' ||
    value === 'second_tier' ||
    value === 'college' ||
    value === 'overseas' ||
    value === 'other'
  );
}

function isStudyTrack(value: unknown): value is AppState['profile']['studyTrack'] {
  return value === 'arts' || value === 'business' || value === 'science' || value === 'engineering' || value === 'other';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isBoardTagArray(value: unknown): value is string[] {
  return isStringArray(value);
}

function isToast(value: unknown): value is AppState['ui']['toasts'][number] {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.message) &&
    (value.tone === 'success' || value.tone === 'error')
  );
}

function isTurn(value: unknown): boolean {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.bossId) &&
    isString(value.candidateSummary) &&
    isString(value.greeting) &&
    (value.expectedDecision === 'reply' || value.expectedDecision === 'ignore') &&
    (value.actualDecision === undefined || value.actualDecision === 'reply' || value.actualDecision === 'ignore')
  );
}

function isBossProfile(value: unknown): boolean {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.name) &&
    isString(value.companyName) &&
    isString(value.roleTitle) &&
    isString(value.jobTitle) &&
    isString(value.jobDescription) &&
    isBoardTagArray(value.boardTags) &&
    isNumber(value.score) &&
    isNumber(value.nominationCount) &&
    isString(value.lastActiveLabel) &&
    (value.lowSample === undefined || isBoolean(value.lowSample))
  );
}

function isNominationRecord(value: unknown): boolean {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    isString(value.bossId) &&
    isString(value.hrName) &&
    isString(value.companyName) &&
    isString(value.jobTitle) &&
    isString(value.jdText) &&
    Array.isArray(value.labels) &&
    value.labels.every(isString) &&
    isString(value.greeting) &&
    isSchoolTier(value.schoolTier) &&
    isStudyTrack(value.studyTrack) &&
    isString(value.createdAt) &&
    isString(value.updatedAt) &&
    isString(value.submittedBy)
  );
}

function isNonNegativeInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value) && value >= 0;
}

function isPlaySession(value: unknown): boolean {
  return (
    isPlainObject(value) &&
    isString(value.id) &&
    (value.mode === 'random_sim' || value.mode === 'targeted_sim') &&
    isString(value.bossId) &&
    isNonNegativeInteger(value.turnIndex) &&
    Array.isArray(value.turns) &&
    value.turns.every(isTurn) &&
    isBoolean(value.finished)
  );
}

function normalizeValidatedArray<T>(value: unknown, fallback: T[], isValid: (item: unknown) => boolean): T[] {
  if (!Array.isArray(value) || !value.every(isValid)) {
    return fallback;
  }

  return value as T[];
}

function normalizeStringOrNull(value: unknown): string | null {
  if (isString(value)) {
    return value;
  }

  if (value === null) {
    return null;
  }

  return null;
}

function normalizeBoolean(value: unknown, fallback: boolean) {
  return isBoolean(value) ? value : fallback;
}

function normalizeScalarSlices(state: AppState): AppState {
  return {
    ...state,
    boards: {
      ...state.boards,
      selectedBoard: isBoardType(state.boards.selectedBoard) ? state.boards.selectedBoard : initialState.boards.selectedBoard,
    },
    auth: {
      ...state.auth,
      currentUserId: normalizeStringOrNull(state.auth.currentUserId),
      loginOpen: normalizeBoolean(state.auth.loginOpen, initialState.auth.loginOpen),
      postLoginPath: normalizeStringOrNull(state.auth.postLoginPath),
    },
    profile: {
      ...state.profile,
      greeting: isString(state.profile.greeting) ? state.profile.greeting : initialState.profile.greeting,
      schoolTier: isSchoolTier(state.profile.schoolTier) ? state.profile.schoolTier : initialState.profile.schoolTier,
      studyTrack: isStudyTrack(state.profile.studyTrack) ? state.profile.studyTrack : initialState.profile.studyTrack,
    },
    play: {
      ...state.play,
      activeSessionId: normalizeStringOrNull(state.play.activeSessionId),
    },
    ui: {
      ...state.ui,
      confirmLeaveOpen: normalizeBoolean(state.ui.confirmLeaveOpen, initialState.ui.confirmLeaveOpen),
    },
  };
}

function mergeWithDefaults<T>(defaults: T, value: unknown): T {
  if (Array.isArray(defaults)) {
    return (Array.isArray(value) ? value : defaults) as T;
  }

  if (isPlainObject(defaults)) {
    if (!isPlainObject(value)) {
      return defaults;
    }

    const merged: Record<string, unknown> = { ...defaults };

    for (const [key, defaultValue] of Object.entries(defaults)) {
      merged[key] = mergeWithDefaults(defaultValue, value[key]);
    }

    for (const [key, nextValue] of Object.entries(value)) {
      if (!(key in merged)) {
        merged[key] = nextValue;
      }
    }

    return merged as T;
  }

  return (value === undefined ? defaults : (value as T)) as T;
}

function sanitizeForStorage(state: AppState): AppState {
  return sanitizeTransientState(state);
}

function sanitizeTransientState(state: AppState): AppState {
  return {
    ...state,
    auth: {
      ...state.auth,
      loginOpen: false,
    },
    play: {
      ...state.play,
      activeSessionId: null,
    },
    ui: {
      ...state.ui,
      toasts: [],
      confirmLeaveOpen: false,
    },
  };
}

function sanitizeArraySlices(state: AppState): AppState {
  return {
    ...state,
    bosses: normalizeValidatedArray(state.bosses, initialState.bosses, isBossProfile),
    nominations: normalizeValidatedArray(state.nominations, initialState.nominations, isNominationRecord),
    play: {
      ...state.play,
      sessions: normalizeValidatedArray(state.play.sessions, initialState.play.sessions, isPlaySession),
    },
    ui: {
      ...state.ui,
      toasts: normalizeValidatedArray(state.ui.toasts, initialState.ui.toasts, isToast),
    },
  };
}

export function loadState(): AppState {
  if (typeof window === 'undefined') {
    return initialState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialState;
    }

    return sanitizeTransientState(
      normalizeScalarSlices(sanitizeArraySlices(mergeWithDefaults(initialState, JSON.parse(raw)))),
    );
  } catch {
    return initialState;
  }
}

export function saveState(state: AppState) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeForStorage(state)));
  } catch {
    // Ignore storage write failures in the prototype shell.
  }
}
