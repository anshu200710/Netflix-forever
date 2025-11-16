// src/components/creator/VideoUploadList.jsx
import { useState } from "react";
import { uploadCreatorVideos } from "../../services/api";

export default function VideoUploadList({
  creator,
  onUploadStart,
  onUploadSuccess,
  onUploadError,
}) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const list = Array.from(e.target.files || []);
    if (list.length > 3) {
      onUploadError?.("You can only upload up to 3 videos.");
      return;
    }
    setFiles(list);
  };

  const handleUpload = async () => {
    if (!files.length) {
      onUploadError?.("Please select at least one video.");
      return;
    }
    if (files.length > 3) {
      onUploadError?.("You can only upload up to 3 videos.");
      return;
    }

    try {
      onUploadStart?.();
      const res = await uploadCreatorVideos(creator._id, files);
      onUploadSuccess?.(res.videos);
    } catch (err) {
      onUploadError?.(err.message || "Failed to upload videos");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-300">
        Hi <span className="font-semibold">{creator.name}</span>, now add up to{" "}
        <span className="font-semibold">3 videos</span> that will appear on
        your personal Netflix-style page.
      </p>

      <div className="border border-dashed border-slate-600 rounded-xl p-4 bg-slate-900/60">
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
            Upload videos
          </span>
          <span className="text-sm text-slate-200 mb-2">
            Click to select up to 3 files
          </span>
          <span className="text-[11px] text-slate-400">
            MP4 / WebM / MOV · Max few hundred MB recommended
          </span>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {files.length > 0 && (
          <ul className="mt-4 space-y-1 text-xs text-slate-200">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between">
                <span className="truncate max-w-[75%]">{f.name}</span>
                <span className="text-slate-400">
                  {(f.size / (1024 * 1024)).toFixed(1)} MB
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleUpload}
        className="inline-flex items-center justify-center rounded-md bg-emerald-500 text-black px-5 py-2.5 text-sm font-semibold hover:bg-emerald-400 transition"
      >
        Upload & Finish
      </button>
    </div>
  );
}
