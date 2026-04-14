import { Clock, Copy, Settings, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function EventTypeCard({ eventType, onDelete, onCopyLink }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col relative group">
      <div 
        className="absolute top-0 left-0 w-full h-1.5 transition-all duration-300 opacity-90 group-hover:h-2" 
        style={{ backgroundColor: eventType.color || "#0ea5e9" }}
      />
      
      <div className="p-6 flex-1 mt-1.5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-[22px] font-bold text-slate-800 break-words group-hover:translate-x-1 transition-transform tracking-tight">{eventType.title}</h3>
        </div>
        <p className="text-slate-600 mb-4 flex items-center gap-2 text-sm font-semibold bg-slate-50 w-max px-3 py-1.5 rounded-md border border-slate-200">
          <Clock className="w-4 h-4 text-slate-400" /> {eventType.duration_minutes} mins
        </p>
        {eventType.description && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 group-hover:text-slate-700 transition-colors">{eventType.description}</p>
        )}
      </div>

      <div className="border-t border-slate-100 px-6 py-4 flex justify-between items-center bg-slate-50/50 transition-colors">
        <button 
          onClick={onCopyLink}
          className="text-blue-600 font-semibold text-sm flex items-center gap-2 hover:text-blue-800 transition-all hover:translate-x-1"
        >
          <Copy className="w-4 h-4" /> Copy link
        </button>

        <div className="flex gap-4">
          <Link href={`/book/john-doe/${eventType.slug}`} target="_blank" className="text-slate-400 hover:text-blue-600 transition-colors tooltip" title="Preview Booking Page">
            <ArrowRight className="w-5 h-5 group-hover:animate-bounce" />
          </Link>
          <button 
            onClick={onDelete}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
