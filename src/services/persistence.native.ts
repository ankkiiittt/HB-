import * as SecureStore from 'expo-secure-store';
// In React Native environment, firebase/auth exports getReactNativePersistence
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getReactNativePersistence } = require('firebase/auth');

/**
 * SecureStore storage adapter adhering to the AsyncStorage-compatible interface
 * required by Firebase getReactNativePersistence.
 * Ensures access tokens and refresh tokens are encrypted at rest on device.
 */
export const secureStorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn('SecureStore setItem failed:', error);
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn('SecureStore removeItem failed:', error);
    }
  },
};

export function getPlatformPersistence() {
  if (typeof getReactNativePersistence === 'function') {
    return getReactNativePersistence(secureStorageAdapter);
  }
  return undefined;
}
