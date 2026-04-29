import type { FraudCategoryId } from "./categories";
import type { RiskLevel } from "./utils";

export interface Report {
  id: string;
  category: FraudCategoryId;
  identifier: string;
  identifierType: "phone" | "url" | "cnpj";
  description: string;
  location: string;
  createdAt: Date;
  votesUp: number;
  votesDown: number;
  comments: number;
  riskLevel: RiskLevel;
  verified: boolean;
  author: {
    username: string;
    reputation: "Bronze" | "Prata" | "Ouro" | "Diamante";
  };
}

const now = Date.now();
const minutes = (m: number) => new Date(now - m * 60 * 1000);
const hours = (h: number) => new Date(now - h * 60 * 60 * 1000);
const days = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000);

export const MOCK_REPORTS: Report[] = [
  {
    id: "rep-001",
    category: "phishing",
    identifier: "bradesc0-seguro.top",
    identifierType: "url",
    description:
      "Recebi um email dizendo que minha conta seria bloqueada e pedindo para clicar em um link. O domínio e quase idêntico ao real, mas tem um zero no lugar do 'o'.",
    location: "São Paulo, SP",
    createdAt: minutes(12),
    votesUp: 142,
    votesDown: 8,
    comments: 23,
    riskLevel: "critical",
    verified: true,
    author: { username: "maria_s", reputation: "Ouro" },
  },
  {
    id: "rep-002",
    category: "sms",
    identifier: "11998765432",
    identifierType: "phone",
    description:
      "SMS dizendo que recebi um depósito PIX por engano e pedindo devolução. O número e desconhecido e a URL encurtada leva para site falso.",
    location: "Rio de Janeiro, RJ",
    createdAt: minutes(45),
    votesUp: 89,
    votesDown: 3,
    comments: 14,
    riskLevel: "high",
    verified: true,
    author: { username: "pedro_r", reputation: "Prata" },
  },
  {
    id: "rep-003",
    category: "fake-profile",
    identifier: "instagram.com/loja.barato.oficial",
    identifierType: "url",
    description:
      "Perfil clonado de loja real oferecendo produtos com 90% de desconto. Pedem PIX antecipado e nunca entregam. Já identifiquei 3 vítimas.",
    location: "Belo Horizonte, MG",
    createdAt: hours(2),
    votesUp: 234,
    votesDown: 12,
    comments: 41,
    riskLevel: "critical",
    verified: true,
    author: { username: "rafa_lima", reputation: "Diamante" },
  },
  {
    id: "rep-004",
    category: "marketplace",
    identifier: "12345678000190",
    identifierType: "cnpj",
    description:
      "Vendedor no marketplace com CNPJ ativo mas endereços divergentes. Não entregam os produtos e não respondem após pagamento.",
    location: "Curitiba, PR",
    createdAt: hours(5),
    votesUp: 67,
    votesDown: 4,
    comments: 11,
    riskLevel: "high",
    verified: false,
    author: { username: "juliana_m", reputation: "Prata" },
  },
  {
    id: "rep-005",
    category: "pix",
    identifier: "11987654321",
    identifierType: "phone",
    description:
      "Golpe da falsa central do banco. Ligaram dizendo que havia transação suspeita e pediram para fazer PIX de segurança. Perdi R$ 2.000.",
    location: "Salvador, BA",
    createdAt: hours(8),
    votesUp: 156,
    votesDown: 6,
    comments: 28,
    riskLevel: "critical",
    verified: true,
    author: { username: "carlos_a", reputation: "Ouro" },
  },
  {
    id: "rep-006",
    category: "clone-site",
    identifier: "nubank-app-seguro.com",
    identifierType: "url",
    description:
      "Site idêntico ao do Nubank mas com domínio diferente. Pede login e senha, depois solicita token. Domínio registrado há apenas 3 dias.",
    location: "Porto Alegre, RS",
    createdAt: hours(12),
    votesUp: 312,
    votesDown: 15,
    comments: 52,
    riskLevel: "critical",
    verified: true,
    author: { username: "ana_p", reputation: "Diamante" },
  },
  {
    id: "rep-007",
    category: "fake-boleto",
    identifier: "98765432000112",
    identifierType: "cnpj",
    description:
      "Boleto enviado por email com logo da empresa real mas CNPJ e conta de destino diferentes. Valor de R$ 1.247,80.",
    location: "Brasilia, DF",
    createdAt: days(1),
    votesUp: 45,
    votesDown: 2,
    comments: 7,
    riskLevel: "high",
    verified: true,
    author: { username: "lucas_t", reputation: "Prata" },
  },
  {
    id: "rep-008",
    category: "call",
    identifier: "08001234567",
    identifierType: "phone",
    description:
      "Central falsa se identificando como Serasa Limpa Nome. Pede pagamento antecipado via PIX para 'liberar' negociacao. Serasa NÃO cobra para limpar nome.",
    location: "Recife, PE",
    createdAt: days(1),
    votesUp: 201,
    votesDown: 9,
    comments: 34,
    riskLevel: "critical",
    verified: true,
    author: { username: "bruno_s", reputation: "Ouro" },
  },
  {
    id: "rep-009",
    category: "sms",
    identifier: "11912345678",
    identifierType: "phone",
    description:
      "SMS da suposta Receita Federal informando saldo a restituir. Link encurtado leva para página que pede dados bancários completos.",
    location: "Fortaleza, CE",
    createdAt: days(2),
    votesUp: 78,
    votesDown: 5,
    comments: 12,
    riskLevel: "high",
    verified: false,
    author: { username: "vini_c", reputation: "Bronze" },
  },
  {
    id: "rep-010",
    category: "phishing",
    identifier: "correios-entrega-pendente.net",
    identifierType: "url",
    description:
      "Email dos 'Correios' sobre encomenda retida. Link pede pagamento de R$ 4,99 via cartão de crédito. Domínio completamente estranho.",
    location: "Manaus, AM",
    createdAt: days(3),
    votesUp: 92,
    votesDown: 4,
    comments: 17,
    riskLevel: "high",
    verified: true,
    author: { username: "fer_b", reputation: "Prata" },
  },
  {
    id: "rep-011",
    category: "malicious-app",
    identifier: "gov-beneficio.app/download",
    identifierType: "url",
    description:
      "App falso que imita Caixa Tem e solicita permissoes excessivas (SMS, contatos, acessibilidade). Captura dados bancários e senhas.",
    location: "Goiania, GO",
    createdAt: days(4),
    votesUp: 134,
    votesDown: 7,
    comments: 22,
    riskLevel: "critical",
    verified: true,
    author: { username: "deb_g", reputation: "Ouro" },
  },
  {
    id: "rep-012",
    category: "marketplace",
    identifier: "olx-pagamento-seguro.xyz",
    identifierType: "url",
    description:
      "Falso 'sistema de pagamento seguro' da OLX. A plataforma não intermedia pagamentos dessa forma. Página coleta dados de cartão.",
    location: "Campinas, SP",
    createdAt: days(5),
    votesUp: 56,
    votesDown: 3,
    comments: 9,
    riskLevel: "medium",
    verified: false,
    author: { username: "mar_f", reputation: "Bronze" },
  },
];

export function getRecentReports(limit = 12): Report[] {
  return [...MOCK_REPORTS]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

export function getReportById(id: string): Report | undefined {
  return MOCK_REPORTS.find((r) => r.id === id);
}

export const PLATFORM_STATS = {
  activeReports: 12847,
  confirmedScams: 3291,
  monthlySearches: 847_000,
};
