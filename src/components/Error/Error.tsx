import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";
import styles from "./Error.module.css";

/**
 * Catches and displays route-level errors with user-friendly messaging.
 * Handles HTTP error responses, standard errors, and unknown error types.
 */
export default function ErrorComponent() {
    const error = useRouteError();

    let title = "Something went wrong";
    let message = "An unexpected error occurred. Please try again.";
    let statusCode: number | null = null;
    let shouldDisplaySearchButton = false;


    if (isRouteErrorResponse(error)) {
        statusCode = error.status;
        switch (error.status) {
            case 404:
                title = "Page Not Found";
                message = "The page you're looking for doesn't exist or has been moved.";
                break;
            case 401:
                title = "Unauthorized";
                message = "You need to be logged in to access this page.";
                break;
            case 403:
                title = "Forbidden";
                message = "You don't have permission to access this page.";
                break;
            default:
                title = `Error ${error.status}`;
                message = error.statusText || message;
        }
    } else if (error instanceof Error) {
        message = error.message;
        if (message === "Edamam API error: 429") {
            title = "Too many requests"
            message = "The recipe search API is currently overloaded with requests. Please wait a few moments before searching again."
            statusCode = 429;
            shouldDisplaySearchButton = true;
        } 
    }

    return (
        <div className={styles["error-container"]}>
            {statusCode && <span className={styles["error-status"]}>{statusCode}</span>}
            <h1 className={styles["error-title"]}>{title}</h1>
            <p className={styles["error-message"]}>{message}</p>
            <div className={styles["error-actions"]}>
                <Link to="/" className={styles["error-link"]}>Go Home</Link>
                {shouldDisplaySearchButton && <Link to="/meal-planner/recipe-search" className={styles["error-link"]}>Back to search</Link>}
            </div>
            {import.meta.env.DEV && (
                <details className={styles["error-details"]}>
                    <summary>Dev Info</summary>
                    <pre>{JSON.stringify(error, null, 2)}</pre>
                </details>
            )}
        </div>
    );
}