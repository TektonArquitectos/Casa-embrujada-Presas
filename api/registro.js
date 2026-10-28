// Registro público desde la landing. Crea o actualiza al participante por su teléfono.
const { cmd, getDoc, setDoc } = require("./_redis");

// Cada persona guarda hasta 5 veces (registro, 3 marcas y grupo) y muchos celulares comparten IP de la compañía.
const MAX_POR_HORA = 150;
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
  // Cuántas de las 3 marcas dice seguir y si tocó el grupo de WhatsApp (cada una suma un boleto).
  const marcas = Math.max(0, Math.min(3, parseInt(b.marcas, 10) || (siguio ? 3 : 0)));
  const grupo = b.grupo === true;
  // Quien llega del formulario de Meta ya dio su nombre allá: solo confirma el WhatsApp y el nombre llega con el CSV.
  const meta = b.origen === "meta";
  if (tel.length !== 10 || (nombre.length < 2 && !meta)) return res.status(400).json({ error: "Datos incompletos" });

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
      // Nunca se bajan: si ya tenía más marcas o el grupo, se conservan.
      const m = Math.max(s.marcas || (s.todas ? 3 : 0), marcas);
      const doc = {
        ...cur,
        sigue: {
          todas: !!s.todas || m === 3,
          marcas: m,
          plataforma: s.todas && s.plataforma ? s.plataforma : plataforma,
          usuario: s.usuario || usuario,
        },
        grupo: !!cur.grupo || grupo,
        actualizado: ahora,
      };
      if ((!cur.nombre || cur.nombre === "Sin nombre") && nombre.length >= 2) doc.nombre = nombre;
      await setDoc("participantes", tel, doc);
      return res.json({ ok: true, nuevo: false });
    }

    await setDoc("participantes", tel, {
      nombre: nombre.length >= 2 ? nombre : "Sin nombre", telefono: tel, tipo: "adulto", tutor: "", contacto: true, interes: "",
      origen: meta ? "meta" : "landing",
      sigue: { todas: marcas === 3, marcas, plataforma, usuario }, grupo,
      fotos: { d30: false, d31: false, d01: false }, referidos: [], creado: ahora,
    });
    return res.json({ ok: true, nuevo: true });
  } catch (e) {
    return res.status(500).json({ error: "No se pudo guardar" });
  }
};
