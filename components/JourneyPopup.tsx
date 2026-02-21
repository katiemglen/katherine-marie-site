"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function JourneyPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("journeyPopupSeen")) {
        const timer = setTimeout(() => setShow(true), 2000);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  function dismiss() {
    setShow(false);
    try { localStorage.setItem("journeyPopupSeen", "1"); } catch {}
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient top bar */}
            <div className="h-2 bg-gradient-to-r from-[#E07A5F] to-[#81B29A]" />

            <div className="p-8 text-center">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E07A5F] to-[#81B29A] flex items-center justify-center text-3xl mb-6">
                🛤️
              </div>

              <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#3D405B] mb-3">
                Welcome back to the road!
              </h2>
              <p className="text-[#3D405B]/70 mb-8 leading-relaxed">
                Every new story lands straight in your favorite reader — no inbox, no spam, ever.
              </p>

              {/* CTA */}
              <a
                href="/feed/"
                onClick={dismiss}
                className="inline-block w-full py-4 rounded-2xl bg-gradient-to-r from-[#E07A5F] to-[#81B29A] text-white font-semibold text-lg hover:shadow-lg transition-shadow"
              >
                🛎️ Subscribe to RSS Feed
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/katiemarieglen/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-[#3D405B]/60 hover:text-[#E07A5F] transition-colors text-sm"
              >
                📸 Follow on Instagram
              </a>

              {/* Dismiss */}
              <button
                onClick={dismiss}
                className="block mx-auto mt-4 text-[#3D405B]/40 hover:text-[#3D405B]/60 text-xs transition-colors"
              >
                No thanks, I'll find you later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
