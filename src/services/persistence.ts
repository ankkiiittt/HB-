import type { Persistence } from 'firebase/auth';

/**
 * Platform persistence resolution interface.
 * Implemented in persistence.web.ts and persistence.native.ts.
 */
export declare function getPlatformPersistence(): Persistence | undefined;
