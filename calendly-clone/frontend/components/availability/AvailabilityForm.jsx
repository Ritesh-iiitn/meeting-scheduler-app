"use client";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AvailabilityForm({ availability, handleToggle, handleTimeChange, handleSave, saving }) {
  return (
    <div className="bg-white border text-gray-600 border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">Weekly hours</h2>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {availability.map((day) => (
            <div key={day.day_of_week} className="flex items-center gap-4">
              <div className="w-32 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={day.is_available} 
                  onChange={() => handleToggle(day.day_of_week)}
                  className="w-5 h-5 rounded border-gray-300 text-calendly focus:ring-calendly"
                />
                <span className={`font-medium ${day.is_available ? 'text-gray-800' : 'text-gray-400'}`}>
                  {DAYS[day.day_of_week].substring(0, 3)}
                </span>
              </div>
              
              {day.is_available ? (
                <div className="flex items-center gap-3">
                  <input 
                    type="time" 
                    value={day.start_time.substring(0, 5)} 
                    onChange={(e) => handleTimeChange(day.day_of_week, 'start_time', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-calendly"
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="time" 
                    value={day.end_time.substring(0, 5)} 
                    onChange={(e) => handleTimeChange(day.day_of_week, 'end_time', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-calendly"
                  />
                </div>
              ) : (
                <div className="text-gray-400 flex-1">Unavailable</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="px-6 py-2 bg-calendly text-white rounded-full font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
