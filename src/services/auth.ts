import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateEmail, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import type { Unsubscribe, User, UserInfo } from "../types/firebase";

const authFunctions = {
  logIn: logInWithEmailAndPassword,
  logOut,
  register: createAccountWithEmailAndPassword,
  deleteProfile,
  updateUsernameOrPhotoURL,
  updateEmail: updateUserEmail
};

export default authFunctions;

//These functions are Firebase wrappers that assume valid input! Validation should be done prior to calling them.
export function subscribeToAuthState(callback: (user: UserInfo| null) => void): Unsubscribe {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const userInfo: UserInfo = {
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        uid: user.uid,
        metadata: user.metadata
      };
      callback(userInfo);
    } else {
      callback(null);
    }
  });
};

export async function logInWithEmailAndPassword(userEmail: string, password: string): Promise<UserInfo> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
        return mapUserInfo(userCredential.user);
    } catch (err) {
        const code = typeof err === "object" && err !== null && "code" in err
            ? String((err as any).code)
            : undefined;
        throw new Error(translateAuthError(code));
    }
};

export async function logOut(): Promise<void> {
    try {
        await signOut(auth);
    } catch {
        throw new Error("There were issues logging out. Please try again.");
    }
};

export async function createAccountWithEmailAndPassword(userEmail: string, password: string): Promise<UserInfo> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
        return mapUserInfo(userCredential.user);
    } catch (err) {
        const code = typeof err === "object" && err !== null && "code" in err
            ? String((err as any).code)
            : undefined;
        throw new Error(translateAuthError(code));
    }
};

// Should we use auth.currentUser instead of passing user as param?
export async function deleteProfile(): Promise<void | "REAUTH_REQUIRED"> {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user is currently signed in.")
    }

    try {
        await deleteUser(user);
    } catch (err) {
        if (checkReauthIsRequired(err)) {
          return "REAUTH_REQUIRED"
        };
        throw new Error("There was a problem deleting your account. Please try again.")
    }
};

export async function updateUsernameOrPhotoURL(user: User, updates: { displayName?: string | null, photoURL?: string | null }): Promise<void> {
    try {
        await updateProfile(user, updates);
    } catch (err) {
      const code = typeof err === "object" && err !== null && "code" in err
            ? String((err as any).code)
            : undefined;
        throw new Error(translateAuthError(code));
    }
};

export async function updateUserEmail() {
  try {
    await updateEmail;
  } catch {

  }
};

export async function waitForAuth(): Promise<UserInfo | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user ? mapUserInfo(user) : null);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
};

function mapUserInfo(user:User): UserInfo {
  const { displayName, email, emailVerified, phoneNumber, photoURL, uid, metadata } = user;
  return { displayName, email, emailVerified, phoneNumber, photoURL, uid, metadata };
};

function checkReauthIsRequired(err: unknown): boolean {
  const code = typeof err === "object" && err !== null && "code" in err
            ? String((err as any).code)
            : undefined;
  return code === "auth/requires-recent-login";
};

function translateAuthError(code?: string): string {
  switch (code) {
    case "auth/email-already-exists":
      return "An account with this email already exists. Try logging in instead.";

    case "auth/phone-number-already-exists":
      return "An account with this phone number already exists.";

    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";

    case "auth/user-not-found":
      return "No account was found with that email or credentials.";

    case "auth/user-disabled":
      return "This account has been disabled. Please contact support if you believe this is a mistake.";

    case "auth/internal-error":
      return "Something went wrong on our end. Please try again later.";

    case "auth/invalid-password":
      return "Your password must be at least 6 characters long.";

    case "auth/invalid-email":
    case "auth/invalid-email-verified":
      return "Please enter a valid email address.";

    case "auth/invalid-display-name":
      return "Please enter a valid display name.";

    case "auth/invalid-photo-url":
      return "The profile photo URL appears to be invalid.";

    default:
      return "An error occurred. Please try again.";
  }
};