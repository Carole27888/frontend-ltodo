import axios from 'axios'

const BASE_URL = 'http://localhost:5000' 

// Centralized endpoint definitions
export const API_ENDPOINTS = {
  // Auth (placeholders for future)
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
    ME: `${BASE_URL}/api/auth/me`,
  },

  // Todos
  TODOS: {
  GET_ALL: `${BASE_URL}/api/todos`,
  CREATE: `${BASE_URL}/api/todos`,
  GET_BY_ID: (id: string) => `${BASE_URL}/api/todos/${id}`,
  UPDATE: (id: string) => `${BASE_URL}/api/todos/${id}`,
  DELETE: (id: string) => `${BASE_URL}/api/todos/${id}`,
  TOGGLE: (id: string) => `${BASE_URL}/api/todos/${id}/complete`,
  EXPORT_EXCEL: `${BASE_URL}/api/todos/export/excel`,
  EXPORT_PDF: `${BASE_URL}/api/todos/export/pdf`,
},


  // Tasks
  TASKS: {
    GET_ALL: `${BASE_URL}/api/tasks`,
    CREATE: `${BASE_URL}/api/tasks`,
    GET_BY_ID: (id: string) => `${BASE_URL}/api/tasks/${id}`,
    UPDATE: (id: string) => `${BASE_URL}/api/tasks/${id}`,
    DELETE: (id: string) => `${BASE_URL}/api/tasks/${id}`,
    EXPORT_EXCEL: `${BASE_URL}/api/tasks/export/excel`,
    EXPORT_PDF: `${BASE_URL}/api/tasks/export/pdf`,
     

  },
}

// Axios instance with role header
export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'x-user-role': 'admin', 
  },
})
