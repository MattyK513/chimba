import styles from "../PlaceholderPage.module.css";

const plannedFeatures = [
    {
        title: "Trip Planner",
        description: "Create detailed itineraries with day-by-day activities, transportation, and accommodations.",
    },
    {
        title: "Destination Wishlist",
        description: "Save places you'd love to visit and organize them by priority or season.",
    },
    {
        title: "Budget Tracking",
        description: "Estimate costs and keep tabs on your travel spending across trips.",
    },
    {
        title: "Collaborative planning",
        description: "Choose other users to share your trip details with and build your trip together.",
    },
];

export default function Travel() {
    return (
        <div className={styles.page}>

            <div className={styles.titleRow}>
                <h1 className={styles.title}>Travel</h1>
                <span className={styles.tag}>Coming Soon</span>
            </div>

            <p className={styles.subtitle}>
                A full travel planning experience is on the way. Here's a look at what's on
                the roadmap.
            </p>

            <section className={styles.featureList}>
                {plannedFeatures.map((feature) => (
                    <div key={feature.title} className={styles.featureCard}>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureDescription}>{feature.description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}