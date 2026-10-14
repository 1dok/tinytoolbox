(() => {
  "use strict";
  const number = value => new Intl.NumberFormat(document.documentElement.lang || "en").format(value);
  function getVisitorId() {
    const key = "tinytoolbox_visitor_id";
    try {
      let id = localStorage.getItem(key);
      if (!id) {
        id = (crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0;
          return (c === "x" ? r : (r & 3 | 8)).toString(16);
        }));
        localStorage.setItem(key, id);
      }
      return id;
    } catch {
      return null;
    }
  }
  function render(data) {
    if (!data || !data.ok) return;
    const mapping = {
      "stats-today-pv": data.todayPv,
      "stats-total-pv": data.totalPv,
      "stats-today-uv": data.todayUv,
      "stats-total-uv": data.totalUv
    };
    for (const [id, value] of Object.entries(mapping)) {
      const el = document.getElementById(id);
      if (el) el.textContent = number(value);
    }
  }
  async function init() {
    const id = getVisitorId();
    if (id) {
      try {
        await fetch("/api/visit", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ visitorId: id, page: location.pathname }),
          keepalive: true
        });
      } catch { /* Statistics must never block site functionality. */ }
    }
    try {
      const response = await fetch("/api/stats", { cache: "no-store" });
      if (response.ok) render(await response.json());
    } catch { /* If statistics are unavailable, leave the neutral placeholders. */ }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
