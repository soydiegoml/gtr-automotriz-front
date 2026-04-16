import { create } from 'zustand';

interface AdminUser {
  email: string;
  name: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => { success: boolean; error?: string };
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'gtr-admin-auth';

const getStoredUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;

  const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!storedValue) return null;

  try {
    return JSON.parse(storedValue) as AdminUser;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

const persistUser = (user: AdminUser | null) => {
  if (typeof window === 'undefined') return;

  if (user) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

const initialUser = getStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
  adminUser: initialUser,
  isAuthenticated: Boolean(initialUser),
  login: ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      return { success: false, error: 'Ingresa correo y contraseña.' };
    }

    const mockAdminUser: AdminUser = {
      email: normalizedEmail,
      name: 'Administrador'
    };

    persistUser(mockAdminUser);
    set({ adminUser: mockAdminUser, isAuthenticated: true });

    return { success: true };
  },
  logout: () => {
    persistUser(null);
    set({ adminUser: null, isAuthenticated: false });
  }
}));
