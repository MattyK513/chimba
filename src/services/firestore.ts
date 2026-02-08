import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, onSnapshot, addDoc } from "firebase/firestore";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import type { CollectionReference, DocumentReference, Goal, GoalList, QuerySnapshot, Unsubscribe, UpdateUserProfile, UserInfo } from "../types/firebase";

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

export async function updateLastLogin(user: UserInfo): Promise<void> {
    const { uid } = user;
    const now = serverTimestamp();
    const docRef: DocumentReference = doc(db, `users/${uid}`);
    try {
        await updateDoc(docRef, {lastLoginAt: now});
    } catch(err) {
        throw err;
    }
};

export async function deleteUser(user: UserInfo): Promise<void> {
    const { uid } = user;
    const docRef: DocumentReference = doc(db, `users/${uid}`);
    try {
        await deleteDoc(docRef);
    } catch(err) {
        throw err;
    }
};

export async function updateUserInfo(user: UserInfo, updates: UpdateUserProfile): Promise<void> {
    const { uid } = user;
    const now = serverTimestamp();
    const docRef: DocumentReference = doc(db, `users/${uid}`);
    try {
        await updateDoc(docRef, { ...updates, updatedAt: now})
    } catch(err) {
        throw err;
    }
};

export function subscribeToModule(user: UserInfo, module: string, callback: (snapshot: QuerySnapshot) => void): Unsubscribe {
    const { uid } = user;
    const colRef: CollectionReference = collection(db, `users/${uid}/${module}`);
    return onSnapshot(colRef, callback);
};

export function subscribeToGoals(user: UserInfo, callback: (data: GoalList | null) => void): Unsubscribe {
    const { uid } = user;
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

export async function addGoal(goal: string) {
    const uid = auth.currentUser?.uid;
    const colRef: CollectionReference = collection(db, `users/${uid}/goals`);
    try {
        await addDoc(colRef, {
            title: goal
        });
    } catch(err) {
        throw err;
    }
};