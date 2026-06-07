import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';

import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CircularProgress } from '../components/ui/Progress';

import { useAuth } from '../store/auth';
import { dataAdapter } from '../lib/dataAdapter';
import { formatDate, getStatusColor, getStatusLabel, getDocumentTypeLabel } from '../lib/utils';

export function VerificationPage() {
  const { user } = useAuth();

  const [business, setBusiness] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const verificationProgress = business?.verification_progress ?? 0;
  const verificationStatus = business?.verification_status ?? 'pending';

  const statusBadge = useMemo(() => {
    return {
      className:
        verificationStatus === 'verified'
          ? 'bg-success-100 text-success-700 border border-success-200'
          : verificationStatus === 'rejected'
            ? 'bg-error-100 text-error-700 border border-error-200'
            : verificationStatus === 'under_review'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-warning-100 text-warning-700 border border-warning-200',
      label:
        verificationStatus === 'verified'
          ? 'Verified'
          : verificationStatus === 'rejected'
            ? 'Rejected'
            : verificationStatus === 'under_review'
              ? 'Under Review'
              : 'Pending',
    };
  }, [verificationStatus]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      setLoading(true);
      setError('');
      try {
        const biz = await dataAdapter.getBusinessByUserId(user.id);
        setBusiness(biz);

        if (biz) {
          const docs = await dataAdapter.listDocumentsByBusinessId(biz.id);
          setDocuments(docs);
        } else {
          setDocuments([]);
        }
      } catch (e) {
        console.error(e);
        setError('Failed to load verification data.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const docSections = useMemo(() => {
    // Read-only checklist view: just group documents by status.
    // (We keep it non-opinionated: no “required list” was defined elsewhere in the repo.)
    const byStatus = {
      pending: [],
      under_review: [],
      verified: [],
      rejected: [],
      expired: [],
      other: [],
    };

    for (const d of documents) {
      const key = byStatus[d.status] ? d.status : 'other';
      byStatus[key].push(d);
    }

    return [
      { key: 'pending', title: 'Pending', icon: Clock, items: byStatus.pending },
      { key: 'under_review', title: 'Under Review', icon: AlertTriangle, items: byStatus.under_review },
      { key: 'verified', title: 'Verified', icon: ShieldCheck, items: byStatus.verified },
      { key: 'rejected', title: 'Rejected', icon: AlertTriangle, items: byStatus.rejected },
      { key: 'expired', title: 'Expired', icon: AlertTriangle, items: byStatus.expired },
      { key: 'other', title: 'Other', icon: FileText, items: byStatus.other },
    ].filter((s) => s.items.length > 0);
  }, [documents]);

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
            Verification
          </motion.h1>
          <p className="text-slate-600 mt-1">Track your business verification progress and document statuses.</p>
        </div>

        {error && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-700">{error}</div>
        )}

        {!business ? (
          <Card padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">No business profile found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Create your business profile first so we can track verification progress.
              </p>
              <Button variant="outline" onClick={() => (window.location.href = '/business')}>
                Go to Business Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Progress */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-4">
                    <span>Verification Progress</span>
                    <Badge variant="default" className={statusBadge.className}>
                      {statusBadge.label}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                    <CircularProgress value={verificationProgress} variant="success" showLabel size={130} />
                    <div className="flex-1">
                      <div className="space-y-2">
                        <div className="text-sm text-slate-500">Progress</div>
                        <div className="text-2xl font-bold text-slate-900">{verificationProgress}% complete</div>
                        <div className="text-sm text-slate-600">
                          Document statuses below update your overall verification progress.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Checklist */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {documents.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-700 font-medium">No documents uploaded yet</p>
                      <p className="text-sm text-slate-500 mt-1">Upload documents to start verification.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {docSections.map((section) => {
                        const Icon = section.icon;
                        return (
                          <div key={section.key} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                                <Icon className="w-4 h-4 text-slate-600" />
                              </div>
                              <div className="text-sm font-semibold text-slate-900">
                                {section.title}{' '}
                                <span className="text-xs font-medium text-slate-500">({section.items.length})</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {section.items.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="p-4 rounded-xl border border-slate-200 bg-white"
                                >
                                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-slate-900 truncate">{doc.document_name}</p>
                                      <p className="text-xs text-slate-500 mt-1">
                                        {getDocumentTypeLabel(doc.document_type)} • {doc.file_type?.toUpperCase?.() || doc.file_type || 'FILE'}
                                      </p>
                                      {doc.expiry_date && (
                                        <p className="text-xs text-slate-500 mt-2">
                                          Expires {formatDate(doc.expiry_date)}
                                        </p>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap md:justify-end">
                                      <Badge variant="default" className={getStatusColor(doc.status)}>
                                        {getStatusLabel(doc.status)}
                                      </Badge>
                                      <div className="text-xs text-slate-500">Uploaded</div>
                                      <div className="text-xs font-medium text-slate-700">
                                        {doc.uploaded_at ? formatDate(doc.uploaded_at) : '—'}
                                      </div>
                                    </div>
                                  </div>

                                  {doc.remarks ? (
                                    <div className="mt-3 text-xs text-slate-600">
                                      <span className="font-medium">Remarks:</span> {doc.remarks}
                                    </div>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

