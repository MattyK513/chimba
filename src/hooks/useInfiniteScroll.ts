import { useEffect, useRef, useCallback } from "react";
import type { FetcherSubmitFunction } from "../types";

interface Options {
    nextURL: string | null;
    enabled: boolean;
    fetcherState: "idle" | "loading" | "submitting";
    submit: FetcherSubmitFunction;
    action: string;
}

export default function useInfiniteScroll({
    nextURL,
    enabled,
    fetcherState,
    submit,
    action,
}: Options) {
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const handleIntersect = useCallback(() => {
        if (nextURL) {
            submit({ nextURL }, { method: "post", action });
        }
    }, [nextURL, submit, action]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !nextURL || !enabled || fetcherState !== "idle")
            return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) handleIntersect();
            },
            { rootMargin: "0px 0px 250px 0px" }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [nextURL, enabled, fetcherState, handleIntersect]);

    return sentinelRef;
}
