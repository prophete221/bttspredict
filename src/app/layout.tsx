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
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bttsbet.online"),
  title: "BttsBet — Pronostics IA Football +87% | Bonus Linebet & 888starz | Code VISION221",
  description: "Pronostics football BTTS & Over 2.5 par IA (précision historique ~87% sur 15 000+ matchs analysés). Value bets multi-sports, statistiques Aviator, bonus exclusif jusqu'à 150$ avec le code VISION221 sur Linebet et 888starz.",
  keywords: ["BTTS", "Over 2.5", "pronostics football", "IA", "intelligence artificielle", "paris sportifs", "Linebet", "888starz", "VISION221", "BttsBet", "value bet fifa linebet", "cote fifa linebet", "pronostic fifa esport", "statistiques aviator", "multiplicateur aviator", "aviator Linebet", "aviator 888starz", "code promo linebet", "code promo 888starz", "bonus paris sportifs", "pronostics gratuits"],
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
    title: "BttsBet — Pronostics IA Football +87% | Bonus Linebet & 888starz",
    description: "Pronostics IA BTTS & Over 2.5 (précision historique ~87%). Value bets FIFA, statistiques Aviator. Code VISION221 = Bonus exclusif jusqu'à 150$.",
    url: "https://bttsbet.online",
    siteName: "BttsBet",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BttsBet — Pronostics IA Football | Value Bets FIFA | Statistiques Aviator | Code VISION221" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BttsBet — Pronostics IA Football +87% | Bonus Linebet & 888starz | VISION221",
    description: "Pronostics IA football +87% (historique). Value bets FIFA Linebet & 888starz. Statistiques Aviator. Code VISION221 = Bonus 150$.",
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
        {/* Viewport meta — responsive for ALL browsers/devices including notched phones */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover" />
        {/* Theme color for mobile browser chrome */}
        <meta name="theme-color" content="#0A0B1A" />
        {/* Disable automatic telephone number detection */}
        <meta name="format-detection" content="telephone=no" />
        {/* Apple mobile web app — standalone feel */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
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
