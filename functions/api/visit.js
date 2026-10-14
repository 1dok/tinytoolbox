const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

function todayInChina() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

export async function onRequestPost({ request, env }) {
  if (!env.STATS_DB) {
    return new Response(JSON.stringify({ ok: false, error: "Statistics database is not configured." }), { status: 503, headers: JSON_HEADERS });
  }
  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON." }), { status: 400, headers: JSON_HEADERS });
  }
  const visitorId = typeof body.visitorId === "string" ? body.visitorId : "";
  const page = typeof body.page === "string" ? body.page.slice(0, 300) : "/";
  if (!/^[a-f0-9-]{32,36}$/i.test(visitorId)) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid visitor ID." }), { status: 400, headers: JSON_HEADERS });
  }
  const day = todayInChina();
  try {
    await env.STATS_DB.batch([
      env.STATS_DB.prepare("INSERT INTO page_views (day, page_path) VALUES (?, ?)").bind(day, page),
      env.STATS_DB.prepare("INSERT OR IGNORE INTO unique_visitors (visitor_id, first_day) VALUES (?, ?)").bind(visitorId, day),
      env.STATS_DB.prepare("INSERT OR IGNORE INTO daily_visitors (day, visitor_id) VALUES (?, ?)").bind(day, visitorId)
    ]);
    return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Unable to record statistics." }), { status: 500, headers: JSON_HEADERS });
  }
}
