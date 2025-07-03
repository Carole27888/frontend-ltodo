'use client';

import { useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
  password: string;
}

export function useAuth() {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1000));

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    const emailExists = users.some(u => u.email === email);
    if (emailExists) {
      setIsLoading(false);
      return false;
    }

    const newUser: User = { name, email, password };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setIsLoading(false);
    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1000));

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find((u) => u.email === email && u.password === password);

    if (found) {
      const userWithoutPassword = { name: found.name, email: found.email };
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return { user, login, register, logout, isLoading };
}
