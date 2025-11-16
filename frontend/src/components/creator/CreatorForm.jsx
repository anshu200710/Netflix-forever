// src/components/creator/CreatorForm.jsx
import { useState } from "react";
import { createCreator } from "../../services/api";

export default function CreatorForm({ onCreated, onError }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      onError?.("Please enter a name.");
      return;
    }

    try {
      setSubmitting(true);
      onError?.("");
      const res = await createCreator(name.trim());
      onCreated(res.creator);
    } catch (err) {
      onError?.(err.message || "Failed to create creator");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-slate-200 mb-1">
        Your name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ashpin"
          className="mt-2 w-full rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-md bg-white text-black px-5 py-2.5 text-sm font-semibold hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {submitting ? "Creating..." : "Continue"}
      </button>
    </form>
  );
}
