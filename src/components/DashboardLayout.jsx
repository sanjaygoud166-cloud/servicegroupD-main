import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Building2,
  ShieldCheck,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  Upload,
} from 'lucide-react';
import { useAuth } from '../store/auth';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { dataAdapter } from '../lib/dataAdapter';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Documents', path: '/documents' },
  { icon: Building2, label: 'My Business', path: '/business' },
  { icon: ShieldCheck, label: 'Verification', path: '/verification' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        if (!user?.id) {
          if (mounted) setUnreadCount(0);
          return;
        }
        const count = dataAdapter.notifications.getNotificationUnreadCountByUserId(user.id);
        if (mounted) setUnreadCount(count);
      } catch (e) {
        console.error(e);
        if (mounted) setUnreadCount(0);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">BizEase</span>
          </Link>
          <button
            className="lg:hidden text-slate-400 hover:text-slate-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-600 hover:text-slate-900"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-slate-400 hover:text-slate-600"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/notifications"
                className="relative text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {typeof unreadCount === 'number' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-slate-700">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1"
                    >
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
