import React from "react";

export function WeddingFooter() {
  return (
    <div className="w-full py-3 mt-4 flex flex-col items-center justify-center border-t border-[#444] bg-white/90 backdrop-blur-sm z-50 relative pointer-events-auto">
      <div className="flex items-center gap-2">
        <a
          href="https://web.facebook.com/lovoraofficial/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-7 h-7 rounded bg-[#1877F2] text-white hover:scale-110 transition-transform shadow-sm"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V15.3h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 3.3h-2.33v6.579C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        </a>
        <a
          href="https://www.instagram.com/lovora.ilx/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-7 h-7 rounded bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white hover:scale-110 transition-transform shadow-sm"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.344 3.608 1.319.975.975 1.257 2.242 1.319 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.062 1.366-.344 2.633-1.319 3.608-.975.975-2.242 1.257-3.608 1.319-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.366-.062-2.633-.344-3.608-1.319-.975-.975-1.257-2.242-1.319-3.608-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849c.062-1.366.344-2.633 1.319-3.608.975-.975 2.242-1.257 3.608-1.319 1.265-.058 1.645-.07 4.849-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.272 2.69.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.667.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.688.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.362-.2 6.78-2.622 6.98-6.98.058-1.28.072-1.688.072-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.358-2.618-6.78-6.98-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm3.98-10.42a1.44 1.44 0 1 1 2.88 0 1.44 1.44 0 0 1-2.88 0z"/>
          </svg>
        </a>
        <div className="text-[#444] font-medium mx-1 text-sm">|</div>
        <a href="https://lovora.vn/wedding" target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-[#004a8b] hover:text-[#e85d75] transition-colors">
          Lovora
        </a>
      </div>
    </div>
  );
}
