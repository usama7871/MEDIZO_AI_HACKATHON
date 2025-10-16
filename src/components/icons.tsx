
import type { SVGProps } from 'react';

export const MedizoAiLogo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        className="h-10 w-10 text-primary"
        {...props}
    >
        <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="70%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.3 }} />
                <stop offset="95%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.1 }} />
                <stop offset="100%" style={{ stopColor: "transparent", stopOpacity: 0 }} />
            </radialGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "hsl(var(--background))" }} />
                <stop offset="100%" style={{ stopColor: "hsl(var(--card))" }} />
            </linearGradient>
        </defs>
        
        {/* Glow */}
        <circle cx="128" cy="128" r="120" fill="url(#grad1)" />
        
        {/* Main brain shape */}
        <path 
            d="M128 48 C 80 48, 48 80, 48 128 C 48 176, 80 208, 128 208 C 176 208, 208 176, 208 128 C 208 80, 176 48, 128 48 Z" 
            fill="url(#grad3)"
            stroke="hsl(var(--border))"
            strokeWidth="2"
        />

        {/* Center Line */}
        <path d="M128 48 V 208" stroke="hsl(var(--border))" strokeWidth="2" />

        {/* Circuit paths */}
        <path d="M128 70 L 110 70 L 110 90 L 90 90 M128 186 L 110 186 L 110 166 L 90 166" fill="none" stroke="url(#grad2)" strokeWidth="3" strokeLinecap="round" />
        <path d="M128 110 L 105 110 M128 146 L 105 146" fill="none" stroke="url(#grad2)" strokeWidth="3" strokeLinecap="round" />
        <path d="M128 90 L 115 90 L 115 100 L 105 100" fill="none" stroke="url(#grad2)" strokeWidth="3" strokeLinecap="round" />
        <path d="M128 166 L 115 166 L 115 156 L 105 156" fill="none" stroke="url(#grad2)" strokeWidth="3" strokeLinecap="round" />

        <path d="M128 70 L 146 70 L 146 90 L 166 90 M128 186 L 146 186 L 146 166 L 166 166" fill="none" stroke="url(#grad2)" strokeWidth="3" strokeLinecap="round" />
        <path d="M128 110 L 151 110 M128 146 L 151 146" fill="none" stroke="url(#grad2)" strokeWidth="3" strokeLinecap="round" />
        <path d="M128 90 L 141 90 L 141 100 L 151 100" fill="none" stroke="url(#grad2)" strokeWidth="3" strokeLinecap="round" />
        <path d="M128 166 L 141 166 L 141 156 L 151 156" fill="none" stroke="url(#grad2)" strokeWidth="3" strokeLinecap="round" />


        {/* Central "M" */}
        <text 
            x="128" y="142" 
            fontFamily="Orbitron, sans-serif"
            fontSize="80" 
            fill="hsl(var(--foreground))"
            textAnchor="middle"
            fontWeight="bold"
        >
            M
        </text>

        {/* Pulse line inside "M" */}
        <path d="M96 128 L 108 128 L 114 118 L 122 138 L 128 128 L 134 118 L 142 138 L 150 128 L 160 128" 
            fill="none" 
            stroke="hsl(var(--primary))" 
            strokeWidth="5" 
            strokeLinecap="round"
        />

    </svg>
);
