import { useContext } from "react";
import { UserDataContext } from "../contexts/UserDataProvider";
import { AppError } from "../errors";

export default function useUserData() {
    const context = useContext(UserDataContext);

    if (context === null) {
        throw new AppError("NO_CONTEXT_PROVIDER", "useUserData must be called inside a UserDataProvider");
    }

    return context;
};