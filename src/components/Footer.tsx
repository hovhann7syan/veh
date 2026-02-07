export default function Footer() {
    return (
      <footer className="w-full py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-end md:items-center text-[10px] md:text-xs font-mono uppercase text-gray-500 tracking-widest mt-auto border-t border-[#111]">
        <div className="flex flex-col gap-1">
          <span className="text-white">Yerevan, AM</span>
          <span>40.1872° N, 44.5152° E</span>
        </div>
        <div className="mt-4 md:mt-0">
          © 2026 VEH WORLDWIDE
        </div>
      </footer>
    );
  }