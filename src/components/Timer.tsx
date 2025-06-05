import React, { useEffect } from 'react';
import { Play, Pause, RefreshCw, Coffee, Brain, Check } from 'lucide-react';
import { useTimer, TimerMode } from '../hooks/useTimer';
import { useSettings } from '../hooks/useSettings';
import { startTickingSound, stopTickingSound, initAudio } from '../utils/audio';

const Timer: React.FC = () => {
  const { 
    timeLeft, 
    formattedTime, 
    isActive, 
    mode, 
    progress,
    workSessionsCompleted, 
    start, 
    pause, 
    reset, 
    changeMode 
  } = useTimer();
  const { settings } = useSettings();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space - toggle timer
      if (e.code === 'Space' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        isActive ? pause() : start();
      }
      
      // R - reset timer
      if (e.code === 'KeyR' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        reset();
      }
      
      // 1 - work mode
      if (e.code === 'Digit1' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        changeMode('work');
      }
      
      // 2 - short break
      if (e.code === 'Digit2' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        changeMode('shortBreak');
      }
      
      // 3 - long break
      if (e.code === 'Digit3' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        changeMode('longBreak');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, start, pause, reset, changeMode]);

  // Handle ticking sound
  useEffect(() => {
    if (isActive && settings.enableTickingSound && settings.tickingSound !== 'none') {
      startTickingSound(settings.tickingSound, settings.volume * 0.3);
    } else {
      stopTickingSound();
    }
    
    return () => stopTickingSound();
  }, [isActive, settings.enableTickingSound, settings.tickingSound, settings.volume]);

  // Initialize audio on component mount to prepare for user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      initAudio();
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
    
    window.addEventListener('mousedown', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Get background color based on current mode
  const getBackgroundColor = (): string => {
    switch (mode) {
      case 'work':
        return 'bg-primary-100';
      case 'shortBreak':
        return 'bg-secondary-100';
      case 'longBreak':
        return 'bg-accent-100';
      default:
        return 'bg-primary-100';
    }
  };

  // Get accent color based on current mode
  const getAccentColor = (): string => {
    switch (mode) {
      case 'work':
        return 'var(--color-primary)';
      case 'shortBreak':
        return 'var(--color-secondary)';
      case 'longBreak':
        return 'var(--color-accent)';
      default:
        return 'var(--color-primary)';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-xl ${getBackgroundColor()} transition-colors duration-500`}>
      {/* Mode tabs */}
      <div className="flex space-x-2 mb-8">
        <button
          onClick={() => changeMode('work')}
          className={`flex items-center px-4 py-2 rounded-full transition-all ${
            mode === 'work' 
              ? 'bg-primary text-white font-medium shadow-md' 
              : 'bg-white/50 hover:bg-white/80'
          }`}
        >
          <Brain size={18} className="mr-2" />
          Focus
        </button>
        <button
          onClick={() => changeMode('shortBreak')}
          className={`flex items-center px-4 py-2 rounded-full transition-all ${
            mode === 'shortBreak' 
              ? 'bg-secondary text-white font-medium shadow-md' 
              : 'bg-white/50 hover:bg-white/80'
          }`}
        >
          <Coffee size={18} className="mr-2" />
          Short Break
        </button>
        <button
          onClick={() => changeMode('longBreak')}
          className={`flex items-center px-4 py-2 rounded-full transition-all ${
            mode === 'longBreak' 
              ? 'bg-accent text-white font-medium shadow-md' 
              : 'bg-white/50 hover:bg-white/80'
          }`}
        >
          <Coffee size={18} className="mr-2" />
          Long Break
        </button>
      </div>
      
      {/* Timer circle */}
      <div className="relative flex items-center justify-center w-64 h-64 mb-8">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="white"
            className="opacity-90"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={getAccentColor()}
            strokeWidth="3"
            strokeDasharray={`${Math.PI * 84 * progress / 100} ${Math.PI * 84 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
            transform="rotate(-90 50 50)"
          />
        </svg>
        
        {/* Time display */}
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-bold" style={{ color: getAccentColor() }}>
            {formattedTime}
          </span>
          <span className="text-sm mt-2 capitalize opacity-80">
            {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex space-x-4">
        {!isActive ? (
          <button
            onClick={start}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            aria-label="Start Timer"
          >
            <Play size={24} style={{ color: getAccentColor() }} />
          </button>
        ) : (
          <button
            onClick={pause}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            aria-label="Pause Timer"
          >
            <Pause size={24} style={{ color: getAccentColor() }} />
          </button>
        )}
        
        <button
          onClick={reset}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          aria-label="Reset Timer"
        >
          <RefreshCw size={22} style={{ color: getAccentColor() }} />
        </button>
      </div>
      
      {/* Session counter */}
      {mode === 'work' && (
        <div className="mt-6 flex items-center">
          <span className="mr-2 text-sm opacity-80">Sessions completed:</span>
          <div className="flex space-x-1">
            {Array.from({ length: settings.sessionsUntilLongBreak }).map((_, i) => (
              <div 
                key={i}
                className={`w-3 h-3 rounded-full ${i < workSessionsCompleted % settings.sessionsUntilLongBreak ? 'bg-primary' : 'bg-white/50'} transition-colors`}
              >
                {i < workSessionsCompleted % settings.sessionsUntilLongBreak && (
                  <Check size={12} className="text-white" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Keyboard shortcuts help */}
      <div className="mt-6 text-xs opacity-70 text-center">
        <p>Shortcuts: Space (start/pause), R (reset), 1/2/3 (change mode)</p>
      </div>
    </div>
  );
};

export default Timer;