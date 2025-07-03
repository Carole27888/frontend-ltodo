'use client';

import { useState } from 'react';
import { TaskCard } from '@/components/features/tasks/task-card';
import { TaskForm } from '@/components/features/tasks/task-form';
import { useTasks } from '@/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { Task } from '@/app/types';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/config/api';

export default function TasksTab() {
  const { tasks, loading, createTask, updateTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [filterType, setFilterType] = useState<'all' | 'work' | 'personal' | 'urgent' | 'low-priority'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && task.isCompleted) ||
      (filterStatus === 'pending' && !task.isCompleted);
    const matchesType = filterType === 'all' || task.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateTask = async (data: any) => {
    setFormLoading(true);
    const result = await createTask(data);
    if (result.success) {
      setIsCreateOpen(false);
      toast.success('Task created successfully');
    } else {
      toast.error(result.error || 'Failed to create task');
    }
    setFormLoading(false);
  };

  const handleUpdateTask = async (data: any) => {
    if (!editingTask) return;

    setFormLoading(true);
    const result = await updateTask(editingTask._id, data);
    if (result.success) {
      setEditingTask(null);
      toast.success('Task updated successfully');
    } else {
      toast.error(result.error || 'Failed to update task');
    }
    setFormLoading(false);
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      const endpoint =
        format === 'excel'
          ? API_ENDPOINTS.TASKS.EXPORT_EXCEL
          : API_ENDPOINTS.TASKS.EXPORT_PDF;

      const response = await fetch(endpoint);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tasks.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success(`Tasks exported as ${format.toUpperCase()}`);
      } else {
        toast.error('Failed to export tasks');
      }
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="space-y-6 bg-green-50 p-6 rounded-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground">
            Organize your tasks by type and track deadlines
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value="" onValueChange={handleExport}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Export as Excel</SelectItem>
              <SelectItem value="pdf">Export as PDF</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <TaskForm onSubmit={handleCreateTask} loading={formLoading} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="low-priority">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={setEditingTask} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-2">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
              ? 'No tasks match your filters'
              : 'No tasks yet'}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first task to get started'}
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              task={editingTask}
              onSubmit={handleUpdateTask}
              loading={formLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
