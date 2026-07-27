import { useMemo } from "react";
import { Button } from "@/components/ui/button";

interface TimeSlot {
  id: string;
  label: string;
  startHour: number;
  endHour: number;
}

interface DeliveryTimeSlotsProps {
  selectedDate: string;
  selectedTime: string | null;
  onSelectTime: (timeId: string) => void;
  language: "en" | "ka";
}

const TIME_SLOTS: TimeSlot[] = [
  { id: "anytime", label: "ნებისმიერ დროს", startHour: 11, endHour: 21 },
  { id: "11-14", label: "11:00–14:00", startHour: 11, endHour: 14 },
  { id: "14-17", label: "14:00–17:00", startHour: 14, endHour: 17 },
  { id: "17-21", label: "17:00–21:00", startHour: 17, endHour: 21 },
];

const TIME_SLOTS_EN: TimeSlot[] = [
  { id: "anytime", label: "Any time", startHour: 11, endHour: 21 },
  { id: "11-14", label: "11:00–14:00", startHour: 11, endHour: 14 },
  { id: "14-17", label: "14:00–17:00", startHour: 14, endHour: 17 },
  { id: "17-21", label: "17:00–21:00", startHour: 17, endHour: 21 },
];

export function DeliveryTimeSlots({
  selectedDate,
  selectedTime,
  onSelectTime,
  language,
}: DeliveryTimeSlotsProps) {
  const slots = language === "ka" ? TIME_SLOTS : TIME_SLOTS_EN;

  const availableSlots = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const isToday = selectedDate === today;

    if (!isToday) {
      // For future dates, all slots are available
      return slots;
    }

    // For today, filter based on current time in Asia/Tbilisi timezone
    const tbilisiTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Tbilisi",
    });
    const currentHour = new Date(tbilisiTime).getHours();

    // Filter slots where end time hasn't passed
    return slots.filter((slot) => {
      if (slot.id === "anytime") {
        // Show "anytime" only if at least one specific slot is available
        return slots.some(
          (s) => s.id !== "anytime" && s.endHour > currentHour
        );
      }
      return slot.endHour > currentHour;
    });
  }, [selectedDate, slots]);

  if (availableSlots.length === 0) {
    return (
      <div className="p-4 bg-[#FFF8F5] rounded-lg border border-[#E8E3DC]">
        <p className="text-sm text-[#8B7B6F]">
          {language === "ka"
            ? "დღევანდელი მიწოდების დრო აღარ არის ხელმისაწვდომი. აირჩიეთ შემდეგი დღე."
            : "No delivery time available for today. Please select another date."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[#1C1C1C]">
        {language === "ka" ? "მიწოდების დრო" : "Delivery Time"}
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-2">
        {availableSlots.map((slot) => (
          <Button
            key={slot.id}
            onClick={() => onSelectTime(slot.id)}
            variant={selectedTime === slot.id ? "default" : "outline"}
            className={`h-11 text-sm font-medium transition-all ${
              selectedTime === slot.id
                ? "bg-[#C4603A] text-white border-[#C4603A] hover:bg-[#B84D2E]"
                : "border-[#E8E3DC] text-[#1C1C1C] hover:bg-[#FFF8F5]"
            }`}
          >
            {slot.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
