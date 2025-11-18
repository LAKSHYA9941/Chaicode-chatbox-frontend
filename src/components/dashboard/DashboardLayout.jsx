/**
 * DashboardLayout Component - Main dashboard layout wrapper
 * Combines sidebar, navbar, chat area, and input in a cohesive layout
 */
"use client";
import React from "react";
import { AppShell } from '../layout/AppShell';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ChatArea } from './ChatArea';
import { ChatInput } from './ChatInput';

export const DashboardLayout = ({
  // Sidebar props
  isSidebarOpen,
  onSidebarToggle,
  courses,
  selectedCourse,
  onCourseSelect,
  
  // Navbar props
  user,
  onLogout,
  isSuperuser,
  onNavigateAdmin,
  quota,
  
  // Chat props
  messages,
  isLoading,
  typingMessageId,
  onSendMessage,
  onExampleClick,
  onTypingComplete,
  voiceAgent,
}) => {
  return (
    <AppShell showBackground={false} className="bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={onSidebarToggle}
          courses={courses}
          selectedCourse={selectedCourse}
          onCourseSelect={onCourseSelect}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Navigation Bar */}
          <Navbar
            user={user}
            onLogout={onLogout}
            onSidebarToggle={onSidebarToggle}
            isSidebarOpen={isSidebarOpen}
            isSuperuser={isSuperuser}
            onNavigateAdmin={onNavigateAdmin}
            quota={quota}
          />

          <div className="flex-1 overflow-y-auto">
            <ChatArea
              messages={messages}
              isLoading={isLoading}
              typingMessageId={typingMessageId}
              selectedCourse={selectedCourse}
              onExampleClick={onExampleClick}
              onTypingComplete={onTypingComplete}
            />
          </div>

          {/* Chat Input */}
          <ChatInput
            onSend={onSendMessage}
            isLoading={isLoading}
            placeholder={`Ask about ${selectedCourse?.name}...`}
            voiceAgent={voiceAgent}
          />
        </div>
      </div>
    </AppShell>
  );
};
