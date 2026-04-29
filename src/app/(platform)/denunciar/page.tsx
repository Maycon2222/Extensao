"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  UploadCloud,
  X,
  Info,
  ShieldPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  FRAUD_CATEGORIES,
  getCategoryById,
  type FraudCategoryId,
} from "@/lib/categories";
import { MaskedIdentifier } from "@/components/masked-identifier";

const STEPS = [
  { id: 1, label: "Categoria" },
  { id: 2, label: "Detalhes" },
  { id: 3, label: "Evidência" },
  { id: 4, label: "Revisar" },
];

export default function DenunciarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<FraudCategoryId | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [occurredAt, setOccurredAt] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [evidences, setEvidences] = useState<File[]>([]);
  const [accepted, setAccepted] = useState({ terms: false, truth: false });
  const [submitting, setSubmitting] = useState(false);

  const canAdvance = () => {
    if (step === 1) return category !== null;
    if (step === 2)
      return identifier.trim().length > 3 && description.trim().length >= 30 && location.trim().length > 0;
    if (step === 3) return true;
    if (step === 4) return accepted.terms && accepted.truth;
    return false;
  };

  const handleSubmit = async () => {
    if (!category) return;
    setSubmitting(true);
    try {
      const cat = category;
      const identifierType =
        cat === "sms" || cat === "call"
          ? "PHONE"
          : cat === "fake-boleto"
          ? "CNPJ"
          : cat === "marketplace" || cat === "pix"
          ? identifier.replace(/\D/g, "").length === 14
            ? "CNPJ"
            : "URL"
          : "URL";

      const categoryMap: Record<string, string> = {
        phishing: "PHISHING",
        sms: "SMS",
        "fake-profile": "FAKE_PROFILE",
        marketplace: "MARKETPLACE",
        "fake-boleto": "FAKE_BOLETO",
        pix: "PIX",
        "clone-site": "CLONE_SITE",
        call: "CALL",
        "malicious-app": "MALICIOUS_APP",
      };

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: categoryMap[cat],
          identifierType,
          identifier: identifier.trim(),
          description: description.trim(),
          location: location.trim(),
          occurredAt: new Date(occurredAt).toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Erro ao publicar denúncia");
        if (res.status === 401) router.push("/entrar?callbackUrl=/denunciar");
        return;
      }

      toast.success("Denúncia publicada!", {
        description:
          "Obrigado por contribuir. Sua denúncia já está disponível para a comunidade validar.",
      });
      router.push(`/denuncia/${data.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-10">
      <header className="mb-8 space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldPlus className="size-4 text-primary" aria-hidden="true" />
          <span>Nova denúncia</span>
        </div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
          Registrar tentativa de golpe
        </h1>
        <p className="text-sm text-muted-foreground">
          Sua denúncia passa por validação comunitária e pode proteger milhares de pessoas.
        </p>
      </header>

      <Stepper currentStep={step} />

      <div className="mt-8">
        {step === 1 && (
          <StepCategory selected={category} onSelect={setCategory} />
        )}
        {step === 2 && (
          <StepDetails
            category={category}
            identifier={identifier}
            onIdentifierChange={setIdentifier}
            description={description}
            onDescriptionChange={setDescription}
            location={location}
            onLocationChange={setLocation}
            occurredAt={occurredAt}
            onOccurredAtChange={setOccurredAt}
          />
        )}
        {step === 3 && (
          <StepEvidence evidences={evidences} onChange={setEvidences} />
        )}
        {step === 4 && (
          <StepReview
            category={category}
            identifier={identifier}
            description={description}
            location={location}
            occurredAt={occurredAt}
            evidenceCount={evidences.length}
            accepted={accepted}
            onAcceptedChange={setAccepted}
          />
        )}
      </div>

      {/* Navegacao */}
      <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
        <Button
          variant="ghost"
          onClick={() => {
            if (step === 1) router.back();
            else setStep(step - 1);
          }}
          disabled={submitting}
          className="gap-2"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {step === 1 ? "Cancelar" : "Voltar"}
        </Button>

        <span className="hidden text-sm text-muted-foreground sm:block">
          Passo {step} de {STEPS.length}
        </span>

        {step < 4 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canAdvance()}
            className="gap-2"
          >
            Continuar
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canAdvance() || submitting}
            className="gap-2"
            variant="success"
          >
            {submitting ? "Publicando..." : "Publicar denúncia"}
            {!submitting && <Check className="size-4" aria-hidden="true" />}
          </Button>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------- STEPPER -------------------------------------------------- */

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progresso da denúncia">
      {STEPS.map((s, idx) => {
        const isActive = currentStep === s.id;
        const isCompleted = currentStep > s.id;
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-2 min-w-0">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                  isCompleted
                    ? "border-success bg-success text-success-foreground"
                    : isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-muted-foreground"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  s.id
                )}
              </div>
              <span
                className={cn(
                  "hidden whitespace-nowrap text-xs font-medium md:block",
                  isActive
                    ? "text-foreground"
                    : isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 rounded-full transition-colors",
                  isCompleted ? "bg-success" : "bg-border"
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------- STEP 1: CATEGORIA ------------------------------------------------- */

function StepCategory({
  selected,
  onSelect,
}: {
  selected: FraudCategoryId | null;
  onSelect: (id: FraudCategoryId) => void;
}) {
  return (
    <section aria-labelledby="step1-heading" className="space-y-5">
      <div>
        <h2 id="step1-heading" className="text-lg font-bold">
          Qual o tipo de golpe?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha a categoria que melhor descreve a tentativa.
        </p>
      </div>

      <fieldset>
        <legend className="sr-only">Categorias de fraude</legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FRAUD_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selected === cat.id;
            return (
              <label
                key={cat.id}
                className={cn(
                  "relative flex cursor-pointer flex-col gap-3 rounded-xl border-2 p-4 transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/40"
                )}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={isSelected}
                  onChange={() => onSelect(cat.id)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg transition-colors",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted/15 text-muted-foreground"
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold">{cat.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {cat.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" aria-hidden="true" />
                  </div>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}

/* ------------------------------------------------- STEP 2: DETALHES ------------------------------------------------- */

function StepDetails({
  category,
  identifier,
  onIdentifierChange,
  description,
  onDescriptionChange,
  location,
  onLocationChange,
  occurredAt,
  onOccurredAtChange,
}: {
  category: FraudCategoryId | null;
  identifier: string;
  onIdentifierChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  location: string;
  onLocationChange: (v: string) => void;
  occurredAt: string;
  onOccurredAtChange: (v: string) => void;
}) {
  const cat = category ? getCategoryById(category) : null;
  const identifierPlaceholders: Record<string, string> = {
    phone: "(11) 99999-9999",
    url: "https://site-suspeito.com",
    cnpj: "00.000.000/0000-00",
    mixed: "Link, telefone ou CNPJ",
  };

  return (
    <section aria-labelledby="step2-heading" className="space-y-5">
      <div>
        <h2 id="step2-heading" className="text-lg font-bold">
          Detalhes do golpe
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Quanto mais claro, mais fácil para a comunidade validar.
        </p>
      </div>

      <WarningCallout>
        <span className="font-semibold">Importante:</span> não inclua nomes
        completos, CPFs ou dados bancários. Esses dados são removidos e podem
        resultar em remoção da denúncia.
      </WarningCallout>

      <div className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div className="space-y-2">
          <Label htmlFor="identifier">
            Identificador suspeito <RequiredMark />
          </Label>
          <Input
            id="identifier"
            value={identifier}
            onChange={(e) => onIdentifierChange(e.target.value)}
            placeholder={identifierPlaceholders[cat?.identifierType ?? "mixed"]}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs text-muted-foreground">
            Telefone, URL ou CNPJ envolvidos no golpe. Será exibido de forma mascarada.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Descrição do que aconteceu <RequiredMark />
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Descreva como você foi abordado, o que pediram, e qualquer detalhe que ajude outras pessoas a identificar o golpe."
            rows={5}
            maxLength={500}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{description.length < 30 ? `Mínimo 30 caracteres (${30 - description.length} faltam)` : "Descrição ok"}</span>
            <span>{description.length}/500</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">
              Região (cidade/estado) <RequiredMark />
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="São Paulo, SP"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="occurredAt">Data do ocorrido</Label>
            <Input
              id="occurredAt"
              type="date"
              value={occurredAt}
              onChange={(e) => onOccurredAtChange(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------- STEP 3: EVIDENCIA ------------------------------------------------- */

function StepEvidence({
  evidences,
  onChange,
}: {
  evidences: File[];
  onChange: (files: File[]) => void;
}) {
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const current = [...evidences, ...Array.from(files)].slice(0, 3);
    onChange(current);
  };

  const removeFile = (idx: number) => {
    onChange(evidences.filter((_, i) => i !== idx));
  };

  return (
    <section aria-labelledby="step3-heading" className="space-y-5">
      <div>
        <h2 id="step3-heading" className="text-lg font-bold">
          Evidências (opcional)
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Adicione screenshots que comprovem o golpe. Máximo 3 arquivos.
        </p>
      </div>

      <WarningCallout tone="warning">
        <span className="font-semibold">Antes de enviar:</span> borre fotos de perfil, nomes completos e números de telefone visiveis. Screenshots passam por moderação antes de serem publicados.
      </WarningCallout>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card p-10 text-center transition-colors hover:border-primary/40 hover:bg-muted/5">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UploadCloud className="size-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold">Clique para selecionar ou arraste arquivos</p>
          <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP · até 5MB cada · até 3 arquivos</p>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {evidences.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Arquivos selecionados ({evidences.length}/3)
          </p>
          <ul className="grid gap-2 sm:grid-cols-3">
            {evidences.map((file, idx) => (
              <li
                key={idx}
                className="relative overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="flex aspect-video items-center justify-center bg-muted/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Evidência ${idx + 1}`}
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="truncate text-xs text-muted-foreground">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    aria-label={`Remover arquivo ${file.name}`}
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------- STEP 4: REVISAR ------------------------------------------------- */

function StepReview({
  category,
  identifier,
  description,
  location,
  occurredAt,
  evidenceCount,
  accepted,
  onAcceptedChange,
}: {
  category: FraudCategoryId | null;
  identifier: string;
  description: string;
  location: string;
  occurredAt: string;
  evidenceCount: number;
  accepted: { terms: boolean; truth: boolean };
  onAcceptedChange: (a: { terms: boolean; truth: boolean }) => void;
}) {
  const cat = category ? getCategoryById(category) : null;
  const type = cat?.identifierType === "mixed"
    ? "url"
    : (cat?.identifierType ?? "url");

  return (
    <section aria-labelledby="step4-heading" className="space-y-5">
      <div>
        <h2 id="step4-heading" className="text-lg font-bold">
          Revise antes de publicar
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Confira as informações e aceite as declaracoes para concluir.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <ReviewRow label="Categoria" value={cat?.label ?? "-"} />
        <ReviewRow
          label="Identificador"
          value={
            <MaskedIdentifier
              type={type as "phone" | "url" | "cnpj"}
              value={identifier}
              size="sm"
            />
          }
        />
        <ReviewRow label="Descrição" value={description || "-"} multiline />
        <ReviewRow label="Região" value={location || "-"} />
        <ReviewRow
          label="Data do ocorrido"
          value={new Date(occurredAt).toLocaleDateString("pt-BR")}
        />
        <ReviewRow
          label="Evidências"
          value={evidenceCount > 0 ? `${evidenceCount} arquivo${evidenceCount > 1 ? "s" : ""}` : "Nenhuma"}
          last
        />
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-card p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={accepted.truth}
            onChange={(e) =>
              onAcceptedChange({ ...accepted, truth: e.target.checked })
            }
            className="mt-1 size-4 rounded border-border text-primary focus:ring-ring"
          />
          <span className="text-sm leading-relaxed">
            Declaro que as informações acima são verdadeiras e me responsabilizo por elas. Entendo que denúncias falsas podem ser removidas e a conta suspensa.
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={accepted.terms}
            onChange={(e) =>
              onAcceptedChange({ ...accepted, terms: e.target.checked })
            }
            className="mt-1 size-4 rounded border-border text-primary focus:ring-ring"
          />
          <span className="text-sm leading-relaxed">
            Li e aceito os{" "}
            <a href="/termos" className="font-medium text-primary underline-offset-4 hover:underline">
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a href="/moderacao" className="font-medium text-primary underline-offset-4 hover:underline">
              Política de Moderação
            </a>
            .
          </span>
        </label>
      </div>
    </section>
  );
}

function ReviewRow({
  label,
  value,
  multiline,
  last,
}: {
  label: string;
  value: ReactNode;
  multiline?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-1 border-border p-4 sm:grid-cols-[140px_1fr] sm:gap-4 sm:p-5",
        !last && "border-b"
      )}
    >
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "text-sm text-foreground",
          multiline && "whitespace-pre-line"
        )}
      >
        {value}
      </dd>
    </div>
  );
}

/* ------------------------------------------------- HELPERS ------------------------------------------------- */

function RequiredMark() {
  return (
    <span className="text-destructive" aria-label="campo obrigatório">
      *
    </span>
  );
}

function WarningCallout({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warning";
}) {
  const Icon = tone === "warning" ? AlertTriangle : Info;
  const color =
    tone === "warning"
      ? "border-warning/40 bg-warning/10 text-warning-foreground"
      : "border-primary/30 bg-primary/5 text-foreground";
  return (
    <div className={cn("flex items-start gap-3 rounded-xl border p-4", color)}>
      <Icon className="mt-0.5 size-5 shrink-0 text-warning-foreground" aria-hidden="true" />
      <p className="text-sm leading-relaxed">{children}</p>
    </div>
  );
}
