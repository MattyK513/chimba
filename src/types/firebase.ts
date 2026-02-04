import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { Unsubscribe, User } from "firebase/auth";
import type { FirebaseError } from "firebase/app";
import type { ActionFunctionArgs } from "react-router-dom";

type AuthStateSetter = Dispatch<SetStateAction<UserInfo | null>>;

interface AuthProviderProps {
    children: ReactNode
}

interface AuthStateType {
    loading: boolean | null,
    user: UserInfo | null
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

interface UserMetadata {
    createdAt?: string,
    lastLoginAt?: string,
    lastSignInTime?: string,
    creationTime?: string
}

export type { ActionFunctionArgs, AuthProviderProps, AuthStateSetter, AuthStateType, FirebaseError, Unsubscribe, User, UserInfo };