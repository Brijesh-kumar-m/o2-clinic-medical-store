import React from 'react';

const Logo = ({ className = "w-10 h-10", showText = true, variant = "default" }) => {
  // variants: "default" (colored), "white" (for dark backgrounds)

  const iconColor1 = variant === "white" ? "#FFFFFF" : "#0284C7"; // brand-primary
  const iconColor2 = variant === "white" ? "#E2E8F0" : "#0D9488"; // brand-secondary
  const textColor = variant === "white" ? "text-white" : "text-brand-primary";
  const accentColor = variant === "white" ? "text-blue-200" : "text-brand-secondary";

  return (
    <div className={`flex items-center gap-3 ${className.replace(/w-\d+ h-\d+/, '')}`}>
      <div className={`${className} relative flex-shrink-0`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="o2-gradient" x1="10" y1="50" x2="90" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={iconColor1} stopOpacity="0.8" />
              <stop offset="100%" stopColor={iconColor2} stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* O2 Molecule Representation: Two connected atoms */}
          <g filter="url(#glow)">
            {/* Atom 1 */}
            <circle cx="35" cy="50" r="25" stroke={iconColor1} strokeWidth="6" fill="url(#o2-gradient)" fillOpacity="0.1" />
            {/* Atom 2 */}
            <circle cx="65" cy="50" r="25" stroke={iconColor2} strokeWidth="6" fill="url(#o2-gradient)" fillOpacity="0.1" />

            {/* Double Bond connection */}
            <path d="M45 42 H55" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <path d="M45 58 H55" stroke="white" strokeWidth="3" strokeLinecap="round" />

            {/* Floating Electrons / Zen Orbits */}
            <ellipse cx="50" cy="50" rx="42" ry="15" stroke={iconColor1} strokeWidth="1" strokeOpacity="0.5" transform="rotate(-15 50 50)" />
            <ellipse cx="50" cy="50" rx="42" ry="15" stroke={iconColor2} strokeWidth="1" strokeOpacity="0.5" transform="rotate(15 50 50)" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <h1 className={`font-bold text-xl tracking-tight leading-none ${textColor}`}>
            O2<span className={accentColor}>Clinic</span>
          </h1>
          <span className={`text-[10px] font-medium tracking-[0.2em] uppercase opacity-80 ${variant === 'white' ? 'text-white' : 'text-slate-500'}`}>
            Next Gen Care
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
