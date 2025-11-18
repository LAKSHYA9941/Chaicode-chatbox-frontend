/**
 * useDashboard Hook - Manages dashboard UI state
 * Handles sidebar, course selection, and layout state
 */
import { useState, useEffect } from 'react';

export const useDashboard = (courses = []) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  /**
   * Toggle sidebar visibility
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  /**
   * Handle course selection
   */
  const selectCourse = (course) => {
    console.log('📚 Switching to course:', course.name);
    setSelectedCourse(course);
  };

  /**
   * Animate sidebar items on mount
   */
  useEffect(() => {
    const items = document.querySelectorAll('.sidebar-item');
    items.forEach((item, index) => {
      item.style.animation = `slideInLeft 0.5s ease-out ${index * 0.1}s forwards`;
    });
  }, [isSidebarOpen]);

  return {
    isSidebarOpen,
    selectedCourse,
    toggleSidebar,
    selectCourse
  };
};
