import { cookies } from "next/headers";
import { verifySession } from "@repo/utils";

export type SessionUser = { uid: string; name: string; email: string } | null;

export async function getSessionUser(): Promise<SessionUser> {
  const token = (await cookies()).get("session")?.value;
  if (!token || !process.env.AUTH_SECRET) return null;
  try {
    const payload = await verifySession(token, process.env.AUTH_SECRET);
    return {
      uid: String(payload.uid),
      name: String(payload.name),
      email: String(payload.email)
    };
  } catch {
    return null;
  }
}
