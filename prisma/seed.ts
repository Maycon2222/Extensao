/**
 * Seed de dados para desenvolvimento.
 *
 * Cria:
 * - 8 usuarios com reputacoes diferentes (Bronze ate Diamante)
 * - 12 denuncias cobrindo todas as 9 categorias
 * - Votos distribuidos para gerar scores de credibilidade realistas
 * - Comentarios em algumas denuncias
 */

import { PrismaClient, FraudCategory, IdentifierType, RiskLevel, ReputationTier, VoteType } from "../src/generated/prisma";
import bcrypt from "bcryptjs";
import {
  normalizePhone,
  normalizeUrl,
  normalizeCnpj,
} from "../src/lib/normalize";

const db = new PrismaClient();

async function main() {
  console.log("Limpando banco...");
  await db.comment.deleteMany();
  await db.vote.deleteMany();
  await db.evidence.deleteMany();
  await db.contestation.deleteMany();
  await db.report.deleteMany();
  await db.account.deleteMany();
  await db.session.deleteMany();
  await db.user.deleteMany();

  console.log("Criando usuarios...");
  const seedPassword = process.env.SEED_USER_PASSWORD;
  const passwordHash = seedPassword ? await bcrypt.hash(seedPassword, 12) : null;
  const adminPasswordHash =
    process.env.SEED_ADMIN_PASSWORD && process.env.SEED_ADMIN_EMAIL
      ? await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12)
      : null;

  const seedUsers = [
    {
      email: "seed-user-01@example.invalid",
      username: "maria_s",
      name: "Maria Silva",
      reputationTier: "OURO" as ReputationTier,
      reputationScore: 1800,
    },
    {
      email: "seed-user-02@example.invalid",
      username: "rafa_lima",
      name: "Rafael Lima",
      reputationTier: "DIAMANTE" as ReputationTier,
      reputationScore: 3200,
    },
    {
      email: "seed-user-03@example.invalid",
      username: "pedro_r",
      name: "Pedro Ramos",
      reputationTier: "PRATA" as ReputationTier,
      reputationScore: 420,
    },
    {
      email: "seed-user-04@example.invalid",
      username: "juliana_m",
      name: "Juliana Moreira",
      reputationTier: "PRATA" as ReputationTier,
      reputationScore: 380,
    },
    {
      email: "seed-user-05@example.invalid",
      username: "carlos_a",
      name: "Carlos Almeida",
      reputationTier: "OURO" as ReputationTier,
      reputationScore: 1200,
    },
    {
      email: "seed-user-06@example.invalid",
      username: "ana_p",
      name: "Ana Pereira",
      reputationTier: "DIAMANTE" as ReputationTier,
      reputationScore: 2800,
    },
    {
      email: "seed-user-07@example.invalid",
      username: "lucas_t",
      name: "Lucas Teixeira",
      reputationTier: "BRONZE" as ReputationTier,
      reputationScore: 50,
    },
  ];

  const users = await Promise.all([
    ...(process.env.SEED_ADMIN_EMAIL && adminPasswordHash
      ? [
          db.user.create({
            data: {
              email: process.env.SEED_ADMIN_EMAIL,
              username: process.env.SEED_ADMIN_USERNAME ?? "admin",
              name: process.env.SEED_ADMIN_NAME ?? "Administrador OPA",
              passwordHash: adminPasswordHash,
              role: "ADMIN",
              reputationTier: "DIAMANTE",
              reputationScore: 5000,
              acceptedTermsAt: new Date(),
              emailVerified: new Date(),
            },
          }),
        ]
      : []),
    ...seedUsers.map((user) =>
      db.user.create({
        data: {
          ...user,
          passwordHash,
          acceptedTermsAt: new Date(),
          emailVerified: new Date(),
        },
      })
    ),
  ]);

  const [maria, rafa, pedro, ju, carlos, ana, lucas] = users.slice(-7);

  console.log(`${users.length} usuarios criados.`);

  // Helpers de tempo
  const now = Date.now();
  const minutes = (m: number) => new Date(now - m * 60 * 1000);
  const hours = (h: number) => new Date(now - h * 60 * 60 * 1000);
  const days = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000);

  console.log("Criando denuncias...");

  const reportData: Array<{
    authorId: string;
    category: FraudCategory;
    identifierType: IdentifierType;
    identifierRaw: string;
    description: string;
    location: string;
    occurredAt: Date;
    createdAt: Date;
    votesUp: number;
    votesDown: number;
    commentCount: number;
    credibilityScore: number;
    riskLevel: RiskLevel;
    verified: boolean;
  }> = [
    {
      authorId: maria.id,
      category: "PHISHING",
      identifierType: "URL",
      identifierRaw: "bradesc0-seguro.top",
      description:
        "Recebi um email dizendo que minha conta seria bloqueada e pedindo para clicar em um link. O dominio e quase identico ao real, mas tem um zero no lugar do 'o'.",
      location: "Sao Paulo, SP",
      occurredAt: days(1),
      createdAt: minutes(12),
      votesUp: 142,
      votesDown: 8,
      commentCount: 3,
      credibilityScore: 87,
      riskLevel: "CRITICAL",
      verified: true,
    },
    {
      authorId: pedro.id,
      category: "SMS",
      identifierType: "PHONE",
      identifierRaw: "11998765432",
      description:
        "SMS dizendo que recebi um deposito PIX por engano e pedindo devolucao. O numero e desconhecido e a URL encurtada leva para site falso.",
      location: "Rio de Janeiro, RJ",
      occurredAt: days(1),
      createdAt: minutes(45),
      votesUp: 89,
      votesDown: 3,
      commentCount: 2,
      credibilityScore: 82,
      riskLevel: "HIGH",
      verified: true,
    },
    {
      authorId: rafa.id,
      category: "FAKE_PROFILE",
      identifierType: "URL",
      identifierRaw: "instagram.com/loja.barato.oficial",
      description:
        "Perfil clonado de loja real oferecendo produtos com 90% de desconto. Pedem PIX antecipado e nunca entregam. Ja identifiquei 3 vitimas.",
      location: "Belo Horizonte, MG",
      occurredAt: days(3),
      createdAt: hours(2),
      votesUp: 234,
      votesDown: 12,
      commentCount: 5,
      credibilityScore: 90,
      riskLevel: "CRITICAL",
      verified: true,
    },
    {
      authorId: ju.id,
      category: "MARKETPLACE",
      identifierType: "CNPJ",
      identifierRaw: "12345678000190",
      description:
        "Vendedor no marketplace com CNPJ ativo mas enderecos divergentes. Nao entregam os produtos e nao respondem apos pagamento.",
      location: "Curitiba, PR",
      occurredAt: days(5),
      createdAt: hours(5),
      votesUp: 67,
      votesDown: 4,
      commentCount: 1,
      credibilityScore: 78,
      riskLevel: "HIGH",
      verified: false,
    },
    {
      authorId: carlos.id,
      category: "PIX",
      identifierType: "PHONE",
      identifierRaw: "11987654321",
      description:
        "Golpe da falsa central do banco. Ligaram dizendo que havia transacao suspeita e pediram para fazer PIX de seguranca. Perdi R$ 2.000.",
      location: "Salvador, BA",
      occurredAt: days(2),
      createdAt: hours(8),
      votesUp: 156,
      votesDown: 6,
      commentCount: 4,
      credibilityScore: 89,
      riskLevel: "CRITICAL",
      verified: true,
    },
    {
      authorId: ana.id,
      category: "CLONE_SITE",
      identifierType: "URL",
      identifierRaw: "nubank-app-seguro.com",
      description:
        "Site identico ao do Nubank mas com dominio diferente. Pede login e senha, depois solicita token. Dominio registrado ha apenas 3 dias.",
      location: "Porto Alegre, RS",
      occurredAt: days(1),
      createdAt: hours(12),
      votesUp: 312,
      votesDown: 15,
      commentCount: 8,
      credibilityScore: 91,
      riskLevel: "CRITICAL",
      verified: true,
    },
    {
      authorId: lucas.id,
      category: "FAKE_BOLETO",
      identifierType: "CNPJ",
      identifierRaw: "98765432000112",
      description:
        "Boleto enviado por email com logo da empresa real mas CNPJ e conta de destino diferentes. Valor de R$ 1.247,80.",
      location: "Brasilia, DF",
      occurredAt: days(7),
      createdAt: days(1),
      votesUp: 45,
      votesDown: 2,
      commentCount: 1,
      credibilityScore: 75,
      riskLevel: "HIGH",
      verified: true,
    },
    {
      authorId: carlos.id,
      category: "CALL",
      identifierType: "PHONE",
      identifierRaw: "08001234567",
      description:
        "Central falsa se identificando como Serasa Limpa Nome. Pede pagamento antecipado via PIX para 'liberar' negociacao. Serasa NAO cobra para limpar nome.",
      location: "Recife, PE",
      occurredAt: days(3),
      createdAt: days(1),
      votesUp: 201,
      votesDown: 9,
      commentCount: 6,
      credibilityScore: 88,
      riskLevel: "CRITICAL",
      verified: true,
    },
    {
      authorId: pedro.id,
      category: "SMS",
      identifierType: "PHONE",
      identifierRaw: "11912345678",
      description:
        "SMS da suposta Receita Federal informando saldo a restituir. Link encurtado leva para pagina que pede dados bancarios completos.",
      location: "Fortaleza, CE",
      occurredAt: days(4),
      createdAt: days(2),
      votesUp: 78,
      votesDown: 5,
      commentCount: 2,
      credibilityScore: 76,
      riskLevel: "HIGH",
      verified: false,
    },
    {
      authorId: maria.id,
      category: "PHISHING",
      identifierType: "URL",
      identifierRaw: "correios-entrega-pendente.net",
      description:
        "Email dos 'Correios' sobre encomenda retida. Link pede pagamento de R$ 4,99 via cartao de credito. Dominio completamente estranho.",
      location: "Manaus, AM",
      occurredAt: days(5),
      createdAt: days(3),
      votesUp: 92,
      votesDown: 4,
      commentCount: 3,
      credibilityScore: 81,
      riskLevel: "HIGH",
      verified: true,
    },
    {
      authorId: ana.id,
      category: "MALICIOUS_APP",
      identifierType: "URL",
      identifierRaw: "gov-beneficio.app/download",
      description:
        "App falso que imita Caixa Tem e solicita permissoes excessivas (SMS, contatos, acessibilidade). Captura dados bancarios e senhas.",
      location: "Goiania, GO",
      occurredAt: days(6),
      createdAt: days(4),
      votesUp: 134,
      votesDown: 7,
      commentCount: 4,
      credibilityScore: 86,
      riskLevel: "CRITICAL",
      verified: true,
    },
    {
      authorId: lucas.id,
      category: "MARKETPLACE",
      identifierType: "URL",
      identifierRaw: "olx-pagamento-seguro.xyz",
      description:
        "Falso 'sistema de pagamento seguro' da OLX. A plataforma nao intermedia pagamentos dessa forma. Pagina coleta dados de cartao.",
      location: "Campinas, SP",
      occurredAt: days(8),
      createdAt: days(5),
      votesUp: 56,
      votesDown: 3,
      commentCount: 2,
      credibilityScore: 73,
      riskLevel: "MEDIUM",
      verified: false,
    },
  ];

  const created = [];
  for (const data of reportData) {
    const normalized =
      data.identifierType === "PHONE"
        ? normalizePhone(data.identifierRaw)
        : data.identifierType === "CNPJ"
        ? normalizeCnpj(data.identifierRaw)
        : normalizeUrl(data.identifierRaw);

    const report = await db.report.create({
      data: {
        authorId: data.authorId,
        category: data.category,
        identifierType: data.identifierType,
        identifierRaw: data.identifierRaw,
        identifierNormalized: normalized,
        description: data.description,
        location: data.location,
        occurredAt: data.occurredAt,
        createdAt: data.createdAt,
        votesUp: data.votesUp,
        votesDown: data.votesDown,
        commentCount: data.commentCount,
        credibilityScore: data.credibilityScore,
        riskLevel: data.riskLevel,
        verified: data.verified,
      },
    });
    created.push(report);
  }

  console.log(`${created.length} denuncias criadas.`);

  console.log("Criando votos de amostra...");
  // Criar alguns votos reais para simular atividade
  const voters = [maria, rafa, pedro, ju, carlos, ana];
  let voteCount = 0;
  for (const report of created.slice(0, 6)) {
    for (const voter of voters) {
      if (voter.id === report.authorId) continue; // nao vota na propria
      try {
        await db.vote.create({
          data: {
            reportId: report.id,
            userId: voter.id,
            type: Math.random() > 0.15 ? VoteType.CONFIRM : VoteType.FALSE_ALERT,
            weight:
              voter.reputationTier === "DIAMANTE"
                ? 3
                : voter.reputationTier === "OURO"
                ? 2
                : voter.reputationTier === "PRATA"
                ? 1.25
                : 1,
          },
        });
        voteCount++;
      } catch {
        // ignore duplicate
      }
    }
  }
  console.log(`${voteCount} votos criados.`);

  console.log("Criando comentarios...");
  const comments = [
    {
      reportId: created[0].id,
      authorId: lucas.id,
      content: "Recebi o mesmo email ontem. Dominio identico com zero no lugar do 'o'.",
    },
    {
      reportId: created[0].id,
      authorId: ana.id,
      content: "Ja reportei esse dominio ao Registro.br e ao Bradesco. Valeu pelo alerta detalhado.",
    },
    {
      reportId: created[0].id,
      authorId: pedro.id,
      content: "Alerta importante. Minha mae quase caiu nesse mesmo golpe semana passada.",
    },
    {
      reportId: created[4].id,
      authorId: maria.id,
      content: "A Caixa e os bancos em geral NUNCA ligam pedindo pra fazer PIX de seguranca. Sempre desconfie.",
    },
    {
      reportId: created[5].id,
      authorId: rafa.id,
      content: "Dominio registrado ontem? Isso e gigante red flag. Nubank nao faz isso.",
    },
  ];

  for (const c of comments) {
    await db.comment.create({ data: c });
  }
  console.log(`${comments.length} comentarios criados.`);

  console.log("\nSeed concluido!");
  if (process.env.SEED_ADMIN_EMAIL) {
    console.log("Usuario administrador criado a partir das variaveis SEED_ADMIN_*.");
  }
  if (seedPassword) {
    console.log("Usuarios de desenvolvimento criados com a senha definida em SEED_USER_PASSWORD.");
  } else {
    console.log("Usuarios de desenvolvimento criados sem senha de login.");
  }
}

main()
  .catch((e) => {
    console.error("Seed falhou:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
