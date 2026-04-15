"use client";
import Link from "next/link";
import { Link as LinkIcon, Clock, Calendar, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto opacity-0 animate-fade-in p-6">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 shadow-blue-500/20 shadow-xl to-purple-600 flex items-center justify-center animate-pulse">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Welcome back, John. Here&apos;s your overview.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="glass px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Share Link
          </button>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md hover:bg-blue-700 transition-all">
            + Quick Add
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Event Types */}
        <Link href="/event-types" className="block group">
          <div className="glass-card p-8 rounded-2xl h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-100 transition-all pointer-events-none"></div>
            <LinkIcon className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 group-hover:-rotate-12 transition-transform origin-left" />
            <h2 className="text-2xl font-bold mb-3 text-slate-800">Event Types</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Create and manage your event types, duration, and rich details.
            </p>
          </div>
        </Link>

        {/* Availability */}
        <Link href="/availability" className="block group">
          <div className="glass-card p-8 rounded-2xl h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-100 transition-colors pointer-events-none"></div>
            <Clock className="w-10 h-10 text-purple-500 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform origin-left" />
            <h2 className="text-2xl font-bold mb-3 text-slate-800">Availability</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Configure your absolute master weekly availability hours.
            </p>
          </div>
        </Link>

        {/* Meetings */}
        <Link href="/meetings" className="block group">
          <div className="glass-card p-8 rounded-2xl h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-pink-100 transition-colors pointer-events-none"></div>
            <Calendar className="w-10 h-10 text-pink-500 mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-transform origin-left" />
            <h2 className="text-2xl font-bold mb-3 text-slate-800">Meetings</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              View and cancel your upcoming scheduled meetings dynamically.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}