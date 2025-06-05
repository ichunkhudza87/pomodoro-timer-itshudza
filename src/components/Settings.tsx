import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Volume2, Volume1, VolumeX } from 'lucide-react';
import { useSettings, soundOptions, tickingSoundOptions } from '../hooks/useSettings';
import { useTheme } from '../context/ThemeContext';
import { playSound } from '../utils/audio';

const fontOptions = [
  { id: 'Inter, system-ui, sans-serif', name: 'Inter' },
  { id: 'ui-monospace, SFMono-Regular, Menlo, monospace', name: 'Monospace' },
  { id: 'ui-serif, Georgia, Cambria, serif', name: 'Serif' },
  { id: 'ui-rounded, system-ui, sans-serif', name: 'Rounded' },
];

const Settings: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { colors, font, setTheme, resetTheme } = useTheme();
  
  const [formState, setFormState] = useState({
    ...settings,
  });
  
  const [themeState, setThemeState] = useState({
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    font: font,
  });

  // Update form state when settings change
  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  // Update theme state when colors change
  useEffect(() => {
    setThemeState({
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: colors.background,
      surface: colors.surface,
      text: colors.text,
      font: font,
    });
  }, [colors, font]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setThemeState(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Apply theme change immediately for live preview
    if (name === 'font') {
      setTheme({}, value);
    } else {
      setTheme({ [name]: value });
    }
  };
  
  const handleResetSettings = () => {
    resetSettings();
    setFormState(settings);
  };
  
  const handleResetTheme = () => {
    resetTheme();
    setThemeState({
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: colors.background,
      surface: colors.surface,
      text: colors.text,
      font: font,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
  };
  
  const handleTestSound = async () => {
    await playSound(formState.alarmSound, formState.volume);
  };
  
  const renderVolumeIcon = () => {
    if (formState.volume === 0) {
      return <VolumeX size={18} />;
    } else if (formState.volume < 0.5) {
      return <Volume1 size={18} />;
    } else {
      return <Volume2 size={18} />;
    }
  };
  
  return (
    <div className="bg-surface rounded-xl shadow-md p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-6 text-text">Settings</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-text">Timer</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="workTime" className="block text-sm font-medium mb-1 text-text">
                Focus Time (minutes)
              </label>
              <input
                type="number"
                id="workTime"
                name="workTime"
                min="1"
                max="60"
                value={formState.workTime}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-background text-text"
              />
            </div>
            
            <div>
              <label htmlFor="shortBreakTime" className="block text-sm font-medium mb-1 text-text">
                Short Break (minutes)
              </label>
              <input
                type="number"
                id="shortBreakTime"
                name="shortBreakTime"
                min="1"
                max="30"
                value={formState.shortBreakTime}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-background text-text"
              />
            </div>
            
            <div>
              <label htmlFor="longBreakTime" className="block text-sm font-medium mb-1 text-text">
                Long Break (minutes)
              </label>
              <input
                type="number"
                id="longBreakTime"
                name="longBreakTime"
                min="1"
                max="60"
                value={formState.longBreakTime}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-background text-text"
              />
            </div>
            
            <div>
              <label htmlFor="sessionsUntilLongBreak" className="block text-sm font-medium mb-1 text-text">
                Sessions until Long Break
              </label>
              <input
                type="number"
                id="sessionsUntilLongBreak"
                name="sessionsUntilLongBreak"
                min="1"
                max="10"
                value={formState.sessionsUntilLongBreak}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-background text-text"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoStartNextSession"
              name="autoStartNextSession"
              checked={formState.autoStartNextSession}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary rounded"
            />
            <label htmlFor="autoStartNextSession" className="ml-2 block text-sm text-text">
              Auto-start next session
            </label>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="alarmSound" className="block text-sm font-medium text-text">
                Alarm Sound
              </label>
              <button
                type="button"
                onClick={handleTestSound}
                className="text-xs text-primary hover:text-primary/80"
              >
                Test
              </button>
            </div>
            <select
              id="alarmSound"
              name="alarmSound"
              value={formState.alarmSound}
              onChange={handleSelectChange}
              className="w-full p-2 border rounded bg-background text-text"
            >
              {soundOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="tickingSound" className="block text-sm font-medium mb-1 text-text">
              Ticking Sound
            </label>
            <select
              id="tickingSound"
              name="tickingSound"
              value={formState.tickingSound}
              onChange={handleSelectChange}
              className="w-full p-2 border rounded bg-background text-text"
            >
              {tickingSoundOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="enableTickingSound"
              name="enableTickingSound"
              checked={formState.enableTickingSound}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary rounded"
            />
            <label htmlFor="enableTickingSound" className="ml-2 block text-sm text-text">
              Enable ticking sound during focus
            </label>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="volume" className="block text-sm font-medium text-text">
                Volume
              </label>
              <span className="text-sm text-text/70">
                {Math.round(formState.volume * 100)}%
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">{renderVolumeIcon()}</span>
              <input
                type="range"
                id="volume"
                name="volume"
                min="0"
                max="1"
                step="0.1"
                value={formState.volume}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={handleResetSettings}
              className="flex items-center px-3 py-1.5 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              <RotateCcw size={16} className="mr-1" />
              Reset
            </button>
            
            <button
              type="submit"
              className="flex items-center px-4 py-1.5 rounded bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <Save size={16} className="mr-1" />
              Save
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4 text-text">Theme</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="primary" className="block text-sm font-medium mb-1 text-text">
                Primary Color
              </label>
              <input
                type="color"
                id="primary"
                name="primary"
                value={themeState.primary}
                onChange={handleThemeChange}
                className="w-full h-8 rounded"
              />
            </div>
            
            <div>
              <label htmlFor="secondary" className="block text-sm font-medium mb-1 text-text">
                Secondary Color
              </label>
              <input
                type="color"
                id="secondary"
                name="secondary"
                value={themeState.secondary}
                onChange={handleThemeChange}
                className="w-full h-8 rounded"
              />
            </div>
            
            <div>
              <label htmlFor="accent" className="block text-sm font-medium mb-1 text-text">
                Accent Color
              </label>
              <input
                type="color"
                id="accent"
                name="accent"
                value={themeState.accent}
                onChange={handleThemeChange}
                className="w-full h-8 rounded"
              />
            </div>
            
            <div>
              <label htmlFor="background" className="block text-sm font-medium mb-1 text-text">
                Background Color
              </label>
              <input
                type="color"
                id="background"
                name="background"
                value={themeState.background}
                onChange={handleThemeChange}
                className="w-full h-8 rounded"
              />
            </div>
            
            <div>
              <label htmlFor="surface" className="block text-sm font-medium mb-1 text-text">
                Surface Color
              </label>
              <input
                type="color"
                id="surface"
                name="surface"
                value={themeState.surface}
                onChange={handleThemeChange}
                className="w-full h-8 rounded"
              />
            </div>
            
            <div>
              <label htmlFor="text" className="block text-sm font-medium mb-1 text-text">
                Text Color
              </label>
              <input
                type="color"
                id="text"
                name="text"
                value={themeState.text}
                onChange={handleThemeChange}
                className="w-full h-8 rounded"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="font" className="block text-sm font-medium mb-1 text-text">
              Font
            </label>
            <select
              id="font"
              name="font"
              value={themeState.font}
              onChange={handleThemeChange}
              className="w-full p-2 border rounded bg-background text-text"
            >
              {fontOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-start pt-2">
            <button
              type="button"
              onClick={handleResetTheme}
              className="flex items-center px-3 py-1.5 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              <RotateCcw size={16} className="mr-1" />
              Reset Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;