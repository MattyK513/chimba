import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { AppError } from "../../errors";
import styles from "./Error.module.css";

function getErrorContent(error: unknown): { title: string; details: string; code?: string } {
    if (isRouteErrorResponse(error)) {
        return {
            title: `${error.status} ${error.statusText}`,
            details: typeof error.data === "string" ? error.data : "Something went wrong while loading this page."
        };
    }

    if (error instanceof AppError) {
        return {
            title: "Something went wrong",
            details: error.message,
            code: error.code
        };
    }

    if (error instanceof Error) {
        return {
            title: "Unexpected error",
            details: error.message
        };
    }

    return {
        title: "Unexpected error",
        details: "An unknown error occurred. Please try again."
    };
}

export default function ErrorComponent() {
    const error: unknown = useRouteError();
    const content = getErrorContent(error);

    return (
        <section className={styles.errorPage} role="alert" aria-live="assertive">
            <div className={styles.errorCard}>
                <h1>{content.title}</h1>
                <p>{content.details}</p>
                {content.code && <p className={styles.errorCode}>Code: {content.code}</p>}
                <div className={styles.actions}>
                    <Link to="/">Go home</Link>
                    <button type="button" onClick={() => window.location.reload()}>Try again</button>
                </div>
            </div>
        </section>
    );
}
