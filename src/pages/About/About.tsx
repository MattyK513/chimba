import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Mail,
    Github,
    Linkedin,
    FileText,
    MapPin,
    Layers,
    Shield,
    Palette,
    Infinity as InfinityIcon,
    ExternalLink,
    ArrowRight,
    type LucideIcon,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import styles from "./About.module.css";

const DEVELOPER = {
    name: "Matt",
    title: "Frontend Developer",
    location: null,
    tagline:
        "I build thoughtful React applications and care deeply about user experience as well as what happens between the design file and the deploy.",
    bio: [
        "I'm a frontend-focused developer with a soft spot for clean architecture, careful state management, and making data useful and presentable.",
        "Chimba is where I've been stretching those interests. It's a real-world app with auth, live data, external APIs, profile customization, theming, and more.",
    ],
    email: "mkmattkeese@gmail.com",
    github: "https://github.com/MattyK513",
    linkedin: "https://www.linkedin.com/in/matthew-keese-40420858/",
    resumeUrl: null,
} as const;

const PROJECT_GOALS = [
    "Demonstrate production-grade patterns in a non-trivial app: guarded routes, live Firestore subscriptions, typed service layers, scoped context, and structured error handling.",
    "Build a UI system flexible enough to support eight color themes without per-theme class explosion.",
    "Integrate Firestore and the Edamam API while handling limitations introduced by free-tier usage, with rate-limit handling, graceful degradation, and informative error surfaces.",
    "Build a portfolio demo that I would actually use.",
];

interface Highlight {
    title: string;
    description: string;
    Icon: LucideIcon;
}

/* These map to real architectural decisions in the codebase.
 * Reviewers can go find them in the code. */
const HIGHLIGHTS: Highlight[] = [
    {
        title: "Reference-counted live data",
        description:
            "A single UserDataProvider manages Firestore subscriptions with reference counting. Modules subscribe via useGoals / useMeals / useProfile hooks. Subscriptions start on first consumer and stop when the last unmounts, avoiding duplicate listeners and orphaned streams.",
        Icon: Layers,
    },
    {
        title: "Infinite scroll with back-off",
        description:
            "Recipe pagination uses IntersectionObserver driving a route action. If Edamam returns a 429 error, the action returns an error payload and the app displays a rate-limit notice, temporarily disables further requests, and re-enables automatically, allowing the user to resume normal app usage in the meantime.",
        Icon: InfinityIcon,
    },
    {
        title: "Structured error hierarchy",
        description:
            "AppError is the base, with AuthError, FirestoreError, EdamamError, and ValidationError extending it. The route error boundary uses instanceof checks and error codes to render targeted UIs.",
        Icon: Shield,
    },
    {
        title: "HSL-based theme system",
        description:
            "Every themeable token is stored as an HSL triple (e.g. --color-focus: 236 100% 70%) and composed at call sites with hsl(var(--color-focus) / 0.5). Eight full themes, every component has access to every token at any opacity, zero precomputed variants.",
        Icon: Palette,
    }
];

const STACK = {
    "Core": ["React 19", "TypeScript", "Vite", "React Router 7"],
    "Backend & Data": ["Firebase Auth", "Cloud Firestore", "Edamam API"],
    "Styling": ["CSS Modules", "HSL design tokens", "Lucide Icons"],
    "Tooling": ["ESLint 9", "typescript-eslint", "Prettier"],
} as const;

export default function About() {
    const { user } = useAuth();
    const appHomePath = user ? "/" : "/welcome";
    const appHomeLabel = user ? "Back to app" : "See the app";

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto"});
     }, []);

    return (
        <div className={styles.about}>
            

            {/* Hero */}
            <header className={styles.hero}>
                <Link to={appHomePath} className={styles.backLink}>
                    ← {appHomeLabel}
                </Link>
                <span className={styles.eyebrow}>About the developer</span>
                <h1 className={styles.heroTitle}>
                    Hi, I'm <span className={styles.heroName}>{DEVELOPER.name}</span>
                </h1>
                <p className={styles.heroRole}>
                    {DEVELOPER.title}
                    {/*
                    <span className={styles.dot} aria-hidden="true">·</span>
                    <MapPin size={14} aria-hidden="true" className={styles.locationIcon} />
                    {DEVELOPER.location}
                    */}
                </p>
                <p className={styles.heroTagline}>{DEVELOPER.tagline}</p>

                <div className={styles.heroActions}>
                    <a href={`mailto:${DEVELOPER.email}`} className={styles.primaryBtn}>
                        <Mail size={18} aria-hidden="true" />
                        Email me
                    </a>
                    <a
                        href={DEVELOPER.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.secondaryBtn}
                    >
                        <Github size={18} aria-hidden="true" />
                        GitHub
                    </a>
                    <a
                        href={DEVELOPER.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.secondaryBtn}
                    >
                        <Linkedin size={18} aria-hidden="true" />
                        LinkedIn
                    </a>
                    {/*
                    <a
                        href={DEVELOPER.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.secondaryBtn}
                    >
                        <FileText size={18} aria-hidden="true" />
                        Resume
                    </a>
                    */}
                </div>
            </header>

            {/* About me */}
            <section className={styles.card}>
                <h2 className={styles.sectionTitle}>About me</h2>
                {DEVELOPER.bio.map((paragraph, idx) => (
                    <p key={idx} className={styles.prose}>
                        {paragraph}
                    </p>
                ))}
            </section>

            {/* About this project */}
            <section className={styles.card}>
                <h2 className={styles.sectionTitle}>About this project</h2>
                <p className={styles.prose}>
                    Chimba is a personal-dashboard app in active development. It currently ships a full recipe-search experience backed by the Edamam API, user auth and profile management via Firebase, and an eight-theme design system. Meal planning, goal tracking, and travel modules are next.
                </p>
                <p className={styles.proseMuted}>Built to demonstrate:</p>
                <ul className={styles.goalList}>
                    {PROJECT_GOALS.map((goal, idx) => (
                        <li key={idx}>{goal}</li>
                    ))}
                </ul>
            </section>

            {/* Engineering highlights */}
            <section>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleCentered}`}>
                    A few things I'm proud of
                </h2>
                <p className={styles.sectionSubtitle}>
                    Specific architectural choices that went into this codebase.
                </p>

                <div className={styles.highlightGrid}>
                    {HIGHLIGHTS.map(({ title, description, Icon }) => (
                        <article key={title} className={styles.highlightCard}>
                            <div className={styles.highlightIconWrap}>
                                <Icon className={styles.highlightIcon} aria-hidden="true" />
                            </div>
                            <h3 className={styles.highlightTitle}>{title}</h3>
                            <p className={styles.highlightDescription}>{description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Tech stack */}
            <section className={styles.card}>
                <h2 className={styles.sectionTitle}>Tech stack</h2>
                <div className={styles.stackGrid}>
                    {Object.entries(STACK).map(([category, items]) => (
                        <div key={category} className={styles.stackGroup}>
                            <span className={styles.stackLabel}>{category}</span>
                            <div className={styles.stackBadges}>
                                {items.map(item => (
                                    <span key={item} className={styles.stackBadge}>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section className={styles.contactCta}>
                <h2 className={styles.contactTitle}>Let's talk</h2>
                <p className={styles.contactSubtitle}>
                    I'm looking for frontend roles, but would be thrilled to grow into a
                    full-stack role as well. Happy to walk through any part of this codebase.
                </p>
                <div className={styles.contactLinks}>
                    <a href={`mailto:${DEVELOPER.email}`} className={styles.contactLink}>
                        <Mail size={18} aria-hidden="true" />
                        <div>
                            <span className={styles.contactLinkLabel}>Email</span>
                            <span className={styles.contactLinkValue}>
                                {DEVELOPER.email}
                            </span>
                        </div>
                        <ExternalLink
                            size={14}
                            className={styles.contactLinkArrow}
                            aria-hidden="true"
                        />
                    </a>
                    <a
                        href={DEVELOPER.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactLink}
                    >
                        <Github size={18} aria-hidden="true" />
                        <div>
                            <span className={styles.contactLinkLabel}>GitHub</span>
                            <span className={styles.contactLinkValue}>
                                {DEVELOPER.github.replace(/^https?:\/\//, "")}
                            </span>
                        </div>
                        <ExternalLink
                            size={14}
                            className={styles.contactLinkArrow}
                            aria-hidden="true"
                        />
                    </a>
                    <a
                        href={DEVELOPER.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactLink}
                    >
                        <Linkedin size={18} aria-hidden="true" />
                        <div>
                            <span className={styles.contactLinkLabel}>LinkedIn</span>
                            <span className={styles.contactLinkValue}>
                                {DEVELOPER.linkedin.replace(/^https?:\/\//, "")}
                            </span>
                        </div>
                        <ExternalLink
                            size={14}
                            className={styles.contactLinkArrow}
                            aria-hidden="true"
                        />
                    </a>
                </div>

                <Link to={appHomePath} className={styles.appCta}>
                    {user ? "Back to app" : "Explore the app"}
                    <ArrowRight size={18} aria-hidden="true" />
                </Link>
            </section>
        </div>
    );
}