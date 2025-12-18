'use client';

import { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Notification({ message, type, onClose, duration = 5000 }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-20 left-1/2 z-50 -translate-x-1/2 transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
    >
      <div
        className={`flex items-center gap-3 rounded-lg px-6 py-4 shadow-xl backdrop-blur-sm ${
          type === 'success'
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-green-400 text-white dark:from-green-600 dark:to-emerald-600 dark:border-green-500'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 border-2 border-indigo-400 text-white dark:from-indigo-700 dark:to-purple-700 dark:border-indigo-500'
        }`}
      >
        {type === 'success' ? (
          <svg
            className="h-5 w-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 rounded p-1 hover:bg-white/20 transition-colors"
          aria-label="Close notification"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

