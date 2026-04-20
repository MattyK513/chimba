import { Form, Link } from "react-router-dom";
import {
    UtensilsCrossed,
    CalendarDays,
    Target,
    Plane,
    Search,
    Palette,
    Zap,
    ArrowRight,
    type LucideIcon,
} from "lucide-react";
import styles from "./Landing.module.css";

interface FeatureCard {
    title: string;
    description: string;
    Icon: LucideIcon;
    status: "available" | "coming-soon";
}

const features: FeatureCard[] = [
    {
        title: "Recipe Search",
        description:
            "Browse thousands of recipes with deep filters: diet, macros, allergens, cuisine, cooking time, and more. Ingredient lists and full nutrition breakdowns for every result.",
        Icon: UtensilsCrossed,
        status: "available",
    },
    {
        title: "Meal Planner",
        description:
            "Assign recipes to days of the week, auto-generate grocery lists from your plan, and save favorites into your own collections.",
        Icon: CalendarDays,
        status: "coming-soon",
    },
    {
        title: "Goals",
        description:
            "Set personal goals, break them into subtasks, track progress with deadlines, and build streaks for recurring habits.",
        Icon: Target,
        status: "coming-soon",
    },
    {
        title: "Travel",
        description:
            "Plan trips, build itineraries, save destinations to a wishlist, track budgets, and collaborate with travel companions.",
        Icon: Plane,
        status: "coming-soon",
    },
];

interface Highlight {
    title: string;
    description: string;
    Icon: LucideIcon;
}

const highlights: Highlight[] = [
    {
        title: "Powerful filtering",
        description:
            "Filter recipes by calories, any of 30+ nutrients, allergens, dish type, and more.",
        Icon: Search,
    },
    {
        title: "Eight color themes",
        description:
            "Classic dark and light, plus Ocean, Forest, Desert, Arctic, Plains, and Volcano.",
        Icon: Palette,
    },
    {
        title: "Fast and responsive",
        description:
            "Infinite scroll, instant filters, and data that syncs across your devices.",
        Icon: Zap,
    },
];

export default function Landing() {
    return (
        <div className={styles.landing}>
            {/* Hero */}
            <header className={styles.hero}>
                <span className={styles.eyebrow}>Your personal organizer</span>
                <h1 className={styles.heroTitle}>
                    Welcome to <span className={styles.heroBrand}>Chimba</span>
                </h1>
                <p className={styles.heroSubtitle}>
                    A modern dashboard for meal planning, goal tracking, and travel
                    organization, all in one place.
                </p>

                <div className={styles.ctaRow}>
                    <Link to="/register" className={styles.primaryCta}>
                        Get started free
                        <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                    <Link to="/login" className={styles.secondaryCta}>
                        Sign in
                    </Link>
                </div>

                {/* Submits directly to /login using the same guest credentials the login page exposes */}
                <Form method="post" action="/login" className={styles.guestForm}>
                    <input type="hidden" name="email" value="guest@user.com" />
                    <input type="hidden" name="password" value="guestuser" />
                    <button type="submit" className={styles.guestButton}>
                        Just looking around? Try the app as a guest →
                    </button>
                </Form>
            </header>

            {/* Features */}
            <section className={styles.featuresSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        Everything you need, nothing you don't
                    </h2>
                    <p className={styles.sectionSubtitle}>
                        Chimba brings the tools you reach for every day under one roof.
                    </p>
                </div>

                <div className={styles.featureGrid}>
                    {features.map(({ title, description, Icon, status }) => (
                        <article key={title} className={styles.featureCard}>
                            <div className={styles.featureIconWrap}>
                                <Icon className={styles.featureIcon} aria-hidden="true" />
                            </div>
                            <div className={styles.featureCardHeader}>
                                <h3 className={styles.featureTitle}>{title}</h3>
                                {status === "coming-soon" && (
                                    <span className={styles.tag}>Coming soon</span>
                                )}
                            </div>
                            <p className={styles.featureDescription}>{description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Highlights */}
            <section className={styles.highlightSection}>
                {highlights.map(({ title, description, Icon }) => (
                    <div key={title} className={styles.highlight}>
                        <Icon className={styles.highlightIcon} aria-hidden="true" />
                        <h4 className={styles.highlightTitle}>{title}</h4>
                        <p className={styles.highlightDescription}>{description}</p>
                    </div>
                ))}
            </section>

            <section className={styles.developerStrip}>
                <div>
                    <span className={styles.developerLabel}>Built by one developer</span>
                    <p className={styles.developerText}>
                        Curious about the architecture, the stack, or the guy who made it?
                    </p>
                </div>
                <Link to="/about" className={styles.developerLink}>
                    About the developer
                    <ArrowRight size={16} aria-hidden="true" />
                </Link>
            </section>

            {/* Final CTA */}
            <section className={styles.finalCta}>
                <h2 className={styles.finalCtaTitle}>Ready to get organized?</h2>
                <p className={styles.finalCtaSubtitle}>
                    Create a free account in under a minute.
                </p>
                <div className={styles.ctaRow}>
                    <Link to="/register" className={styles.primaryCta}>
                        Create account
                        <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                    <Link to="/login" className={styles.secondaryCta}>
                        I already have an account
                    </Link>
                </div>
            </section>
        </div>
    );
}