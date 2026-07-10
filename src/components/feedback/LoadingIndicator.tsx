export type LoadingIndicatorSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<LoadingIndicatorSize, string> = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
};

const TEXT_SIZE_CLASSES: Record<LoadingIndicatorSize, string> = {
  sm: 'text-[10px]',
  md: 'text-sm',
  lg: 'text-xl',
};

interface LoadingIndicatorProps {
  size?: LoadingIndicatorSize;
  showMark?: boolean;
  className?: string;
}

export function LoadingIndicator({
  size = 'md',
  showMark = false,
  className = '',
}: LoadingIndicatorProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${SIZE_CLASSES[size]} ${className}`}
    >
      {/* Animated outer glow */}
      <span
        className="
          absolute
          inset-0
          rounded-full
          border-2
          border-emerald-500
          opacity-40
          animate-ping
          motion-reduce:hidden
        "
        aria-hidden="true"
      />

      {/* Logo */}
      <div
        className="
          relative
          h-full
          w-full
          rounded-full

          bg-neutral-900
          text-white

          border-2
          border-emerald-500

          ring-2
          ring-white

          shadow-md

          dark:bg-white
          dark:text-neutral-900
          dark:ring-neutral-900
          dark:border-emerald-500

          flex
          items-center
          justify-center
        "
      >
        {showMark && (
          <span
            className={`
              font-black
              italic
              leading-none
              tracking-[-0.08em]
              select-none
              ${TEXT_SIZE_CLASSES[size]}
            `}
          >
            LT
          </span>
        )}
      </div>
    </div>
  );
}