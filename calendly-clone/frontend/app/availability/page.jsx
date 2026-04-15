"use client";

import { useEffect, useState } from "react";
import { getAvailability, updateAvailability } from "@/lib/api";
import { toast } from "react-hot-toast";
import AvailabilityForm from "@/components/availability/AvailabilityForm";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState([]);
  const [scheduleId, setScheduleId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await getAvailability();
      
      const availData = res.data.availability || [];
      const schedData = res.data.schedules || [];
      if (schedData.length > 0) {
        setScheduleId(schedData[0].id);
      }

      // Format data: ensure all 7 days exist
      const defaultData = DAYS.map((_, index) => {
        const existing = availData.find(a => a.day_of_week === index);
        return existing || { day_of_week: index, start_time: "09:00", end_time: "17:00", is_available: false };
      });
      // Sort by Mon-Sun (1-6, 0)
      const sorted = [...defaultData.filter(d => d.day_of_week !== 0), defaultData[0]];
      setAvailability(sorted);
    } catch (error) {
      toast.error("Failed to load availability");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (dayOfWeek) => {
    setAvailability(prev => 
      prev.map(item => 
        item.day_of_week === dayOfWeek ? { ...item, is_available: !item.is_available } : item
      )
    );
  };

  const handleTimeChange = (dayOfWeek, field, value) => {
    setAvailability(prev => 
      prev.map(item => 
        item.day_of_week === dayOfWeek ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formatted = availability.map(a => ({
        ...a,
        start_time: a.start_time.length === 5 ? a.start_time + ":00" : a.start_time,
        end_time: a.end_time.length === 5 ? a.end_time + ":00" : a.end_time,
      }));
      await updateAvailability({
        schedule_id: scheduleId,
        availability: formatted,
        overrides: []
      });
      toast.success("Availability updated successfully");
    } catch (error) {
      toast.error("Failed to update availability");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-normal text-gray-800">Availability</h1>
        <p className="text-gray-500 mt-1">Set your weekly hours when people can schedule meetings.</p>
      </div>

      <AvailabilityForm 
        availability={availability}
        handleToggle={handleToggle}
        handleTimeChange={handleTimeChange}
        handleSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
