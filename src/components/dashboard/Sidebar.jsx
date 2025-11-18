/**
 * Sidebar Component - Modern dashboard sidebar with course selection
 * Features: Collapsible design, smooth animations, course icons
 * Uses: Your brand colors (#FF6500, #1E3E62, #0B192C)
 */
"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import { ChevronLeft, Menu } from "lucide-react";

export const Sidebar = ({ 
  isOpen, 
  onToggle, 
  courses, 
  selectedCourse, 
  onCourseSelect,
  className 
}) => {
  return (
    <div 
      className={cn(
        "transition-all duration-300 flex flex-col overflow-hidden glass-dark border-r border-cyan-500/20 shadow-[0_25px_60px_-35px_rgba(34,211,238,0.45)]",
        isOpen ? "w-72" : "w-0",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
        <h2 className="font-semibold text-sm tracking-[0.35em] uppercase text-cyan-200">Courses</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="lg:hidden text-cyan-200 hover:bg-cyan-500/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Course List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-900/40">
        {courses.map((course, index) => (
          <Button
            key={course.id}
            variant={selectedCourse?.id === course.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start h-auto p-3 transition-all duration-300 text-slate-200 rounded-xl",
              "sidebar-item animate-in slide-in-from-left-5",
              selectedCourse?.id === course.id 
                ? "bg-gradient-to-r from-cyan-500/70 via-cyan-400/60 to-cyan-600/60 shadow-[0_15px_45px_-20px_rgba(34,211,238,0.65)] border border-cyan-300/60" 
                : "bg-slate-900/40 hover:bg-slate-900/70 border border-transparent text-slate-300 hover:text-white"
            )}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "forwards",
              backgroundColor: 'transparent'
            }}
            onClick={() => onCourseSelect(course)}
          >
            <span className="mr-3 text-xl">{course.icon}</span>
            <span className="font-medium tracking-wide">{course.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
