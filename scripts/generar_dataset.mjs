// Generador de dataset simulado para el prototipo de Tableros de Vivienda COMFANDI.
// Salida: /public/data/solicitudes_2026.txt (CSV con header).
// ~30,000 registros: 12 meses × ~2,500 solicitudes/mes.
// Cada solicitud entró al pipeline pasando por Prospección y luego se distribuye por todas las etapas.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'public', 'data', 'solicitudes_2026.txt');
mkdirSync(dirname(out), { recursive: true });

// === CATÁLOGOS ===
const productos = [
  { id: 'subsidio', nombre: 'Subsidio', peso: 28 },
  { id: 'hipotecario', nombre: 'Crédito Hipotecario', peso: 25 },
  { id: 'adquiere', nombre: 'Adquiere tu vivienda', peso: 21 },
  { id: 'acondicionamiento', nombre: 'Crédito Acondicionamiento', peso: 15 },
  { id: 'transforma', nombre: 'Transforma tu hogar', peso: 11 },
];

const municipios = [
  { nombre: 'Cali', peso: 60 },
  { nombre: 'Yumbo', peso: 12 },
  { nombre: 'Palmira', peso: 11 },
  { nombre: 'Buga', peso: 7 },
  { nombre: 'Jamundí', peso: 5 },
  { nombre: 'Tuluá', peso: 3 },
  { nombre: 'Cartago', peso: 2 },
];

const canales = [
  { nombre: 'Masivo', peso: 65 },
  { nombre: 'Manual', peso: 35 },
];

const gestores = [
  'María Rodríguez Vargas',
  'Carlos Martínez Ospina',
  'Ana Lucía Tenorio Caicedo',
  'Jorge Patiño Ríos',
  'Sofía Delgado Bolaños',
  'Luis Toro Aristizábal',
  'Juliana Flórez Ramírez',
  'Andrés Quintero Escobar',
  'Daniela Mejía Cárdenas',
  'Mauricio Ruiz Ospina',
];

// Etapa actual y su distribución probabilística
const etapas = [
  { etapa: 'Prospección', peso: 18, estado: 'Activo' },
  { etapa: 'Cotización', peso: 14, estado: 'Activo' },
  { etapa: 'Simulador plan de pagos', peso: 10, estado: 'Activo' },
  { etapa: 'Cierre financiero', peso: 9, estado: 'Activo' },
  { etapa: 'Vinculación fiducia', peso: 6, estado: 'Activo' },
  { etapa: 'Formalización (Firma)', peso: 5, estado: 'Activo' },
  { etapa: 'Finalización', peso: 12, estado: 'Cerrado_exitoso' },
  { etapa: 'Cierre de Brechas', peso: 4, estado: 'En_brechas' },
  { etapa: 'Desistido', peso: 14, estado: 'Cerrado_desistido' },
  { etapa: 'No viable RPA', peso: 5, estado: 'Cerrado_no_viable' },
  { etapa: 'Validador rechazó', peso: 2.5, estado: 'Cerrado_no_viable' },
  { etapa: 'Sancionado', peso: 0.5, estado: 'Sancionado' },
];

// Volumen por mes (con variación natural; total ≈ 30,000)
const volumenMes = {
  1: 2400, 2: 2520, 3: 2580, 4: 2650, 5: 2510, 6: 2640,
  7: 2420, 8: 2490, 9: 2580, 10: 2560, 11: 2470, 12: 2180,
};

// Metas SLA por etapa (días) — usadas como referencia para generar tiempos reales
const slaMeta = {
  validador: { meta: 1, real: 1.2 },
  contacto: { meta: 3, real: 2.8 },
  prospeccion: { meta: 4, real: 4.1 },
  cotizacion: { meta: 5, real: 5.4 },
  cierre: { meta: 10, real: 12.5 },
  formalizacion: { meta: 12, real: 14.8 },
};

// === HELPERS ===
function pickWeighted(items) {
  const total = items.reduce((s, i) => s + i.peso, 0);
  let r = Math.random() * total;
  for (const i of items) {
    if ((r -= i.peso) <= 0) return i;
  }
  return items[items.length - 1];
}

function gauss(mu, sigma) {
  // Box-Muller
  const u = 1 - Math.random();
  const v = Math.random();
  return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function diasEtapa(etapaKey) {
  const cfg = slaMeta[etapaKey];
  // Distribución log-normalish para que algunos casos rompan el SLA
  const base = Math.max(0.1, gauss(cfg.real, cfg.real * 0.35));
  return Math.round(base * 10) / 10;
}

function fechaAleatoriaEnMes(anio, mes) {
  // mes 1-12. Día aleatorio entre 1 y último día del mes.
  const ult = new Date(anio, mes, 0).getDate();
  const dia = Math.floor(Math.random() * ult) + 1;
  return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

// Etapa orden lógico (para saber hasta dónde llegó)
const ordenEtapas = [
  'Solicitud creada',
  'Validador derechos',
  'Contacto exitoso',
  'Prospección',
  'Cotización',
  'Simulador plan de pagos',
  'Cierre financiero',
  'Vinculación fiducia',
  'Formalización (Firma)',
  'Finalización',
];

function pasoPor(etapaActual, etapaConsulta) {
  // ¿La solicitud pasó por etapaConsulta?
  // Casos de cierre temprano:
  if (etapaActual === 'Validador rechazó') {
    return etapaConsulta === 'Solicitud creada' || etapaConsulta === 'Validador derechos';
  }
  if (etapaActual === 'No viable RPA' || etapaActual === 'Sancionado') {
    return ordenEtapas.indexOf(etapaConsulta) <= ordenEtapas.indexOf('Validador derechos');
  }
  if (etapaActual === 'Desistido') {
    // Se desistió en alguna etapa intermedia (Contacto, Prospección, Cotización o Cierre financiero)
    const etapaSalida = ['Contacto exitoso', 'Prospección', 'Cotización', 'Cierre financiero'][Math.floor(Math.random() * 4)];
    return ordenEtapas.indexOf(etapaConsulta) <= ordenEtapas.indexOf(etapaSalida);
  }
  if (etapaActual === 'Cierre de Brechas') {
    // Cierre de Brechas: pasó por Cierre financiero pero no superó las condiciones comerciales
    return ordenEtapas.indexOf(etapaConsulta) <= ordenEtapas.indexOf('Cierre financiero');
  }
  // Caso normal: pasó por todas las etapas hasta la actual (o anterior)
  const idxActual = ordenEtapas.indexOf(etapaActual);
  const idxConsulta = ordenEtapas.indexOf(etapaConsulta);
  if (idxActual === -1) return false;
  return idxConsulta <= idxActual;
}

// === GENERACIÓN ===
const filas = [];
let counter = 1000000;

for (let mes = 1; mes <= 12; mes++) {
  const cantidad = volumenMes[mes];
  for (let i = 0; i < cantidad; i++) {
    const id = `SOL-2026-${counter++}`;
    const fecha = fechaAleatoriaEnMes(2026, mes);
    const producto = pickWeighted(productos);
    const municipio = pickWeighted(municipios);
    const canal = pickWeighted(canales);
    const gestor = gestores[Math.floor(Math.random() * gestores.length)];
    const etapa = pickWeighted(etapas);

    // Tiempos por etapa (vacíos si no llegó)
    const t_val = pasoPor(etapa.etapa, 'Validador derechos') ? diasEtapa('validador') : '';
    const t_con = pasoPor(etapa.etapa, 'Contacto exitoso') ? diasEtapa('contacto') : '';
    const t_pro = pasoPor(etapa.etapa, 'Prospección') ? diasEtapa('prospeccion') : '';
    const t_cot = pasoPor(etapa.etapa, 'Cotización') ? diasEtapa('cotizacion') : '';
    const t_cie = pasoPor(etapa.etapa, 'Cierre financiero') ? diasEtapa('cierre') : '';
    const t_for = pasoPor(etapa.etapa, 'Formalización (Firma)') ? diasEtapa('formalizacion') : '';

    // TMO acumulado: suma de los días en las etapas por las que pasó
    const tmo = [t_val, t_con, t_pro, t_cot, t_cie, t_for]
      .filter(x => x !== '')
      .reduce((s, x) => s + x, 0);

    filas.push([
      id, fecha, mes, 2026, producto.id, producto.nombre, municipio.nombre, canal.nombre, gestor,
      etapa.etapa, etapa.estado,
      t_val, t_con, t_pro, t_cot, t_cie, t_for,
      Math.round(tmo * 10) / 10,
    ].join(','));
  }
}

const header = [
  'id_solicitud', 'fecha_creacion', 'mes', 'anio',
  'producto_id', 'producto', 'municipio', 'canal', 'gestor',
  'etapa_actual', 'estado',
  'sla_validador', 'sla_contacto', 'sla_prospeccion', 'sla_cotizacion', 'sla_cierre', 'sla_formalizacion',
  'tmo_total',
].join(',');

writeFileSync(out, header + '\n' + filas.join('\n'));

console.log(`✓ Dataset generado: ${out}`);
console.log(`  Total registros: ${filas.length.toLocaleString()}`);
console.log(`  Tamaño aprox: ${(Buffer.byteLength(filas.join('\n')) / 1024).toFixed(1)} KB`);
