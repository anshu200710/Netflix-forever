// src/components/creator/VideoUploadList.jsx
import { useState } from "react";
import { uploadCreatorVideos } from "../../services/api";

const SLOT_LABELS = ["Profile 1", "Profile 2", "Profile 3"];

export default function VideoUploadList({
  creator,
  onUploadStart,
  onUploadSuccess,
  onUploadError,
}) {
  const [slots, setSlots] = useState([null, null, null]);

  const handleFileChange = (index, event) => {
    const file = event.target.files?.[0] || null;
    setSlots((prev) => {
      const copy = [...prev];
      copy[index] = file;
      return copy;
    });
  };

  const handleUpload = async () => {
    const selectedFiles = slots.filter(Boolean);

    if (selectedFiles.length === 0) {
      onUploadError?.("Please choose at least one video.");
      return;
    }

    if (selectedFiles.length > 3) {
      onUploadError?.("You can only upload up to 3 videos.");
      return;
    }

    try {
      onUploadStart?.();
      const res = await uploadCreatorVideos(creator._id, selectedFiles);
      onUploadSuccess?.(res.videos);
    } catch (err) {
      onUploadError?.(err.message || "Failed to upload videos");
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-300">
        Hey <span className="font-semibold">{creator.name}</span>, create three
        profiles by assigning one video to each. These will appear on the
        &quot;Who&apos;s watching?&quot; screen.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SLOT_LABELS.map((label, idx) => {
          const file = slots[idx];
          return (
            <label
              key={idx}
              className="group flex flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 p-4 cursor-pointer hover:border-red-500/80 hover:bg-slate-900 transition"
            >
              <div className="w-28 h-28 bg-slate-800 rounded-md mb-3 overflow-hidden flex items-center justify-center border border-slate-700 group-hover:border-red-500/80">
                {file ? (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                  />
                ) : (
                  <span className="text-3xl text-slate-500 group-hover:text-red-500">
                    +
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-200 mb-1">
                {label}
              </span>
              <span className="text-[11px] text-slate-400 mb-2 text-center">
                {file ? file.name : "Click to select a video"}
              </span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFileChange(idx, e)}
              />
            </label>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          className="inline-flex items-center justify-center rounded-md bg-red-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-red-700 transition"
        >
          Finish & Create Page
        </button>
      </div>
    </div>
  );
}
