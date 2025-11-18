import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import { User, LogOut, Menu } from "lucide-react";

const formatQuotaLabel = (quota) => {
  if (!quota?.limit) return null;
  const limit = quota.limit;
  const remainingRaw = typeof quota.remaining === "number" ? quota.remaining : limit;
  const remaining = Math.max(0, Math.min(limit, remainingRaw));
  return `${remaining}/${limit} left today`;
};

export const Navbar = ({ 
  user, 
  onLogout, 
  onSidebarToggle,
  isSidebarOpen,
  className,
  isSuperuser = false,
  onNavigateAdmin,
  onNavigateDashboard,
  quota,
}) => {
  const getUserDisplayName = () => {
    if (!user) return 'User';

    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    } else if (user.username) {
      return user.username;
    } else {
      return user.email || 'User';
    }
  };

  const quotaLabel = formatQuotaLabel(quota);

  return (
    <div 
      className={cn(
        "glass-dark border-b border-cyan-500/20 p-4 flex items-center justify-between shadow-[0_22px_60px_-38px_RGBA(34,211,238,0.55)]",
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="text-cyan-200 hover:bg-cyan-500/10 hover:text-cyan-100"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <img 
            src="/chaicode-white.svg" 
            alt="ChaiCode" 
            className="h-8 w-auto" 
          />
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4 text-cyan-200" />
          <span className="text-slate-300">Welcome,</span>
          <span className="font-semibold text-white">{getUserDisplayName()}</span>
          {quotaLabel && (
            <span className="ml-3 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-cyan-100">
              {quotaLabel}
            </span>
          )}
        </div>
        {isSuperuser && (
          <Button
            variant="outline"
            className="hidden border-cyan-400/30 bg-cyan-500/10 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100 transition hover:bg-cyan-500/20 hover:text-white sm:inline-flex"
            onClick={onNavigateAdmin}
          >
            Admin Panel
          </Button>
        )}
        {onNavigateDashboard && (
          <Button
            variant="outline"
            className="hidden border-cyan-400/30 bg-cyan-500/10 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100 transition hover:bg-cyan-500/20 hover:text-white sm:inline-flex"
            onClick={onNavigateDashboard}
          >
            Dashboard
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="text-cyan-200 hover:bg-cyan-500/10 hover:text-cyan-100"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
