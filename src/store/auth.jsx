import { createContext, useContext, useEffect, useState } from 'react';
import { dataAdapter } from '../lib/dataAdapter';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const savedUser = localStorage.getItem("user");

  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }

  setLoading(false);
}, []);

  const refreshSession = async () => {
    const { data: { session } } = await dataAdapter.auth.getSession();
    setSession(session);
    setUser(session?.user ?? null);
  };

  const signUp = async (email, password, fullName, businessName) => {
  try {
    const response = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        businessName,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: { message: data.error } };
    }

    return { error: null };
  } catch (err) {
    return { error: { message: err.message } };
  }
};

  const signIn = async (email, password) => {
  localStorage.setItem(
    "user",
    JSON.stringify({ email })
  );

  setUser({ email });

  return { error: null };
};

  const signOut = async () => {
    await dataAdapter.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

