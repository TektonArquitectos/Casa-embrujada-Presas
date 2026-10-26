# Guía: campaña de Meta Ads para el sorteo de la Casa Embrujada

Flujo completo:

1. La persona ve el anuncio en Facebook o Instagram y toca **Participar**.
2. Se abre el **formulario instantáneo** de Meta. El nombre y el teléfono ya vienen llenos; contesta 2 preguntas y toca **Enviar**.
3. En la pantalla final toca **Seguir a las 3 marcas** y se abre la landing (`https://casa-embrujada-presas.vercel.app`).
4. En la landing toca **Seguir** en Tekton, Bacru y Eupalinos. La plataforma (Instagram o Facebook) se detecta sola.
5. Cada día o al final, descarga los registros de Meta en CSV y súbelos a la página de puntos (pestaña Ajustes → Importar registros del formulario de Meta).

> Meta no permite comprobar automáticamente quién sigue una cuenta. El punto se suma al registrarse y se verifica **solo al ganador** antes de anunciarlo (la página de puntos tiene ese paso).

## 1. Antes de empezar

- Las 3 cuentas deben estar conectadas a un portafolio comercial (Business Manager), o al menos la página desde la que se anuncia (sugerido: **Tekton Arquitectos**, porque ahí está el objetivo de prospectos).
- Instagram de la marca anunciante vinculado a su página de Facebook.
- La landing ya publicada en Vercel (necesitas su URL para el formulario).

## 2. Campaña

| Ajuste | Valor sugerido |
| --- | --- |
| Objetivo | **Clientes potenciales** |
| Ubicación de la conversión | **Formularios instantáneos** |
| Categoría especial | Ninguna |
| Presupuesto | Diario, del 26 oct al 1 nov a las 9 pm (por ejemplo $100–150 MXN/día) |
| Ubicación geográfica | Tezontepec de Aldama, Hgo. + 10–15 km (incluye Presas, Mixquiahuala, Tlahuelilpan, Tlaxcoapan) |
| Edad | 25–55 (papás y mamás; los menores no pueden registrarse en Meta) |
| Ubicaciones | Advantage+ (Facebook, Instagram, historias y reels) |

## 3. Formulario instantáneo

**Tipo:** Más volumen.

**Introducción**
- Título: `¡Gana una Amazon Alexa en la Casa Embrujada!`
- Descripción: `Regístrate, sigue a Tekton, Bacru y Eupalinos y ya tienes tu boleto. Ven el 30, 31 de oct y 1 de nov (6–9 pm) a Av. Juárez, Presas, por dulces, palomitas y más boletos.`

**Preguntas**
1. Nombre completo (precargado)
2. Número de teléfono (precargado). Pide que sea su WhatsApp.
3. Pregunta personalizada, respuesta corta: `¿Cuál es tu usuario de Instagram o tu nombre en Facebook?`
4. Pregunta personalizada, opción múltiple: `¿Te interesa algo de esto?`
   - `Construir o remodelar (Tekton)`
   - `Vender o comprar casa o terreno (Bacru)`
   - `Por ahora no`

**Política de privacidad**
- Texto del enlace: `Aviso de privacidad`
- URL: `https://casa-embrujada-presas.vercel.app/privacidad`

**Pantalla de finalización**
- Título: `¡Último paso!`
- Descripción: `Sigue a Tekton, Bacru y Eupalinos en Instagram o Facebook para activar tu boleto.`
- Botón: **Visitar sitio web**, texto `Seguir a las 3 marcas`, URL `https://casa-embrujada-presas.vercel.app`

> No cambies el texto de las preguntas 3 y 4: la página de puntos reconoce las columnas por palabras como "usuario" e "interesa".

## 4. Anuncio

- Formato: imagen o video vertical (puedes reusar el volante o el video "Invitación oficial").
- Texto principal: `🎃 ¡Halloween llega a Presas! Regístrate, sigue a Tekton, Bacru y Papelería Eupalinos y participa por una Amazon Alexa. Ven a la Casa Embrujada el 30, 31 de oct y 1 de nov de 6 a 9 pm por dulces y palomitas gratis. Sorteo: 2 de noviembre, 5 pm.`
- Título: `Gana una Amazon Alexa`
- Botón: **Registrarte**
- En las bases o el texto incluye: `Promoción no patrocinada ni administrada por Meta. Bases en casa-embrujada-presas.vercel.app/bases`

## 5. Descargar los registros

En Meta Business Suite ve a **Todas las herramientas → Centro de clientes potenciales** (o en el Administrador de anuncios: el formulario → **Descargar** → CSV). Sube el archivo a la página de puntos en **Ajustes → Importar registros del formulario de Meta**. Puedes subirlo las veces que quieras: los teléfonos repetidos no se duplican.

## 6. Opcional: medir clics en la landing

Si quieres ver en Meta cuántas personas tocaron cada botón de "Seguir", agrega tu **Píxel de Meta** al `<head>` de `index.html`. La landing ya envía los eventos `SeguirMarca` y `SiguioLas3` cuando el píxel existe.
