/**
 * music.js — Karplus-Strong string synthesis
 * Andalusian cadence (A Phrygian Dominant): Am — G — F — E
 * No files. No copyright. Pure Web Audio API.
 */
(function () {
  'use strict';

  var NOTE = {
    A3:220.00, B3:246.94, C4:261.63, D4:293.66,
    E4:329.63, F4:349.23, G4:392.00, Ab4:415.30,
    A4:440.00, B4:493.88, C5:523.25, D5:587.33, E5:659.25
  };

  var BPM = 58;
  var BEAT = 60 / BPM;

  var MELODY = [
    [NOTE.A3,1.5,0.7],[NOTE.C4,0.5,0.5],[NOTE.E4,1.0,0.8],[NOTE.G4,1.0,0.6],[NOTE.A4,2.0,0.9],
    [NOTE.C5,1.0,0.8],[NOTE.B4,0.5,0.5],[NOTE.Ab4,0.5,0.6],[NOTE.A4,1.0,0.7],[NOTE.G4,1.0,0.6],[NOTE.F4,2.0,0.85],
    [NOTE.E4,1.0,0.9],[NOTE.F4,0.5,0.4],[NOTE.E4,0.5,0.5],[NOTE.D4,1.0,0.7],[NOTE.C4,1.0,0.6],[NOTE.B3,1.0,0.7],[NOTE.A3,1.0,0.5],
    [NOTE.E4,0.5,0.8],[NOTE.Ab4,0.5,0.7],[NOTE.A4,1.0,0.9],[NOTE.G4,0.5,0.5],[NOTE.F4,0.5,0.5],[NOTE.E4,3.0,0.95]
  ];

  function makeReverb(ctx, dur, decay) {
    var len = ctx.sampleRate * dur;
    var buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c);
      for (var i = 0; i < len; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/len, decay);
    }
    var rv = ctx.createConvolver(); rv.buffer = buf; return rv;
  }

  function pluck(ctx, dest, freq, gain, t) {
    var N = Math.max(2, Math.round(ctx.sampleRate / freq));
    var buf = ctx.createBuffer(1, N, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < N; i++) d[i] = Math.random()*2-1;
    var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    var delay = ctx.createDelay(1.0); delay.delayTime.value = 1/freq;
    var filt = ctx.createBiquadFilter(); filt.type='lowpass';
    filt.frequency.value = Math.min(freq*6, ctx.sampleRate*0.48); filt.Q.value=0.5;
    var fb = ctx.createGain(); fb.gain.value = 0.984;
    var env = ctx.createGain();
    env.gain.setValueAtTime(gain, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + BEAT*5);
    src.connect(delay); delay.connect(filt); filt.connect(fb); fb.connect(delay);
    delay.connect(env); env.connect(dest);
    src.start(t); src.stop(t + BEAT*6);
  }

  var actx = null, master = null, running = false, raf = null, loopTimer = null;

  function schedule(offset) {
    if (!running) return;
    var t = actx.currentTime + offset;
    var rv = makeReverb(actx, 5, 2.5);
    var rvg = actx.createGain(); rvg.gain.value = 0.55;
    rv.connect(rvg); rvg.connect(master);
    MELODY.forEach(function(n) { pluck(actx, rv, n[0], n[1]*0.7, t); t += n[1]*BEAT; });
    var dur = MELODY.reduce(function(s,n){return s+n[1];},0)*BEAT;
    loopTimer = setTimeout(function(){schedule(0.1);}, (dur - BEAT)*1000);
  }

  function start() {
    actx = new (window.AudioContext||window.webkitAudioContext)();
    if (actx.state==='suspended') actx.resume();
    master = actx.createGain();
    master.gain.setValueAtTime(0, actx.currentTime);
    master.gain.linearRampToValueAtTime(0.7, actx.currentTime+3);
    master.connect(actx.destination);
    running = true;
    schedule(1.5);
  }

  function stop() {
    running = false;
    clearTimeout(loopTimer);
    if (!actx) return;
    master.gain.setValueAtTime(master.gain.value, actx.currentTime);
    master.gain.linearRampToValueAtTime(0, actx.currentTime+2.5);
    setTimeout(function(){actx.close();actx=null;master=null;},2700);
  }

  function pulse(btn) {
    if (!running||!actx) return;
    var v = 0.5+0.5*Math.sin(actx.currentTime*1.1);
    btn.style.setProperty('--pulse', v.toFixed(3));
    raf = requestAnimationFrame(function(){pulse(btn);});
  }

  function init() {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    var btn = document.getElementById('music-btn');
    if (!btn) return;
    btn.style.setProperty('--pulse','0');
    btn.addEventListener('click', function() {
      if (!running) {
        start();
        btn.innerHTML = '&#9646;&#9646;';
        btn.setAttribute('aria-label','إيقاف الموسيقى');
        btn.classList.add('music-btn--on');
        pulse(btn);
      } else {
        stop();
        btn.innerHTML = '&#9835;';
        btn.setAttribute('aria-label','تشغيل');
        btn.classList.remove('music-btn--on');
        btn.style.setProperty('--pulse','0');
        cancelAnimationFrame(raf);
      }
    });
  }

  document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',init)
    : init();
}());
