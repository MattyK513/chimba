import { createContext, useEffect, useState, type ReactNode } from "react";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";
import { colorThemes } from "../constants/colorThemes";
import { AuthError } from "../errors";
import type { ColorTheme, ThemeContextValue } from "../types";

const STORAGE_KEY = "chimbaColorTheme";
const DEFAULT_THEME: ColorTheme = "dark";

function isColorTheme(value: unknown): value is ColorTheme {
    return (
        typeof value === "string" && colorThemes.includes(value as ColorTheme)
    );
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { profileData, updateUserInfo } = useProfile();
    const themeFromFirestore = profileData?.theme;

    const [currentTheme, setCurrentTheme] = useState<ColorTheme>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return isColorTheme(stored) ? stored : DEFAULT_THEME;
    });

    useEffect(() => {
        if (
            isColorTheme(themeFromFirestore) &&
            themeFromFirestore !== currentTheme
        ) {
            setCurrentTheme(themeFromFirestore);
            localStorage.setItem(STORAGE_KEY, themeFromFirestore);
        }
    }, [themeFromFirestore]);

    useEffect(() => {
        document.documentElement.dataset.theme = currentTheme;
    }, [currentTheme]);

    async function setTheme(newTheme: ColorTheme): Promise<void> {
        if (!user)
            throw new AuthError(
                "UNAUTHENTICATED",
                "Must be signed in to set color theme."
            );
        if (!isColorTheme(newTheme) || newTheme === currentTheme) return;
        setCurrentTheme(newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);
        try {
            await updateUserInfo(user.uid, { theme: newTheme });
        } catch (err) {
            console.warn("Failed to persist theme to Firestore", err);
        }
    }

    return (
        <ThemeContext.Provider
            value={{ theme: currentTheme, setTheme, themeOptions: colorThemes }}
        >
            {children}
        </ThemeContext.Provider>
    );
}
