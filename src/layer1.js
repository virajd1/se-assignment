import { writeFile } from "node:fs/promises";
import { fetchBlob, sha256, DATASET_PATH } from "./client.js";

async function downloadDataset(outputPath = "dataset.bin") {
  console.log(`Downloading dataset from ${DATASET_PATH} ...`);
  const buffer = await fetchBlob(DATASET_PATH);
  await writeFile(outputPath, Buffer.from(buffer));
  const digest = sha256(buffer);
  console.log(`Dataset saved to ${outputPath}`);
  console.log(`SHA-256 digest: ${digest}`);
  return { outputPath, digest, size: buffer.byteLength };
}

function verifyDigest(buffer, expectedHex) {
  const actual = sha256(buffer);
  return actual === expectedHex;
}

export { downloadDataset, verifyDigest };
