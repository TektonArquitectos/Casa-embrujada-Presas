// Registro público desde la landing. Crea o actualiza al participante por su teléfono.
const { cmd, getDoc, setDoc } = require("./_redis");

const MAX_POR_HORA = 30;
const clean = (s, n) => String(s || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, n);

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).end();

  const b = req.body || {};
  const tel = String(b.telefono || "").replace(/\D/g, "").slice(-10);
  const nombre = clean(b.nombre, 80);
  const usuario = clean(b.usuario, 80);
  const plataforma = b.plataforma === "facebook" ? "facebook" : "instagram";
  const siguio = b.siguio === true;
  if (tel.length !== 10 || nombre.length < 2) return res.status(400).json({ error: "Datos incompletos" });

  try {
    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "sin-ip";
    const rl = `ce:rl:${ip}`;
    const n = await cmd("INCR", rl);
    if (n === 1) await cmd("EXPIRE", rl, 3600);
    if (n > MAX_POR_HORA) return res.status(429).json({ error: "Demasiados intentos" });

    const ahora = new Date().toISOString();
    const cur = await getDoc("participantes", tel);
    if (cur) {
      const s = cur.sigue || {};
      const doc = {
        ...cur,
        sigue: {
          todas: !!s.todas || siguio,
          plataforma: s.todas && s.plataforma ? s.plataforma : plataforma,
          usuario: s.usuario || usuario,
        },
        actualizado: ahora,
      };
      if (!cur.nombre || cur.nombre === "Sin nombre") doc.nombre = nombre;
      await setDoc("participantes", tel, doc);
      return res.json({ ok: true, nuevo: false });
    }

    await setDoc("participantes", tel, {
      nombre, telefono: tel, tipo: "adulto", tutor: "", contacto: true, interes: "", origen: "landing",
      sigue: { todas: siguio, plataforma, usuario },
      fotos: { d30: false, d31: false, d01: false }, referidos: [], creado: ahora,
    });
    return res.json({ ok: true, nuevo: true });
  } catch (e) {
    return res.status(500).json({ error: "No se pudo guardar" });
  }
};
