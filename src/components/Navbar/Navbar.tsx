import { NavLink } from "react-router-dom";
import { useState } from "react";
import { House, Target, Plane, UserRound, GripVertical, UtensilsCrossed } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [isDocked, setIsDocked] = useState(false);

    return (
        <div className={`${styles.navContainer} ${isDocked ? styles.docked : ''}`}>
            <nav className={styles.navbar}>
                <NavLink 
                    to="/" 
                    end
                    aria-label="Home"
                    className={({ isActive }) => 
                        `${styles.navLink} ${isActive ? styles.active : ''}`
                    }
                >
                    <House />
                </NavLink>
                <NavLink 
                    to="goals"
                    aria-label="Goal tracker"
                    className={({ isActive }) => 
                        `${styles.navLink} ${isActive ? styles.active : ''}`
                    }
                >
                    <Target />
                </NavLink>
                <NavLink 
                    to="travel"
                    aria-label="Travel planner"
                    className={({ isActive }) => 
                        `${styles.navLink} ${isActive ? styles.active : ''}`
                    }
                >
                    <Plane />
                </NavLink>
                <NavLink
                    to="meal-planner"
                    aria-label="Meal planner"
                    className={({ isActive }) => 
                        `${styles.navLink} ${isActive ? styles.active : ''}`
                    }
                >
                    <UtensilsCrossed />
                </NavLink>
                <NavLink
                    to="profile"
                    aria-label="User profile"
                    className={({ isActive }) =>
                        `${styles.navLink} ${isActive ? styles.active : ''}`
                    }
                >
                    <UserRound />
                </NavLink>
    
                
                <button 
                    className={styles.dockToggle}
                    onClick={() => setIsDocked(!isDocked)}
                    aria-label={isDocked ? "Move to top" : "Move to side"}
                >
                    <GripVertical size={16} />
                </button>
            </nav>
        </div>
    );
};