"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const publicRoutes = ['/book', '/booking-confirmed'];
  
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return (
      <header className="h-16 glass sticky top-0 z-50 flex items-center px-6 justify-center transition-all duration-300">
        <div className="flex items-center gap-3 animate-fade-in group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Calendly Clone</span>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 glass sticky top-0 z-40 flex items-center justify-between px-6 transition-all duration-300">
      <div className="flex items-center gap-4 md:hidden">
        <button className="text-slate-500 hover:text-slate-800 transition-colors bg-slate-100 p-2 rounded-md hover:bg-slate-200">
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xl font-bold text-slate-800 tracking-tight">Calendly</span>
      </div>
      <div className="hidden md:flex ml-auto items-center gap-4 animate-fade-in">
        <div className="flex items-center gap-3 cursor-pointer group bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
          <span className="text-sm font-semibold text-slate-700 pl-2">John Doe</span>
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs ring-2 ring-white">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
