// src/services/auth.js

const STORAGE_KEY = 'karisma_current_user';

// Daftar dummy accounts
const DUMMY_USERS = [
  {
    email:    'user@karisma.com',
    password: 'user123',
    name:     'User Biasa',
    role:     'user'
  },
  {
    email:    'admin@karisma.com',
    password: 'admin123',
    name:     'Administrator',
    role:     'admin'
  }
];

/**
 * Coba login, kembalikan user object jika berhasil,
 * atau null kalau gagal.
 */
export function login({ email, password }) {
  const u = DUMMY_USERS.find(
    usr => usr.email === email && usr.password === password
  );
  if (!u) return null;

  // jangan simpan password ke storage!
  const { password: _, ...user } = u;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

/** Hapus session */
export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Baca session */
export function getCurrentUser() {
  const j = localStorage.getItem(STORAGE_KEY);
  return j ? JSON.parse(j) : null;
}
