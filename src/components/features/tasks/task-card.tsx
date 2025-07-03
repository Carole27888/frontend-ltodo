'use client';

import { useState } from 'react';
import { Task } from '@/app/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/hooks/use-tasks';
import { cn } from '@/lib/utils';
import { Edit2, Trash2, Calendar, Clock } from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';

const isValidDate = (dateString: string | undefined) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
import { toast } from 'sonner';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const getTaskTypeColor = (type: string) => {
  switch (type) {
    case 'work':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'personal':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'low-priority':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTaskUrgency = (endDate: string | undefined) => {
  if (!endDate || isNaN(new Date(endDate).getTime())) {
    return { status: 'invalid', color: 'text-gray-400' };
  }

  const today = new Date();
  const end = new Date(endDate);
  const tomorrow = addDays(today, 1);

  if (isBefore(end, today)) {
    return { status: 'overdue', color: 'text-red-600' };
  } else if (isBefore(end, tomorrow)) {
    return { status: 'due-today', color: 'text-orange-600' };
  } else if (isBefore(end, addDays(today, 3))) {
    return { status: 'due-soon', color: 'text-yellow-600' };
  }
  return { status: 'normal', color: 'text-muted-foreground' };
};


export function TaskCard({ task, onEdit }: TaskCardProps) {
  const [loading, setLoading] = useState(false);
  const { toggleComplete, deleteTask } = useTasks();
  const urgency = getTaskUrgency(task.endDate);


  const handleToggleComplete = async () => {
    setLoading(true);
    const result = await toggleComplete(task._id, !task.isCompleted);
    if (!result.success) {
      toast.error(result.error || 'Failed to update task');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setLoading(true);
    const result = await deleteTask(task._id);
    if (result.success) {
      toast.success('Task deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete task');
    }
    setLoading(false);
  };

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      task.isCompleted && 'bg-muted/50',
      urgency.status === 'overdue' && !task.isCompleted && 'border-red-200'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={task.isCompleted}
              onCheckedChange={handleToggleComplete}
              disabled={loading}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                'font-semibold text-lg leading-tight',
                task.isCompleted && 'line-through text-muted-foreground'
              )}>
                {task.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={getTaskTypeColor(task.type)}
            >
              {task.type.replace('-', ' ')}
            </Badge>
            <Badge variant={task.isCompleted ? 'secondary' : 'default'}>
              {task.isCompleted ? 'Completed' : 'In Progress'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className={cn('flex items-center', urgency.color)}>
            <Clock className="h-3 w-3 mr-1" />
          Due: {task.endDate ? format(new Date(task.endDate), 'MMM dd, yyyy') : 'N/A'}


            {urgency.status === 'overdue' && !task.isCompleted && (
              <span className="ml-1 font-medium">(Overdue)</span>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {isValidDate(task.createdAt) ? format(new Date(task.createdAt), 'MMM dd') : 'N/A'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}