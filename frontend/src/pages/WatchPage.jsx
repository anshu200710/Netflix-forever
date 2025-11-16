// src/pages/WatchPage.jsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVideoById, buildFileUrl } from "../services/api";
import Loader from "../components/shared/Loader";
import ErrorMessage from "../components/shared/ErrorMessage";
import VideoPlayer from "../components/shared/VideoPlayer";

export default function WatchPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const videoRef = useRef(null);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!videoId) return;
    setLoading(true);
    setError("");

    getVideoById(videoId)
      .then((res) => {
        setVideo(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load video");
        setLoading(false);
      });
  }, [videoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader label="Loading video..." />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <ErrorMessage message={error || "Video not found."} />
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-sm text-slate-300 hover:text-white underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const src = buildFileUrl(video.fileUrl);

  // --- video events for progress --- //
  const handleLoadedMetadata = () => {
    const el = videoRef.current;
    if (el && !Number.isNaN(el.duration)) {
      setDuration(el.duration);
    }
  };

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (el) {
      setCurrentTime(el.currentTime);
    }
  };

  const handleSeek = (e) => {
    const value = Number(e.target.value);
    const el = videoRef.current;
    if (el) {
      el.currentTime = value;
    }
    setCurrentTime(value);
  };

  const formatTime = (t) => {
    if (!t || Number.isNaN(t)) return "00:00";
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col">
      {/* top episode label */}
      <header className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-xs md:text-sm text-white">
        S1 : E1 &quot;{video.title || "Episode"}&quot;
      </header>

      {/* video */}
      <div className="flex-1 flex items-center justify-center bg-black">
        <VideoPlayer
          ref={videoRef}
          src={src}
          controls
          autoPlay
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          className="w-full max-h-[80vh] bg-black"
        />
      </div>

      {/* bottom bar */}
      <footer className="relative z-20 w-full bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="max-w-5xl mx-auto px-4 pb-6 pt-2 space-y-2">
          {/* REAL progress bar */}
          <div className="flex items-center gap-3 text-[11px] md:text-xs text-slate-200">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-red-600"
              />
              {/* optional: background bar below input */}
              <div className="w-full h-1 bg-white/20 rounded-full -mt-[7px] pointer-events-none">
                <div
                  className="h-full bg-red-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between text-xs md:text-sm">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-1 text-slate-100">
                <span>📺</span>
                <span>Episodes</span>
              </button>
              <button className="flex items-center gap-1 text-slate-100">
                <span>💬</span>
                <span>Audio &amp; Subtitles</span>
              </button>
            </div>

            <button className="flex items-center gap-1 text-slate-100">
              <span>▶</span>
              <span>Next Episode</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
