import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Building2, Mail, LogOut, Save, AlertTriangle } from 'lucide-react';

import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

import { useAuth } from '../store/auth';
import { dataAdapter } from '../lib/dataAdapter';

export function SettingsPage() {
  const { user, signOut } = useAuth();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [businessName, setBusinessName] = useState('');

  const canSave = useMemo(() => {
    const trimmed = businessName.trim();
    return Boolean(user?.id) && trimmed.length > 0;
  }, [businessName, user?.id]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      setLoading(true);
      setError('');
      try {
        const biz = await dataAdapter.getBusinessByUserId(user.id);
        setBusiness(biz);
        if (biz) {
          setBusinessName(biz.business_name || '');
        } else {
          setBusinessName(user?.user_metadata?.business_name || '');
        }
      } catch (e) {
        console.error(e);
        setError('Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    const trimmed = businessName.trim();
    if (!trimmed) {
      setError('Business name is required.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      if (!business) {
        // Create business profile if missing
        const { data, error: createError } = await dataAdapter.createBusinessProfile(user.id, {
          business_name: trimmed,
        });
        if (createError) {
          setError(createError.message || 'Failed to create business profile.');
          return;
        }
        setBusiness(data);
      } else {
        const { error: updateError } = await dataAdapter.updateBusiness(business.id, {
          business_name: trimmed,
        });
        if (updateError) {
          setError(updateError.message || 'Failed to update business profile.');
          return;
        }
        const nextBiz = await dataAdapter.getBusinessByUserId(user.id);
        setBusiness(nextBiz);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to save settings.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl space-y-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-900"
          >
            Settings
          </motion.h1>
          <p className="text-slate-600 mt-1">Manage your profile and business details.</p>
        </div>

        {error && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-700">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account */}
          <Card padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">Name</span>
                      </div>
                      <div className="text-slate-900 font-semibold truncate mt-1">
                        {user?.user_metadata?.full_name || '—'}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-3">
                    <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-700">Email</div>
                      <div className="text-slate-900 font-semibold break-all mt-1">
                        {user?.email || '—'}
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" onClick={handleSignOut} className="w-full flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Business */}
          <Card padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Business
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="flex-1"
                    onClick={handleSave}
                    loading={submitting}
                    disabled={!canSave || submitting}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save changes
                  </Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => {
                      const next = business?.business_name || user?.user_metadata?.business_name || '';
                      setBusinessName(next);
                      setError('');
                    }}
                    disabled={submitting}
                  >
                    Reset
                  </Button>
                </div>

                <div className="text-xs text-slate-500 leading-relaxed">
                  Updating your business name affects the information shown across Dashboard and Documents.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

