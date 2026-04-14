import { useLocation } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { useAppState } from '@/app/state';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PanelCard } from '@/components/ui/PanelCard';
import { FormSection } from '@/components/forms/FormSection';
import type { SchoolTier, StudyTrack } from '@/types/domain';

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

export function SettingsPage() {
  const { state, dispatch } = useAppState();
  const location = useLocation();
  const [greeting, setGreeting] = useState(state.profile.greeting);
  const [schoolTier, setSchoolTier] = useState<SchoolTier>(state.profile.schoolTier);
  const [studyTrack, setStudyTrack] = useState<StudyTrack>(state.profile.studyTrack);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!state.auth.currentUserId) {
      dispatch({
        type: 'auth/open-login',
        path: `${location.pathname}${location.search}`,
      });
      return;
    }

    dispatch({
      type: 'profile/save',
      profile: {
        greeting,
        schoolTier,
        studyTrack,
      },
    });
    dispatch({ type: 'ui/toast', tone: 'success', message: '档案已保存' });
  }

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-5">
      <PanelCard className="space-y-4 border-cyan-100 bg-white/92">
        <div className="space-y-3">
          <Badge tone="simulation">个人设置</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">我的档案</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            这些信息会在提名和模拟流程里复用。保存后会同步到本地状态和浏览器存储。
          </p>
        </div>
      </PanelCard>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormSection title="档案内容" description="可以直接编辑招呼语、院校层级和专业门类。">
          <label className="block text-sm font-medium text-slate-700">
            招呼语
            <textarea
              aria-label="招呼语"
              value={greeting}
              onChange={(event) => setGreeting(event.target.value)}
              className="mt-2 min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200/50"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            院校层级
            <select
              aria-label="院校层级"
              value={schoolTier}
              onChange={(event) => setSchoolTier(event.target.value as SchoolTier)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200/50"
            >
              {schoolTierOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            专业门类
            <select
              aria-label="专业门类"
              value={studyTrack}
              onChange={(event) => setStudyTrack(event.target.value as StudyTrack)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200/50"
            >
              {studyTrackOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </FormSection>

        <div className="flex justify-end">
          <Button tone="primary" type="submit">
            保存档案
          </Button>
        </div>
      </form>
    </section>
  );
}
