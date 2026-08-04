import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bttspredict.com"),
  title: {
    default: "BttsBet — Pronostics IA Football ~52% | Code Promo VISION221",
    template: "%s | BttsBet",
  },
  description: "Code promo Linebet Sénégal VISION221 — Bonus 90 000 XOF (150$). Pronostics BTTS & Over 2.5 générés par IA (précision historique ~52%). Dépôt Wave, Orange Money, Free Money.",
  keywords: [
    "BTTS", "Over 2.5", "pronostics football", "IA", "intelligence artificielle",
    "paris sportifs", "VISION221", "BttsBet",
    "value bets FIFA", "pronostic FIFA esport", "statistiques Aviator",
    "bonus paris sportifs",
    "pronostics gratuits", "pronostics Sénégal", "Wave paris sportifs",
  ],
  authors: [{ name: "BttsBet" }],
  creator: "BttsBet",
  publisher: "BttsBet",
  alternates: {
    canonical: "https://bttspredict.com/",
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
    apple: "/icon-192.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "BttsBet — Pronostics IA Football ~52% | Code Promo VISION221",
    description: "Code promo Linebet Sénégal VISION221 — Bonus 90 000 XOF. Pronostics IA BTTS & Over 2.5 (précision historique ~52%). Dépôt Wave, Orange Money.",
    url: "https://bttspredict.com",
    siteName: "BttsBet",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BttsBet — Pronostics IA Football | Value Bets FIFA | Statistiques Aviator | Code VISION221" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BttsBet — Pronostics IA Football ~52% | Code Promo VISION221",
    description: "Pronostics IA football ~87% (historique). Code VISION221 = Bonus 90 000 XOF sur Linebet. Dépôt Wave, Orange Money au Sénégal.",
    images: ["/og-image.png"],
  },
  category: "sports",
};

export const viewport: Viewport = {
  themeColor: "#05070A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-SN" className="dark" suppressHydrationWarning>
      <head>
        {/* Disable automatic telephone number detection */}
        <meta name="format-detection" content="telephone=no" />
        {/* Apple mobile web app — standalone feel */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BttsBet" />
        {/* Service worker cleanup + cache busting — force users to see latest version */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var VERSION = 'v2-platinum-elite-2026-08-04';
                try {
                  // 1. Unregister all service workers
                  if('serviceWorker' in navigator){
                    navigator.serviceWorker.getRegistrations().then(function(regs){
                      regs.forEach(function(reg){ reg.unregister(); });
                    });
                  }
                  // 2. Clear all caches
                  if(window.caches){
                    caches.keys().then(function(names){
                      names.forEach(function(name){ caches.delete(name); });
                    });
                  }
                  // 3. Force hard reload if version mismatch (only once)
                  var stored = localStorage.getItem('bttsbet_ver');
                  if(stored && stored !== VERSION){
                    // Version changed — force reload from server (bypass browser cache)
                    localStorage.setItem('bttsbet_ver', VERSION);
                    window.location.reload();
                  } else if(!stored){
                    localStorage.setItem('bttsbet_ver', VERSION);
                  }
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
