interface SelectedDateSummaryProps {
  selectedDate: string | null;
  language: "en" | "ka";
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

const GEORGIAN_WEEKDAYS = [
  "კვირა",
  "ორშაბათი",
  "სამშაბათი",
  "ოთხშაბათი",
  "ხუთშაბათი",
  "პარასკევი",
  "შაბათი",
];

const ENGLISH_MONTHS = [
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

const ENGLISH_WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function SelectedDateSummary({
  selectedDate,
  language,
}: SelectedDateSummaryProps) {
  if (!selectedDate) {
    return null;
  }

  const date = new Date(selectedDate + "T00:00:00Z");
  const dayOfWeek = date.getUTCDay();
  const dayOfMonth = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  const monthName =
    language === "ka" ? GEORGIAN_MONTHS[month] : ENGLISH_MONTHS[month];
  const weekdayName =
    language === "ka" ? GEORGIAN_WEEKDAYS[dayOfWeek] : ENGLISH_WEEKDAYS[dayOfWeek];

  const formattedDate =
    language === "ka"
      ? `${dayOfMonth} ${monthName}, ${year}`
      : `${monthName} ${dayOfMonth}, ${year}`;

  return (
    <div className="p-4 bg-[#FFF8F5] rounded-lg border border-[#E8E3DC]">
      <p className="text-xs font-medium text-[#8B7B6F] mb-1">
        {language === "ka" ? "არჩეული თარიღი" : "Selected Date"}
      </p>
      <p className="text-sm font-semibold text-[#1C1C1C]">{formattedDate}</p>
      <p className="text-xs text-[#8B7B6F] mt-1">{weekdayName}</p>
    </div>
  );
}
