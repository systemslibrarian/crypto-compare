import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));
const compiler = path.join(root, 'node_modules/.bin/tsc');
const native = require('@typescript/native/package.json');
const api = require('typescript/package.json');

assert.equal(native.name, 'typescript');
assert.equal(native.version, '7.0.2');
assert.equal(api.name, '@typescript/typescript6');
assert.equal(api.version, '6.0.2');
assert.match(realpathSync(compiler), /[\\/]@typescript[\\/]native[\\/]bin[\\/]tsc$/);
assert.match(execFileSync(compiler, ['--version'], { encoding: 'utf8' }), /^Version 7\.0\.2\s*$/);
assert.match(ts.version, /^6\.0\./);
assert.equal(typeof ts.createProgram, 'function');

console.log(`TypeScript compiler ${native.version}; JavaScript API ${ts.version}`);
