import type { Dispatch, SetStateAction } from "react";
import type { Unsubscribe, User } from "firebase/auth";
import type { FirebaseError } from "firebase/app";
import type { CollectionReference, DocumentReference, QuerySnapshot } from "firebase/firestore";

export type AtLeastOne<T> = {
  [K in keyof T]: Pick<T, K>
}[keyof T];

export type AuthStateSetter = Dispatch<SetStateAction<UserInfo | null>>;

export interface AuthStateType {
    loading: boolean | null,
    user: UserInfo | null
}

export interface Goal {
    id: string,
    title: string
}

export type GoalList= Goal[];

export type ModuleName = "goals";

export type SubState = Record<ModuleName, SubStateEntry>;

export interface SubStateEntry {
    count: number,
    unsubscribe: Unsubscribe | null
}

export type UpdateUserProfile = AtLeastOne<UserProfileFields>;

export interface UserDataContextType {
    goals: GoalList | null,
    addDependency: (module: ModuleName) => void
    removeDependency: (module: ModuleName) => void
}

export interface UserInfo {
    displayName: string | null,
    email: string | null,
    emailVerified: boolean,
    phoneNumber: string | null,
    photoURL: string | null,
    uid: string,
    metadata: UserMetadata
}

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