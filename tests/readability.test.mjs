import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { textSize, readabilityWarnings } from '../plugins/ssr-say-simple/skills/ssr-say-simple/runtime/readability.mjs';

const skill = fileURLToPath(new URL('../plugins/ssr-say-simple/skills/ssr-say-simple/', import.meta.url));
const pack = join(skill, 'runtime/pack.mjs');
test('Chinese without spaces and mixed text are measured', () => {
  assert.equal(textSize('系统等待 API 返回 3 次结果。').units, 11);
  assert.ok(readabilityWarnings('通知'.repeat(30) + '。').some(w => w.includes('50')));
  assert.deepEqual(readabilityWarnings('通知失败。内容保留！现在重试？'), []);
  assert.ok(readabilityWarnings('完成。'.repeat(7)).some(w => w.includes('6')));
});
test('English length is checked; modality and meaning are not rewritten', () => {
  assert.ok(readabilityWarnings('notification '.repeat(26) + '.').length);
  assert.deepEqual(readabilityWarnings('You should retry. It might fail. You may cancel. You shall keep the original condition.'), []);
  assert.deepEqual(readabilityWarnings('你可以取消，但建议先保存。失败时可能需要重试；必须保留原来的条件。'), []);
});
test('Packing checks Chinese prose but excludes quoted source and code', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ssr-say-simple-'));
  const src = join(dir, 'test.html'); const out = join(dir, 'out.html');
  const shell = body => `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>测试</title><link rel="stylesheet" href="htmlplan.css"><script src="htmlplan.js" defer></script><h1>测试</h1><main>${body}</main></html>`;
  const run = () => spawnSync(process.execPath, [pack, src, '--root', dir, '-o', out], { encoding: 'utf8' });
  try {
    const long = '通知'.repeat(90);
    writeFileSync(src, shell(`<p>${long}。</p>`));
    let r = run(); assert.equal(r.status, 0, r.stdout + r.stderr); assert.match(r.stdout, /简明中文/);
    writeFileSync(src, shell(`<doc-quote from="测试引文"><p>${long}。</p></doc-quote><p><code>${long}</code> 保持原文。</p>`));
    r = run(); assert.equal(r.status, 0, r.stdout + r.stderr); assert.doesNotMatch(r.stdout, /简明中文/);
    assert.ok(readFileSync(out, 'utf8').includes(long));
    writeFileSync(join(dir, 'code.js'), 'export const original = 1;');
    writeFileSync(src, shell('<doc-code src="code.js" lines="1"></doc-code>'));
    r = run(); assert.equal(r.status, 0); assert.match(readFileSync(out, 'utf8'), /export const original = 1/);
    rmSync(out);
    writeFileSync(join(dir, '.env'), 'EXAMPLE=not-a-real-secret');
    writeFileSync(src, shell('<doc-code src=".env" lines="1"></doc-code>'));
    r = run(); assert.equal(r.status, 1); assert.equal(existsSync(out), false);
    writeFileSync(src, shell('<doc-unknown></doc-unknown>'));
    r = run(); assert.equal(r.status, 1); assert.equal(existsSync(out), false);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
test('Interactive example packs without cross-machine state warnings', () => {
  const r = spawnSync(process.execPath, [pack, join(skill, 'examples/retry-explainer-zh.html'), '--lint-only'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.doesNotMatch(r.stdout, /⚠|error\(s\)/);
});
