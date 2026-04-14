import { format, parseISO } from "date-fns";
import { User, Video, Calendar, Clock } from "lucide-react";

export default function MeetingCard({ meeting, onCancel, isPast }) {
  const startDate = parseISO(meeting.start_time);
  const endDate = parseISO(meeting.end_time);

  return (
    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="md:w-32">
          <p className="text-sm font-bold text-gray-800">{format(startDate, 'h:mm a')}</p>
          <p className="text-xs text-gray-500">{format(startDate, 'E, MMM d')}</p>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
             <div className={`w-2 h-2 rounded-full ${meeting.status === 'cancelled' ? 'bg-red-500' : 'bg-calendly'}`} />
             <h3 className="font-semibold text-gray-800">{meeting.event_title}</h3>
             {meeting.status === 'cancelled' && (
               <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase font-bold">Cancelled</span>
             )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-1">
               <User className="w-4 h-4" /> {meeting.invitee_name}
            </div>
            <div className="hidden md:flex items-center gap-1">
               <Video className="w-4 h-4" /> Web conferencing
            </div>
          </div>
          {meeting.notes && (
             <p className="text-sm text-gray-500 mt-2">Note: {meeting.notes}</p>
          )}
        </div>
      </div>

      {!isPast && meeting.status !== 'cancelled' && (
        <div className="mt-4 md:mt-0">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-red-200 text-red-600 rounded text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
