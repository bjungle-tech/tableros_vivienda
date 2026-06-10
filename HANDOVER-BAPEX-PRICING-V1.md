# HANDOVER · BApex sobre BLeopard UES Vivienda — pricing canónico V1

> **Para:** Próxima sesión del repo `Tableros de control vivienda COMFANDI Fase I`
> **Tipo:** Notificación de canon comercial activo y referencia a docs de pricing
> **Origen:** Sesión Estrategia BJungle · 2026-06-10
> **Estado:** Pricing V1 listo. UES Vivienda COMFANDI es el caso de referencia para BApex sobre BLeopard.

---

## ⚠️ POLÍTICA DE PRICING — LEER PRIMERO

**TODA decisión de pricing de cualquier componente BJungle se toma EXCLUSIVAMENTE en la sesión Estrategia BJungle.**

Este repo (Vivienda COMFANDI) **no toma decisiones de pricing por su cuenta**. Si emerge una situación que requiere modificar pricing, descontar, hacer outcome-based, o cualquier variante: **traer a sesión Estrategia BJungle**.

Pricing canónico para BApex sobre BLeopard caso UES Vivienda: `PRICING-BAPEX-BLEOPARD-V1.md` en el repo `Estrategia BJungle` (alias `bjungle-estrategia` en GitHub).

---

## 1. Resumen del canon de pricing (caso UES Vivienda)

**Setup one-time (3 módulos co-activados, descuento 25%):** $30,000 USD

**MMF mensual (3 módulos):** ~$22,700 USD / mes
- Sales: $2,500/mes + 200 deals incluidos
- Lab: $1,800/usr × 5 usuarios = $9,000/mes
- Coach: $2,800/usr × 4 usuarios = $11,200/mes (con 25 outputs/usr incluidos)

**Variable sobre MMF:**
- Sales: $25 USD/deal cerrado sobre 200 (o 0.1% del valor — cliente elige)
- Coach: $45 USD/output excedente sobre 25/usr/mes
- Lab: sin variable

**Outcome-based opcional (solo Coach):** 12% del lift anual de UAR atribuido a BApex, con cap 25% del MMF anual de Coach.

**Total año 1 estimado:** $314K – $372K USD (10-12% del IT budget asumido $3M/año tier 1).

Para detalle completo, escenarios alternativos (tier 2, tier 3), benchmarks de mercado y palancas de negociación: leer `PRICING-BAPEX-BLEOPARD-V1.md` en el repo Estrategia BJungle.

---

## 2. Arquitectura BApex aclarada (canon 2026-06-09)

BApex es **modular, horizontal, con 3 módulos independientes**:

- **BApex Sales** — foco deal/cliente/LTV (día cero, sin histórico)
- **BApex Operativa Lab** — laboratorio de 6 arquetipos estratégicos (≥6 meses datalake)
- **BApex Operativa Coach** — coach gerencial 5 capacidades (≥6 meses datalake)

**Sobre BLeopard UES Vivienda:** los 6 arquetipos de Lab están instanciados a la operación de housing (Policy Lab sobre subsidio/LTV/score, Vintage Quality sobre cohortes hipotecarias, Decision Audit, Capacity Planning, Cross-sell, Geo & Network).

---

## 3. Datos del proyecto Vivienda que alimentaron la calibración del pricing

Volúmenes asumidos en V1 (validar con UES si activamos comercialmente):

| Variable | Valor V1 |
|---|---|
| Deals cerrados (créditos colocados) | 80-150 / mes |
| Ticket promedio | $25K-$60K USD |
| Asesores comerciales activos | 30-50 |
| Jefes de producto + analistas senior | 5 |
| Gerente UES + jefes de producto (para Coach) | 4 |

**Si el cliente real muestra valores significativamente distintos** (ej: 30 deals/mes o 100 asesores), **traer a sesión Estrategia BJungle para recalibrar pricing antes de cotizar**. No ajustar números por cuenta propia.

---

## 4. Lo que esta sesión Vivienda puede / no puede hacer

### Puede

- Seguir mejorando los tableros del proyecto (Visión Ejecutiva, Funnel, Operación, Riesgo, Ciclo de Vida, Metas) — el código y la analítica son válidos
- Documentar mejores datos reales de UES Vivienda que sirvan para recalibrar volúmenes en V2 del pricing
- Preparar materiales de presentación al cliente con el framing nuevo (BApex Lab + Coach en lugar de BWolf N2 + N3)

### No puede

- Cotizar BApex sin pasar por canon Estrategia BJungle
- Negociar pricing de viva voz con cliente sin alineación previa
- Usar naming deprecado: "BApex Comercial / Operativa Pro / Operativa Advance" — hoy es **Sales / Lab / Coach**

---

## 5. Memoria viva de referencia (sesión Estrategia BJungle)

- `project_bapex_arquitectura.md` — canon BApex modular Sales/Lab/Coach
- `project_bapex_bfalcon_model.md` — taxonomía actualizada
- `feedback_ip_protection_web.md` — política editorial pública vs Workshop
- **`PRICING-BAPEX-BLEOPARD-V1.md`** (repo `bjungle-estrategia`) — **pricing canónico V1, este caso es la referencia**
