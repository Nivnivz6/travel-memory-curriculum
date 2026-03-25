import React, { useState } from "react";
import { LayoutGrid, User, Lock, Eye, EyeOff, ArrowRight, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface relative overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-container opacity-5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-tertiary opacity-5 blur-[120px]"></div>
      </div>

      <motion.main initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 primary-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <LayoutGrid className="text-white" size={24} />
            </div>
            <span className="text-2xl font-extrabold font-headline tracking-tighter text-on-surface">Travel Memory</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(25,27,35,0.06)] overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface mb-2">Welcome Back</h1>
              <p className="text-on-surface-variant text-sm font-body">Enter your credentials to access your digital assets.</p>
            </div>
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider" htmlFor="username">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                    <User size={20} />
                  </div>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 rounded-lg text-on-surface placeholder:text-outline transition-all duration-200 outline-none"
                    id="username"
                    placeholder="e.g. creative_pixel"
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                    <Lock size={20} />
                  </div>
                  <input
                    className="w-full pl-10 pr-10 py-3 bg-surface-container-low border-0 focus:ring-2 focus:ring-primary/20 rounded-lg text-on-surface placeholder:text-outline transition-all duration-200 outline-none"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface-variant transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface-container-low"
                  id="remember"
                  type="checkbox"
                />
                <label className="ml-2 text-sm text-on-surface-variant font-medium" htmlFor="remember">
                  Keep me logged in
                </label>
              </div>
              <button
                className="w-full primary-gradient text-on-primary font-headline font-bold py-4 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
          <div className="bg-surface-container-low py-6 px-8 text-center">
            <p className="text-sm text-on-surface-variant">
              Don't have an account?
              <button onClick={() => navigate("/signup")} className="text-primary font-bold hover:underline underline-offset-4 ml-1">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-secondary/5 blur-[100px]"></div>
      </div>

      <motion.main initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-container mb-6 shadow-lg shadow-primary/20">
            <LayoutGrid className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Join Travel Memory</h1>
          <p className="text-on-surface-variant font-body leading-relaxed max-w-xs mx-auto">Start managing your image galleries today</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm transition-all duration-300">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant ml-1" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 transition-all duration-200 outline-none"
                  id="username"
                  placeholder="pixel_creator"
                  type="text"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant ml-1" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 transition-all duration-200 outline-none"
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                <input
                  className="w-full pl-12 pr-12 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 transition-all duration-200 outline-none"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button
                className="w-full py-4 bg-primary-container text-on-primary font-bold rounded-lg shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                type="submit"
              >
                Sign Up
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-on-surface-variant text-sm">
            Already have an account?
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1 transition-all"
            >
              Login
            </button>
          </p>
        </div>
      </motion.main>
    </div>
  );
};
