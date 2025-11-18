/**
 * Dashboard Component - Modular AI Chat Interface
 * Clean, focused component using custom hooks and layout components
 */
"use client";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useChat } from '../../hooks/useChat';
import { useVoiceAgent } from '../../hooks/useVoiceAgent';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { courses } from '../../data/courses';

export default function Dashboard() {
  const { user, token, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  // Custom hooks for modular state management
  const { 
    isSidebarOpen, 
    selectedCourse, 
    toggleSidebar, 
    selectCourse 
  } = useDashboard(courses);
  const [courseList, setCourseList] = useState(courses);
  const [isCourseLoading, setIsCourseLoading] = useState(false);
  
  const {
    messages,
    isLoading,
    typingMessageId,
    sendMessage,
    clearMessages,
    handleTypingComplete,
    appendMessages,
    quota: chatQuota,
  } = useChat({ token });

  const voiceAgent = useVoiceAgent({
    token,
    courseId: selectedCourse?.id,
    onMessages: appendMessages,
  });

  const combinedQuota = voiceAgent.quota ?? chatQuota ?? null;

  /**
   * Redirect to login if not authenticated
   */
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('🔒 User not authenticated, redirecting to login');
      router.push('/Login');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch dynamic courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsCourseLoading(true);
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (res.ok && Array.isArray(data.courses)) {
          const normalized = data.courses.map((c) => ({
            id: c.courseId,
            name: c.name,
            icon: <img src={c.iconUrl || (c.courseId === 'nodejs' ? '/nodeicon.svg' : c.courseId === 'python' ? '/pythonicon.svg' : '/nodeicon.svg')} className="w-6 h-6" alt={c.name} />,
            description: c.description || ''
          }));
          setCourseList(normalized);
          // update selected if none or outdated
          if (!selectedCourse || !normalized.find((x) => x.id === selectedCourse.id)) {
            selectCourse(normalized[0]);
          }
        }
      } catch (e) {
        console.warn('Failed to fetch courses, using static list', e);
      } finally {
        setIsCourseLoading(false);
      }
    };
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handle course selection and clear messages
   */
  const isSuperuser = useMemo(
    () => !!user?.isSuperuser || user?.role === "superadmin",
    [user]
  );

  const handleCourseSelect = (course) => {
    selectCourse(course);
    clearMessages();
  };

  /**
   * Handle message sending
   */
  const handleSendMessage = (query) => {
    sendMessage(query, selectedCourse?.id);
  };

  /**
   * Handle example query clicks
   */
  const handleExampleClick = (example) => {
    sendMessage(example, selectedCourse?.id);
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    console.log('🚪 Logging out from dashboard');
    logout();
  };

  const handleNavigateAdmin = () => {
    router.push('/Admin');
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout
      // Sidebar props
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={toggleSidebar}
      courses={courseList}
      selectedCourse={selectedCourse}
      onCourseSelect={handleCourseSelect}
      // Navbar props
      user={user}
      onLogout={handleLogout}
      isSuperuser={isSuperuser}
      onNavigateAdmin={handleNavigateAdmin}
      quota={combinedQuota}

      // Chat props
      messages={messages}
      isLoading={isLoading}
      typingMessageId={typingMessageId}
      onSendMessage={handleSendMessage}
      onTypingComplete={handleTypingComplete}
      voiceAgent={{
        status: voiceAgent.status,
        recording: voiceAgent.recording,
        processing: voiceAgent.processing,
        error: voiceAgent.error,
        quota: combinedQuota,
        canRecord: voiceAgent.canRecord,
        onStart: voiceAgent.startRecording,
        onStop: voiceAgent.stopRecording,
        onDismissError: voiceAgent.dismissError,
      }}
    />
  );
}