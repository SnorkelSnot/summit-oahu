import crypto from "node:crypto";

// HMAC token that signs one-click review moderation links.
// Requires ADMIN_SECRET in the environment.
export function moderationToken(id: string, action: string) {
  return crypto
    .createHmac("sha256", process.env.ADMIN_SECRET || "unset")
    .update(`${id}:${action}`)
    .digest("hex");
}
