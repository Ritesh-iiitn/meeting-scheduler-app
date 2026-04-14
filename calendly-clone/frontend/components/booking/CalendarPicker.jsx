import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";

export default function CalendarPicker({ selectedDate, onDateSelect }) {
  const tileDisabled = ({ date }) => {
    // Disable past dates
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  return (
    <div className="flex-1">
      <Calendar 
        onChange={onDateSelect} 
        value={selectedDate} 
        tileDisabled={tileDisabled}
        minDetail="month"
        className="border-none w-full !font-sans"
      />
      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        .react-calendar__navigation button {
          font-weight: bold;
          font-size: 1.1rem;
        }
        .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75rem;
          color: #666;
          text-decoration: none;
        }
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }
        .react-calendar__tile {
          padding: 1em 0.5em;
          border-radius: 50%;
          font-weight: 500;
        }
        .react-calendar__tile--active {
          background: #006BFF !important;
          color: white;
        }
        .react-calendar__tile:hover:not(.react-calendar__tile--disabled) {
          background: #e6f0ff !important;
          color: #006BFF;
        }
      `}</style>
    </div>
  );
}
