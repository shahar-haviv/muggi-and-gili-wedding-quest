interface PixelHeartIconProps {
  readonly className?: string;
}

/**
 * Reusable 7x6 pixel-art heart SVG icon.
 */
export function PixelHeartIcon({ className = 'pixel-heart-icon' }: PixelHeartIconProps) {
  return (
    <svg className={className} viewBox="0 0 7 6" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <rect x="1" y="0" width="2" height="1" />
        <rect x="4" y="0" width="2" height="1" />
        <rect x="0" y="1" width="7" height="2" />
        <rect x="1" y="3" width="5" height="1" />
        <rect x="2" y="4" width="3" height="1" />
        <rect x="3" y="5" width="1" height="1" />
      </g>
    </svg>
  );
}
