import type { Metadata, Viewport } from "next";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const inter = Inter({
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
    default: "BTTSPredict — Pronostics BTTS et Over 2.5 par nos analystes | Both Teams To Score",
    template: "%s | BTTSPredict",
  },
  description: "Pronostics BTTS aujourd'hui et Over 2.5 par nos analystes. 84,5% de réussite vérifiée, modèles Poisson calibrés sur 50 000 matchs, 6 pronos gratuits par jour. Outil d'aide à la décision, pas de promesse de gain. Code promo VISION221.",
  keywords: [
    // Autorité mondiale
    "n°1 mondial pronostics btts", "meilleur site pronostics btts monde", "leader pronostics btts",
    "plateforme n°1 btts", "world number 1 btts predictions", "best btts prediction site",
    // Mots-clés stratégiques avec "aujourd'hui" (priorité absolue)
    "pronostics btts aujourd'hui", "pronostic btts du jour", "prédiction btts gratuit aujourd'hui",
    "pronostics over 2.5 aujourd'hui", "n°1 pronostics btts", "meilleur site pronostics btts",
    "pronostics btts gratuit",
    // Mots-clés généraux
    "BTTS", "Both Teams To Score", "pronostics BTTS", "pronostics football",
    "Over 2.5", "prédictions football", "analyse statistique paris",
    "pronostics fiables", "meilleur site pronostics", "pronostics gratuits",
    "VISION221", "BTTSPredict", "paris sportifs",
    "pronostics Sénégal", "pronostics Afrique",
    "modèle Poisson football", "xG pronostics", "statistiques football",
    "84,5% réussite", "pronostics vérifiés", "transparence pronostics",
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
    // Signaux d'autorité pour les crawlers
    'rating-agency': 'BTTSPredict — Plateforme de référence Pronostics BTTS',
    'priority': '1',
    'worldwide': 'true',
    'category': 'BTTS predictions platform',
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
    title: "BTTSPredict — N°1 des Prédictions BTTS par nos experts",
    description: "Pronostics BTTS fiables chaque jour. Résultats vérifiés et transparents. Code promo VISION221.",
    url: "https://bttspredict.com",
    siteName: "BTTSPredict",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BTTSPredict — N°1 des prédictions BTTS par nos experts" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTTSPredict — N°1 des Pronostics BTTS aujourd'hui (84,5% vérifié)",
    description: "Pronostics btts aujourd'hui validés par nos analystes. 84,5% de réussite vérifiable. Code promo VISION221.",
    images: ["/og-image.png"],
  },
  category: "sports",
  // Vérification des moteurs de recherche
  verification: {
    google: "bttspredict-gsc-verification-pending",
    other: {
      "msvalidate.01": "DCC3F51EC848E81F65438B72666C59ED",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0D1117",
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
        {/* Cache-busting + service worker cleanup — forces users to see latest version */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var VERSION = 'bttspredict-v20-bing-verification-msvalidate-2026-08-06';
                try {
                  if('serviceWorker' in navigator){
                    navigator.serviceWorker.getRegistrations().then(function(regs){
                      regs.forEach(function(reg){ reg.unregister(); });
                    });
                  }
                  if(window.caches){
                    caches.keys().then(function(names){
                      names.forEach(function(name){ caches.delete(name); });
                    });
                  }
                  var stored = localStorage.getItem('bttspredict_ver');
                  if(stored && stored !== VERSION){
                    localStorage.setItem('bttspredict_ver', VERSION);
                    window.location.reload();
                  } else if(!stored){
                    localStorage.setItem('bttspredict_ver', VERSION);
                  }
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
