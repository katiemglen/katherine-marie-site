'use client';

export default function AuroraMesh() {
  return (
    <div className="aurora-mesh-wrapper" aria-hidden="true">
      <div className="aurora-mesh" />
      <style jsx>{`
        .aurora-mesh-wrapper {
          position: relative;
          height: 120px;
          overflow: hidden;
          margin: 0 -1.5rem;
        }
        .aurora-mesh {
          position: absolute;
          inset: 0;
          opacity: 0.45;
          background:
            radial-gradient(ellipse 50% 80% at 20% 50%, var(--aurora-1) 0%, transparent 70%),
            radial-gradient(ellipse 60% 70% at 80% 40%, var(--aurora-2) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 50% 60%, var(--aurora-3) 0%, transparent 70%);
          background-size: 200% 200%;
          animation: aurora-drift 25s ease-in-out infinite;
        }
        @keyframes aurora-drift {
          0%, 100% { background-position: 0% 50%, 100% 50%, 50% 50%; }
          33% { background-position: 30% 30%, 70% 70%, 60% 40%; }
          66% { background-position: 70% 60%, 30% 30%, 40% 70%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-mesh { animation: none; }
        }
      `}</style>
    </div>
  );
}
