/* KHZ deterministic prompt assembler. Local formatting, not AI optimization. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.KHZPrompt = api; root.KHZPromptCompiler = api; }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var MAX_FIELD = 50000;
  var MAX_TOTAL = 200000;
  function escapeXML(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\r/g, '&#13;');
  }
  function build(form) {
    if (!form || typeof form !== 'object' || Array.isArray(form)) {
      throw new TypeError('Prompt fields must be an object.');
    }
    var fields = [
      ['task', form.task], ['context', form.context], ['constraints', form.constraints],
      ['output_format', form.format === undefined ? form.outputFormat : form.format],
      ['language', form.language], ['style', form.style]
    ];
    var total = 0;
    var parts = [];
    var missing = [];
    fields.forEach(function (entry) {
      var name = entry[0], value = entry[1];
      if (value === undefined || value === null) value = '';
      if (typeof value !== 'string') throw new TypeError(name + ' must be text.');
      if (value.length > MAX_FIELD) throw new RangeError(name + ' exceeds 50000 characters.');
      total += value.length;
      // XML 1.0 cannot encode these controls or unpaired surrogate code units.
      if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/.test(value) ||
          /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(value)) {
        throw new TypeError(name + ' contains characters not supported by XML 1.0.');
      }
      if (!value.trim()) {
        if (name === 'task') throw new TypeError('A non-empty task is required.');
        missing.push(name);
        return;
      }
      parts.push('  <' + name + '>' + escapeXML(value) + '</' + name + '>');
    });
    if (total > MAX_TOTAL) throw new RangeError('Combined input exceeds 200000 characters.');
    var warnings = ['Deterministic formatting only; no model execution, optimization, or prompt-injection protection is guaranteed.'];
    if (missing.length) warnings.push('Optional fields omitted because they were not supplied: ' + missing.join(', ') + '.');
    return { output: '<prompt>\n' + parts.join('\n') + '\n</prompt>', warnings: warnings, omittedFields: missing };
  }
  function compile(form) { return build(form).output; }
  return Object.freeze({ version: '1.0.0', compile: compile, build: build });
}));
