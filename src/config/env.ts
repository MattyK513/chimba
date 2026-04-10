export function getRequiredEnvVar(name: string): string {
    const value = (import.meta.env as Record<string, unknown>)[name];

    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}
