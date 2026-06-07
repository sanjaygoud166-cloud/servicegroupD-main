import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return formatDate(date);
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getDocumentTypeLabel(type) {
  const labels = {
    pan_card: 'PAN Card',
    aadhaar_card: 'Aadhaar Card',
    gst_certificate: 'GST Certificate',
    certificate_of_incorporation: 'Certificate of Incorporation',
    trade_license: 'Trade License',
    utility_bill: 'Utility Bill',
    bank_statement: 'Bank Statement',
    address_proof: 'Address Proof',
    tax_document: 'Tax Document',
    identity_proof: 'Identity Proof',
    other: 'Other Document',
  };
  return labels[type] || type;
}

export function getStatusColor(status) {
  const colors = {
    pending: 'bg-warning-100 text-warning-700 border-warning-200',
    under_review: 'bg-blue-100 text-blue-700 border-blue-200',
    verified: 'bg-success-100 text-success-700 border-success-200',
    rejected: 'bg-error-100 text-error-700 border-error-200',
    expired: 'bg-slate-100 text-slate-700 border-slate-200',
    draft: 'bg-slate-100 text-slate-600 border-slate-200',
    submitted: 'bg-primary-100 text-primary-700 border-primary-200',
    additional_info_required: 'bg-warning-100 text-warning-700 border-warning-200',
    in_review: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
}

export function getStatusLabel(status) {
  const labels = {
    pending: 'Pending',
    under_review: 'Under Review',
    verified: 'Verified',
    rejected: 'Rejected',
    expired: 'Expired',
    draft: 'Draft',
    submitted: 'Submitted',
    additional_info_required: 'Info Required',
    in_review: 'In Review',
  };
  return labels[status] || status;
}
