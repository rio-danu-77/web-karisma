// src/services/auth.js
let _currentUser = null;

export function login({ email, password }) {
  if (email && password) {
    _currentUser = { name: 'User Dummy', email };
    localStorage.setItem('user', JSON.stringify(_currentUser));
    return _currentUser;
  }
  return null;
}

export function register({ name, email, password }) {
  if (name && email && password) {
    _currentUser = { name, email };
    localStorage.setItem('user', JSON.stringify(_currentUser));
    return true;
  }
  return false;
}

export function getCurrentUser() {
  if (!_currentUser) {
    const stored = localStorage.getItem('user');
    if (stored) _currentUser = JSON.parse(stored);
  }
  return _currentUser;
}

export function logout() {
  _currentUser = null;
  localStorage.removeItem('user');
}
