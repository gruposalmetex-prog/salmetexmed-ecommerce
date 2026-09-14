import { checkRateLimitByIdentifier } from "@/lib/rate-limit";
import { requireAdmin } from "./require-admin";

export async function checkAdminUploadRateLimit() {
  const session = await requireAdmin();

  return checkRateLimitByIdentifier(
    "adminUploadSignature",
    `admin:${session.user.id}`,
  );
}
