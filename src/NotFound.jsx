import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between items-center px-6 py-12 relative overflow-hidden font-sans">
      {/* Background Ambient Gold Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Header / Afritek Logo Placeholder */}
      <header className="w-full max-w-7xl flex justify-between items-center z-10">
        <a
          href="./"
          className="text-xl font-bold tracking-widest uppercase text-white flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full inline-block"></span>
          Afritek
        </a>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center text-center max-w-2xl z-10 my-auto">
        {/* Subtle Gold Tag */}
        <span className="text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-4 px-3 py-1 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5">
          Error 404
        </span>

        {/* Large 404 Display with Subtle Gold Gradient */}
        <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tighter bg-gradient-to-b from-white via-neutral-200 to-[#D4AF37] bg-clip-text text-transparent select-none mb-2">
          404
        </h1>

        {/* Subheading */}
        <h2 className="text-2xl sm:text-3xl font-light text-neutral-200 mb-4 tracking-tight">
          Page Lost in the Dark
        </h2>

        {/* Explanation Paragraph */}
        <p className="text-neutral-400 text-base sm:text-lg mb-10 leading-relaxed max-w-md">
          The page you are looking for doesn't exist, has been removed, or is
          temporarily unavailable.
        </p>

        {/* Call To Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="./"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-medium text-sm bg-[#D4AF37] text-black hover:bg-[#F3E5AB] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Return to Homepage
          </a>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-medium text-sm text-neutral-300 border border-neutral-800 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all duration-300 bg-neutral-950/50"
          >
            Go Back
          </button>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="z-10 text-xs text-neutral-600 tracking-wider">
        &copy; {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  );
}
