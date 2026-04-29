import { fetchAllReports } from "@/lib/data-source";
import { FeedClient } from "@/components/feed-client";

export default async function FeedPage() {
  const reports = await fetchAllReports();
  return <FeedClient reports={reports} />;
}
