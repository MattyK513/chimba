import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { CollectionReference, DocumentReference, QuerySnapshot, Unsubscribe, UpdateUserProfile, UserInfo, UserProfileFields } from "../../types";

export async function createFirestoreUser(user: UserInfo): Promise<void> {
    const { displayName, email, phoneNumber, photoURL, uid } = user;
    const now = serverTimestamp();
    const docRef: DocumentReference = doc(db, `users/${uid}`);
    try {
        await setDoc(docRef, {
            createdAt: now, displayName, email, lastLoginAt: now, phoneNumber, photoURL, updatedAt: now, theme: "dark"
        });
    } catch(err) {
        throw err;
    }
};

export async function updateLastLogin(uid: string): Promise<void> {
    const now = serverTimestamp();
    const docRef: DocumentReference = doc(db, `users/${uid}`);
    try {
        await updateDoc(docRef, {lastLoginAt: now});
    } catch(err) {
        throw err;
    }
};

export async function deleteFirestoreUser(uid: string): Promise<void> {
    const docRef: DocumentReference = doc(db, `users/${uid}`);
    try {
        await deleteDoc(docRef);
    } catch(err) {
        throw err;
    }
};

export async function updateUserInfo(uid: string, updates: UpdateUserProfile): Promise<void> {
    const now = serverTimestamp();
    const docRef: DocumentReference = doc(db, `users/${uid}`);
    try {
        await updateDoc(docRef, { ...updates, updatedAt: now})
    } catch(err) {
        throw err;
    }
};

export function subscribeToProfileData(uid: string, callback: (data: UserProfileFields | null) => void): Unsubscribe {
    const docRef = doc(db, `users/${uid}`);
    return onSnapshot(docRef, snapshot => {
        if (!snapshot.exists()) {
            callback(null);
            return;
        }
        const { email, displayName = null, phoneNumber = null, photoURL = null, theme } = snapshot.data();
        callback({ email, displayName, phoneNumber, photoURL, theme });
    });
};