'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateTaskData, Task } from '@/app/types';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  type: z.enum(['work', 'personal', 'urgent', 'low-priority'], {
    required_error: 'Please select a task type',
  }),
  endDate: z.string().min(1, 'End date is required'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskData) => Promise<void>;
  loading: boolean;
}

export function TaskForm({ task, onSubmit, loading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      type: (task?.type as 'work' | 'personal' | 'urgent' | 'low-priority') || 'work',

      endDate: task?.endDate ? format(new Date(task.endDate), 'yyyy-MM-dd') : '',
    },
  });

  const watchedType = watch('type');

  const handleFormSubmit = async (data: TaskFormData) => {
    await onSubmit({
      title: data.title,
      type: data.type,
      endDate: data.endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Enter task title"
          disabled={loading}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={watchedType}
          onValueChange={(value) => setValue('type', value as any)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select task type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="low-priority">Low Priority</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          {...register('endDate')}
          disabled={loading}
          min={format(new Date(), 'yyyy-MM-dd')}
        />
        {errors.endDate && (
          <p className="text-sm text-destructive">{errors.endDate.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {task ? 'Update Task' : 'Create Task'}
      </Button>
    </form>
  );
}