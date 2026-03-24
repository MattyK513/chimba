import { addDoc, collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { CollectionReference, Goal, Unsubscribe } from "../../types";

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

export async function deleteGoal(uid: string, goalId: string) {
    const docRef = doc(db, `users/${uid}/goals/${goalId}`);
    try {
        await deleteDoc(docRef);
    } catch (err) {
        throw err;
    }
};