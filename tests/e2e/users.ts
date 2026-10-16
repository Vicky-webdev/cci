// Test-only accounts created in the throwaway E2E database (never in a real environment).
export const E2E_PASSWORD = "E2e-Test-Password-2026!";
export const E2E_USERS = [
  { key: "super", email: "super@e2e.test", name: "E2E Super", role: "super_admin" },
  { key: "admin", email: "admin@e2e.test", name: "E2E Administrator", role: "administrator" },
  { key: "editor", email: "editor@e2e.test", name: "E2E Editor", role: "editor" },
  { key: "author", email: "author@e2e.test", name: "E2E Author", role: "author" },
  { key: "reviewer", email: "reviewer@e2e.test", name: "E2E Reviewer", role: "reviewer" },
  { key: "media", email: "media@e2e.test", name: "E2E Media", role: "media_manager" },
  { key: "analyst", email: "analyst@e2e.test", name: "E2E Analyst", role: "analyst" },
  { key: "lockout", email: "lockout@e2e.test", name: "E2E Lockout", role: "analyst" },
] as const;
export type E2EUserKey = (typeof E2E_USERS)[number]["key"];
