import { useTimer } from '../hooks/useTimer'
import { Button } from './ui/button'

export default function FocusModeTimer() {
  const {
    formattedTime,
    isRunning,
    progress,
    pomodoroCount,
    reset,
    toggle
  } = useTimer()

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Mode indicator and Pomodoro Counter */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#800020]">
          FOCUS TIME
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Pomodoros: {pomodoroCount}
        </p>
      </div>

      {/* Subtle progress ring - integrated */}
      <svg width="200" height="200" className="absolute transform -rotate-90 pointer-events-none">
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={isRunning ? '#800020' : '#14B8A6'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 - (progress / 100) * 2 * Math.PI * 90}`}
            className="transition-all duration-1000 ease-out"
            style={{ 
              filter: 'drop-shadow(0 0 6px rgba(128, 0, 32, 0.4))',
              opacity: 0.6
            }}
          />
      </svg>

      {/* Soft ambient glow behind center content - extends beyond bounds for seamless blend */}
      <div className="absolute inset-[-20px] pointer-events-none rounded-full bg-gradient-radial from-teal-400/20 via-teal-300/10 to-transparent blur-[60px]" />

      {/* Center content - rounded + blur eliminates the sharp rectangle in both modes */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center rounded-full blur-[2px] px-10 py-4">
        <h1 className="text-6xl font-light tracking-tight text-[#800020]/75 mb-1">
            {formattedTime}
          </h1>
        <span className="text-sm font-medium uppercase tracking-[0.15em] text-[#800020]/60">
          Focus Time
        </span>
      </div>

    {/* Control buttons */}
    <div className="flex gap-5">
      <button
        onClick={toggle}
        className="rounded-full py-5 px-12 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 min-w-[120px] text-sm font-medium bg-emerald-50 text-emerald-900 border-2 border-emerald-200/60 hover:border-emerald-300/60"
        style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)' }}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button 
        onClick={reset} 
        className="rounded-full py-5 px-8 transition-all duration-300 hover:bg-white/60 hover:scale-105 active:scale-95 text-sm font-medium border-2 border-slate-200/60 hover:border-slate-300/60 bg-white/40"
      >
        Reset
      </button>
    </div>
    </div>
  )
}
