// src/pages/SubdomainHome.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSubdomainSlug from "../hooks/useSubdomainSlug";
import { getPublicCreator, buildFileUrl } from "../services/api";
import Loader from "../components/shared/Loader";
import ErrorMessage from "../components/shared/ErrorMessage";
import { assets } from "../assets/assets";

export default function SubdomainHome() {
  const slug = useSubdomainSlug();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // No slug → go to create page (main domain)
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

  if (!slug) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader label="Loading your mini Netflix..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <ErrorMessage message={error || "This page does not exist anymore."} />
        </div>
      </div>
    );
  }

  const { creator, videos } = data;

  if (!videos || videos.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-slate-300 text-center px-4">
          {creator.name} hasn&apos;t uploaded any videos yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* top bar with Netflix logo */}
      <header className="h-16 flex items-center px-8">
        <img src={assets.Logonetflix} alt="Netflix" className="h-7 object-contain" />
      </header>

      {/* main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-10 text-white">
          Who&apos;s watching?
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-10 mb-12">
          {videos.map((v) => (
            <button
              key={v._id}
              onClick={() => navigate(`/profile/${v._id}`)}
              className="group flex flex-col items-center gap-3"
            >
              <div className="w-40 h-40 md:w-48 md:h-48 bg-slate-800 rounded-md overflow-hidden border-2 border-transparent group-hover:border-white transition-transform group-hover:scale-105">
                {/* we use video frame as the profile image */}
                <video
                  src={buildFileUrl(v.fileUrl)}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm md:text-base text-slate-300 group-hover:text-white transition">
                {v.title || "Profile"}
              </span>
            </button>
          ))}
        </div>

        <button className="mt-2 border border-slate-500 text-sm tracking-[0.2em] uppercase px-6 py-2 text-slate-200 hover:border-white hover:text-white transition">
          Manage Profiles
        </button>
      </main>
    </div>
  );
}
