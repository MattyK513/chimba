import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { createAccountWithEmailAndPassword, deleteProfile, logInWithEmailAndPassword, logOut, subscribeToAuthState, updateUsernameOrPhotoURL } from "../services/auth";

export default function useAuth() {
    const [ user, setUser ] = useState(null);
    const [ status, setStatus ] = useState("loading");

    useEffect(() => {
        
    }, []);
};