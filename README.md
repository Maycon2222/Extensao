# OPA - Observatorio Popular Antifraude

Plataforma colaborativa brasileira contra golpes digitais.

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, NextAuth.js
- **Banco:** PostgreSQL 16 via Prisma 6
- **Deploy:** Vercel + Neon/Supabase

## Setup

### Requisitos
- Node.js 20+
- Docker Desktop (para PostgreSQL local) ou instancia PostgreSQL remota

### Passos

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variaveis de ambiente
cp .env.example .env
# Edite .env se necessario

# 3. Subir PostgreSQL via Docker
npm run db:up

# 4. Gerar Prisma Client
npm run db:generate

# 5. Aplicar schema ao banco
npm run db:push

# 6. Popular com dados de seed
npm run db:seed

# 7. Subir o dev server
npm run dev
```

Acesse `http://localhost:3000`.

### Usuarios de teste (apos seed)

| Email | Senha | Reputacao |
|-------|-------|-----------|
| admin@opa.app | senha123 | Admin |
| maria@example.com | senha123 | Ouro |
| rafael@example.com | senha123 | Diamante |
| pedro@example.com | senha123 | Prata |
| lucas@example.com | senha123 | Bronze |

## Scripts

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Dev server com hot reload |
| `npm run build` | Build de producao |
| `npm run start` | Roda build de producao |
| `npm run lint` | Lint do codigo |
| `npm run db:up` | Sobe Postgres via Docker |
| `npm run db:down` | Para Postgres |
| `npm run db:generate` | Gera Prisma Client |
| `npm run db:push` | Aplica schema (dev rapido, sem migration) |
| `npm run db:migrate` | Cria nova migration |
| `npm run db:seed` | Popula banco com dados de teste |
| `npm run db:reset` | Reseta banco e roda seed |
| `npm run db:studio` | Abre Prisma Studio (GUI do banco) |

## Estrutura

```
src/
  app/                    # App Router (Next.js)
    (platform)/           # Rotas autenticadas
      feed/
      buscar/
      denunciar/
      denuncia/[id]/
    api/                  # API Routes (backend)
    layout.tsx
    page.tsx              # Landing
  components/             # Componentes React
    ui/                   # Primitivos (Button, Card, etc)
  lib/                    # Utilitarios
    db.ts                 # Prisma Client singleton
    normalize.ts          # Normalizacao de identificadores
    scoring.ts            # Algoritmo de credibilidade
    utils.ts              # Helpers gerais
    categories.ts         # Taxonomia de fraudes
  generated/prisma/       # Prisma Client gerado
prisma/
  schema.prisma           # Schema do banco
  seed.ts                 # Script de seed
docker-compose.yml        # PostgreSQL local
```

## Compliance LGPD

Esta plataforma foi projetada em conformidade com a LGPD:

- **Telefones e CNPJs:** exibidos publicamente de forma mascarada
- **CPF:** NUNCA armazenado ou publicado
- **Nomes pessoais:** proibidos em denuncias
- **Screenshots:** passam por moderacao humana antes de publicacao
- **Direito de contestacao:** garantido pelo Art. 18 LGPD
- **Retencao:** denuncias sem interacao por 12 meses sao arquivadas; usuarios inativos por 24 meses sao anonimizados
- **Base legal:** legitimo interesse (dados publicos) + consentimento (cadastro)

## Licenca

Privado / Projeto academico.
