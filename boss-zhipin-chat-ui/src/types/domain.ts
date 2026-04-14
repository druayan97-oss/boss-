export type BoardType = 'ghosted_hr' | 'blackhole_company' | 'nice_hr';

export type PlayMode = 'random_sim' | 'targeted_sim';

export type TurnDecision = 'reply' | 'ignore';

export type SchoolTier =
  | 'qingbei'
  | 'c9'
  | '211'
  | 'double_non_first_tier'
  | 'second_tier'
  | 'college'
  | 'overseas'
  | 'other';

export type StudyTrack = 'arts' | 'business' | 'science' | 'engineering' | 'other';

export interface BossProfile {
  id: string;
  name: string;
  companyName: string;
  roleTitle: string;
  jobTitle: string;
  jobDescription: string;
  boardTags: string[];
  score: number;
  nominationCount: number;
  lastActiveLabel: string;
  lowSample?: boolean;
}

export interface NominationRecord {
  id: string;
  bossId: string;
  hrName: string;
  companyName: string;
  jobTitle: string;
  jdText: string;
  labels: string[];
  greeting: string;
  schoolTier: SchoolTier;
  studyTrack: StudyTrack;
  createdAt: string;
  updatedAt: string;
  submittedBy: string;
}

export interface ProfileState {
  greeting: string;
  schoolTier: SchoolTier;
  studyTrack: StudyTrack;
}

export interface PlayTurn {
  id: string;
  bossId: string;
  candidateSummary: string;
  greeting: string;
  expectedDecision: TurnDecision;
  actualDecision?: TurnDecision;
}

export interface PlaySession {
  id: string;
  mode: PlayMode;
  bossId: string;
  turnIndex: number;
  turns: PlayTurn[];
  finished: boolean;
}

export interface AppState {
  auth: {
    currentUserId: string | null;
    loginOpen: boolean;
    postLoginPath: string | null;
  };
  boards: {
    selectedBoard: BoardType;
  };
  profile: ProfileState;
  bosses: BossProfile[];
  nominations: NominationRecord[];
  play: {
    activeSessionId: string | null;
    sessions: PlaySession[];
  };
  ui: {
    toasts: { id: string; tone: 'success' | 'error'; message: string }[];
    confirmLeaveOpen: boolean;
  };
}

