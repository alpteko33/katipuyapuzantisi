export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignedTo?: string[];
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Personnel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface NotificationSettings {
  dailyReport: boolean;
  weeklyReport: boolean;
  taskReminders: boolean;
  emailNotifications: boolean;
  reportEmail: string;
  reminderTime: string;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
} 