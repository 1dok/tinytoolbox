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

export async function onRequestGet({ env }) {
  if (!env.STATS_DB) {
    return new Response(JSON.stringify({ ok: false, error: "Statistics database is not configured." }), { status: 503, headers: JSON_HEADERS });
  }
  try {
    const day = todayInChina();
    const [todayPv, totalPv, todayUv, totalUv] = await Promise.all([
      env.STATS_DB.prepare("SELECT COUNT(*) AS count FROM page_views WHERE day = ?").bind(day).first(),
      env.STATS_DB.prepare("SELECT COUNT(*) AS count FROM page_views").first(),
      env.STATS_DB.prepare("SELECT COUNT(*) AS count FROM daily_visitors WHERE day = ?").bind(day).first(),
      env.STATS_DB.prepare("SELECT COUNT(*) AS count FROM unique_visitors").first()
    ]);
    return new Response(JSON.stringify({
      ok: true, timezone: "Asia/Shanghai", todayPv: todayPv.count, totalPv: totalPv.count,
      todayUv: todayUv.count, totalUv: totalUv.count
    }), { headers: JSON_HEADERS });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Unable to read statistics." }), { status: 500, headers: JSON_HEADERS });
  }
}
