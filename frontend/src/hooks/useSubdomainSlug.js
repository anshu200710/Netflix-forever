// src/hooks/useSubdomainSlug.js
export default function useSubdomainSlug() {
  const host = window.location.hostname; // e.g. localhost or anshu.yourdomain.com

  // 1) First, support dev mode via ?slug=anshu
  const params = new URLSearchParams(window.location.search);
  const slugFromQuery = params.get("slug");
  if (slugFromQuery) {
    return slugFromQuery;
  }

  // 2) If on localhost and no ?slug, no subdomain
  if (host === "localhost" || host.startsWith("127.")) {
    return null;
  }

  // 3) Real subdomain case: anshu.yourdomain.com
  const parts = host.split(".");
  if (parts.length <= 2) return null;

  return parts[0]; // "anshu"
}
