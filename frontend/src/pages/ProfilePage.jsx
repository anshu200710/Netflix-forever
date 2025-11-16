// src/pages/ProfilePage.jsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVideoById, buildFileUrl } from "../services/api";
import Loader from "../components/shared/Loader";
import ErrorMessage from "../components/shared/ErrorMessage";
import VideoPlayer from "../components/shared/VideoPlayer";

export default function ProfilePage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState(1);
  const videoRef = useRef(null);

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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, [speed]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black">
        <Loader label="Loading video..." />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black">
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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-black via-slate-950 to-black text-white px-4 md:px-10 py-6">
      <header className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-xs md:text-sm text-slate-300 hover:text-white flex items-center gap-1"
        >
          ← Back
        </button>
        <h1 className="text-sm md:text-base font-semibold tracking-[0.25em] uppercase text-slate-300">
          Profile View
        </h1>
        <div />
      </header>

      <main className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {video.title}
        </h2>
        <p className="text-slate-300 text-xs md:text-sm mb-4">
          Enjoy this video with flexible playback controls, just like a
          Netflix episode.
        </p>

        {/* Player */}
        <div className="bg-black/70 rounded-2xl border border-slate-800 shadow-xl overflow-hidden mb-4">
          <VideoPlayer
            ref={videoRef}
            src={src}
            controls
            className="w-full max-h-[70vh] bg-black"
          />
        </div>

        {/* Playback speed options */}
        <div className="flex items-center gap-3 mb-4 text-sm md:text-base">
          <span className="text-slate-300 text-sm">Playback speed:</span>
          {[0.5, 1, 1.5, 2].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-3 py-1 rounded-full text-xs md:text-sm border ${
                speed === s
                  ? "bg-white text-black border-white"
                  : "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
