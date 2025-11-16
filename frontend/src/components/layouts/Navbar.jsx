// src/components/layout/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import useSubdomainSlug from "../../hooks/useSubdomainSlug";

export default function Navbar() {
  const location = useLocation();
  const slug = useSubdomainSlug();
  const isSubdomain = !!slug;

  return (
    <nav className="h-16 bg-black/80 border-b border-slate-800 flex items-center justify-between px-4 md:px-10 backdrop-blur sticky top-0 z-20">
      <Link to={isSubdomain ? "/" : "/create"} className="flex items-center">
        <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center mr-2">
          <span className="text-xs font-black text-black">MN</span>
        </div>
        <span className="font-semibold text-sm md:text-base tracking-tight">
          MiniNetflix
        </span>
      </Link>

      <div className="flex items-center gap-4 text-xs md:text-sm text-slate-300">
        {!isSubdomain && location.pathname !== "/create" && (
          <Link
            to="/create"
            className="px-3 py-1.5 rounded-full border border-slate-700 hover:border-emerald-400 hover:text-emerald-300 transition"
          >
            Create your page
          </Link>
        )}
      </div>
    </nav>
  );
}
