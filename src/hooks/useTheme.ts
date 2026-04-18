import { useContext } from "react";
import { ThemeContext } from "../contexts/themeContext";
import { AppError } from "../errors";

export default function useTheme() {
    const context = useContext(ThemeContext);

    if (context === null) {
        throw new AppError("NO_CONTEXT_PROVIDER", "useTheme must be called inside a ThemeContextProvider");
    }

    return context;
}