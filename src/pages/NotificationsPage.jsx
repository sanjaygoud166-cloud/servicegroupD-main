import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, AlertTriangle, Mail } from 'lucide-react';

import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

import { useAuth } from '../store/auth';
import { dataAdapter } from '../lib/dataAdapter';
import { formatRelativeTime } from '../lib/utils';

function NotificationIcon({ type }) {
  if (type === 'document_verified') return <CheckCircle2 className="w-5 h-5 text-success-700" />;
  if (type === 'document_expiring') return <AlertTriangle className="w-5 h-5 text-warning-700" />;
  return <Mail className="w-5 h-5 text-primary-700" />;
}

export function NotificationsPage() {
  const { user } = useAuth();

  const [business, setBusiness] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const biz = await dataAdapter.getBusinessByUserId(user.id);
        setBusiness(biz);

        const docs = biz ? await dataAdapter.listDocumentsByBusinessId(biz.id) : [];
        setDocuments(docs);

        // Auto-generate notifications from current state
        if (biz) {
          await dataAdapter.notifications.seedOrUpdateNotificationsForUser({
            userId: user.id,
            businessId: biz.id,
            documents: docs,
          });
        }

        const list = await dataAdapter.notifications.listNotificationsByUserId(user.id);
        setNotifications(list);
      } catch (e) {
        console.error(e);
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [user]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const [busyIds, setBusyIds] = useState(new Set());

  const unread = useMemo(() => notifications.filter((n) => !n.read), [notifications]);
  const read = useMemo(() => notifications.filter((n) => n.read), [notifications]);

  const markRead = async (id) => {
    if (!id) return;

    setBusyIds((prev) => new Set(prev).add(id));
    try {
      await dataAdapter.notifications.markNotificationRead(id);
      const list = await dataAdapter.notifications.listNotificationsByUserId(user.id);
      setNotifications(list);
    } catch (e) {
      console.error(e);
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const emptyState = (
    <div className="text-center py-10">
      <Bell className="w-10 h-10 mx-auto mb-3 text-slate-300" />
      <p className="text-slate-700 font-medium">No notifications</p>
      <p className="text-sm text-slate-500 mt-1">You’re all caught up.</p>
    </div>
  );

  const NotificationRow = ({ n }) => {
    const isBusy = busyIds.has(n.id);
    return (
      <button
        type="button"
        onClick={() => {
          if (!n.read) markRead(n.id);
        }}
        className={
          `w-full text-left p-4 rounded-xl border transition-colors ${
            n.read ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-primary-50 border-primary-200 hover:bg-primary-100/60'
          } ${isBusy ? 'opacity-70 cursor-wait' : ''}`
        }
        disabled={isBusy}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
              <NotificationIcon type={n.type} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{n.title}</p>
              <p className="text-sm text-slate-600 mt-1">{n.message}</p>
              <p className="text-xs text-slate-500 mt-2">{formatRelativeTime(n.created_at)}</p>
            </div>
          </div>

          {!n.read ? (
            <Badge variant="default" className="bg-primary-100 text-primary-700 border-primary-200">
              Unread
            </Badge>
          ) : (
            <Badge variant="default" className="bg-slate-100 text-slate-700 border-slate-200">
              Read
            </Badge>
          )}
        </div>
      </button>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
              <p className="text-slate-600 mt-1">
                {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}.
              </p>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-700 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : notifications.length === 0 ? (
          emptyState
        ) : (
          <div className="space-y-6">
            {unread.length > 0 && (
              <Card padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3">
                    <span>Unread</span>
                    <span className="text-xs text-primary-700 bg-primary-100 border border-primary-200 rounded-full px-2 py-1">
                      {unread.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {unread.map((n) => (
                      <NotificationRow key={n.id} n={n} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {read.length > 0 && (
              <Card padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3">
                    <span>Earlier</span>
                    <span className="text-xs text-slate-600 bg-slate-100 border border-slate-200 rounded-full px-2 py-1">
                      {read.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {read.map((n) => (
                      <NotificationRow key={n.id} n={n} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

