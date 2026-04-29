import { PrismaClient } from "@/generated/prisma";

// Singleton pattern para evitar multiplas instancias em dev (hot reload)
declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined;
}

const FORCE_MOCK = process.env.OPA_FORCE_MOCK === "true";

/**
 * Quando OPA_FORCE_MOCK=true, retornamos um Proxy que rejeita TODAS as
 * operacoes do Prisma imediatamente (sem tentar conectar). Isso:
 * - Evita timeouts longos de conexao
 * - Evita acumular connections zumbi
 * - Garante que o try/catch nos services/api-routes dispare rapido
 * - Mantem a plataforma estavel mesmo sem Postgres
 */
function createMockDb(): PrismaClient {
  const reject = () =>
    Promise.reject(new Error("DB_MOCK_MODE: operacao bloqueada (OPA_FORCE_MOCK=true)"));

  const modelHandler: ProxyHandler<object> = {
    get: () => reject,
  };

  const clientHandler: ProxyHandler<object> = {
    get: (_target, prop) => {
      if (prop === "$connect" || prop === "$disconnect") {
        return () => Promise.resolve();
      }
      if (prop === "$transaction") {
        return reject;
      }
      if (prop === "$on" || prop === "$use" || prop === "$extends") {
        return () => {};
      }
      // Qualquer model (user, report, vote, etc) retorna um proxy que rejeita qualquer metodo
      return new Proxy({}, modelHandler);
    },
  };

  return new Proxy({}, clientHandler) as PrismaClient;
}

function createRealDb(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });
}

export const db: PrismaClient =
  globalThis.prismaClient ??
  (FORCE_MOCK ? createMockDb() : createRealDb());

if (process.env.NODE_ENV !== "production" && !FORCE_MOCK) {
  globalThis.prismaClient = db;
}
