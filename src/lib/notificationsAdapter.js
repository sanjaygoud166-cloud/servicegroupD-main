// Notifications logic for local-only storage (localStorage).
// We derive notifications from current user/business/documents state.

const LS_KEYS = {
  notifications: 'bizease.notifications',
  // Keep a snapshot of documents to detect status changes.
  // This is best-effort and local-only.
  notificationSnapshots: 'bizease.notificationSnapshots',
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function normalizeNotification(n) {
  return {
    id: n.id || uuid(),
    user_id: n.user_id,
    type: n.type,
    title: n.title,
    message: n.message,
    read: Boolean(n.read),
    created_at: n.created_at || new Date().toISOString(),
    meta: n.meta || {},
  };
}

function getAllNotifications() {
  return readJson(LS_KEYS.notifications, []);
}

function setAllNotifications(rows) {
  writeJson(LS_KEYS.notifications, rows);
}

function listNotificationsByUserId(userId) {
  const rows = getAllNotifications();
  return rows
    .filter((n) => n.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function getNotificationUnreadCountByUserId(userId) {
  const rows = getAllNotifications();
  return rows.filter((n) => n.user_id === userId && !n.read).length;
}

function markNotificationRead(notificationId) {
  const rows = getAllNotifications();
  const idx = rows.findIndex((r) => r.id === notificationId);
  if (idx === -1) {
    return { data: null, error: { message: 'Notification not found' } };
  }

  rows[idx] = { ...rows[idx], read: true, updated_at: new Date().toISOString() };
  setAllNotifications(rows);
  return { data: rows[idx], error: null };
}

function seedOrUpdateNotificationsForUser({ userId, businessId, documents, expiryWindowDays = 30 }) {
  // Best-effort generation from local state.

  if (!userId) return { data: [], error: { message: 'Missing userId' } };

  const notifications = getAllNotifications();
  const snapshots = readJson(LS_KEYS.notificationSnapshots, {});
  const userSnapshotKey = `user:${userId}:biz:${businessId || 'none'}`;
  const prevSnapshot = snapshots[userSnapshotKey] || { documentsById: {} };

  const nextSnapshot = { documentsById: {} };
  const created = [];

  const now = new Date();

  const docs = Array.isArray(documents) ? documents : [];

  // Index previous statuses
  for (const d of docs) {
    nextSnapshot.documentsById[d.id] = { status: d.status, expiry_date: d.expiry_date };
  }

  // Helper to avoid duplicates: match by (userId, type, doc_id, createdAt date bucket)
  function alreadyHas(type, docId, bucket) {
    return notifications.some(
      (n) =>
        n.user_id === userId &&
        n.type === type &&
        n.meta?.doc_id === docId &&
        n.meta?.bucket === bucket
    );
  }

  for (const doc of docs) {
    if (!doc?.id) continue;

    // Expiry notifications
    if (doc.expiry_date) {
      const expiry = new Date(doc.expiry_date);
      const diffMs = expiry.getTime() - now.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      // Notify if expiring within window and not already expired.
      if (diffDays >= 0 && diffDays <= expiryWindowDays) {
        // Bucket by expiry date to prevent spam each visit.
        const bucket = `exp:${String(doc.expiry_date).slice(0, 10)}`;

        if (!alreadyHas('document_expiring', doc.id, bucket)) {
          const n = normalizeNotification({
            id: uuid(),
            user_id: userId,
            type: 'document_expiring',
            title: 'Document expiring soon',
            message: `${doc.document_name || 'A document'} will expire on ${new Date(doc.expiry_date).toLocaleDateString('en-IN')}.`,
            read: false,
            created_at: new Date().toISOString(),
            meta: {
              biz_id: businessId || null,
              doc_id: doc.id,
              doc_name: doc.document_name,
              bucket,
              expiry_date: doc.expiry_date,
            },
          });

          notifications.push(n);
          created.push(n);
        }
      }
    }

    // Status change notifications (pending -> verified)
    const prev = prevSnapshot.documentsById[doc.id];
    if (prev?.status !== undefined) {
      const prevStatus = prev.status;
      const currStatus = doc.status;

      const becameVerified = prevStatus !== 'verified' && currStatus === 'verified';
      if (becameVerified) {
        // Bucket by status transition date.
        const bucket = `st:pending2verified:${new Date().toISOString().slice(0, 10)}`;

        if (!alreadyHas('document_verified', doc.id, bucket)) {
          const n = normalizeNotification({
            id: uuid(),
            user_id: userId,
            type: 'document_verified',
            title: 'Document verified',
            message: `${doc.document_name || 'A document'} was verified successfully.`,
            read: false,
            created_at: new Date().toISOString(),
            meta: {
              biz_id: businessId || null,
              doc_id: doc.id,
              doc_name: doc.document_name,
              bucket,
              from_status: prevStatus,
              to_status: currStatus,
            },
          });

          notifications.push(n);
          created.push(n);
        }
      }
    }
  }

  // Persist
  setAllNotifications(notifications);
  snapshots[userSnapshotKey] = nextSnapshot;
  writeJson(LS_KEYS.notificationSnapshots, snapshots);

  return { data: created, error: null };
}

export const notificationsAdapter = {
  listNotificationsByUserId,
  getNotificationUnreadCountByUserId,
  markNotificationRead,
  seedOrUpdateNotificationsForUser,
};

