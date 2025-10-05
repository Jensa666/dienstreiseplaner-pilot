export const onRequest = async ({ request, next }) => {
  const res = await next();
  const hdr = new Headers(res.headers);
  hdr.set('X-Frame-Options','DENY');
  hdr.set('Referrer-Policy','strict-origin-when-cross-origin');
  hdr.set('X-Content-Type-Options','nosniff');
  hdr.set('Permissions-Policy','geolocation=()');
  // CDN für pdf-lib zulassen (siehe index.html)
  hdr.set('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' https://cdn.jsdelivr.net; connect-src 'self'");
  return new Response(res.body, {status: res.status, headers: hdr});
};
