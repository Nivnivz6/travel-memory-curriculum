import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export const TopNavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-6 h-16 max-w-full mx-auto bg-white/80 backdrop-blur-xl z-50 shadow-sm font-headline tracking-tight">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold text-slate-900 cursor-pointer" onClick={() => navigate("/")}>
          Travel Memory
        </span>
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-semibold py-1 transition-colors border-b-2 ${
                isActive ? "text-primary border-primary" : "text-slate-500 border-transparent hover:text-slate-900"
              }`
            }
          >
            Gallery
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `text-sm font-semibold py-1 transition-colors border-b-2 ${
                isActive ? "text-primary border-primary" : "text-slate-500 border-transparent hover:text-slate-900"
              }`
            }
          >
            Analytics
          </NavLink>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/login")} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          Logout (Alex)
        </button>
      </div>
    </nav>
  );
};
