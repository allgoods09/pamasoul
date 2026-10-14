import { createContext, useContext, useEffect, useMemo, useState } from "react";

const MotionContext = createContext({
    mode: "bold",
    reduced: false,
    setMode: () => {},
});
export const useMotion = () => useContext(MotionContext);
export default function MotionProvider({ children }) {
    const [mode, setMode] = useState(() => {
        try {
            return ["calm", "flow", "bold"].includes(
                localStorage.getItem("pamasoul.motion"),
            )
                ? localStorage.getItem("pamasoul.motion")
                : "bold";
        } catch {
            return "bold";
        }
    });
    const [reduced, setReduced] = useState(
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const change = () => setReduced(query.matches);
        query.addEventListener("change", change);
        return () => query.removeEventListener("change", change);
    }, []);
    useEffect(() => {
        document.documentElement.dataset.motion = reduced ? "calm" : mode;
        try {
            localStorage.setItem("pamasoul.motion", mode);
        } catch {
            /* Browser storage can be disabled. */
        }
    }, [mode, reduced]);
    const value = useMemo(() => ({ mode, reduced, setMode }), [mode, reduced]);
    return (
        <MotionContext.Provider value={value}>
            {children}
        </MotionContext.Provider>
    );
}
