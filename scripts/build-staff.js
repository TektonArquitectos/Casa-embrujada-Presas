// Genera staff.html a partir del panel de puntos (src/panel.html) y su conector (src/staff-head.html).
// Uso: node scripts/build-staff.js
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const head = fs.readFileSync(path.join(root, "src", "staff-head.html"), "utf8");
let panel = fs.readFileSync(path.join(root, "src", "panel.html"), "utf8");

// Textos pensados para claude.ai que aquí no aplican.
const cambios = [
  [/abre la página desde claude\.ai con tu sesión iniciada\./g, "revisa tu conexión a internet."],
  [/else if\(S\.status==="offline"\)banner=`[^`]*`;/, 'else if(S.status==="offline")banner=`<div class="banner"><b>No se pudo conectar con la base de datos.</b> Revisa tu internet y recarga la página.</div>`;'],
  [/Pide al dueño que te comparta como Colaborador\./g, "Vuelve a entrar con el PIN del staff."],
  [/Necesitas acceso de Colaborador para importar\./g, "No hay conexión con la base de datos."],
  [/<title>[^<]*<\/title>/, "<title>Panel del staff · Casa Embrujada</title>"],
];
for (const [de, a] of cambios) {
  if (!de.test(panel)) throw new Error("No se encontró en el panel: " + de);
  de.lastIndex = 0;
  panel = panel.replace(de, a);
}

fs.writeFileSync(path.join(root, "staff.html"), head + panel + "\n</body>\n</html>\n");
console.log("staff.html generado");
