import { useTranslation } from 'react-i18next';
import { LoadingIndicator } from './LoadingIndicator';

interface InlineLoaderProps {
  /** Falls back to i18n 'common.loading' when omitted */
  label?: string;
}

export function InlineLoader({ label }: InlineLoaderProps) {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      aria-live="polite"
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-border
        bg-surface-secondary
        px-3
        py-1.5
      "
    >
      <LoadingIndicator size="sm" showMark />

      <span className="text-sm font-medium text-text-secondary">
        {label ?? t('common.loading')}
      </span>
    </div>
  );
}