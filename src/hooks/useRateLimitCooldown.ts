import { useEffect, useState } from "react";

export default function useRateLimitCooldown(
    hasError: boolean,
    cooldownMs = 60_000
): boolean {
    const [isRateLimited, setIsRateLimited] = useState(false);

    useEffect(() => {
        if (hasError) setIsRateLimited(true);
    }, [hasError]);

    useEffect(() => {
        if (!isRateLimited) return;
        const timer = setTimeout(() => setIsRateLimited(false), cooldownMs);
        return () => clearTimeout(timer);
    }, [isRateLimited, cooldownMs]);

    return isRateLimited;
}