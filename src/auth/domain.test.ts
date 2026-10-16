import { isAllowedEmail, ACCESS_RESTRICTED_MESSAGE, getAllowedDomain } from './domain';

describe('isAllowedEmail domain restriction validation', () => {
  const originalEnv = process.env.EXPO_PUBLIC_ALLOWED_DOMAIN;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_ALLOWED_DOMAIN = 'hbplus.fit';
  });

  afterAll(() => {
    process.env.EXPO_PUBLIC_ALLOWED_DOMAIN = originalEnv;
  });

  describe('Valid allowed domain emails', () => {
    it('accepts standard lowercase @hbplus.fit with verified flag', () => {
      expect(isAllowedEmail('alex@hbplus.fit', true)).toBe(true);
      expect(isAllowedEmail('john.doe@hbplus.fit', true)).toBe(true);
      expect(isAllowedEmail('sarah+work@hbplus.fit', true)).toBe(true);
    });

    it('accepts case differences (uppercase, mixed case)', () => {
      expect(isAllowedEmail('ALEX@HBPLUS.FIT', true)).toBe(true);
      expect(isAllowedEmail('John.Doe@HbPlus.Fit', true)).toBe(true);
      expect(isAllowedEmail('ADMIN@hbplus.FIT', true)).toBe(true);
    });

    it('accepts and trims leading/trailing whitespace', () => {
      expect(isAllowedEmail('  alex@hbplus.fit  ', true)).toBe(true);
      expect(isAllowedEmail('\talex@hbplus.fit\n', true)).toBe(true);
    });

    it('accepts valid email via object format with emailVerified === true', () => {
      expect(isAllowedEmail({ email: 'alex@hbplus.fit', emailVerified: true })).toBe(true);
      expect(isAllowedEmail({ email: 'alex@hbplus.fit', email_verified: true })).toBe(true);
    });
  });

  describe('Unverified emails', () => {
    it('rejects when emailVerified parameter is false', () => {
      expect(isAllowedEmail('alex@hbplus.fit', false)).toBe(false);
      expect(isAllowedEmail('admin@hbplus.fit', false)).toBe(false);
    });

    it('rejects when object input has emailVerified: false', () => {
      expect(isAllowedEmail({ email: 'alex@hbplus.fit', emailVerified: false })).toBe(false);
    });

    it('rejects when object input has email_verified: false', () => {
      expect(isAllowedEmail({ email: 'alex@hbplus.fit', email_verified: false })).toBe(false);
    });

    it('rejects when object input omits verified flag', () => {
      expect(isAllowedEmail({ email: 'alex@hbplus.fit' })).toBe(false);
    });
  });

  describe('Lookalike domains (defense against phishing & spoofing)', () => {
    it('rejects prefix lookalikes like x@evilhbplus.fit', () => {
      expect(isAllowedEmail('x@evilhbplus.fit', true)).toBe(false);
      expect(isAllowedEmail('attacker@fakehbplus.fit', true)).toBe(false);
    });

    it('rejects extension lookalikes like x@hbplus.fit.com', () => {
      expect(isAllowedEmail('x@hbplus.fit.com', true)).toBe(false);
      expect(isAllowedEmail('x@hbplus.fit.org', true)).toBe(false);
      expect(isAllowedEmail('x@hbplus.fitness', true)).toBe(false);
    });

    it('rejects dash-separated lookalikes', () => {
      expect(isAllowedEmail('x@hbplus-fit.com', true)).toBe(false);
      expect(isAllowedEmail('x@hbplus-official.fit', true)).toBe(false);
    });
  });

  describe('Subdomains (must enforce exact domain match)', () => {
    it('rejects subdomains like x@sub.hbplus.fit', () => {
      expect(isAllowedEmail('user@sub.hbplus.fit', true)).toBe(false);
      expect(isAllowedEmail('user@mail.hbplus.fit', true)).toBe(false);
      expect(isAllowedEmail('user@dev.hbplus.fit', true)).toBe(false);
      expect(isAllowedEmail('user@corp.hbplus.fit', true)).toBe(false);
    });
  });

  describe('Generic & third-party domains', () => {
    it('rejects @gmail.com, @yahoo.com, @outlook.com', () => {
      expect(isAllowedEmail('user@gmail.com', true)).toBe(false);
      expect(isAllowedEmail('user@yahoo.com', true)).toBe(false);
      expect(isAllowedEmail('user@outlook.com', true)).toBe(false);
      expect(isAllowedEmail('user@hotmail.com', true)).toBe(false);
    });
  });

  describe('Malformed and edge-case inputs', () => {
    it('rejects null and undefined', () => {
      expect(isAllowedEmail(null, true)).toBe(false);
      expect(isAllowedEmail(undefined, true)).toBe(false);
      expect(isAllowedEmail({ email: null, emailVerified: true })).toBe(false);
      expect(isAllowedEmail({ email: undefined, emailVerified: true })).toBe(false);
    });

    it('rejects empty or whitespace-only strings', () => {
      expect(isAllowedEmail('', true)).toBe(false);
      expect(isAllowedEmail('   ', true)).toBe(false);
    });

    it('rejects missing @ or missing domain', () => {
      expect(isAllowedEmail('alex', true)).toBe(false);
      expect(isAllowedEmail('alex@', true)).toBe(false);
      expect(isAllowedEmail('@hbplus.fit', true)).toBe(false);
      expect(isAllowedEmail('hbplus.fit', true)).toBe(false);
    });

    it('rejects multiple @ symbols', () => {
      expect(isAllowedEmail('alex@@hbplus.fit', true)).toBe(false);
      expect(isAllowedEmail('a@b@hbplus.fit', true)).toBe(false);
    });

    it('rejects internal whitespace in local part', () => {
      expect(isAllowedEmail('alex smith@hbplus.fit', true)).toBe(false);
    });
  });

  describe('Environment variable override', () => {
    it('reads custom allowed domain from EXPO_PUBLIC_ALLOWED_DOMAIN', () => {
      process.env.EXPO_PUBLIC_ALLOWED_DOMAIN = 'customdomain.org';
      expect(getAllowedDomain()).toBe('customdomain.org');
      expect(isAllowedEmail('member@customdomain.org', true)).toBe(true);
      expect(isAllowedEmail('alex@hbplus.fit', true)).toBe(false);
    });

    it('falls back to default hbplus.fit when env var is empty', () => {
      delete process.env.EXPO_PUBLIC_ALLOWED_DOMAIN;
      expect(getAllowedDomain()).toBe('hbplus.fit');
      expect(isAllowedEmail('alex@hbplus.fit', true)).toBe(true);
    });
  });

  describe('Access restricted message specification', () => {
    it('matches the exact required error string', () => {
      expect(ACCESS_RESTRICTED_MESSAGE).toBe(
        'Access restricted. Please login using your official domain email.'
      );
    });
  });
});
