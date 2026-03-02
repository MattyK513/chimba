import type { Dispatch, SetStateAction } from "react";
import type { Unsubscribe, User } from "firebase/auth";
import type { FirebaseError } from "firebase/app";
import type { CollectionReference, DocumentReference, QuerySnapshot } from "firebase/firestore";

export type { AuthError as AuthErrorType } from "firebase/auth";

export type AtLeastOne<T, Keys extends keyof T = keyof T> =
  Keys extends keyof T
    ? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
    : never;

export type AuthStateSetter = Dispatch<SetStateAction<UserInfo | null>>;

export interface AuthStateType {
    loading: boolean,
    user: UserInfo | null
}

export interface EditableUserProfileFields {
  displayName?: string | null;
  email?: string;
  phoneNumber?: string | null;
  photoURL?: string | null;
}

export interface Goal {
    id: string,
    title: string
}

// Extend this as I build more modules
export type ModuleName = "goals";

export type SubState = Record<ModuleName, SubStateEntry>;

export interface SubStateEntry {
    count: number,
    unsubscribe: Unsubscribe | null
}

export type UpdateUserProfile = AtLeastOne<EditableUserProfileFields>;

export interface UserDataContextType {
    goals: Goal[] | null,
    addDependency: (module: ModuleName) => void
    removeDependency: (module: ModuleName) => void
}

/*export interface UserInfo {
    displayName: string | null,
    email: string | null,
    emailVerified: boolean,
    phoneNumber: string | null,
    photoURL: string | null,
    uid: string,
    metadata: UserMetadata
}*/

export type UserInfo = Pick<
    User,
    "displayName" |
    "email" |
    "emailVerified" |
    "phoneNumber" |
    "photoURL" |
    "uid" |
    "metadata"
>;

export interface UserMetadata {
    createdAt?: string,
    lastLoginAt?: string,
    lastSignInTime?: string,
    creationTime?: string
}

export interface UserProfileFields {
  displayName: string | null;
  email: string;
  phoneNumber: string | null;
  photoURL: string | null;
};

export type { CollectionReference, DocumentReference, FirebaseError, QuerySnapshot, Unsubscribe, User };