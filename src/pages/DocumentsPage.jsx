import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { FileUpload } from '../components/ui/FileUpload';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';

import { useAuth } from '../store/auth';

import { dataAdapter } from '../lib/dataAdapter';
import {
  formatDate,
  formatFileSize,
  getDocumentTypeLabel,
  getStatusColor,
  getStatusLabel,
} from '../lib/utils';

export function DocumentsPage() {
  const { user } = useAuth();

  const [business, setBusiness] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [uploadMode, setUploadMode] = useState('new'); // 'new' | 'replace'
  const [replaceDocumentId, setReplaceDocumentId] = useState(null);

  const [documentType, setDocumentType] = useState('pan_card');
  const [documentName, setDocumentName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [remarks, setRemarks] = useState('');
  const [file, setFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);

  const documentTypeOptions = useMemo(
    () => [
      { value: 'pan_card', label: 'PAN Card' },
      { value: 'aadhaar_card', label: 'Aadhaar Card' },
      { value: 'gst_certificate', label: 'GST Certificate' },
      { value: 'certificate_of_incorporation', label: 'Certificate of Incorporation' },
      { value: 'trade_license', label: 'Trade License' },
      { value: 'utility_bill', label: 'Utility Bill' },
      { value: 'bank_statement', label: 'Bank Statement' },
      { value: 'address_proof', label: 'Address Proof' },
      { value: 'tax_document', label: 'Tax Document' },
      { value: 'identity_proof', label: 'Identity Proof' },
      { value: 'other', label: 'Other Document' },
    ],
    []
  );

  const statusOptions = useMemo(
    () => [
      { value: 'pending', label: getStatusLabel('pending') },
      { value: 'under_review', label: getStatusLabel('under_review') },
      { value: 'verified', label: getStatusLabel('verified') },
      { value: 'rejected', label: getStatusLabel('rejected') },
      { value: 'expired', label: getStatusLabel('expired') },
    ],
    []
  );

  const loadBusinessAndDocuments = async () => {
    if (!user) return;

    setLoading(true);
    setError('');
    try {
      const businessData = await dataAdapter.getBusinessByUserId(user.id);
      if (!businessData) {
        setBusiness(null);
        setDocuments([]);
        return;
      }

      setBusiness(businessData);
      const docs = await dataAdapter.listDocumentsByBusinessId(businessData.id);
      setDocuments(docs);
    } catch (e) {
      console.error(e);
      setError('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinessAndDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const resetForm = () => {
    setUploadMode('new');
    setReplaceDocumentId(null);
    setDocumentType('pan_card');
    setDocumentName('');
    setExpiryDate('');
    setStatus('pending');
    setRemarks('');
    setFile(null);
  };

  const refreshDocuments = async (nextBusinessId) => {
    const b = nextBusinessId || business?.id;
    if (!b) return;
    const docs = await dataAdapter.listDocumentsByBusinessId(b);
    setDocuments(docs);
  };

  const handleStartReplace = (doc) => {
    setUploadMode('replace');
    setReplaceDocumentId(doc.id);
    setDocumentType(doc.document_type || 'other');
    setDocumentName(doc.document_name || '');
    setExpiryDate(doc.expiry_date || '');
    setStatus(doc.status || 'pending');
    setRemarks(doc.remarks || '');
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!business) {
      setError('Business not found. Please create your business profile first.');
      return;
    }

    if (!file) {
      setError('Please upload a document file.');
      return;
    }

    if (!documentType) {
      setError('Select document type.');
      return;
    }

    setSubmitting(true);
    try {
      const { error: submitError } = await dataAdapter.uploadOrUpdateDocument({
        businessId: business.id,
        document_type: documentType,
        document_name: documentName || getDocumentTypeLabel(documentType),
        file,
        expiry_date: expiryDate ? new Date(expiryDate).toISOString().slice(0, 10) : null,
        status,
        remarks: remarks?.trim() ? remarks.trim() : null,
        replaceDocumentId: uploadMode === 'replace' ? replaceDocumentId : null,
      });

      if (submitError) {
        setError(submitError.message || 'Failed to upload document.');
        return;
      }

      await refreshDocuments();
      resetForm();
    } catch (e2) {
      console.error(e2);
      setError('Failed to upload document.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetStatus = async (docId, nextStatus) => {
    setError('');
    if (!docId) return;

    try {
      const nextRemarks = nextStatus === 'rejected' ? 'Rejected - please review.' : null;
      const { error: statusError } = await dataAdapter.setDocumentStatus(docId, nextStatus, nextRemarks);
      if (statusError) {
        setError(statusError.message || 'Failed to update status.');
        return;
      }
      await refreshDocuments();
    } catch (e) {
      console.error(e);
      setError('Failed to update status.');
    }
  };

  const openDeleteConfirm = (docId) => {
    setConfirmDeleteId(docId);
    setConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    setConfirmDeleteLoading(true);
    setError('');
    try {
      const { error: deleteError } = await dataAdapter.deleteDocument(confirmDeleteId);
      if (deleteError) {
        setError(deleteError.message || 'Failed to delete document.');
        return;
      }
      await refreshDocuments();
      setConfirmDeleteOpen(false);
      setConfirmDeleteId(null);
    } catch (e) {
      console.error(e);
      setError('Failed to delete document.');
    } finally {
      setConfirmDeleteLoading(false);
    }
  };

  const emptyState = (
    <div className="text-center py-10">
      <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
      <p className="text-slate-700 font-medium">No documents yet</p>
      <p className="text-sm text-slate-500 mt-1">Upload a document to start verification.</p>
    </div>
  );

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
      <div className="space-y-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-900"
          >
            Documents
          </motion.h1>
          <p className="text-slate-600 mt-1">
            Upload, manage, and update verification status for your business documents.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-sm text-error-700">
            {error}
          </div>
        )}

        {!business ? (
          <Card padding="lg">
            <CardHeader>
              <CardTitle>No business profile found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Create your business profile to start uploading documents.</p>
              <Link to="/business">
                <Button className="w-full md:w-auto">Go to Business</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Upload / Add */}
            <div className="lg:col-span-2">
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>{uploadMode === 'replace' ? 'Replace Document' : 'Upload Document'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        label="Document Type"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        options={documentTypeOptions}
                      />
                      <Input
                        label="Expiry Date"
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>

                    <Input
                      label="Document Name"
                      placeholder={getDocumentTypeLabel(documentType)}
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                    />

                    <Textarea
                      label="Remarks (optional)"
                      placeholder="Add any notes for verification"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={3}
                    />

                    <Select
                      label="Initial Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      options={statusOptions}
                    />

                    <FileUpload
                      label="Upload File"
                      selectedFile={file}
                      onFileSelect={setFile}
                      onFileRemove={() => setFile(null)}
                      helperText={
                        uploadMode === 'replace'
                          ? 'Uploading will replace the selected document content.'
                          : 'Upload a document file to add it to your list.'
                      }
                    />

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button type="submit" className="flex-1" loading={submitting} disabled={submitting}>
                        {uploadMode === 'replace' ? 'Replace' : 'Upload'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={resetForm}
                        disabled={submitting}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Quick instructions */}
              <div className="mt-4 text-xs text-slate-500 leading-relaxed">
                Tip: Use <b>Replace</b> to update an existing document. Status changes update your dashboard counts.
              </div>
            </div>

            {/* Documents list */}
            <div className="lg:col-span-3">
              <Card padding="lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Document List</CardTitle>
                  <div className="text-sm text-slate-500">{documents.length} items</div>
                </CardHeader>
                <CardContent>
                  {documents.length === 0 ? (
                    emptyState
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl border border-slate-200 bg-white"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center border border-primary-100">
                                <FileText className="w-5 h-5 text-primary-600" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{doc.document_name}</p>
                                <p className="text-xs text-slate-500">
                                  {getDocumentTypeLabel(doc.document_type)} • {doc.file_type?.toUpperCase() || 'FILE'}
                                  {doc.file_size ? ` • ${formatFileSize(doc.file_size)}` : ''}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2 items-center">
                                  <Badge
                                    variant="default"
                                    className={
                                      // Badge component may not support className variants in every impl; still safe to provide.
                                      `border ${getStatusColor(doc.status).replace('border-', 'border-')}`
                                    }
                                  >
                                    {getStatusLabel(doc.status)}
                                  </Badge>
                                  {doc.expiry_date && (
                                    <Badge variant="default" className="bg-slate-50 border border-slate-200 text-slate-700">
                                      Expires {formatDate(doc.expiry_date)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 flex-wrap md:justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartReplace(doc)}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Replace
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteConfirm(doc.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                            <div className="flex flex-wrap gap-2">
                              <Button type="button" size="sm" variant="outline" onClick={() => handleSetStatus(doc.id, 'pending')}>
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Pending
                              </Button>
                              <Button type="button" size="sm" variant="outline" onClick={() => handleSetStatus(doc.id, 'under_review')}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Review
                              </Button>
                              <Button type="button" size="sm" variant="outline" onClick={() => handleSetStatus(doc.id, 'verified')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Verified
                              </Button>
                              <Button type="button" size="sm" variant="outline" onClick={() => handleSetStatus(doc.id, 'rejected')}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                              {doc.expiry_date && (
                                <Button type="button" size="sm" variant="outline" onClick={() => handleSetStatus(doc.id, 'expired')}>
                                  <AlertTriangle className="w-4 h-4 mr-2" />
                                  Expired
                                </Button>
                              )}
                            </div>
                            {doc.remarks ? (
                              <div className="text-xs text-slate-600 max-w-[60ch]">
                                <span className="font-medium">Remarks:</span> {doc.remarks}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-500">No remarks</div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <Modal
          isOpen={confirmDeleteOpen}
          onClose={() => {
            if (!confirmDeleteLoading) {
              setConfirmDeleteOpen(false);
              setConfirmDeleteId(null);
            }
          }}
          title="Delete document?"
          description="This action cannot be undone."
          size="sm"
        >
          <div className="space-y-4">
            <div className="text-sm text-slate-600">
              Are you sure you want to delete this document?
            </div>
            {error && <div className="text-sm text-error-600">{error}</div>}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  if (!confirmDeleteLoading) {
                    setConfirmDeleteOpen(false);
                    setConfirmDeleteId(null);
                  }
                }}
                disabled={confirmDeleteLoading}
              >
                Cancel
              </Button>
              <Button type="button" className="flex-1" loading={confirmDeleteLoading} onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

