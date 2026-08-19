export function postAuthDestination(next: string | null) {
  if (next?.startsWith("/") && !next.startsWith("//")) return next;
  return "/account";
}
