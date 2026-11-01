import test from 'node:test';
import assert from 'node:assert/strict';
import { soundex, soundexCode } from '../src/index.js';

test('soundex returns the standard code for common names', () => {
  assert.equal(soundex('Robert'), 'R163');
  assert.equal(soundex('Rupert'), 'R163');
  assert.equal(soundex('Rubin'), 'R150');
  assert.equal(soundex('Ashcraft'), 'A261');
  assert.equal(soundex('Ashcroft'), 'A261');
  assert.equal(soundex('Tymczak'), 'T522');
  assert.equal(soundex('Pfister'), 'P236');
});

test('soundexCode is an alias for soundex', () => {
  assert.equal(soundexCode('Robert'), soundex('Robert'));
  assert.equal(soundexCode('Tymczak'), soundex('Tymczak'));
});

test('empty or non-alphabetic input returns an empty string', () => {
  assert.equal(soundex(''), '');
  assert.equal(soundex('123'), '');
  assert.equal(soundex('!@#'), '');
  assert.equal(soundex('   '), '');
});

test('single letter is padded with zeros', () => {
  assert.equal(soundex('A'), 'A000');
  assert.equal(soundex('b'), 'B000');
});

test('vowels and y are ignored for coding but reset collapsing', () => {
  // 'B' and 'B' separated by 'a' are not collapsed.
  assert.equal(soundex('Baba'), 'B100');
  // 'y' acts as a vowel separator.
  assert.equal(soundex('Bby'), 'B000');
  assert.equal(soundex('Bobby'), 'B100');
});

test('h and w are transparent for collapsing', () => {
  // 'B' and 'B' separated by 'h' are collapsed.
  assert.equal(soundex('Bhb'), 'B000');
  // 'B' and 'B' separated by 'w' are collapsed.
  assert.equal(soundex('Bwb'), 'B000');
});

test('consecutive identical codes are collapsed', () => {
  assert.equal(soundex('BB'), 'B000');
  assert.equal(soundex('Bbb'), 'B000');
  assert.equal(soundex('Lloyd'), 'L300');
});

test('first letter is always retained even if it has a code', () => {
  assert.equal(soundex('Pfister'), 'P236'); // P and F are both code 1, but P is kept
  assert.equal(soundex('Tymczak'), 'T522');
});

test('words longer than four characters are truncated', () => {
  assert.equal(soundex('Washington'), 'W252');
  assert.equal(soundex('Honeyman'), 'H555');
});

test('non-string input returns an empty string', () => {
  assert.equal(soundex(null), '');
  assert.equal(soundex(undefined), '');
  assert.equal(soundex(123), '');
});

test('case insensitivity', () => {
  assert.equal(soundex('ROBERT'), 'R163');
  assert.equal(soundex('robert'), 'R163');
  assert.equal(soundex('RoBeRt'), 'R163');
});

test('hyphens and spaces are ignored', () => {
  assert.equal(soundex('Ash-croft'), 'A261');
  assert.equal(soundex('Ash croft'), 'A261');
});
