import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthSessionProvider } from "@/components/session-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OPA - Observatório Popular Antifraude",
    template: "%s | OPA",
  },
  description:
    "Plataforma colaborativa brasileira contra golpes digitais. Consulte telefones, links e CNPJs suspeitos antes de transações. Denúncias validadas pela comunidade.",
  keywords: [
    "antifraude",
    "golpe digital",
    "phishing",
    "proteção contra fraudes",
    "consulta telefone",
    "consulta CNPJ",
    "Brasil",
  ],
  authors: [{ name: "OPA" }],
  openGraph: {
    title: "OPA - Observatório Popular Antifraude",
    description:
      "Antes de clicar, consulte. Antes de cair, alerte. Plataforma colaborativa contra golpes digitais.",
    type: "website",
    locale: "pt_BR",
    siteName: "OPA",
  },
  twitter: {
    card: "summary_large_image",
    title: "OPA - Observatório Popular Antifraude",
    description:
      "Plataforma colaborativa brasileira contra golpes digitais",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0F1C" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jakarta.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <AuthSessionProvider session={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <a href="#conteudo-principal" className="skip-link">
              Pular para o conteúdo
            </a>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  toast: "rounded-lg border border-border",
                },
              }}
            />
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
