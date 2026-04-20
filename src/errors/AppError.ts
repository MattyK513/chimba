/**
 * Base error class for application-specific errors.
 * Provides a structured error with code, message, and optional cause.
 */
export class AppError extends Error {
    public readonly code: string;
    public readonly cause?: unknown;

    constructor(code: string, message: string, cause?: unknown) {
        super(message);
        this.code = code;
        this.cause = cause;
        this.name = "AppError";
    }
}
