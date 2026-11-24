export function siteOrigin() {
  const url = new URL(process.env.SITE_URL || "http://localhost:3000");
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error(
      "SITE_URL must be a public http(s) origin without credentials.",
    );
  }
  return url.origin;
}

export function indexingEnabled() {
  const url = new URL(siteOrigin());
  return (
    process.env.SITE_INDEXING === "true" &&
    url.protocol === "https:" &&
    !["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname)
  );
}
