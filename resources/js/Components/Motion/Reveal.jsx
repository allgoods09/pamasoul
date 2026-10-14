import { useEffect, useRef, useState } from "react";
import { useMotion } from "./MotionProvider";
export default function Reveal({
    children,
    className = "",
    delay = 0,
    as: Element = "div",
}) {
    const ref = useRef(null);
    const { mode, reduced } = useMotion();
    const [visible, setVisible] = useState(false);
    const disabled = reduced || mode === "calm";
    useEffect(() => {
        if (disabled || !("IntersectionObserver" in window)) {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.08 },
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [disabled]);
    return (
        <Element
            ref={ref}
            className={`reveal ${visible || disabled ? "is-visible" : ""} ${className}`}
            style={{ "--reveal-delay": `${delay}ms` }}
        >
            {children}
        </Element>
    );
}
