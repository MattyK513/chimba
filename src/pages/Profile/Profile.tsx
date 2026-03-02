import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { subscribeToProfileData } from "../../services/firestore";
import useAuth from "../../hooks/useAuth";
import { AuthError } from "../../errors";
import type { UserProfileFields } from "../../types/firebase";
import { deleteFirestoreUser } from "../../services/firestore";
import styles from "./Profile.module.css";

export default function Profile() {
    const { deleteProfile, logOut, user } = useAuth();
    console.log(user?.displayName)
    if (!user) throw new AuthError("unauthenticated", "Attempted to access user profile while unauthenticated");
    const [data, setData] = useState<UserProfileFields | null>(null);
    const [isEditingDisplayName, setIsEditingDisplayName] = useState<boolean>(false);

    useEffect(() => {
        if (!user) return
        const unsubscribe = subscribeToProfileData(user.uid, (newData) => {
            setData(newData);
        })
        return unsubscribe
    }, [user]);

    async function handleDelete() {
        if (!user) {return};
        await deleteFirestoreUser(user.uid);
        await deleteProfile();
    };

    const profileInfoDisplay = data ? <div className={styles.info}>
        <p>Email address: <span>{data.email}</span></p>
        <p>Display name: <span>{data.displayName ? data.displayName : "None provided"}</span></p>
        <button onClick={() => setIsEditingDisplayName(prev => !prev)}>Edit</button>
        {isEditingDisplayName &&
            <Form method="post">
                <input type="text" name="displayName" />
                <button type="submit">Save</button>
            </Form>}
        <p>Phone number: <span>{data.phoneNumber? data.phoneNumber : "None provided"}</span></p>
        <p>Photo URL: <span>{data.photoURL ? data.photoURL : "None provided"}</span></p>
    </div> : null;

    return (
        <main className="page">
            <section className="section page">
                <h1>Profile</h1>
                {profileInfoDisplay}
                <div className="buttonRow">
                    <button onClick={logOut}>Sign out</button>
                    <button onClick={handleDelete}>Delete user</button>
                </div>
            </section>
        </main>
    )
};
