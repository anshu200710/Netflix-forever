// src/pages/SubdomainHome.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSubdomainSlug from "../hooks/useSubdomainSlug";
import { getPublicCreator, buildFileUrl } from "../services/api";
import Loader from "../components/shared/Loader";
import ErrorMessage from "../components/shared/ErrorMessage";
import VideoPlayer from "../components/shared/VideoPlayer";
import ProfileBubble from "../components/shared/ProfileBubble";

export default function SubdomainHome() {
  const slug = useSubdomainSlug();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // If there's no subdomain → treat as main domain → redirect to /create
  useEffect(() => {
    if (slug === null) {
      navigate("/create", { replace: true });
    }
  }, [slug, navigate]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");

    getPublicCreator(slug)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load page");
        setLoading(false);
      });
  }, [slug]);

  if (!slug) {
    // while redirecting
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black">
        <Loader label="Loading your mini Netflix..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black">
        <div className="w-full max-w-md px-4">
          <ErrorMessage
            message={error || "This page does not exist anymore."}
          />
        </div>
      </div>
    );
  }

  const { creator, videos } = data;
  if (!videos || videos.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black text-white">
        <p className="text-slate-300 text-center px-4">
          {creator.name} hasn&apos;t uploaded any videos yet.
        </p>
      </div>
    );
  }

  const selectedVideo = videos[selectedIndex];
  const bgSrc = buildFileUrl(selectedVideo.fileUrl);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-black text-white overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 -z-10">
        <VideoPlayer
          src={bgSrc}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/40" />
      </div>

      <div className="relative z-10 flex flex-col min-h-[calc(100vh-4rem)] px-4 md:px-10 py-6">
        {/* Top bar */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.2em] text-emerald-300">
              MINI NETFLIX
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              {creator.name}&apos;s Space
            </h1>
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col justify-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 drop-shadow-lg">
            {selectedVideo.title}
          </h2>
          <p className="text-sm md:text-base text-slate-200 mb-6 max-w-xl">
            A personal, Netflix-style page featuring 3 special videos from{" "}
            <span className="font-semibold">{creator.name}</span>.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/profile/${selectedVideo._id}`)}
              className="inline-flex items-center justify-center rounded-md bg-white text-black px-6 py-2.5 text-sm md:text-base font-semibold hover:bg-slate-100 transition shadow-lg"
            >
              ▶ Play
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev + 1) % videos.length)}
              className="inline-flex items-center justify-center rounded-md bg-slate-800/80 border border-slate-600 px-4 py-2 text-xs md:text-sm hover:bg-slate-700 transition"
            >
              Shuffle Highlight
            </button>
          </div>
        </main>

        {/* Profiles */}
        <section className="mt-10 mb-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">
            Profiles
          </h3>
          <div className="flex flex-wrap gap-5">
            {videos.map((v, idx) => (
              <ProfileBubble
                key={v._id}
                active={idx === selectedIndex}
                label={v.title}
                src={buildFileUrl(v.fileUrl)}
                onClick={() => setSelectedIndex(idx)}
                onPlayClick={() => navigate(`/profile/${v._id}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
