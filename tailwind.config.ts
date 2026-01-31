/**
 * ⚠️ CRITICAL: This config defines AirBear's visual identity.
 * DO NOT remove safelist entries or animation definitions.
 *
 * See: CORE_UI_FOUNDATION.md for documentation
 * Validate: npm run validate:ui
 */

import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: "class",
	content: [
		"./client/index.html",
		"./client/src/**/*.{js,jsx,ts,tsx}",
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				sans: ["var(--font-sans)", ...require("tailwindcss/defaultTheme").fontFamily.sans],
				serif: ["var(--font-serif)", ...require("tailwindcss/defaultTheme").fontFamily.serif],
				mono: ["var(--font-mono)", ...require("tailwindcss/defaultTheme").fontFamily.mono],
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"float": {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-20px)" },
				},
				"shimmer": {
					"0%": { backgroundPosition: "200% 0" },
					"100%": { backgroundPosition: "-200% 0" },
				},
				"particle": {
					"0%": { opacity: "0", transform: "translateY(0px)" },
					"10%": { opacity: "1" },
					"90%": { opacity: "1" },
					"100%": { opacity: "0", transform: "translateY(-100px)" },
				},
				"rickshaw-bounce": {
					"0%, 100%": { transform: "translateY(0) rotate(0deg)" },
					"25%": { transform: "translateY(-10px) rotate(-5deg)" },
					"75%": { transform: "translateY(-10px) rotate(5deg)" },
				},
				"wheel-spin": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				"neon-glow": {
					"0%, 100%": { boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)" },
					"50%": { boxShadow: "0 0 40px rgba(34, 197, 94, 0.8)" },
				},
				"vortex-zoom": {
					"0%": { transform: "scale(1) rotate(0deg)" },
					"50%": { transform: "scale(1.1) rotate(180deg)" },
					"100%": { transform: "scale(1) rotate(360deg)" },
				},
				"confetti-burst": {
					"0%": { transform: "scale(0) rotate(0deg)", opacity: "1" },
					"50%": { transform: "scale(1.2) rotate(180deg)", opacity: "0.8" },
					"100%": { transform: "scale(1.5) rotate(360deg)", opacity: "0" },
				},
				"liquid-fill": {
					"0%": { transform: "translateY(100%)" },
					"100%": { transform: "translateY(0)" },
				},
				"ripple-wave": {
					"0%": { transform: "scale(0)", opacity: "1" },
					"100%": { transform: "scale(4)", opacity: "0" },
				},
				"holographic": {
					"0%, 100%": { filter: "hue-rotate(0deg)" },
					"50%": { filter: "hue-rotate(180deg)" },
				},
				"plasma-flow": {
					"0%, 100%": { 
						background: "linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0)",
						filter: "hue-rotate(0deg)"
					},
					"50%": { 
						background: "linear-gradient(45deg, #40e0d0, #ff0080, #ff8c00)",
						filter: "hue-rotate(180deg)"
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"spin-slow": "spin 3s linear infinite",
				"pulse-glow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"float": "float 3s ease-in-out infinite",
				"shimmer": "shimmer 2s linear infinite",
				"particle": "particle 4s ease-in-out infinite",
				"rickshaw-bounce": "rickshaw-bounce 2s ease-in-out infinite",
				"wheel-spin": "wheel-spin 2s linear infinite",
				"neon-glow": "neon-glow 2s ease-in-out infinite",
				"vortex-zoom": "vortex-zoom 3s ease-in-out infinite",
				"confetti-burst": "confetti-burst 1s ease-out",
				"liquid-fill": "liquid-fill 2s ease-in-out",
				"ripple-wave": "ripple-wave 1s ease-out",
				"holographic": "holographic 4s ease-in-out infinite",
				"plasma": "plasma-flow 3s ease-in-out infinite",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};

// Add safelist with type assertion to preserve AirBear styles
(config as any).safelist = [
	"airbear-holographic",
	"airbear-plasma",
	"airbear-solar-rays",
	"airbear-marker",
	"airbear-eco-breeze",
	"airbear-god-rays",
	"glass-morphism",
	"neumorphism",
	"eco-gradient",
	"particle-system",
	"airbear-wheel",
	"hover-lift",
	"ripple-effect",
	"animate-spin-slow",
	"animate-pulse-glow",
  "animate-map-marker-pulse",
  "animate-map-marker-pulse-glow",
	"animate-float",
	"animate-shimmer",
	"animate-particle",
	"animate-rickshaw-bounce",
	"animate-wheel-spin",
	"animate-neon-glow",
	"animate-vortex-zoom",
	"animate-confetti-burst",
	"animate-liquid-fill",
	"animate-ripple-wave",
	"animate-holographic",
	"animate-plasma",
];

export default config;