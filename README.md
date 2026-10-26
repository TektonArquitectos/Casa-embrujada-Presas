# Landing · Casa Embrujada

Landing estática para la campaña de Halloween de Tekton Arquitectos, Bacru Inmobiliaria y Papelería Eupalinos en Presas, Tezontepec de Aldama.

- `index.html`: botones para seguir a las 3 marcas en Instagram o Facebook (detecta la app desde donde se abre; también acepta `?p=ig` o `?p=fb`).
- `bases.html` → `/bases`: bases del sorteo.
- `privacidad.html` → `/privacidad`: aviso de privacidad (URL para el formulario instantáneo de Meta).
- `docs/GUIA-META-ADS.md`: cómo armar la campaña y el formulario en Meta (no se publica).

- `staff.html` → `/staff`: panel del staff con PIN (puntos, recomendaciones, importar Meta y sorteo en vivo). Se genera con `node scripts/build-staff.js` a partir de `src/panel.html` y `src/staff-head.html`; no lo edites a mano.
- `api/registro.js`: guarda el registro que hace la landing (público, limitado por IP).
- `api/db.js`: lectura y escritura para el panel; exige el PIN.

Para cambiar cuentas o enlaces, edita el arreglo `BRANDS` en `index.html`.

## Variables de entorno en Vercel

- Base de datos Upstash Redis conectada al proyecto (crea `KV_REST_API_URL` y `KV_REST_API_TOKEN`, o `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`).
- `STAFF_PIN`: PIN para entrar a `/staff`.

## Publicar

```bash
vercel --prod
```
