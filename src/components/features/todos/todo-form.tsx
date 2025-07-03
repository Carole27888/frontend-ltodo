'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { CreateTodoData, Todo } from '@/app/types';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  notes: z.string().max(1000).optional(),
  dueDate: z.date().optional(), 
});

type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (data: CreateTodoData) => Promise<void>;
  loading: boolean;
}

export function TodoForm({ todo, onSubmit, loading }: TodoFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo?.title || '',
      notes: todo?.notes || '',
      dueDate: todo?.dueDate ? new Date(todo.dueDate) : undefined,
    },
  });

  const handleFormSubmit = async (data: TodoFormData) => {
    await onSubmit({
      title: data.title,
      notes: data.notes || undefined,
      dueDate: data.dueDate ? data.dueDate.toISOString() : undefined, 
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} placeholder="Enter todo title" disabled={loading} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Add notes or description"
          disabled={loading}
          rows={3}
        />
        {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date (Optional)</Label>
        <Controller
          control={control}
          name="dueDate"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !field.value && 'text-muted-foreground'
                  }`}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, 'PPP') : 'Pick a due date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => field.onChange(date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {todo ? 'Update Todo' : 'Create Todo'}
      </Button>
    </form>
  );
}
