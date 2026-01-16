export type TabType = 'dashboard' | 'users' | 'announcements' | 'logs';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  announcementCount: number;
  isBanned: boolean;
}

export interface AdminAnnouncement {
  id: number;
  title: string;
  price: number;
  author: string;
  createdAt: string;
  isActive: boolean;
}

export interface SystemLog {
  id: number;
  action: string;
  message: string;
  username: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalAnnouncements: number;
  newAnnouncementsToday: number;
  recentLogs: SystemLog[];
}

export interface ModalState {
  isOpen: boolean;
  type: 'deleteUser' | 'deleteAnnouncement' | 'toggleBan' | null;
  id: number | null;
  title: string;
  message: string;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
