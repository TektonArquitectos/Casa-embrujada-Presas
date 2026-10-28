// Contador de pasos de la landing (embudo). Solo guarda cuántas personas llegan a cada paso por día,
// sin datos personales. POST registra un paso; GET devuelve los totales de los últimos días.
const { cmd } = require("./_redis");

const PASOS = ["visita", "meta", "empieza", "registro", "sigue1", "sigue2", "sigue3", "grupo", "gracias", "play"];
const MAX_POR_HORA = 200;

// Día en hora del centro de México (UTC-6, sin horario de verano).
const dia = (t = Date.now()) => new Date(t - 6 * 3600e3).toISOString().slice(0, 10);

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      const dias = {};
      for (let i = 0; i < 7; i++) {
        const d = dia(Date.now() - i * 864e5);
        const arr = (await cmd("HGETALL", `ce:embudo:${d}`)) || [];
        if (!arr.length) continue;
        const o = {};
        for (let j = 0; j < arr.length; j += 2) o[arr[j]] = Number(arr[j + 1]);
        dias[d] = o;
      }
      return res.json({ pasos: PASOS, dias });
    }
    if (req.method !== "POST") return res.status(405).end();

    const b = req.body || {};
    const paso = String(b.paso || "");
    const sesion = String(b.sesion || "");
    if (!PASOS.includes(paso) || !/^[a-z0-9]{8,32}$/.test(sesion)) return res.status(400).json({ error: "Datos inválidos" });

    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "sin-ip";
    const rl = `ce:rl:ev:${ip}`;
    const n = await cmd("INCR", rl);
    if (n === 1) await cmd("EXPIRE", rl, 3600);
    if (n > MAX_POR_HORA) return res.status(429).json({ error: "Demasiados eventos" });

    // Cada sesión cuenta una sola vez por paso.
    const nuevo = await cmd("SET", `ce:ev:${sesion}:${paso}`, "1", "NX", "EX", 3 * 86400);
    if (nuevo) await cmd("HINCRBY", `ce:embudo:${dia()}`, paso, 1);
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "No se pudo guardar" });
  }
};
