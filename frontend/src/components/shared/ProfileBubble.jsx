// src/components/shared/ProfileBubble.jsx
import VideoPlayer from "./VideoPlayer";

export default function ProfileBubble({
  src,
  label,
  active,
  onClick,
  onPlayClick,
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        className={`relative w-20 h-20 rounded-full overflow-hidden border-2 transition ${
          active ? "border-emerald-400 scale-105" : "border-slate-600"
        }`}
      >
        <VideoPlayer
          src={src}
          muted
          autoPlay
          loop
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </button>
      <button
        onClick={onPlayClick}
        className="text-[11px] text-slate-200 max-w-20 text-center line-clamp-2 hover:text-white"
      >
        {label}
      </button>
    </div>
  );
}
