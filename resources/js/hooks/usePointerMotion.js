import { useEffect, useRef } from "react";
import { useMotion } from "@/Components/Motion/MotionProvider";
// Write CSS variables once per frame; pointer movement does not re-render React.
export default function usePointerMotion() {
    const ref = useRef(null);
    const { mode, reduced } = useMotion();
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const reset = () => {
            element.style.setProperty("--pointer-x", "0");
            element.style.setProperty("--pointer-y", "0");
        };
        reset();
        if (
            reduced ||
            mode === "calm" ||
            !window.matchMedia("(pointer: fine)").matches
        )
            return;
        let frame = 0;
        const move = (event) => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const rect = element.getBoundingClientRect();
                element.style.setProperty(
                    "--pointer-x",
                    ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3),
                );
                element.style.setProperty(
                    "--pointer-y",
                    ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3),
                );
                element.style.setProperty(
                    "--spot-x",
                    `${event.clientX - rect.left}px`,
                );
                element.style.setProperty(
                    "--spot-y",
                    `${event.clientY - rect.top}px`,
                );
            });
        };
        const leave = () => {
            cancelAnimationFrame(frame);
            reset();
        };
        element.addEventListener("pointermove", move);
        element.addEventListener("pointerleave", leave);
        return () => {
            cancelAnimationFrame(frame);
            element.removeEventListener("pointermove", move);
            element.removeEventListener("pointerleave", leave);
            reset();
        };
    }, [mode, reduced]);
    return ref;
}
