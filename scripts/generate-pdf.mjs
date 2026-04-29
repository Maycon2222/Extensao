import PDFDocument from "pdfkit";
import fs from "node:fs";

// =================== Paleta ===================
const C = {
  primary: "#0F4C81",
  primaryLight: "#1E6BA8",
  secondary: "#0D9488",
  secondaryLight: "#14B8A6",
  dark: "#0A1F3D",
  light: "#F8FAFC",
  white: "#FFFFFF",
  gray: "#64748B",
  grayLight: "#CBD5E1",
  grayDark: "#334155",
  success: "#16A34A",
  warning: "#EAB308",
  danger: "#DC2626",
  riskLow: "#16A34A",
  riskMedium: "#EAB308",
  riskHigh: "#F97316",
  riskCritical: "#DC2626",
};

// =================== Dimensoes ===================
// Slide widescreen 13.33 x 7.5 polegadas -> 960 x 540 points
const W = 960;
const H = 540;
const TOTAL_SLIDES = 13;

// =================== Init ===================
const out = "C:/Users/User/Documents/Opa/OPA_Apresentacao.pdf";
const doc = new PDFDocument({
  size: [W, H],
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  autoFirstPage: false,
  info: {
    Title: "OPA - Observatorio Popular Antifraude",
    Author: "Projeto de Extensao",
    Subject: "Plataforma colaborativa contra fraudes digitais",
    Keywords: "antifraude, LGPD, Next.js, projeto academico",
  },
});
doc.pipe(fs.createWriteStream(out));

// =================== Helpers ===================
function newSlide(bg = C.white) {
  doc.addPage({ size: [W, H], margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  doc.rect(0, 0, W, H).fill(bg);
}

function accent() {
  doc.rect(0, 0, 8, H).fill(C.primary);
}

function text(str, x, y, options = {}) {
  const {
    font = "Helvetica",
    size = 14,
    color = C.grayDark,
    w = W - x - 20,
    align = "left",
    letterSpacing = 0,
  } = options;
  doc.font(font)
    .fontSize(size)
    .fillColor(color);
  if (letterSpacing) doc.text(str, x, y, { width: w, align, characterSpacing: letterSpacing });
  else doc.text(str, x, y, { width: w, align });
}

function eyebrow(str, x, y) {
  text(str, x, y, { font: "Helvetica-Bold", size: 9, color: C.secondary, letterSpacing: 2 });
}

function title(str, x, y, size = 28, color = C.dark) {
  text(str, x, y, { font: "Helvetica-Bold", size, color, w: W - x - 20 });
}

function body(str, x, y, options = {}) {
  text(str, x, y, { font: "Helvetica", size: 12, color: C.grayDark, ...options });
}

function roundRect(x, y, w, h, r, fillColor, strokeColor, strokeWidth = 0) {
  doc.roundedRect(x, y, w, h, r);
  if (fillColor && strokeColor) {
    doc.fillAndStroke(fillColor, strokeColor);
    if (strokeWidth) doc.lineWidth(strokeWidth);
  } else if (fillColor) {
    doc.fill(fillColor);
  } else if (strokeColor) {
    doc.lineWidth(strokeWidth || 1).stroke(strokeColor);
  }
}

function pageNumber(n) {
  text(`${n} / ${TOTAL_SLIDES}`, W - 80, H - 25, {
    font: "Helvetica", size: 8, color: C.gray, w: 60, align: "right",
  });
}

function logo(x, y, size = 40) {
  // Escudo principal
  doc.roundedRect(x, y, size, size, size * 0.15).fill(C.primary);
  // Olho interno
  doc.ellipse(x + size * 0.5, y + size * 0.5, size * 0.28, size * 0.22).fill(C.secondary);
  // Pupila
  doc.ellipse(x + size * 0.5, y + size * 0.5, size * 0.12, size * 0.12).fill(C.white);
}

// =================== SLIDE 1 - CAPA ===================
{
  newSlide(C.dark);

  // Shapes decorativas (circulos com transparencia via layers)
  doc.save();
  doc.fillColor(C.primary, 0.4).ellipse(150, 100, 250, 250).fill();
  doc.fillColor(C.secondary, 0.3).ellipse(800, 500, 280, 280).fill();
  doc.restore();

  logo(60, 60, 50);

  // Eyebrow
  text("PROJETO DE EXTENSAO  ·  2026", 60, 200, {
    font: "Helvetica-Bold", size: 10, color: C.secondaryLight, letterSpacing: 3,
  });

  // OPA big
  text("OPA", 60, 220, {
    font: "Helvetica-Bold", size: 120, color: C.white,
  });

  text("Observatorio Popular Antifraude", 60, 360, {
    font: "Helvetica", size: 24, color: C.white,
  });

  // Linha decorativa
  doc.rect(60, 410, 40, 3).fill(C.secondaryLight);

  text("Plataforma colaborativa brasileira contra golpes digitais", 60, 425, {
    font: "Helvetica-Oblique", size: 14, color: C.grayLight,
  });

  // Footer
  text("Aula de extensao   ·   23 de abril de 2026", 60, H - 40, {
    font: "Helvetica", size: 10, color: C.gray,
  });
}

// =================== SLIDE 2 - O PROBLEMA ===================
{
  newSlide();
  accent();
  eyebrow("O PROBLEMA", 40, 40);
  title("Golpes digitais no Brasil crescem em ritmo acelerado", 40, 58, 26);

  const stats = [
    { num: "R$ 10 bi", lbl: "perdidos com golpes digitais em 2025", color: C.danger },
    { num: "+85%", lbl: "aumento em tentativas de phishing em 3 anos", color: C.riskHigh },
    { num: "1 em 4", lbl: "brasileiros sofreu tentativa de golpe em 2025", color: C.warning },
  ];

  stats.forEach((stat, i) => {
    const x = 40 + i * 300;
    const y = 160;
    roundRect(x, y, 285, 175, 12, C.light, C.grayLight, 1);
    text(stat.num, x + 20, y + 25, { font: "Helvetica-Bold", size: 42, color: stat.color, w: 245 });
    text(stat.lbl, x + 20, y + 90, { font: "Helvetica", size: 12, color: C.grayDark, w: 245 });
  });

  title("Por que isso persiste?", 40, 365, 16);

  const pains = [
    "Vitimas isoladas sem canal unificado para alertar proximos",
    "Desinformacao sobre golpes se espalha mais rapido que a prevencao",
    "Cidadao descobre o risco quando ja e vitima",
    "Orgaos oficiais atuam reativamente, nao em prevencao coletiva",
  ];
  pains.forEach((p, i) => {
    doc.circle(55, 410 + i * 25, 3).fill(C.primary);
    text(p, 70, 403 + i * 25, { font: "Helvetica", size: 11, color: C.grayDark, w: 850 });
  });

  pageNumber(2);
}

// =================== SLIDE 3 - A SOLUCAO ===================
{
  newSlide();
  accent();
  eyebrow("A SOLUCAO", 40, 40);
  title("Inteligencia coletiva validada pela comunidade", 40, 58, 26);

  // Box com tagline
  roundRect(40, 140, 880, 90, 12, C.primary);
  text("Antes de clicar, consulte. Antes de cair, alerte.", 60, 160, {
    font: "Helvetica-BoldOblique", size: 20, color: C.white, w: 840,
  });
  text("Uma rede onde brasileiros protegem brasileiros.", 60, 195, {
    font: "Helvetica", size: 12, color: C.grayLight, w: 840,
  });

  const pillars = [
    { title: "Consulta em tempo real", desc: "Pesquise telefone, link ou CNPJ antes de transacoes" },
    { title: "Validacao comunitaria", desc: "Votos ponderados por reputacao evitam desinformacao" },
    { title: "Score de credibilidade", desc: "Algoritmo Wilson score garante confianca estatistica" },
    { title: "Alerta viral", desc: "Cards prontos pra WhatsApp, Instagram e X" },
  ];

  pillars.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 40 + col * 445;
    const y = 260 + row * 130;

    roundRect(x, y, 430, 115, 10, C.white, C.grayLight, 1);

    // Number circle
    doc.save();
    doc.fillColor(C.primary, 0.15).ellipse(x + 50, y + 58, 35, 35).fill();
    doc.restore();
    text((i + 1).toString(), x + 15, y + 32, {
      font: "Helvetica-Bold", size: 30, color: C.primary, w: 70, align: "center",
    });

    text(p.title, x + 95, y + 25, { font: "Helvetica-Bold", size: 14, color: C.dark, w: 320 });
    text(p.desc, x + 95, y + 50, { font: "Helvetica", size: 11, color: C.grayDark, w: 320 });
  });

  pageNumber(3);
}

// =================== SLIDE 4 - COMO FUNCIONA ===================
{
  newSlide();
  accent();
  eyebrow("COMO FUNCIONA", 40, 40);
  title("Quatro passos para uma internet mais segura", 40, 58, 24);

  const steps = [
    { n: "01", title: "PESQUISE", desc: "Cole um link, telefone ou CNPJ no campo de busca. O sistema normaliza o input e consulta denuncias similares.", color: C.primary },
    { n: "02", title: "DENUNCIE", desc: "Preencha o formulario em 4 passos. Evidencias passam por moderacao antes de publicadas.", color: C.secondary },
    { n: "03", title: "VOTE", desc: "Confirme ou refute denuncias. Seu voto tem peso variavel conforme reputacao (Bronze a Diamante).", color: C.success },
    { n: "04", title: "COMPARTILHE", desc: "Gere cards prontos pra WhatsApp, Instagram e X. Alerte sua rede com um clique.", color: C.warning },
  ];

  steps.forEach((step, i) => {
    const y = 140 + i * 92;

    // Number circle
    doc.circle(75, y + 35, 30).fill(step.color);
    text(step.n, 45, y + 20, {
      font: "Helvetica-Bold", size: 20, color: C.white, w: 60, align: "center",
    });

    // Content box
    roundRect(125, y, 800, 72, 10, C.light, C.grayLight, 1);
    text(step.title, 145, y + 12, {
      font: "Helvetica-Bold", size: 13, color: step.color, w: 760, letterSpacing: 2,
    });
    text(step.desc, 145, y + 35, {
      font: "Helvetica", size: 11, color: C.grayDark, w: 760,
    });
  });

  pageNumber(4);
}

// =================== SLIDE 5 - DIFERENCIAIS ===================
{
  newSlide();
  accent();
  eyebrow("DIFERENCIAIS", 40, 40);
  title("Por que OPA e diferente dos concorrentes?", 40, 58, 26);

  const cols = [
    {
      title: "Outras plataformas",
      color: C.gray,
      bg: C.light,
      textColor: C.grayDark,
      items: [
        "Lista sem verificacao",
        "Qualquer um pode publicar qualquer coisa",
        "Nao diferencia denuncia real de fake",
        "Exposicao total de dados pessoais",
        "Sem direito de resposta",
        "Sem mecanismo anti-abuso",
      ],
      mark: "×",
    },
    {
      title: "OPA",
      color: C.primary,
      bg: C.primary,
      textColor: C.white,
      items: [
        "Validacao comunitaria com peso por reputacao",
        "Algoritmo Wilson score para credibilidade",
        "Selo Verificada pela comunidade",
        "Dados mascarados conforme LGPD",
        "Contestacao garantida (Art. 18 LGPD)",
        "Detecao de padroes anomalos + moderacao",
      ],
      mark: "✓",
    },
  ];

  cols.forEach((col, i) => {
    const x = 40 + i * 445;
    const y = 140;
    roundRect(x, y, 430, 370, 12, col.bg, col.color, 1);

    text(col.title, x + 20, y + 20, {
      font: "Helvetica-Bold", size: 22, color: col.textColor, w: 390,
    });

    col.items.forEach((item, j) => {
      const iy = y + 70 + j * 48;
      text(col.mark, x + 20, iy, {
        font: "Helvetica-Bold", size: 18, color: col.textColor, w: 20,
      });
      text(item, x + 50, iy + 2, {
        font: "Helvetica", size: 12, color: col.textColor, w: 360,
      });
    });
  });

  pageNumber(5);
}

// =================== SLIDE 6 - LGPD ===================
{
  newSlide();
  accent();
  eyebrow("CONFORMIDADE LGPD", 40, 40);
  title("Proteger sem expor", 40, 58, 28);
  text("Base legal: legitimo interesse (Art. 7, IX) para dados publicos + consentimento (Art. 7, I) para cadastro",
    40, 100, { font: "Helvetica-Oblique", size: 10, color: C.gray, w: 880 });

  const rows = [
    ["DADO", "TRATAMENTO NA OPA", "MOTIVO"],
    ["Telefone", "Exibicao mascarada: (11) 9****-3456", "Art. 5 LGPD - dado pessoal"],
    ["CNPJ", "Publicado com contestacao disponivel", "Dado publico (Receita Federal)"],
    ["CPF", "NUNCA armazenado", "Dado pessoal sensivel"],
    ["Nome pessoa fisica", "PROIBIDO em denuncias", "Protecao contra difamacao"],
    ["Screenshots", "Moderacao + anonimizacao orientada", "Conformidade LGPD"],
    ["Email denunciante", "Armazenado, nunca exibido", "Somente para autenticacao"],
  ];
  const colW = [180, 420, 280];
  const startX = 40;
  const startY = 135;
  const rowH = 36;

  rows.forEach((row, i) => {
    const isHeader = i === 0;
    let x = startX;
    row.forEach((cell, j) => {
      const bg = isHeader ? C.primary : (i % 2 === 0 ? C.light : C.white);
      doc.rect(x, startY + i * rowH, colW[j], rowH).fillAndStroke(bg, C.grayLight);
      text(cell, x + 12, startY + i * rowH + (isHeader ? 12 : 11), {
        font: isHeader ? "Helvetica-Bold" : "Helvetica",
        size: isHeader ? 10 : 11,
        color: isHeader ? C.white : C.grayDark,
        w: colW[j] - 24,
      });
      x += colW[j];
    });
  });

  // Highlight Art. 18
  const hy = startY + rows.length * rowH + 20;
  doc.save();
  doc.fillColor(C.secondary, 0.12).roundedRect(40, hy, 880, 70, 10).fill();
  doc.restore();
  doc.lineWidth(1).roundedRect(40, hy, 880, 70, 10).stroke(C.secondary);

  text("Direito de contestacao (Art. 18 LGPD)", 56, hy + 14, {
    font: "Helvetica-Bold", size: 13, color: C.secondary, w: 860,
  });
  text("Qualquer pessoa ou empresa citada pode contestar uma denuncia. Analise em ate 72h uteis.",
    56, hy + 38, { font: "Helvetica", size: 11, color: C.grayDark, w: 860 });

  pageNumber(6);
}

// =================== SLIDE 7 - CATEGORIAS ===================
{
  newSlide();
  accent();
  eyebrow("TAXONOMIA DE FRAUDES", 40, 40);
  title("9 categorias cobrindo os golpes mais comuns", 40, 58, 24);

  const categories = [
    { icon: "@", name: "Phishing", desc: "Emails e sites falsos" },
    { icon: "#", name: "SMS Fraudulento", desc: "Mensagens com links maliciosos" },
    { icon: "X", name: "Perfil Falso", desc: "Clonagem em redes sociais" },
    { icon: "$", name: "Marketplace", desc: "Lojas e anuncios fraudulentos" },
    { icon: "B", name: "Boleto Falso", desc: "Cobrancas adulteradas" },
    { icon: "P", name: "PIX", desc: "Transferencia instantanea golpe" },
    { icon: "W", name: "Site Clone", desc: "Replicas de bancos e empresas" },
    { icon: "T", name: "Ligacao", desc: "Falsa central de atendimento" },
    { icon: "A", name: "App Malicioso", desc: "Captura de dados bancarios" },
  ];

  categories.forEach((cat, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 40 + col * 298;
    const y = 140 + row * 115;

    roundRect(x, y, 283, 100, 10, C.white, C.grayLight, 1);

    // Icon box
    doc.save();
    doc.fillColor(C.primary, 0.12).roundedRect(x + 18, y + 20, 60, 60, 8).fill();
    doc.restore();
    text(cat.icon, x + 18, y + 30, {
      font: "Helvetica-Bold", size: 28, color: C.primary, w: 60, align: "center",
    });

    text(cat.name, x + 90, y + 22, {
      font: "Helvetica-Bold", size: 13, color: C.dark, w: 185,
    });
    text(cat.desc, x + 90, y + 48, {
      font: "Helvetica", size: 10, color: C.grayDark, w: 185,
    });
  });

  pageNumber(7);
}

// =================== SLIDE 8 - ARQUITETURA ===================
{
  newSlide();
  accent();
  eyebrow("ARQUITETURA TECNICA", 40, 40);
  title("Stack moderna, performance e escalabilidade", 40, 58, 24);

  const layers = [
    { name: "FRONTEND", color: C.primary, items: ["Next.js 15 App Router", "React 19 + TypeScript", "Tailwind CSS 3", "shadcn/ui + Lucide", "Dark mode"] },
    { name: "BACKEND", color: C.secondary, items: ["Next.js API Routes", "NextAuth.js v5 JWT", "Zod validacao", "bcryptjs hash senha", "Edge + Node runtimes"] },
    { name: "DADOS", color: C.success, items: ["PostgreSQL 16", "Prisma ORM 6", "12 models, 8 enums", "Wilson score algo", "Auditoria LGPD"] },
    { name: "INFRA", color: C.warning, items: ["Docker Compose", "Vercel deploy", "Cloudinary imagens", "Open Graph SEO", "Canvas API cards"] },
  ];

  layers.forEach((layer, i) => {
    const x = 40 + i * 228;
    const y = 140;

    roundRect(x, y, 218, 310, 10, C.light, C.grayLight, 1);

    // Header
    roundRect(x, y, 218, 45, 10, layer.color);
    doc.rect(x, y + 22, 218, 23).fill(layer.color);
    text(layer.name, x, y + 14, {
      font: "Helvetica-Bold", size: 13, color: C.white, w: 218, align: "center", letterSpacing: 2,
    });

    layer.items.forEach((item, j) => {
      const iy = y + 65 + j * 42;
      doc.circle(x + 18, iy + 6, 3).fill(layer.color);
      text(item, x + 32, iy, {
        font: "Helvetica", size: 10, color: C.grayDark, w: 180,
      });
    });
  });

  // Stats footer
  roundRect(40, 475, 880, 40, 8, C.dark);
  text("68 arquivos TypeScript  |  19 rotas (7 paginas + 8 APIs + middleware)  |  ~4500 linhas de codigo",
    40, 490, { font: "Helvetica", size: 11, color: C.white, w: 880, align: "center" });

  pageNumber(8);
}

// =================== SLIDE 9 - PAGINAS ===================
{
  newSlide();
  accent();
  eyebrow("PAGINAS DA PLATAFORMA", 40, 40);
  title("7 paginas implementadas e funcionais", 40, 58, 24);

  const pages = [
    { route: "/", name: "Landing Page", desc: "Hero com busca, como funciona, contadores animados, FAQ, pilares LGPD" },
    { route: "/feed", name: "Feed de denuncias", desc: "Cards com filtros, ordenacao, drawer mobile" },
    { route: "/buscar", name: "Busca", desc: "Risk gauge SVG, metricas, denuncias relacionadas" },
    { route: "/denunciar", name: "Nova denuncia", desc: "Stepper 4 passos, upload de evidencias, callouts LGPD" },
    { route: "/denuncia/[id]", name: "Detalhe", desc: "Votacao, comentarios, share card, CTA contestacao" },
    { route: "/perfil", name: "Perfil do usuario", desc: "Reputacao, estatisticas, historico de denuncias" },
    { route: "/contestar/[id]", name: "Contestacao", desc: "Formulario LGPD Art. 18, analise em 72h" },
  ];

  pages.forEach((page, i) => {
    const y = 135 + i * 52;

    // Route badge
    doc.save();
    doc.fillColor(C.primary, 0.1).roundedRect(40, y, 190, 40, 6).fill();
    doc.restore();
    text(page.route, 55, y + 13, {
      font: "Courier-Bold", size: 11, color: C.primary, w: 170,
    });

    text(page.name, 250, y + 8, {
      font: "Helvetica-Bold", size: 13, color: C.dark, w: 250,
    });
    text(page.desc, 250, y + 25, {
      font: "Helvetica", size: 10, color: C.grayDark, w: 670,
    });
  });

  pageNumber(9);
}

// =================== SLIDE 10 - APIs ===================
{
  newSlide();
  accent();
  eyebrow("APIs REST", 40, 40);
  title("8 endpoints com validacao Zod e JWT", 40, 58, 22);

  const apis = [
    { method: "POST", route: "/api/auth/register", desc: "Cadastro com bcrypt" },
    { method: "GET", route: "/api/auth/[...nextauth]", desc: "Login/logout/session" },
    { method: "GET", route: "/api/reports", desc: "Lista com filtros" },
    { method: "POST", route: "/api/reports", desc: "Cria denuncia" },
    { method: "GET", route: "/api/reports/[id]", desc: "Detalhe completo" },
    { method: "POST", route: "/api/reports/[id]/vote", desc: "Voto ponderado" },
    { method: "POST", route: "/api/reports/[id]/comments", desc: "Comentario" },
    { method: "GET", route: "/api/search", desc: "Busca agregada" },
    { method: "POST", route: "/api/contestations", desc: "Art. 18 LGPD" },
    { method: "PATCH", route: "/api/moderation/reports/[id]", desc: "Moderacao" },
  ];

  apis.forEach((api, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 40 + col * 445;
    const y = 125 + row * 72;

    roundRect(x, y, 430, 62, 8, C.white, C.grayLight, 1);

    const methodColor =
      api.method === "GET" ? C.success :
      api.method === "POST" ? C.primary :
      api.method === "PATCH" ? C.warning : C.gray;

    // Method badge
    roundRect(x + 12, y + 12, 55, 22, 5, methodColor);
    text(api.method, x + 12, y + 18, {
      font: "Helvetica-Bold", size: 10, color: C.white, w: 55, align: "center",
    });

    text(api.route, x + 77, y + 10, {
      font: "Courier-Bold", size: 10, color: C.dark, w: 345,
    });
    text(api.desc, x + 77, y + 32, {
      font: "Helvetica", size: 10, color: C.grayDark, w: 345,
    });
  });

  pageNumber(10);
}

// =================== SLIDE 11 - ALGORITMO ===================
{
  newSlide();
  accent();
  eyebrow("ALGORITMO", 40, 40);
  title("Credibilidade com rigor estatistico", 40, 58, 26);

  // Formula box
  roundRect(40, 130, 880, 110, 10, C.dark);
  text("Wilson Score Lower Bound (95% confidence)", 60, 148, {
    font: "Helvetica-Bold", size: 12, color: C.secondaryLight, w: 840,
  });
  text("score = (p + z²/2n − z · √(p(1−p)/n + z²/4n²)) / (1 + z²/n)", 60, 175, {
    font: "Courier", size: 16, color: C.white, w: 840,
  });
  text("Evita overconfidence com poucos votos. Nao converge prematuramente para 100%.", 60, 210, {
    font: "Helvetica-Oblique", size: 10, color: C.grayLight, w: 840,
  });

  // Pesos por reputacao
  title("Peso do voto por reputacao", 40, 260, 15);
  const tiers = [
    { name: "BRONZE", weight: "1,0×", color: "#B45309" },
    { name: "PRATA", weight: "1,25×", color: "#64748B" },
    { name: "OURO", weight: "2,0×", color: "#D97706" },
    { name: "DIAMANTE", weight: "3,0×", color: "#06B6D4" },
  ];
  tiers.forEach((tier, i) => {
    const x = 40 + i * 228;
    const y = 290;
    doc.save();
    doc.fillColor(tier.color, 0.15).roundedRect(x, y, 218, 85, 10).fill();
    doc.restore();
    doc.lineWidth(2).roundedRect(x, y, 218, 85, 10).stroke(tier.color);
    text(tier.name, x, y + 14, {
      font: "Helvetica-Bold", size: 11, color: tier.color, w: 218, align: "center", letterSpacing: 3,
    });
    text(tier.weight, x, y + 38, {
      font: "Helvetica-Bold", size: 28, color: tier.color, w: 218, align: "center",
    });
  });

  // Niveis de risco
  title("Niveis de risco", 40, 400, 15);
  const risks = [
    { name: "BAIXO", range: "0-29", color: C.riskLow },
    { name: "MEDIO", range: "30-54", color: C.riskMedium },
    { name: "ALTO", range: "55-74", color: C.riskHigh },
    { name: "CRITICO", range: "75-100", color: C.riskCritical },
  ];
  risks.forEach((r, i) => {
    const x = 40 + i * 228;
    const y = 430;
    roundRect(x, y, 218, 55, 8, r.color);
    text(`${r.name}  (${r.range})`, x, y + 19, {
      font: "Helvetica-Bold", size: 13, color: C.white, w: 218, align: "center", letterSpacing: 2,
    });
  });

  pageNumber(11);
}

// =================== SLIDE 12 - ROADMAP ===================
{
  newSlide();
  accent();
  eyebrow("ROADMAP", 40, 40);
  title("Entregue, em andamento e proximos passos", 40, 58, 24);

  const phases = [
    {
      status: "CONCLUIDO",
      title: "Fase 1 — MVP Backend + Frontend",
      items: ["7 paginas funcionais", "8 APIs REST", "Auth JWT", "PostgreSQL + seed", "Conformidade LGPD"],
      color: C.success,
    },
    {
      status: "EM CURSO",
      title: "Fase 2 — Producao",
      items: ["Deploy Vercel + Neon", "Upload Cloudinary", "Cards como imagem", "Email de notificacao", "Testes"],
      color: C.warning,
    },
    {
      status: "FUTURO",
      title: "Fase 3 — Escala",
      items: ["API publica com rate limit", "Integracao Procon/Reclame Aqui", "Extensao navegador", "Bot WhatsApp", "App mobile"],
      color: C.gray,
    },
  ];

  phases.forEach((phase, i) => {
    const y = 130 + i * 125;
    roundRect(40, y, 880, 110, 12, C.white, C.grayLight, 1);

    // Status badge
    roundRect(55, y + 18, 110, 30, 6, phase.color);
    text(phase.status, 55, y + 26, {
      font: "Helvetica-Bold", size: 10, color: C.white, w: 110, align: "center", letterSpacing: 2,
    });

    text(phase.title, 185, y + 22, {
      font: "Helvetica-Bold", size: 16, color: C.dark, w: 720,
    });

    // Items
    const itemsText = phase.items.map((it) => `• ${it}`).join("   ");
    text(itemsText, 55, y + 66, {
      font: "Helvetica", size: 11, color: C.grayDark, w: 850,
    });
  });

  pageNumber(12);
}

// =================== SLIDE 13 - ENCERRAMENTO ===================
{
  newSlide(C.dark);

  doc.save();
  doc.fillColor(C.secondary, 0.35).ellipse(830, 100, 280, 280).fill();
  doc.fillColor(C.primary, 0.45).ellipse(100, 440, 260, 260).fill();
  doc.restore();

  logo(60, 60, 40);

  text("Protegendo pessoas.", 60, 180, {
    font: "Helvetica-Bold", size: 54, color: C.white, w: 850,
  });
  text("Juntas.", 60, 240, {
    font: "Helvetica-BoldOblique", size: 54, color: C.secondaryLight, w: 850,
  });

  doc.rect(60, 320, 40, 3).fill(C.secondaryLight);

  text("Uma fraude denunciada e milhares de pessoas protegidas.", 60, 340, {
    font: "Helvetica-Oblique", size: 16, color: C.grayLight, w: 850,
  });

  text("Obrigado!", 60, 420, {
    font: "Helvetica-Bold", size: 24, color: C.white, w: 850,
  });
  text("Aula de extensao · 23 de abril de 2026", 60, 470, {
    font: "Helvetica", size: 11, color: C.gray, w: 850,
  });
}

// =================== FINALIZE ===================
doc.end();
console.log(`PDF gerado: ${out}`);
