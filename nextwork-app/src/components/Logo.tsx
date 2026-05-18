interface LogoProps {
  variant?: "mark" | "wordmark" | "full";
  /** Background of the emblem circle */
  fill?: string;
  /** Colour of the radiating lines and wordmark text */
  ink?: string;
  className?: string;
  size?: number;
}

/** Emblem-only mark */
function Mark({ fill, ink, size }: { fill: string; ink: string; size: number }) {
  const r = 50;
  const cx = 50;
  const cy = 50;
  // Focal point: right edge of circle
  const fx = cx + r;
  const fy = cy;

  // Angles (in degrees) for the radiating lines, measured from the focal point
  // covering upper-left quadrant fan + lower fan, matching the brand mark
  const angles = [155, 135, 118, 104, 92, 180, 207, 220];

  function lineEnd(angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    // Extend far enough to always exit the circle
    return {
      x: fx + Math.cos(rad) * (r * 2.2),
      y: fy + Math.sin(rad) * (r * 2.2),
    };
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Nextwork emblem"
    >
      <defs>
        <clipPath id="circle-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      {/* Radiating lines clipped to circle */}
      <g clipPath="url(#circle-clip)" stroke={ink} strokeWidth="2.8" strokeLinecap="round">
        {angles.map((a, i) => {
          const end = lineEnd(a);
          return <line key={i} x1={fx} y1={fy} x2={end.x} y2={end.y} />;
        })}
      </g>
    </svg>
  );
}

/** Full wordmark (emblem + "nextwork" text) */
export default function Logo({
  variant = "full",
  fill = "#1B1918",
  ink = "#FFFFFF",
  className = "",
  size = 40,
}: LogoProps) {
  const mark = <Mark fill={fill} ink={ink} size={size} />;

  if (variant === "mark") return <span className={className}>{mark}</span>;

  const wordmark = (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
        fontWeight: 400,
        fontSize: size * 0.7,
        color: fill === "#FFFFFF" || fill === "#F8F5F0" ? ink : fill,
        letterSpacing: "-0.02em",
      }}
    >
      nextwork
    </span>
  );

  if (variant === "wordmark") return wordmark;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {mark}
      {wordmark}
    </div>
  );
}
