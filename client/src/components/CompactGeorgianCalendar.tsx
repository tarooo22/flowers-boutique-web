import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompactGeorgianCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  minDate?: string;
}

const GEORGIAN_MONTHS = [
  "იანვარი",
  "თებერვალი",
  "მარტი",
  "აპრილი",
  "მაისი",
  "ივნისი",
  "ივლისი",
  "აგვისტო",
  "სექტემბერი",
  "ოქტომბერი",
  "ნოემბერი",
  "დეკემბერი",
];

const GEORGIAN_WEEKDAYS = ["ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვ"];

// Helper to convert Date to YYYY-MM-DD string in local timezone
function dateToLocalString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function CompactGeorgianCalendar({
  selectedDate,
  onSelectDate,
  minDate,
}: CompactGeorgianCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayStr = dateToLocalString(today);
  const minDateStr = minDate || todayStr;

  const [currentMonth, setCurrentMonth] = useState(today);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    return (first.getDay() + 6) % 7;
  };

  const calendarDays = useMemo(() => {
    const days = [];
    const firstDay = firstDayOfMonth(currentMonth);
    const totalDays = daysInMonth(currentMonth);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    return days;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleSelectDay = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const selectedStr = dateToLocalString(selected);

    // Check if date is before min date
    if (selectedStr < minDateStr) return;

    onSelectDate(selectedStr);
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = dateToLocalString(date);
    return dateStr < minDateStr;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = dateToLocalString(date);
    return dateStr === selectedDate;
  };

  const isDateToday = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = dateToLocalString(date);
    return dateStr === todayStr;
  };

  const monthYear = `${GEORGIAN_MONTHS[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  return (
    <div className="w-full max-w-sm">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-[#FFF8F5] rounded transition"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-[#C4603A]" />
        </button>
        <h3 className="text-sm font-semibold text-[#1C1C1C] min-w-[120px] text-center">
          {monthYear}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-[#FFF8F5] rounded transition"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-[#C4603A]" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {GEORGIAN_WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-[#8B7B6F] py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div key={index} className="aspect-square">
            {day === null ? (
              <div />
            ) : (
              <button
                onClick={() => handleSelectDay(day)}
                disabled={isDateDisabled(day)}
                className={`w-full h-full text-sm font-medium rounded transition flex items-center justify-center ${
                  isDateSelected(day)
                    ? "bg-[#C4603A] text-white"
                    : isDateToday(day)
                      ? "border-2 border-[#C4603A] text-[#1C1C1C] hover:bg-[#FFF8F5]"
                      : isDateDisabled(day)
                        ? "text-[#D4C4B8] cursor-not-allowed"
                        : "text-[#1C1C1C] hover:bg-[#FFF8F5]"
                }`}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
