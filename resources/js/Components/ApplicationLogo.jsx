export default function ApplicationLogo({ className = "h-9 w-auto", variant = "dark" }) {
    const logoSrc = variant === "dark" 
        ? "/images/logo.png" 
        : "/images/logo-white.png";
    
    return (
        <img 
            src={logoSrc} 
            alt="Pamasoul" 
            className={className}
        />
    );
}