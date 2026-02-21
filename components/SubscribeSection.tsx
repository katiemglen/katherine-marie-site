export default function SubscribeSection() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto bg-white border border-[#E07A5F]/10 rounded-3xl p-10 md:p-14 shadow-xl text-center">
        {/* Badge */}
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#81B29A]/15 text-[#81B29A] text-xs font-semibold tracking-widest uppercase mb-6">
          New Posts = New Adventures
        </span>

        <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[#3D405B] mb-4 leading-tight">
          Follow Every Mile Has a Story
        </h2>

        <p className="text-[#3D405B]/60 max-w-xl mx-auto mb-8 leading-relaxed">
          No email required. Just pure road-trip stories delivered the old-school way — straight to your favorite feed reader.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a
            href="/feed/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E07A5F] to-[#81B29A] text-white font-semibold hover:shadow-lg transition-shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.18 15.64a2.18 2.18 0 110 4.36 2.18 2.18 0 010-4.36zM4 4.44A15.56 15.56 0 0119.56 20h-2.83A12.73 12.73 0 004 7.27V4.44zm0 5.66a9.9 9.9 0 019.9 9.9h-2.83A7.07 7.07 0 004 12.93V10.1z"/>
            </svg>
            Subscribe via RSS
          </a>
          <a
            href="https://www.instagram.com/katiemarieglen/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-[#3D405B]/20 text-[#3D405B] font-semibold hover:border-[#E07A5F]/40 transition-colors"
          >
            📸 Follow on Instagram
          </a>
        </div>

        <p className="text-[#3D405B]/30 text-xs">
          Zero data collected • Works with Feedly, Inoreader, Apple News, etc.
        </p>
      </div>
    </section>
  );
}
