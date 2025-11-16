// src/pages/CreatorOnboarding.jsx
import { useState } from "react";
import CreatorForm from "../components/creator/CreatorForm";
import VideoUploadList from "../components/creator/VideoUploadList";
import Loader from "../components/shared/Loader";
import ErrorMessage from "../components/shared/ErrorMessage";
import { assets } from "../assets/assets";

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

  const handleUploadSuccess = () => {
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
    <>

    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Netflix-style top bar */}
      <header className="h-16 flex items-center px-6 md:px-10 border-b border-slate-900/60">
        <img src={assets.Logonetflix} alt="Netflix" className="h-7 object-contain" />
      </header>

      {/* content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl grid md:grid-cols-[1.3fr,1fr] gap-10 items-start">
          {/* Left: big heading & description */}
          <div className="hidden md:block">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Set up your <span className="text-red-600">Mini Netflix</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base mb-6 max-w-md">
              Give your page a name, add three special videos, and we&apos;ll
              turn it into a Netflix-style experience with profiles and a
              hero screen.
            </p>

            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Step 1 – Name your space</li>
              <li>• Step 2 – Add 3 videos (one per profile)</li>
              <li>• Step 3 – Share your unique link with friends</li>
            </ul>
          </div>

          {/* Right: card with form/steps */}
          <div className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Create your page
            </h2>

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
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                    step >= 1 ? "bg-red-600 text-white" : "bg-slate-700"
                  }`}
                >
                  1
                </div>
                <span
                  className={
                    step >= 1 ? "text-white font-medium" : "text-slate-400"
                  }
                >
                  Name
                </span>
              </div>
              <div className="h-px flex-1 bg-slate-700" />
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                    step >= 2 ? "bg-red-600 text-white" : "bg-slate-700"
                  }`}
                >
                  2
                </div>
                <span
                  className={
                    step >= 2 ? "text-white font-medium" : "text-slate-400"
                  }
                >
                  3 Videos
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
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-sm">
                <div className="font-semibold text-red-300 mb-1">
                  Your mini site is ready 🎉
                </div>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-300 underline break-all hover:text-red-200 transition"
                >
                  {publicUrl}
                </a>
                <p className="text-xs text-red-200/80 mt-2">
                  On localhost this uses <code>?slug=...</code>. In production
                  it becomes <code>{creator.slug}.yourdomain.com</code>.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
