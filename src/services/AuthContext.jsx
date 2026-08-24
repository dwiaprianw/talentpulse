import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  currentUser: null,
  userRole: 'guest', // 'guest' | 'manager' | 'admin'
  token: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {}
});

const DEMO_PRESETS = {
  admin: {
    id: 1,
    name: 'Super Admin',
    email: 'admin@talentpulse.id',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    token: 'tp-token-admin-8888'
  },
  manager: {
    id: 2,
    name: 'Account Manager',
    email: 'manager@talentpulse.id',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    token: 'tp-token-manager-5555'
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('tp_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('tp_token') || null;
  });

  const userRole = currentUser?.role || 'guest';
  const isAuthenticated = Boolean(currentUser && userRole !== 'guest');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tp_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tp_user');
    }

    if (token) {
      localStorage.setItem('tp_token', token);
    } else {
      localStorage.removeItem('tp_token');
    }
  }, [currentUser, token]);

  const login = async (credentials) => {
    // 1. Check for quick demo preset string or object
    if (typeof credentials === 'string' && DEMO_PRESETS[credentials]) {
      const user = DEMO_PRESETS[credentials];
      setCurrentUser(user);
      setToken(user.token);
      return user;
    }

    const { email, password, pin, preset } = credentials || {};

    if (preset && DEMO_PRESETS[preset]) {
      const user = DEMO_PRESETS[preset];
      setCurrentUser(user);
      setToken(user.token);
      return user;
    }

    // 2. PIN login check
    if (pin) {
      const cleanPin = String(pin).trim();
      if (cleanPin === '8888') {
        const user = DEMO_PRESETS.admin;
        setCurrentUser(user);
        setToken(user.token);
        return user;
      }
      if (cleanPin === '5555') {
        const user = DEMO_PRESETS.manager;
        setCurrentUser(user);
        setToken(user.token);
        return user;
      }
    }

    // 3. Email / Password check
    if (email) {
      const cleanEmail = String(email).toLowerCase().trim();
      if (cleanEmail.includes('admin')) {
        const user = DEMO_PRESETS.admin;
        setCurrentUser(user);
        setToken(user.token);
        return user;
      }
      if (cleanEmail.includes('manager')) {
        const user = DEMO_PRESETS.manager;
        setCurrentUser(user);
        setToken(user.token);
        return user;
      }
    }

    // 4. API request fallback
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'PIN atau kredensial salah');
      }
      setCurrentUser(data.user);
      setToken(data.token);
      return data.user;
    } catch (err) {
      throw new Error(err.message || 'Gagal autentikasi');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('tp_user');
    localStorage.removeItem('tp_token');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        token,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
