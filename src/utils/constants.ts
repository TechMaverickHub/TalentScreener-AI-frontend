export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
export const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760') // 10MB default

export const API_ENDPOINTS = {
  RESUME_UPLOAD: '/api/jobrole/resume-upload/',
  JOB_STORE: '/api/jobrole/upload',
  RESUME_MATCH: '/api/jobrole/resume-match-jobs/',
  LOGIN: '/api/user/login/',
  REGISTER: '/api/user/register/',
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  RESUME_LIST: 'resume_list',
  SELECTED_RESUME: 'selected_resume',
} as const

