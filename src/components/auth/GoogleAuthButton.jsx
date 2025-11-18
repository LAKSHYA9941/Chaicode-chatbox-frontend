"use client";

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const GoogleGlyph = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 533.5 544.3"
    className="h-5 w-5"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M533.5 278.4c0-18.5-1.5-37.1-4.8-55.1H272.1v104.3h147.3c-6.4 34-25.4 62.7-54.3 82.1v68.2h87.7c51.4-47.3 80.7-117.1 80.7-199.5z"
      fill="#4285f4"
    />
    <path
      d="M272.1 544.3c73.5 0 135.3-24.3 180.4-66.4l-87.7-68.2c-24.4 16.4-55.8 27.4-92.7 27.4-71.2 0-131.8-48-153.4-112.7H27.7v70.6c45.5 90.5 138.8 148.7 244.4 148.7z"
      fill="#34a853"
    />
    <path
      d="M118.7 324.4c-10.4-30.9-10.4-64.2 0-95.1V158.7H27.7c-39.8 79.5-39.8 174.6 0 254.1l91-70.4z"
      fill="#fbbc04"
    />
    <path
      d="M272.1 107.6c38.6-.6 75.9 13.6 104.3 38.8l78-78C393.4 24.7 333.2 0 272.1 0 166.5 0 73.2 58.2 27.7 148.7l91 70.6c21.6-64.7 82.2-111.7 153.4-111.7z"
      fill="#ea4335"
    />
  </svg>
);

export const GoogleAuthButton = ({
  mode = "login",
  onSuccess,
  onError,
  loading = false,
  className,
  text,
}) => {
  const label =
    text || (mode === "login" ? "Sign in with Google" : "Sign up with Google");

  const handleSuccess = async (credentialResponse) => {
    try {
      await onSuccess?.(credentialResponse);
    } catch (err) {
      console.error("Google auth success handler error", err);
    }
  };

  const handleError = (error) => {
    if (onError) {
      onError(error);
    } else {
      console.error("Google auth error", error);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "relative z-10 flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-r",
          "from-white/95 via-sky-100/90 to-white/95 text-sm font-semibold text-slate-900",
          "shadow-[0_28px_60px_-28px_rgba(56,189,248,0.75)] transition",
          "hover:-translate-y-0.5 hover:shadow-[0_30px_68px_-26px_rgba(56,189,248,0.9)]",
          "pointer-events-none",
          loading && "opacity-90"
        )}
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_12px_24px_-18px_rgba(15,23,42,0.6)]">
          <GoogleGlyph />
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-700">
          {label}
        </span>
        {loading && (
          <Loader2 className="absolute right-4 h-4 w-4 animate-spin text-slate-500" />
        )}
      </div>

      <div
        className={cn(
          "absolute inset-0 opacity-0",
          loading ? "pointer-events-none" : "pointer-events-auto"
        )}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          auto_select
          text="continue_with"
          shape="rectangular"
          theme="outline"
          size="large"
          width="100%"
        />
      </div>
    </div>
  );
};

export default GoogleAuthButton;
