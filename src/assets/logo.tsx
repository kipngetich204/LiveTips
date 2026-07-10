interface LogoProps {
  size?: number;
  logoText?: string;
  variant?: 'navbar' | 'loading' | 'standalone';
  className?: string;
}

const VARIANT_SIZE_CLASSES = {
  navbar: 'h-9 w-9 sm:h-10 sm:w-10',
  loading: 'h-24 w-24 sm:h-32 sm:w-32',
  standalone: '',
} as const;

const WRAPPER_CLASSES = {
  loading: 'flex items-center justify-center min-h-screen w-full bg-surface',
  navbar: 'flex items-center justify-center',
  standalone: 'flex items-center justify-center',
} as const;

export function Logo({
  size = 100,
  logoText = 'LT',
  variant = 'standalone',
  className = '',
}: LogoProps) {
  const isStandalone = variant === 'standalone';

  return (
    <div className={`${WRAPPER_CLASSES[variant]} ${className}`}>
      <div
        role="img"
        aria-label="Live Tips Logo"
        style={isStandalone ? { width: size, height: size } : undefined}
        className={`
          relative
          rounded-full
          flex
          items-center
          justify-center
          shrink-0

          bg-neutral-900
          text-white

          border-2
          border-emerald-500

          shadow-md
          ring-2
          ring-white

          dark:ring-neutral-900
          dark:bg-white
          dark:text-neutral-900
          dark:border-emerald-500

          ${VARIANT_SIZE_CLASSES[variant]}
          ${variant === 'loading' ? 'animate-pulse motion-reduce:animate-none' : ''}
        `}
      >
        <span
          className="
            font-black
            italic
            leading-none
            tracking-[-0.08em]
            text-base
            sm:text-lg
            select-none
          "
        >
          {logoText}
        </span>
      </div>
    </div>
  );
}