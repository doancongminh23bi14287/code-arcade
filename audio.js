// audio.js — Bộ tổng hợp âm thanh 8-bit bằng Web Audio API
const ArcadeAudio = (() => {
  'use strict';
  let ctx = null;
  let muted = false;

  // Lấy hoặc khởi tạo AudioContext khi có tương tác đầu tiên
  function getContext() {
    if (muted) return null;
    try {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) ctx = new AudioCtx();
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    } catch (e) {
      return null;
    }
  }

  // Phát nốt vuông/tam giác đơn giản
  function playTone(freq, duration = 0.08, type = 'square', gainVal = 0.05, delay = 0) {
    const ac = getContext();
    if (!ac) return;
    try {
      const t = ac.currentTime + delay;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(gainVal, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + duration);
    } catch (e) {}
  }

  // Tạo tiếng xèo nấu ăn bằng White Noise Buffer
  function playNoise(duration = 0.35, gainVal = 0.04) {
    const ac = getContext();
    if (!ac) return;
    try {
      const bufferSize = ac.sampleRate * duration;
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.7));
      }
      const noise = ac.createBufferSource();
      noise.buffer = buffer;

      const filter = ac.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 1.2;

      const gain = ac.createGain();
      gain.gain.setValueAtTime(gainVal, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);
      noise.start();
    } catch (e) {}
  }

  return {
    toggleMute() {
      muted = !muted;
      return muted;
    },
    isMuted() {
      return muted;
    },
    // 1. Tiếng bấm nút Arcade
    click() {
      playTone(520, 0.04, 'square', 0.04);
    },
    // 2. Tiếng snap khối vào ô
    snap() {
      playTone(600, 0.05, 'triangle', 0.06);
      playTone(850, 0.04, 'triangle', 0.04, 0.03);
    },
    // 3. Chuông nhận đơn bếp (Order Bell Ding)
    orderBell() {
      playTone(880, 0.25, 'sine', 0.08);
      playTone(1760, 0.35, 'sine', 0.05, 0.02);
      playTone(2640, 0.15, 'sine', 0.02, 0.04);
    },
    // 4. Tiếng xèo nấu ăn (Sizzle)
    sizzle() {
      playNoise(0.4, 0.05);
      playTone(220, 0.12, 'sawtooth', 0.02);
    },
    // 5. Tiếng Nitro tăng tốc đua xe
    nitro() {
      const ac = getContext();
      if (!ac) return;
      try {
        const t = ac.currentTime;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.35);
        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.38);
      } catch (e) {}
    },
    // 6. Tiếng nổ Combo (tăng cao độ theo combo)
    combo(comboCount = 1) {
      const base = 440 * Math.pow(2, Math.min(comboCount, 10) * 1.5 / 12);
      [0, 4, 7, 12].forEach((interval, i) => {
        playTone(base * Math.pow(2, interval / 12), 0.1, 'square', 0.045, i * 0.05);
      });
    },
    // 7. Tiếng báo lỗi / Buzzer
    error() {
      playTone(160, 0.14, 'sawtooth', 0.06);
      playTone(115, 0.18, 'sawtooth', 0.06, 0.06);
    },
    // 8. Tiếng Overheat / Hãm xe / Tường TLE rượt đuổi
    overheat() {
      const ac = getContext();
      if (!ac) return;
      try {
        const t = ac.currentTime;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(420, t);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.3);
        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.32);
      } catch (e) {}
    },
    // 9. Tiếng phục vụ món ăn (Serve & Review)
    serve() {
      [523, 659, 784, 1047].forEach((f, i) => playTone(f, 0.14, 'triangle', 0.06, i * 0.06));
    },
    // 10. Tiếng chiến thắng / Level Clear Fanfare
    win() {
      const melody = [523, 659, 784, 1047, 784, 1047, 1318];
      melody.forEach((f, i) => playTone(f, 0.15, 'square', 0.05, i * 0.08));
    }
  };
})();
