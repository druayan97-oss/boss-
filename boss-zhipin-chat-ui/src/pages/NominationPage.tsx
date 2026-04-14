import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppState } from '@/app/state';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PanelCard } from '@/components/ui/PanelCard';
import { FormSection } from '@/components/forms/FormSection';
import type { NominationRecord, SchoolTier, StudyTrack } from '@/types/domain';

const schoolTierOptions: Array<{ value: SchoolTier; label: string }> = [
  { value: 'qingbei', label: '清北 / Top3' },
  { value: 'c9', label: 'C9' },
  { value: '211', label: '211' },
  { value: 'double_non_first_tier', label: '双非一本' },
  { value: 'second_tier', label: '二本' },
  { value: 'college', label: '专科 / 高职' },
  { value: 'overseas', label: '海外院校' },
  { value: 'other', label: '其他' },
];

const studyTrackOptions: Array<{ value: StudyTrack; label: string }> = [
  { value: 'arts', label: '文科' },
  { value: 'business', label: '商科' },
  { value: 'science', label: '理科' },
  { value: 'engineering', label: '工科' },
  { value: 'other', label: '交叉 / 其他' },
];

function makeNominationId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `nomination-${Date.now()}`;
}

function normalizeLabels(value: string, fallback: string[]) {
  const labels = value
    .split(/[、,，]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return labels.length ? labels : fallback;
}

function getProfileSummary(record: Pick<NominationRecord, 'greeting' | 'schoolTier' | 'studyTrack'>) {
  return [
    { label: '招呼语', value: record.greeting },
    { label: '院校层级', value: schoolTierOptions.find((item) => item.value === record.schoolTier)?.label ?? record.schoolTier },
    { label: '专业门类', value: studyTrackOptions.find((item) => item.value === record.studyTrack)?.label ?? record.studyTrack },
  ];
}

export function NominationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { state, dispatch } = useAppState();

  const bossId = params.get('bossId');
  const boss = useMemo(() => {
    if (!bossId) {
      return state.bosses[0] ?? null;
    }

    return state.bosses.find((item) => item.id === bossId) ?? null;
  }, [bossId, state.bosses]);

  const existingNomination = useMemo(
    () => (boss ? state.nominations.find((record) => record.bossId === boss.id && record.submittedBy === 'demo-user') ?? null : null),
    [boss, state.nominations],
  );

  const [jobTitle, setJobTitle] = useState(existingNomination?.jobTitle ?? boss?.jobTitle ?? '');
  const [jdText, setJdText] = useState(existingNomination?.jdText ?? boss?.jobDescription ?? '');
  const [labelsText, setLabelsText] = useState(existingNomination?.labels.join('、') ?? boss?.boardTags.join('、') ?? '');

  useEffect(() => {
    if (!boss) {
      return;
    }

    setJobTitle(existingNomination?.jobTitle ?? boss.jobTitle);
    setJdText(existingNomination?.jdText ?? boss.jobDescription);
    setLabelsText(existingNomination?.labels.join('、') ?? boss.boardTags.join('、'));
  }, [boss, existingNomination]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!state.auth.currentUserId) {
      dispatch({ type: 'auth/open-login', path: `${location.pathname}${location.search}` });
      return;
    }

    const timestamp = new Date().toISOString();
    const nomination: NominationRecord = {
      id: existingNomination?.id ?? makeNominationId(),
      bossId: boss.id,
      hrName: boss.name,
      companyName: boss.companyName,
      jobTitle: jobTitle.trim() || boss.jobTitle,
      jdText: jdText.trim() || boss.jobDescription,
      labels: normalizeLabels(labelsText, boss.boardTags),
      greeting: state.profile.greeting,
      schoolTier: state.profile.schoolTier,
      studyTrack: state.profile.studyTrack,
      createdAt: existingNomination?.createdAt ?? timestamp,
      updatedAt: timestamp,
      submittedBy: state.auth.currentUserId,
    };

    dispatch({ type: 'nomination/save', nomination });
    dispatch({
      type: 'ui/toast',
      tone: 'success',
      message: existingNomination ? '提名已更新' : '提名已提交',
    });
    navigate(`/hr/${boss.id}`);
  }

  if (!boss) {
    return (
      <PanelCard className="space-y-3">
        <Badge tone="neutral">未找到</Badge>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">没有找到可提名的 Boss</h1>
        <p className="text-sm leading-6 text-slate-600">请从榜单或 HR 详情页进入一个有效的 Boss 提名入口。</p>
      </PanelCard>
    );
  }

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-5">
      <PanelCard className="space-y-4 border-cyan-100 bg-white/92">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Badge tone="simulation">提名入口</Badge>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">推荐 Boss</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                这是一张演示提名表单。提交前需要先完成登录，保存时会自动带入你当前的档案信息。
              </p>
            </div>
          </div>

          {existingNomination ? <Badge tone="positive">已有 demo 用户提名</Badge> : <Badge tone="neutral">新的提名</Badge>}
        </div>
      </PanelCard>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormSection
          title="提名信息"
          description="这里编辑的是这位 Boss 的岗位和描述。标签支持用中文顿号分隔多个值。"
        >
          <label className="block text-sm font-medium text-slate-700">
            招聘岗位
            <input
              aria-label="招聘岗位"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200/50"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            职位描述（JD）
            <textarea
              aria-label="职位描述（JD）"
              value={jdText}
              onChange={(event) => setJdText(event.target.value)}
              className="mt-2 min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200/50"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            标签
            <input
              aria-label="标签"
              value={labelsText}
              onChange={(event) => setLabelsText(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200/50"
            />
          </label>
        </FormSection>

        <FormSection
          title="当前档案"
          description="保存提名时会自动使用你的招呼语、院校层级和专业门类。"
        >
          <div className="grid gap-3 md:grid-cols-3">
            {getProfileSummary(state.profile).map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{item.value}</p>
              </div>
            ))}
          </div>
        </FormSection>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button tone="ghost" type="button" onClick={() => navigate(`/hr/${boss.id}`)}>
            返回详情
          </Button>
          <Button tone="primary" type="submit">
            提交提名
          </Button>
        </div>
      </form>
    </section>
  );
}
