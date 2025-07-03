'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CheckSquare, ListTodo, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: 'todos' | 'tasks';
  onTabChange: (tab: 'todos' | 'tasks') => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, logout } = useAuth();

  const navigation = [
    { id: 'todos', name: 'Todos', icon: CheckSquare },
    { id: 'tasks', name: 'Tasks', icon: ListTodo }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
        <p className="text-sm text-gray-600 mt-1">Organize your life</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as 'todos' | 'tasks')}
              className={cn(
                'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-gray-200">
        <SidebarContent />
      </div>
    </>
  );
}
