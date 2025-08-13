import React, { useState } from 'react';

interface CalendarProps {
  onDateSelect: (date: string, displayDate: string) => void;
  selectedDate?: string;
  onClose: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate, onClose }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    selectedDate ? new Date(selectedDate.split('.').reverse().join('-')) : today
  );

  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
  ];

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateClick = (date: Date | null) => {
    if (date) {
      const now = new Date()
      const finalDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
     );
      const isoDateTime = finalDateTime.toISOString();
      
      const displayDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`
      onDateSelect(isoDateTime, displayDate);
      onClose();
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToPreviousYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth()));
  };

  const goToNextYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth()));
  };

  const days = getDaysInMonth(currentDate);
  
  const isToday = (date: Date | null): boolean => {
    return date !== null && 
           date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date | null): boolean => {
    if (!date || !selectedDate) return false;
    const selected = new Date(selectedDate.split('.').reverse().join('-'));
    return date.getDate() === selected.getDate() && 
           date.getMonth() === selected.getMonth() && 
           date.getFullYear() === selected.getFullYear();
  };

  return (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousYear}
          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-lg font-semibold">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goToNextYear}
          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleDateClick(date)}
            disabled={!date}
            className={`p-2 text-center text-sm rounded hover:bg-blue-100 cursor-pointer ${
              !date
                ? "invisible"
                : isSelected(date)
                ? "bg-blue-600 text-white"
                : isToday(date)
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
          >
            {date ? date.getDate() : ""}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;