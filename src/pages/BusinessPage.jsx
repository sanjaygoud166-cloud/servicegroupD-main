import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Loader2, ShieldCheck, Pencil, CheckCircle2, PlusCircle, AlertTriangle } from 'lucide-react';

import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

import { useAuth } from '../store/auth';
import { dataAdapter } from '../lib/dataAdapter';

export function BusinessPage() {
  const { user } = useAuth();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [businessName, setBusinessName] = useState('');

  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [verificationProgress, setVerificationProgress] = useState(0);

  const isCreateMode = useMemo(() => !business, [business]);

  const load = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const biz = await dataAdapter.getBusinessByUserId(user.id);
      setBusiness(biz);

      // If business exists, hydrate form
      if (biz) {
        setBusinessName(biz.business_name || '');
        setVerificationStatus(biz.verification_status || 'pending');
        setVerificationProgress(biz.verification_progress || 0);
      } else {
        // Suggest from auth metadata
        setBusinessName(user?.user_metadata?.business_name || '');
        setVerificationStatus('pending');
        setVerificationProgress(0);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to load business profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!user) return;

    setError('');

    const trimmedName = businessName.trim();
    if (!trimmedName) {
      setError('Business name is required.');
      return;
    }

    setSubmitting(true);
    try {
      if (!business) {
        const { data, error: createError } = await dataAdapter.createBusinessProfile(user.id, {
          business_name: trimmedName,
        });
        if (createError) {
          setError(createError.message || 'Failed to create business profile.');
          return;
        }
        setBusiness(data);
      } else {
        const { data: updated, error: updateError } = await dataAdapter.updateBusiness(business.id, {
          business_name: trimmedName,
        });
        if (updateError) {
          setError(updateError.message || 'Failed to update business profile.');
          return;
        }
        setBusiness(updated);
      }

      // Refresh local state from latest business
      const nextBiz = await dataAdapter.getBusinessByUserId(user.id);
      setBusiness(nextBiz);
      setBusinessName(nextBiz?.business_name || trimmedName);
      setVerificationStatus(nextBiz?.verification_status || 'pending');
      setVerificationProgress(nextBiz?.verification_progress || 0);
    } catch (e2) {
      console.error(e2);
      setError('Failed to save business profile.');
    } finally {
      setSubmitting(false);
    }
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

  const verificationBadge = (() => {
    const status = verificationStatus || 'pending';
    const map = {
      pending: { label: 'Pending', className: 'bg-warning-100 text-warning-700 border border-warning-200' },
      verified: { label: 'Verified', className: 'bg-success-100 text-success-700 border border-success-200' },
      rejected: { label: 'Rejected', className: 'bg-error-100 text-error-700 border border-error-200' },
      under_review: { label: 'Under Review', className: 'bg-blue-100 text-blue-700 border border-blue-200' },
    };
    return map[status] || { label: status, className: 'bg-slate-100 text-slate-700 border border-slate-200' };
  })();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-900"
          >
            My Business
          </motion.h1>
          <p className="text-slate-600 mt-1">
            Manage your business profile and track verification progress.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-3">
            <Card padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isCreateMode ? <PlusCircle className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                  {isCreateMode ? 'Create Business Profile' : 'Business Details'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Business Name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Enter your business name"
                      required
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Verification</label>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="default" className={verificationBadge.className}>
                              {verificationBadge.label}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {verificationProgress}% complete
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" className="flex-1" loading={submitting} disabled={submitting}>
                      {isCreateMode ? 'Create profile' : 'Save changes'}
                    </Button>

                    <Link to="/documents" className="flex-1">
                      <Button type="button" variant="outline" className="w-full" disabled={submitting}>
                        Continue to Documents
                      </Button>
                    </Link>
                  </div>

                  {!business && (
                    <div className="mt-2 text-xs text-slate-500 leading-relaxed">
                      <AlertTriangle className="w-4 h-4 inline-block mr-1 text-warning-600" />
                      Create your business profile first so you can upload documents for verification.
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Status */}
          <div className="lg:col-span-2">
            <Card padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Verification Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-success-100 border border-success-200 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-success-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">Progress</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {verificationProgress}%
                          <span className="text-slate-400"> • </span>
                          {verificationBadge.label}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600"
                          style={{ width: `${Math.max(0, Math.min(100, verificationProgress))}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                      Upload documents in <span className="font-medium text-slate-700">Documents</span> to update status.
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <p className="text-sm font-semibold text-slate-900">Next steps</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600">1.</span>
                        Create/save business details
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600">2.</span>
                        Upload PAN / GST / other required documents
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600">3.</span>
                        Wait for verification updates on Dashboard
                      </li>
                    </ul>
                  </div>

                  {submitting && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

