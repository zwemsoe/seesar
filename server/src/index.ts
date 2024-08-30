import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import translate from "@iamtraction/google-translate";
import TurndownService from "turndown";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

const turndownService = new TurndownService();

turndownService.remove([
    "del",
    "script",
    "video",
    "iframe",
    "audio",
]);

const app = express();
app.use(cors());
const port = process.env.PORT || 4000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.post("/process-link", async (req: Request, res: Response) => {
    const url = req.body?.url ||
        "";

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const html = await page.content();
    await browser.close();

    const doc = new JSDOM(html);
    const parsed = new Readability(doc.window.document).parse();

    if (!parsed) {
        return res.status(400).json({ error: "Unable to process link" });
    }

    const { content: htmlContent, textContent, title, byline, publishedTime } =
        parsed;

    const translation = await translate(htmlContent, {
        to: "my",
    });

    const translatedMarkdown = turndownService.turndown(translation.text);
    const originalMarkdown = turndownService.turndown(htmlContent);

    const cleanedUrl = new URL(url).hostname;

    return res.status(200).json({
        original: originalMarkdown,
        translated: translatedMarkdown,
        title,
        publishedTime,
        author: byline,
        url: cleanedUrl,
    });
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
