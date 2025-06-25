/**
 * Creates a debounced version of the given function using requestAnimationFrame.
 *
 * The debounced function delays invoking `fn` until the next animation frame,
 * ensuring it runs at most once per frame, no matter how many times it's called.
 *
 * Useful for optimizing performance of functions triggered by rapid events
 * like scrolling or resizing.
 *
 * @param fn - The function to debounce.
 * @returns A debounced function that delays execution of `fn`.
 */
export const debounce = (fn: (...args: any[]) => void) => {
    let frame: number;

    return (...params: any[]) => {
        // Cancel the previous scheduled call, if any
        if (frame) {
            cancelAnimationFrame(frame);
        }

        // Schedule a new call on the next animation frame
        frame = requestAnimationFrame(() => {
            fn(...params);
        });
    };
};
