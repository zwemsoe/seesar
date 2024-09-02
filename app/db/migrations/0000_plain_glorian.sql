CREATE TABLE `link_content` (
	`url` text PRIMARY KEY NOT NULL,
	`name` text,
	`site_name` text,
	`author` text,
	`text_en` text,
	`text_mm` text,
	`published_time` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
