import { argv } from "node:process";
import { fetchJson, buildUrl, DATASET_PATH, SUBMIT_PATH } from "./client.js";
import { downloadDataset } from "./layer1.js";
import { submitAnswer } from "./submit.js";

function printHelp() {
  console.log(`
Usage:
  node src/index.js --health
  node src/index.js --discover
  node src/index.js --fetch-dataset [output-file]
  node src/index.js --submit --type <layer> --value <answer> [--notes <text>]

Environment:
  BASE_URL, API_KEY, DATASET_PATH, SUBMIT_PATH
`);
}

function parseArgs(args) {
  const parsed = {};
  let pending = null;

  args.forEach((token) => {
    if (token.startsWith("--")) {
      pending = token.slice(2);
      parsed[pending] = true;
      return;
    }

    if (pending) {
      parsed[pending] = token;
      pending = null;
      return;
    }
  });

  return parsed;
}

async function main() {
  const args = parseArgs(argv.slice(2));

  if (args.help || Object.keys(args).length === 0) {
    printHelp();
    return;
  }

  if (args.health) {
    const result = await fetchJson("/api/v1/health");
    console.log("Health:", JSON.stringify(result, null, 2));
    return;
  }

  if (args.discover) {
    console.log("Base URL:", buildUrl("/"));
    console.log("Dataset path:", DATASET_PATH);
    console.log("Submit path:", SUBMIT_PATH);
    console.log("Health path:", buildUrl("/api/v1/health"));
    return;
  }

  if (args["fetch-dataset"]) {
    const output = typeof args["fetch-dataset"] === "string" && args["fetch-dataset"] !== true
      ? args["fetch-dataset"]
      : "dataset.bin";
    await downloadDataset(output);
    return;
  }

  if (args.submit) {
    const type = args.type;
    const value = args.value;
    const notes = args.notes || "";
    if (!type || !value) {
      throw new Error("--type and --value are required for --submit.");
    }

    const result = await submitAnswer(type, value, notes);
    console.log("Submission response:", JSON.stringify(result, null, 2));
    return;
  }

  printHelp();
}

main().catch((error) => {
  console.error("ERROR:", error.message);
  process.exit(1);
});
