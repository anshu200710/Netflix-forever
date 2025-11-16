import { useState } from "react";

export default function IntroAnimation({ videoSrc, duration = null }) {
  const [done, setDone] = useState(false);

  if (done) return null;

  const handleEnd = () => {
    setDone(true);
  };

  return (
    <div
      className={`fixed inset-0 z-9999 bg-black flex items-center justify-center transition-opacity duration-700
      ${done ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <video
        src={videoSrc}
        autoPlay
        muted
        playsInline
        onEnded={handleEnd}
        className="w-full h-full object-cover"
      />

      {/* Optional: If video doesn't have an end event, hide after X ms */}
      {duration && (
        <div>
          {setTimeout(() => setDone(true), duration)}
        </div>
      )}
    </div>
  );
}
