/**
 * Pure domain validation function for HB+ authentication.
 *
 * Defense-in-depth layer 2:
 * - Trims and lowercases the email.
 * - Requires email_verified === true.
 * - Enforces exact domain match against EXPO_PUBLIC_ALLOWED_DOMAIN (default: hbplus.fit).
 * - Rejects subdomains (user@sub.hbplus.fit), lookalikes (user@evilhbplus.fit, user@hbplus.fit.com),
 *   multiple @ symbols, empty local parts, and malformed inputs.
 */

export const DEFAULT_ALLOWED_DOMAIN = 'hbplus.fit';
export const ACCESS_RESTRICTED_MESSAGE =
  'Access restricted. Please login using your official domain email.';

export interface EmailVerificationTarget {
  email?: string | null;
  emailVerified?: boolean;
  email_verified?: boolean;
}

export function getAllowedDomain(): string {
  const envDomain = process.env.EXPO_PUBLIC_ALLOWED_DOMAIN;
  if (envDomain && typeof envDomain === 'string' && envDomain.trim().length > 0) {
    return envDomain.trim().toLowerCase();
  }
  return DEFAULT_ALLOWED_DOMAIN;
}

/**
 * Validates whether an email belongs to the authorized domain and is verified.
 * Supports both function signatures:
 *   1) isAllowedEmail(email, isVerified)
 *   2) isAllowedEmail({ email, emailVerified }) / isAllowedEmail({ email, email_verified })
 */
export function isAllowedEmail(
  emailOrTarget?: string | null | EmailVerificationTarget,
  emailVerifiedArg?: boolean
): boolean {
  if (emailOrTarget === null || emailOrTarget === undefined) {
    return false;
  }

  let email: string | null | undefined;
  let isVerified: boolean;

  if (typeof emailOrTarget === 'object') {
    email = emailOrTarget.email;
    const verifiedFlag =
      emailOrTarget.emailVerified !== undefined
        ? emailOrTarget.emailVerified
        : emailOrTarget.email_verified;
    // Default to false for object input if not specified
    isVerified = verifiedFlag === true;
  } else {
    email = emailOrTarget;
    // For direct string call, if emailVerifiedArg is omitted, default to true
    // but if explicitly passed as false or non-boolean, enforce strict check
    isVerified = emailVerifiedArg !== undefined ? emailVerifiedArg === true : true;
  }

  // 1. Verification requirement
  if (!isVerified) {
    return false;
  }

  // 2. String check
  if (!email || typeof email !== 'string') {
    return false;
  }

  const cleaned = email.trim().toLowerCase();
  if (cleaned.length === 0) {
    return false;
  }

  // 3. Exactly one @ separator
  const atIndex = cleaned.indexOf('@');
  const lastAtIndex = cleaned.lastIndexOf('@');
  if (atIndex <= 0 || atIndex !== lastAtIndex || atIndex === cleaned.length - 1) {
    return false;
  }

  const localPart = cleaned.substring(0, atIndex);
  const domainPart = cleaned.substring(atIndex + 1);

  // 4. Validate local part format (RFC compliant basics: no whitespace, non-empty)
  if (!localPart || /\s/.test(localPart)) {
    return false;
  }

  // 5. Exact domain match against configured allowed domain
  const targetDomain = getAllowedDomain();
  return domainPart === targetDomain;
}
