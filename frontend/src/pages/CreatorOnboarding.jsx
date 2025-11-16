// src/pages/CreatorOnboarding.jsx
import { useState } from "react";
import CreatorForm from "../components/creator/CreatorForm";
import VideoUploadList from "../components/creator/VideoUploadList";
import Loader from "../components/shared/Loader";
import ErrorMessage from "../components/shared/ErrorMessage";

export default function CreatorOnboarding() {
  const [creator, setCreator] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [publicUrl, setPublicUrl] = useState("");

  const handleCreatorCreated = (creatorData) => {
    setCreator(creatorData);
    setStep(2);
  };

  const handleUploadStart = () => {
    setLoading(true);
    setError("");
  };

  const handleUploadSuccess = (videos) => {
    setLoading(false);
    const slug = creator.slug;
    const host = window.location.host; // includes port in dev
    const protocol = window.location.protocol;

    let url;

  // DEV: localhost or 127.x – use query param
  if (host.startsWith("localhost") || host.startsWith("127.")) {
    url = `${protocol}//${host}/?slug=${slug}`;
  } else {
    // PROD: real subdomain
    url = `${protocol}//${slug}.${host}`;
  }

  setPublicUrl(url);
  };

  const handleUploadError = (message) => {
    setLoading(false);
    setError(message);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-950 to-black text-white px-4">
      <div className="w-full max-w-3xl bg-slate-900/70 border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
          Create your mini Netflix page
        </h1>
        <p className="text-slate-300 mb-6 text-sm md:text-base">
          Add your name, upload up to 3 videos, and instantly get your own
          subdomain like <span className="font-mono">username.yourdomain.com</span>.
        </p>

        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        {loading && (
          <div className="mb-4">
            <Loader label="Uploading videos..." />
          </div>
        )}

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                step >= 1 ? "bg-emerald-500 text-black" : "bg-slate-700"
              }`}
            >
              1
            </div>
            <span className={step >= 1 ? "text-white" : "text-slate-400"}>
              Enter your name
            </span>
          </div>
          <div className="h-px flex-1 bg-slate-600" />
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                step >= 2 ? "bg-emerald-500 text-black" : "bg-slate-700"
              }`}
            >
              2
            </div>
            <span className={step >= 2 ? "text-white" : "text-slate-400"}>
              Upload 3 videos
            </span>
          </div>
        </div>

        {step === 1 && (
          <CreatorForm onCreated={handleCreatorCreated} onError={setError} />
        )}

        {step === 2 && creator && (
          <VideoUploadList
            creator={creator}
            onUploadStart={handleUploadStart}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        )}

        {publicUrl && (
           <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-sm">
             <div className="font-semibold text-emerald-300 mb-1">
               Your mini site is ready 🎉
             </div>
             <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 underline break-all hover:text-emerald-200 transition"
              >
                {publicUrl}
            </a>
             <p className="text-xs text-emerald-200/80 mt-2">
               On localhost this uses <code>?slug=...</code>. In production it will use
               real subdomains like <code>{creator.slug}.yourdomain.com</code>.
             </p>
           </div>
         )}
      </div>
    </div>
  );
}
