export function WeeklyPage() {
  return (
    <article className="mx-auto max-w-2xl rounded-3xl border border-white/50 bg-white/70 p-8 shadow-[0_20px_70px_rgba(13,148,136,0.14)] backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600/80">
        本周简报
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-900">Prototype only</h1>
      <p className="mt-4 leading-7 text-slate-600">
        这一页暂时只保留壳层和路由入口，后续任务会把周报数据、摘要和行动项接进来。
      </p>
    </article>
  );
}
