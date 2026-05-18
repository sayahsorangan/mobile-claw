import {v4 as uuidv4} from 'uuid';

import {getDb} from './index';

export interface NotificationRow {
  id: string;
  time: string;
  app: string;
  title: string | null;
  text: string | null;
  createdAt: number;
}

export function insertNotification(data: {
  key?: string;
  time: string;
  app: string;
  title: string | null;
  text: string | null;
}): void {
  getDb().executeSync(
    'INSERT OR IGNORE INTO notification (id, time, app, title, text, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [data.key || uuidv4(), data.time, data.app, data.title ?? null, data.text ?? null, Date.now()],
  );
}

export function getAllNotifications(): NotificationRow[] {
  const result = getDb().executeSync('SELECT * FROM notification ORDER BY created_at DESC');
  return (result.rows ?? []).map(r => ({
    id: r.id as string,
    time: r.time as string,
    app: r.app as string,
    title: (r.title as string | null) ?? null,
    text: (r.text as string | null) ?? null,
    createdAt: r.created_at as number,
  }));
}

export function getNotificationsPaginated(page: number, pageSize: number = 20): NotificationRow[] {
  const offset = page * pageSize;
  const result = getDb().executeSync('SELECT * FROM notification ORDER BY created_at DESC LIMIT ? OFFSET ?', [
    pageSize,
    offset,
  ]);
  return (result.rows ?? []).map(r => ({
    id: r.id as string,
    time: r.time as string,
    app: r.app as string,
    title: (r.title as string | null) ?? null,
    text: (r.text as string | null) ?? null,
    createdAt: r.created_at as number,
  }));
}

export function countNotifications(): number {
  const result = getDb().executeSync('SELECT COUNT(*) as total FROM notification');
  return (result.rows?.[0]?.total as number) ?? 0;
}

export function deleteAllNotifications(): void {
  getDb().executeSync('DELETE FROM notification');
}

export function deleteNotificationById(id: string): void {
  getDb().executeSync('DELETE FROM notification WHERE id = ?', [id]);
}
