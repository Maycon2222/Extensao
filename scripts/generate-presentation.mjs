import pptxgen from "pptxgenjs";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches
pres.title = "OPA - Observatorio Popular Antifraude";
pres.company = "Projeto de Extensao";

// =================== Paleta ===================
const C = {
  primary: "0F4C81",     // Azul profundo
  primaryLight: "1E6BA8",
  secondary: "0D9488",   // Teal
  secondaryLight: "14B8A6",
  dark: "0A1F3D",
  light: "F8FAFC",
  white: "FFFFFF",
  gray: "64748B",
  grayLight: "CBD5E1",
  grayDark: "334155",
  success: "16A34A",
  warning: "EAB308",
  danger: "DC2626",
  riskLow: "16A34A",
  riskMedium: "EAB308",
  riskHigh: "F97316",
  riskCritical: "DC2626",
};

// =================== Fontes ===================
const FONT_DISPLAY = "Calibri";
const FONT_BODY = "Calibri";

// =================== Helpers ===================
function addBackground(slide, color = C.white) {
  slide.background = { color };
}

function addAccent(slide) {
  // Faixa vertical esquerda fininha
  slide.addShape("rect", {
    x: 0, y: 0, w: 0.15, h: 7.5,
    fill: { color: C.primary }, line: { color: C.primary },
  });
}

function addPageNumber(slide, n, total) {
  slide.addText(`${n} / ${total}`, {
    x: 12.5, y: 7.1, w: 0.8, h: 0.3,
    fontFace: FONT_BODY, fontSize: 9, color: C.gray,
    align: "right",
  });
}

function addLogo(slide, x, y, size = 0.5) {
  // Logo simplificado: escudo com olho (usando shapes)
  slide.addShape("roundRect", {
    x, y, w: size, h: size,
    fill: { color: C.primary }, line: { color: C.primary },
    rectRadius: size * 0.15,
  });
  slide.addShape("ellipse", {
    x: x + size * 0.22, y: y + size * 0.28, w: size * 0.56, h: size * 0.44,
    fill: { color: C.secondary }, line: { color: C.secondary },
  });
  slide.addShape("ellipse", {
    x: x + size * 0.38, y: y + size * 0.4, w: size * 0.24, h: size * 0.24,
    fill: { color: C.white }, line: { color: C.white },
  });
}

const TOTAL = 13;

// ============================================================================
// SLIDE 1 - CAPA
// ============================================================================
{
  const s = pres.addSlide();
  addBackground(s, C.dark);

  // Gradiente visual com shapes decorativas
  s.addShape("ellipse", {
    x: -3, y: -2, w: 7, h: 7,
    fill: { color: C.primary, transparency: 60 }, line: { color: C.primary, transparency: 100 },
  });
  s.addShape("ellipse", {
    x: 9, y: 3, w: 8, h: 8,
    fill: { color: C.secondary, transparency: 70 }, line: { color: C.secondary, transparency: 100 },
  });

  // Logo grande
  addLogo(s, 1, 1, 1.2);

  // Badge contexto
  s.addText("PROJETO DE EXTENSAO - 2026", {
    x: 1, y: 2.6, w: 4, h: 0.35,
    fontFace: FONT_BODY, fontSize: 11, color: C.secondaryLight,
    bold: true, charSpacing: 3,
  });

  // Titulo principal
  s.addText("OPA", {
    x: 1, y: 3.0, w: 11, h: 1.8,
    fontFace: FONT_DISPLAY, fontSize: 120, color: C.white,
    bold: true, align: "left",
  });

  s.addText("Observatorio Popular Antifraude", {
    x: 1, y: 4.6, w: 11, h: 0.6,
    fontFace: FONT_DISPLAY, fontSize: 28, color: C.white,
    bold: false, align: "left",
  });

  s.addShape("rect", {
    x: 1, y: 5.4, w: 0.6, h: 0.05,
    fill: { color: C.secondaryLight }, line: { color: C.secondaryLight },
  });

  s.addText("Plataforma colaborativa brasileira contra golpes digitais", {
    x: 1, y: 5.6, w: 11, h: 0.4,
    fontFace: FONT_BODY, fontSize: 16, color: C.grayLight,
    italic: true,
  });

  // Data
  s.addText("Aula de extensao | 23 de abril de 2026", {
    x: 1, y: 6.7, w: 11, h: 0.35,
    fontFace: FONT_BODY, fontSize: 12, color: C.gray,
  });
}

// ============================================================================
// SLIDE 2 - O PROBLEMA
// ============================================================================
{
  const s = pres.addSlide();
  addBackground(s);
  addAccent(s);

  s.addText("O PROBLEMA", {
    x: 0.6, y: 0.5, w: 8, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, color: C.secondary,
    bold: true, charSpacing: 4,
  });

  s.addText("Golpes digitais no Brasil crescem em ritmo acelerado", {
    x: 0.6, y: 0.95, w: 12, h: 0.8,
    fontFace: FONT_DISPLAY, fontSize: 36, color: C.dark, bold: true,
  });

  // Grid de stats impactantes
  const stats = [
    { num: "R$ 10 bi", lbl: "perdidos com golpes digitais em 2025", color: C.danger },
    { num: "+85%", lbl: "aumento em tentativas de phishing em 3 anos", color: C.riskHigh },
    { num: "1 em 4", lbl: "brasileiros sofreu tentativa de golpe em 2025", color: C.warning },
  ];

  stats.forEach((stat, i) => {
    const x = 0.6 + i * 4.2;
    s.addShape("roundRect", {
      x, y: 2.1, w: 3.9, h: 2.4,
      fill: { color: C.light }, line: { color: C.grayLight, width: 1 },
      rectRadius: 0.15,
    });
    s.addText(stat.num, {
      x: x + 0.2, y: 2.3, w: 3.5, h: 1.1,
      fontFace: FONT_DISPLAY, fontSize: 48, color: stat.color, bold: true,
    });
    s.addText(stat.lbl, {
      x: x + 0.2, y: 3.5, w: 3.5, h: 0.9,
      fontFace: FONT_BODY, fontSize: 13, color: C.grayDark,
    });
  });

  // Pontos de dor
  const pains = [
    "Vitimas isoladas sem canal unificado para alertar proximos",
    "Desinformacao sobre golpes se espalha mais rapido que a prevencao",
    "Cidadao descobre o risco quando ja e vitima",
    "Orgaos oficiais atuam reativamente, nao em prevencao coletiva",
  ];

  s.addText("Por que isso persiste?", {
    x: 0.6, y: 4.8, w: 12, h: 0.4,
    fontFace: FONT_DISPLAY, fontSize: 18, color: C.dark, bold: true,
  });

  pains.forEach((p, i) => {
    s.addShape("ellipse", {
      x: 0.7, y: 5.35 + i * 0.4, w: 0.15, h: 0.15,
      fill: { color: C.primary }, line: { color: C.primary },
    });
    s.addText(p, {
      x: 1.0, y: 5.25 + i * 0.4, w: 12, h: 0.38,
      fontFace: FONT_BODY, fontSize: 13, color: C.grayDark,
    });
  });

  addPageNumber(s, 2, TOTAL);
}

// ============================================================================
// SLIDE 3 - A SOLUCAO
// ============================================================================
{
  const s = pres.addSlide();
  addBackground(s);
  addAccent(s);

  s.addText("A SOLUCAO", {
    x: 0.6, y: 0.5, w: 8, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, color: C.secondary,
    bold: true, charSpacing: 4,
  });

  s.addText("Inteligencia coletiva validada pela comunidade", {
    x: 0.6, y: 0.95, w: 12, h: 0.8,
    fontFace: FONT_DISPLAY, fontSize: 32, color: C.dark, bold: true,
  });

  // Box com tagline
  s.addShape("roundRect", {
    x: 0.6, y: 2.0, w: 12.1, h: 1.2,
    fill: { color: C.primary }, line: { color: C.primary },
    rectRadius: 0.15,
  });
  s.addText("Antes de clicar, consulte. Antes de cair, alerte.", {
    x: 0.8, y: 2.15, w: 11.7, h: 0.6,
    fontFace: FONT_DISPLAY, fontSize: 24, color: C.white, bold: true,
    italic: true,
  });
  s.addText("Uma rede onde brasileiros protegem brasileiros.", {
    x: 0.8, y: 2.75, w: 11.7, h: 0.4,
    fontFace: FONT_BODY, fontSize: 14, color: C.grayLight,
  });

  // 4 pilares da solucao
  const pillars = [
    {
      icon: "search",
      title: "Consulta em tempo real",
      desc: "Pesquise telefone, link ou CNPJ antes de transacoes",
    },
    {
      icon: "check",
      title: "Validacao comunitaria",
      desc: "Votos ponderados por reputacao evitam desinformacao",
    },
    {
      icon: "shield",
      title: "Score de credibilidade",
      desc: "Algoritmo Wilson score garante confianca estatistica",
    },
    {
      icon: "share",
      title: "Alerta viral",
      desc: "Cards prontos pra WhatsApp, Instagram e X",
    },
  ];

  pillars.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 6.15;
    const y = 3.55 + row * 1.75;

    s.addShape("roundRect", {
      x, y, w: 5.95, h: 1.55,
      fill: { color: C.white }, line: { color: C.grayLight, width: 1 },
      rectRadius: 0.12,
    });

    // Icon circle
    s.addShape("ellipse", {
      x: x + 0.25, y: y + 0.25, w: 1.05, h: 1.05,
      fill: { color: C.primary, transparency: 85 }, line: { color: C.primary, transparency: 100 },
    });
    s.addText((i + 1).toString(), {
      x: x + 0.25, y: y + 0.3, w: 1.05, h: 0.95,
      fontFace: FONT_DISPLAY, fontSize: 28, color: C.primary,
      bold: true, align: "center", valign: "middle",
    });

    s.addText(p.title, {
      x: x + 1.5, y: y + 0.3, w: 4.3, h: 0.45,
      fontFace: FONT_DISPLAY, fontSize: 16, color: C.dark, bold: true,
    });
    s.addText(p.desc, {
      x: x + 1.5, y: y + 0.8, w: 4.3, h: 0.75,
      fontFace: FONT_BODY, fontSize: 12, color: C.grayDark,
    });
  });

  addPageNumber(s, 3, TOTAL);
}

// ============================================================================
// SLIDE 4 - COMO FUNCIONA
// ============================================================================
{
  const s = pres.addSlide();
  addBackground(s);
  addAccent(s);

  s.addText("COMO FUNCIONA", {
    x: 0.6, y: 0.5, w: 8, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, color: C.secondary,
    bold: true, charSpacing: 4,
  });

  s.addText("Quatro passos para uma internet mais segura", {
    x: 0.6, y: 0.95, w: 12, h: 0.6,
    fontFace: FONT_DISPLAY, fontSize: 28, color: C.dark, bold: true,
  });

  const steps = [
    { n: "01", title: "PESQUISE", desc: "Cole um link, telefone ou CNPJ no campo de busca. O sistema normaliza o input e consulta o banco de denuncias similares.", color: C.primary },
    { n: "02", title: "DENUNCIE", desc: "Preencha o formulario em 4 passos. Evidencias passam por moderacao antes de serem publicadas.", color: C.secondary },
    { n: "03", title: "VOTE", desc: "Confirme ou refute denuncias. Seu voto tem peso variavel conforme sua reputacao (Bronze a Diamante).", color: C.success },
    { n: "04", title: "COMPARTILHE", desc: "Gere cards prontos pra WhatsApp, Instagram e X. Alerte sua rede com um clique.", color: C.warning },
  ];

  steps.forEach((step, i) => {
    const y = 2.0 + i * 1.15;

    // Number circle
    s.addShape("ellipse", {
      x: 0.6, y, w: 1.0, h: 1.0,
      fill: { color: step.color }, line: { color: step.color },
    });
    s.addText(step.n, {
      x: 0.6, y, w: 1.0, h: 1.0,
      fontFace: FONT_DISPLAY, fontSize: 24, color: C.white,
      bold: true, align: "center", valign: "middle",
    });

    // Connecting line (exceto ultimo)
    if (i < steps.length - 1) {
      s.addShape("line", {
        x: 1.1, y: y + 1.0, w: 0, h: 0.15,
        line: { color: C.grayLight, width: 2, dashType: "dash" },
      });
    }

    // Content
    s.addShape("roundRect", {
      x: 1.9, y, w: 10.8, h: 1.0,
      fill: { color: C.light }, line: { color: C.grayLight, width: 1 },
      rectRadius: 0.1,
    });
    s.addText(step.title, {
      x: 2.1, y: y + 0.1, w: 10.5, h: 0.35,
      fontFace: FONT_DISPLAY, fontSize: 14, color: step.color, bold: true,
      charSpacing: 2,
    });
    s.addText(step.desc, {
      x: 2.1, y: y + 0.45, w: 10.5, h: 0.55,
      fontFace: FONT_BODY, fontSize: 12, color: C.grayDark,
    });
  });

  addPageNumber(s, 4, TOTAL);
}

// ============================================================================
// SLIDE 5 - DIFERENCIAIS
// ============================================================================
{
  const s = pres.addSlide();
  addBackground(s);
  addAccent(s);

  s.addText("DIFERENCIAIS", {
    x: 0.6, y: 0.5, w: 8, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, color: C.secondary,
    bold: true, charSpacing: 4,
  });

  s.addText("Por que OPA e diferente dos concorrentes?", {
    x: 0.6, y: 0.95, w: 12, h: 0.6,
    fontFace: FONT_DISPLAY, fontSize: 28, color: C.dark, bold: true,
  });

  // Comparativo lado a lado
  const cols = [
    {
      title: "Outras plataformas",
      color: C.gray,
      items: [
        "Lista sem verificacao",
        "Qualquer um pode publicar qualquer coisa",
        "Nao diferencia denuncia real de fake",
        "Exposicao total de dados pessoais",
        "Sem direito de resposta",
        "Sem mecanismo anti-abuso",
      ],
      positive: false,
    },
    {
      title: "OPA",
      color: C.primary,
      items: [
        "Validacao comunitaria com peso por reputacao",
        "Algoritmo Wilson score para credibilidade",
        "Selo Verificada pela comunidade",
        "Dados mascarados conforme LGPD",
        "Contestacao garantida (Art. 18 LGPD)",
        "Detecao de padroes anomalos + moderacao",
      ],
      positive: true,
    },
  ];

  cols.forEach((col, i) => {
    const x = 0.6 + i * 6.15;
    const y = 1.9;

    s.addShape("roundRect", {
      x, y, w: 5.95, h: 5.2,
      fill: { color: col.positive ? C.primary : C.light },
      line: { color: col.positive ? C.primary : C.grayLight, width: 1 },
      rectRadius: 0.15,
    });

    s.addText(col.title, {
      x: x + 0.3, y: y + 0.3, w: 5.4, h: 0.6,
      fontFace: FONT_DISPLAY, fontSize: 22, color: col.positive ? C.white : C.gray,
      bold: true,
    });

    col.items.forEach((item, j) => {
      const itemY = y + 1.1 + j * 0.62;
      const checkColor = col.positive ? C.white : C.gray;
      s.addText(col.positive ? "+" : "-", {
        x: x + 0.3, y: itemY, w: 0.35, h: 0.35,
        fontFace: FONT_DISPLAY, fontSize: 20, color: checkColor, bold: true,
      });
      s.addText(item, {
        x: x + 0.7, y: itemY, w: 5.1, h: 0.55,
        fontFace: FONT_BODY, fontSize: 12.5,
        color: col.positive ? C.white : C.grayDark,
      });
    });
  });

  addPageNumber(s, 5, TOTAL);
}

// ============================================================================
// SLIDE 6 - CONFORMIDADE LGPD
// ============================================================================
{
  const s = pres.addSlide();
  addBackground(s);
  addAccent(s);

  s.addText("CONFORMIDADE LGPD", {
    x: 0.6, y: 0.5, w: 8, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, color: C.secondary,
    bold: true, charSpacing: 4,
  });

  s.addText("Proteger sem expor", {
    x: 0.6, y: 0.95, w: 12, h: 0.6,
    fontFace: FONT_DISPLAY, fontSize: 30, color: C.dark, bold: true,
  });

  s.addText("Base legal: legitimo interesse (Art. 7, IX) para dados publicos + consentimento (Art. 7, I) para cadastro", {
    x: 0.6, y: 1.65, w: 12.1, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, color: C.gray, italic: true,
  });

  // Tabela visual de dados
  const rows = [
    ["DADO", "TRATAMENTO NA OPA", "MOTIVO"],
    ["Telefone", "Exibicao mascarada: (11) 9****-3456", "Art. 5 LGPD - dado pessoal"],
    ["CNPJ", "Publicado com contestacao disponivel", "Dado publico (Receita Federal)"],
    ["CPF", "NUNCA armazenado", "Dado pessoal sensivel"],
    ["Nome pessoa fisica", "PROIBIDO em denuncias", "Protecao contra difamacao"],
    ["Screenshots", "Moderacao + orientacao de anonimizacao", "Conformidade LGPD"],
    ["Email do denunciante", "Armazenado, nunca exibido", "Somente para autenticacao"],
  ];

  const colW = [2.4, 5.8, 3.9];
  const startX = 0.6;
  const startY = 2.25;
  const rowH = 0.5;

  rows.forEach((row, i) => {
    const isHeader = i === 0;
    let x = startX;
    row.forEach((cell, j) => {
      s.addShape("rect", {
        x, y: startY + i * rowH, w: colW[j], h: rowH,
        fill: { color: isHeader ? C.primary : (i % 2 === 0 ? C.light : C.white) },
        line: { color: C.grayLight, width: 0.5 },
      });
      s.addText(cell, {
        x: x + 0.15, y: startY + i * rowH, w: colW[j] - 0.3, h: rowH,
        fontFace: FONT_BODY, fontSize: isHeader ? 11 : 12,
        color: isHeader ? C.white : C.grayDark,
        bold: isHeader, valign: "middle",
      });
      x += colW[j];
    });
  });

  // Direito de contestacao (destaque)
  s.addShape("roundRect", {
    x: 0.6, y: startY + rows.length * rowH + 0.3, w: 12.1, h: 0.95,
    fill: { color: C.secondary, transparency: 85 },
    line: { color: C.secondary, width: 1 },
    rectRadius: 0.1,
  });
  s.addText("Direito de contestacao (Art. 18 LGPD)", {
    x: 0.8, y: startY + rows.length * rowH + 0.4, w: 11.7, h: 0.3,
    fontFace: FONT_DISPLAY, fontSize: 13, color: C.secondary, bold: true,
  });
  s.addText("Qualquer pessoa ou empresa citada pode contestar uma denuncia. Analise em ate 72h uteis.", {
    x: 0.8, y: startY + rows.length * rowH + 0.7, w: 11.7, h: 0.3,
    fontFace: FONT_BODY, fontSize: 12, color: C.grayDark,
  });

  addPageNumber(s, 6, TOTAL);
}

// ============================================================================
// SLIDE 7 - CATEGORIAS DE FRAUDE
// ============================================================================
{
  const s = pres.addSlide();
  addBackground(s);
  addAccent(s);

  s.addText("TAXONOMIA DE FRAUDES", {
    x: 0.6, y: 0.5, w: 8, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, color: C.secondary,
    bold: true, charSpacing: 4,
  });

  s.addText("9 categorias cobrindo os golpes mais comuns no Brasil", {
    x: 0.6, y: 0.95, w: 12, h: 0.6,
    fontFace: FONT_DISPLAY, fontSize: 26, color: C.dark, bold: true,
  });

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
    const x = 0.6 + col * 4.2;
    const y = 1.9 + row * 1.6;

    s.addShape("roundRect", {
      x, y, w: 3.95, h: 1.4,
      fill: { color: C.white }, line: { color: C.grayLight, width: 1 },
      rectRadius: 0.12,
    });

    s.addShape("roundRect", {
      x: x + 0.25, y: y + 0.25, w: 0.9, h: 0.9,
      fill: { color: C.primary, transparency: 85 }, line: { color: C.primary, transparency: 100 },
      rectRadius: 0.1,
    });
    s.addText(cat.icon, {
      x: x + 0.25, y: y + 0.25, w: 0.9, h: 0.9,
      fontFace: FONT_DISPLAY, fontSize: 24, color: C.primary,
      bold: true, align: "center", valign: "middle",
    });

    s.addText(cat.name, {
      x: x + 1.3, y: y + 0.3, w: 2.55, h: 0.4,
      fontFace: FONT_DISPLAY, fontSize: 14, color: C.dark, bold: true,
    });
    s.addText(cat.desc, {
      x: x + 1.3, y: y + 0.7, w: 2.55, h: 0.5,
      fontFace: FONT_BODY, fontSize: 11, color: C.grayDark,
    });
  });

  addPageNumber(s, 7, TOTAL);
}

// ============================================================================
// SLIDE 8 - ARQUITETURA TECNICA
// ============================================================================
{
  const s = pres.addSlide();
  addBackground(s);
  addAccent(s);

  s.addText("ARQUITETURA TECNICA", {
    x: 0.6, y: 0.5, w: 8, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, color: C.secondary,
    bold: true, charSpacing: 4,
  });

  s.addText("Stack moderna, performance e escalabilidade", {
    x: 0.6, y: 0.95, w: 12, h: 0.6,
    fontFace: FONT_DISPLAY, fontSize: 26, color: C.dark, bold: true,
  });

  const layers = [
    {
      name: "FRONTEND",
      color: C.primary,
      items: ["Next.js 15 (App Router)", "React 19 + TypeScript", "Tailwind CSS 3", "shadcn/ui + Lucide icons", "next-themes (dark mode)"],
    },
    {
      name: "BACKEND",
      color: C.secondary,
      items: ["Next.js API Routes", "NextAuth.js v5 (JWT)", "Zod (validacao)", "bcryptjs (hash senha)", "Edge + Node runtimes"],
    },
    {
      name: "DADOS",
      color: C.success,
      items: ["PostgreSQL 16", "Prisma ORM 6", "12 models + 8 enums", "Wilson score algorithm", "Auditoria LGPD"],
    },
    {
      name: "INFRA",
      color: C.warning,
      items: ["Docker Compose", "Vercel (deploy)", "Cloudinary (imagens)", "Open Graph (SEO)", "Canvas API (cards)"],
    },
  ];

  layers.forEach((layer, i) => {
    const x = 0.6 + i * 3.15;
    const y = 2.0;

    s.addShape("roundRect", {
      x, y, w: 2.95, h: 4.3,
      fill: { color: C.light }, line: { color: C.grayLight, width: 1 },
      rectRadius: 0.12,
    });

    // Header colorido
    s.addShape("roundRect", {
      x, y, w: 2.95, h: 0.7,
      fill: { color: layer.color }, line: { color: layer.color },
      rectRadius: 0.12,
    });
    s.addShape("rect", {
      x, y: y + 0.35, w: 2.95, h: 0.35,
      fill: { color: layer.color }, line: { color: layer.color, width: 0 },
    });
    s.addText(layer.name, {
      x, y, w: 2.95, h: 0.7,
      fontFace: FONT_DISPLAY, fontSize: 14, color: C.white,
      bold: true, align: "center", valign: "middle", charSpacing: 3,
    });

    layer.items.forEach((item, j) => {
      s.addShape("ellipse", {
        x: x + 0.2, y: y + 1.05 + j * 0.65, w: 0.1, h: 0.1,
        fill: { color: layer.color }, line: { color: layer.color },
      });
      s.addText(item, {
        x: x + 0.4, y: y + 0.92 + j * 0.65, w: 2.5, h: 0.4,
        fontFace: FONT_BODY, fontSize: 11.5, color: C.grayDark,
      });
    });
  });

  // Footer: stats do projeto
  s.addShape("roundRect", {
    x: 0.6, y: 6.55, w: 12.1, h: 0.6,
    fill: { color: C.dark }, line: { color: C.dark },
    rectRadius: 0.1,
  });
  s.addText("68 arquivos TypeScript   |   19 rotas (7 paginas + 8 APIs + middleware)   |   ~4500 linhas de codigo", {
    x: 0.8, y: 6.55, w: 11.7, h: 0.6,
    fontFace: FONT_BODY, fontSize: 12, color: C.white,
    align: "center", valign: "middle",
  });

  addPageNumber(s, 8, TOTAL);
}

// ============================================================================
// SLIDE 9 - PAGINAS DA PLATAFORMA
// ============================================================================
{
  const s = pres.addSlide();
  addBackground(s);
  addAccent(s);

  s.addText("PAGINAS DA PLATAFORMA", {
    x: 0.6, y: 0.5, w: 8, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, color: C.secondary,
    bold: true, charSpacing: 4,
  });

  s.addText("7 paginas implementadas e funcionais", {
    x: 0.6, y: 0.95, w: 12, h: 0.6,
    fontFace: FONT_DISPLAY, fontSize: 26, color: C.dark, bold: true,
  });

  const pages = [
    { route: "/", name: "Landing Page", desc: "Hero com busca, como funciona, contadores animados, FAQ, pilares LGPD" },
    { route: "/feed", name: "Feed de denuncias", desc: "Cards com filtros (categoria, risco, periodo), ordenacao, drawer mobile" },
    { route: "/buscar", name: "Busca", desc: "Risk gauge SVG, metricas agregadas, denuncias relacionadas" },
    { route: "/denunciar", name: "Nova denuncia", desc: "Stepper 4 passos, upload de evidencias, callouts LGPD" },
    { route: "/denuncia/[id]", name: "Detalhe", desc: "Votacao, comentarios, share card, CTA contestacao" },
    { route: "/perfil", name: "Perfil", desc: "Reputacao, estatisticas, historico de denuncias" },
    { route: "/contestar/[id]", name: "Contestacao", desc: "Formulario LGPD Art. 18, analise em 72h" },
  ];

  pages.forEach((page, i) => {
    const y = 1.9 + i * 0.68;

    // Route tag
    s.addShape("roundRect", {
      x: 0.6, y, w: 2.7, h: 0.55,
      fill: { color: C.primary, transparency: 85 }, line: { color: C.primary, transparency: 100 },
      rectRadius: 0.08,
    });
    s.addText(page.route, {
      x: 0.7, y, w: 2.55, h: 0.55,
      fontFace: "Consolas", fontSize: 12, color: C.primary, bold: true,
      valign: "middle",
    });

    // Name
    s.addText(page.name, {
      x: 3.5, y, w: 3.5, h: 0.55,
      fontFace: FONT_DISPLAY, fontSize: 14, color: C.dark, bold: true,
      valign: "middle",
    });

    // Desc
    s.addText(page.desc, {
      x: 7.1, y, w: 5.6, h: 0.55,
      fontFace: FONT_BODY, fontSize: 12, color: C.grayDark,
      valign: "middle",
    });
  });

  addPageNumber(s, 9, TOTAL);
}

// ============================================================================
// SLIDE 10 - APIs REST
// ============================================================================
{
  const s = pres.addSlide();
  addBackground(s);
  addAccent(s);

  s.addText("APIs REST", {
    x: 0.6, y: 0.5, w: 8, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, color: C.secondary,
    bold: true, charSpacing: 4,
  });

  s.addText("8 endpoints com validacao Zod e autenticacao JWT", {
    x: 0.6, y: 0.95, w: 12, h: 0.6,
    fontFace: FONT_DISPLAY, fontSize: 24, color: C.dark, bold: true,
  });

  const apis = [
    { method: "POST", route: "/api/auth/register", desc: "Cadastro com hash bcrypt" },
    { method: "GET", route: "/api/auth/[...nextauth]", desc: "Handlers de login/logout/session" },
    { method: "GET", route: "/api/reports", desc: "Lista com filtros e paginacao" },
    { method: "POST", route: "/api/reports", desc: "Cria denuncia com normalizacao" },
    { method: "GET", route: "/api/reports/[id]", desc: "Detalhe completo" },
    { method: "POST", route: "/api/reports/[id]/vote", desc: "Voto ponderado por reputacao" },
    { method: "POST", route: "/api/reports/[id]/comments", desc: "Adiciona comentario" },
    { method: "GET", route: "/api/search", desc: "Busca com agregacao de risco" },
    { method: "POST", route: "/api/contestations", desc: "Contestacao LGPD Art. 18" },
    { method: "PATCH", route: "/api/moderation/reports/[id]", desc: "Moderacao (hide/remove/archive)" },
  ];

  apis.forEach((api, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 6.15;
    const y = 1.9 + row * 0.9;

    s.addShape("roundRect", {
      x, y, w: 5.95, h: 0.8,
      fill: { color: C.white }, line: { color: C.grayLight, width: 1 },
      rectRadius: 0.08,
    });

    const methodColor =
      api.method === "GET" ? C.success :
      api.method === "POST" ? C.primary :
      api.method === "PATCH" ? C.warning : C.gray;

    s.addShape("roundRect", {
      x: x + 0.15, y: y + 0.2, w: 0.8, h: 0.4,
      fill: { color: methodColor }, line: { color: methodColor },
      rectRadius: 0.06,
    });
    s.addText(api.method, {
      x: x + 0.15, y: y + 0.2, w: 0.8, h: 0.4,
      fontFace: FONT_BODY, fontSize: 10, color: C.white,
      bold: true, align: "center", valign: "middle",
    });

    s.addText(api.route, {
      x: x + 1.05, y: y + 0.05, w: 4.8, h: 0.4,
      fontFace: "Consolas", fontSize: 11, color: C.dark, bold: true, valign: "middle",
    });
    s.addText(api.desc, {
      x: x + 1.05, y: y + 0.4, w: 4.8, h: 0.35,
      fontFace: FONT_BODY, fontSize: 10, color: C.grayDark, valign: "middle",
    });
  });

  addPageNumber(s, 10, TOTAL);
}

// ============================================================================
// SLIDE 11 - ALGORITMO DE CREDIBILIDADE
// ============================================================================
{
  const s = pres.addSlide();
  addBackground(s);
  addAccent(s);

  s.addText("ALGORITMO", {
    x: 0.6, y: 0.5, w: 8, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, color: C.secondary,
    bold: true, charSpacing: 4,
  });

  s.addText("Credibilidade com rigor estatistico", {
    x: 0.6, y: 0.95, w: 12, h: 0.6,
    fontFace: FONT_DISPLAY, fontSize: 28, color: C.dark, bold: true,
  });

  // Formula Wilson score
  s.addShape("roundRect", {
    x: 0.6, y: 1.9, w: 12.1, h: 1.5,
    fill: { color: C.dark }, line: { color: C.dark },
    rectRadius: 0.1,
  });
  s.addText("Wilson Score Lower Bound (95% confidence)", {
    x: 0.8, y: 2.05, w: 11.7, h: 0.35,
    fontFace: FONT_DISPLAY, fontSize: 13, color: C.secondaryLight, bold: true,
  });
  s.addText("score = (p + z2/2n - z * sqrt(p(1-p)/n + z2/4n2)) / (1 + z2/n)", {
    x: 0.8, y: 2.45, w: 11.7, h: 0.5,
    fontFace: "Consolas", fontSize: 15, color: C.white,
  });
  s.addText("Evita overconfidence com poucos votos (nao converge prematuramente para 100%)", {
    x: 0.8, y: 2.95, w: 11.7, h: 0.35,
    fontFace: FONT_BODY, fontSize: 11, color: C.grayLight, italic: true,
  });

  // Peso do voto por reputacao
  s.addText("Peso do voto por reputacao", {
    x: 0.6, y: 3.65, w: 12, h: 0.4,
    fontFace: FONT_DISPLAY, fontSize: 16, color: C.dark, bold: true,
  });

  const tiers = [
    { name: "BRONZE", weight: "1.0x", color: "B45309" },
    { name: "PRATA", weight: "1.25x", color: "94A3B8" },
    { name: "OURO", weight: "2.0x", color: "EAB308" },
    { name: "DIAMANTE", weight: "3.0x", color: "06B6D4" },
  ];

  tiers.forEach((tier, i) => {
    const x = 0.6 + i * 3.15;
    const y = 4.2;

    s.addShape("roundRect", {
      x, y, w: 2.95, h: 1.2,
      fill: { color: tier.color, transparency: 85 },
      line: { color: tier.color, width: 2 },
      rectRadius: 0.1,
    });
    s.addText(tier.name, {
      x, y: y + 0.15, w: 2.95, h: 0.4,
      fontFace: FONT_DISPLAY, fontSize: 14, color: tier.color,
      bold: true, align: "center", charSpacing: 3,
    });
    s.addText(tier.weight, {
      x, y: y + 0.55, w: 2.95, h: 0.55,
      fontFace: FONT_DISPLAY, fontSize: 28, color: tier.color,
      bold: true, align: "center",
    });
  });

  // Niveis de risco
  s.addText("Niveis de risco calculados", {
    x: 0.6, y: 5.65, w: 12, h: 0.4,
    fontFace: FONT_DISPLAY, fontSize: 16, color: C.dark, bold: true,
  });

  const risks = [
    { name: "BAIXO", range: "0-29", color: C.riskLow },
    { name: "MEDIO", range: "30-54", color: C.riskMedium },
    { name: "ALTO", range: "55-74", color: C.riskHigh },
    { name: "CRITICO", range: "75-100", color: C.riskCritical },
  ];

  risks.forEach((r, i) => {
    const x = 0.6 + i * 3.15;
    const y = 6.2;

    s.addShape("roundRect", {
      x, y, w: 2.95, h: 0.75,
      fill: { color: r.color }, line: { color: r.color },
      rectRadius: 0.08,
    });
    s.addText(`${r.name}  (${r.range})`, {
      x, y, w: 2.95, h: 0.75,
      fontFace: FONT_DISPLAY, fontSize: 14, color: C.white,
      bold: true, align: "center", valign: "middle", charSpacing: 2,
    });
  });

  addPageNumber(s, 11, TOTAL);
}

// ============================================================================
// SLIDE 12 - ROADMAP
// ============================================================================
{
  const s = pres.addSlide();
  addBackground(s);
  addAccent(s);

  s.addText("ROADMAP", {
    x: 0.6, y: 0.5, w: 8, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, color: C.secondary,
    bold: true, charSpacing: 4,
  });

  s.addText("Entregue, em andamento e proximos passos", {
    x: 0.6, y: 0.95, w: 12, h: 0.6,
    fontFace: FONT_DISPLAY, fontSize: 26, color: C.dark, bold: true,
  });

  const phases = [
    {
      status: "DONE",
      title: "Fase 1 - MVP Backend + Frontend",
      items: ["7 paginas funcionais", "8 APIs REST", "Autenticacao JWT", "Banco PostgreSQL + seed", "Conformidade LGPD"],
      color: C.success,
    },
    {
      status: "DOING",
      title: "Fase 2 - Producao",
      items: ["Deploy Vercel + Neon", "Upload real de evidencias (Cloudinary)", "Geracao de cards como imagem (Canvas/Satori)", "Email de notificacao", "Testes automatizados"],
      color: C.warning,
    },
    {
      status: "NEXT",
      title: "Fase 3 - Escala",
      items: ["API publica com rate limit", "Integracao Procon / Reclame Aqui", "Extensao de navegador", "Bot WhatsApp / Telegram", "App mobile (React Native)"],
      color: C.gray,
    },
  ];

  phases.forEach((phase, i) => {
    const y = 2.0 + i * 1.7;

    s.addShape("roundRect", {
      x: 0.6, y, w: 12.1, h: 1.55,
      fill: { color: C.white }, line: { color: C.grayLight, width: 1 },
      rectRadius: 0.12,
    });

    // Status badge
    s.addShape("roundRect", {
      x: 0.85, y: y + 0.25, w: 1.3, h: 0.45,
      fill: { color: phase.color }, line: { color: phase.color },
      rectRadius: 0.06,
    });
    s.addText(phase.status, {
      x: 0.85, y: y + 0.25, w: 1.3, h: 0.45,
      fontFace: FONT_DISPLAY, fontSize: 11, color: C.white,
      bold: true, align: "center", valign: "middle", charSpacing: 3,
    });

    // Title
    s.addText(phase.title, {
      x: 2.3, y: y + 0.2, w: 10.3, h: 0.45,
      fontFace: FONT_DISPLAY, fontSize: 17, color: C.dark, bold: true,
      valign: "middle",
    });

    // Items horizontais
    const itemsText = phase.items.map((it) => `- ${it}`).join("    ");
    s.addText(itemsText, {
      x: 0.85, y: y + 0.78, w: 11.7, h: 0.65,
      fontFace: FONT_BODY, fontSize: 11.5, color: C.grayDark,
      valign: "middle",
    });
  });

  addPageNumber(s, 12, TOTAL);
}

// ============================================================================
// SLIDE 13 - ENCERRAMENTO
// ============================================================================
{
  const s = pres.addSlide();
  addBackground(s, C.dark);

  // Decoracoes
  s.addShape("ellipse", {
    x: 9, y: -2, w: 8, h: 8,
    fill: { color: C.secondary, transparency: 70 }, line: { color: C.secondary, transparency: 100 },
  });
  s.addShape("ellipse", {
    x: -3, y: 4, w: 7, h: 7,
    fill: { color: C.primary, transparency: 60 }, line: { color: C.primary, transparency: 100 },
  });

  // Logo
  addLogo(s, 1, 1, 1);

  // Tagline big
  s.addText("Protegendo pessoas.", {
    x: 1, y: 2.8, w: 12, h: 1.0,
    fontFace: FONT_DISPLAY, fontSize: 60, color: C.white, bold: true,
  });
  s.addText("Juntas.", {
    x: 1, y: 3.8, w: 12, h: 1.0,
    fontFace: FONT_DISPLAY, fontSize: 60, color: C.secondaryLight, bold: true, italic: true,
  });

  // Subtitle
  s.addShape("rect", {
    x: 1, y: 5.0, w: 0.6, h: 0.05,
    fill: { color: C.secondaryLight }, line: { color: C.secondaryLight },
  });
  s.addText("Uma fraude denunciada e milhares de pessoas protegidas.", {
    x: 1, y: 5.2, w: 12, h: 0.5,
    fontFace: FONT_BODY, fontSize: 18, color: C.grayLight, italic: true,
  });

  // CTA
  s.addText("Obrigado!", {
    x: 1, y: 6.3, w: 12, h: 0.5,
    fontFace: FONT_DISPLAY, fontSize: 24, color: C.white, bold: true,
  });
  s.addText("github.com/opa  |  contato@opa.app  |  Aula de extensao - 2026", {
    x: 1, y: 6.8, w: 12, h: 0.3,
    fontFace: FONT_BODY, fontSize: 11, color: C.gray,
  });
}

// ============================================================================
// SAVE
// ============================================================================
const outPath = "C:/Users/User/Documents/Opa/OPA_Apresentacao.pptx";
await pres.writeFile({ fileName: outPath });
console.log(`Apresentacao gerada: ${outPath}`);
