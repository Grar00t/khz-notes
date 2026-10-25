/* KHZ Deslop v1: conservative, deterministic boundary-line cleanup.
 * No model, network, tokenizer, or guarantee of semantic equivalence.
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KHZDeslop = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const lead = new Set([
    'great question', 'thanks for your question', 'thank you for your question',
    "i'd be happy to help", 'i would be happy to help',
    'here is the answer', "here's the answer", 'here is a concise answer',
    'سؤال رائع', 'شكرا على سؤالك', 'شكرًا على سؤالك',
    'يسعدني مساعدتك', 'إليك الإجابة', 'إليك إجابة موجزة'
  ]);
  const tail = new Set([
    'i hope this helps', 'hope this helps',
    'آمل أن يكون هذا مفيدا', 'آمل أن يكون هذا مفيدًا', 'أتمنى أن يكون هذا مفيدا', 'أتمنى أن يكون هذا مفيدًا'
  ]);
  const disclaimer = 'Heuristic cleanup only. Review every removal; meaning preservation and token savings are not guaranteed.';
  function key(s) {
    // Matching normalization never rewrites retained text.
    return s.trim().replace(/[.!?،؛:؟。！]+$/u, '').trim().replace(/\u2019/g, "'").toLowerCase();
  }
  function count(s) {
    return { characters: Array.from(s).length, words: (s.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || []).length };
  }
  function clean(input) {
    if (typeof input !== 'string') throw new TypeError('KHZDeslop.clean expects a string');
    if (input.length > 1000000) throw new RangeError('Input exceeds the 1,000,000 UTF-16 code-unit limit');
    const records = [];
    // Keep original newline bytes, including mixed CRLF/LF/CR.
    const pattern = /([^\r\n]*)(\r\n|\n|\r|$)/g;
    let match, fence = null;
    while ((match = pattern.exec(input)) && match[0] !== '') {
      const text = match[1], newline = match[2];
      const marker = text.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      let protectedLine = fence !== null || /^(?: {4}|\t|\s*>)/.test(text);
      if (marker) {
        protectedLine = true;
        if (!fence) fence = { char: marker[1][0], length: marker[1].length };
        else if (marker[1][0] === fence.char && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
      }
      records.push({ text, newline, protectedLine, line: records.length + 1 });
    }
    const candidates = new Map();
    // Only boundary preambles/closings. An interior phrase is never removed.
    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      if (!r.text.trim()) continue;
      if (!r.protectedLine && lead.has(key(r.text))) candidates.set(i, 'leading-preamble');
      else break;
    }
    for (let i = records.length - 1; i >= 0; i--) {
      const r = records[i];
      if (!r.text.trim()) continue;
      if (!r.protectedLine && tail.has(key(r.text))) candidates.set(i, 'trailing-closing');
      else break;
    }
    const warnings = [disclaimer];
    if (candidates.size && !records.some((r, i) => !candidates.has(i) && r.text.trim())) {
      candidates.clear();
      warnings.push('Kept the original because cleanup would remove all nonblank content.');
    }
    const removals = [];
    const cleaned = records.map((r, i) => {
      if (!candidates.has(i)) return r.text + r.newline;
      removals.push({ line: r.line, text: r.text, newline: r.newline, reason: candidates.get(i) });
      return '';
    }).join('');
    const before = count(input), after = count(cleaned);
    return {
      original: input, cleaned, changed: cleaned !== input, removals,
      metrics: { before, after, removedCharacters: before.characters - after.characters, removedWords: before.words - after.words },
      warnings
    };
  }
  function transform(input) {
    const r = clean(input);
    return Object.assign({}, r, { output: r.cleaned, removed: r.removals,
      beforeWords: r.metrics.before.words, afterWords: r.metrics.after.words,
      beforeChars: r.metrics.before.characters, afterChars: r.metrics.after.characters });
  }
  return Object.freeze({ version: '1.0.0', clean, transform });
});
