"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Link as LinkIcon, Clock, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  
  const publicRoutes = ['/book', '/booking-confirmed'];
  if (publicRoutes.some(route => pathname.startsWith(route))) return null;

  const navItems = [
    { name: 'Event Types', href: '/event-types', icon: LinkIcon },
    { name: 'Availability', href: '/availability', icon: Clock },
    { name: 'Scheduled Events', href: '/meetings', icon: Calendar },
  ];

  return (
    <aside className="w-64 glass hidden md:flex flex-col relative overflow-hidden transition-all duration-300 z-50">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-3 group transition-transform">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Calendly</span>
        </Link>
      </div>
      <nav className="p-4 space-y-1 mt-2 flex-1">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 font-semibold",
                isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />
              <span className="text-[15px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 mt-auto">
        <div className="w-full bg-slate-50 rounded-xl p-5 text-center border border-slate-200 shadow-sm relative overflow-hidden">
          <h4 className="text-sm font-bold text-slate-800 mb-1">PRO Plan Active</h4>
          <p className="text-xs text-slate-500 mb-4">All features unlocked</p>
          <button className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 text-xs font-bold hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all active:scale-95">Settings</button>
        </div>
      </div>
    </aside>
  );
}
