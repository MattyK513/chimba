import { OrbitProgress } from "react-loading-indicators";
import styles from "./Spinner.module.css";

interface Props {
    variant: "inline" | "fullscreen";
    message?: string;
    color?: string;
}

export default function Spinner({ variant, message, color }: Props) {
    const size = variant === "inline" ? "small" : "large";
    const text = message || "";
    const spinnerColor = color || "hsl(var(--color-focus))";

    return (
        <div className={styles[variant]}>
            <OrbitProgress
                variant="spokes"
                dense
                color={spinnerColor}
                size={size}
                text={text}
                textColor={spinnerColor}
            />
        </div>
    );
}
