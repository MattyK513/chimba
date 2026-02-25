import { useEffect, useState } from "react"
import { subscribeToProfileData } from "../../services/firestore";
import useAuth from "../../hooks/useAuth";
import type { UserProfileFields } from "../../types/firebase";

import { deleteFirestoreUser } from "../../services/firestore";


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


    const profileInfoDisplay = data ? <div>
        <p>Email address: <span>{data.email}</span></p>
        <p>Display name: <span>{data.displayName ? data.displayName : "None provided"}</span></p>
        <p>Phone number: <span>{data.phoneNumber? data.phoneNumber : "None provided"}</span></p>
        <p>Photo URL: <span>{data.photoURL ? data.photoURL : "None provided"}</span></p>
    </div> : null;

    return (
        <>
            <h1>Profile page</h1>
            {profileInfoDisplay}
            <button onClick={logOut}>Sign Out</button>
            <button onClick={handleDelete}>Delete user</button>
        </>
    )
};