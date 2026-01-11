import type { User } from "firebase/auth";
import type { FirebaseError } from "firebase/app";

interface UserMetadata {
    createdAt?: string,
    lastLoginAt?: string,
    lastSignInTime?: string,
    creationTime?: string
}

interface UserInfo {
    displayName: string | null,
    email: string | null,
    emailVerified: boolean,
    phoneNumber: string | null,
    photoURL: string | null,
    uid: string,
    metadata: UserMetadata
}

export type { User, FirebaseError, UserInfo };