import React from 'react'

/**
 * StatCard — a dashboard statistic card with icon, value, label, and gradient accent.
 *
 * Props:
 *   icon    - React icon component
 *   label   - stat label text
 *   value   - numeric stat value
 *   color   - Tailwind gradient class string for the icon bg
 *   trend   - optional small label (e.g. "↑ 12%")
 */
export default function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div className="
      relative bg-white dark:bg-slate-800/60 rounded-2xl p-5
      border border-slate-200 dark:border-white/5
      shadow-sm hover:shadow-md dark:hover:shadow-indigo-500/5
      transition-all duration-300 hover:-translate-y-0.5
      overflow-hidden group animate-fade-in
    ">
      {/* Background glow */}
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-xl transition-opacity group-hover:opacity-20 ${color}`} />

      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-xl shadow-lg ${color}`}>
          <Icon />
        </div>

        {/* Trend badge */}
        {trend && (
          <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>

      {/* Value + Label */}
      <div className="mt-4">
        <p className="text-3xl font-bold text-slate-800 dark:text-white leading-none">
          {value ?? '—'}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {label}
        </p>
      </div>
    </div>
  )
}
