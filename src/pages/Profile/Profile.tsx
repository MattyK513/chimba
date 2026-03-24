import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { AuthError } from "../../errors";
import { deleteFirestoreUser, subscribeToProfileData } from "../../services/firestore/profile";
import type { UserProfileFields } from "../../types/firebase";
import styles from "./Profile.module.css";

function displayValue(value: string | null): string {
    if (!value || value.trim().length === 0) {
        return "Not provided";
    }

    return value;
}

export default function Profile() {
    const { deleteProfile, logOut, user } = useAuth();

    if (!user) {
        throw new AuthError("unauthenticated", "Attempted to access user profile while unauthenticated");
    }

    const currentUser = user;

    const [data, setData] = useState<UserProfileFields | null>(null);
    const [isEditingDisplayName, setIsEditingDisplayName] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = subscribeToProfileData(currentUser.uid, (newData) => {
            setData(newData);
        });

        return unsubscribe;
    }, [currentUser.uid]);

    async function handleDelete() {
        await deleteFirestoreUser(currentUser.uid);
        await deleteProfile();
    }

    const displayName = data?.displayName ?? currentUser.displayName ?? null;
    const email = data?.email ?? currentUser.email ?? "Unknown";
    const phone = data?.phoneNumber ?? currentUser.phoneNumber ?? null;
    const photoURL = data?.photoURL ?? currentUser.photoURL ?? null;

    return (
        <section className={styles.profilePage}>
            <header className={styles.profileHeader}>
                <h1 className={styles.pageTitle}>My profile</h1>
                <p className={styles.pageSubtitle}>Manage your account and personal details.</p>
            </header>

            <article className={styles.profileCard}>
                <div className={styles.avatarRow}>
                    <div className={styles.avatarShell}>
                        {photoURL ? (
                            <img src={photoURL} alt={`${displayValue(displayName)} avatar`} className={styles.avatarImage} />
                        ) : (
                            <span className={styles.avatarFallback}>{displayValue(displayName).charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <div className={styles.userIdentity}>
                        <h2>{displayValue(displayName)}</h2>
                        <p>{email}</p>
                    </div>
                </div>

                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <h3>Email</h3>
                        <p>{email}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <h3>Display name</h3>
                        <p>{displayValue(displayName)}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <h3>Phone number</h3>
                        <p>{displayValue(phone)}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <h3>Photo URL</h3>
                        <p className={styles.longText}>{displayValue(photoURL)}</p>
                    </div>
                </div>

                <div className={styles.editSection}>
                    <button type="button" className={styles.secondaryButton} onClick={() => setIsEditingDisplayName((prev) => !prev)}>
                        {isEditingDisplayName ? "Cancel" : "Edit display name"}
                    </button>

                    {isEditingDisplayName && (
                        <Form method="post" className={styles.editForm}>
                            <label htmlFor="displayName" className={styles.formLabel}>Display name</label>
                            <input
                                id="displayName"
                                type="text"
                                name="displayName"
                                defaultValue={displayName ?? ""}
                                className={styles.formInput}
                                placeholder="Enter display name"
                            />
                            <button type="submit" className={styles.primaryButton}>Save changes</button>
                        </Form>
                    )}
                </div>

                <div className={styles.actionRow}>
                    <button type="button" onClick={logOut} className={styles.secondaryButton}>Sign out</button>
                    <button type="button" onClick={handleDelete} className={styles.dangerButton}>Delete user</button>
                </div>
            </article>
        </section>
    );
}
