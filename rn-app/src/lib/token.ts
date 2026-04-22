import AsyncStorage from '@react-native-async-storage/async-storage';

let cachedToken: string | null = null;

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/** 
 * Returns the Bearer token.
 * Note: AsyncStorage is asynchronous, so we must load it on app start.
 * The hooks assume `getToken()` returns synchronously.
 */
export function getToken(): string {
  if (!cachedToken) {
    // Fallback if not initialized
    cachedToken = generateUUID();
    AsyncStorage.setItem('token', cachedToken).catch(console.error);
  }
  return cachedToken;
}

export async function initToken() {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    cachedToken = generateUUID();
    await AsyncStorage.setItem('token', cachedToken);
  } else {
    cachedToken = token;
  }
}
