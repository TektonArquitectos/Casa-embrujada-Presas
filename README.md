# Landing · Casa Embrujada

Landing estática para la campaña de Halloween de Tekton Arquitectos, Bacru Inmobiliaria y Papelería Eupalinos en Presas, Tezontepec de Aldama.

- `index.html`: botones para seguir a las 3 marcas en Instagram o Facebook (detecta la app desde donde se abre; también acepta `?p=ig` o `?p=fb`).
- `bases.html` → `/bases`: bases del sorteo.
- `privacidad.html` → `/privacidad`: aviso de privacidad (URL para el formulario instantáneo de Meta).
- `docs/GUIA-META-ADS.md`: cómo armar la campaña y el formulario en Meta (no se publica).

Para cambiar cuentas o enlaces, edita el arreglo `BRANDS` en `index.html`.

## Publicar

```bash
vercel --prod
```
