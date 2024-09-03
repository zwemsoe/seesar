const express = require("express");
const cors = require("cors");
const translate = require("@iamtraction/google-translate");
const { isProbablyReaderable, Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");
const { convert } = require("html-to-text");
const puppeteer = require("puppeteer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/process-link", async (req, res) => {
  const url = req.body?.url || "";

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  const page = await browser.newPage();
  await page.goto(url, { timeout: 0, waitUntil: "domcontentloaded" });
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

  const text = convert(content, {
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

  let textEn = text;

  if (!lang.startsWith("en")) {
    const translation = await translate(text, {
      to: "en",
    });
    textEn = translation.text;
  }

  const translation = await translate(text, {
    to: "my",
  });

  return res.status(200).json({
    url,
    title,
    siteName,
    author: byline,
    textEn,
    textMM: translation?.text ?? "",
    publishedTime,
  });
});

app.use((err, req, res, _next) => {
  res.status(500).send("Something went wrong");
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
