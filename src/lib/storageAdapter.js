// Local-only storage adapter (no DB). 
// Designed with a similar interface to a future DB adapter (SQL/Mongo).

const LS_KEYS = {
  users: 'bizease.users',
  businesses: 'bizease.businesses',
  documents: 'bizease.documents',
  sessions: 'bizease.sessions',
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
  // Good enough for local-only usage.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function simpleHash(input) {
  // Local-only placeholder hash. Replace with a real auth approach for production.
  let h = 0;
  const s = String(input);
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return `h_${h}`;
}

function getUsers() {
  return readJson(LS_KEYS.users, []);
}
function setUsers(users) {
  writeJson(LS_KEYS.users, users);
}

function getBusinesses() {
  return readJson(LS_KEYS.businesses, []);
}
function setBusinesses(rows) {
  writeJson(LS_KEYS.businesses, rows);
}

function getDocuments() {
  return readJson(LS_KEYS.documents, []);
}
function setDocuments(rows) {
  writeJson(LS_KEYS.documents, rows);
}

function getSessions() {
  return readJson(LS_KEYS.sessions, {});
}
function setSessions(map) {
  writeJson(LS_KEYS.sessions, map);
}

function normalizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    user_metadata: {
      full_name: user.fullName,
      business_name: user.businessName,
    },
  };
}

function businessFromRow(row) {
  return row;
}

function documentFromRow(row) {
  return row;
}

// Adapter API
export const localStorageAdapter = {
  auth: {
    async getSession() {
      const token = localStorage.getItem('bizease.sessionToken');
      if (!token) return { data: { session: null } };

      const sessions = getSessions();
      const userId = sessions[token];
      if (!userId) return { data: { session: null } };

      const users = getUsers();
      const userRow = users.find((u) => u.id === userId);
      if (!userRow) return { data: { session: null } };

      return {
        data: {
          session: {
            access_token: token,
            user: normalizeUser(userRow),
          },
        },
      };
    },

    async onAuthStateChange() {
      // Minimal implementation; React app listens once in effect.
      // Return a subscription-like object.
      return {
        data: {
          subscription: {
            unsubscribe() {},
          },
        },
      };
    },

    async signUp({ email, password, options }) {
      const users = getUsers();

      if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
        return { data: { user: null }, error: { message: 'User already exists' } };
      }

      const id = uuid();
      const fullName = options?.data?.full_name || '';
      const businessName = options?.data?.business_name || '';

      const userRow = {
        id,
        email,
        passwordHash: simpleHash(password),
        fullName,
        businessName,
        createdAt: new Date().toISOString(),
      };

      users.push(userRow);
      setUsers(users);

      const businesses = getBusinesses();
      const biz = {
        id: uuid(),
        user_id: id,
        business_name: businessName,
        verification_status: 'pending',
        verification_progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email,
      };
      businesses.push(biz);
      setBusinesses(businesses);

      // Optional seed: create a couple of sample documents so dashboard isn’t empty
      const shouldSeed = true;
      if (shouldSeed) {
        const documents = getDocuments();
        const now = Date.now();
        documents.push(
          {
            id: uuid(),
            business_id: biz.id,
            document_type: 'pan_card',
            document_name: 'PAN Card',
            file_url: 'local://seed/pan_card',
            file_type: 'pdf',
            file_size: 12345,
            status: 'pending',
            expiry_date: new Date(now + 45 * 86400000).toISOString().slice(0, 10),
            uploaded_at: new Date(now - 2 * 86400000).toISOString(),
            updated_at: new Date().toISOString(),
            remarks: null,
          },
          {
            id: uuid(),
            business_id: biz.id,
            document_type: 'gst_certificate',
            document_name: 'GST Certificate',
            file_url: 'local://seed/gst_certificate',
            file_type: 'pdf',
            file_size: 22222,
            status: 'verified',
            expiry_date: new Date(now - 5 * 86400000).toISOString().slice(0, 10),
            uploaded_at: new Date(now - 40 * 86400000).toISOString(),
            updated_at: new Date().toISOString(),
            remarks: null,
          }
        );
        setDocuments(documents);
      }

      const token = uuid();
      const sessions = getSessions();
      sessions[token] = id;
      setSessions(sessions);
      localStorage.setItem('bizease.sessionToken', token);

      return {
        data: {
          user: normalizeUser(userRow),
        },
        error: null,
      };
    },

    async signInWithPassword({ email, password }) {
      const users = getUsers();
      const userRow = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
      if (!userRow) return { data: { user: null }, error: { message: 'Invalid credentials' } };

      if (userRow.passwordHash !== simpleHash(password)) {
        return { data: { user: null }, error: { message: 'Invalid credentials' } };
      }

      const token = uuid();
      const sessions = getSessions();
      sessions[token] = userRow.id;
      setSessions(sessions);
      localStorage.setItem('bizease.sessionToken', token);

      return {
        data: {
          user: normalizeUser(userRow),
          session: {
            access_token: token,
            user: normalizeUser(userRow),
          },
        },
        error: null,
      };
    },

    async signOut() {
      const token = localStorage.getItem('bizease.sessionToken');
      localStorage.removeItem('bizease.sessionToken');
      if (token) {
        const sessions = getSessions();
        delete sessions[token];
        setSessions(sessions);
      }
      return { error: null };
    },
  },

  // Business/data methods
  async getBusinessByUserId(userId) {
    const businesses = getBusinesses();
    return businesses.find((b) => b.user_id === userId) || null;
  },

  async createBusinessProfile(userId, { business_name = '', verification_status = 'pending' } = {}) {
    const businesses = getBusinesses();
    const existing = businesses.find((b) => b.user_id === userId);
    if (existing) return { data: existing, error: null };

    const biz = {
      id: uuid(),
      user_id: userId,
      business_name,
      verification_status,
      verification_progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    businesses.push(biz);
    setBusinesses(businesses);

    return { data: biz, error: null };
  },

  async updateBusiness(businessId, fields) {
    const businesses = getBusinesses();
    const idx = businesses.findIndex((b) => b.id === businessId);
    if (idx === -1) return { data: null, error: { message: 'Business not found' } };

    const prev = businesses[idx];
    const next = {
      ...prev,
      ...fields,
      updated_at: new Date().toISOString(),
    };

    businesses[idx] = next;
    setBusinesses(businesses);

    return { data: next, error: null };
  },

  async listDocumentsByBusinessId(businessId) {
    const documents = getDocuments();
    return documents
      .filter((d) => d.business_id === businessId)
      .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
  },

  async uploadOrUpdateDocument({ businessId, document_type, document_name, file, expiry_date, status = 'pending', remarks = null, replaceDocumentId = null }) {
    const documents = getDocuments();

    const uploadedAt = new Date().toISOString();
    const fileUrl = file ? `local://uploads/${file.name}` : 'local://uploads/unknown';
    const fileType = file?.type?.split('/')?.[1] || (file?.name?.split('.')?.pop()?.toLowerCase() || 'pdf');
    const fileSize = file?.size || 0;

    if (replaceDocumentId) {
      const idx = documents.findIndex((d) => d.id === replaceDocumentId);
      if (idx === -1) return { data: null, error: { message: 'Document not found' } };

      const prev = documents[idx];
      const next = {
        ...prev,
        document_type: document_type || prev.document_type,
        document_name: document_name || prev.document_name,
        file_url: fileUrl,
        file_type: fileType,
        file_size: fileSize,
        status,
        expiry_date: expiry_date || prev.expiry_date,
        remarks,
        updated_at: uploadedAt,
      };

      documents[idx] = next;
      setDocuments(documents);
      return { data: next, error: null };
    }

    const doc = {
      id: uuid(),
      business_id: businessId,
      document_type,
      document_name,
      file_url: fileUrl,
      file_type: fileType,
      file_size: fileSize,
      status,
      expiry_date: expiry_date || null,
      uploaded_at: uploadedAt,
      updated_at: uploadedAt,
      remarks,
    };

    documents.push(doc);
    setDocuments(documents);

    return { data: doc, error: null };
  },

  async setDocumentStatus(documentId, status, remarks = null) {
    const documents = getDocuments();
    const idx = documents.findIndex((d) => d.id === documentId);
    if (idx === -1) return { data: null, error: { message: 'Document not found' } };

    const prev = documents[idx];
    const next = {
      ...prev,
      status,
      remarks,
      updated_at: new Date().toISOString(),
    };

    documents[idx] = next;
    setDocuments(documents);
    return { data: next, error: null };
  },

  async deleteDocument(documentId) {
    const documents = getDocuments();
    const filtered = documents.filter((d) => d.id !== documentId);
    if (filtered.length === documents.length) {
      return { data: null, error: { message: 'Document not found' } };
    }
    setDocuments(filtered);
    return { data: true, error: null };
  },

  async updateVerificationProgress(businessId, { verification_status, verification_progress }) {
    const businesses = getBusinesses();
    const idx = businesses.findIndex((b) => b.id === businessId);
    if (idx === -1) return { data: null, error: { message: 'Business not found' } };

    const prev = businesses[idx];
    const next = {
      ...prev,
      verification_status: verification_status ?? prev.verification_status,
      verification_progress: verification_progress ?? prev.verification_progress,
      updated_at: new Date().toISOString(),
    };

    businesses[idx] = next;
    setBusinesses(businesses);
    return { data: next, error: null };
  },
};


