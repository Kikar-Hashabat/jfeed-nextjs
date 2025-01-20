"use client";
// app/archive/ClientArchiveCalendar.tsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ClientArchiveCalendarProps {
  currentYear: number;
  currentMonth: number;
  currentDay: number;
}

const ClientArchiveCalendar: React.FC<ClientArchiveCalendarProps> = ({
  currentYear,
  currentMonth,
  currentDay,
}) => {
  const router = useRouter();
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
  }, [currentYear, currentMonth]);

  // Generate year options from 2019 to current year
  const years = Array.from(
    { length: today.getFullYear() - 2018 },
    (_, i) => today.getFullYear() - i
  );

  // Generate calendar days for selected month
  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDay = date.getDay();

    // Add empty cells for days before first of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = getDaysInMonth(selectedYear, selectedMonth);

  const handleDateSelect = (day: number) => {
    router.push(
      `/archive?year=${selectedYear}&month=${selectedMonth + 1}&day=${day}`
    );
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="p-2 border rounded"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">{monthNames[selectedMonth]}</span>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="font-medium text-gray-500">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <div
              key={index}
              onClick={() => day && handleDateSelect(day)}
              className={`
                p-2 rounded cursor-pointer
                ${day ? "hover:bg-blue-50" : ""}
                ${
                  day === currentDay &&
                  selectedMonth === currentMonth &&
                  selectedYear === currentYear
                    ? "bg-blue-100 text-blue-600"
                    : day
                    ? "text-gray-700"
                    : ""
                }
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-50 text-sm text-gray-500">
        Selected: {monthNames[selectedMonth]} {selectedYear}
      </div>
    </div>
  );
};

export default ClientArchiveCalendar;
