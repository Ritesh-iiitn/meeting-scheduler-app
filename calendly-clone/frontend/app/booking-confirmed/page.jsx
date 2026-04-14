"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";

export default function BookingConfirmed() {
  const searchParams = useSearchParams();
  
  const invitee = searchParams.get('name');
  const eventName = searchParams.get('event');
  const dateStr = searchParams.get('date');

  let dateObj = null;
  if (dateStr) {
    try {
      dateObj = parseISO(dateStr);
    } catch(e) {}
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">You are scheduled</h1>
        <p className="text-gray-600 mb-8">A calendar invitation has been sent to your email address.</p>

        <div className="border border-gray-200 rounded-lg p-6 text-left mb-8">
          <h2 className="font-semibold text-lg text-gray-800 border-b border-gray-100 pb-4 mb-4">
            {eventName || 'Meeting'}
          </h2>
          
          <div className="space-y-4">
            {invitee && (
              <div className="flex items-center gap-3 text-gray-600">
                <User className="w-5 h-5 text-gray-400" />
                <span>{invitee}</span>
              </div>
            )}
            
            {dateObj && (
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>
                  {format(dateObj, 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
            )}

            {dateObj && (
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>
                  {format(dateObj, 'h:mm a')}
                </span>
              </div>
            )}
          </div>
        </div>

        <Link 
          href="/" 
          className="text-calendly font-medium hover:underline"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}
