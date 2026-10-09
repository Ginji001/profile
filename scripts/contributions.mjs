// GitHubの公開プロフィールから草（直近1年）を取得して contributions.json を作る（トークン不要）
import { writeFileSync } from "node:fs";
const user = process.env.GH_USER || "Ginji001";
const out = process.argv[2] || "contributions.json";
const res = await fetch(`https://github.com/users/${user}/contributions`, { headers: { "User-Agent": "profile-page" } });
if (!res.ok) throw new Error(`取得できませんでした: ${res.status}`);
const html = await res.text();
const days = [...html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g)].map((m) => [m[1], m[2]]).sort((a, b) => (a[0] < b[0] ? -1 : 1));
if (days.length < 300) throw new Error(`日数が少なすぎます: ${days.length}`);
const t = html.match(/([\d,]+)\s+contributions?\s+in the last year/);
const total = t ? Number(t[1].replace(/,/g, "")) : null;
writeFileSync(out, JSON.stringify({ user, total, from: days[0][0], to: days.at(-1)[0], updated: new Date().toISOString(), levels: days.map((d) => d[1]).join("") }));
console.log(`OK ${days.length}日 / 合計 ${total}`);
