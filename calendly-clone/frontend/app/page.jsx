"use client";
import Link from "next/link";
import { Plus, Settings, Link as LinkIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-8 font-sans">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            John Doe
          </h1>
          <a href="#" className="text-blue-600 font-medium hover:underline mt-1 inline-block">
            calendly.com/john-doe
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/event-types" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm">
            <Plus className="w-4 h-4" />
            Create
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-300 mb-6">
        <nav className="flex space-x-8">
          <a href="#" className="border-b-[3px] border-blue-600 py-4 px-1 text-[15px] font-bold text-slate-900">
            Event types
          </a>
          <a href="/meetings" className="border-b-[3px] border-transparent py-4 px-1 text-[15px] font-semibold text-slate-500 hover:text-slate-800 hover:border-slate-300">
            Scheduled events
          </a>
        </nav>
      </div>

      {/* Content box */}
      <div className="bg-white rounded-[4px] border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Links to specific pages from quick actions, restyled */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 bg-slate-50">
           
           <div className="bg-white border-r border-b border-slate-200 p-6 flex flex-col h-56 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 group-hover:bg-blue-600 transition-colors"></div>
              <div className="flex justify-between mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex flex-col justify-center items-center">
                   <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                </div>
                <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Event Types</h3>
              <p className="text-slate-600 font-medium text-sm mb-auto">Manage your distinct meeting parameters.</p>
              
              <Link href="/event-types" className="text-blue-600 font-bold hover:underline mt-4 text-sm inline-flex items-center gap-1 border-t border-slate-100 pt-4">
                 <LinkIcon className="w-4 h-4" /> Go to Event Types
              </Link>
           </div>

           <div className="bg-white border-r border-b border-slate-200 p-6 flex flex-col h-56 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 group-hover:bg-purple-600 transition-colors"></div>
              <div className="flex justify-between mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex flex-col justify-center items-center">
                   <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                </div>
                <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Availability</h3>
              <p className="text-slate-600 font-medium text-sm mb-auto">Set your global master schedule limits.</p>
              
              <Link href="/availability" className="text-blue-600 font-bold hover:underline mt-4 text-sm inline-flex items-center gap-1 border-t border-slate-100 pt-4">
                 <LinkIcon className="w-4 h-4" /> Go to Availability
              </Link>
           </div>
           
        </div>
      </div>
    </div>
  );
}