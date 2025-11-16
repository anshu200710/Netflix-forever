// src/components/shared/ErrorMessage.jsx
export default function ErrorMessage({ message }) {
  return (
    <div className="w-full rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs md:text-sm text-red-100">
      {message}
    </div>
  );
}
