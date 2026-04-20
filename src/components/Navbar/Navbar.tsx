import { NavLink } from "react-router-dom";
import { useState, useCallback } from "react";
import {
    House,
    Target,
    Plane,
    UserRound,
    GripVertical,
    UtensilsCrossed,
    type LucideIcon,
} from "lucide-react";
import styles from "./Navbar.module.css";

interface NavItem {
    to: string;
    label: string;
    Icon: LucideIcon;
    end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    { to: "/", label: "Home", Icon: House, end: true },
    { to: "goals", label: "Goal tracker", Icon: Target },
    { to: "travel", label: "Travel planner", Icon: Plane },
    { to: "meal-planner", label: "Meal planner", Icon: UtensilsCrossed },
    { to: "profile", label: "User profile", Icon: UserRound },
];

const DOCK_STORAGE_KEY = "chimba:navDocked";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.active : ""}`;

export default function Navbar() {
    const [isDocked, setIsDocked] = useState(
        () => localStorage.getItem(DOCK_STORAGE_KEY) === "true"
    );

    const toggleDock = useCallback(() => {
        setIsDocked((prev) => {
            const next = !prev;
            localStorage.setItem(DOCK_STORAGE_KEY, String(next));
            return next;
        });
    }, []);

    return (
        <div
            className={`${styles.navContainer} ${isDocked ? styles.docked : ""}`}
        >
            <nav className={styles.navbar} aria-label="Main navigation">
                {NAV_ITEMS.map(({ to, label, Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        title={label}
                        aria-label={label}
                        className={navLinkClass}
                    >
                        <Icon />
                    </NavLink>
                ))}

                <button
                    type="button"
                    className={styles.dockToggle}
                    onClick={toggleDock}
                    aria-pressed={isDocked}
                    aria-label={
                        isDocked
                            ? "Undock navigation to top"
                            : "Dock navigation to side"
                    }
                    title={isDocked ? "Move to top" : "Move to side"}
                >
                    <GripVertical size={16} />
                </button>
            </nav>
        </div>
    );
}
