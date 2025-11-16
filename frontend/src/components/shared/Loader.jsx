// src/components/shared/Loader.jsx
export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 text-slate-200 text-sm">
      <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
      <span>{label}</span>
    </div>
  );
}
