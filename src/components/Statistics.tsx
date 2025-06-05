import React, { useState } from 'react';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { useStatistics } from '../hooks/useStatistics';

const Statistics: React.FC = () => {
  const { getTotalWorkTime, getTotalSessions, getDailyStats, clearStatistics } = useStatistics();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  const totalSessions = getTotalSessions();
  const totalWorkMinutes = getTotalWorkTime();
  const dailyStats = getDailyStats();
  
  const handleClearStats = () => {
    setShowConfirmClear(true);
  };
  
  const confirmClear = () => {
    clearStatistics();
    setShowConfirmClear(false);
  };
  
  const cancelClear = () => {
    setShowConfirmClear(false);
  };
  
  // Find the max value for scaling the chart
  const maxMinutes = Math.max(...dailyStats.map(day => day.minutes), 60);
  
  // Format date to display in a readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="bg-surface rounded-xl shadow-md p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-text">Statistics</h2>
        
        {!showConfirmClear ? (
          <button
            onClick={handleClearStats}
            className="flex items-center text-sm text-red-500 hover:text-red-600 transition-colors"
            disabled={totalSessions === 0}
          >
            <Trash2 size={16} className="mr-1" />
            Clear Data
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={cancelClear}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={confirmClear}
              className="text-sm font-medium text-red-500 hover:text-red-600"
            >
              Confirm
            </button>
          </div>
        )}
      </div>
      
      {totalSessions === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No data yet</p>
          <p className="text-sm text-gray-400">Complete your first focus session to see statistics</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="flex items-center text-primary mb-1">
                <Clock size={20} className="mr-1" />
                <span className="font-medium">Total Focus Time</span>
              </div>
              <p className="text-2xl font-bold text-text">
                {totalWorkMinutes} min
              </p>
            </div>
            
            <div className="bg-secondary/10 rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="flex items-center text-secondary mb-1">
                <Calendar size={20} className="mr-1" />
                <span className="font-medium">Focus Sessions</span>
              </div>
              <p className="text-2xl font-bold text-text">
                {totalSessions}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-text">Last 7 Days</h3>
            
            <div className="space-y-3">
              {dailyStats.map((day) => (
                <div key={day.date} className="flex items-center">
                  <div className="w-28 text-sm text-text">
                    {formatDate(day.date)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div 
                        className="h-6 bg-primary/80 rounded transition-all duration-500 ease-out"
                        style={{ 
                          width: `${(day.minutes / maxMinutes) * 100}%`,
                          minWidth: day.minutes > 0 ? '8px' : '0',
                        }}
                      ></div>
                      <span className="ml-2 text-sm text-text">
                        {day.minutes > 0 ? `${day.minutes} min` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;