import { useEffect } from "react";
import useAuth from "./useAuth";
import useUserData from "./useUserData";
import {
    subscribeToProfileData,
    deleteFirestoreUser,
    updateUserInfo,
} from "../services/firestore/profile";

export default function useProfile() {
    const { user } = useAuth();
    const { profileData, addDependency, removeDependency } = useUserData();

    useEffect(() => {
        addDependency("profileData");
        return () => removeDependency("profileData");
    }, [user]);

    return {
        profileData,
        subscribeToProfileData,
        deleteFirestoreUser,
        updateUserInfo,
    };
}
