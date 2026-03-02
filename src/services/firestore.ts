import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type { CollectionReference, DocumentReference, Goal, QuerySnapshot, Unsubscribe, UpdateUserProfile, UserInfo, UserProfileFields } from "../types";

export async function createFirestoreUser(user: UserInfo): Promise<void> {
    const { displayName, email, phoneNumber, photoURL, uid } = user;
    const now = serverTimestamp();
    const docRef: DocumentReference = doc(db, `users/${uid}`);
    try {
        await setDoc(docRef, {
            createdAt: now, displayName, email, lastLoginAt: now, phoneNumber, photoURL, updatedAt: now
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

export function subscribeToModule(uid: string, module: string, callback: (snapshot: QuerySnapshot) => void): Unsubscribe {
    const colRef: CollectionReference = collection(db, `users/${uid}/${module}`);
    return onSnapshot(colRef, callback);
};

export function subscribeToGoals(uid: string, callback: (data: Goal[] | null) => void): Unsubscribe {
    const colRef = collection(db, `users/${uid}/goals`);
    return onSnapshot(colRef, (snapshot) => {
        const docList = snapshot.docs;
        const data = docList.map(doc => {
            // TODO: Find a more robust generalizable approach for this. (This was done because TypeScript can't prove that the data in the snapshot query fits my type)
            const { title } = doc.data();
            return {id: doc.id, title};
        });
        callback(data);
    });
};

export async function addGoal(uid: string, goal: string) {
    const colRef: CollectionReference = collection(db, `users/${uid}/goals`);
    try {
        await addDoc(colRef, {
            title: goal
        });
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
        const { email, displayName = null, phoneNumber = null, photoURL = null } = snapshot.data();
        callback({ email, displayName, phoneNumber, photoURL });
    });
};

export async function deleteGoal(uid: string, goalId: string) {
    const docRef = doc(db, `users/${uid}/goals/${goalId}`);
    try {
        await deleteDoc(docRef);
    } catch (err) {
        throw err;
    }
};