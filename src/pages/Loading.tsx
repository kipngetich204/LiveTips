import { LoadingIndicator } from '../components/feedback/LoadingIndicator';

export const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 min-h-screen w-full bg-surface px-4">
      <LoadingIndicator size="lg" showMark />

      <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
        <div className="text-center">
          <p className="text-text-primary font-semibold text-lg">Live Tips</p>
          <p className="text-text-secondary text-sm mt-1">Loading today's predictions…</p>
        </div>

        <div className="w-48 h-1 rounded-full bg-surface-muted overflow-hidden" aria-hidden="true">
          <div className="h-full w-1/3 rounded-full bg-brand-black dark:bg-brand-white animate-loading-slide motion-reduce:w-full motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
};