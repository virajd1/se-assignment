import dotenv from "dotenv";
import { env } from "node:process";

dotenv.config();

const BASE_URL = env.BASE_URL?.trim();
const API_KEY = env.API_KEY?.trim();
const DATASET_PATH = env.DATASET_PATH?.trim() || "/api/v1/dataset";
const SUBMIT_PATH = env.SUBMIT_PATH?.trim() || "/api/v1/submit";

if (!BASE_URL) {
  throw new Error("BASE_URL is required. Set it in .env or environment variables.");
}

if (!API_KEY) {
  throw new Error("API_KEY is required. Set it in .env or environment variables.");
}

export { BASE_URL, API_KEY, DATASET_PATH, SUBMIT_PATH };
