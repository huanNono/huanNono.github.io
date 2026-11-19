(() => {
  "use strict";
  const key = "huannono:reading-origin";
  const pendingKey = "huannono:reading-return";
  const read = key => { try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; } };
  const write = (key, value) => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* Links work without storage. */ } };
  const page = location.pathname + location.search;
  const reader = document.querySelector("[data-reader-root]");
  document.addEventListener("click", event => {
    if (reader || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.target || link.hasAttribute("download")) return;
    const target = new URL(link.href);
    if (target.origin !== location.origin || !/^\/posts\/[^/]+\/$/.test(target.pathname) || target.pathname.startsWith("/posts/page/")) return;
    write(key, { from: location.href, article: target.pathname, y: scrollY, at: Date.now(), focus: link.getAttribute("href") });
  });
  const origin = read(key);
  let source;
  try { source = new URL(origin?.from); } catch { /* Direct visits use Blog. */ }
  if (reader && source?.origin === location.origin && origin.article === location.pathname && Date.now() - origin.at < 3600000 && document.referrer === origin.from.split("#")[0]) {
    const labels = { "": "home", tags: "tags", categories: "categories", search: "search results", archives: "archives" };
    const label = labels[source.pathname.split("/")[1]] ?? "Blog";
    document.querySelectorAll("[data-reading-return]").forEach(link => {
      link.href = origin.from;
      link.querySelector("span").textContent = `Back to ${label}`;
      link.addEventListener("click", event => {
        if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) write(pendingKey, origin);
      });
    });
  }
  const restore = () => {
    const pending = read(pendingKey);
    if (!pending || reader) return;
    let url;
    try { url = new URL(pending.from); } catch { return; }
    if (url.origin !== location.origin || url.pathname + url.search !== page) return;
    try { sessionStorage.removeItem(pendingKey); } catch { /* Storage may be disabled. */ }
    if (Date.now() - pending.at > 3600000) return;
    requestAnimationFrame(() => {
      const link = [...document.querySelectorAll("a[href]")].find(link => link.getAttribute("href") === pending.focus);
      link?.focus({ preventScroll: true });
      window.scrollTo({ top: pending.y, behavior: "instant" });
    });
  };
  if (document.getElementById("searchInput")) {
    window.addEventListener("site-search-ready", restore);
    window.addEventListener("pageshow", event => { if (event.persisted) restore(); });
  } else {
    window.addEventListener("pageshow", restore);
  }
})();
