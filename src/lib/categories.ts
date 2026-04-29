import {
  Mail,
  MessageSquareWarning,
  UserX,
  ShoppingBag,
  FileText,
  Banknote,
  Globe,
  PhoneOutgoing,
  AppWindow,
  type LucideIcon,
} from "lucide-react";

export type FraudCategoryId =
  | "phishing"
  | "sms"
  | "fake-profile"
  | "marketplace"
  | "fake-boleto"
  | "pix"
  | "clone-site"
  | "call"
  | "malicious-app";

export interface FraudCategory {
  id: FraudCategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
  identifierType: "phone" | "url" | "cnpj" | "mixed";
}

export const FRAUD_CATEGORIES: FraudCategory[] = [
  {
    id: "phishing",
    label: "Phishing",
    description: "Emails e sites falsos pedindo dados",
    icon: Mail,
    identifierType: "url",
  },
  {
    id: "sms",
    label: "SMS fraudulento",
    description: "Mensagens com links ou promessas falsas",
    icon: MessageSquareWarning,
    identifierType: "phone",
  },
  {
    id: "fake-profile",
    label: "Perfil falso",
    description: "Contas falsas em redes sociais",
    icon: UserX,
    identifierType: "url",
  },
  {
    id: "marketplace",
    label: "Marketplace",
    description: "Lojas e anuncios fraudulentos",
    icon: ShoppingBag,
    identifierType: "mixed",
  },
  {
    id: "fake-boleto",
    label: "Boleto falso",
    description: "Cobranças adulteradas",
    icon: FileText,
    identifierType: "cnpj",
  },
  {
    id: "pix",
    label: "PIX fraudulento",
    description: "Golpes envolvendo transferencia instantanea",
    icon: Banknote,
    identifierType: "mixed",
  },
  {
    id: "clone-site",
    label: "Site clone",
    description: "Replicas de sites de bancos e empresas",
    icon: Globe,
    identifierType: "url",
  },
  {
    id: "call",
    label: "Ligacao suspeita",
    description: "Central falsa de atendimento",
    icon: PhoneOutgoing,
    identifierType: "phone",
  },
  {
    id: "malicious-app",
    label: "App malicioso",
    description: "Aplicativos que capturam dados",
    icon: AppWindow,
    identifierType: "url",
  },
];

export function getCategoryById(id: FraudCategoryId): FraudCategory {
  return FRAUD_CATEGORIES.find((c) => c.id === id) ?? FRAUD_CATEGORIES[0];
}
