import Link from "next/link";
import { Logo } from "@/components/logo";

const FOOTER_COLUMNS = [
  {
    title: "Plataforma",
    links: [
      { href: "/feed", label: "Feed público" },
      { href: "/buscar", label: "Buscar" },
      { href: "/denunciar", label: "Denunciar" },
      { href: "#como-funciona", label: "Como funciona" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/termos", label: "Termos de uso" },
      { href: "/privacidade", label: "Política de privacidade" },
      { href: "/moderacao", label: "Política de moderação" },
      { href: "/contestar", label: "Direito de contestação" },
    ],
  },
  {
    title: "Contato",
    links: [
      { href: "/sobre", label: "Sobre o projeto" },
      { href: "/dpo", label: "Encarregado de dados" },
      { href: "/imprensa", label: "Imprensa" },
      { href: "mailto:contato@opa.app", label: "contato@opa.app" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container py-12">
        <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div className="space-y-4">
            <Logo size="lg" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Uma rede colaborativa onde brasileiros protegem brasileiros contra
              golpes digitais. Inteligencia coletiva, validada pela comunidade.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title} className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {col.title}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} OPA - Observatório Popular
            Antifraude. Todos os direitos reservados.
          </p>
          <p className="max-w-2xl text-balance md:text-right">
            OPA e uma plataforma colaborativa. As denúncias refletem a opinião
            de usuários e não constituem prova judicial. Em conformidade com a
            LGPD.
          </p>
        </div>
      </div>
    </footer>
  );
}
