// National Statistics of Nusantara — front-end logic, vanilla JS, no libraries.
// All charts are hand-drawn SVG. All data comes from data.js (invented dataset).
'use strict';

/* ---------- helpers ---------- */
const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
const fmt = (n, d) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const NS = 'http' + '://www.w3.org/2000/svg'; // SVG namespace identifier, never fetched
function el(tag, attrs, parent) {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}
function text(parent, x, y, str, attrs) {
  const t = el('text', Object.assign({ x, y, 'font-size': 11, fill: '#5b6b7a' }, attrs || {}), parent);
  t.textContent = str;
  return t;
}
const COLORS = ['#0e6b6b', '#e8a33d', '#0f2a43', '#7fb069', '#c46a4a', '#5b8dbf'];

/* ---------- state ---------- */
let state = { year: 2025, region: 'all' };
const yearIndex = y => DATA.years.indexOf(y);

/* ---------- charts (hand-rolled SVG) ---------- */
function barChart(values, labels, opts) {
  const o = Object.assign({ w: 640, h: 260, color: '#0e6b6b', unit: '', decimals: 1, ymax: null }, opts || {});
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + o.w + ' ' + o.h);
  svg.setAttribute('class', 'chart');
  svg.setAttribute('role', 'img');
  const padL = 52, padB = 28, padT = 14, padR = 10;
  const max = o.ymax || Math.max.apply(null, values) * 1.12;
  const min = Math.min(0, Math.min.apply(null, values) * 1.12);
  const iw = o.w - padL - padR, ih = o.h - padT - padB;
  const yOf = v => padT + ih * (1 - (v - min) / (max - min));
  // gridlines
  [0, 0.5, 1].forEach(f => {
    const v = min + (max - min) * f;
    const y = yOf(v);
    el('line', { x1: padL, x2: o.w - padR, y1: y, y2: y, stroke: '#d9e2ea' }, svg);
    text(svg, padL - 6, y + 4, fmt(v, o.decimals), { 'text-anchor': 'end' });
  });
  const bw = iw / values.length;
  values.forEach((v, i) => {
    const x = padL + i * bw + bw * 0.18;
    const w = bw * 0.64;
    const y = yOf(Math.max(v, 0));
    const h = Math.abs(yOf(v) - yOf(0));
    el('rect', { x: x.toFixed(1), y: y.toFixed(1), width: w.toFixed(1), height: Math.max(h, 1).toFixed(1), fill: o.color, rx: 3 }, svg);
    text(svg, x + w / 2, y - 5, fmt(v, o.decimals), { 'text-anchor': 'middle', fill: '#1c2733', 'font-weight': 700 });
    text(svg, x + w / 2, o.h - 8, labels[i], { 'text-anchor': 'middle' });
  });
  return svg;
}

function lineChart(series, labels, opts) {
  // series: [{name, values, color, dashed}]
  const o = Object.assign({ w: 640, h: 260, decimals: 1, suffix: '%' }, opts || {});
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + o.w + ' ' + o.h);
  svg.setAttribute('class', 'chart');
  svg.setAttribute('role', 'img');
  const padL = 52, padB = 28, padT = 14, padR = 10;
  const all = series.reduce((a, s) => a.concat(s.values), []);
  const max = Math.max.apply(null, all) * 1.15 + 0.5;
  const min = Math.min.apply(null, all) * 1.15 - 0.5;
  const iw = o.w - padL - padR, ih = o.h - padT - padB;
  const xOf = i => padL + iw * i / (labels.length - 1);
  const yOf = v => padT + ih * (1 - (v - min) / (max - min));
  [0, 0.25, 0.5, 0.75, 1].forEach(f => {
    const v = min + (max - min) * f;
    const y = yOf(v);
    el('line', { x1: padL, x2: o.w - padR, y1: y, y2: y, stroke: '#d9e2ea' }, svg);
    text(svg, padL - 6, y + 4, fmt(v, o.decimals) + o.suffix, { 'text-anchor': 'end' });
  });
  series.forEach(s => {
    const pts = s.values.map((v, i) => xOf(i).toFixed(1) + ',' + yOf(v).toFixed(1)).join(' ');
    el('polyline', { points: pts, fill: 'none', stroke: s.color, 'stroke-width': 2.5, 'stroke-dasharray': s.dashed ? '6 4' : 'none', 'stroke-linejoin': 'round' }, svg);
    s.values.forEach((v, i) => {
      el('circle', { cx: xOf(i), cy: yOf(v), r: 3.5, fill: s.color }, svg);
    });
  });
  labels.forEach((l, i) => text(svg, xOf(i), o.h - 8, l, { 'text-anchor': 'middle' }));
  return svg;
}

function donutChart(items, opts) {
  const o = Object.assign({ size: 260 }, opts || {});
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + o.size + ' ' + o.size);
  svg.setAttribute('class', 'chart');
  svg.setAttribute('role', 'img');
  const cx = o.size / 2, cy = o.size / 2, r = o.size / 2 - 14, inner = r * 0.58;
  const total = items.reduce((a, b) => a + b.value, 0);
  let a0 = -Math.PI / 2;
  items.forEach((it, i) => {
    const a1 = a0 + (it.value / total) * Math.PI * 2;
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    const d = 'M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
      ' L ' + xi1.toFixed(1) + ' ' + yi1.toFixed(1) + ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + xi0.toFixed(1) + ' ' + yi0.toFixed(1) + ' Z';
    el('path', { d, fill: COLORS[i % COLORS.length] }, svg);
    const mid = (a0 + a1) / 2;
    const lx = cx + (r + 26) * Math.cos(mid), ly = cy + (r + 26) * Math.sin(mid);
    a0 = a1;
  });
  const t = text(svg, cx, cy - 4, fmt(total, 1) + '%', { 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: '#0f2a43' });
  text(svg, cx, cy + 16, 'of GDP', { 'text-anchor': 'middle' });
  return svg;
}

function hbarChart(items, opts) {
  const o = Object.assign({ w: 640, rowH: 34, color: '#0e6b6b', decimals: 1, suffix: '' }, opts || {});
  const h = items.length * o.rowH + 14;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + o.w + ' ' + h);
  svg.setAttribute('class', 'chart');
  svg.setAttribute('role', 'img');
  const labelW = 130, padR = 70;
  const max = Math.max.apply(null, items.map(i => i.value)) * 1.1;
  items.forEach((it, i) => {
    const y = 8 + i * o.rowH;
    text(svg, 0, y + 15, it.label, { fill: '#1c2733', 'font-weight': 600 });
    const w = (o.w - labelW - padR) * it.value / max;
    el('rect', { x: labelW, y: y + 4, width: Math.max(w, 2), height: 14, fill: it.color || o.color, rx: 3 }, svg);
    text(svg, labelW + w + 8, y + 15, fmt(it.value, o.decimals) + o.suffix, { fill: '#1c2733', 'font-weight': 700 });
  });
  return svg;
}

/* ---------- CSV download ---------- */
function downloadCSV(filename, headers, rows) {
  const esc = v => '"' + String(v).replace(/"/g, '""') + '"';
  const csv = [headers.map(esc).join(',')]
    .concat(rows.map(r => r.map(esc).join(','))).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/* ---------- pages ---------- */
function renderOverview() {
  const i = yearIndex(state.year);
  const f = DATA.facts2025;
  const setKpi = (id, value, sub) => {
    $(id + ' .value').textContent = value;
    $(id + ' .sub').innerHTML = sub;
  };
  setKpi('#kpi-pop', fmt(DATA.population[i], 1) + 'm',
    'Median age ' + fmt(f.medianAge, 1) + ' · ' + fmt(f.urbanShare, 1) + '% urban');
  setKpi('#kpi-gdp', fmt(DATA.gdp[i], 1) + ' bn NSR',
    'Growth ' + (DATA.gdpGrowth[i] >= 0 ? '+' : '') + fmt(DATA.gdpGrowth[i], 1) + '% · per capita ' +
    fmt(DATA.gdp[i] * 1000 / DATA.population[i], 0) + ' NSR');
  setKpi('#kpi-inf', fmt(DATA.inflation[i], 1) + '%',
    'CPI, annual average · target 2–4%');
  setKpi('#kpi-unemp', fmt(DATA.unemployment[i], 1) + '%',
    'Participation ' + fmt(DATA.participation[i], 1) + '% of working age');
  $('#ov-year-label').textContent = state.year;
  const host = $('#ov-pop-chart');
  host.innerHTML = '';
  host.appendChild(barChart(DATA.population, DATA.years.map(String), { color: '#0e6b6b', decimals: 1 }));
  const host2 = $('#ov-gdp-chart');
  host2.innerHTML = '';
  host2.appendChild(lineChart([
    { name: 'GDP growth', values: DATA.gdpGrowth, color: '#0e6b6b' },
    { name: 'Inflation', values: DATA.inflation, color: '#e8a33d', dashed: true },
  ], DATA.years.map(String), {}));
  $('#ov-note').textContent = 'Population in millions; GDP growth and CPI inflation in percent. ' +
    'The 2020 dip reflects the global pandemic year; growth returned to 6.2% in 2021.';
}

function renderPopulation() {
  const i = yearIndex(state.year);
  $('#pop-year-label').textContent = state.year;
  $('#pop-total').textContent = fmt(DATA.population[i], 1) + ' million people';
  $('#pop-change').textContent = i === 0 ? 'Base year of this series'
    : 'Change on previous year: +' + fmt(DATA.population[i] - DATA.population[i - 1], 1) + ' million (' +
      fmt((DATA.population[i] / DATA.population[i - 1] - 1) * 100, 1) + '%)';
  const host = $('#pop-age-chart');
  host.innerHTML = '';
  host.appendChild(hbarChart(DATA.ageGroups.map(a => ({ label: 'Age ' + a.label, value: a.value })),
    { decimals: 1, suffix: 'm' }));
  const tb = $('#pop-age-table tbody');
  tb.innerHTML = '';
  DATA.ageGroups.forEach(a => {
    const tr = document.createElement('tr');
    const share = a.value / DATA.facts2025.population * 100;
    tr.innerHTML = '<td>' + a.label + '</td><td>' + fmt(a.value, 1) + '</td><td>' + fmt(share, 1) + '%</td>';
    tb.appendChild(tr);
  });
  $('#pop-age-table tfoot td:last-child').textContent = fmt(DATA.facts2025.population, 1);
  $('#pop-dl').onclick = () => downloadCSV('nusantara-age-groups-2025.csv',
    ['Age group', 'Population (millions)', 'Share (%)'],
    DATA.ageGroups.map(a => [a.label, fmt(a.value, 1), fmt(a.value / DATA.facts2025.population * 100, 1)]));
}

function renderEconomy() {
  const i = yearIndex(state.year);
  $('#eco-year-label').textContent = state.year;
  $('#eco-gdp').textContent = fmt(DATA.gdp[i], 1) + ' bn NSR';
  $('#eco-growth').textContent = (DATA.gdpGrowth[i] >= 0 ? '+' : '') + fmt(DATA.gdpGrowth[i], 1) + '%';
  $('#eco-trade').textContent = fmt(DATA.exports[i] - DATA.imports[i], 1) + ' bn NSR';
  $('#eco-trade-sub').textContent = 'Exports ' + fmt(DATA.exports[i], 1) + ' · imports ' + fmt(DATA.imports[i], 1) + ' bn NSR';
  const host = $('#eco-gdp-chart');
  host.innerHTML = '';
  host.appendChild(barChart(DATA.gdp, DATA.years.map(String), { color: '#0f2a43', decimals: 1 }));
  const host2 = $('#eco-sector-chart');
  host2.innerHTML = '';
  host2.appendChild(donutChart(DATA.sectors.map(s => ({ name: s.name, value: s.share }))));
  const tb = $('#eco-sector-table tbody');
  tb.innerHTML = '';
  DATA.sectors.forEach((s, k) => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td><span class="legend"><span class="sw" style="background:' + COLORS[k % COLORS.length] + '"></span>' +
      s.name + '</span></td><td>' + fmt(s.share, 1) + '%</td><td>' + s.note + '</td>';
    tb.appendChild(tr);
  });
  const tb2 = $('#eco-trade-table tbody');
  tb2.innerHTML = '';
  DATA.years.forEach((y, k) => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>' + y + '</td><td>' + fmt(DATA.exports[k], 1) + '</td><td>' + fmt(DATA.imports[k], 1) +
      '</td><td>' + fmt(DATA.exports[k] - DATA.imports[k], 1) + '</td>';
    tb2.appendChild(tr);
  });
  $('#eco-dl').onclick = () => downloadCSV('nusantara-trade-2019-2025.csv',
    ['Year', 'Exports (bn NSR)', 'Imports (bn NSR)', 'Balance (bn NSR)'],
    DATA.years.map((y, k) => [y, fmt(DATA.exports[k], 1), fmt(DATA.imports[k], 1), fmt(DATA.exports[k] - DATA.imports[k], 1)]));
}

function renderLabour() {
  const i = yearIndex(state.year);
  $('#lab-year-label').textContent = state.year;
  $('#lab-unemp').textContent = fmt(DATA.unemployment[i], 1) + '%';
  $('#lab-part').textContent = fmt(DATA.participation[i], 1) + '%';
  const employed = DATA.population[i] * DATA.participation[i] / 100 * (1 - DATA.unemployment[i] / 100);
  $('#lab-employed').textContent = fmt(employed, 1) + 'm';
  const host = $('#lab-chart');
  host.innerHTML = '';
  host.appendChild(lineChart([
    { name: 'Unemployment', values: DATA.unemployment, color: '#b3372e' },
    { name: 'Participation', values: DATA.participation, color: '#0e6b6b', dashed: true },
  ], DATA.years.map(String), { decimals: 1 }));
  const tb = $('#lab-emp-table tbody');
  tb.innerHTML = '';
  DATA.employment.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>' + e.name + '</td><td>' + fmt(e.share, 1) + '%</td>' +
      '<td><span class="bar-track" style="display:block"><span class="bar-fill" style="display:block;width:' + e.share + '%"></span></span></td>';
    tb.appendChild(tr);
  });
}

function renderPrices() {
  const i = yearIndex(state.year);
  $('#pri-year-label').textContent = state.year;
  $('#pri-cpi').textContent = fmt(DATA.inflation[i], 1) + '%';
  const host = $('#pri-monthly-chart');
  host.innerHTML = '';
  host.appendChild(barChart(DATA.monthlyInflation.map(m => m.v), DATA.monthlyInflation.map(m => m.m),
    { color: '#e8a33d', decimals: 1, ymax: 4.2 }));
  const tb = $('#pri-cpi-table tbody');
  tb.innerHTML = '';
  DATA.cpiGroups.forEach(g => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>' + g.name + '</td><td>' + fmt(g.weight, 1) + '</td><td>' + fmt(g.inflation, 1) + '%</td>';
    tb.appendChild(tr);
  });
  $('#pri-dl').onclick = () => downloadCSV('nusantara-cpi-groups-2025.csv',
    ['Group', 'Weight (%)', 'Inflation 2025 (%)'],
    DATA.cpiGroups.map(g => [g.name, fmt(g.weight, 1), fmt(g.inflation, 1)]));
}

function renderRegions() {
  const list = state.region === 'all' ? DATA.regions
    : DATA.regions.filter(r => r.name === state.region);
  const host = $('#reg-chart');
  host.innerHTML = '';
  host.appendChild(hbarChart(list.map(r => ({ label: r.name, value: r.population })),
    { decimals: 1, suffix: 'm' }));
  const tb = $('#reg-table tbody');
  tb.innerHTML = '';
  list.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>' + r.name + '</td><td>' + r.capital + '</td><td>' + fmt(r.population, 1) + '</td>' +
      '<td>' + fmt(r.gdpShare, 1) + '%</td><td>' + fmt(r.unemployment, 1) + '%</td>' +
      '<td>' + fmt(r.density, 0) + '</td><td>' + fmt(r.urban, 1) + '%</td>';
    tb.appendChild(tr);
  });
  const tot = list.reduce((a, r) => a + r.population, 0);
  $('#reg-total').textContent = 'Showing ' + list.length + ' of 6 provinces · combined population ' + fmt(tot, 1) + ' million';
  $('#reg-dl').onclick = () => downloadCSV('nusantara-regions-2025.csv',
    ['Province', 'Capital', 'Population (m)', 'GDP share (%)', 'Unemployment (%)', 'Density (per km2)', 'Urban (%)'],
    list.map(r => [r.name, r.capital, fmt(r.population, 1), fmt(r.gdpShare, 1), fmt(r.unemployment, 1), fmt(r.density, 0), fmt(r.urban, 1)]));
}

function renderMethodology() {
  const host = $('#method-list');
  host.innerHTML = '';
  DATA.methodology.forEach(m => {
    const d = document.createElement('details');
    const s = document.createElement('summary');
    s.textContent = m.q;
    const p = document.createElement('p');
    p.textContent = m.a;
    d.appendChild(s); d.appendChild(p);
    host.appendChild(d);
  });
}

function renderAll() {
  renderOverview(); renderPopulation(); renderEconomy();
  renderLabour(); renderPrices(); renderRegions(); renderMethodology();
}

/* ---------- routing ---------- */
const PAGES = ['overview', 'population', 'economy', 'labour', 'prices', 'regions', 'methodology'];
function show(page) {
  if (PAGES.indexOf(page) < 0) page = 'overview';
  $$('section.page').forEach(s => s.classList.toggle('active', s.id === 'page-' + page));
  $$('nav.mainnav a').forEach(a => a.classList.toggle('active', a.dataset.page === page));
  window.scrollTo(0, 0);
}
function route() {
  const hash = (location.hash || '#/overview').replace('#/', '');
  show(hash.split('?')[0]);
}
window.addEventListener('hashchange', route);

/* ---------- init ---------- */
function init() {
  const yearSel = $('#year-select');
  DATA.years.forEach(y => {
    const o = document.createElement('option');
    o.value = y; o.textContent = y;
    yearSel.appendChild(o);
  });
  yearSel.value = String(state.year);
  yearSel.addEventListener('change', () => {
    state.year = Number(yearSel.value);
    renderOverview(); renderPopulation(); renderEconomy(); renderLabour(); renderPrices();
  });
  const regSel = $('#region-select');
  regSel.addEventListener('change', () => { state.region = regSel.value; renderRegions(); });
  $$('.tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.card').querySelectorAll('.tabs button');
      group.forEach(b => b.classList.toggle('active', b === btn));
      const panes = btn.closest('.card').querySelectorAll('.tabpane');
      panes.forEach(p => p.classList.toggle('active', p.id === btn.dataset.tab));
    });
  });
  renderAll();
  route();
}
document.addEventListener('DOMContentLoaded', init);
