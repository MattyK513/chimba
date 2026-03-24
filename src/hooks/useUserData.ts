import { useContext } from "react";
import { UserDataContext } from "../contexts/UserDataProvider";

export default function useUserData() {
    const context = useContext(UserDataContext);

    if (context === null) {
        throw new Error("useUserData must be called inside a UserDataProvider");
    }

    return context;
};