import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ChaiCode AI Assistant",
  description: "Modern AI-powered learning assistant for developers",
  keywords: "AI, learning, programming, Node.js, Python, assistant",
  authors: [{ name: "ChaiCode Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
