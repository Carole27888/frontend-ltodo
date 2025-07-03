'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TodosTab } from '@/components/features/todos/todos-tab';

export default function TodosPage() {
  return (
    <DashboardLayout
      activeTab="todos"
      onTabChange={() => {}}
    >
      <TodosTab />
    </DashboardLayout>
  );
}
