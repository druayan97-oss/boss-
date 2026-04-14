import type { ReactNode } from 'react';

interface ModalProps {
  title: string;
  children: ReactNode;
}

export function Modal({ title, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
      <div
        aria-label={title}
        aria-modal="true"
        role="dialog"
        className="w-full max-w-lg rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.24)]"
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="text-sm leading-6 text-slate-600">当前操作需要先完成演示登录后再继续。</p>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
