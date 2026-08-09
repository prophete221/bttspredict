import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const BottomNavigation = dynamic(() => import("@/components/bttsbet/BottomNavigation"), { loading: () => null });
const CookieConsent = dynamic(() => import("@/components/bttsbet/CookieConsent"), { loading: () => null });

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
  metadataBase: new URL("https://bttspredict.com/"),
  title: {
    default: "Pronostic BTTS Aujourd'hui Gratuit | BTTSPredict Sénégal",
    template: "%s | BTTSPredict",
  },
  description: "Pronostics BTTS et Over 2.5 par moteur IA. Suivi public vérifié, code promo VISION221. 18+.",
  keywords: [
    // Autorité mondiale
    "plateforme btts", "btts predictions site", "leader pronostics btts",
    "plateforme n°1 btts", "world number 1 btts predictions", "best btts prediction site",
    // Mots-clés stratégiques avec "aujourd'hui" (priorité absolue)
    "pronostics btts aujourd'hui", "pronostic btts du jour", "prédiction btts gratuit aujourd'hui",
    "pronostics over 2.5 aujourd'hui", "pronostics btts", "site pronostics btts",
    "pronostics btts gratuit",
    // Mots-clés généraux
    "BTTS", "Both Teams To Score", "pronostics BTTS", "pronostics football",
    "Over 2.5", "prédictions football", "analyse statistique paris",
    "pronostics fiables", "pronostics", "pronostics gratuits",
    "VISION221", "BTTSPredict", "paris sportifs",
    "pronostics Sénégal", "pronostics Afrique",
    "modèle Poisson football", "xG pronostics", "statistiques football",
    "pronostics vérifiés", "transparence pronostics",
    // SEO v59 — cible Afrique de l'Ouest & Maroc
    "pronostic btts afrique ouest", "pronostic btts maroc", "pronostic btts senegal mali cote d'ivoire guinee congo",
  ],
  authors: [
    { name: "BTTSPredict", url: "https://bttspredict.com" },
  ],
  creator: "BTTSPredict",
  publisher: "BTTSPredict",
  alternates: {
    canonical: "https://bttspredict.com/",
    languages: {
      'fr-SN': 'https://bttspredict.com/',
      'fr': 'https://bttspredict.com/',
      'x-default': 'https://bttspredict.com/',
    },
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
    title: "BTTSPredict — Pronostic BTTS Afrique Ouest & Maroc",
    description: "Pronostics BTTS et Over 2.5 gratuits pour Sénégal, Mali, Côte d'Ivoire, Guinée, Congo, Maroc. IA, données ESPN publiques, vérifiable après match. 18+",
    url: "https://bttspredict.com",
    siteName: "BTTSPredict",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BTTSPredict — Pronostic BTTS Afrique Ouest & Maroc" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTTSPredict — Pronostic BTTS Afrique Ouest & Maroc",
    description: "Pronostics BTTS et Over 2.5 gratuits pour Sénégal, Mali, Côte d'Ivoire, Guinée, Congo, Maroc. IA, données ESPN publiques, vérifiable après match. 18+",
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
  themeColor: "#0D0F12",
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
        {/* Préchargement des ressources critiques */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/og-image.png" as="image" />
        <link rel="dns-prefetch" href="https://bttspredict.com" />
        {/* Hreflang pour internationalisation */}
        <link rel="alternate" hrefLang="fr-SN" href="https://bttspredict.com/" />
        <link rel="alternate" hrefLang="fr" href="https://bttspredict.com/" />
        <link rel="alternate" hrefLang="x-default" href="https://bttspredict.com/" />
        {/* Trust signals for crawlers */}
        <meta name="author" content="BTTSPredict" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="revisit-after" content="1 day" />
        <meta name="language" content="French" />
        <meta name="expires" content="never" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="390" />
        {/* Redirection HTTP → HTTPS (le serveur LWS ne gère pas la redirection) */}
        <script dangerouslySetInnerHTML={{ __html: `
          if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            location.replace('https://' + location.hostname + location.pathname + location.search + location.hash);
          }
        `}} />
        {/* Cache-busting + service worker cleanup — forces users to see latest version */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var VERSION = 'bttspredict-v61-bing-fix-global-2026-08-09';
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
        {/* Google Analytics — remplacer G-XXXXXXXXXX par votre ID */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });
            `,
          }}
        />
        {children}
        <BottomNavigation />
        <CookieConsent />
        <div aria-hidden="true" style={{ height: 'calc(64px + env(safe-area-inset-bottom, 0px))' }} />
      </body>
    </html>
  );
}
