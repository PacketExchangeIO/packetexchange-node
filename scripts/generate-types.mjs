#!/usr/bin/env node
/**
 * Generate SDK types from the OpenAPI document.
 *
 *   node scripts/generate-types.mjs [path/to/openapi.json]
 *
 * Reads openapi.json at the repository root (a copy of the document the API serves at
 * https://packetexchange.io/api/v1/docs/json) and writes src/generated/schemas.ts:
 *  - one exported type per `components.schemas` entry (Money is a string alias);
 *  - `Operations`, a type-level table of every operation (id -> method, path, tag).
 *
 * A small purpose-built generator keeps the build offline and dependency-free. The
 * document uses a small, predictable subset of JSON Schema; anything outside it
 * degrades to `unknown` rather than failing the build.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const specPath = resolve(process.argv[2] ?? resolve(here, '../openapi.json'));
const outPath = resolve(here, '../src/generated/schemas.ts');

const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const schemas = spec.components?.schemas ?? {};

/** A component name as a safe TS identifier (they already are, but be defensive). */
const ident = (name) => name.replace(/[^A-Za-z0-9_]/g, '_');

/** Render a JSDoc block, or nothing. Escapes a stray comment terminator. */
function jsdoc(text, indent = '') {
  if (!text) return '';
  const lines = String(text).replace(/\*\//g, '*\\/').split('\n');
  if (lines.length === 1) return `${indent}/** ${lines[0]} */\n`;
  return `${indent}/**\n${lines.map((l) => `${indent} * ${l}`.trimEnd()).join('\n')}\n${indent} */\n`;
}

/** Quote a property key only when it is not a plain identifier. */
const propKey = (k) => (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k));

/**
 * JSON Schema (OpenAPI 3.0 dialect) -> TypeScript type expression.
 * Covers $ref, enums, nullable, objects, arrays, records, unions (anyOf/oneOf) and
 * intersections (allOf).
 */
function tsType(s, indent = '') {
  if (!s || typeof s !== 'object') return 'unknown';
  let t;
  if (s.$ref) {
    t = ident(s.$ref.split('/').pop());
  } else if (Array.isArray(s.enum)) {
    t = s.enum.map((v) => JSON.stringify(v)).join(' | ') || 'never';
  } else if (s.anyOf || s.oneOf) {
    t = (s.anyOf ?? s.oneOf).map((x) => wrap(tsType(x, indent))).join(' | ');
  } else if (s.allOf) {
    t = s.allOf.map((x) => wrap(tsType(x, indent))).join(' & ');
  } else {
    const type = Array.isArray(s.type) ? s.type : [s.type];
    const parts = type.map((ty) => {
      switch (ty) {
        case 'string':
          return s.format === 'binary' ? 'Blob | string' : 'string';
        case 'integer':
        case 'number':
          return 'number';
        case 'boolean':
          return 'boolean';
        case 'null':
          return 'null';
        case 'array':
          return `Array<${tsType(s.items, indent)}>`;
        case 'object':
        case undefined:
          return objectType(s, indent);
        default:
          return 'unknown';
      }
    });
    t = parts.join(' | ');
  }
  if (s.nullable) t = `${wrap(t)} | null`;
  return t;
}

/** Parenthesise a union/intersection before combining it with another operator. */
function wrap(t) {
  return /[|&]/.test(t) && !/^[{(]/.test(t) ? `(${t})` : t;
}

function objectType(s, indent) {
  const props = s.properties ?? {};
  const required = new Set(s.required ?? []);
  const inner = indent + '  ';
  const lines = [];
  for (const [k, v] of Object.entries(props)) {
    lines.push(jsdoc(v?.description, inner) + `${inner}${propKey(k)}${required.has(k) ? '' : '?'}: ${tsType(v, inner)};`);
  }
  // A record or open object: allow arbitrary extra keys.
  const ap = s.additionalProperties;
  if (ap === true || (ap && typeof ap === 'object' && Object.keys(ap).length === 0)) {
    lines.push(`${inner}[key: string]: unknown;`);
  } else if (ap && typeof ap === 'object') {
    lines.push(`${inner}[key: string]: ${tsType(ap, inner)};`);
  }
  if (!lines.length) return s.type === 'object' ? 'Record<string, unknown>' : 'unknown';
  return `{\n${lines.join('\n')}\n${indent}}`;
}

// ── Emit ─────────────────────────────────────────────────────────────────────

let out = `/* eslint-disable */
// Do not edit by hand: produced by scripts/generate-types.mjs.
// Source: openapi.json (PacketExchange API ${spec.info?.version ?? ''}).
// Regenerate with: npm run generate
//
// Every type below mirrors a schema in the public OpenAPI document. Money fields are
// USD decimal strings with 6 places ("0.012500"): do arithmetic with a decimal
// library, not floating point.

`;

for (const [name, s] of Object.entries(schemas)) {
  const id = ident(name);
  out += jsdoc(s.description ?? (name === 'Money' ? 'USD amount as a 6-decimal string, e.g. "0.012500".' : undefined));
  const t = tsType(s);
  // Objects become interfaces (better editor hovers); everything else a type alias.
  if (t.startsWith('{') && !s.nullable) out += `export interface ${id} ${t}\n\n`;
  else out += `export type ${id} = ${t};\n\n`;
}

// Operation table: lets callers (and the SDK's own tests) look an endpoint up by its
// stable operationId instead of hard-coding a path string.
const ops = [];
for (const [path, item] of Object.entries(spec.paths ?? {})) {
  for (const [method, op] of Object.entries(item)) {
    if (!op?.operationId) continue;
    ops.push({ id: op.operationId, method: method.toUpperCase(), path, tag: op.tags?.[0] ?? '', summary: op.summary ?? '' });
  }
}
ops.sort((a, b) => a.id.localeCompare(b.id));
// Type-only on purpose: a runtime table of every operation would add well over 100 KB
// to each bundle for a lookup most callers never make. As a type it costs nothing.
out += `/** Every operation in the spec, keyed by operationId. Paths include the /api/v1 prefix. */\n`;
out += `export interface Operations {\n`;
for (const o of ops) {
  out += jsdoc(o.summary, '  ');
  out += `  ${propKey(o.id)}: { method: ${JSON.stringify(o.method)}; path: ${JSON.stringify(o.path)}; tag: ${JSON.stringify(o.tag)} };\n`;
}
out += `}\n\nexport type OperationId = keyof Operations;\n`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, out);
console.log(`${Object.keys(schemas).length} schema types + ${ops.length} operations -> ${outPath}`);
