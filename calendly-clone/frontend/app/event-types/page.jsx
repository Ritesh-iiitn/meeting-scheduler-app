"use client";

import { useEffect, useState } from "react";
import EventTypeCard from "@/components/event-types/EventTypeCard";
import EventTypeModal from "@/components/event-types/EventTypeModal";
import { getEventTypes, deleteEventType } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEventTypes = async () => {
    try {
      const res = await getEventTypes();
      setEventTypes(res.data);
    } catch (error) {
      toast.error("Failed to load event types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event type?")) return;
    try {
      await deleteEventType(id);
      toast.success("Event type deleted");
      fetchEventTypes();
    } catch (error) {
      toast.error("Failed to delete event type");
    }
  };

  const handleCopyLink = (slug) => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/book/john-doe/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Event Types</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your event links and availability</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md rounded-lg font-semibold transition-all active:scale-95"
        >
          + New Event Type
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-calendly rounded-full animate-spin"></div>
        </div>
      ) : eventTypes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <h3 className="text-gray-500 mb-4">No event types yet.</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-calendly text-white rounded-full font-medium transition-colors hover:bg-blue-700"
          >
            Create your first Event Type
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventTypes.map((et) => (
            <EventTypeCard 
              key={et.id} 
              eventType={et} 
              onDelete={() => handleDelete(et.id)}
              onCopyLink={() => handleCopyLink(et.slug)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <EventTypeModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSaved={fetchEventTypes} 
        />
      )}
    </div>
  );
}
