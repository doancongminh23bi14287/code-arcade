// game-blast.js — Chế độ CODE BLAST: Luyện cú pháp Endless (3 mạng + Free-Snap + Auto-Scanline)

const GameBlast = (() => {
  'use strict';

  let currentLevelIdx = 0;
  let score = 0;
  let combo = 0;
  let maxCombo = 0;
  let lives = 3;
  let selectedBlock = null;
  let isScanning = false;
  let solvedLevelsCount = 0;

  const SNAP_RADIUS = 48;
  const $ = s => document.querySelector(s);

  function init() {
    score = 0;
    combo = 0;
    maxCombo = 0;
    lives = 3;
    currentLevelIdx = 0;
    solvedLevelsCount = 0;
    selectedBlock = null;
    isScanning = false;

    renderHUD();
    loadLevel(currentLevelIdx);
  }

  function renderHUD() {
    const elScore = $('#blastScore');
    const elCombo = $('#blastCombo');
    const elLives = $('#blastLives');
    const elLevel = $('#blastLevelIndicator');

    if (elScore) elScore.textContent = score;
    if (elCombo) {
      elCombo.textContent = `x${combo}`;
      elCombo.classList.toggle('hot', combo >= 2);
    }
    if (elLives) {
      elLives.innerHTML = '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, 3 - lives));
    }
    if (elLevel) {
      elLevel.textContent = `WAVE ${solvedLevelsCount + 1}`;
    }
  }

  function loadLevel(idx) {
    const totalLevels = ARCADE_DATA.blastLevels.length;
    const lv = ARCADE_DATA.blastLevels[idx % totalLevels];
    selectedBlock = null;
    isScanning = false;

    $('#blastPrompt').textContent = lv.prompt;
    $('#blastToast').className = 'blast-toast';

    const grid = $('#blastCodeGrid');
    grid.innerHTML = '';
    grid.classList.remove('slide-out-up');
    grid.classList.add('slide-in-down');
    setTimeout(() => grid.classList.remove('slide-in-down'), 400);

    // Tạo các dòng code
    lv.lines.forEach((ln, lineIdx) => {
      const row = document.createElement('div');
      row.className = 'blast-line';
      row.dataset.lineIdx = lineIdx;

      const lnNum = document.createElement('span');
      lnNum.className = 'blast-ln';
      lnNum.textContent = String(lineIdx + 1);
      row.appendChild(lnNum);

      const codeContainer = document.createElement('div');
      codeContainer.className = 'blast-code-text';
      if (ln.indent) {
        codeContainer.style.marginLeft = `${ln.indent * 2.2}ch`;
      }

      let lineHasSlot = false;
      ln.tokens.forEach(tok => {
        if (typeof tok === 'string') {
          const sTok = document.createElement('span');
          sTok.className = 'blast-token';
          sTok.textContent = tok;
          codeContainer.appendChild(sTok);
        } else {
          // Ô trống tự do (Free-Snap Slot)
          const sz = tok.size ? tok.size.toLowerCase() : 'm';
          const slot = document.createElement('span');
          slot.className = `blast-slot size-${sz}`;
          slot.textContent = '···';
          slot.dataset.expected = tok.e;
          slot.dataset.size = sz;
          codeContainer.appendChild(slot);
          lineHasSlot = true;
        }
      });

      if (!lineHasSlot) row.dataset.static = '1';
      row.appendChild(codeContainer);
      grid.appendChild(row);
    });

    // Tạo khay các khối token (Tray)
    const tray = $('#blastTray');
    tray.innerHTML = '';

    const shuffledTray = lv.tray
      .map((item, originalIndex) => ({ item, originalIndex }))
      .sort(() => Math.random() - 0.5);

    shuffledTray.forEach(({ item, originalIndex }) => {
      const sz = item.size ? item.size.toLowerCase() : 'm';
      const block = document.createElement('div');
      block.className = `blast-block color-${originalIndex % 6} size-${sz}`;
      block.textContent = item.t;
      block.dataset.text = item.t;
      block.dataset.size = sz;
      if (item.h) block.dataset.hint = item.h;

      tray.appendChild(block);
    });

    renderHUD();
  }

  // ==========================================
  // XỬ LÝ KÉO THẢ & CHẠM CHỌN (TOUCH + MOUSE)
  // ==========================================
  function setupEvents() {
    const tray = $('#blastTray');
    const grid = $('#blastCodeGrid');

    // Chạm/Kéo từ khay Tray
    tray.addEventListener('pointerdown', e => {
      if (isScanning) return;
      const block = e.target.closest('.blast-block');
      if (!block || block.classList.contains('placed-away')) return;
      e.preventDefault();

      const isTouch = e.pointerType === 'touch';
      const offsetY = isTouch ? 50 : 0; // Đẩy khối nổi lên 50px trên mobile
      const startX = e.clientX;
      const startY = e.clientY;
      let ghost = null;
      let moved = false;

      const onPointerMove = ev => {
        if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) > (isTouch ? 6 : 4)) {
          moved = true;
          const rect = block.getBoundingClientRect();
          ghost = block.cloneNode(true);
          ghost.classList.add('blast-ghost');
          ghost.style.width = `${rect.width}px`;
          ghost.style.height = `${rect.height}px`;
          document.body.appendChild(ghost);
          block.classList.add('dragging');
        }

        if (moved && ghost) {
          ghost.style.transform = `translate(${ev.clientX - ghost.offsetWidth / 2}px, ${ev.clientY - offsetY - ghost.offsetHeight / 2}px)`;
          clearSlotHighlights();
          const targetSlot = findNearestSlot(ev.clientX, ev.clientY - offsetY);
          if (targetSlot) targetSlot.classList.add('over');
        }
      };

      const onPointerUp = ev => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        if (moved) {
          if (ghost) ghost.remove();
          block.classList.remove('dragging');
          clearSlotHighlights();
          const targetSlot = findNearestSlot(ev.clientX, ev.clientY - offsetY);
          if (targetSlot && (ev.type === 'pointerup' || ev.type === 'touchend')) {
            placeBlockIntoSlot(block, targetSlot);
          }
        } else {
          // Chạm để chọn (Touch/Click to select)
          document.querySelectorAll('.blast-block.selected').forEach(b => b.classList.remove('selected'));
          if (selectedBlock === block) {
            selectedBlock = null;
          } else {
            selectedBlock = block;
            block.classList.add('selected');
            ArcadeAudio.click();
          }
        }
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    });

    // Chạm vào slot trên Grid: nếu đang chọn khối thì đặt vào; nếu ô đã có chữ thì gỡ ra
    grid.addEventListener('click', e => {
      if (isScanning) return;
      const slot = e.target.closest('.blast-slot');
      if (!slot) return;

      if (slot.classList.contains('filled')) {
        // Gỡ khối ra trả về khay
        e.stopPropagation();
        unfillSlot(slot);
        return;
      }

      if (selectedBlock && !selectedBlock.classList.contains('placed-away')) {
        placeBlockIntoSlot(selectedBlock, slot);
      }
    });
  }

  function findNearestSlot(x, y) {
    let bestSlot = null;
    let minDistance = SNAP_RADIUS;

    document.querySelectorAll('.blast-slot:not(.filled)').forEach(s => {
      const r = s.getBoundingClientRect();
      const dx = Math.max(r.left - x, 0, x - r.right);
      const dy = Math.max(r.top - y, 0, y - r.bottom);
      const d = Math.hypot(dx, dy);
      if (d < minDistance) {
        minDistance = d;
        bestSlot = s;
      }
    });

    return bestSlot;
  }

  function clearSlotHighlights() {
    document.querySelectorAll('.blast-slot.over').forEach(s => s.classList.remove('over'));
  }

  // Đặt khối vào slot (FREE-SNAP: Cho phép xếp tự do bất kỳ khối nào)
  function placeBlockIntoSlot(block, slot) {
    if (slot.classList.contains('filled')) {
      // Nếu slot đã có chữ, trả khối cũ về khay trước
      unfillSlot(slot);
    }

    const text = block.dataset.text;
    slot.textContent = text;
    slot.classList.add('filled');
    slot.dataset.currentBlockText = text;
    slot.dataset.sourceHint = block.dataset.hint || '';

    // Ẩn khối ở khay
    block.classList.add('placed-away');
    block.classList.remove('selected');
    selectedBlock = null;
    ArcadeAudio.snap();

    // Kiểm tra xem tất cả các slot đã được điền chưa
    checkIfAllSlotsFilled();
  }

  // Trả khối đã đặt về lại khay
  function unfillSlot(slot) {
    const text = slot.dataset.currentBlockText;
    slot.textContent = '···';
    slot.classList.remove('filled', 'correct', 'wrong');
    delete slot.dataset.currentBlockText;
    delete slot.dataset.sourceHint;

    // Tìm lại khối ở khay và mở lại
    const block = [...document.querySelectorAll('.blast-block')].find(b => b.dataset.text === text && b.classList.contains('placed-away'));
    if (block) {
      block.classList.remove('placed-away');
      ArcadeAudio.click();
    }
  }

  // ==========================================
  // AUTO-SCANLINE: TỰ ĐỘNG QUÉT LASER KHI ĐẦY Ô
  // ==========================================
  function checkIfAllSlotsFilled() {
    const allSlots = [...document.querySelectorAll('.blast-slot')];
    const allFilled = allSlots.length > 0 && allSlots.every(s => s.classList.contains('filled'));

    if (allFilled) {
      startAutoScanline();
    }
  }

  function startAutoScanline() {
    if (isScanning) return;
    isScanning = true;

    const grid = $('#blastCodeGrid');
    const scanlineBar = $('#blastScanline');
    if (scanlineBar) {
      scanlineBar.classList.remove('hidden');
      scanlineBar.style.top = '0px';
    }

    const rows = [...grid.querySelectorAll('.blast-line:not([data-static])')];
    let rowStep = 0;

    function scanNextRow() {
      if (rowStep >= rows.length) {
        // QUÉT THÀNH CÔNG HẾT TẤT CẢ DÒNG: ĐÚNG TOÀN BỘ!
        if (scanlineBar) scanlineBar.classList.add('hidden');
        handleLevelVictory();
        return;
      }

      const row = rows[rowStep];
      const rowSlots = [...row.querySelectorAll('.blast-slot')];

      // Đưa laser tới dòng hiện tại
      if (scanlineBar) {
        const rowRect = row.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        scanlineBar.style.top = `${rowRect.top - gridRect.top + rowRect.height / 2}px`;
      }

      // Kiểm tra các slot trong dòng này
      const hasError = rowSlots.some(s => s.textContent !== s.dataset.expected);

      if (!hasError) {
        // Dòng này đúng
        row.classList.add('compiled');
        rowSlots.forEach(s => s.classList.add('correct'));
        ArcadeAudio.snap();
        rowStep++;
        setTimeout(scanNextRow, 220);
      } else {
        // CÓ LỖI TẠI DÒNG NÀY: DỪNG LASER, TRỪ TIM, BẬT KHỐI SAI LẠI KHAY!
        if (scanlineBar) scanlineBar.classList.add('hidden');
        handleScanlineError(row, rowSlots);
      }
    }

    setTimeout(scanNextRow, 250);
  }

  function handleLevelVictory() {
    combo++;
    maxCombo = Math.max(maxCombo, combo);
    const wavePoints = 150 + combo * 100;
    score += wavePoints;
    solvedLevelsCount++;

    ArcadeAudio.combo(combo);
    showBlastToast(combo >= 2 ? `🎉 COMBO x${combo}! +${wavePoints} PTS` : `✨ COMPILED! +${wavePoints} PTS`, true);

    // Bắn hiệu ứng pixel hạt
    burstPixels($('#blastCodeGrid'));
    renderHUD();

    // Hiệu ứng trượt đoạn code cũ lên trên và kéo câu mới từ dưới lên
    setTimeout(() => {
      const grid = $('#blastCodeGrid');
      grid.classList.add('slide-out-up');
      setTimeout(() => {
        currentLevelIdx++;
        loadLevel(currentLevelIdx);
      }, 350);
    }, 700);
  }

  function handleScanlineError(row, rowSlots) {
    lives--;
    combo = 0;
    renderHUD();
    ArcadeAudio.error();

    row.classList.add('bad-line-shake');
    setTimeout(() => row.classList.remove('bad-line-shake'), 400);

    let errorHint = 'Cú pháp dòng này chưa chính xác!';

    rowSlots.forEach(s => {
      if (s.textContent !== s.dataset.expected) {
        s.classList.add('wrong');
        if (s.dataset.sourceHint) errorHint = s.dataset.sourceHint;

        // Bật khối sai ngược lại khay sau 500ms
        setTimeout(() => {
          unfillSlot(s);
        }, 500);
      } else {
        s.classList.add('correct');
      }
    });

    showBlastToast(`💔 Mất 1 tim! Gợi ý: ${errorHint}`, false);
    isScanning = false;

    if (lives <= 0) {
      setTimeout(handleGameOver, 800);
    }
  }

  function handleGameOver() {
    ArcadeAudio.overheat();
    const modal = $('#blastGameOverModal');
    if (modal) {
      $('#finalBlastScore').textContent = score;
      $('#finalBlastWaves').textContent = solvedLevelsCount;
      $('#finalBlastCombo').textContent = `x${maxCombo}`;
      modal.classList.remove('hidden');
    }
  }

  function burstPixels(container) {
    const rect = container.getBoundingClientRect();
    const colors = ['#38b764', '#29adff', '#ffcd75', '#f4f4f4', '#ee8c2b'];
    for (let i = 0; i < 32; i++) {
      const p = document.createElement('div');
      p.className = 'blast-particle';
      p.style.left = `${rect.left + Math.random() * rect.width}px`;
      p.style.top = `${rect.top + Math.random() * rect.height}px`;
      p.style.background = colors[i % colors.length];
      document.body.appendChild(p);

      const dx = (Math.random() - 0.5) * 180;
      const dy = (Math.random() - 0.7) * 140;
      p.animate([
        { transform: 'translate(0, 0)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
      ], {
        duration: 500 + Math.random() * 350,
        easing: 'ease-out'
      }).onfinish = () => p.remove();
    }
  }

  function showBlastToast(msg, isOk = true) {
    const t = $('#blastToast');
    if (!t) return;
    t.textContent = msg;
    t.className = `blast-toast show ${isOk ? 'ok' : 'err'}`;
    clearTimeout(t._t);
    t._t = setTimeout(() => { t.className = 'blast-toast'; }, 3500);
  }

  return {
    start() {
      setupEvents();
      init();
    },
    restart() {
      const modal = $('#blastGameOverModal');
      if (modal) modal.classList.add('hidden');
      init();
    },
    quit() {
      isScanning = false;
    },
    getFinalScore() {
      return score;
    }
  };
})();
