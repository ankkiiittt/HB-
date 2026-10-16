import { browserLocalPersistence, Persistence } from 'firebase/auth';

/**
 * Web persistence using Firebase browserLocalPersistence (localStorage with fallback).
 */
export function getPlatformPersistence(): Persistence {
  return browserLocalPersistence;
}
