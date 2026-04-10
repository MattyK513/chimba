/**
 * Sanitises a redirect target from untrusted input (URL params, form data).
 * Only same-origin paths are allowed — anything else falls back to `fallback`.
 */
export function safeRedirect(
    target: FormDataEntryValue | null,
    fallback = "/"
): string {
    if (
        typeof target === "string" &&
        target.startsWith("/") &&
        !target.startsWith("//")
    ) {
        return target;
    }
    return fallback;
}