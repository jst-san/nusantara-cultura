import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";

/**
 * Font dihosting sendiri (berkas WOFF2 di public/fonts) supaya prototipe
 * tetap berjalan tanpa koneksi ke layanan eksternal.
 */
const fraunces = localFont({
  src: "../public/fonts/fraunces-latin.woff2",
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
  fallback: ["Georgia", "ui-serif", "serif"],
});

const jakarta = localFont({
  src: "../public/fonts/plusjakartasans-latin.woff2",
  variable: "--font-jakarta",
  weight: "200 800",
  display: "swap",
  fallback: ["system-ui", "ui-sans-serif", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "TARA: Nusantara Story Quest",
    template: "%s · TARA",
  },
  description:
    "Prototipe game cerita edukasi tentang tradisi Nusantara: ikuti Tara, burung garuda kecil, belajar bertanya, mengamati, dan mencatat. Semua progres tersimpan di perangkat sendiri.",
  applicationName: "TARA: Nusantara Story Quest",
  keywords: ["cerita interaktif", "budaya Nusantara", "wayang", "game edukasi", "prototipe"],
  authors: [{ name: "Prototipe TARA" }],
};

export const viewport: Viewport = {
  themeColor: "#070a18",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme="night" data-text-size="normal" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${jakarta.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
