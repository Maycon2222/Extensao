import type { FraudCategoryId } from "@/lib/categories";
import type { Report } from "@/lib/mock-data";
import { MOCK_REPORTS } from "@/lib/mock-data";

type MockStoreGlobal = typeof globalThis & {
  opaMockReports?: Report[];
  opaMockComments?: Record<string, MockComment[]>;
  opaMockVotes?: Record<string, Record<string, "CONFIRM" | "FALSE_ALERT">>;
  opaMockVoteBases?: Record<string, { votesUp: number; votesDown: number }>;
  opaMockRemovedReportIds?: string[];
};

export interface MockComment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    reputationTier: "BRONZE" | "PRATA" | "OURO" | "DIAMANTE";
  };
}

const CATEGORY_BY_API_VALUE: Record<string, FraudCategoryId> = {
  PHISHING: "phishing",
  SMS: "sms",
  FAKE_PROFILE: "fake-profile",
  MARKETPLACE: "marketplace",
  FAKE_BOLETO: "fake-boleto",
  PIX: "pix",
  CLONE_SITE: "clone-site",
  CALL: "call",
  MALICIOUS_APP: "malicious-app",
};

const IDENTIFIER_TYPE_BY_API_VALUE = {
  PHONE: "phone",
  URL: "url",
  CNPJ: "cnpj",
} as const;

function store(): Report[] {
  const g = globalThis as MockStoreGlobal;
  g.opaMockReports ??= [];
  return g.opaMockReports;
}

function removedIds(): Set<string> {
  const g = globalThis as MockStoreGlobal;
  g.opaMockRemovedReportIds ??= [];
  return new Set(g.opaMockRemovedReportIds);
}

function commentsStore(): Record<string, MockComment[]> {
  const g = globalThis as MockStoreGlobal;
  g.opaMockComments ??= {};
  return g.opaMockComments;
}

function votesStore(): Record<string, Record<string, "CONFIRM" | "FALSE_ALERT">> {
  const g = globalThis as MockStoreGlobal;
  g.opaMockVotes ??= {};
  return g.opaMockVotes;
}

function voteBasesStore(): Record<string, { votesUp: number; votesDown: number }> {
  const g = globalThis as MockStoreGlobal;
  g.opaMockVoteBases ??= {};
  return g.opaMockVoteBases;
}

export function getMockReports(): Report[] {
  const removed = removedIds();
  return [...store(), ...MOCK_REPORTS].filter((report) => !removed.has(report.id));
}

export function getMockReportById(id: string): Report | null {
  return getMockReports().find((report) => report.id === id) ?? null;
}

export function addMockReport(input: {
  authorUsername?: string | null;
  category: string;
  identifierType: "PHONE" | "URL" | "CNPJ";
  identifier: string;
  description: string;
  location: string;
  occurredAt: Date;
}): Report {
  const report: Report = {
    id: `mock-${Date.now()}`,
    category: CATEGORY_BY_API_VALUE[input.category] ?? "phishing",
    identifier: input.identifier,
    identifierType: IDENTIFIER_TYPE_BY_API_VALUE[input.identifierType],
    description: input.description,
    location: input.location,
    createdAt: new Date(),
    votesUp: 0,
    votesDown: 0,
    comments: 0,
    riskLevel: "medium",
    verified: false,
    author: {
      username: input.authorUsername ?? "usuario_mock",
      reputation: "Diamante",
    },
  };

  store().unshift(report);
  return report;
}

export function searchMockReports(query: string): Report[] {
  const q = query.trim().toLowerCase();
  const digits = q.replace(/\D/g, "");

  return getMockReports().filter((report) => {
    const identifier = report.identifier.toLowerCase();

    if (report.identifierType === "url") {
      const host = identifier.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
      return identifier.includes(q) || q.includes(host) || q.includes(host.split(".")[0]);
    }

    return digits.length > 0 && identifier.replace(/\D/g, "").includes(digits);
  });
}

export function getMockReportsByAuthor(username?: string | null): Report[] {
  if (!username) return store();
  return getMockReports().filter((report) => report.author.username === username);
}

export function getMockActivityStatsForUser(input: {
  userId?: string | null;
  username?: string | null;
}) {
  const reports = getMockReportsByAuthor(input.username);
  const comments = Object.values(commentsStore())
    .flat()
    .filter((comment) => comment.author.id === input.userId).length;
  const votesCast = Object.values(votesStore()).filter(
    (reportVotes) => input.userId && reportVotes[input.userId]
  ).length;

  return {
    reports,
    total: reports.length,
    verified: reports.filter((report) => report.verified).length,
    votesCast,
    comments,
  };
}

export function removeMockReport(id: string): boolean {
  const g = globalThis as MockStoreGlobal;
  g.opaMockRemovedReportIds ??= [];
  if (!g.opaMockRemovedReportIds.includes(id)) {
    g.opaMockRemovedReportIds.push(id);
  }

  g.opaMockReports = store().filter((report) => report.id !== id);
  return true;
}

export function castMockVote(input: {
  reportId: string;
  userId: string;
  type: "CONFIRM" | "FALSE_ALERT";
}) {
  const report = getMockReportById(input.reportId);
  if (!report) return null;

  const allVotes = votesStore();
  const voteBases = voteBasesStore();
  allVotes[input.reportId] ??= {};
  voteBases[input.reportId] ??= {
    votesUp: report.votesUp,
    votesDown: report.votesDown,
  };

  const previous = allVotes[input.reportId][input.userId];
  let action: "created" | "updated" | "removed";

  if (previous === input.type) {
    delete allVotes[input.reportId][input.userId];
    action = "removed";
  } else {
    allVotes[input.reportId][input.userId] = input.type;
    action = previous ? "updated" : "created";
  }

  const votes = Object.values(allVotes[input.reportId]);
  const votesUp =
    voteBases[input.reportId].votesUp +
    votes.filter((vote) => vote === "CONFIRM").length;
  const votesDown =
    voteBases[input.reportId].votesDown +
    votes.filter((vote) => vote === "FALSE_ALERT").length;

  const storedReport = store().find((item) => item.id === input.reportId);
  if (storedReport) {
    storedReport.votesUp = votesUp;
    storedReport.votesDown = votesDown;
  }

  return {
    action,
    stats: {
      votesUp,
      votesDown,
      credibilityScore: votesUp > 0 ? 60 : 45,
      riskLevel: report.riskLevel.toUpperCase(),
      verified: report.verified,
    },
  };
}

export function getMockComments(reportId: string): MockComment[] {
  return commentsStore()[reportId] ?? [];
}

export function addMockComment(input: {
  reportId: string;
  userId: string;
  username: string;
  reputationTier: "BRONZE" | "PRATA" | "OURO" | "DIAMANTE";
  content: string;
}) {
  const comment: MockComment = {
    id: `comment-${Date.now()}`,
    content: input.content,
    createdAt: new Date(),
    author: {
      id: input.userId,
      username: input.username,
      reputationTier: input.reputationTier,
    },
  };

  const allComments = commentsStore();
  allComments[input.reportId] ??= [];
  allComments[input.reportId].unshift(comment);
  return comment;
}
