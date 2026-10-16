/**
 * HB+ Admin Promotion Script
 *
 * Usage:
 *   npx ts-node scripts/set-admin.ts <email-or-uid>
 *   npm run set-admin -- <email-or-uid>
 *
 * Example:
 *   npm run set-admin -- admin@hbplus.fit
 */

import { initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config();

const targetInput = process.argv[2];

if (!targetInput) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Missing email or UID argument.');
  console.log('\nUsage:\n  npx ts-node scripts/set-admin.ts <email-or-uid>\n');
  console.log('Example:\n  npx ts-node scripts/set-admin.ts alex@hbplus.fit\n');
  process.exit(1);
}

// Initialize Firebase Admin SDK
function initFirebaseAdmin(): App {
  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    path.resolve(process.cwd(), 'serviceAccountKey.json');

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    return initializeApp({
      credential: cert(serviceAccount),
    });
  }

  // Fallback to Application Default Credentials if service account file is not local
  console.log(
    '\x1b[33m%s\x1b[0m',
    `Note: ${serviceAccountPath} not found. Attempting Application Default Credentials...`
  );
  return initializeApp({
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'hb-plus-demo',
  });
}

async function setAdminRole() {
  const app = initFirebaseAdmin();
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log(`\nPromoting user to ADMIN: ${targetInput}...`);

  let targetUser: UserRecord;

  try {
    if (targetInput.includes('@')) {
      // Validate domain before proceeding
      const allowedDomain = process.env.EXPO_PUBLIC_ALLOWED_DOMAIN || 'hbplus.fit';
      const emailDomain = targetInput.trim().toLowerCase().split('@')[1];
      if (emailDomain !== allowedDomain) {
        console.error(
          '\x1b[31m%s\x1b[0m',
          `Security Rejection: Only @${allowedDomain} accounts may be granted administrator privileges!`
        );
        process.exit(1);
      }
      targetUser = await auth.getUserByEmail(targetInput.trim().toLowerCase());
    } else {
      targetUser = await auth.getUser(targetInput.trim());
    }
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Failed to find user in Firebase Authentication:`, error);
    process.exit(1);
  }

  const uid = targetUser.uid;
  const email = targetUser.email || '';

  // 1. Set custom claims on Firebase Auth token
  await auth.setCustomUserClaims(uid, { role: 'admin' });
  console.log(`✓ Custom auth claim { role: 'admin' } assigned to UID: ${uid}`);

  // 2. Set role: "admin" in Firestore users/{uid} collection
  const userRef = db.collection('users').doc(uid);
  const snap = await userRef.get();

  if (snap.exists) {
    await userRef.update({
      role: 'admin',
      updatedAt: new Date().toISOString(),
    });
  } else {
    await userRef.set({
      uid,
      email,
      displayName: targetUser.displayName || email.split('@')[0] || 'HB+ Admin',
      photoURL: targetUser.photoURL || null,
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    });
  }

  console.log(`✓ Firestore document 'users/${uid}' successfully updated to role: 'admin'.`);
  console.log('\x1b[32m%s\x1b[0m', `\nSUCCESS: User ${email} (${uid}) is now an authorized HB+ Administrator!\n`);
}

setAdminRole().catch((err) => {
  console.error('\x1b[31m%s\x1b[0m', 'Script execution failed:', err);
  process.exit(1);
});
