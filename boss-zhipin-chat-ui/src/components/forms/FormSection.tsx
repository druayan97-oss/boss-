import type { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

export function FormSection({ title, description, className = '', children }: FormSectionProps) {
  return (
    <section
      className={[
        'rounded-[24px] border border-white/70 bg-white/92 p-5 shadow-[0_20px_48px_rgba(10,35,28,0.08)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
        {description ? <p className="text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>

      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
