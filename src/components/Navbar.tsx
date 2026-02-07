"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Top Announcement Bar */}
      <div className="h-6 bg-black/80 backdrop-blur-sm border-b border-[#EDEDED]/10">
        <div className="h-full px-6 md:px-12 flex items-center justify-end">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
            SHIPPING WORLDWIDE - ARCHIVE OPEN
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="w-full bg-black/60 backdrop-blur-md border-b border-[#EDEDED]/10">
        <div className="grid grid-cols-3 items-center px-6 md:px-12 py-3">
          {/* Left Column */}
          <div className="flex items-center justify-start gap-4 md:gap-6">
            <span
              className="font-mono text-[11px] lowercase text-[#EDEDED] opacity-50 cursor-not-allowed"
              aria-disabled="true"
            >
              shop
            </span>
            <Link
              href="/archive"
              className="font-mono text-[11px] lowercase text-[#EDEDED] hover:text-white transition-colors"
            >
              archive
            </Link>
          </div>

          {/* Center Column - Logo */}
          <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center">
              <img
                src="/logo.svg"
                alt="VEH"
                className="w-14 h-auto invert"
              />
            </Link>
          </div>

          {/* Right Column */}
          <div className="flex items-center justify-end gap-4 md:gap-6">
            <button className="font-mono text-[11px] lowercase text-[#EDEDED] hover:text-white transition-colors">
              search
            </button>
            <button className="font-mono text-[11px] lowercase text-[#EDEDED] hover:text-white transition-colors">
              bag (0)
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
