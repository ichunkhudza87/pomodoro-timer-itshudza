import React, { useState } from 'react';
import { Timer, Settings, BarChart, Sun, Moon } from 'lucide-react';
import TimerComponent from './components/Timer';
import SettingsComponent from './components/Settings';
import StatisticsComponent from './components/Statistics';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Wrapper for the whole application
const AppWithTheme: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

// App content with theme context available
const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timer' | 'settings' | 'statistics'>('timer');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { colors, setTheme } = useTheme();
  
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      // Switch to dark mode
      setTheme({
        background: '#0f172a', // slate-900
        surface: '#1e293b',    // slate-800
        text: '#e2e8f0',       // slate-200
      });
    } else {
      // Switch to light mode
      setTheme({
        background: '#f8fafc', // slate-50
        surface: '#ffffff',    // white
        text: '#334155',       // slate-700
      });
    }
  };
  
  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ 
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: 'var(--font-main)',
      }}
    >
      <div className="flex flex-col items-center mx-auto py-8 px-4 max-w-5xl">
        {/* Header */}
        <header className="w-full flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Timer className="text-primary mr-2" size={28} />
            <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface hover:bg-opacity-80 transition-colors"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>
        
        {/* Main content */}
        <main className="w-full flex flex-col md:flex-row gap-6">
          {/* Left column (timer) */}
          <div className="w-full md:w-7/12">
            <TimerComponent />
          </div>
          
          {/* Right column (settings/statistics) */}
          <div className="w-full md:w-5/12">
            {/* Tabs */}
            <div className="flex mb-4 bg-surface rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center justify-center flex-1 py-2 rounded ${
                  activeTab === 'settings' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-primary/10 transition-colors'
                }`}
              >
                <Settings size={18} className="mr-2" />
                Settings
              </button>
              
              <button
                onClick={() => setActiveTab('statistics')}
                className={`flex items-center justify-center flex-1 py-2 rounded ${
                  activeTab === 'statistics' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-primary/10 transition-colors'
                }`}
              >
                <BarChart size={18} className="mr-2" />
                Statistics
              </button>
            </div>
            
            {/* Tab content */}
            {activeTab === 'settings' && <SettingsComponent />}
            {activeTab === 'statistics' && <StatisticsComponent />}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="mt-12 text-center text-sm opacity-70">
          <p>Pomodoro Timer App © 2025</p>
          <p className="mt-1">Built with React and Tailwind CSS</p>
          <p className="mt-1 text-xs">Created by Ithudza</p>
        </footer>
      </div>
    </div>
  );
};

export default AppWithTheme;