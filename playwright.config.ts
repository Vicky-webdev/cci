import fs from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;
const e2eEnv = fs.existsSync(".e2e/env.json") ? (JSON.parse(fs.readFileSync(".e2e/env.json", "utf8")) as { databaseUrl: string }) : null;

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: /.*\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [["list"]],
  globalTeardown: "./tests/e2e/teardown.ts",
  use: {
    baseURL,
    trace: "retain-on-failure",
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : undefined,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npx next start -p ${PORT}`,
        url: `${baseURL}/robots.txt`,
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          DATABASE_URL: e2eEnv?.databaseUrl ?? "",
          SITE_URL: baseURL,
          SITE_ENV: "development",
          SESSION_COOKIE_SECURE: "false",
          UPLOAD_DIR: ".e2e/uploads",
          NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "",
          RECAPTCHA_SECRET_KEY: "",
        },
      },
});
