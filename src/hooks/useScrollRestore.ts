import { useEffect, useRef } from "react";

/**
 * Manages scroll restoration for a list of items.
 *
 * When an item is clicked, its ID can be stored via `markItemAsViewed`.
 * On the next render (triggered by `dependency`), the hook will attempt to:
 * - find the corresponding DOM node
 * - scroll it into view
 * - clear the stored ID (one-time behavior)
 *
 * @param storageKey Key used in sessionStorage to persist the selected item ID
 * @param dependency A value that changes when the list is rendered (e.g. items array)
 *
 * @returns
 * - registerItem: ref callback to associate an item ID with its DOM node
 * - markItemAsViewed: stores the ID for later scroll restoration
 */
export default function useScrollRestore(
    storageKey: string,
    dependency: unknown
) {
    const itemRefs = useRef(new Map<string, HTMLElement>());

    function registerItem(id: string, node: HTMLElement | null) {
        if (node) {
            itemRefs.current.set(id, node);
        } else {
            itemRefs.current.delete(id);
        }
    }

    function markItemAsViewed(id: string) {
        sessionStorage.setItem(storageKey, id);
    }

    useEffect(() => {
        const savedId = sessionStorage.getItem(storageKey);
        if (!savedId) return;

        const node = itemRefs.current.get(savedId);
        if (!node) return;

        node.scrollIntoView({
            behavior: "auto",
            block: "center",
        });

        sessionStorage.removeItem(storageKey);
    }, [dependency, storageKey]);

    return {
        registerItem,
        markItemAsViewed,
    };
}
