import React from 'react'

/**
 * Spinner — animated loading indicator with customizable size and color.
 */
export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
    xl: 'w-16 h-16 border-4',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizes[size]}
          rounded-full
          border-indigo-200 dark:border-indigo-900
          border-t-indigo-500
          animate-spin-slow
        `}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}

/**
 * FullPageSpinner — centered spinner for page-level loading states.
 */
export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <Spinner size="xl" />
        <p className="text-slate-400 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
