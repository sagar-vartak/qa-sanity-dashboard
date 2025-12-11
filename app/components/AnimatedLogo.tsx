'use client';

export default function AnimatedLogo() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Animated background glow */}
      <div className="absolute h-20 w-20 animate-pulse rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-2xl" />
      
      {/* Main logo container with floating animation */}
      <div className="relative flex items-center gap-3 animate-float">
        {/* Checkmark circle - stable */}
        <div className="relative">
          <svg
            className="h-12 w-12 text-blue-600 dark:text-blue-400 drop-shadow-lg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              className="stroke-blue-200 dark:stroke-blue-800"
              strokeWidth={1}
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4"
            />
          </svg>
          
          {/* Pulsing outer ring */}
          <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-400 opacity-30" />
        </div>
        
        {/* Text with animated gradient */}
        <div className="relative">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-extrabold text-transparent animate-gradient bg-[length:200%_auto] drop-shadow-sm">
            QA Dashboard
          </span>
          {/* Glow effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-extrabold text-transparent animate-gradient-shift bg-[length:200%_auto] opacity-30 blur-sm">
            QA Dashboard
          </span>
        </div>
      </div>
      
      {/* Animated particles */}
      <div className="absolute -top-2 -right-2 h-2 w-2 animate-ping rounded-full bg-blue-400" />
      <div className="absolute -bottom-2 -left-2 h-2 w-2 animate-ping rounded-full bg-purple-400 animation-delay-300" />
    </div>
  );
}
