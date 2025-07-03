'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import TasksTab from '@/components/features/tasks/TasksTab';

export default function TasksPage() {
  return (
    <DashboardLayout
      activeTab="tasks"
      onTabChange={() => {}}
    >
      <TasksTab />
    </DashboardLayout>
  );
}
