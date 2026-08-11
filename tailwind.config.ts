import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Slate Design System palette ──
        darkbg: '#0F172A',
        darkcard: '#1E293B',
        darkhover: '#334155',
        darkborder: '#334155',
        bttsGreen: '#10B981',
        aiBlue: '#3B82F6',
        vipGold: '#F59E0B',
        textMain: '#F8FAFC',
        textMuted: '#94A3B8',
        // ── CSS variable tokens (backward compat) ──
        bgMain: 'var(--bg-main)',
        bgSecondary: 'var(--bg-secondary)',
        bgTertiary: 'var(--bg-tertiary)',
        card: {
          DEFAULT: 'var(--card)',
          hover: 'var(--card-hover)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        brand: {
          indigo: 'var(--brand-indigo)',
          violet: 'var(--brand-violet)',
          cyan: 'var(--brand-cyan)',
        },
        trust: 'var(--trust)',
        stats: 'var(--stats)',
        vip: 'var(--vip)',
        success: 'var(--success)',
        error: 'var(--error)',
        glass: 'var(--glass)',
        // ── Legacy (mapped for backward compat with shadcn) ──
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Squircle-style radius (style Linear / Stripe)
        squircle: '24px',
      },
      backdropBlur: {
        glass: '24px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(7, 10, 20, 0.3), 0 8px 32px rgba(7, 10, 20, 0.4)',
        cta: '0 0 0 1px rgba(212, 175, 55, 0.35), 0 8px 32px rgba(212, 175, 55, 0.10)',
        glass: '0 1px 0 rgba(241, 245, 249, 0.03) inset, 0 8px 32px rgba(7, 10, 20, 0.3)',
        'hover-glow': '0 0 20px rgba(212, 175, 55, 0.3), 0 8px 32px rgba(7, 10, 20, 0.5)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
