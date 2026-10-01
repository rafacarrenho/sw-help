export function GET({ request }: { request: Request }) {
  return Response.redirect(
    new URL('/summoners-war/monsters/index.json', request.url),
    301,
  );
}
