// Acceso a Upstash Redis por su API REST (sin dependencias).
// Cada colección es un hash "ce:<colección>" y cada documento un campo JSON dentro de él.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function cmd(...args) {
  if (!URL_ || !TOKEN) throw new Error("La base de datos no está configurada");
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

const KEY = (col) => `ce:${col}`;

async function getDoc(col, id) {
  const v = await cmd("HGET", KEY(col), id);
  return v ? JSON.parse(v) : null;
}

async function setDoc(col, id, data) {
  await cmd("HSET", KEY(col), id, JSON.stringify(data));
}

async function delDoc(col, id) {
  await cmd("HDEL", KEY(col), id);
}

async function listCol(col) {
  const arr = (await cmd("HGETALL", KEY(col))) || [];
  const out = [];
  for (let i = 0; i < arr.length; i += 2) out.push({ id: arr[i], data: JSON.parse(arr[i + 1]) });
  return out;
}

// Mezcla objetos anidados; los arreglos y valores simples se reemplazan completos.
function merge(a, b) {
  if (!a || typeof a !== "object" || Array.isArray(a)) return b;
  const o = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const both = v && typeof v === "object" && !Array.isArray(v) && o[k] && typeof o[k] === "object" && !Array.isArray(o[k]);
    o[k] = both ? merge(o[k], v) : v;
  }
  return o;
}

module.exports = { cmd, getDoc, setDoc, delDoc, listCol, merge };
