// Single entrypoint for the app’s data layer.
// Swap this implementation later with a SQL/Mongo adapter without changing UI code.

import { localStorageAdapter } from './storageAdapter';

import { notificationsAdapter } from './notificationsAdapter';

export const dataAdapter = {
  auth: localStorageAdapter.auth,
  getBusinessByUserId: localStorageAdapter.getBusinessByUserId,
  createBusinessProfile: localStorageAdapter.createBusinessProfile,
  updateBusiness: localStorageAdapter.updateBusiness,
  listDocumentsByBusinessId: localStorageAdapter.listDocumentsByBusinessId,
  uploadOrUpdateDocument: localStorageAdapter.uploadOrUpdateDocument,
  setDocumentStatus: localStorageAdapter.setDocumentStatus,
  deleteDocument: localStorageAdapter.deleteDocument,
  updateVerificationProgress: localStorageAdapter.updateVerificationProgress,

  notifications: {
    listNotificationsByUserId: notificationsAdapter.listNotificationsByUserId,
    getNotificationUnreadCountByUserId: notificationsAdapter.getNotificationUnreadCountByUserId,
    markNotificationRead: notificationsAdapter.markNotificationRead,
    seedOrUpdateNotificationsForUser: notificationsAdapter.seedOrUpdateNotificationsForUser,
  },
};



