import type { MouseEventHandler, ReactNode } from 'react';

type ButtonTone = 'primary' | 'default' | 'ghost';
type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps {
  tone?: ButtonTone;
  className?: string;
  children?: ReactNode;
  type?: ButtonType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  ariaPressed?: boolean;
}

const toneClasses: Record<ButtonTone, string> = {
  primary:
    'border border-slate-900 bg-slate-900 text-white shadow-[0_10px_30px_rgba(15,23,42,0.16)] hover:bg-slate-800',
  default:
    'border border-slate-200 bg-white text-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:border-slate-300 hover:bg-slate-50',
  ghost: 'border border-transparent bg-transparent text-slate-700 hover:bg-slate-100',
};

export function Button({ tone = 'default', className = '', type = 'button', children, onClick, disabled, ariaPressed }: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50',
        toneClasses[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={ariaPressed}
    >
      {children}
    </button>
  );
}
