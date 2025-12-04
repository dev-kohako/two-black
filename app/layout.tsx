import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Two Black",
  description: "Two Black's Portfolio",
  robots: "index, follow",
  authors: [{ name: "Two Black’s Team" }],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} font-sora scroll-smooth`}
    >
      <body
        className="
          antialiased
        "
      >
        {children}
      </body>
    </html>
  );
}
