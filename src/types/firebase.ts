import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { ActionFunctionArgs } from "react-router-dom";
import type { Unsubscribe, User } from "firebase/auth";
import type { FirebaseError } from "firebase/app";
import type { CollectionReference, DocumentReference, QuerySnapshot } from "firebase/firestore";

type AtLeastOne<T> = {
  [K in keyof T]: Pick<T, K>
}[keyof T];

type AuthStateSetter = Dispatch<SetStateAction<UserInfo | null>>;

interface AuthProviderProps {
    children: ReactNode
}

interface AuthStateType {
    loading: boolean | null,
    user: UserInfo | null
}

interface Goal {
    id: string,
    title: string
}

type GoalList= Goal[];

type UpdateUserProfile = AtLeastOne<UserProfileFields>;

interface UserInfo {
    displayName: string | null,
    email: string | null,
    emailVerified: boolean,
    phoneNumber: string | null,
    photoURL: string | null,
    uid: string,
    metadata: UserMetadata
}

interface UserMetadata {
    createdAt?: string,
    lastLoginAt?: string,
    lastSignInTime?: string,
    creationTime?: string
}

interface UserProfileFields {
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
};


export type { ActionFunctionArgs, AuthProviderProps, AuthStateSetter, AuthStateType, CollectionReference, DocumentReference, FirebaseError, Goal, GoalList, QuerySnapshot, Unsubscribe, UpdateUserProfile, User, UserInfo };