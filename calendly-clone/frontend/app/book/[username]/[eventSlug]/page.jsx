"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEventTypeBySlug, getAvailableSlots, createBooking } from "@/lib/api";
import { Clock, Calendar as CalIcon, ArrowLeft } from "lucide-react";
import { format, parseISO, addMinutes } from "date-fns";
import { toast } from "react-hot-toast";

import CalendarPicker from "@/components/booking/CalendarPicker";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import BookingForm from "@/components/booking/BookingForm";

export default function PublicBookingPage() {
  const { username, eventSlug } = useParams();
  const router = useRouter();

  const [eventType, setEventType] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Form
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [formData, setFormData] = useState({ name: "", email: "", notes: "" });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSlug]);

  useEffect(() => {
    if (selectedDate && eventType) {
      fetchSlots(selectedDate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const fetchEventDetails = async () => {
    try {
      const res = await getEventTypeBySlug(eventSlug);
      setEventType(res.data);
    } catch (error) {
      toast.error("Event not found");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (date) => {
    setSlotsLoading(true);
    setSelectedSlot(null);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const res = await getAvailableSlots(eventSlug, dateStr);
      setAvailableSlots(res.data);
    } catch (error) {
      toast.error("Failed to load time slots");
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      await createBooking({
        event_type_id: eventType.id,
        invitee_name: formData.name,
        invitee_email: formData.email,
        start_time: selectedSlot.datetime,
        notes: formData.notes
      });
      // Redirect to success
      router.push(`/booking-confirmed?name=${encodeURIComponent(formData.name)}&event=${encodeURIComponent(eventType.title)}&date=${encodeURIComponent(selectedSlot.datetime)}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!eventType) return <div className="min-h-screen flex items-center justify-center">Not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Event Details */}
        <div className="w-full md:w-1/3 bg-white p-8 border-r border-gray-200 relative">
          {step === 2 && (
            <button 
              onClick={() => setStep(1)}
              className="absolute top-6 left-6 text-gray-500 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="mt-8 md:mt-0">
            <h4 className="text-gray-500 font-medium mb-1">John Doe</h4>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{eventType.title}</h1>
            
            <div className="space-y-4 text-gray-600 font-medium">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" />
                <span>{eventType.duration_minutes} min</span>
              </div>
              
              {selectedSlot && step === 2 && (
                <div className="flex items-start gap-3">
                  <CalIcon className="w-5 h-5 mt-0.5 text-calendly" />
                  <span className="text-calendly font-bold">
                    {format(parseISO(selectedSlot.datetime), 'h:mm a - ')} 
                    {format(addMinutes(parseISO(selectedSlot.datetime), eventType.duration_minutes), 'h:mm a, EEEE, MMMM d, yyyy')}
                  </span>
                </div>
              )}
            </div>
            
            {eventType.description && (
              <p className="mt-6 text-gray-600 leading-relaxed">
                {eventType.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Area */}
        <div className="w-full md:w-2/3 p-8 bg-white">
          {step === 1 ? (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Select a Date & Time</h2>
              <div className="flex flex-col md:flex-row gap-8">
                
                <CalendarPicker 
                  selectedDate={selectedDate} 
                  onDateSelect={setSelectedDate} 
                />
                
                <TimeSlotPicker 
                  selectedDate={selectedDate}
                  availableSlots={availableSlots}
                  slotsLoading={slotsLoading}
                  selectedSlot={selectedSlot}
                  setSelectedSlot={setSelectedSlot}
                  onNext={() => setStep(2)}
                />

              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Enter Details</h2>
              <BookingForm 
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleBooking}
                loading={bookingLoading}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
