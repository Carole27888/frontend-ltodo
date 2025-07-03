'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: 'todos' | 'tasks';
  onTabChange: (tab: 'todos' | 'tasks') => void;
}

export function DashboardLayout({
  children,
  activeTab,
  onTabChange
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full">
      
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6 bg-muted/20">

        {children}
      </div>
    </div>
  );
}

