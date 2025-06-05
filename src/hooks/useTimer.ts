import { useState, useEffect, useRef, useCallback } from 'react';
import { useStatistics } from './useStatistics';
import { useSettings } from './useSettings';
import { playSound } from '../utils/audio';

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export const useTimer = () => {
  const { settings } = useSettings();
  const { addCompletedSession } = useStatistics();
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [workSessionsCompleted, setWorkSessionsCompleted] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const sessionDurationRef = useRef<number>(0);

  // Initialize timer with current settings
  useEffect(() => {
    if (!isActive) {
      if (mode === 'work') {
        setTimeLeft(settings.workTime * 60);
      } else if (mode === 'shortBreak') {
        setTimeLeft(settings.shortBreakTime * 60);
      } else {
        setTimeLeft(settings.longBreakTime * 60);
      }
    }
  }, [settings, mode, isActive]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const start = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      startTimeRef.current = Date.now();
      sessionDurationRef.current = 0;
      
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          sessionDurationRef.current += 1;
          return prev - 1;
        });
      }, 1000);
    }
  }, [isActive]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    pause();
    if (mode === 'work') {
      setTimeLeft(settings.workTime * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(settings.shortBreakTime * 60);
    } else {
      setTimeLeft(settings.longBreakTime * 60);
    }
    sessionDurationRef.current = 0;
  }, [mode, settings, pause]);

  const changeMode = useCallback((newMode: TimerMode) => {
    pause();
    setMode(newMode);
    if (newMode === 'work') {
      setTimeLeft(settings.workTime * 60);
    } else if (newMode === 'shortBreak') {
      setTimeLeft(settings.shortBreakTime * 60);
    } else {
      setTimeLeft(settings.longBreakTime * 60);
    }
    sessionDurationRef.current = 0;
  }, [settings, pause]);

  const handleTimerComplete = useCallback(() => {
    pause();
    
    // Play notification sound
    playSound(settings.alarmSound, settings.volume);
    
    // Log completed session
    addCompletedSession({
      date: new Date().toISOString(),
      duration: sessionDurationRef.current,
      mode: mode,
    });
    
    if (mode === 'work') {
      // Update work sessions count
      const newWorkSessionsCompleted = workSessionsCompleted + 1;
      setWorkSessionsCompleted(newWorkSessionsCompleted);
      
      // Determine next break type
      if (newWorkSessionsCompleted % settings.sessionsUntilLongBreak === 0) {
        changeMode('longBreak');
      } else {
        changeMode('shortBreak');
      }
    } else {
      // Return to work mode after break
      changeMode('work');
    }
    
    // Auto-start next session if enabled
    if (settings.autoStartNextSession) {
      setTimeout(() => start(), 1000);
    }
  }, [mode, workSessionsCompleted, settings, changeMode, start, addCompletedSession]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Calculate progress percentage
  const getProgress = useCallback((): number => {
    let totalSeconds;
    if (mode === 'work') {
      totalSeconds = settings.workTime * 60;
    } else if (mode === 'shortBreak') {
      totalSeconds = settings.shortBreakTime * 60;
    } else {
      totalSeconds = settings.longBreakTime * 60;
    }
    
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  }, [mode, timeLeft, settings]);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isActive,
    mode,
    workSessionsCompleted,
    progress: getProgress(),
    start,
    pause,
    reset,
    changeMode,
  };
};