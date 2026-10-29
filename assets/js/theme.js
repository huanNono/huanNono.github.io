(() => {
  "use strict";
  const html = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const modes = ["light", "dark", "auto"];
  const labels = { light: "白天", dark: "黑夜", auto: "跟随系统" };
  const storageKey = "yoyo-theme-mode";
  const normalize = value => modes.includes(value) ? value : "light";
  const readPreference = () => {
    try { return normalize(sessionStorage.getItem(storageKey)); }
    catch { return "light"; }
  };
  let preference = readPreference();
  const nextMode = () => modes[(modes.indexOf(preference) + 1) % modes.length];

  const apply = value => {
    preference = normalize(value);
    const theme = preference === "auto" ? (system.matches ? "dark" : "light") : preference;
    html.dataset.themePreference = preference;
    html.dataset.theme = theme;
    html.style.colorScheme = theme;
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.title = `当前：${labels[preference]}；点击切换到${labels[nextMode()]}`;
      toggle.setAttribute("aria-label", toggle.title);
    }
  };
  // Apply before first paint. A new tab starts light; navigation keeps this tab's choice.
  apply(preference);
  system.addEventListener("change", () => { if (preference === "auto") apply("auto"); });
  window.addEventListener("pageshow", event => { if (event.persisted) apply(readPreference()); });

  const initialize = () => {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    apply(preference);
    toggle.addEventListener("click", () => {
      apply(nextMode());
      try { sessionStorage.setItem(storageKey, preference); } catch { /* Switching still works without storage. */ }
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
