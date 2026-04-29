import { Phone, Link as LinkIcon, Building2 } from "lucide-react";
import { cn, maskCnpj, maskPhone, maskUrl } from "@/lib/utils";

interface MaskedIdentifierProps {
  type: "phone" | "url" | "cnpj";
  value: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const typeConfig = {
  phone: { icon: Phone, label: "Telefone" },
  url: { icon: LinkIcon, label: "URL" },
  cnpj: { icon: Building2, label: "CNPJ" },
};

export function MaskedIdentifier({
  type,
  value,
  showIcon = true,
  size = "md",
  className,
}: MaskedIdentifierProps) {
  const { icon: Icon, label } = typeConfig[type];
  const masked =
    type === "phone"
      ? maskPhone(value)
      : type === "cnpj"
      ? maskCnpj(value)
      : maskUrl(value);

  const sizeClasses = {
    sm: "text-xs [&_svg]:size-3.5",
    md: "text-sm [&_svg]:size-4",
    lg: "text-base [&_svg]:size-5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono font-medium text-foreground",
        sizeClasses[size],
        className
      )}
      aria-label={`${label}: ${masked}`}
    >
      {showIcon && (
        <Icon className="shrink-0 text-muted" aria-hidden="true" />
      )}
      <span className="truncate">{masked}</span>
    </span>
  );
}
