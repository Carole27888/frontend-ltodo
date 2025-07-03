// User Interface
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Todo {
  _id: string;
  title: string;
  notes?: string;
  completed: boolean; 
  userId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string; 
}


export interface CreateTodoData {
  title: string;
  notes?: string;
  dueDate?: string; 
}


export interface UpdateTodoData {
  title?: string;
  notes?: string;
  isCompleted?: boolean;
}

// Task Interfaces
export interface Task {
  _id: string;
  title: string;
  type: string;
  endDate: string; 
  createdAt: string;
  updatedAt?: string;
  isCompleted: boolean;
}


export interface CreateTaskData {
  title: string;
  type: 'work' | 'personal' | 'urgent' | 'low-priority';
  endDate: string;
}

export interface UpdateTaskData {
  title?: string;
  type?: 'work' | 'personal' | 'urgent' | 'low-priority';
  endDate?: string;
  isCompleted?: boolean;
}
