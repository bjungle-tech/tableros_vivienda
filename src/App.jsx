import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart,
} from 'recharts';
import {
  Home, Users, TrendingUp, AlertTriangle, Activity, DollarSign, Clock,
  CheckCircle2, XCircle, Filter, Download, Calendar, Building2, FileText,
  Zap, Target, BarChart3, PieChart as PieIcon, Layers, Search, ChevronRight,
  ArrowUpRight, ArrowDownRight, Settings, Bell, Info, Sliders, Save, MapPin,
  Radio, Hand,
} from 'lucide-react';

// ====== PALETA COMFANDI ======
const C = {
  azulPrimario: '#003DA5',
  azulOscuro: '#001F5C',
  azulClaro: '#4A90E2',
  cyan: '#00B5E2',
  verdeLima: '#84BD00',
  verdeOscuro: '#5A8A00',
  blanco: '#FFFFFF',
  gris50: '#F7F9FC',
  gris100: '#EEF2F7',
  gris200: '#D9E0EA',
  gris400: '#8B95A7',
  gris600: '#4A5468',
  gris900: '#1A202C',
  rojo: '#E53E3E',
  ambar: '#F59E0B',
};

// ====== CATÁLOGO DE PRODUCTOS REALES UES VIVIENDA ======
// 3 productos simples + 2 servicios compuestos
const CATALOGO_PRODUCTOS = [
  { id: 'adquiere', nombre: 'Adquiere tu vivienda', tipo: 'Compuesto', componentes: ['Subsidio', 'Crédito Hipotecario', 'Proyecto inmobiliario aliado'], color: C.verdeLima },
  { id: 'transforma', nombre: 'Transforma tu hogar', tipo: 'Compuesto', componentes: ['Subsidio', 'Crédito Acondicionamiento', 'Aliado en remodelación'], color: C.azulOscuro },
  { id: 'hipotecario', nombre: 'Crédito Hipotecario', tipo: 'Simple', componentes: ['Crédito Hipotecario'], color: C.azulPrimario },
  { id: 'acondicionamiento', nombre: 'Crédito Acondicionamiento', tipo: 'Simple', componentes: ['Crédito Acondicionamiento'], color: C.azulClaro },
  { id: 'subsidio', nombre: 'Subsidio', tipo: 'Simple', componentes: ['Subsidio de Vivienda'], color: C.cyan },
];

const MUNICIPIOS = ['Cali', 'Yumbo', 'Palmira', 'Buga', 'Jamundí', 'Tuluá', 'Cartago'];
const CANALES = ['Masivo', 'Manual'];

// ====== DATOS SIMULADOS ======
const kpisGlobales = {
  solicitudesMes: 1847,
  solicitudesDelta: 12.3,
  conversionGlobal: 23.8,
  conversionDelta: 2.1,
  ingresosUES: 4280, // millones COP
  ingresosDelta: 8.7,
  hogaresHabilitados: 387,
  hogaresDelta: 15.2,
  tmoDias: 42,
  tmoDelta: -8.5,
  desercionRate: 18.4,
  desercionDelta: -3.2,
};

// FUNNEL: ETAPAS REALES (Prospección reemplaza Negociación; Sancionados NO es etapa)
const funnelData = [
  { etapa: 'Solicitud creada', valor: 1847, conversion: 100 },
  { etapa: 'Autoriz. tratamiento de datos', valor: 1791, conversion: 96.9 },
  { etapa: 'Validador de derechos (Core)', valor: 1623, conversion: 87.9 },
  { etapa: 'Contacto exitoso', valor: 1402, conversion: 75.9 },
  { etapa: 'Prospección', valor: 1289, conversion: 69.8 },
  { etapa: 'Cotización', valor: 1185, conversion: 64.2 },
  { etapa: 'Simulador plan de pagos', valor: 924, conversion: 50.0 },
  { etapa: 'Cierre financiero', valor: 712, conversion: 38.5 },
  { etapa: 'Vinculación fiducia', valor: 502, conversion: 27.2 },
  { etapa: 'Formalización (Firma)', valor: 441, conversion: 23.9 },
  { etapa: 'Finalización', valor: 387, conversion: 20.9 },
];

const productosData = CATALOGO_PRODUCTOS.map((p, i) => {
  const base = [
    { solicitudes: 389, cerrados: 87, ingresos: 1450 },   // Adquiere
    { solicitudes: 195, cerrados: 60, ingresos: 630 },    // Transforma
    { solicitudes: 462, cerrados: 124, ingresos: 1180 },  // Hipotecario
    { solicitudes: 280, cerrados: 74, ingresos: 640 },    // Acondicionamiento
    { solicitudes: 521, cerrados: 142, ingresos: 380 },   // Subsidio
  ][i];
  return { ...p, producto: p.nombre, ...base };
});

const tendenciaMensual = [
  { mes: 'Ene', solicitudes: 1420, cerrados: 285, ingresos: 3120 },
  { mes: 'Feb', solicitudes: 1550, cerrados: 312, ingresos: 3480 },
  { mes: 'Mar', solicitudes: 1680, cerrados: 340, ingresos: 3720 },
  { mes: 'Abr', solicitudes: 1605, cerrados: 358, ingresos: 3850 },
  { mes: 'May', solicitudes: 1720, cerrados: 372, ingresos: 4010 },
  { mes: 'Jun', solicitudes: 1847, cerrados: 387, ingresos: 4280 },
];

const constructorasTop = [
  { nombre: 'Constructora Bolívar', proyectos: 12, ventas: 89, ingresos: 1240 },
  { nombre: 'Amarilo S.A.', proyectos: 8, ventas: 67, ingresos: 985 },
  { nombre: 'Coninsa Ramón H.', proyectos: 7, ventas: 54, ingresos: 720 },
  { nombre: 'Marval', proyectos: 5, ventas: 41, ingresos: 540 },
  { nombre: 'Conaltura', proyectos: 4, ventas: 32, ingresos: 410 },
  { nombre: 'Otros (18)', proyectos: 23, ventas: 104, ingresos: 1280 },
];

// SLA por etapa: Prospección reemplaza Negociación
const slaData = [
  { etapa: 'Asignación', actual: 0.5, meta: 1, cumplimiento: 100 },
  { etapa: 'Validador derechos', actual: 1.2, meta: 1, cumplimiento: 78 },
  { etapa: 'Contacto', actual: 2.8, meta: 3, cumplimiento: 92 },
  { etapa: 'Prospección', actual: 4.1, meta: 4, cumplimiento: 88 },
  { etapa: 'Cotización', actual: 5.4, meta: 5, cumplimiento: 88 },
  { etapa: 'Cierre financiero', actual: 12.5, meta: 10, cumplimiento: 65 },
  { etapa: 'Formalización (Firma)', actual: 14.8, meta: 12, cumplimiento: 68 },
];

// INTEGRACIONES REALES: solo Core Validador de derechos, RPA, Firma
const integracionesData = [
  {
    proceso: 'Core - Validador de derechos',
    descripcion: 'Verifica afiliación vigente y derechos COMFANDI del solicitante',
    ejecuciones: 1791, exitosos: 1742, fallidos: 49, tiempoProm: 8,
  },
  {
    proceso: 'RPA - Validación de subsidio (Min. Vivienda)',
    descripcion: 'Bot que consulta la página de subsidios del Ministerio de Vivienda y valida la viabilidad del otorgamiento del subsidio al postulante titular. Devuelve: Viable, No viable o Sancionado.',
    ejecuciones: 1623, exitosos: 1587, fallidos: 36, tiempoProm: 14,
  },
  {
    proceso: 'Firma electrónica',
    descripcion: 'Firma de documentos en la etapa de formalización',
    ejecuciones: 441, exitosos: 432, fallidos: 9, tiempoProm: 26,
  },
];

// Distribución de respuestas RPA (Viable / No viable / Sancionado)
// La consulta es contra la página de subsidios del Ministerio de Vivienda.
// Suma = 1587 (exitosas). Las 36 ejecuciones restantes (1623 total) son fallos técnicos del bot.
const rpaRespuestas = [
  {
    tipo: 'Viable',
    cantidad: 1289,
    color: C.verdeLima,
    desc: 'El postulante titular cumple los criterios del Ministerio de Vivienda para acceder al subsidio. El trámite continúa con el monto del subsidio incluido.',
  },
  {
    tipo: 'No viable',
    cantidad: 286,
    color: C.ambar,
    desc: 'El postulante no cumple criterios para el subsidio (ya fue beneficiario, ingresos fuera de rango, núcleo familiar inelegible, etc.). Si el producto es Subsidio, se cierra el caso. En cualquier otro producto, el trámite continúa pero sin el monto del subsidio.',
  },
  {
    tipo: 'Sancionado',
    cantidad: 12,
    color: C.rojo,
    desc: 'El postulante figura como sancionado en el Ministerio de Vivienda (incumplimiento previo, uso indebido, inhabilidad temporal). Si el producto es Subsidio, se cierra el caso. En cualquier otro producto, el trámite continúa pero sin el monto del subsidio.',
  },
];

// Causas de DESERCIÓN (comerciales, no rechazo técnico de Validador / RPA)
const desistimientosCausas = [
  { causa: 'No califica financieramente', cantidad: 142, pct: 38 },
  { causa: 'Cambio de opinión del hogar', cantidad: 89, pct: 24 },
  { causa: 'Encontró otra opción', cantidad: 67, pct: 18 },
  { causa: 'Documentación incompleta', cantidad: 41, pct: 11 },
  { causa: 'Inmueble no disponible', cantidad: 22, pct: 6 },
  { causa: 'Otros', cantidad: 12, pct: 3 },
];

// Causales de rechazo notificadas por el aliado financiero (no son atributos analizados por la UES)
const causalesRechazoAliado = [
  { causal: 'Capacidad de pago insuficiente', cantidad: 87, pct: 38 },
  { causal: 'Endeudamiento elevado', cantidad: 56, pct: 24 },
  { causal: 'Reporte negativo en centrales', cantidad: 41, pct: 18 },
  { causal: 'Estabilidad laboral / ingresos no demostrables', cantidad: 28, pct: 12 },
  { causal: 'Documentación incompleta para evaluación', cantidad: 12, pct: 5 },
  { causal: 'Otros', cantidad: 7, pct: 3 },
];

const gestoresProductividad = [
  { gestor: 'María R.', asignados: 87, cerrados: 24, conversion: 27.6, tmoDias: 38 },
  { gestor: 'Carlos M.', asignados: 92, cerrados: 28, conversion: 30.4, tmoDias: 35 },
  { gestor: 'Ana L.', asignados: 78, cerrados: 19, conversion: 24.4, tmoDias: 44 },
  { gestor: 'Jorge P.', asignados: 95, cerrados: 22, conversion: 23.2, tmoDias: 41 },
  { gestor: 'Sofía D.', asignados: 81, cerrados: 26, conversion: 32.1, tmoDias: 33 },
  { gestor: 'Luis T.', asignados: 88, cerrados: 21, conversion: 23.9, tmoDias: 46 },
];

const proyectosInteres = [
  { proyecto: 'Reserva del Bosque', interesados: 187, cerrados: 42, ciudad: 'Cali' },
  { proyecto: 'Parques de Castilla', interesados: 142, cerrados: 38, ciudad: 'Cali' },
  { proyecto: 'Altos de Yumbo', interesados: 98, cerrados: 21, ciudad: 'Yumbo' },
  { proyecto: 'Mirador del Valle', interesados: 87, cerrados: 19, ciudad: 'Palmira' },
  { proyecto: 'Senderos de Pance', interesados: 76, cerrados: 18, ciudad: 'Cali' },
];

// Drill-down: KPIs por producto y municipio (vista cruzada)
const kpisPorProductoMunicipio = [
  { municipio: 'Cali', adquiere: 178, transforma: 92, hipotecario: 215, acondicionamiento: 134, subsidio: 248 },
  { municipio: 'Yumbo', adquiere: 64, transforma: 32, hipotecario: 78, acondicionamiento: 42, subsidio: 89 },
  { municipio: 'Palmira', adquiere: 58, transforma: 28, hipotecario: 71, acondicionamiento: 38, subsidio: 81 },
  { municipio: 'Buga', adquiere: 42, transforma: 19, hipotecario: 48, acondicionamiento: 25, subsidio: 54 },
  { municipio: 'Jamundí', adquiere: 28, transforma: 14, hipotecario: 32, acondicionamiento: 21, subsidio: 31 },
  { municipio: 'Tuluá', adquiere: 12, transforma: 6, hipotecario: 14, acondicionamiento: 12, subsidio: 14 },
  { municipio: 'Cartago', adquiere: 7, transforma: 4, hipotecario: 4, acondicionamiento: 8, subsidio: 4 },
];

// ====== METAS POR DEFECTO (plantilla; las metas reales se guardan por periodo) ======
const METAS_DEFAULT = {
  kpi: {
    solicitudesMes: 2000,
    conversionGlobal: 25,
    ingresosUES: 4500,
    hogaresHabilitados: 420,
    tmoDias: 38,
    desercionRate: 15,
    aprobacionCredito: 70,
  },
  sla: {
    'Asignación': 1,
    'Validador derechos': 1,
    'Contacto': 3,
    'Prospección': 4,
    'Cotización': 5,
    'Cierre financiero': 10,
    'Formalización (Firma)': 12,
  },
};

const MESES = [
  { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' }, { id: 3, nombre: 'Marzo' },
  { id: 4, nombre: 'Abril' }, { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
  { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' }, { id: 9, nombre: 'Septiembre' },
  { id: 10, nombre: 'Octubre' }, { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' },
];

const HOY = new Date();
const PERIODO_ACTUAL = `${HOY.getFullYear()}-${String(HOY.getMonth() + 1).padStart(2, '0')}`;
const periodoLabel = (id) => {
  const [a, m] = id.split('-');
  return `${MESES[parseInt(m, 10) - 1].nombre} ${a}`;
};

// Estado inicial: el periodo actual con valores por defecto + un par de periodos previos de ejemplo
const ESTADO_METAS_INICIAL = {
  porPeriodo: {
    [PERIODO_ACTUAL]: { ...METAS_DEFAULT, guardadoEn: null },
  },
};

// Devuelve las metas vigentes (del periodo actual o, en su defecto, las del último periodo guardado)
function metasVigentes(estado) {
  if (estado.porPeriodo[PERIODO_ACTUAL]) return estado.porPeriodo[PERIODO_ACTUAL];
  const periodos = Object.keys(estado.porPeriodo).sort();
  return estado.porPeriodo[periodos[periodos.length - 1]] || METAS_DEFAULT;
}

// ====== COMPONENTES BASE ======
const KPICard = ({ icon: Icon, label, value, suffix, delta, deltaLabel, color = C.azulPrimario, format = 'number', meta, info }) => {
  const isPositive = delta >= 0;
  const isInverse = label.includes('Deserción') || label.includes('TMO');
  const goodTrend = isInverse ? !isPositive : isPositive;
  const formatValue = (v) => {
    if (format === 'currency') return `$${v.toLocaleString('es-CO')}M`;
    if (format === 'percent') return `${v}%`;
    return v.toLocaleString('es-CO');
  };
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-shadow"
         style={{ borderLeft: `4px solid ${color}` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ background: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
          goodTrend ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
        }`}>
          {isPositive ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
          {Math.abs(delta)}%
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {formatValue(value)}{suffix}
      </div>
      <div className="text-xs text-gray-500 uppercase tracking-wide font-medium flex items-center gap-1">
        {label}
        {info && <span title={info}><Info size={11} className="text-gray-400"/></span>}
      </div>
      {meta != null && (
        <div className="text-xs text-gray-400 mt-1">
          Meta: <span className="font-semibold" style={{color}}>{format === 'percent' ? `${meta}%` : format === 'currency' ? `$${meta}M` : meta.toLocaleString('es-CO')}</span>
          {' · '}
          <span className={value >= meta ? (isInverse ? 'text-red-600' : 'text-green-700') : (isInverse ? 'text-green-700' : 'text-red-600')}>
            {((value / meta) * 100).toFixed(0)}%
          </span>
        </div>
      )}
      {deltaLabel && <div className="text-xs text-gray-400 mt-1">{deltaLabel}</div>}
    </div>
  );
};

const SectionTitle = ({ children, action, info }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
      {children}
      {info && (
        <span className="relative group">
          <Info size={14} className="text-gray-400 cursor-help"/>
          <span className="absolute z-20 left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg leading-relaxed">
            {info}
          </span>
        </span>
      )}
    </h3>
    {action}
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-100 p-5 ${className}`}>
    {children}
  </div>
);

// FilterBar: incluye Tipo de canal (Masivo/Manual) en todas las pestañas
const FilterBar = ({ productos = CATALOGO_PRODUCTOS }) => {
  const [periodo, setPeriodo] = useState('Últimos 6 meses');
  const [producto, setProducto] = useState('Todos');
  const [region, setRegion] = useState('Todas');
  const [canal, setCanal] = useState('Todos');
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 flex flex-wrap items-center gap-3">
      <Filter size={16} className="text-gray-400"/>
      <div className="flex flex-wrap gap-2 flex-1">
        <select value={periodo} onChange={e=>setPeriodo(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option>Últimos 6 meses</option>
          <option>Mes actual</option>
          <option>Año en curso</option>
          <option>Personalizado</option>
        </select>
        <select value={producto} onChange={e=>setProducto(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="Todos">Todos los productos</option>
          {productos.map(p=>(
            <option key={p.id} value={p.id}>{p.nombre} ({p.tipo})</option>
          ))}
        </select>
        <select value={region} onChange={e=>setRegion(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option>Todas las ubicaciones</option>
          {MUNICIPIOS.map(m=><option key={m}>{m}</option>)}
        </select>
        <select value={canal} onChange={e=>setCanal(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="Todos">Todos los canales</option>
          {CANALES.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
};

// ====== TABLERO 1: VISIÓN EJECUTIVA ======
const TableroEjecutivo = ({ metas }) => (
  <div>
    <FilterBar />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <KPICard icon={FileText} label="Solicitudes mes" value={kpisGlobales.solicitudesMes} delta={kpisGlobales.solicitudesDelta} color={C.azulPrimario} meta={metas.kpi.solicitudesMes}/>
      <KPICard icon={Target} label="Conversión global" value={kpisGlobales.conversionGlobal} format="percent" delta={kpisGlobales.conversionDelta} color={C.cyan} meta={metas.kpi.conversionGlobal}/>
      <KPICard icon={DollarSign} label="Ingresos UES" value={kpisGlobales.ingresosUES} format="currency" delta={kpisGlobales.ingresosDelta} color={C.verdeLima} meta={metas.kpi.ingresosUES}/>
      <KPICard icon={Home} label="Hogares habilitados" value={kpisGlobales.hogaresHabilitados} delta={kpisGlobales.hogaresDelta} color={C.azulOscuro} meta={metas.kpi.hogaresHabilitados} info="Hogares que aprobaron al menos un producto (subsidio o crédito)"/>
      <KPICard icon={Clock} label="TMO (días)" value={kpisGlobales.tmoDias} delta={kpisGlobales.tmoDelta} color={C.ambar} meta={metas.kpi.tmoDias}/>
      <KPICard icon={XCircle} label="Deserción" value={kpisGlobales.desercionRate} format="percent" delta={kpisGlobales.desercionDelta} color={C.rojo} meta={metas.kpi.desercionRate} info="Solicitudes que entran al pipeline y se cierran por causal comercial (no por filtro técnico de Validador o RPA)"/>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
      <Card className="lg:col-span-2">
        <SectionTitle info="Vista temporal: cómo evoluciona el volumen (solicitudes, cerrados) y el resultado financiero (ingresos UES) mes a mes. Detecta estacionalidad y tendencias del negocio.">
          Tendencia mensual: solicitudes vs cerrados vs ingresos
        </SectionTitle>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={tendenciaMensual} margin={{ right: 10 }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.azulPrimario} stopOpacity={0.3}/><stop offset="100%" stopColor={C.azulPrimario} stopOpacity={0}/></linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.verdeLima} stopOpacity={0.4}/><stop offset="100%" stopColor={C.verdeLima} stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.gris200}/>
            <XAxis dataKey="mes" stroke={C.gris600} fontSize={12}/>
            <YAxis yAxisId="left" stroke={C.gris600} fontSize={12} label={{ value: 'Solicitudes / Cerrados', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: C.gris600 } }}/>
            <YAxis yAxisId="right" orientation="right" stroke={C.cyan} fontSize={12} label={{ value: 'Ingresos ($M)', angle: 90, position: 'insideRight', style: { fontSize: 10, fill: C.cyan } }}/>
            <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.gris200}` }} formatter={(v, name) => name === 'Ingresos ($M)' ? `$${v}M` : v.toLocaleString('es-CO')}/>
            <Legend wrapperStyle={{ fontSize: 12 }}/>
            <Area yAxisId="left" type="monotone" dataKey="solicitudes" stroke={C.azulPrimario} fill="url(#g1)" strokeWidth={2} name="Solicitudes"/>
            <Area yAxisId="left" type="monotone" dataKey="cerrados" stroke={C.verdeLima} fill="url(#g2)" strokeWidth={2} name="Cerrados"/>
            <Line yAxisId="right" type="monotone" dataKey="ingresos" stroke={C.cyan} strokeWidth={3} dot={{ r: 4, fill: C.cyan }} name="Ingresos ($M)"/>
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionTitle info="Distribución de ingresos UES por producto. Productos compuestos (Adquiere, Transforma) y simples (Crédito Hipotecario, Acondicionamiento, Subsidio).">
          Mix por producto
        </SectionTitle>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={productosData} dataKey="ingresos" nameKey="producto" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
              {productosData.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Pie>
            <Tooltip formatter={(v)=>`$${v}M`}/>
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-1.5 mt-2">
          {productosData.map((p,i)=>(
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm" style={{background:p.color}}/>
                <span className="text-gray-700">{p.producto}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${p.tipo === 'Compuesto' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                  {p.tipo}
                </span>
              </div>
              <span className="font-semibold text-gray-900">${p.ingresos}M</span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Drill-down: KPIs por producto y municipio */}
    <Card className="mb-5">
      <SectionTitle info="Cruce de hogares habilitados por producto y municipio. Permite identificar concentraciones geográficas y oportunidades de cobertura.">
        Hogares habilitados — desglose por producto y municipio
      </SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
              <th className="text-left py-2 font-medium">Municipio</th>
              {CATALOGO_PRODUCTOS.map(p => (
                <th key={p.id} className="text-right py-2 font-medium" title={`${p.tipo}: ${p.componentes.join(' + ')}`}>
                  {p.nombre}
                </th>
              ))}
              <th className="text-right py-2 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {kpisPorProductoMunicipio.map((row, i) => {
              const total = CATALOGO_PRODUCTOS.reduce((s, p) => s + (row[p.id] || 0), 0);
              return (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 font-medium text-gray-900 flex items-center gap-1.5">
                    <MapPin size={12} className="text-gray-400"/>
                    {row.municipio}
                  </td>
                  {CATALOGO_PRODUCTOS.map(p => (
                    <td key={p.id} className="py-2 text-right text-gray-700">
                      {(row[p.id] || 0).toLocaleString()}
                    </td>
                  ))}
                  <td className="py-2 text-right font-bold" style={{ color: C.azulPrimario }}>
                    {total.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>

    <Card>
      <SectionTitle>Top constructoras y aliados (ecosistema)</SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
              <th className="text-left py-2 font-medium">Constructora</th>
              <th className="text-right py-2 font-medium">Proyectos activos</th>
              <th className="text-right py-2 font-medium">Ventas cerradas</th>
              <th className="text-right py-2 font-medium">Ingresos UES ($M)</th>
              <th className="text-right py-2 font-medium">Participación</th>
            </tr>
          </thead>
          <tbody>
            {constructorasTop.map((c,i)=>(
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-900">{c.nombre}</td>
                <td className="py-3 text-right text-gray-700">{c.proyectos}</td>
                <td className="py-3 text-right text-gray-700">{c.ventas}</td>
                <td className="py-3 text-right font-semibold" style={{color:C.azulPrimario}}>${c.ingresos}</td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${(c.ingresos/1280)*100}%`, background:C.verdeLima}}/>
                    </div>
                    <span className="text-xs text-gray-600 w-10">{((c.ingresos/5175)*100).toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

// ====== TABLERO 2: FUNNEL COMERCIAL ======
const TableroFunnel = () => (
  <div>
    <FilterBar />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
      <Card className="lg:col-span-2">
        <SectionTitle action={<span className="text-xs text-gray-500">% conversión sobre solicitud inicial</span>}
          info="Las 11 etapas reales del proceso. 'Prospección' reemplaza la antigua 'Negociación'. 'Sancionado' NO es una etapa: es una de las tres respuestas posibles del RPA (Viable / No viable / Sancionado).">
          Funnel de conversión: 11 etapas del proceso
        </SectionTitle>
        <div className="space-y-2">
          {funnelData.map((f,i)=>{
            const ancho = f.conversion;
            const dropoff = i>0 ? funnelData[i-1].valor - f.valor : 0;
            return (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-medium text-gray-700">{i+1}. {f.etapa}</span>
                  <div className="flex items-center gap-3">
                    {dropoff>0 && <span className="text-red-500">−{dropoff}</span>}
                    <span className="font-semibold text-gray-900">{f.valor.toLocaleString()}</span>
                    <span className="text-gray-500 w-12 text-right">{f.conversion}%</span>
                  </div>
                </div>
                <div className="h-7 bg-gray-100 rounded-md overflow-hidden">
                  <div className="h-full rounded-md flex items-center justify-end pr-2 transition-all"
                       style={{
                         width:`${ancho}%`,
                         background:`linear-gradient(90deg, ${C.azulPrimario} 0%, ${C.cyan} 100%)`
                       }}/>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="space-y-5">
        <Card>
          <SectionTitle>Punto crítico de fuga</SectionTitle>
          <div className="text-center py-2">
            <div className="text-xs text-gray-500 mb-1">Mayor caída detectada en</div>
            <div className="text-lg font-bold text-gray-900 mb-3">Cierre financiero</div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-sm font-semibold">
              <AlertTriangle size={14}/> −212 solicitudes (−18%)
            </div>
            <div className="text-xs text-gray-500 mt-3 leading-relaxed">
              Recomendación: revisar políticas de score y capacidad de pago en el simulador.
            </div>
          </div>
        </Card>
        <Card>
          <SectionTitle>Tasa de cierre</SectionTitle>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold" style={{color:C.verdeLima}}>20.9%</span>
            <span className="text-sm text-gray-500">→ meta 25%</span>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full">
            <div className="h-full rounded-full" style={{width:'83.6%', background:C.verdeLima}}/>
          </div>
          <div className="text-xs text-gray-500 mt-2">83.6% de cumplimiento de meta</div>
        </Card>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card>
        <SectionTitle info="Vista transversal y de eficiencia: compara productos entre sí en el periodo seleccionado. Responde '¿qué producto convierte mejor la demanda en cierre?' (no tiene eje de tiempo, a diferencia de la Tendencia mensual).">
          Conversión por producto
        </SectionTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productosData} layout="vertical" margin={{left:30}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.gris200}/>
            <XAxis type="number" stroke={C.gris600} fontSize={12}/>
            <YAxis dataKey="producto" type="category" stroke={C.gris600} fontSize={11} width={140}/>
            <Tooltip contentStyle={{borderRadius:8}}/>
            <Legend wrapperStyle={{fontSize:12}}/>
            <Bar dataKey="solicitudes" fill={C.gris400} name="Solicitudes" radius={[0,4,4,0]}/>
            <Bar dataKey="cerrados" fill={C.azulPrimario} name="Cerrados" radius={[0,4,4,0]}/>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
          <strong>Tasas de conversión:</strong> {productosData.map(p => `${p.nombre.split(' ')[0]} ${((p.cerrados/p.solicitudes)*100).toFixed(1)}%`).join(' · ')}
        </div>
      </Card>

      <Card>
        <SectionTitle>Proyectos de mayor interés</SectionTitle>
        <div className="space-y-2.5">
          {proyectosInteres.map((p,i)=>(
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                   style={{background:`${C.azulPrimario}10`}}>
                <Building2 size={18} style={{color:C.azulPrimario}}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900 truncate">{p.proyecto}</div>
                <div className="text-xs text-gray-500">{p.ciudad} · {p.interesados} interesados</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm" style={{color:C.verdeLima}}>{p.cerrados}</div>
                <div className="text-xs text-gray-500">cerrados</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

// ====== TABLERO 3: OPERACIÓN Y SLA ======
const TableroOperacion = ({ metas }) => (
  <div>
    <FilterBar />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
      <Card>
        <SectionTitle info="Comparativo entre tiempo real y meta configurada por etapa. Las metas se editan en la pestaña 'Configuración de metas'.">
          SLA por etapa: tiempo actual vs meta (días)
        </SectionTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={slaData.map(s => ({ ...s, meta: metas.sla[s.etapa] || s.meta }))}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.gris200}/>
            <XAxis dataKey="etapa" stroke={C.gris600} fontSize={10} angle={-25} textAnchor="end" height={70}/>
            <YAxis stroke={C.gris600} fontSize={12}/>
            <Tooltip contentStyle={{borderRadius:8}}/>
            <Legend wrapperStyle={{fontSize:12}}/>
            <Bar dataKey="meta" fill={C.gris400} name="Meta" radius={[4,4,0,0]}/>
            <Bar dataKey="actual" fill={C.azulPrimario} name="Actual" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionTitle>Cumplimiento SLA por etapa</SectionTitle>
        <div className="space-y-3 mt-2">
          {slaData.map((s,i)=>{
            const color = s.cumplimiento >= 90 ? C.verdeLima : s.cumplimiento >= 75 ? C.ambar : C.rojo;
            return (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">{s.etapa}</span>
                  <span className="font-bold" style={{color}}>{s.cumplimiento}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${s.cumplimiento}%`, background:color}}/>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>

    {/* INTEGRACIONES: solo Core, RPA y Firma */}
    <Card className="mb-5">
      <SectionTitle info="Las únicas tres integraciones (automatizaciones) del proceso: Core - Validador de derechos, RPA y Firma electrónica."
        action={
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{background:C.verdeLima}}/>Estable</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{background:C.ambar}}/>Revisar</span>
          </div>
        }>
        Integraciones del proceso (3)
      </SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {integracionesData.map((r, i) => {
          const esRPA = r.proceso.startsWith('RPA');
          const tasa = (r.exitosos / r.ejecuciones * 100).toFixed(1);
          const ok = parseFloat(tasa) >= 97;
          return (
            <div key={i} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} style={{ color: C.cyan }}/>
                <span className="font-semibold text-sm text-gray-900">{r.proceso}</span>
              </div>
              <div className="text-xs text-gray-500 leading-relaxed mb-3 min-h-[36px]">{r.descripcion}</div>

              {esRPA ? (
                // RPA: el indicador relevante es el desglose de respuestas, no exitosos/fallidos
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-1.5">
                    {rpaRespuestas.map((rr, j) => (
                      <div key={j} className="text-center p-1.5 rounded-lg" style={{ background: `${rr.color}10` }}>
                        <div className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: rr.color }}>{rr.tipo}</div>
                        <div className="text-base font-bold mt-0.5" style={{ color: rr.color }}>{rr.cantidad.toLocaleString()}</div>
                        <div className="text-[10px] text-gray-500">{((rr.cantidad / r.exitosos) * 100).toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
                    <div>
                      <div className="text-gray-500">Ejecuciones</div>
                      <div className="font-bold text-gray-900">{r.ejecuciones.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Fallos técnicos</div>
                      <div className="font-bold text-red-600">{r.fallidos}</div>
                    </div>
                  </div>
                </div>
              ) : (
                // Core y Firma: indicadores estándar de éxito/fallo técnico
                <>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-gray-500">Ejecuciones</div>
                      <div className="font-bold text-gray-900">{r.ejecuciones.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Tasa éxito</div>
                      <div className="font-bold" style={{ color: ok ? C.verdeOscuro : C.ambar }}>{tasa}%</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Fallidos</div>
                      <div className="font-bold text-red-600">{r.fallidos}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">T. promedio</div>
                      <div className="font-bold text-gray-700">{r.tiempoProm}s</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      ok ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      <CheckCircle2 size={12}/>{ok ? 'Estable' : 'Revisar'}
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Detalle de respuestas RPA */}
      <div className="border-t border-gray-100 pt-4">
        <SectionTitle info="El RPA consulta la página de subsidios del Ministerio de Vivienda y devuelve una de tres respuestas. La respuesta solo bloquea el flujo cuando el producto es 'Subsidio'; para los demás productos, el trámite continúa pero sin el monto del subsidio.">
          Detalle de respuestas del RPA
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {rpaRespuestas.map((r, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4" style={{ borderLeft: `4px solid ${r.color}` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase tracking-wide font-bold" style={{ color: r.color }}>{r.tipo}</div>
                <div className="text-xs text-gray-500">{((r.cantidad / 1587) * 100).toFixed(1)}% de las consultas exitosas</div>
              </div>
              <div className="text-2xl font-bold mb-2" style={{ color: r.color }}>{r.cantidad.toLocaleString()}</div>
              <div className="text-xs text-gray-600 leading-relaxed">{r.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
          Total ejecuciones del RPA: <strong>{(1587 + 36).toLocaleString()}</strong> ·
          Consultas exitosas (con respuesta): <strong>1,587</strong> ·
          Fallos técnicos del bot (sin respuesta): <strong>36</strong> (timeouts, errores de conexión).
        </div>
      </div>
    </Card>

    <Card>
      <SectionTitle>Productividad por gestor</SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
              <th className="text-left py-2 font-medium">Gestor</th>
              <th className="text-right py-2 font-medium">Asignados</th>
              <th className="text-right py-2 font-medium">Cerrados</th>
              <th className="text-right py-2 font-medium">Conversión</th>
              <th className="text-right py-2 font-medium">TMO (días)</th>
              <th className="text-right py-2 font-medium">Performance</th>
            </tr>
          </thead>
          <tbody>
            {[...gestoresProductividad].sort((a,b)=>b.conversion-a.conversion).map((g,i)=>(
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                       style={{background:i===0?C.verdeLima:C.azulPrimario}}>{g.gestor.charAt(0)}</div>
                  <span className="font-medium text-gray-900">{g.gestor}</span>
                </td>
                <td className="py-3 text-right text-gray-700">{g.asignados}</td>
                <td className="py-3 text-right font-semibold text-gray-900">{g.cerrados}</td>
                <td className="py-3 text-right" style={{color: g.conversion>=28 ? C.verdeOscuro : C.gris600}}>{g.conversion}%</td>
                <td className="py-3 text-right text-gray-700">{g.tmoDias}</td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full"
                           style={{width:`${(g.conversion/35)*100}%`, background: g.conversion>=28?C.verdeLima:C.azulClaro}}/>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

// ====== TABLERO 4: RIESGO Y DESERCIÓN ======
const TableroRiesgo = ({ metas }) => (
  <div>
    <FilterBar />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
      <KPICard icon={AlertTriangle} label="Tasa deserción" value={18.4} format="percent" delta={-3.2} color={C.rojo} meta={metas.kpi.desercionRate} info="Solicitudes que entran al pipeline y se cierran por causal comercial. NO incluye rechazos de Validador de derechos ni 'No viable' del RPA — esos son filtros técnicos de elegibilidad."/>
      <KPICard icon={XCircle} label="Desistidos mes" value={373} delta={-8.1} color={C.ambar}/>
      <KPICard icon={Activity} label="Sancionados (Min. Vivienda)" value={12} delta={9.0} color={C.azulOscuro} info="Respuesta del RPA cuando el postulante figura como sancionado en la página de subsidios del Ministerio de Vivienda (incumplimiento previo, inhabilidad temporal, uso indebido). No es una etapa del proceso."/>
      <KPICard icon={CheckCircle2} label="% Aprobación crédito" value={67.3} format="percent" delta={4.5} color={C.verdeLima} meta={metas.kpi.aprobacionCredito} info="Aprobaciones / Solicitudes de crédito que llegaron a evaluación crediticia (post Validador de derechos y RPA viable). NO se calcula sobre el total bruto de solicitudes."/>
    </div>

    {/* Tarjeta de definiciones */}
    <Card className="mb-5 border-l-4" style={{ borderLeftColor: C.azulPrimario }}>
      <SectionTitle>Definiciones de los indicadores de riesgo</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
        <div>
          <div className="font-semibold text-gray-900 mb-1">¿Qué es Deserción?</div>
          <div className="text-gray-600">
            Solicitud que entró al pipeline (Solicitud creada en adelante), no llegó a Finalización, y fue cerrada por causal <strong>no técnica</strong>:
            decisión del hogar, no califica financieramente, no responde, encontró otra opción.
            <strong> No cuenta</strong> rechazo del Validador de derechos ni "No viable" del RPA — esos son filtros de elegibilidad.
          </div>
        </div>
        <div>
          <div className="font-semibold text-gray-900 mb-1">¿Cómo se calcula % Aprobación crédito?</div>
          <div className="text-gray-600">
            Aprobaciones de crédito / <strong>solicitudes que llegaron a evaluación crediticia</strong> (post filtros técnicos).
            Se excluye del denominador todo lo que se rechazó automáticamente, para que el indicador refleje calidad de la evaluación, no del filtrado.
          </div>
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
      <Card className="lg:col-span-2">
        <SectionTitle>Causas de desistimiento (mes actual)</SectionTitle>
        <div className="space-y-3">
          {desistimientosCausas.map((d,i)=>(
            <div key={i}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-700">{d.causa}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{d.cantidad}</span>
                  <span className="text-xs text-gray-500 w-10 text-right">{d.pct}%</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full"
                     style={{width:`${d.pct*2.5}%`, background: i<2?C.rojo:i<4?C.ambar:C.gris400}}/>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle info="Distribución de las razones por las que el aliado financiero rechaza solicitudes que llegaron a evaluación crediticia. La fábrica de crédito NO es propia de la UES: estos motivos son los que el aliado reporta, no atributos que la UES analice por sí misma.">
          Causales de rechazo del aliado financiero
        </SectionTitle>
        <div className="space-y-3 mt-2">
          {causalesRechazoAliado.map((c, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-700">{c.causal}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{c.cantidad}</span>
                  <span className="text-xs text-gray-500 w-10 text-right">{c.pct}%</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full"
                     style={{ width: `${c.pct * 2.5}%`, background: i < 2 ? C.rojo : i < 4 ? C.ambar : C.gris400 }}/>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <Card>
      <SectionTitle>Etapas con mayor desistimiento (orden del proceso)</SectionTitle>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={[
          {etapa:'Prospección', desistidos:67, recuperados:12},
          {etapa:'Contacto', desistidos:41, recuperados:18},
          {etapa:'Cotización', desistidos:142, recuperados:38},
          {etapa:'Cierre financiero', desistidos:98, recuperados:21},
          {etapa:'Formalización', desistidos:25, recuperados:5},
        ]}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.gris200}/>
          <XAxis dataKey="etapa" stroke={C.gris600} fontSize={11}/>
          <YAxis stroke={C.gris600} fontSize={12}/>
          <Tooltip contentStyle={{borderRadius:8}}/>
          <Legend wrapperStyle={{fontSize:12}}/>
          <Bar dataKey="desistidos" fill={C.rojo} name="Desistidos" radius={[4,4,0,0]}/>
          <Bar dataKey="recuperados" fill={C.verdeLima} name="Recuperados" radius={[4,4,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </div>
);

// ====== TABLERO 5: CICLO DE VIDA DEL HOGAR ======
const TableroCicloVida = () => {
  const fases = [
    {
      id: 1, nombre: 'Habilitar', valor: 1263, color: C.cyan,
      productos: 'Subsidio · Crédito Hipotecario · Crédito Acondicionamiento (productos simples)',
      desc: 'Crear capacidad económica del hogar para acceder a una solución de vivienda. Aquí entran solicitudes que solo buscan habilitar capacidad de compra.',
    },
    {
      id: 2, nombre: 'Adquirir', valor: 584, color: C.verdeLima,
      productos: 'Adquiere tu vivienda (servicio compuesto: Subsidio + Crédito Hipotecario + Proyecto inmobiliario aliado)',
      desc: 'Materializar la compra de la vivienda nueva con constructoras aliadas. Aquí se concreta la transacción inmobiliaria.',
    },
    {
      id: 3, nombre: 'Conservar', valor: 195, color: C.azulOscuro,
      productos: 'Transforma tu hogar (servicio compuesto: Subsidio + Crédito Acondicionamiento + Aliado en remodelación)',
      desc: 'Mantener y mejorar el inmueble adquirido a través de remodelaciones y acondicionamiento.',
    },
  ];
  return (
    <div>
      <FilterBar />

      {/* Tarjeta-marco con la relación entre fases */}
      <Card className="mb-5 border-l-4" style={{ borderLeftColor: C.azulPrimario }}>
        <SectionTitle>Marco conceptual: Habilitar → Adquirir → Conservar</SectionTitle>
        <div className="text-sm text-gray-600 leading-relaxed">
          Las tres fases son <strong>secuenciales pero no obligatoriamente lineales</strong>. Un hogar puede recorrer todo el ciclo
          (máximo LTV) o detenerse en una fase: solo Habilitar (subsidio o crédito sin compra), o entrar directo a Conservar
          (ya tiene vivienda y solo busca remodelar). Cada producto del catálogo activa una fase específica:
          los <strong>productos simples</strong> activan Habilitar; <strong>Adquiere tu vivienda</strong> activa Adquirir;
          <strong> Transforma tu hogar</strong> activa Conservar.
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {fases.map(f=>(
          <Card key={f.id} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
                 style={{background:f.color, transform:'translate(30%,-30%)'}}/>
            <div className="text-xs font-semibold uppercase tracking-wide" style={{color:f.color}}>
              Fase {f.id}
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{f.nombre}</div>
            <div className="text-xs text-gray-500 mb-3">{f.productos}</div>
            <div className="text-3xl font-bold mb-2" style={{color:f.color}}>{f.valor.toLocaleString()}</div>
            <div className="text-xs text-gray-500 leading-relaxed">{f.desc}</div>
          </Card>
        ))}
      </div>

      <Card className="mb-5">
        <SectionTitle>Distribución de hogares por fase del ciclo de vida</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={[
            {mes:'Ene', habilitar:920, adquirir:380, conservar:120},
            {mes:'Feb', habilitar:1010, adquirir:420, conservar:135},
            {mes:'Mar', habilitar:1080, adquirir:475, conservar:148},
            {mes:'Abr', habilitar:1145, adquirir:510, conservar:162},
            {mes:'May', habilitar:1205, adquirir:548, conservar:178},
            {mes:'Jun', habilitar:1263, adquirir:584, conservar:195},
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.gris200}/>
            <XAxis dataKey="mes" stroke={C.gris600} fontSize={12}/>
            <YAxis stroke={C.gris600} fontSize={12}/>
            <Tooltip contentStyle={{borderRadius:8}}/>
            <Legend wrapperStyle={{fontSize:12}}/>
            <Area type="monotone" dataKey="habilitar" stackId="1" stroke={C.cyan} fill={C.cyan} fillOpacity={0.7} name="Habilitar"/>
            <Area type="monotone" dataKey="adquirir" stackId="1" stroke={C.verdeLima} fill={C.verdeLima} fillOpacity={0.7} name="Adquirir"/>
            <Area type="monotone" dataKey="conservar" stackId="1" stroke={C.azulOscuro} fill={C.azulOscuro} fillOpacity={0.7} name="Conservar"/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <SectionTitle>Tasa de transición entre fases</SectionTitle>
          <div className="space-y-4 py-2">
            {[
              {de:'Habilitar', a:'Adquirir', tasa:46.2, color:C.verdeLima},
              {de:'Adquirir', a:'Conservar', tasa:33.4, color:C.cyan},
              {de:'Conservar', a:'Re-engagement', tasa:21.8, color:C.azulOscuro},
            ].map((t,i)=>(
              <div key={i} className="flex items-center gap-3">
                <div className="px-3 py-2 rounded-lg bg-gray-50 text-xs font-medium text-gray-700 flex-shrink-0">{t.de}</div>
                <div className="flex-1 relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="absolute h-full rounded-full" style={{width:`${t.tasa}%`, background:t.color}}/>
                </div>
                <div className="text-sm font-bold w-12 text-right" style={{color:t.color}}>{t.tasa}%</div>
                <ChevronRight size={16} className="text-gray-400"/>
                <div className="px-3 py-2 rounded-lg text-xs font-medium text-white flex-shrink-0" style={{background:t.color}}>{t.a}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle info="Modelo conceptual del valor económico de un hogar a lo largo de su ciclo. Las cifras absolutas requieren validación con la UES.">
            LTV por hogar habilitado — modelo propuesto
          </SectionTitle>

          <div className="text-xs text-gray-600 leading-relaxed mb-3 bg-blue-50 p-3 rounded-lg">
            <strong>Definición funcional:</strong> suma de ingresos UES Vivienda que un hogar deja a la unidad desde
            que es habilitado (subsidio o crédito aprobado) hasta que termina su relación con productos de vivienda.
            <br/>
            <strong>Fórmula:</strong> <code className="bg-white px-1 rounded">LTV = Σ (Ingreso UES por producto × Probabilidad de tomarlo) − Costo adquisición y servicio</code>
          </div>

          <div className="text-xs font-semibold text-gray-700 mb-2 mt-4">Estructura por escenario:</div>
          <div className="space-y-2">
            {[
              {
                label:'Solo subsidio (queda en Habilitar)',
                fuentes:['Comisión gestión subsidio', 'Servicios complementarios'],
                ej:'$2.4M', color:C.gris600, mult: '1×',
              },
              {
                label:'Subsidio + Crédito (Habilitar completo)',
                fuentes:['+ Originación crédito', '+ Spread financiero a 15 años (VP)'],
                ej:'$18.6M', color:C.cyan, mult: '~8×',
              },
              {
                label:'Habilitar → Adquirir',
                fuentes:['+ Comisión constructora aliada', '+ Acompañamiento integral'],
                ej:'$42.3M', color:C.verdeLima, mult: '~18×',
              },
              {
                label:'Ciclo completo (3 fases)',
                fuentes:['+ Crédito acondicionamiento', '+ Comisión aliado remodelación', '+ Cross-sell / re-engagement'],
                ej:'$58.7M', color:C.azulPrimario, mult: '~24×',
              },
            ].map((l,i)=>(
              <div key={i} className="p-3 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-semibold text-gray-900">{l.label}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-gray-400">ej. ilustrativo</span>
                    <span className="text-base font-bold" style={{color:l.color}}>{l.ej}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{background: `${l.color}15`, color: l.color}}>{l.mult}</span>
                  </div>
                </div>
                <ul className="text-xs text-gray-600 leading-relaxed pl-2">
                  {l.fuentes.map((f, j)=>(
                    <li key={j}>· {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 rounded-lg text-xs text-gray-700 leading-relaxed border border-amber-200 bg-amber-50">
            <div className="font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
              <AlertTriangle size={12}/> Insumos pendientes para fijar el LTV real
            </div>
            <ul className="text-gray-700 space-y-0.5 pl-1">
              <li>· P&L de la UES Vivienda (líneas de ingreso por producto)</li>
              <li>· Tarifa interna de gestión de subsidio</li>
              <li>· % de comisión de las constructoras aliadas (top 5)</li>
              <li>· Estructura del crédito hipotecario (banco propio, aliado o solo gestión)</li>
              <li>· % de hogares que efectivamente recorre cada transición de fase</li>
            </ul>
          </div>

          <div className="mt-3 p-3 rounded-lg text-xs text-gray-700 leading-relaxed" style={{ background: `${C.verdeLima}15` }}>
            <strong>Lectura estratégica (independiente de cifras):</strong> el modelo evidencia que el ingreso UES escala
            geométricamente al hacer transitar al hogar de fase a fase. Argumenta inversión en venta cruzada y re-engagement
            por encima de captación pura.
          </div>
        </Card>
      </div>
    </div>
  );
};

// ====== TABLERO 6: CONFIGURACIÓN DE METAS (POR PERIODO MENSUAL) ======
const TableroMetas = ({ estadoMetas, setEstadoMetas }) => {
  const [mes, setMes] = useState(HOY.getMonth() + 1);
  const [anio, setAnio] = useState(HOY.getFullYear());
  const periodoSeleccionado = `${anio}-${String(mes).padStart(2, '0')}`;

  // Si el periodo seleccionado ya tiene metas guardadas, las cargamos. Si no, partimos de DEFAULT.
  const metasDelPeriodo = estadoMetas.porPeriodo[periodoSeleccionado] || { ...METAS_DEFAULT, guardadoEn: null };
  const [draft, setDraft] = useState(metasDelPeriodo);
  const [savedAt, setSavedAt] = useState(null);

  // Cuando cambia el periodo, recargamos el draft con lo que esté guardado (o default)
  React.useEffect(() => {
    const existente = estadoMetas.porPeriodo[periodoSeleccionado];
    setDraft(existente || { ...METAS_DEFAULT, guardadoEn: null });
    setSavedAt(null);
  }, [periodoSeleccionado, estadoMetas]);

  const updateKpi = (k, v) => setDraft({ ...draft, kpi: { ...draft.kpi, [k]: parseFloat(v) || 0 } });
  const updateSla = (etapa, v) => setDraft({ ...draft, sla: { ...draft.sla, [etapa]: parseFloat(v) || 0 } });

  const guardar = () => {
    const ahora = new Date();
    setEstadoMetas({
      ...estadoMetas,
      porPeriodo: {
        ...estadoMetas.porPeriodo,
        [periodoSeleccionado]: { kpi: draft.kpi, sla: draft.sla, guardadoEn: ahora.toISOString() },
      },
    });
    setSavedAt(ahora);
  };

  const eliminarPeriodo = (id) => {
    const copia = { ...estadoMetas.porPeriodo };
    delete copia[id];
    setEstadoMetas({ ...estadoMetas, porPeriodo: copia });
  };

  const aniosDisponibles = Array.from({ length: 5 }, (_, i) => HOY.getFullYear() - 2 + i);

  const kpiCampos = [
    { key: 'solicitudesMes', label: 'Solicitudes mes', sufijo: '', icon: FileText },
    { key: 'conversionGlobal', label: 'Conversión global', sufijo: '%', icon: Target },
    { key: 'ingresosUES', label: 'Ingresos UES', sufijo: '$M', icon: DollarSign },
    { key: 'hogaresHabilitados', label: 'Hogares habilitados', sufijo: '', icon: Home },
    { key: 'tmoDias', label: 'TMO máximo', sufijo: 'días', icon: Clock },
    { key: 'desercionRate', label: 'Deserción máxima', sufijo: '%', icon: XCircle },
    { key: 'aprobacionCredito', label: 'Aprobación crédito mín.', sufijo: '%', icon: CheckCircle2 },
  ];

  const periodosGuardados = Object.entries(estadoMetas.porPeriodo)
    .filter(([, v]) => v.guardadoEn)
    .sort(([a], [b]) => b.localeCompare(a));

  const yaGuardado = !!estadoMetas.porPeriodo[periodoSeleccionado]?.guardadoEn;
  const esPeriodoVigente = periodoSeleccionado === PERIODO_ACTUAL;

  return (
    <div>
      <Card className="mb-5 border-l-4" style={{ borderLeftColor: C.verdeLima }}>
        <div className="flex items-start gap-3">
          <Sliders size={20} style={{ color: C.verdeLima }}/>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900">Configuración de metas mensuales (OKR)</h3>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              Las metas se establecen <strong>por periodo mensual</strong>. Seleccione mes y año, configure los valores
              de los KPI estratégicos y los SLAs por etapa, y guarde. Los tableros (Visión Ejecutiva, Operación & SLA, Riesgo)
              usan las metas del <strong>mes en curso</strong> ({periodoLabel(PERIODO_ACTUAL)}).
            </p>
          </div>
        </div>
      </Card>

      {/* Selector de periodo */}
      <Card className="mb-5">
        <div className="flex flex-wrap items-center gap-4">
          <Calendar size={18} style={{ color: C.azulPrimario }}/>
          <div className="text-sm font-semibold text-gray-900">Periodo de las metas:</div>
          <div className="flex items-center gap-2">
            <select
              value={mes}
              onChange={e => setMes(parseInt(e.target.value, 10))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              {MESES.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
            <select
              value={anio}
              onChange={e => setAnio(parseInt(e.target.value, 10))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              {aniosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {esPeriodoVigente && (
              <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">Periodo vigente</span>
            )}
            {yaGuardado ? (
              <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 font-semibold flex items-center gap-1">
                <CheckCircle2 size={11}/> Metas guardadas
              </span>
            ) : (
              <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold">Sin metas para este periodo</span>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <Card>
          <SectionTitle>Metas KPI estratégicos · {periodoLabel(periodoSeleccionado)}</SectionTitle>
          <div className="space-y-3">
            {kpiCampos.map(c => {
              const Icon = c.icon;
              return (
                <div key={c.key} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                  <div className="p-2 rounded-lg" style={{ background: `${C.azulPrimario}15` }}>
                    <Icon size={16} style={{ color: C.azulPrimario }}/>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{c.label}</div>
                    <div className="text-xs text-gray-500">Meta de {periodoLabel(periodoSeleccionado)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={draft.kpi[c.key]}
                      onChange={e => updateKpi(c.key, e.target.value)}
                      className="w-24 px-3 py-2 text-right text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-500 w-10">{c.sufijo}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionTitle>Metas SLA por etapa · {periodoLabel(periodoSeleccionado)}</SectionTitle>
          <div className="space-y-3">
            {Object.keys(draft.sla).map(etapa => (
              <div key={etapa} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                <div className="p-2 rounded-lg" style={{ background: `${C.cyan}15` }}>
                  <Clock size={16} style={{ color: C.cyan }}/>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{etapa}</div>
                  <div className="text-xs text-gray-500">Tiempo objetivo (días máx.)</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={draft.sla[etapa]}
                    onChange={e => updateSla(etapa, e.target.value)}
                    className="w-24 px-3 py-2 text-right text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-500 w-10">días</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4 mb-5">
        <div className="text-sm text-gray-600">
          {savedAt
            ? <span className="text-green-700 flex items-center gap-2"><CheckCircle2 size={14}/> Metas para {periodoLabel(periodoSeleccionado)} guardadas a las {savedAt.toLocaleTimeString('es-CO')}</span>
            : <span>Editando metas para <strong>{periodoLabel(periodoSeleccionado)}</strong></span>
          }
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDraft({ ...METAS_DEFAULT, guardadoEn: null })}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50">
            Restaurar valores por defecto
          </button>
          <button
            onClick={guardar}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
            style={{ background: C.verdeLima }}>
            <Save size={14}/> Guardar metas para {periodoLabel(periodoSeleccionado)}
          </button>
        </div>
      </div>

      {/* Histórico de metas guardadas */}
      <Card>
        <SectionTitle info="Listado de periodos con metas configuradas. Seleccione un periodo del listado para cargarlo en el editor.">
          Histórico de metas por periodo
        </SectionTitle>
        {periodosGuardados.length === 0 ? (
          <div className="text-sm text-gray-500 py-4 text-center">
            Aún no hay metas guardadas en ningún periodo. Configure y guarde para empezar el histórico.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                  <th className="text-left py-2 font-medium">Periodo</th>
                  <th className="text-right py-2 font-medium">Solicitudes</th>
                  <th className="text-right py-2 font-medium">Conv. global</th>
                  <th className="text-right py-2 font-medium">Ingresos UES</th>
                  <th className="text-right py-2 font-medium">Hogares hab.</th>
                  <th className="text-right py-2 font-medium">TMO máx</th>
                  <th className="text-right py-2 font-medium">Deserción máx</th>
                  <th className="text-right py-2 font-medium">Guardado</th>
                  <th className="text-right py-2 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {periodosGuardados.map(([id, m]) => {
                  const [a, mm] = id.split('-');
                  return (
                    <tr key={id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 font-medium text-gray-900">
                        {periodoLabel(id)}
                        {id === PERIODO_ACTUAL && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">vigente</span>
                        )}
                      </td>
                      <td className="py-2 text-right text-gray-700">{m.kpi.solicitudesMes.toLocaleString()}</td>
                      <td className="py-2 text-right text-gray-700">{m.kpi.conversionGlobal}%</td>
                      <td className="py-2 text-right text-gray-700">${m.kpi.ingresosUES}M</td>
                      <td className="py-2 text-right text-gray-700">{m.kpi.hogaresHabilitados}</td>
                      <td className="py-2 text-right text-gray-700">{m.kpi.tmoDias}d</td>
                      <td className="py-2 text-right text-gray-700">{m.kpi.desercionRate}%</td>
                      <td className="py-2 text-right text-xs text-gray-500">
                        {new Date(m.guardadoEn).toLocaleDateString('es-CO')}
                      </td>
                      <td className="py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setMes(parseInt(mm, 10)); setAnio(parseInt(a, 10)); }}
                            className="text-xs font-medium px-2 py-1 rounded hover:bg-blue-50"
                            style={{ color: C.azulPrimario }}>
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarPeriodo(id)}
                            className="text-xs font-medium px-2 py-1 rounded hover:bg-red-50 text-red-600">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

// ====== APP PRINCIPAL ======
export default function App() {
  const [tab, setTab] = useState('ejecutivo');
  const [estadoMetas, setEstadoMetas] = useState(ESTADO_METAS_INICIAL);
  const metas = metasVigentes(estadoMetas);

  const tabs = [
    {id:'ejecutivo', label:'Visión Ejecutiva', icon:BarChart3, desc:'KPIs estratégicos UES con desglose por producto y municipio'},
    {id:'funnel', label:'Funnel Comercial', icon:Target, desc:'Conversión por las 11 etapas reales del proceso (Prospección, no Negociación)'},
    {id:'operacion', label:'Operación & SLA', icon:Activity, desc:'Las 3 integraciones (Core Validador, RPA, Firma), SLA y productividad'},
    {id:'riesgo', label:'Riesgo & Deserción', icon:AlertTriangle, desc:'Definiciones, causas de desistimiento y % aprobación de crédito'},
    {id:'ciclo', label:'Ciclo de Vida', icon:Layers, desc:'Habilitar → Adquirir → Conservar y LTV por hogar'},
    {id:'metas', label:'Configuración', icon:Sliders, desc:'Metas de KPI estratégicos y SLA por etapa'},
  ];
  const tabActual = tabs.find(t=>t.id===tab);

  return (
    <div className="min-h-screen" style={{background:C.gris50}}>
      {/* Banner global: datos ilustrativos */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-xs flex items-center gap-2 text-amber-900">
        <AlertTriangle size={14} className="flex-shrink-0"/>
        <span>
          <strong>Datos ilustrativos —</strong> los volúmenes, tasas, comisiones y cifras de LTV mostradas son simuladas
          y representan la estructura propuesta del modelo. <strong>Pendiente de validación con la UES Vivienda</strong> (P&L de la unidad,
          tarifas reales de gestión, % de comisiones por aliado y estructura del crédito).
        </span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                 style={{background:`linear-gradient(135deg, ${C.azulPrimario} 0%, ${C.verdeLima} 100%)`}}>
              <Home size={20} className="text-white"/>
            </div>
            <div>
              <div className="text-base font-bold text-gray-900">Fábrica Digital de Vivienda</div>
              <div className="text-xs text-gray-500">UES Vivienda · COMFANDI · powered by BJungle</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input placeholder="Buscar solicitud, hogar, proyecto..." className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell size={18} className="text-gray-600"/>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{background:C.rojo}}/>
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                 style={{background:C.azulPrimario}}>JV</div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-white border-b border-gray-200 px-6 sticky top-[62px] z-10">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(t=>{
            const active = t.id===tab;
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={()=>setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  active ? '' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
                style={active ? {color:C.azulPrimario, borderColor:C.azulPrimario} : { borderColor: 'transparent' }}>
                <Icon size={16}/>{t.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Page header */}
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">{tabActual.label}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{tabActual.desc}</p>
      </div>

      {/* Content */}
      <main className="px-6 pb-10">
        {tab==='ejecutivo' && <TableroEjecutivo metas={metas}/>}
        {tab==='funnel' && <TableroFunnel/>}
        {tab==='operacion' && <TableroOperacion metas={metas}/>}
        {tab==='riesgo' && <TableroRiesgo metas={metas}/>}
        {tab==='ciclo' && <TableroCicloVida/>}
        {tab==='metas' && <TableroMetas estadoMetas={estadoMetas} setEstadoMetas={setEstadoMetas}/>}
      </main>

      <footer className="px-6 py-4 border-t border-gray-200 bg-white text-xs text-gray-500 flex items-center justify-between">
        <div>© 2026 BJungle · Fábrica Digital de Vivienda v2.0</div>
        <div className="flex items-center gap-4">
          <span>5 productos · 7 municipios · 2 canales · 3 integraciones</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{background:C.verdeLima}}/>Sistema operativo</span>
        </div>
      </footer>
    </div>
  );
}
