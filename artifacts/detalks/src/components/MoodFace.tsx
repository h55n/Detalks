interface MoodFaceProps {
  /** 1 (rough) to 5 (great). */
  mood: number;
  size?: number;
  className?: string;
}

// Hand-drawn line faces in the app's ink colour. They replace emoji so the
// check-in looks the same on every device and font stack.
const MOUTHS: Record<number, string> = {
  1: "M8.5 16.2 Q12 12.6 15.5 16.2",
  2: "M9 15.6 Q12 13.8 15 15.6",
  3: "M9 15 H15",
  4: "M8.8 14 Q12 17.2 15.2 14",
  5: "M8 13.4 Q12 18.6 16 13.4 Z",
};

export function MoodFace({ mood, size = 26, className = "" }: MoodFaceProps) {
  const m = Math.min(5, Math.max(1, Math.round(mood)));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9.2" />
      {m === 1 ? (
        <>
          <path d="M7.8 9.2 L10 10.2" />
          <path d="M16.2 9.2 L14 10.2" />
        </>
      ) : null}
      <circle cx="9.2" cy="10.6" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="10.6" r="0.55" fill="currentColor" stroke="none" />
      <path d={MOUTHS[m]} fill={m === 5 ? "currentColor" : "none"} fillOpacity={m === 5 ? 0.12 : 0} />
    </svg>
  );
}
