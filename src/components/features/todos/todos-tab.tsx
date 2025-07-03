'use client';

import { useState } from 'react';
import { TodoCard } from '@/components/features/todos/todo-card';
import { TodoForm } from '@/components/features/todos/todo-form';
import { useTodos } from '@/hooks/use-todos';
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
import { Todo } from '@/app/types';
import { toast } from 'sonner';

export function TodosTab() {
  const { todos, loading, createTodo, updateTodo } = useTodos();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filter === 'all' ||
      (filter === 'completed' && todo.completed) ||
      (filter === 'pending' && !todo.completed);
    return matchesSearch && matchesStatus;
  });

  const handleCreateTodo = async (data: any) => {
    setFormLoading(true);
    const result = await createTodo(data);
    if (result.success) {
      setIsCreateOpen(false);
      toast.success('Todo created successfully');
    } else {
      toast.error(result.error || 'Failed to create todo');
    }
    setFormLoading(false);
  };

  const handleUpdateTodo = async (data: any) => {
    if (!editingTodo) return;

    setFormLoading(true);
    const result = await updateTodo(editingTodo._id, data);
    if (result.success) {
      setEditingTodo(null);
      toast.success('Todo updated successfully');
    } else {
      toast.error(result.error || 'Failed to update todo');
    }
    setFormLoading(false);
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      const res = await fetch(`/api/export/todos?format=${format}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `todos.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to export todos');
    }
  };

  return (
    <div className="space-y-6 bg-blue-50 p-6 rounded-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Todos</h1>
          <p className="text-muted-foreground">
            Keep track of your daily todos and mark them done!
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Todo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Todo</DialogTitle>
            </DialogHeader>
            <TodoForm onSubmit={handleCreateTodo} loading={formLoading} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <Select onValueChange={handleExport}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Export" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excel">Export as Excel</SelectItem>
            <SelectItem value="pdf">Export as PDF</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Todo List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredTodos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTodos.map((todo) => (
            <TodoCard key={todo._id} todo={todo} onEdit={setEditingTodo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-2">
            {searchTerm || filter !== 'all'
              ? 'No todos match your filters'
              : 'No todos yet'}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm || filter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first todo to get started'}
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          {editingTodo && (
            <TodoForm
              todo={editingTodo}
              onSubmit={handleUpdateTodo}
              loading={formLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
