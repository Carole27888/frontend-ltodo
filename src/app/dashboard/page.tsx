'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { TodosTab } from '@/components/features/todos/todos-tab';
import TasksPage from '@/components/features/tasks/TasksTab';
import { ProtectedRoute } from '@/components/layout/protected-route';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'todos' | 'tasks'>('todos');

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-muted/20 ml-64">
          <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
          {activeTab === 'todos' && <TodosTab />}
          {activeTab === 'tasks' && <TasksPage />}
        </div>
      </div>
    </ProtectedRoute>
  );
}
