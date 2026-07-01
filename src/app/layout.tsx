import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bttsbet.online"),
  title: "BttsBet — Pronostics BTTS & Over 2.5 | IA +87% | Code Promo VISION221 | Bonus Linebet 888starz",
  description: "Pronostics football BTTS & Over 2.5 générés par IA — +87% de précision vérifiée. Faille FIFA Linebet & 888starz détectée automatiquement. Code promo VISION221 = Bonus 150$ Linebet + 100% 888starz. Rejoins 2 400+ parieurs gagnants.",
  keywords: ["BTTS", "Over 2.5", "pronostics football", "IA", "intelligence artificielle", "paris sportifs", "Linebet", "888starz", "VISION221", "BttsBet", "faille fifa linebet", "faille fifa 888starz", "faille FIFA", "coupon fifa linebet", "coupon fifa 888starz", "faille cote fifa", "bot fifa linebet", "astuce fifa linebet", "faille jeux fifa", "hack fifa linebet 2026", "coupon fifa gagnant", "faille pari fifa", "code promo linebet", "code promo 888starz", "bonus paris sportifs", "pronostics gratuits"],
  authors: [{ name: "BttsBet" }],
  alternates: {
    canonical: "https://bttsbet.online/",
  },
  other: {
    'geo.region': 'SN',
    'geo.placename': 'Dakar',
    'geo.position': '14.6928;-17.4467',
    ICBM: '14.6928, -17.4467',
    'language': 'fr',
    'rating': 'general',
    'distribution': 'global',
    'revisit-after': '1 day',
    'googlebot': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    'bingbot': 'index, follow, max-image-preview:large',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "BttsBet — Pronostics BTTS & Over 2.5 | IA +87% | Code VISION221",
    description: "Pronostics IA BTTS & Over 2.5 — +87% précision. Faille FIFA Linebet & 888starz. Code promo VISION221 = Bonus exclusif. 2 400+ parieurs gagnants.",
    url: "https://bttsbet.online",
    siteName: "BttsBet",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BttsBet — Pronostics BTTS & Over 2.5 | Code Promo VISION221" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BttsBet — Pronostics BTTS & Over 2.5 | IA +87% | Code VISION221",
    description: "Pronostics IA +87%. Faille FIFA Linebet & 888starz. Code VISION221 = Bonus 150$. Rejoins 2 400+ parieurs.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if('serviceWorker' in navigator){
                navigator.serviceWorker.getRegistrations().then(function(regs){
                  regs.forEach(function(reg){ reg.unregister(); });
                });
                caches.keys().then(function(names){
                  names.forEach(function(name){ caches.delete(name); });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
