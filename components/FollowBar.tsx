"use client";

export default function FollowBar() {
  return (
    <section className="px-4 py-10">
      <div className="max-w-5xl mx-auto rounded-3xl shadow-2xl bg-gradient-to-r from-[#E07A5F] via-[#3D405B] to-[#81B29A] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div className="text-center md:text-left">
          <p className="text-white/70 text-sm tracking-wide">🛤️ Never miss the next mile</p>
          <h3 className="font-[family-name:var(--font-playfair)] text-white text-2xl md:text-3xl font-bold mt-1">
            Follow the Journey
          </h3>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <a
            href="/feed/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm text-white font-medium border border-white/20 hover:bg-white/20 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.18 15.64a2.18 2.18 0 110 4.36 2.18 2.18 0 010-4.36zM4 4.44A15.56 15.56 0 0119.56 20h-2.83A12.73 12.73 0 004 7.27V4.44zm0 5.66a9.9 9.9 0 019.9 9.9h-2.83A7.07 7.07 0 004 12.93V10.1z"/>
            </svg>
            RSS Feed
          </a>
          <a
            href="https://www.instagram.com/katiemarieglen/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm text-white font-medium border border-white/20 hover:bg-white/20 transition-all"
          >
            📸 Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
