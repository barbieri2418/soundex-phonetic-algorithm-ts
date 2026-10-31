/**
 * Soundex phonetic algorithm.
 *
 * The algorithm maps a word to a four-character code: a letter followed by
 * three digits. The letter is the first letter of the word (uppercased), and
 * the digits encode the consonant sounds of the remaining letters.
 *
 * This implementation follows the standard American Soundex rules, with one
 * deliberate simplification: it treats 'Y' as a vowel-like letter that is
 * encoded as 0 (i.e., ignored for coding but used as a separator). This is the
 * common interpretation used for English names and matches the behaviour of
 * most reference implementations.
 *
 * Edge cases handled:
 * - Empty or non-alphabetic input returns an empty string.
 * - Words shorter than the code length are padded with zeros.
 * - Consecutive letters with the same code are collapsed, but only if they are
 *   not separated by a vowel (a, e, i, o, u, y) or by 'h' or 'w'.
 * - The first letter is never removed, even if it has a code.
 */

const CODE_MAP = {
  b: '1', f: '1', p: '1', v: '1',
  c: '2', g: '2', j: '2', k: '2', q: '2', s: '2', x: '2', z: '2',
  d: '3', t: '3',
  l: '4',
  m: '5', n: '5',
  r: '6',
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

/**
 * Returns the Soundex code for a single letter, or an empty string if the
 * letter is a vowel or not alphabetic.
 * @param {string} ch A single character.
 * @returns {string} The code digit, or ''.
 */
function codeFor(ch) {
  const lower = ch.toLowerCase();
  if (VOWELS.has(lower)) return '';
  return CODE_MAP[lower] || '';
}

/**
 * Computes the Soundex code for a word.
 * @param {string} word The input word.
 * @returns {string} A four-character Soundex code, or '' if the word contains
 *   no alphabetic characters.
 */
export function soundexCode(word) {
  if (typeof word !== 'string') return '';
  const letters = word.toLowerCase().replace(/[^a-z]/g, '');
  if (letters.length === 0) return '';

  const first = letters[0].toUpperCase();
  let result = first;
  let lastCode = codeFor(letters[0]);

  for (let i = 1; i < letters.length; i++) {
    const ch = letters[i];
    const code = codeFor(ch);

    if (code === '') {
      // Vowels and y reset the "last code" so that identical codes separated
      // by a vowel are not collapsed. 'h' and 'w' are handled separately:
      // they are treated as transparent for the purpose of collapsing, but
      // they do not reset the last code.
      if (VOWELS.has(ch)) {
        lastCode = '';
      }
      // For 'h' and 'w', we do nothing: they are ignored, and lastCode remains.
      continue;
    }

    if (code !== lastCode) {
      result += code;
      lastCode = code;
    }
    // If code === lastCode, we skip this letter (collapse).
  }

  // Pad with zeros to exactly four characters.
  return (result + '000').slice(0, 4);
}

/**
 * Alias for soundexCode, provided for convenience.
 * @param {string} word The input word.
 * @returns {string} A four-character Soundex code.
 */
export function soundex(word) {
  return soundexCode(word);
}
