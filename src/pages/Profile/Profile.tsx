import { useEffect, useState } from "react"
import { subscribeToProfileData } from "../../services/firestore";
import useAuth from "../../hooks/useAuth";
import type { UserProfileFields } from "../../types/firebase";
import { deleteFirestoreUser } from "../../services/firestore";
import styles from "./Profile.module.css";

export default function Profile() {
    const { deleteProfile, logOut, user } = useAuth();
    const [ data, setData ] = useState<UserProfileFields | null>(null);

    useEffect(() => {
        if (!user) return
        const unsubscribe = subscribeToProfileData(user, (newData) => {
            setData(newData);
        })
        return unsubscribe
    }, []);

    async function handleDelete() {
        await deleteFirestoreUser();
        await deleteProfile();
    };

    const profileInfoDisplay = data ? <div className={styles.info}>
        <p>Email address: <span>{data.email}</span></p>
        <p>Display name: <span>{data.displayName ? data.displayName : "None provided"}</span></p>
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
