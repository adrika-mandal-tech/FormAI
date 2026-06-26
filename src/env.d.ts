/// <reference types="@cloudflare/workers-types" />

type Env = {
  DB: D1Database;
  GEMINI_API_KEY: string;
}
