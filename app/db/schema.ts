import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const linkContentTable = sqliteTable("link_content", {
  url: text("url").primaryKey().notNull(),
  title: text("name"),
  siteName: text("site_name"),
  author: text("author"),
  textEn: text("text_en"),
  textMM: text("text_mm"),
  publishedTime: text("published_time"),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const LinkContentSchema = createSelectSchema(linkContentTable);
export type LinkContent = z.infer<typeof LinkContentSchema>;
