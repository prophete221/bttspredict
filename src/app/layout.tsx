import type { Metadata, Viewport } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({ variable: "--font-display", subsets: ["latin"], weight: ['400','500','600','700','800'], display: 'swap' });
const inter = Inter({ variable: "--font-body", subsets: ["latin"], weight: ['400','500','600','700'], display: 'swap' });
const jetbrains = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ['400','500','700'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL("https://bttspredict.com"),
  title: {
    default: "BTTSPredict.com - IA Prédictions BTTS | Both Teams To Score",
    template: "%s | BTTSPredict",
  },
  description: "N°1 des prédictions BTTS par IA. 50+ pronos Both Teams To Score fiables chaque jour.",
  keywords: ["BTTS", "Both Teams To Score", "prédictions football", "IA", "pronostics BTTS", "paris sportifs"],
  authors: [{ name: "BTTSPredict" }],
  alternates: { canonical: "https://bttspredict.com/" },
  openGraph: {
    title: "BTTSPredict.com - IA Prédictions BTTS",
    description: "N°1 des prédictions BTTS par IA. 50+ pronos fiables chaque jour.",
    url: "https://bttspredict.com",
    siteName: "BTTSPredict",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "BTTSPredict.com - IA Prédictions BTTS",
    description: "N°1 des prédictions BTTS par IA.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${sora.variable} ${inter.variable} ${jetbrains.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
