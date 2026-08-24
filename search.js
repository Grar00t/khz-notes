/**
 * search.js — BM25 search engine (browser, pure JS)
 * Ports Athar.Engine BM25 algorithm to JavaScript.
 * No server. No index file. Runs entirely client-side.
 *
 * k1 = 1.5, b = 0.75 (same as athar_index.c)
 */
(function () {
  'use strict';

  /* ── BM25 Engine ────────────────────────────────────────── */
  function BM25(k1, b) {
    this.k1   = k1  || 1.5;
    this.b    = b   || 0.75;
    this.docs = [];
    this.idx  = {};   // term -> [{id, tf}]
    this.avgdl = 0;
  }

  BM25.prototype.tokenize = function (text) {
    return (text || '')
      .toLowerCase()
      .replace(/[\u0640\u064b-\u065f]/g, '')  // strip Arabic diacritics
      .split(/[\s\u060c\u061b\u061f\u002e\u002c\u003a\u0021\u003f\(\)\[\]\{\}\/\\"\u2014\u2013\-]+/)
      .filter(function (t) { return t.length > 1; });
  };

  BM25.prototype.add = function (doc) {
    var id    = this.docs.length;
    var terms = this.tokenize(doc.title + ' ' + doc.title + ' ' + doc.text); // title weighted x2
    var dl    = terms.length;
    var tf    = {};
    terms.forEach(function (t) { tf[t] = (tf[t] || 0) + 1; });

    this.docs.push({ id: id, meta: doc, dl: dl, tf: tf });
    this.avgdl = ((this.avgdl * id) + dl) / (id + 1);

    var self = this;
    Object.keys(tf).forEach(function (t) {
      if (!self.idx[t]) self.idx[t] = [];
      self.idx[t].push({ id: id, tf: tf[t] });
    });
  };

  BM25.prototype.search = function (query, topK) {
    var terms  = this.tokenize(query);
    var scores = {};
    var N      = this.docs.length;
    var k1     = this.k1, b = this.b, avgdl = this.avgdl || 1;
    var self   = this;

    terms.forEach(function (term) {
      var postings = self.idx[term] || [];
      var df       = postings.length;
      if (!df) return;
      var idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);

      postings.forEach(function (p) {
        var dl     = self.docs[p.id].dl || 1;
        var tf     = p.tf;
        var tfNorm = tf * (k1 + 1) / (tf + k1 * (1 - b + b * dl / avgdl));
        scores[p.id] = (scores[p.id] || 0) + idf * tfNorm;
      });
    });

    return Object.keys(scores)
      .map(function (id) { return { meta: self.docs[id].meta, score: scores[id] }; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, topK || 5);
  };

  /* ── Index articles ───────────────────────────────────────── */
  var engine = new BM25(1.5, 0.75);

  function initSearch() {
    if (typeof ARTICLES === 'undefined') return;
    ARTICLES.forEach(function (a) { engine.add(a); });

    var input   = document.getElementById('search-input');
    var results = document.getElementById('search-results');
    if (!input || !results) return;

    var timer = null;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      var q = input.value.trim();
      if (!q) { results.innerHTML = ''; return; }
      timer = setTimeout(function () { render(q); }, 180);
    });

    function render(q) {
      var hits = engine.search(q, 5);
      if (!hits.length) {
        results.innerHTML = '<p class="search-empty">لا نتائج.</p>';
        return;
      }
      results.innerHTML = hits.map(function (h) {
        var a  = h.meta;
        var sc = h.score.toFixed(3);
        return '<div class="search-result">' +
          '<div class="sr-title">' + a.title + '</div>' +
          '<div class="sr-snippet">' + a.excerpt + '</div>' +
          '<span class="sr-score">BM25 ' + sc + '</span>' +
          '</div>';
      }).join('');
    }
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initSearch)
    : initSearch();
}());
