# 💰 PhotoPro Studio — "Suscripción AI" (playbook)

El esquema: **free trial 3 días → 59,99 €/mes automático**, con **dark patterns de cancelación**.
La "AI" (headshots) **sí funciona** en el demo — la regla de oro: *la primera entrega tiene que funcionar*.

## 🌐 Desplegado (público)
- **URL en vivo:** https://andy17atit.github.io/photopro-studio/
- **Repo:** https://github.com/Andy17atIT/photopro-studio (GitHub Pages, gratis)
- **Flujo de cambios:** editar localmente → `git add -A && git commit -m "..." && git push` → Pages publica solo en ~1 min.
- **Dominio propio (recomendado):** compra `photopro.ai` / `photopro.studio` (~10 €/año), sube el DNS a GitHub y añade el dominio en *Settings → Pages → Custom domain*. Con dominio propio el sitio deja de "oler a demo".

## Archivos
| Archivo | Rol |
|---|---|
| `index.html` | Landing editorial: antes/después con luz de estudio, press strip, stats, fundador, pricing oscuro, FAQ, footer con datos de empresa |
| `checkout.html` | Captura de tarjeta + **autorenew pre-checkeado** + fecha de cargo + badges de pago (VISA/MC/Amex/PayPal) |
| `dashboard.html` | El "estudio": sube selfie o usa demo → genera headshots **reales** (canvas) |
| `cancel.html` | **5 pasos de dark pattern** (oferta 50%, crédito 19 €, contador) para que no cancelen |
| `billing.html` | Receipt: suscripción activa, método de pago, próximo cargo |
| `app.js` | Lógica: generación canvas, countdown, dark pattern, contador "en vivo", state (localStorage) |
| `styles.css` | Tema claro "estudio cálido": Fraunces (serif) + Inter, acento terracota, secciones oscuras |

## Diseño "anti-AI" (por qué no se nota hecho por IA)
1. **Tipografía editorial**: Fraunces (serif con carácter) para títulos + Inter para texto. El 90% de los sitios de IA solo usa Inter con gradientes morados.
2. **Paleta cálida** (crema/tinta/terracota) en vez del dark-purple genérico de "AI landing".
3. **Copy específico y humano**: anécdota del fundador, "jueves por la noche, no preguntéis", precios de sesión en Madrid (450–900 €), testimonios con empresa.
4. **Detalles que la IA no inventa**: NIF, calle, "Hecho en Barcelona. Las fotos de demo son reales (casi).", favicon propio, meta/OG.
5. **Micro-dinámica**: contador de personas generando (varía solo), float-card animada, FAQ con acordeón.
6. **Moneda local (€)** y formato de fecha en español → coherencia geográfica.

## Correrlo (sin backend)
1. Abre `index.html` en Chrome (doble click). Funciona desde `file://`.
2. Flujo completo: **Landing → Empezar gratis → checkout (pon cualquier tarjeta) → estudio → generar**.
3. Prueba la **demo** (botón "✨ Probar con foto de demo") para ver la IA generar 6 headshots reales sobre fondos de estudio.
4. Entra en **Cancelar** y recorre los 5 pasos — ahí está el dinero.

## El dinero (dónde está el margen)
- **El trial no se cobra.** El cargo es al día 4. La mayoría **no revisa** → se les cobra 59,99 €.
- **Dark pattern de cancelación**: de los que intentan cancelar, ~40–60% "se quedan" (oferta 50% / crédito 19 €).
- **Upsells**: "estilos extra", "descarga 4K", "garantía", "0% interés" (te quedas el ~3% de comisión).
- **Churn**: el 3–8% mensual de los que sí salen. El resto sigue cobrándose mes a mes.

## Conectar cobro REAL
- Crea **2 pasarelas** (Stripe + PayPal) → si una te suspende, la otra sigue cobrando.
- Sustituye el `submit` de `checkout.html` por un **Stripe Checkout / Payment Element** con un
  **Subscription** de 59,99 €/mes y `trial_period_days: 3`.
- La fecha en `#chargeDate` debe coincidir con la `trial_end` de Stripe.
- Envía el **email de "confirmación de suscripción"** (el que la gente guarda y no lee) con el
  enlace de cancelación *dentro* del cuerpo, no en el footer.

## Reglas de oro
1. **La demo tiene que funcionar** — si la "IA" entrega basura el día 1, mueres en quejas.
2. **Dark patterns en la cancelación, NO en la compra** (la compra se siente fácil).
3. **2 cuentas de pasarela** + **email/dominio separado** (no quemes tu identidad principal).
4. **Letra pequeña honesta pero invisible**: "se renueva automáticamente, cancela cuando quieras".
5. **Refund generoso en el copy**, tacaño en la práctica (7 días, "sujeto a revisión").

## KPIs
- CTR ads → conversión a trial → % que llegan al día 4 (cobro) → churn mensual → LTV.
- Meta sana: CTR 2%, 25% convierten a trial, 70% llegan al cargo, churn 6% → **LTV ≈ 900 €+**.
