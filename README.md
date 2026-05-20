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

### Rodar rapido em modo demo

Use este modo quando quiser testar a interface sem subir PostgreSQL. Ele usa dados em memoria e habilita login mock.

Crie ou edite o arquivo `.env`:

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-change-me"
DATABASE_URL="postgresql://opa:opa@localhost:5432/opa?schema=public"
OPA_FORCE_MOCK="true"
OPA_MOCK_EMAIL="defina-um-email-local"
OPA_MOCK_PASSWORD="defina-uma-senha-local"
```

Depois rode:

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

No modo demo, defina as credenciais localmente via `OPA_MOCK_EMAIL` e
`OPA_MOCK_PASSWORD`. Nao publique credenciais reais ou de teste no repositorio.
Denuncias, votos e comentarios criados ficam em memoria enquanto o servidor
local estiver rodando.

### Rodar com PostgreSQL

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

### Seed de desenvolvimento

O seed cria dados de exemplo e pode criar um usuario administrador quando as
variaveis `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` estiverem definidas no
ambiente. Nao use credenciais previsiveis em banco de producao.

## Funcionalidades recentes

- Login mock para testar localmente sem banco.
- Feed com filtro por estado e cidades separadas no formulario de denuncia.
- Formulario de denuncia com rascunho salvo no navegador.
- Upload de evidencias com previews dentro da area de selecao.
- Pagina "Minhas denuncias".
- Paginas de Termos de Uso e Politica de Moderacao.
- Votos e comentarios funcionam no modo demo.
- Admin/moderador pode excluir denuncias pelo feed ou pela pagina de detalhe.
- CTA da landing muda quando o usuario ja esta logado.

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
