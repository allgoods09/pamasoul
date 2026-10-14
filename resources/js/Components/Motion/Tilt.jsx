import usePointerMotion from "@/hooks/usePointerMotion";
export default function Tilt({ children, className = "" }) {
    const ref = usePointerMotion();
    return (
        <div ref={ref} className={`tilt-surface ${className}`}>
            {children}
        </div>
    );
}
