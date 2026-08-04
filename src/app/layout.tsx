import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
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
    default: "BTTSPredict — N°1 des Prédictions BTTS par IA | Both Teams To Score",
    template: "%s | BTTSPredict",
  },
  description: "N°1 des prédictions BTTS par IA. 50+ pronos Both Teams To Score fiables chaque jour. Modèles Poisson calibrés sur 50 000 matchs. Résultats vérifiés et transparents. Code promo VISION221.",
  keywords: [
    "BTTS", "Both Teams To Score", "pronostics BTTS", "pronostics football IA",
    "Over 2.5", "prédictions football", "intelligence artificielle paris",
    "pronostics fiables", "meilleur site pronostics", "pronostics gratuits",
    "VISION221", "BTTSPredict", "paris sportifs IA",
    "pronostics Sénégal", "pronostics Afrique",
    "modèle Poisson football", "xG pronostics", "statistiques football",
  ],
  authors: [
    { name: "BTTSPredict", url: "https://bttspredict.com" },
  ],
  creator: "BTTSPredict",
  publisher: "BTTSPredict",
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
    'author': 'BTTSPredict',
    'referrer': 'strict-origin-when-cross-origin',
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
    title: "BTTSPredict — N°1 des Prédictions BTTS par IA",
    description: "50+ pronos BTTS fiables chaque jour. IA calibrée sur 50 000 matchs. Résultats vérifiés. Code promo VISION221.",
    url: "https://bttspredict.com",
    siteName: "BTTSPredict",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BTTSPredict — N°1 des prédictions BTTS par IA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTTSPredict — N°1 des Prédictions BTTS par IA",
    description: "50+ pronos BTTS fiables chaque jour. IA calibrée sur 50 000 matchs. Résultats vérifiés et transparents.",
    images: ["/og-image.png"],
  },
  category: "sports",
  verification: {
    google: "google-site-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0F1E",
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
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BTTSPredict" />
        {/* Trust signals for crawlers */}
        <meta name="author" content="BTTSPredict" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="revisit-after" content="1 day" />
        <meta name="language" content="French" />
        <meta name="expires" content="never" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="390" />
        {/* Service worker cleanup */}
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
        className={`${plusJakarta.variable} ${poppins.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
