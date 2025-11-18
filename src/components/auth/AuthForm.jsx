/**
 * AuthForm - Enhanced authentication form component
 * Supports both login and registration with Remember Me functionality
 * Includes validation, loading states, and accessibility features
 */
"use client";
import React, { useState } from "react";
import { Button } from "../ui/Button";
import { FloatingInput } from "../ui/Input";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const AuthForm = ({
  mode = "login", // "login" or "register"
  onSubmit,
  isLoading = false,
  error = null,
  className,
  googleButton = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    firstname: "",
    lastname: "",
  });
  const [errors, setErrors] = useState({});

  const isLogin = mode === "login";
  const inputStyles = {
    className:
      "h-12 rounded-2xl border-white/10 bg-white/[0.08] px-4 text-sm text-white shadow-[0_18px_38px_-28px_rgba(56,189,248,0.9)] transition focus-visible:border-sky-400/60 focus-visible:ring-2 focus-visible:ring-sky-400/40",
    containerClassName: "rounded-2xl",
    labelClassName:
      "bg-black px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300",
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!isLogin) {
      if (!formData.username) newErrors.username = "Username is required";
      if (!formData.firstname) newErrors.firstname = "First name is required";
      if (!formData.lastname) newErrors.lastname = "Last name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Pass form data and remember me state to parent
    onSubmit({ ...formData, rememberMe });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-black via-[#07090f] to-[#0b1724] p-8 shadow-[0_45px_65px_-30px_rgba(56,189,248,0.6)] backdrop-blur-sm sm:p-10",
        className
      )}
    >
      <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.4),_transparent_60%)] opacity-70" />
      <div className="pointer-events-none absolute inset-0 rounded-[36px] ring-1 ring-white/8" />
      <div className="relative z-10">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold text-white">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          <p className="text-sm text-slate-300">
            {isLogin
              ? "Welcome back! Enter your credentials to continue."
              : "Join the community. Fill in your details to create your account."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {!isLogin && (
            <>
              <FloatingInput
                {...inputStyles}
                label="Username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                error={errors.username}
                autoComplete="username"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FloatingInput
                  {...inputStyles}
                  label="First Name"
                  type="text"
                  value={formData.firstname}
                  onChange={(e) => handleInputChange("firstname", e.target.value)}
                  error={errors.firstname}
                  autoComplete="given-name"
                />
                <FloatingInput
                  {...inputStyles}
                  label="Last Name"
                  type="text"
                  value={formData.lastname}
                  onChange={(e) => handleInputChange("lastname", e.target.value)}
                  error={errors.lastname}
                  autoComplete="family-name"
                />
              </div>
            </>
          )}

          <FloatingInput
            {...inputStyles}
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <div className="relative">
            <FloatingInput
              {...inputStyles}
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={errors.password}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-3 h-8 w-8 rounded-xl bg-white/5 text-sky-200 transition hover:bg-white/10"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex flex-col gap-3 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                className="h-4 w-4 border-white/20 bg-white/10 text-sky-400"
              />
              <Label
                htmlFor="remember-me"
                className="text-xs font-medium tracking-wide text-slate-200 sm:text-sm"
              >
                Remember me for 30 days
              </Label>
            </div>

            {isLogin && (
              <a
                href="#"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300 transition hover:text-sky-200 sm:text-[11px]"
              >
                Forgot password?
              </a>
            )}
          </div>

          {error && (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 shadow-[0_18px_30px_-28px_rgba(248,113,113,0.7)]">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="relative mt-2 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 py-3 text-base font-semibold text-black shadow-[0_28px_60px_-25px_rgba(56,189,248,0.8)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-sky-300/80"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading
              ? isLogin
                ? "Signing in..."
                : "Creating account..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </Button>

          {googleButton && (
            <div className="space-y-3 pt-4">
              <div className="text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">
                {isLogin ? "Sign in with" : "Sign up with"}
              </div>
              <div className="flex justify-center">{googleButton}</div>
            </div>
          )}

          <div className="text-center text-sm text-slate-300">
            <span>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>{" "}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sky-300 hover:text-sky-200"
              onClick={() => (window.location.href = isLogin ? "/Register" : "/Login")}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
