import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

let cachedToken: string | null = null;

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/** Initialize token from storage (AsyncStorage on native, localStorage on web) */
export async function initToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  let token: string | null = null;
  
  if (Platform.OS === 'web') {
    token = localStorage.getItem('token');
  } else {
    token = await AsyncStorage.getItem('token');
  }

  if (!token) {
    token = generateUUID();
    if (Platform.OS === 'web') {
      localStorage.setItem('token', token);
    } else {
      await AsyncStorage.setItem('token', token);
    }
  }

  cachedToken = token;
  return token;
}

/** Returns the already initialized Bearer token */
export function getToken(): string {
  if (!cachedToken) {
    // Fallback for cases where getToken is called before initToken finishes
    // This shouldn't happen if App.tsx waits for initToken
    return 'guest-token'; 
  }
  return cachedToken;
}

