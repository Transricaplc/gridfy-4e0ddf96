/**
 * Gridfy Unified Notification System
 * Format: [Gridfy Icon] [Urgency: ALERT | WARNING | INFO] + [Message] + [Deep link]
 */

export type NotificationUrgency = 'ALERT' | 'WARNING' | 'INFO';

export interface GridfyNotification {
  id: string;
  urgency: NotificationUrgency;
  title: string;
  message: string;
  deepLink: string; // ViewId or route
  timestamp: Date;
  module: string;
  read: boolean;
}

const urgencyEmoji: Record<NotificationUrgency, string> = {
  ALERT: '🚨',
  WARNING: '⚠️',
  INFO: 'ℹ️',
};

export function formatNotification(n: GridfyNotification): string {
  return `${urgencyEmoji[n.urgency]} [${n.urgency}] ${n.message}`;
}

export function createNotification(
  urgency: NotificationUrgency,
  title: string,
  message: string,
  deepLink: string,
  module: string
): GridfyNotification {
  return {
    id: crypto.randomUUID(),
    urgency,
    title,
    message,
    deepLink,
    timestamp: new Date(),
    module,
    read: false,
  };
}
