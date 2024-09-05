const translate = require("@iamtraction/google-translate");
const { isProbablyReaderable, Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");
const { convert } = require("html-to-text");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

exports.handler = async (event, context, callback) => {
  const url = event.queryStringParameters?.url;

  if (!url && !Boolean(new URL(url))) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "URL is required" }),
    };
  }

  try {
    const browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--single-process",
        "--disable-infobars",
        "--disable-notifications",
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
      timeout: 10000,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    const html = await page.content();

    await browser.close();

    const doc = new JSDOM(html);
    if (!isProbablyReaderable(doc.window.document)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Unable to process link" }),
      };
    }

    const parsed = new Readability(doc.window.document).parse();

    if (!parsed) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Unable to process link" }),
      };
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        url,
        title,
        siteName,
        author: byline,
        textEn,
        textMM: translation?.text ?? "",
        publishedTime,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unable to process link" }),
    };
  }
};
