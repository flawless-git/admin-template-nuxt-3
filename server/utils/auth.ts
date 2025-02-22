import type { H3Event } from "h3";

export function getToken(event: H3Event): string | null {
  const authorization = getHeader(event, "Authorization");
  if (!authorization) return null;

  // Handle both cases: full "Bearer token" and just "token"
  return authorization.startsWith("Bearer ")
    ? authorization
    : `Bearer ${authorization}`;
}
