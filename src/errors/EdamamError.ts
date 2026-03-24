import { AppError } from "./AppError";

export class EdamamError extends AppError {
    public readonly status?: number;
    public readonly isRateLimit: boolean;
    public readonly retryAfterSeconds?: number;

    constructor(code: string, message: string, options?: { status?: number; retryAfterSeconds?: number; cause?: unknown }) {
        super(code, message, options?.cause);
        this.status = options?.status;
        this.retryAfterSeconds = options?.retryAfterSeconds;
        this.isRateLimit = options?.status === 429;
        this.name = "EdamamError";
    }
}
