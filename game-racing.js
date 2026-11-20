// game-racing.js — Chế độ BIG-O GRAND PRIX: MCQ Speed Run (DSA & Tường lửa TLE)

const GameRacing = (() => {
  'use strict';

  let canvas = null;
  let ctx = null;
  let animId = null;

  // Trạng thái xe & cuộc đua
  let playerLane = 1; // 0: Trái, 1: Giữa, 2: Phải
  let targetX = 0;
  let currentX = 0;
  let carSpeed = 6;
  let baseSpeed = 6;
  let nitroTime = 0;
  let overheatTime = 0;

  let score = 0;
  let combo = 0;
  let maxCombo = 0;
  let tleDistance = 85; // 0..100 (0 = TLE nuốt chửng xe = Game Over)
  let currentQuestionIdx = 0;
  let questionsAnswered = 0;

  // Cổng câu hỏi đang di chuyển trên đường đua
  let activeGates = null; // { z: 1.0, question, gates: [...] }
  let roadOffset = 0;
  let isGameOver = false;
  let isPaused = false;

  const $ = s => document.querySelector(s);

  function init() {
    canvas = document.getElementById('racingCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    playerLane = 1;
    score = 0;
    combo = 0;
    maxCombo = 0;
    tleDistance = 85;
    currentQuestionIdx = 0;
    questionsAnswered = 0;
    nitroTime = 0;
    overheatTime = 0;
    isGameOver = false;
    isPaused = false;
    activeGates = null;

    currentX = getLaneCenterX(playerLane);
    targetX = currentX;

    spawnQuestionGate(0);
    renderHUD();

    if (animId) cancelAnimationFrame(animId);
    lastTimestamp = performance.now();
    animId = requestAnimationFrame(gameLoop);
  }

  function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 600;
    canvas.height = rect.height || 420;
    currentX = getLaneCenterX(playerLane);
    targetX = currentX;
  }

  function getLaneCenterX(lane) {
    if (!canvas) return 300;
    const laneWidth = canvas.width / 3;
    return laneWidth * lane + laneWidth / 2;
  }

  function spawnQuestionGate(qIdx) {
    const list = ARCADE_DATA.racingQuestions;
    const q = list[qIdx % list.length];
    activeGates = {
      z: 1.0, // 1.0 = xa chân trời, 0.0 = ngang xe
      question: q
    };
    renderQuestionHUD(q);
  }

  function renderQuestionHUD(q) {
    const elTitle = $('#racingQuestionTitle');
    const elText = $('#racingQuestionText');
    if (elTitle) elTitle.textContent = `Q${questionsAnswered + 1}: ${q.title}`;
    if (elText) elText.textContent = q.question;
  }

  function renderHUD() {
    const elScore = $('#racingScore');
    const elCombo = $('#racingCombo');
    const elTleBar = $('#racingTleBar');
    const elTleText = $('#racingTleText');

    if (elScore) elScore.textContent = score;
    if (elCombo) {
      elCombo.textContent = `x${combo}`;
      elCombo.classList.toggle('hot', combo >= 2);
    }
    if (elTleBar) {
      const pct = Math.max(0, Math.min(100, Math.round(tleDistance)));
      elTleBar.style.width = `${pct}%`;
      if (pct > 50) elTleBar.style.background = '#38b764';
      else if (pct > 25) elTleBar.style.background = '#ffcd75';
      else elTleBar.style.background = '#ef4a5a';
    }
    if (elTleText) {
      elTleText.textContent = `${Math.round(tleDistance)}m`;
    }
  }

  // ==========================================
  // VÒNG LẶP GAME CHÍNH (CANVAS 60FPS)
  // ==========================================
  let lastTimestamp = performance.now();

  function gameLoop(now) {
    const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
    lastTimestamp = now;

    if (!isPaused && !isGameOver) {
      update(dt);
    }
    render();

    if (!isGameOver) {
      animId = requestAnimationFrame(gameLoop);
    }
  }

  function update(dt) {
    // Xử lý hiệu ứng Nitro / Overheat
    if (nitroTime > 0) {
      nitroTime -= dt;
      carSpeed = baseSpeed * 1.8;
      tleDistance = Math.min(100, tleDistance + 8 * dt);
    } else if (overheatTime > 0) {
      overheatTime -= dt;
      carSpeed = baseSpeed * 0.45;
      tleDistance = Math.max(0, tleDistance - 18 * dt);
    } else {
      carSpeed = baseSpeed;
      // Tường lửa TLE bò dần lên nếu không có nitro
      tleDistance = Math.max(0, tleDistance - 4.2 * dt);
    }

    // Cuộn vạch đường
    roadOffset = (roadOffset + carSpeed * 40 * dt) % 60;

    // Di chuyển xe mượt mà giữa các làn
    targetX = getLaneCenterX(playerLane);
    currentX += (targetX - currentX) * 12 * dt;

    // Cổng câu hỏi tiến lại gần
    if (activeGates) {
      activeGates.z -= (carSpeed * 0.18) * dt;

      // Khi xe đi qua cổng (z <= 0.08)
      if (activeGates.z <= 0.08) {
        checkGateCollision();
      }
    }

    renderHUD();

    // Tường lửa TLE chạm xe = Game Over
    if (tleDistance <= 0) {
      handleTleGameOver();
    }
  }

  function checkGateCollision() {
    const q = activeGates.question;
    const chosenGate = q.gates.find(g => g.lane === playerLane);

    if (chosenGate && chosenGate.optimal) {
      // ĐÚNG CỔNG TỐI ƯU -> KÍCH HOẠT NITRO!
      combo++;
      maxCombo = Math.max(maxCombo, combo);
      const points = 200 + combo * 100;
      score += points;
      questionsAnswered++;
      nitroTime = 2.4;
      overheatTime = 0;
      tleDistance = Math.min(100, tleDistance + 30);

      ArcadeAudio.nitro();
      showRacingToast(`🚀 NITRO BOOST! +${points} PTS (${chosenGate.explain})`, true);
    } else {
      // CHỌN CỔNG CHẬM HOẶC SAI -> OVERHEAT!
      combo = 0;
      overheatTime = 2.2;
      nitroTime = 0;
      tleDistance = Math.max(0, tleDistance - 35);
      questionsAnswered++;

      ArcadeAudio.overheat();
      const reason = chosenGate ? chosenGate.explain : 'Sai làn đường!';
      showRacingToast(`⚠️ OVERHEAT CHẬM LẠI! ${reason}`, false);
    }

    // Nạp câu hỏi tiếp theo
    currentQuestionIdx++;
    spawnQuestionGate(currentQuestionIdx);
  }

  function handleTleGameOver() {
    isGameOver = true;
    ArcadeAudio.overheat();

    const modal = $('#racingGameOverModal');
    if (modal) {
      $('#finalRacingScore').textContent = score;
      $('#finalRacingQuestions').textContent = questionsAnswered;
      $('#finalRacingCombo').textContent = `x${maxCombo}`;
      modal.classList.remove('hidden');
    }
  }

  // ==========================================
  // VẼ ĐỒ HỌA RETRO CANVAS
  // ==========================================
  function render() {
    if (!ctx || !canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    // Bầu trời đêm Cyberpunk Pixel
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
    skyGrad.addColorStop(0, '#0d0d1a');
    skyGrad.addColorStop(1, '#261b40');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.45);

    // Đường chân trời & Núi pixel xa xa
    drawHorizonGrid(w, h);

    // Mặt đường đua 3 làn
    drawRoad(w, h);

    // Cổng trắc nghiệm (3 gates)
    if (activeGates) {
      drawGates(w, h, activeGates);
    }

    // Vẽ xe người chơi
    drawPlayerCar(currentX, h - 72);

    // Vẽ bức tường lửa TLE phía sau xe
    drawTleWall(w, h, tleDistance);
  }

  function drawHorizonGrid(w, h) {
    const horizonY = h * 0.38;
    ctx.strokeStyle = '#3b2466';
    ctx.lineWidth = 1;

    // Mặt trăng neon
    ctx.fillStyle = '#ee8c2b';
    ctx.beginPath();
    ctx.arc(w * 0.8, horizonY - 35, 26, 0, Math.PI * 2);
    ctx.fill();

    // Dãy nhà pixel phía xa
    ctx.fillStyle = '#17152b';
    for (let i = 0; i < 14; i++) {
      const bh = 15 + ((i * 19) % 35);
      const bw = w / 12;
      ctx.fillRect(i * bw - 10, horizonY - bh, bw + 2, bh);
    }
  }

  function drawRoad(w, h) {
    const horizonY = h * 0.38;
    const roadTopW = w * 0.35;
    const roadBotW = w * 0.94;

    // Nền đường đua
    ctx.fillStyle = '#141624';
    ctx.beginPath();
    ctx.moveTo((w - roadTopW) / 2, horizonY);
    ctx.lineTo((w + roadTopW) / 2, horizonY);
    ctx.lineTo((w + roadBotW) / 2, h);
    ctx.lineTo((w - roadBotW) / 2, h);
    ctx.closePath();
    ctx.fill();

    // Viền lề đường vạch đỏ/trắng
    drawKerb(w, h, horizonY, roadTopW, roadBotW);

    // 2 vạch kẻ phân 3 làn đường (Làn 0, 1, 2)
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 16]);
    ctx.lineDashOffset = -roadOffset;

    for (let i = 1; i <= 2; i++) {
      const topX = (w - roadTopW) / 2 + (roadTopW / 3) * i;
      const botX = (w - roadBotW) / 2 + (roadBotW / 3) * i;
      ctx.beginPath();
      ctx.moveTo(topX, horizonY);
      ctx.lineTo(botX, h);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  function drawKerb(w, h, horizonY, roadTopW, roadBotW) {
    const steps = 14;
    for (let i = 0; i < steps; i++) {
      const t1 = i / steps;
      const t2 = (i + 1) / steps;
      const y1 = horizonY + (h - horizonY) * t1;
      const y2 = horizonY + (h - horizonY) * t2;

      const halfW1 = (roadTopW + (roadBotW - roadTopW) * t1) / 2;
      const halfW2 = (roadTopW + (roadBotW - roadTopW) * t2) / 2;

      ctx.fillStyle = ((i + Math.floor(roadOffset / 15)) % 2 === 0) ? '#ef4a5a' : '#f4f4f4';

      // Trái
      ctx.beginPath();
      ctx.moveTo(w / 2 - halfW1 - 12, y1);
      ctx.lineTo(w / 2 - halfW1, y1);
      ctx.lineTo(w / 2 - halfW2, y2);
      ctx.lineTo(w / 2 - halfW2 - 16, y2);
      ctx.fill();

      // Phải
      ctx.beginPath();
      ctx.moveTo(w / 2 + halfW1, y1);
      ctx.lineTo(w / 2 + halfW1 + 12, y1);
      ctx.lineTo(w / 2 + halfW2 + 16, y2);
      ctx.lineTo(w / 2 + halfW2, y2);
      ctx.fill();
    }
  }

  function drawGates(w, h, activeG) {
    const horizonY = h * 0.38;
    const progress = Math.max(0, Math.min(1, 1 - activeG.z));
    const gateY = horizonY + (h - horizonY - 70) * progress;
    const scale = 0.3 + 0.7 * progress;

    const laneW = (w * (0.35 + 0.59 * progress)) / 3;
    const roadLeft = w / 2 - (laneW * 3) / 2;

    activeG.question.gates.forEach(gate => {
      const gateX = roadLeft + laneW * gate.lane + laneW / 2;
      const boxW = Math.max(50, 110 * scale);
      const boxH = Math.max(24, 46 * scale);

      ctx.save();
      ctx.translate(gateX, gateY);

      // Khung cổng Portal Neon
      ctx.fillStyle = '#0f111d';
      ctx.strokeStyle = gate.optimal ? '#38b764' : '#29adff';
      ctx.lineWidth = 3 * scale;
      ctx.fillRect(-boxW / 2, -boxH / 2, boxW, boxH);
      ctx.strokeRect(-boxW / 2, -boxH / 2, boxW, boxH);

      // Cột đỡ 2 bên cổng
      ctx.fillStyle = '#ffcd75';
      ctx.fillRect(-boxW / 2 - 4 * scale, -boxH / 2, 4 * scale, boxH + 8 * scale);
      ctx.fillRect(boxW / 2, -boxH / 2, 4 * scale, boxH + 8 * scale);

      // Chữ nhãn độ phức tạp / CTDL
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10, Math.round(15 * scale))}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(gate.label, 0, 0);

      // Nhãn làn (A / B / C)
      ctx.fillStyle = '#ffcd75';
      ctx.font = `${Math.max(8, Math.round(10 * scale))}px monospace`;
      const laneLetter = gate.lane === 0 ? 'LÀN TRÁI' : gate.lane === 1 ? 'LÀN GIỮA' : 'LÀN PHẢI';
      ctx.fillText(laneLetter, 0, -boxH / 2 - 8 * scale);

      ctx.restore();
    });
  }

  function drawPlayerCar(x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Khói Nitro xanh hoặc Khói đen Overheat
    if (nitroTime > 0) {
      ctx.fillStyle = '#29adff';
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(-16 + (Math.random() * 32), 28 + Math.random() * 24, 4 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (overheatTime > 0) {
      ctx.fillStyle = '#222222';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(-14 + (Math.random() * 28), 24 + Math.random() * 20, 5 + Math.random() * 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Thân xe đua Pixel 8-bit
    // Bánh xe
    ctx.fillStyle = '#111';
    ctx.fillRect(-22, -18, 8, 14); // Bánh trước trái
    ctx.fillRect(14, -18, 8, 14);  // Bánh trước phải
    ctx.fillRect(-24, 10, 8, 18);  // Bánh sau trái
    ctx.fillRect(16, 10, 8, 18);   // Bánh sau phải

    // Thân chính
    const carColor = nitroTime > 0 ? '#29adff' : overheatTime > 0 ? '#ef4a5a' : '#ee8c2b';
    ctx.fillStyle = carColor;
    ctx.fillRect(-16, -14, 32, 40);

    // Mũi xe nhọn
    ctx.beginPath();
    ctx.moveTo(-16, -14);
    ctx.lineTo(0, -28);
    ctx.lineTo(16, -14);
    ctx.fill();

    // Buồng lái / Kính chắn gió
    ctx.fillStyle = '#1a1c2c';
    ctx.fillRect(-10, -6, 20, 14);
    ctx.fillStyle = '#f4f4f4';
    ctx.fillRect(-6, -2, 12, 6);

    // Cánh gió đuôi xe
    ctx.fillStyle = '#222';
    ctx.fillRect(-20, 24, 40, 6);

    ctx.restore();
  }

  function drawTleWall(w, h, dist) {
    // Khoảng cách TLE: dist càng nhỏ thì ngọn lửa càng tiến cao lên phía sau xe
    if (dist > 75) return; // Khoảng cách còn xa thì chưa thấy lửa

    const intensity = Math.max(0, 1 - dist / 75); // 0..1
    const fireHeight = 85 * intensity;
    const fireY = h - fireHeight;

    // Gradient ngọn lửa
    const fireGrad = ctx.createLinearGradient(0, h, 0, fireY);
    fireGrad.addColorStop(0, 'rgba(239, 74, 90, 0.9)');
    fireGrad.addColorStop(0.6, 'rgba(238, 140, 43, 0.7)');
    fireGrad.addColorStop(1, 'rgba(255, 205, 117, 0)');

    ctx.fillStyle = fireGrad;
    ctx.fillRect(0, fireY, w, fireHeight);

    // Răng cưa ngọn lửa pixel bập bùng
    ctx.fillStyle = '#ef4a5a';
    const flameCount = 18;
    const fw = w / flameCount;
    const now = performance.now();
    for (let i = 0; i < flameCount; i++) {
      const offset = Math.sin((now / 120) + i) * 16 * intensity;
      ctx.beginPath();
      ctx.moveTo(i * fw, h);
      ctx.lineTo(i * fw + fw / 2, fireY - offset);
      ctx.lineTo((i + 1) * fw, h);
      ctx.fill();
    }

    // Chữ cảnh báo TLE WALL
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`🔥 TƯỜNG LỬA TLE ĐANG ÁP SÁT! (${Math.round(dist)}m) 🔥`, w / 2, h - 14);
  }

  function showRacingToast(msg, isOk = true) {
    const t = $('#racingToast');
    if (!t) return;
    t.textContent = msg;
    t.className = `racing-toast show ${isOk ? 'ok' : 'err'}`;
    clearTimeout(t._t);
    t._t = setTimeout(() => { t.className = 'racing-toast'; }, 3000);
  }

  // ==========================================
  // ĐIỀU KHIỂN BÀN PHÍM & CẢM ỨNG
  // ==========================================
  function moveLeft() {
    if (playerLane > 0) {
      playerLane--;
      ArcadeAudio.click();
    }
  }

  function moveRight() {
    if (playerLane < 2) {
      playerLane++;
      ArcadeAudio.click();
    }
  }

  function setupControls() {
    // Phím A / D / Mũi tên Trái / Phải
    window.addEventListener('keydown', e => {
      const activeGame = window.ArcadeApp ? window.ArcadeApp.getActiveGame() : null;
      if (activeGame !== 'racing') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        moveRight();
      }
    });

    // Nút ảo trên Mobile
    const btnLeft = $('#btnRacingLeft');
    const btnRight = $('#btnRacingRight');
    if (btnLeft) btnLeft.addEventListener('pointerdown', e => { e.preventDefault(); moveLeft(); });
    if (btnRight) btnRight.addEventListener('pointerdown', e => { e.preventDefault(); moveRight(); });

    // Chạm trực tiếp vào nửa trái/phải Canvas
    if (canvas) {
      canvas.addEventListener('pointerdown', e => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX < rect.width * 0.4) moveLeft();
        else if (clickX > rect.width * 0.6) moveRight();
      });
    }
  }

  return {
    start() {
      setupControls();
      init();
    },
    restart() {
      const modal = $('#racingGameOverModal');
      if (modal) modal.classList.add('hidden');
      init();
    },
    quit() {
      isPaused = true;
      if (animId) cancelAnimationFrame(animId);
    },
    getFinalScore() {
      return score;
    }
  };
})();
