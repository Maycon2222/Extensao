"use client";

import { useEffect, useState, type ReactNode } from "react";
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

const BRAZIL_STATES = [
  { uf: "AC", name: "Acre" },
  { uf: "AL", name: "Alagoas" },
  { uf: "AP", name: "Amapá" },
  { uf: "AM", name: "Amazonas" },
  { uf: "BA", name: "Bahia" },
  { uf: "CE", name: "Ceará" },
  { uf: "DF", name: "Distrito Federal" },
  { uf: "ES", name: "Espírito Santo" },
  { uf: "GO", name: "Goiás" },
  { uf: "MA", name: "Maranhão" },
  { uf: "MT", name: "Mato Grosso" },
  { uf: "MS", name: "Mato Grosso do Sul" },
  { uf: "MG", name: "Minas Gerais" },
  { uf: "PA", name: "Pará" },
  { uf: "PB", name: "Paraíba" },
  { uf: "PR", name: "Paraná" },
  { uf: "PE", name: "Pernambuco" },
  { uf: "PI", name: "Piauí" },
  { uf: "RJ", name: "Rio de Janeiro" },
  { uf: "RN", name: "Rio Grande do Norte" },
  { uf: "RS", name: "Rio Grande do Sul" },
  { uf: "RO", name: "Rondônia" },
  { uf: "RR", name: "Roraima" },
  { uf: "SC", name: "Santa Catarina" },
  { uf: "SP", name: "São Paulo" },
  { uf: "SE", name: "Sergipe" },
  { uf: "TO", name: "Tocantins" },
];

const DRAFT_STORAGE_KEY = "opa:denuncia-draft";

interface DenunciaDraft {
  step: number;
  category: FraudCategoryId | null;
  identifier: string;
  description: string;
  locationState: string;
  locationCity: string;
  location: string;
  occurredAt: string;
  accepted: { terms: boolean; truth: boolean };
}

const CITIES_BY_STATE: Record<string, string[]> = {
  AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó", "Brasiléia", "Xapuri", "Plácido de Castro", "Mâncio Lima", "Epitaciolândia"],
  AL: ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "União dos Palmares", "Penedo", "Coruripe", "São Miguel dos Campos", "Campo Alegre", "Delmiro Gouveia"],
  AP: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Mazagão", "Porto Grande", "Tartarugalzinho", "Pedra Branca do Amapari", "Vitória do Jari", "Calçoene"],
  AM: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga", "Maués", "Iranduba", "Humaitá", "São Gabriel da Cachoeira", "Eirunepé"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro", "Lauro de Freitas", "Itabuna", "Ilhéus", "Jequié", "Barreiras", "Alagoinhas", "Porto Seguro", "Teixeira de Freitas", "Simões Filho"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Sobral", "Maracanaú", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá", "Canindé", "Aquiraz", "Pacatuba", "Russas"],
  DF: ["Brasília", "Ceilândia", "Taguatinga", "Samambaia", "Planaltina", "Águas Claras", "Gama", "Guará", "Sobradinho", "Recanto das Emas", "Santa Maria", "São Sebastião"],
  ES: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares", "Cachoeiro de Itapemirim", "Colatina", "Guarapari", "São Mateus", "Aracruz", "Viana", "Nova Venécia"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Águas Lindas de Goiás", "Luziânia", "Valparaíso de Goiás", "Trindade", "Formosa", "Novo Gama", "Catalão", "Itumbiara", "Jataí", "Senador Canedo"],
  MA: ["São Luís", "Imperatriz", "Timon", "Caxias", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Santa Inês", "Barra do Corda", "Chapadinha"],
  MT: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Cáceres", "Sorriso", "Lucas do Rio Verde", "Primavera do Leste", "Barra do Garças", "Alta Floresta", "Pontes e Lacerda"],
  MS: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Naviraí", "Nova Andradina", "Sidrolândia", "Aquidauana", "Maracaju", "Paranaíba", "Coxim"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga", "Sete Lagoas", "Divinópolis", "Santa Luzia", "Ibirité", "Poços de Caldas", "Patos de Minas"],
  PA: ["Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas", "Castanhal", "Abaetetuba", "Cametá", "Marituba", "Bragança", "Altamira", "Tucuruí", "Barcarena", "Itaituba"],
  PB: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cabedelo", "Cajazeiras", "Guarabira", "Sapé", "Mamanguape", "Queimadas"],
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá", "Araucária", "Toledo", "Apucarana", "Campo Largo"],
  PE: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe", "Garanhuns", "Vitória de Santo Antão", "Igarassu", "São Lourenço da Mata"],
  PI: ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano", "Campo Maior", "Barras", "União", "Altos", "José de Freitas", "Pedro II", "Oeiras"],
  RJ: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Niterói", "Nova Iguaçu", "Belford Roxo", "Campos dos Goytacazes", "São João de Meriti", "Petrópolis", "Volta Redonda", "Magé", "Macaé", "Itaboraí", "Cabo Frio", "Angra dos Reis", "Nova Friburgo"],
  RN: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba", "Ceará-Mirim", "Caicó", "Assú", "Currais Novos", "São José de Mipibu", "Santa Cruz", "Apodi"],
  RS: ["Porto Alegre", "Caxias do Sul", "Canoas", "Pelotas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Rio Grande", "Alvorada", "Passo Fundo", "Sapucaia do Sul", "Uruguaiana"],
  RO: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Rolim de Moura", "Jaru", "Guajará-Mirim", "Machadinho d'Oeste", "Buritis", "Pimenta Bueno", "Ouro Preto do Oeste"],
  RR: ["Boa Vista", "Rorainópolis", "Caracaraí", "Alto Alegre", "Mucajaí", "Cantá", "Pacaraima", "Bonfim", "Amajari", "Normandia"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "Chapecó", "São José", "Criciúma", "Itajaí", "Jaraguá do Sul", "Palhoça", "Lages", "Balneário Camboriú", "Brusque", "Tubarão", "Camboriú"],
  SP: ["São Paulo", "Campinas", "Guarulhos", "Santos", "Ribeirão Preto", "São Bernardo do Campo", "São José dos Campos", "Santo André", "Osasco", "Sorocaba", "Mauá", "São José do Rio Preto", "Mogi das Cruzes", "Jundiaí", "Piracicaba", "Bauru", "São Vicente", "Franca", "Praia Grande", "Taubaté"],
  SE: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão", "Estância", "Tobias Barreto", "Itabaianinha", "Simão Dias", "Nossa Senhora da Glória"],
  TO: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Colinas do Tocantins", "Guaraí", "Tocantinópolis", "Dianópolis", "Formoso do Araguaia", "Miracema do Tocantins", "Augustinópolis"],
};

export default function DenunciarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<FraudCategoryId | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [description, setDescription] = useState("");
  const [locationState, setLocationState] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [location, setLocation] = useState("");
  const [occurredAt, setOccurredAt] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [evidences, setEvidences] = useState<File[]>([]);
  const [accepted, setAccepted] = useState({ terms: false, truth: false });
  const [submitting, setSubmitting] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) {
        setDraftLoaded(true);
        return;
      }

      const draft = JSON.parse(raw) as Partial<DenunciaDraft>;
      setStep(
        typeof draft.step === "number" && draft.step >= 1 && draft.step <= 4
          ? draft.step
          : 1
      );
      setCategory(draft.category ?? null);
      setIdentifier(draft.identifier ?? "");
      setDescription(draft.description ?? "");
      setLocationState(draft.locationState ?? "");
      setLocationCity(draft.locationCity ?? "");
      setLocation(draft.location ?? "");
      setOccurredAt(draft.occurredAt ?? new Date().toISOString().split("T")[0]);
      setAccepted(draft.accepted ?? { terms: false, truth: false });
    } catch {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } finally {
      setDraftLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;

    const draft: DenunciaDraft = {
      step,
      category,
      identifier,
      description,
      locationState,
      locationCity,
      location,
      occurredAt,
      accepted,
    };

    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [
    accepted,
    category,
    description,
    draftLoaded,
    identifier,
    location,
    locationCity,
    locationState,
    occurredAt,
    step,
  ]);

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
        description: data.mockMode
          ? "Modo demonstração: a denúncia foi validada, mas não foi salva no banco local."
          : "Obrigado por contribuir. Sua denúncia já está disponível para a comunidade validar.",
      });
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      router.push(data.mockMode ? "/feed" : `/denuncia/${data.id}`);
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
            locationState={locationState}
            locationCity={locationCity}
            onLocationStateChange={(uf) => {
              setLocationState(uf);
              setLocationCity("");
              setLocation("");
            }}
            onLocationCityChange={(city) => {
              setLocationCity(city);
              setLocation(city && locationState ? `${city}, ${locationState}` : "");
            }}
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
  locationState,
  locationCity,
  onLocationStateChange,
  onLocationCityChange,
  occurredAt,
  onOccurredAtChange,
}: {
  category: FraudCategoryId | null;
  identifier: string;
  onIdentifierChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  locationState: string;
  locationCity: string;
  onLocationStateChange: (v: string) => void;
  onLocationCityChange: (v: string) => void;
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
  const cityOptions = locationState ? CITIES_BY_STATE[locationState] ?? [] : [];

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

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="locationState">
              Estado <RequiredMark />
            </Label>
            <select
              id="locationState"
              value={locationState}
              onChange={(e) => onLocationStateChange(e.target.value)}
              className="flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Selecione o estado</option>
              {BRAZIL_STATES.map((state) => (
                <option key={state.uf} value={state.uf}>
                  {state.name} ({state.uf})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="locationCity">
              Cidade <RequiredMark />
            </Label>
            <select
              id="locationCity"
              value={locationCity}
              onChange={(e) => onLocationCityChange(e.target.value)}
              className="flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!locationState}
              required
            >
              <option value="">
                {locationState ? "Selecione a cidade" : "Selecione o estado primeiro"}
              </option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
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
          Evidencias (opcional)
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Adicione screenshots que comprovem o golpe. Maximo 3 arquivos.
        </p>
      </div>

      <WarningCallout tone="warning">
        <span className="font-semibold">Antes de enviar:</span> borre fotos de perfil, nomes completos e numeros de telefone visiveis. Screenshots passam por moderacao antes de serem publicados.
      </WarningCallout>

      <div className="rounded-xl border-2 border-dashed border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Evidencias adicionadas ({evidences.length}/3)
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG, WEBP - ate 5MB cada</p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3">
          {evidences.map((file, idx) => (
            <li
              key={`${file.name}-${idx}`}
              className="relative overflow-hidden rounded-lg border border-border bg-background"
            >
              <div className="flex aspect-video items-center justify-center bg-muted/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Evidencia ${idx + 1}`}
                  className="size-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="min-w-0 truncate text-xs text-muted-foreground">
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

          {evidences.length < 3 && (
            <li>
              <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 text-center transition-colors hover:border-primary hover:bg-primary/10">
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UploadCloud className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {evidences.length === 0 ? "Selecionar arquivos" : "Adicionar mais"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {3 - evidences.length} vaga{3 - evidences.length > 1 ? "s" : ""} restante{3 - evidences.length > 1 ? "s" : ""}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            </li>
          )}
        </ul>
      </div>
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
            <a href="/termos" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a href="/moderacao" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
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
  const styles =
    tone === "warning"
      ? {
          container:
            "border-amber-400/70 bg-amber-400/15 text-amber-50 shadow-[0_0_0_1px_rgba(251,191,36,0.18)]",
          icon: "text-amber-300",
        }
      : {
          container: "border-primary/30 bg-primary/5 text-foreground",
          icon: "text-primary",
        };
  return (
    <div className={cn("flex items-start gap-3 rounded-xl border p-4", styles.container)}>
      <Icon className={cn("mt-0.5 size-5 shrink-0", styles.icon)} aria-hidden="true" />
      <p className="text-sm font-medium leading-relaxed">{children}</p>
    </div>
  );
}
