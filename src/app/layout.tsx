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
  title: "BttsBet – Pronostics BTTS & Over 2,5 | Faille FIFA Linebet & 888starz | Précision IA ~87%",
  description: "Pronostics football BTTS & Over 2,5 générés par IA. ~87% de précision. Faille FIFA détectée automatiquement sur Linebet et 888starz — cotes 10-15, fiabilité 98%. Code promo VISION221 pour bonus exclusif.",
  keywords: ["BTTS", "Over 2.5", "pronostics football", "IA", "intelligence artificielle", "paris sportifs", "Linebet", "888starz", "VISION221", "BttsBet", "faille fifa linebet", "faille fifa 888starz", "faille FIFA", "coupon fifa linebet", "coupon fifa 888starz", "faille cote fifa", "bot fifa linebet", "astuce fifa linebet", "faille jeux fifa", "hack fifa linebet 2026", "coupon fifa gagnant", "faille pari fifa"],
  authors: [{ name: "BttsBet" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "BttsBet – Pronostics BTTS & Over 2,5 | Faille FIFA Linebet & 888starz",
    description: "Pronostics IA BTTS & Over 2,5. ~87% précision. Faille FIFA auto sur Linebet et 888starz — cotes 10-15, 98% fiabilité. Code VISION221.",
    url: "https://bttsbet.online",
    siteName: "BttsBet",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BttsBet – Faille FIFA Linebet & 888starz" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BttsBet – Pronostics BTTS & Over 2,5 | Faille FIFA Linebet & 888starz",
    description: "Pronostics IA BTTS & Over 2,5. Faille FIFA sur Linebet et 888starz — cotes 10-15, 98% fiabilité. Code VISION221.",
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
