import express from "express";
import { BASE_URL, DATASET_PATH, SUBMIT_PATH } from "./config.js";
import { buildUrl, fetchJson, fetchBlob, sha256 } from "./client.js";
import { submitAnswer } from "./submit.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.type("html").send(`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>SE Assessment Helper</title>
      </head>
      <body>
        <h1>SE Assessment Helper</h1>
        <p>This local Express server helps you explore the SE assessment API.</p>
        <ul>
          <li><a href="/health">/health</a> — probe API health</li>
          <li><a href="/discover">/discover</a> — show configured API information</li>
          <li><a href="/dataset">/dataset</a> — download dataset bytes with digest</li>
        </ul>
        <p>Use <code>POST /submit</code> with JSON <code>{ type, value, notes }</code> to submit answers.</p>
      </body>
    </html>
  `);
});

app.get("/health", async (req, res) => {
  try {
    const data = await fetchJson("/api/v1/health");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/discover", (req, res) => {
  res.json({
    BASE_URL,
    DATASET_PATH,
    SUBMIT_PATH,
    health: buildUrl("/api/v1/health"),
    dataset: buildUrl(DATASET_PATH),
    submit: buildUrl(SUBMIT_PATH),
  });
});

app.get("/dataset", async (req, res) => {
  try {
    const buffer = await fetchBlob(DATASET_PATH);
    const digest = sha256(buffer);

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("X-Dataset-Digest", digest);
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/submit", async (req, res) => {
  try {
    const { type, value, notes = "" } = req.body;
    if (!type || !value) {
      return res.status(400).json({ error: "type and value are required" });
    }

    const result = await submitAnswer(type, value, notes);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

export default app;
