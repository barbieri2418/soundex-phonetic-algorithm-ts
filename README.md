# soundex-phonetic-algorithm-ts

A zero-dependency TypeScript/JavaScript (ESM) library that computes the four-character Soundex phonetic code for a word, matching similar-sounding English names.

## Usage

```js
import { soundex, soundexCode } from './src/index.js';

soundex('Robert');    // 'R163'
soundex('Rupert');    // 'R163'
soundexCode('Ashcraft'); // 'A261'
```

Both functions are exported from `src/index.js`. `soundexCode` is the primary implementation; `soundex` is an alias for convenience.

## Why this library exists

Soundex is a classic algorithm for indexing names by sound, used in genealogy and record linkage. Many implementations get the edge cases wrong: they mishandle the first letter, collapse codes across vowels incorrectly, or fail on non-alphabetic input. This library implements the standard American Soundex rules with careful handling of those cases, and it has no dependencies so it runs anywhere ECMAScript modules are supported.

The trade-off: we treat `y` as a vowel for the purpose of resetting the collapse rule, which is the common interpretation for English names. Some variants encode `y` as a consonant; if you need that, you would have to modify the `VOWELS` set.

## Awkward edge

The first letter is always kept, even if it has a code that would otherwise be collapsed with a following letter. For example, `Pfister` becomes `P236`, not `P236` with the `P` dropped. This matches the standard and is the most common source of confusion.

## API

### `soundex(word: string): string`

Returns the four-character Soundex code for `word`. Returns an empty string for empty or non-alphabetic input, or for non-string input.

### `soundexCode(word: string): string`

Alias for `soundex`.
