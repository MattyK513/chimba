import {
    createUserWithEmailAndPassword,
    deleteUser,
    EmailAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../config/firebase";
import { AuthError } from "../errors";
import type { Unsubscribe, User, UserInfo } from "../types";

// Note: functions in this file assume inputs have been validated by the caller.

/**
 * Resolved once Firebase has finished determining the initial auth state.
 * `auth.currentUser` is null during initialization regardless of actual
 * sign-in status — awaiting this ensures we get the real answer.
 */
let authInitPromise: Promise<void> | null = null;

function ensureAuthInitialization(): Promise<void> {
    if (!authInitPromise) {
        authInitPromise = new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, () => {
                unsubscribe();
                resolve();
            });
        });
    }
    return authInitPromise;
}

/**
 * Subscribes to auth state changes, mapping Firebase's `User` to the
 * app-level `UserInfo` shape so the rest of the app stays decoupled
 * from Firebase types.
 *
 * The callback fires immediately with the current state, then again on
 * every subsequent change (login, logout, token refresh).
 *
 * @returns Unsubscribe function.
 */
export function subscribeToAuthState(
    callback: (user: UserInfo | null) => void
): Unsubscribe {
    return onAuthStateChanged(auth, (user) => {
        callback(user ? mapUserInfo(user) : null);
    });
}

/**
 * Gets the current user, waiting for Firebase to finish initializing
 * if necessary. Safe to call from route loaders.
 */
export async function getCurrentUserInfo(): Promise<UserInfo | null> {
    await ensureAuthInitialization();
    const user = auth.currentUser;
    return user ? mapUserInfo(user) : null;
}

export async function logInWithEmailAndPassword(
    email: string,
    password: string
): Promise<UserInfo> {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        return mapUserInfo(user);
    } catch (err) {
        throw normalizeAuthError(err);
    }
}

export async function logOut(): Promise<void> {
    try {
        await signOut(auth);
    } catch (err) {
        throw normalizeAuthError(err, "Couldn't log out. Please try again.");
    }
}

interface ProfileUpdates {
    displayName?: string | null;
    photoURL?: string | null;
}

/**
 * Creates a new account and optionally sets display name / photo URL.
 * Firebase requires a separate `updateProfile` call for these fields.
 */
export async function createAccountWithEmailAndPassword(
    email: string,
    password: string,
    profile?: ProfileUpdates
): Promise<UserInfo> {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        if (profile?.displayName || profile?.photoURL) {
            await updateProfile(user, profile);
        }
        return mapUserInfo(user);
    } catch (err) {
        throw normalizeAuthError(err);
    }
}

/**
 * Deletes the currently signed-in user. May require recent re-authentication.
 */
export async function deleteProfile(): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
        throw new AuthError("auth/no-current-user", "No user is currently signed in.");
    }

    try {
        await deleteUser(user);
    } catch (err) {
        throw normalizeAuthError(err);
    }
}

export async function updateUsernameOrPhotoURL(
    updates: ProfileUpdates
): Promise<UserInfo> {
    const user = auth.currentUser;
    if (!user) {
        throw new AuthError("auth/no-current-user", "You must be signed in to do that.");
    }

    try {
        await updateProfile(user, updates);
        return mapUserInfo(user);
    } catch (err) {
        throw normalizeAuthError(err);
    }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{success: boolean}> {
    const user = auth.currentUser;
    
    if (!user || !user.email) throw new AuthError("auth/no-current-user", "You must be signed in to do that.");

    try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);

        return {success: true};
    } catch (error: any) {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            return {success: false};
        }
        throw error;
    }
}

// Helpers

function mapUserInfo(user: User): UserInfo {
    const { displayName, email, emailVerified, phoneNumber, photoURL, uid, metadata } = user;
    return { displayName, email, emailVerified, phoneNumber, photoURL, uid, metadata };
}

/** Wraps Firebase errors in AuthError; passes through anything else. */
function normalizeAuthError(err: unknown, overrideMessage?: string): AuthError | unknown {
    if (err instanceof FirebaseError) {
        return new AuthError(err.code, overrideMessage ?? translateAuthError(err.code), err);
    }
    return err;
}

function translateAuthError(code: string): string {
    switch (code) {
        // Sign-in
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            // Intentionally vague to prevent account enumeration
            return "Incorrect email or password.";
        case "auth/user-disabled":
            return "This account has been disabled. Contact support if you believe this is a mistake.";
        case "auth/too-many-requests":
            return "Too many attempts. Please wait a moment and try again.";

        // Registration
        case "auth/email-already-in-use":
            return "An account with this email already exists.";
        case "auth/weak-password":
            return "Please choose a stronger password (at least 6 characters).";
        case "auth/operation-not-allowed":
            return "This sign-in method is not enabled. Please contact support.";

        // Action codes (password reset, email verification)
        case "auth/expired-action-code":
            return "This link has expired. Please request a new one.";
        case "auth/invalid-action-code":
            return "This link is invalid or has already been used.";

        // Session / token
        case "auth/requires-recent-login":
            return "For security, please sign in again to continue.";
        case "auth/invalid-user-token":
        case "auth/user-token-expired":
            return "Your session has expired. Please sign in again.";

        // Profile
        case "auth/invalid-photo-url":
            return "That photo URL doesn't look valid.";

        // Infra
        case "auth/network-request-failed":
            return "Network error. Check your connection and try again.";
        case "auth/internal-error":
            return "Something went wrong on our end. Please try again.";

        default:
            return "Something went wrong. Please try again.";
    }
}

// Public API

const authFunctions = {
    logIn: logInWithEmailAndPassword,
    logOut,
    register: createAccountWithEmailAndPassword,
    deleteProfile,
    updateUsernameOrPhotoURL,
};

export default authFunctions;