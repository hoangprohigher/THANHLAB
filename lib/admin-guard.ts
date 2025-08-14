import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "dev-secret" });
  return Boolean(token && (token as any).role === "admin");
}


