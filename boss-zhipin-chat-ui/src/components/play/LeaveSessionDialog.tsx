import { Button } from '@/components/ui/Button';

interface LeaveSessionDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function LeaveSessionDialog({ onConfirm, onCancel }: LeaveSessionDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
      <div
        aria-label="确认离开本局"
        aria-modal="true"
        role="dialog"
        className="w-full max-w-lg rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.24)]"
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">确认离开本局</h2>
          <p className="text-sm leading-6 text-slate-600">
            离开后当前练习会保留为未完成状态，本轮不会继续推进。
          </p>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button tone="default" onClick={onCancel}>
            继续本局
          </Button>
          <Button tone="primary" onClick={onConfirm}>
            确认离开
          </Button>
        </div>
      </div>
    </div>
  );
}
