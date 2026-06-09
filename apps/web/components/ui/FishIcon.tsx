interface FishIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export function Fish({ size = 16, color = 'currentColor', className = '' }: FishIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={color}
      className={className}
    >
      <path d="M2 8L5 5V4Q10 2 13 5.5Q15 8 13 10.5Q10 14 5 12V11Z" />
      <circle cx="11.5" cy="7" r="0.9" fill="white" />
    </svg>
  );
}
