import { QueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { LocalDatabase } from "~/db/provider";
import { LinkContent, linkContentTable } from "~/db/schema";

export const processUrl = async (
  url: string,
  db: LocalDatabase,
  queryClient: QueryClient
): Promise<LinkContent> => {
  if (!db) {
    throw new Error("Database is not initialized");
  }
  try {
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
      `${process.env.EXPO_PUBLIC_AWS_LAMBDA_FUNCTION_URL}/?url=${url}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result: LinkContent = await response.json();

    if (!result) {
      throw new Error("Unable to process link");
    }

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
  } catch (err) {
    throw new Error("Unable to process link");
  }
};
