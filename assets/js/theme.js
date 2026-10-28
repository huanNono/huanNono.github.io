(() => {
  "use strict";
  const html = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const labels = { light: "浅色", dark: "深色", auto: "跟随系统" };
  const normalize = value => Object.hasOwn(labels, value) ? value : "auto";
  const readPreference = () => {
    try { return normalize(localStorage.getItem("pref-theme")); }
    catch { return "auto"; }
  };
  let preference = readPreference();

  const apply = value => {
    preference = normalize(value);
    const theme = preference === "auto" ? (system.matches ? "dark" : "light") : preference;
    html.dataset.themePreference = preference;
    html.dataset.theme = theme;
    html.style.colorScheme = theme;
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.title = `外观模式：${labels[preference]}`;
      toggle.setAttribute("aria-label", toggle.title);
    }
    document.querySelectorAll("[data-theme-choice]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.themeChoice === preference));
    });
  };
  // Run in the head so a saved choice is applied before the first paint.
  apply(preference);
  system.addEventListener("change", () => { if (preference === "auto") apply("auto"); });
  window.addEventListener("storage", event => {
    if (event.key === "pref-theme" || event.key === null) apply(readPreference());
  });

  const initialize = () => {
    const picker = document.querySelector(".theme-picker");
    if (!picker) return;
    const toggle = picker.querySelector("#theme-toggle");
    const options = picker.querySelector("#theme-options");
    const choices = [...picker.querySelectorAll("[data-theme-choice]")];
    const close = (restoreFocus = false) => {
      options.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      if (restoreFocus) toggle.focus({ preventScroll: true });
    };
    const open = () => {
      options.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      choices.find(button => button.dataset.themeChoice === preference).focus({ preventScroll: true });
    };
    apply(preference);
    toggle.addEventListener("click", () => { if (options.hidden) open(); else close(true); });
    choices.forEach(button => button.addEventListener("click", () => {
      apply(button.dataset.themeChoice);
      try { localStorage.setItem("pref-theme", preference); } catch { /* Keep this page usable when storage is blocked. */ }
      close(true);
    }));
    picker.addEventListener("keydown", event => {
      if (event.key === "Escape") { close(true); event.preventDefault(); }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (options.hidden) { open(); return; }
        const index = choices.indexOf(document.activeElement);
        const direction = event.key === "ArrowDown" ? 1 : -1;
        choices[(index + direction + choices.length) % choices.length].focus();
      }
    });
    picker.addEventListener("focusout", event => {
      if (!picker.contains(event.relatedTarget)) close();
    });
    document.addEventListener("pointerdown", event => {
      if (!picker.contains(event.target)) close();
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
