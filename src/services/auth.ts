import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import type { User, UserInfo } from "../types/firebase";

export async function logInWithEmailAndPassword(userEmail: string, password: string): Promise<UserInfo> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
        const { displayName, email, emailVerified, phoneNumber, photoURL, uid, metadata } = userCredential.user;
        return { displayName, email, emailVerified, phoneNumber, photoURL, uid, metadata };
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
        const { displayName, email, emailVerified, phoneNumber, photoURL, uid, metadata } = userCredential.user;
        return { displayName, email, emailVerified, phoneNumber, photoURL, uid, metadata };
    } catch (err) {
        const code = typeof err === "object" && err !== null && "code" in err
            ? String((err as any).code)
            : undefined;
        throw new Error(translateAuthError(code));
    }
};

export async function deleteProfile(user: User): Promise<void> {
    try {
        await deleteUser(user);
    } catch {
        throw new Error("There was a problem deleting your account. Please try again.")
    }
};

export async function updateUsernameOrPhotoURL(user: User, updates: { displayName?: string | null, photoURL?: string | null}): Promise<void> {
    try {
        await updateProfile()
    } catch {

    }
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