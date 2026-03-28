import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../config/firebase";
import { AuthError } from "../errors";
import type { Unsubscribe, User, UserInfo } from "../types";

let authInitPromise: Promise<void> | null = null;
// Used to ensure Firebase auth state has resolved before accessing auth.currentUser.
// Firebase initializes auth asynchronously, so accessing currentUser too early can return null.

// Note: Functions in this file assume that inputs have been validated prior to their calling.


/**
 * Subscribes to Firebase authentication state changes.
 *
 * Transforms the Firebase `User` object into the app-level `UserInfo` shape,
 * decoupling the rest of the application from Firebase-specific types.
 *
 * @param callback - Invoked with the current user (or null if signed out).
 *
 * @returns Unsubscribe function that stops the auth listener.
 *
 * Notes:
 * - The callback is invoked immediately upon subscription with the current auth state.
 * - Subsequent auth changes (login, logout, token refresh) will trigger additional calls.
 */
export function subscribeToAuthState(callback: (user: UserInfo| null) => void): Unsubscribe {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const userInfo: UserInfo = mapUserInfo(user);
      callback(userInfo);
    } else {
      callback(null);
    }
  });
};

export function ensureAuthInitialization() {
  if (!authInitPromise) {
    authInitPromise = new Promise(resolve => {
      const unsubscribe = onAuthStateChanged(auth, () => {
        unsubscribe();
        resolve();
      });
    });
  }

  return authInitPromise;
  // Guarantees that Firebase has finished determining auth state before proceeding
};

export async function getCurrentUserInfo(): Promise<UserInfo | null> {
  // Prevents race condition where auth.currentUser is accessed before initialization
  await ensureAuthInitialization();

  const user = auth.currentUser;
  return user ? mapUserInfo(user) : null;
};

export async function logInWithEmailAndPassword(userEmail: string, password: string): Promise<UserInfo> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
        return mapUserInfo(userCredential.user);
    } catch (err) {
      // Normalize Firebase errors into application-level errors
      if (err instanceof FirebaseError) {
        throw new AuthError(err.code, translateAuthError(err.code), err);
      }
      throw err;
    }
};

export async function logOut(): Promise<void> {
    try {
        await signOut(auth);
    } catch (err) {
      const message = "There were issues logging out. Please try again.";
        if (err instanceof FirebaseError) {
          throw new AuthError(err.code, message, err);
        }
        throw err;
    }
};

/**
 * 
 * @param userEmail 
 * @param password 
 * @param optionals 
 * @returns 
 */
export async function createAccountWithEmailAndPassword(userEmail: string, password: string, optionals?: {displayName?: string | null, photoURL?: string | null}): Promise<UserInfo> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
      if (optionals?.displayName || optionals?.photoURL) {
        // A separate call is required to update these fields after account creation
        await updateProfile(userCredential.user, optionals);
      }
      return (mapUserInfo(userCredential.user));
    } catch (err) {
      if (err instanceof FirebaseError) {
        throw new AuthError(err.code, translateAuthError(err.code), err);
      }
      throw err;
    }
};

export async function deleteProfile(): Promise<void> {
    const user = auth.currentUser;

    if (!user) {
      const code = "no-user";
      const message = "No user is currently signed in.";
      throw new AuthError(code, message);
    }

    try {
        await deleteUser(user);
    } catch (err) {
      if (checkReauthIsRequired(err)) {
        const message = "Please log in again to perform this action.";
        throw new AuthError("auth/requires-recent-login", message, err);
      }
        if (err instanceof FirebaseError) {
          throw new AuthError(err.code, translateAuthError(err.code), err)
        }
        throw err;
    }
};

export async function updateUsernameOrPhotoURL(updates: { displayName?: string | null, photoURL?: string | null }): Promise<UserInfo> {
  const user = auth.currentUser;

  if (!user) {
    const code = "unauthorized";
    const message = "User not authenticated";
    throw new AuthError(code, message);
  }
  
  try {
        await updateProfile(user, updates);
        return mapUserInfo(user);
    } catch (err) {
      if (err instanceof FirebaseError) {
        throw new AuthError(err.code, translateAuthError(err.code), err);
      }
      throw err;
    }
};

function mapUserInfo(user:User): UserInfo {
  const { displayName, email, emailVerified, phoneNumber, photoURL, uid, metadata } = user;
  return { displayName, email, emailVerified, phoneNumber, photoURL, uid, metadata };
};

function checkReauthIsRequired(err: unknown): boolean {
  return err instanceof FirebaseError && err.code === "auth/requires-recent-login";
};

function translateAuthError(code?: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/user-disabled":
      return "This account has been disabled. Please contact support if you believe this is a mistake.";

    case "auth/user-not-found":
      return "No account was found with that email or credentials.";

    case "auth/wrong-password":
      return "Invalid username or password";

    case "auth/email-already-in-use":
      return "Please try another email address.";

    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled and must be enabled in the Firebase Console. Please contact support.";

    case "auth/weak-password":
      return "Please choose a stronger password.";

    case "auth/expired-action-code":
      return "Code expired. [REQUEST ANOTHER]";

    case "auth/invalid-action-code":
      return "Invalid code. [REQUEST ANOTHER]";

    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";

    case "auth/internal-error":
      return "Something went wrong on our end. Please try again later.";

    case "auth/invalid-photo-url":
      return "The profile photo URL appears to be invalid.";

    case "auth/invalid-user-token":
      return "Invalid user token";

    case "auth/user-token-expired":
      return "Token expired";

    case "auth/null-user":
      return "Attempted to update a null user";

    case "auth/tenant-id-mismatch":
      return "Attempted to update an unauthenticated user.";

    case "auth/requires-recent-login":
      return "Please sign in again to continue.";

    default:
      return "An error occurred. Please try again.";
  }
};

const authFunctions = {
  logIn: logInWithEmailAndPassword,
  logOut,
  register: createAccountWithEmailAndPassword,
  deleteProfile,
  updateUsernameOrPhotoURL,
  //updateEmail: updateUserEmail
};

export default authFunctions;