import { QueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { LocalDatabase } from "~/db/provider";
import { LinkContent, linkContentTable } from "~/db/schema";

export const fetchLinkContent = async (
  url: string,
  db: LocalDatabase,
  queryClient: QueryClient
): Promise<LinkContent> => {
  if (!db) {
    throw new Error("Database is not initialized");
  }

  const dbResult = await db
    .select()
    .from(linkContentTable)
    .where(eq(linkContentTable.url, url))
    .limit(1);

  if (dbResult.length > 0) {
    const record = dbResult[0];
    return record;
  }

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/process-link`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }
  );

  const result: LinkContent = await response.json();

  await db.insert(linkContentTable).values({
    url,
    title: result.title,
    author: result.author,
    textEn: result.textEn,
    textMM: result.textMM,
    siteName: result.siteName,
    publishedTime: result.publishedTime,
  });

  queryClient.invalidateQueries({ queryKey: ["your_links"] });

  return result;
};
