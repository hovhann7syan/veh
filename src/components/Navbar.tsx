"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-8">
          <span
            className="text-[#EDEDED] text-sm font-medium opacity-50 cursor-not-allowed"
            aria-disabled="true"
          >
            SHOP
          </span>
          <Link
            href="/archive"
            className="text-[#EDEDED] text-sm font-medium hover:opacity-80 transition-opacity"
          >
            ARCHIVE
          </Link>
        </div>
      </div>
    </nav>
  );
}

