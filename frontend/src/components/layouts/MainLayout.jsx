// src/components/layout/MainLayout.jsx
import Navbar from "./Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {children}
    </div>
  );
}
