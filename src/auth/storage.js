const safeJsonParse = (value) => {
  if (!value || value === 'undefined' || value === 'null') return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const decodeJwtPayload = (token) => {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};

export const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};

export const getStoredAuth = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const user = safeJsonParse(localStorage.getItem('user'));

  if (!token || token === 'null') {
    return { token: null, role: null, user: null };
  }

  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp || payload.exp * 1000 <= Date.now()) {
    clearAuthStorage();
    return { token: null, role: null, user: null };
  }

  if (!user || !user.id) {
    clearAuthStorage();
    return { token: null, role: null, user: null };
  }

  return {
    token,
    role,
    user,
  };
};

export const setStoredAuth = ({ token, role, user }) => {
  if (!token || !role || !user) {
    clearAuthStorage();
    return;
  }

  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('user', JSON.stringify(user));
};
