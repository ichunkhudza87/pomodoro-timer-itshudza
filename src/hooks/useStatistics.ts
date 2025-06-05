import { useState, useEffect } from 'react';
import { TimerMode } from './useTimer';

export interface SessionData {
  date: string;
  duration: number;
  mode: TimerMode;
}

export const useStatistics = () => {
  const [sessions, setSessions] = useState<SessionData[]>(() => {
    const savedSessions = localStorage.getItem('pomodoro-sessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });

  useEffect(() => {
    localStorage.setItem('pomodoro-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const addCompletedSession = (session: SessionData) => {
    setSessions(prev => [...prev, session]);
  };

  const clearStatistics = () => {
    setSessions([]);
  };

  // Get total work time in minutes
  const getTotalWorkTime = (): number => {
    return Math.round(
      sessions
        .filter(session => session.mode === 'work')
        .reduce((total, session) => total + session.duration, 0) / 60
    );
  };

  // Get total sessions count
  const getTotalSessions = (): number => {
    return sessions.filter(session => session.mode === 'work').length;
  };

  // Get sessions for the last 7 days
  const getRecentSessions = (): SessionData[] => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= sevenDaysAgo;
    });
  };

  // Get sessions grouped by day for the last 7 days
  const getDailyStats = () => {
    const recentSessions = getRecentSessions();
    const dailyStats: Record<string, { count: number, minutes: number }> = {};
    
    // Initialize with last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dailyStats[dateString] = { count: 0, minutes: 0 };
    }
    
    // Fill with actual data
    recentSessions.forEach(session => {
      if (session.mode === 'work') {
        const dateString = session.date.split('T')[0];
        if (dailyStats[dateString]) {
          dailyStats[dateString].count += 1;
          dailyStats[dateString].minutes += Math.round(session.duration / 60);
        }
      }
    });
    
    return Object.entries(dailyStats)
      .map(([date, stats]) => ({
        date,
        ...stats,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  return {
    sessions,
    addCompletedSession,
    clearStatistics,
    getTotalWorkTime,
    getTotalSessions,
    getRecentSessions,
    getDailyStats,
  };
};