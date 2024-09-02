import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import translate from "@iamtraction/google-translate";
import { isProbablyReaderable, Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { htmlToText } from "html-to-text";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.post("/process-link", async (req: Request, res: Response) => {
  const url: string = req.body?.url || "";

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const html = await page.content();
  await browser.close();

  const doc = new JSDOM(html);
  if (!isProbablyReaderable(doc.window.document)) {
    return res.status(400).json({ error: "Unable to process link" });
  }

  const parsed = new Readability(doc.window.document).parse();

  if (!parsed) {
    return res.status(400).json({ error: "Unable to process link" });
  }

  const { content, title, byline, publishedTime, siteName, lang } = parsed;

  const text = htmlToText(content, {
    selectors: [
      { selector: "del", format: "skip" },
      { selector: "script", format: "skip" },
      { selector: "video", format: "skip" },
      { selector: "iframe", format: "skip" },
      { selector: "audio", format: "skip" },
      { selector: "img", format: "skip" },
      { selector: "a", options: { ignoreHref: true } },
      { selector: "br", format: "skip" },
      { selector: "p.img", format: "skip" },
      { selector: "p.figcaption", format: "skip" },
      { selector: "figcaption", format: "skip" },
    ],
    wordwrap: 130,
    preserveNewlines: false,
  }).replace(/\n{3,}/g, "\n\n");

  const translation = await translate(text, {
    to: "my",
  });

  return res.status(200).json({
    url,
    title,
    siteName,
    author: byline,
    textEn: text,
    textMM: translation.text,
    publishedTime,
  });
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
