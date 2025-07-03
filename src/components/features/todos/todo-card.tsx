'use client';

import { useState } from 'react';
import { Todo } from '@/app/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useTodos } from '@/hooks/use-todos';

import { cn } from '@/lib/utils';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export function TodoCard({ todo, onEdit }: TodoCardProps) {
  const [loading, setLoading] = useState(false);
  const { toggleComplete, deleteTodo } = useTodos();

  const handleToggleComplete = async () => {
    setLoading(true);
    const result = await toggleComplete(todo._id, !todo.completed);
    if (!result.success) {
      toast.error(result.error || 'Failed to update todo');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    setLoading(true);
    const result = await deleteTodo(todo._id);
    if (result.success) {
      toast.success('Todo deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete todo');
    }
    setLoading(false);
  };

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        todo.completed && 'bg-muted/50'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={handleToggleComplete}
              disabled={loading}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'font-semibold text-lg leading-tight',
                  todo.completed && 'line-through text-muted-foreground'
                )}
              >
                {todo.title}
              </h3>
              {todo.notes && (
                <p
                  className={cn(
                    'text-sm text-muted-foreground mt-1',
                    todo.completed && 'line-through'
                  )}
                >
                  {todo.notes}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(todo)}
              disabled={loading}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={todo.completed ? 'secondary' : 'default'}>
              {todo.completed ? 'Completed' : 'Pending'}
            </Badge>
          </div>
          <div className="flex flex-col items-end text-xs text-muted-foreground space-y-1">
  <div className="flex items-center">
    <Calendar className="h-3 w-3 mr-1" />
    Created: {todo.createdAt ? format(new Date(todo.createdAt), 'MMM dd, yyyy') : 'N/A'}
  </div>
  <div className="flex items-center">
    <Calendar className="h-3 w-3 mr-1" />
    Due: {todo.dueDate ? format(new Date(todo.dueDate), 'MMM dd, yyyy') : 'N/A'}
  </div>
</div>

        </div>
      </CardContent>
    </Card>
  );
}
