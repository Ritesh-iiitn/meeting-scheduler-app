"use client";

import { useEffect, useState } from "react";
import { getUpcomingBookings, getPastBookings, cancelBooking } from "@/lib/api";
import { toast } from "react-hot-toast";
import MeetingCard from "@/components/meetings/MeetingCard";

export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = activeTab === 'upcoming' ? await getUpcomingBookings() : await getPastBookings();
      setMeetings(res.data);
    } catch (error) {
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [activeTab]);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this meeting?")) return;
    try {
      await cancelBooking(id);
      toast.success("Meeting cancelled");
      fetchMeetings();
    } catch (error) {
      toast.error("Failed to cancel meeting");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Scheduled Events</h1>
        <p className="text-slate-500 font-medium mt-1">Review your upcoming and past bookings</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            className={`px-8 py-4 font-semibold text-sm transition-colors ${activeTab === 'upcoming' ? 'text-blue-700 bg-white border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`px-8 py-4 font-semibold text-sm transition-colors ${activeTab === 'past' ? 'text-blue-700 bg-white border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : meetings.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-gray-500">No events found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {meetings.map(m => (
                <MeetingCard 
                  key={m.id} 
                  meeting={m} 
                  onCancel={() => handleCancel(m.id)} 
                  isPast={activeTab === 'past' || m.status === 'cancelled'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
