// src/pages/ProfilePage.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVideoById, buildFileUrl } from "../services/api";
import Loader from "../components/shared/Loader";
import ErrorMessage from "../components/shared/ErrorMessage";
import { assets } from "../assets/assets";
import IntroAnimation from "../components/shared/IntroAnimation";


export default function ProfilePage() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const videoRef = useRef(null);

  // 1) Fetch the video info
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
        <Loader label="Loading title..." />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <ErrorMessage message={error || "Title not found."} />
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

  const bgSrc = buildFileUrl(video.fileUrl);
  console.log("ProfilePage bgSrc:", bgSrc);

  // this triggers once the video has enough data to start playing
  const handleLoadedData = (e) => {
    const el = e.target;
    el.muted = true; // make sure it's muted for autoplay
    const playPromise = el.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        // browser blocked autoplay – ignore
      });
    }
  };

  return (
    <>
    <IntroAnimation videoSrc={assets.IntroVideo} />
    
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 1) FULLSCREEN BACKGROUND VIDEO */}
      <video
        ref={videoRef}
        src={bgSrc}
        autoPlay
        muted
        loop
        playsInline
        controls      // 👈 keep this ON for now so you can see it’s loaded
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedData={(e) => {
          // force play once enough data is loaded
          const el = e.target;
          el.muted = true;
          const p = el.play();
          if (p && p.catch) p.catch(() => {});
        }}
      />

      {/* 2) GRADIENT OVERLAYS */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

      {/* 3) ALL CONTENT ABOVE VIDEO */}
      <div className="relative z-10">
        {/* top nav */}
        <header className="flex items-center gap-8 px-8 pt-4 text-sm">
          <img
            src={assets.Logonetflix}
            alt="Netflix"
            className="h-7 object-contain"
          />
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <button className="font-semibold">Home</button>
            <button className="text-slate-200">TV Shows</button>
            <button className="text-slate-200">Movies</button>
            <button className="text-slate-200">New & Popular</button>
            <button className="text-slate-200">My List</button>
          </nav>
        </header>

        {/* hero content */}
        <main className="flex flex-col justify-center min-h-[80vh] px-8 md:px-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500 font-bold text-xl">N</span>
            <span className="uppercase text-xs tracking-[0.3em] text-slate-200">
              Series
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-xl">
            {video.title || "Best Memories"}
          </h1>

          <p className="text-sm md:text-base text-slate-200 max-w-xl mb-6">
            At the end of the day, it&apos;s all about memories, messy hair, and
            sparkling eyes. This is your story, captured in a single series.
          </p>

          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(`/watch/${video._id}`)}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-md bg-red-600 text-white text-sm md:text-base font-semibold hover:bg-red-700 transition"
            >
              ▷ Play
            </button>
            <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-slate-700/80 text-white text-xs md:text-sm hover:bg-slate-600 transition">
              More Info
            </button>
          </div>

          <div className="flex items-center gap-6 text-xs md:text-sm text-slate-300">
            <button className="border-b-2 border-red-600 pb-1">Overview</button>
            <button>Episodes</button>
            <button>Trailers &amp; More</button>
            <button>More like this</button>
          </div>
        </main>
      </div>
    </div>
    </>
  );
}
