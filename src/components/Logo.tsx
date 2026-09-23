export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl bg-black shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.72}
        height={size * 0.72}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soundwave bars */}
        <rect x="3" y="12" width="2.5" height="8" rx="1.25" fill="white" />
        <rect x="7.5" y="8" width="2.5" height="16" rx="1.25" fill="white" />
        <rect x="12" y="5" width="2.5" height="22" rx="1.25" fill="white" />
        {/* Letter A formed by soundwave peak */}
        <path
          d="M16 27 L20 5 L24 5 L28 27 M18.5 18 L25.5 18"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
