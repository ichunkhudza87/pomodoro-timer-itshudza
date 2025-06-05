import { useState, useEffect } from 'react';

export interface TimerSettings {
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  sessionsUntilLongBreak: number;
  autoStartNextSession: boolean;
  alarmSound: string;
  tickingSound: string;
  enableTickingSound: boolean;
  volume: number;
}

const defaultSettings: TimerSettings = {
  workTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  sessionsUntilLongBreak: 4,
  autoStartNextSession: false,
  alarmSound: 'bell',
  tickingSound: 'none',
  enableTickingSound: false,
  volume: 0.6,
};

export const soundOptions = [
  { id: 'bell', name: 'Bell' },
  { id: 'digital', name: 'Digital' },
  { id: 'analog', name: 'Analog' },
  { id: 'calm', name: 'Calm' },
  { id: 'none', name: 'None' },
];

export const tickingSoundOptions = [
  { id: 'none', name: 'None' },
  { id: 'soft', name: 'Soft Ticking' },
  { id: 'clock', name: 'Clock' },
];

export const useSettings = () => {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const savedSettings = localStorage.getItem('pomodoro-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
  }, [settings]);
  
  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };
  
  const resetSettings = () => {
    setSettings(defaultSettings);
  };
  
  return {
    settings,
    updateSettings,
    resetSettings,
  };
};