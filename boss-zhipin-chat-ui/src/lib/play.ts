import type { BossProfile, PlayMode, PlaySession, PlayTurn, TurnDecision } from '@/types/domain';

const TURN_COUNT = 6;

function makeSessionId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `play-${Date.now()}`;
}

function resolveBoss(mode: PlayMode, bosses: BossProfile[], bossId?: string) {
  if (!bosses.length) {
    return null;
  }

  if (mode === 'targeted_sim' && bossId) {
    return bosses.find((boss) => boss.id === bossId) ?? bosses[0];
  }

  const randomIndex = Math.floor(Math.random() * bosses.length);
  return bosses[randomIndex] ?? bosses[0];
}

function buildTurn(boss: BossProfile, index: number): PlayTurn {
  const expectedDecision: TurnDecision = index % 2 === 0 ? 'reply' : 'ignore';
  const candidateSummary = index % 2 === 0 ? '211 · 工科' : '海外院校 · 商科';
  const greeting =
    index % 2 === 0
      ? `您好，我关注到 ${boss.companyName} 的 ${boss.jobTitle}，希望进一步了解岗位目标和团队协作方式。`
      : `您好，我对 ${boss.jobTitle} 感兴趣，想知道当前最核心的业务挑战是什么。`;

  return {
    id: `${boss.id}-turn-${index + 1}`,
    bossId: boss.id,
    candidateSummary,
    greeting,
    expectedDecision,
  };
}

export function createSession(mode: PlayMode, bosses: BossProfile[], bossId?: string): PlaySession {
  const boss = resolveBoss(mode, bosses, bossId);

  return {
    id: makeSessionId(),
    mode,
    bossId: boss?.id ?? bossId ?? '',
    turnIndex: 0,
    turns: boss ? Array.from({ length: TURN_COUNT }, (_, index) => buildTurn(boss, index)) : [],
    finished: false,
  };
}

export function applyDecision(session: PlaySession, decision: TurnDecision): PlaySession {
  if (session.finished || session.turnIndex >= session.turns.length) {
    return session;
  }

  const turns = session.turns.map((turn, index) =>
    index === session.turnIndex ? { ...turn, actualDecision: decision } : turn,
  );
  const nextTurnIndex = session.turnIndex + 1;

  return {
    ...session,
    turns,
    turnIndex: nextTurnIndex,
    finished: nextTurnIndex >= turns.length,
  };
}

export function getAccuracy(session: PlaySession) {
  const total = session.turns.length;
  const correct = session.turns.filter(
    (turn) => turn.actualDecision !== undefined && turn.actualDecision === turn.expectedDecision,
  ).length;

  return {
    correct,
    total,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
  };
}
