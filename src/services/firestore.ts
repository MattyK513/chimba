import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import type { CollectionReference, DocumentReference, Goal, QuerySnapshot, Unsubscribe, UpdateUserProfile, User, UserInfo, UserProfileFields } from "../types";

export async function createFirestoreUser(user: User): Promise<void> {
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

export async function deleteFirestoreUser(): Promise<void> {
    const uid = auth.currentUser?.uid;
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

export function subscribeToGoals(user: UserInfo, callback: (data: Goal[] | null) => void): Unsubscribe {
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

export function subscribeToProfileData(user: UserInfo, callback: (data: UserProfileFields | null) => void): Unsubscribe {
    const { uid } = user;
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

export async function deleteGoal(user: UserInfo, goalId: string) {
    const docRef = doc(db, `users/${user.uid}/goals/${goalId}`);
    try {
        await deleteDoc(docRef);
    } catch (err) {
        throw err;
    }
};