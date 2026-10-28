(() => {
  "use strict";
  const root = document.querySelector("[data-reader-root]");
  if (!root) return;
  const content = root.querySelector("#article-content");
  const intro = root.querySelector(".reader-intro");
  const header = document.querySelector(".reader-site-header");
  const footer = document.querySelector(".site-footer");
  const toc = root.querySelector(".reader-toc");
  const tocNav = toc?.querySelector("nav");
  const progress = root.querySelector("[data-reading-top]");
  const progressText = root.querySelector("[data-reading-percent]");
  const desktop = window.matchMedia("(min-width: 1050px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const headingFor = (hash) => {
    try { return document.getElementById(decodeURIComponent(hash.replace(/^#/, ""))); }
    catch { return null; }
  };
  const sections = [...(tocNav?.querySelectorAll('a[href^="#"]') || [])]
    .map(link => ({ link, heading: headingFor(link.hash) }))
    .filter(section => section.heading);
  let lastScroll = window.scrollY;
  let activeHeading = null;
  let framePending = false;
  let previousPercent = -1;

  const syncToc = () => {
    if (!toc) return;
    toc.open = desktop.matches;
    const summary = toc.querySelector("summary");
    summary.tabIndex = desktop.matches ? -1 : 0;
  };
  syncToc();
  desktop.addEventListener("change", syncToc);
  toc?.querySelector("summary").addEventListener("click", event => {
    if (desktop.matches) event.preventDefault();
  });

  const update = () => {
    framePending = false;
    const y = window.scrollY;
    const delta = y - lastScroll;
    if (header) {
      header.classList.toggle("reader-header-pinned", y > 90);
      if (y < 260 || delta < -5 || header.contains(document.activeElement)) {
        header.classList.remove("reader-header-hidden");
      } else if (delta > 5) {
        header.classList.add("reader-header-hidden");
      }
    }
    lastScroll = y;
    let current = sections[0];
    for (const section of sections) {
      if (section.heading.getBoundingClientRect().top <= 160) current = section;
    }
    if (current && current.heading !== activeHeading) {
      for (const section of sections) {
        if (section === current) section.link.setAttribute("aria-current", "location");
        else section.link.removeAttribute("aria-current");
      }
      activeHeading = current.heading;
      if (desktop.matches && tocNav) {
        const linkRect = current.link.getBoundingClientRect();
        const navRect = tocNav.getBoundingClientRect();
        if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
          tocNav.scrollTop += linkRect.top - navRect.top - tocNav.clientHeight / 3;
        }
      }
    }
    const start = intro.getBoundingClientRect().top + y;
    const end = content.getBoundingClientRect().bottom + y - window.innerHeight;
    const percent = Math.round(Math.min(100, Math.max(0, (y - start) / Math.max(1, end - start) * 100)));
    if (percent !== previousPercent) {
      progressText.textContent = `${percent}%`;
      progress.setAttribute("aria-label", `阅读进度 ${percent}%，返回文章顶部`);
      progress.classList.toggle("is-complete", percent === 100);
      previousPercent = percent;
    }
    progress.hidden = y < 180 || !!(footer && footer.getBoundingClientRect().top < window.innerHeight);
  };
  const schedule = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(update);
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(content);

  const jumpTo = (target, smooth = true) => {
    if (!target) return;
    if (toc && !desktop.matches) toc.open = false;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: smooth && !reduceMotion.matches ? "smooth" : "auto", block: "start" });
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      schedule();
    });
  };
  root.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = headingFor(link.hash);
      if (!target) return;
      event.preventDefault();
      history.pushState(null, "", link.hash);
      jumpTo(target);
    });
  });
  window.addEventListener("hashchange", () => jumpTo(headingFor(location.hash), false));
  progress.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    history.replaceState(null, "", location.pathname + location.search);
    intro.querySelector("h1").setAttribute("tabindex", "-1");
    intro.querySelector("h1").focus({ preventScroll: true });
  });

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return; } catch { /* Try the selection fallback. */ }
    }
    const previous = document.activeElement;
    const field = document.createElement("textarea");
    field.value = text;
    field.className = "reader-copy-fallback";
    field.setAttribute("readonly", "");
    document.body.append(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand("copy"); }
    finally { field.remove(); previous?.focus({ preventScroll: true }); }
    if (!copied) throw new Error("Copy unavailable");
  };
  root.querySelectorAll(".reader-code").forEach(block => {
    const viewport = block.querySelector(".reader-code-scroll");
    const copy = block.querySelector("[data-copy-code]");
    const expand = block.querySelector("[data-expand-code]");
    const lines = Number(block.dataset.codeLines);
    copy.hidden = false;
    copy.querySelector("span").textContent = "复制";
    copy.addEventListener("click", async () => {
      const label = copy.querySelector("span");
      try {
        const code = viewport.querySelector("code").cloneNode(true);
        code.querySelectorAll(".ln, .lnt").forEach(number => number.remove());
        await copyText(code.textContent);
        label.textContent = "已复制";
        copy.setAttribute("aria-label", "代码已复制");
      } catch {
        label.textContent = "请手动复制";
        copy.setAttribute("aria-label", "自动复制失败，请手动选择代码复制");
      }
      setTimeout(() => { label.textContent = "复制"; copy.setAttribute("aria-label", "复制代码"); }, 2400);
    });
    if (lines > 12) {
      block.classList.add("is-code-collapsed");
      expand.hidden = false;
      expand.setAttribute("aria-expanded", "false");
      expand.querySelector("span").textContent = `展开全部代码（${lines} 行）`;
      expand.addEventListener("click", () => {
        const wasCollapsed = block.classList.contains("is-code-collapsed");
        const aboveViewport = block.getBoundingClientRect().top < 110;
        block.classList.toggle("is-code-collapsed", !wasCollapsed);
        expand.setAttribute("aria-expanded", String(wasCollapsed));
        expand.querySelector("span").textContent = wasCollapsed ? "收起代码" : `展开全部代码（${lines} 行）`;
        if (!wasCollapsed && aboveViewport) block.scrollIntoView({ behavior: "auto", block: "start" });
        schedule();
      });
    }
  });

  const info = root.querySelector(".reader-info");
  const copyLink = root.querySelector("[data-copy-link]");
  const copyStatus = root.querySelector("[data-copy-status]");
  copyLink.hidden = false;
  copyLink.addEventListener("click", async () => {
    try { await copyText(info.dataset.articleUrl); copyStatus.textContent = "链接已复制"; }
    catch { copyStatus.textContent = "请手动复制上方文章链接"; }
    setTimeout(() => { copyStatus.textContent = ""; }, 3000);
  });
  const qr = root.querySelector("#reader-qr");
  const openQr = root.querySelector("[data-open-qr]");
  if (qr && typeof qr.showModal === "function") {
    openQr.hidden = false;
    openQr.addEventListener("click", () => qr.showModal());
    root.querySelector("[data-close-qr]").addEventListener("click", () => qr.close());
    qr.addEventListener("click", event => { if (event.target === qr) qr.close(); });
  }
  if (location.hash) jumpTo(headingFor(location.hash), false);
  schedule();
})();
