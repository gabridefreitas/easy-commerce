const STORAGE_KEY = 'easycommerce-client-id';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `client-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateClientId() {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return stored;
  }

  const id = generateId();
  window.localStorage.setItem(STORAGE_KEY, id);
  return id;
}
