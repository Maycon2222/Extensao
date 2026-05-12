/**
 * Camada de acesso a dados com fallback gracioso para mock data.
 *
 * Se o banco não estiver disponível (ex: Postgres não subiu), a plataforma
 * continua funcionando com dados de demonstração.
 *
 * ESTRATEGIA DE DETEÇÃO:
 * - Na primeira falha, marca o DB como indisponível em memoria
 * - Proximas chamadas pulam a tentativa de conexão (evita overhead)
 * - Retentativa automatica a cada 60s
 * - Variavel de ambiente OPA_FORCE_MOCK=true desabilita Prisma completamente
 */

import { db } from "@/lib/db";
import { adaptReport } from "@/lib/report-adapter";
import {
  PLATFORM_STATS,
  type Report,
} from "@/lib/mock-data";
import {
  getMockReportById,
  getMockReports,
  searchMockReports,
} from "@/lib/mock-report-store";
import { searchReports as dbSearch } from "@/lib/services/reports";

const REPORT_INCLUDE = {
  author: {
    select: {
      id: true,
      username: true,
      name: true,
      reputationTier: true,
    },
  },
} as const;

// Cache de disponibilidade do DB para evitar tentativas repetidas
let dbUnavailableUntil: number | null = null;
const RETRY_AFTER_MS = 60_000;

function forceMock(): boolean {
  return process.env.OPA_FORCE_MOCK === "true";
}

function isDbKnownDown(): boolean {
  if (forceMock()) return true;
  if (dbUnavailableUntil === null) return false;
  return Date.now() < dbUnavailableUntil;
}

function markDbDown() {
  dbUnavailableUntil = Date.now() + RETRY_AFTER_MS;
}

function markDbUp() {
  dbUnavailableUntil = null;
}

async function tryDb<T>(fn: () => Promise<T>, fallback: T | (() => T)): Promise<T> {
  if (isDbKnownDown()) {
    return typeof fallback === "function" ? (fallback as () => T)() : fallback;
  }
  try {
    const result = await fn();
    markDbUp();
    return result;
  } catch (error) {
    markDbDown();
    // Log apenas na primeira falha
    if (!dbUnavailableUntil || dbUnavailableUntil - Date.now() > RETRY_AFTER_MS - 1000) {
      console.warn("[DB indisponivel — usando mock]", (error as Error).message.split("\n")[0]);
    }
    return typeof fallback === "function" ? (fallback as () => T)() : fallback;
  }
}

export async function fetchRecentReports(limit = 12): Promise<Report[]> {
  return tryDb(
    async () => {
      const items = await db.report.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: REPORT_INCLUDE,
      });
      return items.map((r) => adaptReport(r));
    },
    () =>
      getMockReports()
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit)
  );
}

export async function fetchAllReports(): Promise<Report[]> {
  return tryDb(
    async () => {
      const items = await db.report.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 100,
        include: REPORT_INCLUDE,
      });
      return items.map((r) => adaptReport(r));
    },
    () => getMockReports()
  );
}

export async function fetchReportById(id: string): Promise<Report | null> {
  return tryDb(
    async () => {
      const r = await db.report.findUnique({
        where: { id },
        include: REPORT_INCLUDE,
      });
      return r ? adaptReport(r) : null;
    },
    () => getMockReportById(id)
  );
}

export async function fetchSearchResults(query: string) {
  return tryDb(
    async () => {
      const { matches } = await dbSearch(query);
      return matches.map((r) => adaptReport(r));
    },
    () => searchMockReports(query)
  );
}

export async function fetchPlatformStats() {
  return tryDb(
    async () => {
      const [activeReports, confirmedScams] = await Promise.all([
        db.report.count({ where: { status: "PUBLISHED" } }),
        db.report.count({
          where: { status: "PUBLISHED", verified: true },
        }),
      ]);
      return {
        activeReports: Math.max(activeReports, 100),
        confirmedScams: Math.max(confirmedScams, 50),
        monthlySearches: PLATFORM_STATS.monthlySearches,
      };
    },
    () => PLATFORM_STATS
  );
}
