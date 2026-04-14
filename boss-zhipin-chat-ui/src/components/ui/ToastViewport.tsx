import { useEffect, type FC } from 'react';
import { useAppState } from '@/app/state';

const toastToneClasses = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800 shadow-[0_12px_30px_rgba(16,185,129,0.14)]',
  error: 'border-rose-200 bg-rose-50 text-rose-800 shadow-[0_12px_30px_rgba(244,63,94,0.14)]',
} as const;

type ToastItemProps = {
  toast: { id: string; tone: 'success' | 'error'; message: string };
};

const ToastItem: FC<ToastItemProps> = ({ toast }) => {
  const { dispatch } = useAppState();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatch({ type: 'ui/dismiss-toast', id: toast.id });
    }, 3200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [dispatch, toast.id]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'pointer-events-auto flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-sm backdrop-blur',
        toastToneClasses[toast.tone],
      ].join(' ')}
    >
      <div className="space-y-1">
        <p className="font-medium">{toast.message}</p>
        <p className="text-xs opacity-70">{toast.tone === 'success' ? '操作已完成' : '操作未成功'}</p>
      </div>

      <button
        type="button"
        className="rounded-full px-2 py-1 text-xs font-medium opacity-70 transition hover:bg-black/5 hover:opacity-100"
        onClick={() => dispatch({ type: 'ui/dismiss-toast', id: toast.id })}
        aria-label={`关闭提示：${toast.message}`}
      >
        关闭
      </button>
    </div>
  );
};

export function ToastViewport() {
  const { state } = useAppState();

  if (!state.ui.toasts.length) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
      {state.ui.toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
