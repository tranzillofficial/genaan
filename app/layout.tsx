import type { Metadata } from "next";
import { Inter, Outfit, Fugaz_One } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./lib/auth-context";
import { CartProvider } from "./lib/cart-context";
import { I18nProvider } from "./lib/i18n-context";
import LangScript from "./lib/LangScript";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const fugazOne = Fugaz_One({
  weight: "400",
  variable: "--font-fugaz",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Genaan | Plants for Business Spaces",
    template: "%s | Genaan",
  },
  description:
    "Plants and matching pots for businesses in Egypt. Explore packages for clinics, restaurants, hotels, supermarkets and offices, or request a custom quote.",
  keywords: ["business plants", "indoor plants Egypt", "plant packages", "Genaan"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Genaan | Plants for Business Spaces",
    description: "Plant packages that bring business spaces to life.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} ${fugazOne.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LangScript />
        <I18nProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
