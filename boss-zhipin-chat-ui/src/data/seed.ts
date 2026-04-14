import type { AppState, BossProfile, NominationRecord } from '@/types/domain';

const bosses: BossProfile[] = [
  {
    id: 'boss-baidu-xu',
    name: '徐女士',
    companyName: '百度',
    roleTitle: 'HR',
    jobTitle: '作者生态产品实习生',
    jobDescription: '负责作者增长、内容生态与推荐策略协同，支持内容平台增长类功能设计。',
    boardTags: ['已读不回', '样本充足'],
    score: 98,
    nominationCount: 128,
    lastActiveLabel: '3 天前',
  },
  {
    id: 'boss-meituan-xing',
    name: '邢女士',
    companyName: '美团',
    roleTitle: '产品招聘',
    jobTitle: 'AI 产品经理',
    jobDescription: '面向本地生活场景建设 AI 产品流程，协调策略、模型、业务和数据团队推进落地。',
    boardTags: ['Nice HR'],
    score: 76,
    nominationCount: 34,
    lastActiveLabel: '1 天前',
  },
  {
    id: 'boss-startup-yang',
    name: '杨先生',
    companyName: '迅策科技',
    roleTitle: 'HR',
    jobTitle: '增长产品经理',
    jobDescription: '带增长方向用户生命周期项目，要求能快速推进调研、埋点和实验迭代。',
    boardTags: ['数据建设中'],
    score: 22,
    nominationCount: 4,
    lastActiveLabel: '7 天前',
    lowSample: true,
  },
];

const nominations: NominationRecord[] = [
  {
    id: 'nom-1',
    bossId: 'boss-baidu-xu',
    hrName: '徐女士',
    companyName: '百度',
    jobTitle: '作者生态产品实习生',
    jdText: '内容平台增长方向，要求对社区生态和推荐链路有兴趣。',
    labels: ['已读不回'],
    greeting: '您好，我是中大 27 届工科学生，有内容平台产品实习经历，想进一步了解岗位方向。',
    schoolTier: '211',
    studyTrack: 'engineering',
    createdAt: '2026-04-03T10:30:00.000Z',
    updatedAt: '2026-04-11T08:00:00.000Z',
    submittedBy: 'seed-user-a',
  },
  {
    id: 'nom-2',
    bossId: 'boss-meituan-xing',
    hrName: '邢女士',
    companyName: '美团',
    jobTitle: 'AI 产品经理',
    jdText: '需要有模型应用设计、需求拆解和业务联动经验。',
    labels: ['Nice HR'],
    greeting: '您好，我做过 AI 工作流产品，有从 0 到 1 的需求推进经验，想沟通岗位细节。',
    schoolTier: 'overseas',
    studyTrack: 'business',
    createdAt: '2026-04-07T14:20:00.000Z',
    updatedAt: '2026-04-12T09:00:00.000Z',
    submittedBy: 'seed-user-b',
  },
];

export const initialState: AppState = {
  auth: {
    currentUserId: null,
    loginOpen: false,
    postLoginPath: null,
  },
  boards: {
    selectedBoard: 'ghosted_hr',
  },
  profile: {
    greeting: '您好，我是有两段 AI 产品实习经历的 27 届学生，想了解一下岗位要求和团队方向。',
    schoolTier: '211',
    studyTrack: 'engineering',
  },
  bosses,
  nominations,
  play: {
    activeSessionId: null,
    sessions: [],
  },
  ui: {
    toasts: [],
    confirmLeaveOpen: false,
  },
};

