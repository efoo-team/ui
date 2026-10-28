import assert from 'node:assert/strict';
import test from 'node:test';
import { efooDateParser } from '../src/date-parser.ts';

test('parses complete dates and normalizes month and day', () => {
  assert.equal(efooDateParser('2026/1/2'), '2026-01-02');
  assert.equal(efooDateParser('2024/02/29'), '2024-02-29');
  assert.equal(efooDateParser('2000/02/29'), '2000-02-29');
  assert.equal(efooDateParser('0000/02/29'), '0000-02-29');
  assert.equal(efooDateParser('0099/12/31'), '0099-12-31');
  assert.equal(efooDateParser('9999/12/31'), '9999-12-31');
});

test('rejects invalid dates instead of rolling them forward', () => {
  for (const input of [
    '2026/13/45',
    '2026/00/10',
    '2026/01/00',
    '2026/04/31',
    '2026/02/29',
    '1900/02/29',
    '0001/02/29',
    '9999/12/32',
  ]) {
    assert.equal(efooDateParser(input), null, input);
  }
});

test('rejects incomplete or differently formatted input', () => {
  for (const input of [
    '',
    '2026',
    '2026/1',
    '2026/01/',
    '26/1/2',
    '2026-01-02',
    '2026/001/02',
    ' 2026/1/2',
    '2026/1/2 ',
    '2026/1/2\n',
    '2026/1/2foo',
  ]) {
    assert.equal(efooDateParser(input), null, input);
  }
});
