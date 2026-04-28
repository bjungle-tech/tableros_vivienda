# Tableros de control · Fábrica Digital de Vivienda · COMFANDI

Suite ejecutiva de tableros de control para la UES Vivienda de COMFANDI, soportada sobre la Fábrica Digital de Vivienda (framework SaaS de BJungle).

> ⚠️ **Datos ilustrativos.** Los volúmenes, tasas, comisiones y cifras de LTV mostradas son simuladas y representan la estructura propuesta del modelo. Pendientes de validación con la UES Vivienda (P&L de la unidad, tarifas reales de gestión, % de comisiones por aliado y estructura del crédito).

## Stack

- React 18 + Vite 6
- Tailwind CSS 3
- Recharts (gráficos)
- Lucide React (iconografía)

## Arranque local

```bash
npm install
npm run dev
```

Abre http://localhost:5173.

## Build de producción

```bash
npm run build
npm run preview
```

## Tableros incluidos

1. **Visión Ejecutiva** — KPIs estratégicos UES con desglose por producto y municipio.
2. **Funnel Comercial** — Conversión por las 11 etapas reales del proceso.
3. **Operación & SLA** — Las 3 integraciones (Core Validador de derechos, RPA validación de subsidio Min. Vivienda, Firma electrónica), SLAs y productividad por gestor.
4. **Riesgo & Deserción** — Causales de rechazo del aliado financiero, deserciones y % de aprobación de crédito.
5. **Ciclo de Vida** — Habilitar → Adquirir → Conservar y LTV por hogar habilitado.
6. **Configuración de metas** — Metas mensuales (KPI estratégicos y SLA por etapa) con histórico por periodo.

## Productos del catálogo UES Vivienda

| Producto | Tipo |
|---|---|
| Adquiere tu vivienda | Compuesto (Subsidio + Crédito Hipotecario + Proyecto inmobiliario aliado) |
| Transforma tu hogar | Compuesto (Subsidio + Crédito Acondicionamiento + Aliado en remodelación) |
| Crédito Hipotecario | Simple |
| Crédito Acondicionamiento | Simple |
| Subsidio | Simple |

## Integraciones del proceso

1. **Core - Validador de derechos** — Verifica afiliación vigente y derechos COMFANDI.
2. **RPA - Validación de subsidio (Min. Vivienda)** — Consulta la página de subsidios del Ministerio de Vivienda. Devuelve: Viable / No viable / Sancionado.
3. **Firma electrónica** — Firma de documentos en la etapa de formalización.

---

© 2026 BJungle SAS · Powered by [BJungle](https://www.bjungle.net)
