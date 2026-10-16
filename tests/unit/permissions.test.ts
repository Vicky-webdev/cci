import { describe, expect, it } from "vitest";
import { PERMISSIONS, SYSTEM_ROLES, canModify, hasPermission, isKnownPermission } from "@/lib/auth/permissions";
import { requiresPublishPermission } from "@/lib/content/publishing";
import { permissionFor, RESOURCES } from "@/lib/admin/resources";

const subject = (roleKey: string, id = "u1") => ({ id, permissions: new Set(SYSTEM_ROLES.find((r) => r.key === roleKey)!.permissions) });

describe("hasPermission (deny by default)", () => {
  it("denies missing subjects and unknown permissions", () => {
    expect(hasPermission(null, "events.read")).toBe(false);
    expect(hasPermission(subject("analyst"), "events.update")).toBe(false);
    expect(hasPermission(subject("analyst"), "made.up")).toBe(false);
  });
  it("grants everything to Super Admin only", () => {
    expect(hasPermission(subject("super_admin"), "roles.manage")).toBe(true);
    for (const r of SYSTEM_ROLES.filter((x) => x.key !== "super_admin")) {
      expect(hasPermission({ id: "x", permissions: new Set(r.permissions) }, "roles.manage")).toBe(false);
    }
  });
});

describe("role matrix", () => {
  it.each([
    ["editor", "events.publish", true],
    ["editor", "users.manage", false],
    ["author", "events.create", true],
    ["author", "events.publish", false],
    ["author", "events.update", false],
    ["reviewer", "events.publish", true],
    ["reviewer", "events.create", false],
    ["media_manager", "media.delete", true],
    ["media_manager", "events.read", false],
    ["analyst", "audit.read", true],
    ["analyst", "submissions.export", false],
    ["administrator", "settings.manage", true],
    ["administrator", "roles.manage", false],
    ["administrator", "users.manage", false],
  ])("%s → %s = %s", (role, perm, expected) => expect(hasPermission(subject(role), perm)).toBe(expected));

  it("every role permission is a known permission", () => {
    for (const r of SYSTEM_ROLES) for (const p of r.permissions) expect(isKnownPermission(p), `${r.key}: ${p}`).toBe(true);
  });

  it("every resource's permissions exist", () => {
    for (const def of RESOURCES) {
      for (const action of ["read", "create", "update", "delete"] as const) {
        expect((PERMISSIONS as readonly string[]).includes(permissionFor(def, action)), `${def.key}.${action}`).toBe(true);
      }
    }
  });
});

describe("ownership", () => {
  it("lets authors modify only their own records", () => {
    const author = subject("author", "me");
    expect(canModify(author, "events", "update", { createdById: "me" })).toBe(true);
    expect(canModify(author, "events", "update", { createdById: "someone-else" })).toBe(false);
    expect(canModify(author, "events", "update", { createdById: null })).toBe(false);
    expect(canModify(subject("editor"), "events", "update", { createdById: "someone-else" })).toBe(true);
  });
});

describe("workflow gating", () => {
  it.each([
    [null, "DRAFT", false],
    [null, "IN_REVIEW", false],
    [null, "PUBLISHED", true],
    ["DRAFT", "SCHEDULED", true],
    ["PUBLISHED", "DRAFT", true],
    ["PUBLISHED", "PUBLISHED", true],
    ["DRAFT", "IN_REVIEW", false],
    ["ARCHIVED", "DRAFT", true],
  ] as const)("%s → %s needs publish: %s", (from, to, expected) => expect(requiresPublishPermission(from, to)).toBe(expected));
});
