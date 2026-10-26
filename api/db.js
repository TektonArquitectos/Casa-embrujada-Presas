// Lectura y escritura de documentos para el panel del staff. Requiere el PIN (variable STAFF_PIN).
const crypto = require("crypto");
const { getDoc, setDoc, delDoc, listCol, merge } = require("./_redis");

const COL = /^[a-z]{1,30}$/;
const ID = /^[A-Za-z0-9_-]{1,64}$/;

function pinValido(p) {
  const s = process.env.STAFF_PIN || "";
  if (!s || !p) return false;
  const a = Buffer.from(String(p)), b = Buffer.from(s);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function separar(path) {
  const [c, i, ...resto] = String(path || "").split("/");
  if (resto.length || !COL.test(c || "") || !ID.test(i || "")) return null;
  return [c, i];
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!pinValido(req.headers["x-pin"])) return res.status(401).json({ error: "PIN incorrecto" });
  try {
    if (req.method === "GET") {
      if (req.query.col) {
        if (!COL.test(req.query.col)) return res.status(400).json({ error: "Colección inválida" });
        return res.json({ docs: await listCol(req.query.col) });
      }
      const p = separar(req.query.doc);
      if (!p) return res.status(400).json({ error: "Documento inválido" });
      const d = await getDoc(...p);
      return res.json({ exists: !!d, data: d });
    }
    if (req.method === "POST") {
      const { op, path, data } = req.body || {};
      const p = separar(path);
      if (!p) return res.status(400).json({ error: "Documento inválido" });
      if (op === "delete") { await delDoc(...p); return res.json({ ok: true }); }
      if (!data || typeof data !== "object" || Array.isArray(data)) return res.status(400).json({ error: "Datos inválidos" });
      if (JSON.stringify(data).length > 100000) return res.status(413).json({ error: "Documento demasiado grande" });
      if (op === "set") { await setDoc(...p, data); return res.json({ ok: true }); }
      if (op === "update") {
        const cur = await getDoc(...p);
        if (!cur) return res.status(404).json({ error: "No existe" });
        await setDoc(...p, merge(cur, data));
        return res.json({ ok: true });
      }
      return res.status(400).json({ error: "Operación inválida" });
    }
    return res.status(405).end();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
