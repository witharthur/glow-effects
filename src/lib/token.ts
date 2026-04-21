function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/** Returns the Bearer token, auto-generating a UUID on first use */
export function getToken(): string {
  let token = localStorage.getItem('token');
  if (!token) {
    token = generateUUID();
    localStorage.setItem('token', token);
  }
  return token;
}
