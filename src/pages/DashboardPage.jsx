import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  Clock,
  AlertCircle,
  Upload,
  Building2,
  Eye,
  Download,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CircularProgress, Progress } from '../components/ui/Progress';
import { useAuth } from '../store/auth';
import { dataAdapter } from '../lib/dataAdapter';
import { formatRelativeTime, formatDate } from '../lib/utils';

export function DashboardPage() {

  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, expired: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const businessData = await dataAdapter.getBusinessByUserId(user.id);
        if (businessData) {
          setBusiness(businessData);

          const documentsData = await dataAdapter.listDocumentsByBusinessId(businessData.id);
          const total = documentsData.length;
          const verified = documentsData.filter((d) => d.status === 'verified').length;
          const pending = documentsData.filter((d) => d.status === 'pending').length;
          const expired = documentsData.filter((d) => d.status === 'expired').length;

          setStats({ total, verified, pending, expired });
          setRecentActivity(documentsData.slice(0, 5));

          const expiringDocs = documentsData.filter(
            (d) => d.expiry_date && new Date(d.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          );
          setReminders(expiringDocs.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);


  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-900"
          >
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}
          </motion.h1>
          <p className="text-slate-600 mt-1">Here's what's happening with your business documents.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Documents', value: stats.total, icon: FileText, color: 'bg-slate-100 text-slate-600', change: '+2 this month' },
            { label: 'Verified', value: stats.verified, icon: ShieldCheck, color: 'bg-success-100 text-success-600', change: `${Math.round((stats.verified / Math.max(stats.total, 1)) * 100)}% verified` },
            { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'bg-warning-100 text-warning-600', change: 'Awaiting verification' },
            { label: 'Expired', value: stats.expired, icon: AlertCircle, color: 'bg-error-100 text-error-600', change: 'Action required' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card padding="lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-2">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Verification Progress */}
        {business && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Business Verification Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <CircularProgress
                    value={business.verification_progress || 0}
                    size={120}
                    variant="primary"
                    showLabel
                  />
                  <div className="flex-1">
                    <div className="space-y-3">
                      {['Basic Details', 'Documents', 'Verification', 'Compliance', 'Final Review'].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            (business.verification_progress || 0) >= (i + 1) * 20
                              ? 'bg-success-100 text-success-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {(business.verification_progress || 0) >= (i + 1) * 20 ? '✓' : i + 1}
                          </div>
                          <span className="text-sm text-slate-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/documents">
                  <Button variant="outline" className="w-full flex flex-col items-center gap-2 h-auto py-4">
                    <Upload className="w-5 h-5" />
                    <span className="text-sm">Upload Document</span>
                  </Button>
                </Link>
                <Link to="/business">
                  <Button variant="outline" className="w-full flex flex-col items-center gap-2 h-auto py-4">
                    <Building2 className="w-5 h-5" />
                    <span className="text-sm">Business Details</span>
                  </Button>
                </Link>
                <Link to="/verification">
                  <Button variant="outline" className="w-full flex flex-col items-center gap-2 h-auto py-4">
                    <Eye className="w-5 h-5" />
                    <span className="text-sm">Verification</span>
                  </Button>
                </Link>
                <Button variant="outline" className="w-full flex flex-col items-center gap-2 h-auto py-4">
                  <Download className="w-5 h-5" />
                  <span className="text-sm">Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity & Reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Recent Activity */}
          <Card padding="lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Link to="/documents" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{activity.document_name}</p>
                          <p className="text-xs text-slate-500">{formatRelativeTime(activity.uploaded_at)}</p>
                        </div>
                      </div>
                      <Badge variant={activity.status === 'verified' ? 'verified' : 'pending'} size="sm">
                        {activity.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Reminders */}
          <Card padding="lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Reminders</CardTitle>
              <Link to="/notifications" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {reminders.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p>No upcoming reminders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reminders.map((reminder, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-warning-100">
                        <AlertTriangle className="w-4 h-4 text-warning-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{reminder.document_name}</p>
                        <p className="text-xs text-slate-500">Expires {formatDate(reminder.expiry_date)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
