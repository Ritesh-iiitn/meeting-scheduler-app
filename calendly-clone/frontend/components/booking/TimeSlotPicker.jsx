import { format } from "date-fns";

export default function TimeSlotPicker({ 
  selectedDate, 
  availableSlots, 
  slotsLoading, 
  selectedSlot, 
  setSelectedSlot, 
  onNext 
}) {
  return (
    <div className="w-full md:w-48 overflow-y-auto max-h-[400px] pr-2">
      {selectedDate && (
        <div className="mb-4 text-center font-medium text-gray-800">
          {format(selectedDate, 'EEEE, MMM d')}
        </div>
      )}

      {slotsLoading ? (
        <div className="text-center text-gray-500 py-4">Loading slots...</div>
      ) : selectedDate && availableSlots.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No slots available</div>
      ) : (
        <div className="flex flex-col gap-2">
           {availableSlots.map((slot, idx) => (
             <div key={idx} className="flex gap-2">
               <button
                 onClick={() => setSelectedSlot(slot)}
                 className={`flex-1 py-3 border ${selectedSlot?.datetime === slot.datetime ? 'bg-gray-800 text-white border-gray-800' : 'border-calendly text-calendly hover:border-blue-700 font-medium'} rounded-md transition-colors`}
               >
                 {slot.time}
               </button>
               {selectedSlot?.datetime === slot.datetime && (
                 <button
                   onClick={onNext}
                   className="px-4 bg-calendly text-white font-medium rounded-md hover:bg-blue-700 animate-in slide-in-from-right-2"
                 >
                   Next
                 </button>
               )}
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
