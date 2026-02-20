import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Start & Scale - Plateforme Bêta",
  description: "La plateforme qui transforme les idées des jeunes en startups à succès",
  icons: {
    icon: "/assets/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
