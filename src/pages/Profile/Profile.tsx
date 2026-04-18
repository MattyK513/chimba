import { useEffect, useState } from "react";
import { Form, useActionData } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useProfile from "../../hooks/useProfile";
import useTheme from "../../hooks/useTheme";
import { AuthError } from "../../errors";
import { Spinner } from "../../components";
import { getRequiredEnvVar } from "../../config/env";
import styles from "./Profile.module.css";
import {
    House,
    Target,
    Plane,
    UserRound,
    UtensilsCrossed,
} from "lucide-react";

const guestId = getRequiredEnvVar("VITE_GUEST_ID");

export default function Profile() {
    const { deleteProfile, logOut, user } = useAuth();
    if (!user) throw new AuthError("unauthenticated", "Attempted to access user profile while unauthenticated");
    const userIsGuest = user.uid === guestId;

    const [isEditingDisplayName, setIsEditingDisplayName] = useState<boolean>(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
    const [guestMessageIsShown, setGuestMessageIsShown] = useState<boolean>(userIsGuest);

    const { profileData, deleteFirestoreUser } = useProfile();
    const { theme, setTheme, themeOptions } = useTheme();

    const actionData: {success: boolean, error: string | null} | undefined = useActionData();

    let errorMessage = null;
    if (actionData?.error) {
        errorMessage = actionData.error === 'wrong-password' || actionData.error === 'invalid-credential'
            ? "Incorrect current password. Please try again."
            : actionData.error === 'weak-password'
            ? "Password be at least 6 characters long"
            : "Please try again";
    }

    async function handleDelete() {
        if (!user) return;
        await deleteFirestoreUser(user.uid);
        await deleteProfile();
    }

    useEffect(() => {
        if (actionData?.success) {
            setIsChangingPassword(false);
        }
    }, [actionData]);

    return (
        <div className={styles.profilePage}>

            <div className={styles.titleRow}>
                <h1 className={styles.title}>Profile</h1>
            </div>

            <p className={styles.subtitle}>
                Manage your account settings and personal information.
            </p>

            {guestMessageIsShown && 
                <div className={styles.guestMessageContainer}>
                    <p className={styles.guestMessageText}>
                        Attention: You're currently exploring the app as a guest, so some features on this page are unavailable.
                        You won't be able to change the display name or password or delete the account. To get the full
                        experience, you can always sign out and register an account!
                    </p>
                    <button onClick={() => setGuestMessageIsShown(false)} className={styles.dismissBtn}>Dismiss</button>
                </div>
            }

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>Account Information</h2>

                {profileData ? (
                    <div className={styles.fieldList}>
                        <div className={styles.field}>
                            <span className={styles.fieldLabel}>Email address</span>
                            <span className={styles.fieldValue}>{profileData.email}</span>
                        </div>

                        <div className={styles.field}>
                            <span className={styles.fieldLabel}>Display name</span>
                            {isEditingDisplayName ? (
                                <Form
                                    method="post"
                                    className={styles.editForm}
                                    onSubmit={() => setIsEditingDisplayName(false)}
                                >
                                    <input
                                        type="hidden"
                                        name="intent"
                                        value="change-display-name"
                                    />
                                    <input
                                        type="text"
                                        name="displayName"
                                        defaultValue={profileData.displayName || ""}
                                        className={styles.input}
                                        autoFocus
                                    />
                                    <button type="submit" className={styles.saveBtn} disabled={user.uid===guestId}>
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingDisplayName(false)}
                                        className={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                </Form>
                            ) : (
                                <div className={styles.fieldValueRow}>
                                    <span
                                        className={`${styles.fieldValue} ${
                                            !profileData.displayName ? styles.fieldEmpty : ""
                                        }`}
                                    >
                                        {profileData.displayName || "None provided"}
                                    </span>
                                    <button
                                        onClick={() => setIsEditingDisplayName(true)}
                                        className={styles.editBtn}
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <Spinner variant="inline" />
                )}
            </section>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>Appearance</h2>

                <div className={styles.field}>
                    <span className={styles.fieldLabel}>Color theme</span>

                    <div
                        className={styles.themeGrid}
                        role="radiogroup"
                        aria-label="Color theme"
                    >
                        {themeOptions.map(option => {
                            const isActive = option === theme;
                            return (
                                <button
                                    key={option}
                                    type="button"
                                    role="radio"
                                    aria-checked={isActive}
                                    data-theme={option}
                                    onClick={() => setTheme(option)}
                                    className={`${styles.themeSwatch} ${isActive ? styles.themeSwatchActive : ""}`}
                                >
                                    <span className={styles.themeHeaderPreview}>
                                        <House className={styles.icon}/>
                                        <Target className={styles.icon} />
                                        <Plane className={styles.icon} />
                                        <UtensilsCrossed className={styles.icon} />
                                        <UserRound className={styles.icon} /> 
                                    </span>
                                    <span className={styles.themePreview}>
                                        <span className={styles.themePreviewDot} />
                                        <span className={styles.themePreviewDot} />
                                        <span className={styles.themePreviewDot} />
                                        <span className={styles.themePreviewDot} />
                                        <span className={styles.themePreviewDot} />
                                    </span>
                                    <span className={styles.themeName}>{option}</span>
                                    {isActive && (
                                        <span className={styles.themeCheck} aria-hidden="true">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className={styles.card}>
                <h2 className={styles.cardTitle}>Account Actions</h2>
                <div className={styles.actionList}>

                    <div className={styles.actionRow}>
                        <div className={styles.actionInfo}>
                            <h3 className={styles.actionTitle}>Sign out</h3>
                            <p className={styles.actionDescription}>
                                Sign out of your account on this device.
                            </p>
                        </div>
                        <button onClick={logOut} className={styles.secondaryBtn}>
                            Sign Out
                        </button>
                    </div>

                    <div className={styles.actionRow}>
                        <div className={styles.actionInfo}>
                            <h3 className={styles.actionTitle}>Change password</h3>
                            <p className={styles.actionDescription}>
                                Update your account password.
                            </p>
                        </div>

                        {isChangingPassword ? (
                            <Form
                                method="post"
                                className={styles.passwordChangeForm}
                            >
                                <input type="hidden" name="intent" value="change-password" />
                                {errorMessage && (
                                    <div className={styles.errorBox}>
                                        {errorMessage}
                                    </div>
                                )}
                                <input
                                    type="password"
                                    name="currentPassword"
                                    placeholder="Current password"
                                    className={styles.input}
                                    required
                                />
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="New password"
                                    className={styles.input}
                                    required
                                />
                                <div className={styles.passwordChangeBtns}>
                                    <button type="submit" className={styles.saveBtn} disabled={user.uid===guestId}>
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsChangingPassword(false)}
                                        className={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        ) : (
                            <button
                                onClick={() => setIsChangingPassword(true)}
                                className={styles.secondaryBtn}
                            >
                                Change Password
                            </button>
                        )}
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.actionRow}>
                        <div className={styles.actionInfo}>
                            <h3 className={styles.actionTitle}>Delete account</h3>
                            <p className={styles.actionDescription}>
                                Permanently delete your account and all associated data. This
                                cannot be undone.
                            </p>
                        </div>
                        {confirmingDelete ? (
                            <div className={styles.confirmGroup}>
                                <button onClick={handleDelete} className={styles.dangerBtn}>
                                    Confirm
                                </button>
                                <button
                                    onClick={() => setConfirmingDelete(false)}
                                    className={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setConfirmingDelete(true)}
                                className={styles.dangerBtn}
                                disabled={user.uid===guestId}
                            >
                                Delete Account
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}