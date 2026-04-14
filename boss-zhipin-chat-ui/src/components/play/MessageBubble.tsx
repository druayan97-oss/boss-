import type { ReactNode } from 'react';

interface MessageBubbleProps {
  children: ReactNode;
  label?: string;
}

export function MessageBubble({ children, label = '候选人消息' }: MessageBubbleProps) {
  return (
    <div className="max-w-[44rem] rounded-[28px] rounded-tl-[12px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 px-5 py-4 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600/80">{label}</p>
      <div className="mt-3 text-sm leading-7 text-slate-700">{children}</div>
    </div>
  );
}
