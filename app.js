// app.js — Arcade Hub Router, Leaderboard & Global Controls

const ArcadeApp = (() => {
  'use strict';

  let activeGame = 'hub'; // 'hub' | 'kitchen' | 'blast' | 'racing'
  const $ = s => document.querySelector(s);

  // Mẫu dữ liệu bảng xếp hạng mặc định nếu chưa có
  const DEFAULT_LEADERBOARDS = {
    kitchen: [
      { name: 'CHEF_PY', score: 1250, note: '5/5 Đơn hoàn hảo', date: '20/11' },
      { name: 'AN_CODE', score: 980, note: '4/5 Đơn hạng S', date: '19/11' },
      { name: 'PIZZA99', score: 720, note: '3/5 Đơn hạng A', date: '18/11' }
    ],
    blast: [
      { name: 'LASER_X', score: 2450, note: 'Wave 14 · Combo x8', date: '20/11' },
      { name: 'DEV_MINH', score: 1800, note: 'Wave 11 · Combo x5', date: '19/11' },
      { name: 'VIP_NEO', score: 1100, note: 'Wave 7 · Combo x3', date: '18/11' }
    ],
    racing: [
      { name: 'SPEED_O1', score: 3200, note: '12 Cổng Nitro liên tiếp', date: '20/11' },
      { name: 'TURBO_DSA', score: 2400, note: '9 Cổng Nitro', date: '19/11' },
      { name: 'LOG_N', score: 1600, note: '6 Cổng Nitro', date: '18/11' }
    ]
  };

  function init() {
    setupGlobalControls();
    setupHubEvents();
    setupLeaderboardModal();
    loadPreferences();
    showScreen('hub');
  }

  function getActiveGame() {
    return activeGame;
  }

  // Chuyển màn hình
  function showScreen(screenId) {
    if (activeGame !== 'hub') {
      if (activeGame === 'kitchen') GameKitchen.quit();
      if (activeGame === 'blast') GameBlast.quit();
      if (activeGame === 'racing') GameRacing.quit();
    }

    activeGame = screenId;
    document.querySelectorAll('.arcade-screen').forEach(s => s.classList.add('hidden'));

    const target = $(`#screen-${screenId}`);
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('screen-fade-in');
      setTimeout(() => target.classList.remove('screen-fade-in'), 300);
    }

    // Nút Home trên thanh tiêu đề
    const btnHome = $('#btnNavHome');
    if (btnHome) {
      btnHome.style.display = (screenId === 'hub') ? 'none' : 'inline-flex';
    }

    // Khởi chạy game tương ứng
    if (screenId === 'kitchen') {
      GameKitchen.start();
    } else if (screenId === 'blast') {
      GameBlast.start();
    } else if (screenId === 'racing') {
      GameRacing.start();
    }
  }

  // ==========================================
  // CÁC NÚT ĐIỀU KHIỂN TOÀN CỤC (CRT, MUTE, HOME)
  // ==========================================
  function setupGlobalControls() {
    // Nút Bật/Tắt âm thanh
    const btnMute = $('#btnGlobalMute');
    if (btnMute) {
      btnMute.addEventListener('click', () => {
        const isMuted = ArcadeAudio.toggleMute();
        btnMute.textContent = isMuted ? '🔇 TẮT TIẾNG' : '🔊 ÂM THANH';
        btnMute.classList.toggle('off', isMuted);
      });
    }

    // Nút Bật/Tắt hiệu ứng Scanline CRT
    const btnCrt = $('#btnGlobalCrt');
    const cabinet = $('#arcadeCabinet');
    if (btnCrt && cabinet) {
      btnCrt.addEventListener('click', () => {
        const active = cabinet.classList.toggle('crt-active');
        btnCrt.classList.toggle('active', active);
        try { localStorage.setItem('arcade_crt', active ? '1' : '0'); } catch (e) {}
      });
    }

    // Nút Quay về Màn hình chính (Arcade Hub)
    const btnHome = $('#btnNavHome');
    if (btnHome) {
      btnHome.addEventListener('click', () => {
        ArcadeAudio.click();
        showScreen('hub');
      });
    }

    // Nút xem Bảng xếp hạng trên Hub
    const btnOpenLb = $('#btnOpenLeaderboard');
    if (btnOpenLb) {
      btnOpenLb.addEventListener('click', () => {
        ArcadeAudio.click();
        openLeaderboardModal();
      });
    }
  }

  function loadPreferences() {
    try {
      const crt = localStorage.getItem('arcade_crt');
      if (crt === '1' || crt === null) {
        // Mặc định bật scanline CRT
        $('#arcadeCabinet').classList.add('crt-active');
        $('#btnGlobalCrt').classList.add('active');
      }
    } catch (e) {}
  }

  // ==========================================
  // MÀN HÌNH CHÍNH (ARCADE HUB)
  // ==========================================
  function setupHubEvents() {
    $('#cardModeKitchen').addEventListener('click', () => {
      ArcadeAudio.click();
      showScreen('kitchen');
    });

    $('#cardModeBlast').addEventListener('click', () => {
      ArcadeAudio.click();
      showScreen('blast');
    });

    $('#cardModeRacing').addEventListener('click', () => {
      ArcadeAudio.click();
      showScreen('racing');
    });

    // Các nút Restart trong Modal Game Over
    $('#btnRestartBlast').addEventListener('click', () => {
      ArcadeAudio.click();
      GameBlast.restart();
    });

    $('#btnQuitBlast').addEventListener('click', () => {
      ArcadeAudio.click();
      $('#blastGameOverModal').classList.add('hidden');
      showScreen('hub');
    });

    $('#btnSaveBlastScore').addEventListener('click', () => {
      $('#blastGameOverModal').classList.add('hidden');
      promptSaveScore('blast', GameBlast.getFinalScore(), 'Chế độ Endless Blast');
    });

    $('#btnRestartRacing').addEventListener('click', () => {
      ArcadeAudio.click();
      GameRacing.restart();
    });

    $('#btnQuitRacing').addEventListener('click', () => {
      ArcadeAudio.click();
      $('#racingGameOverModal').classList.add('hidden');
      showScreen('hub');
    });

    $('#btnSaveRacingScore').addEventListener('click', () => {
      $('#racingGameOverModal').classList.add('hidden');
      promptSaveScore('racing', GameRacing.getFinalScore(), 'Chế độ Grand Prix');
    });
  }

  // ==========================================
  // BẢNG XẾP HẠNG & NHẬP NICKNAME (3–8 KÝ TỰ)
  // ==========================================
  let pendingSaveGame = null;
  let pendingSaveScore = 0;
  let pendingSaveNote = '';

  function setupLeaderboardModal() {
    const modal = $('#leaderboardModal');
    const closeBtn = $('#btnCloseLeaderboard');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        ArcadeAudio.click();
        modal.classList.add('hidden');
      });
    }

    // 3 Tab chọn game trong Leaderboard
    document.querySelectorAll('.lb-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        ArcadeAudio.click();
        document.querySelectorAll('.lb-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderLeaderboardTable(btn.dataset.game);
      });
    });

    // Form nhập Nickname
    const form = $('#saveScoreForm');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = $('#playerNicknameInput');
        const nick = (input ? input.value : '').trim().toUpperCase();

        if (nick.length < 3 || nick.length > 8) {
          alert('Nickname phải từ 3 đến 8 ký tự!');
          return;
        }

        saveScoreToStorage(pendingSaveGame, nick, pendingSaveScore, pendingSaveNote);
        $('#saveScoreSection').classList.add('hidden');
        ArcadeAudio.win();
        renderLeaderboardTable(pendingSaveGame);

        // Kích hoạt tab tương ứng
        document.querySelectorAll('.lb-tab-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.game === pendingSaveGame);
        });
      });
    }
  }

  function getLeaderboardData(gameKey) {
    try {
      const stored = localStorage.getItem(`arcade_lb_${gameKey}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_LEADERBOARDS[gameKey] || [];
  }

  function saveScoreToStorage(gameKey, name, score, note) {
    const list = getLeaderboardData(gameKey);
    const d = new Date();
    const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
    list.push({ name, score, note, date: dateStr });
    // Sắp xếp giảm dần theo điểm
    list.sort((a, b) => b.score - a.score);
    // Giữ top 10
    const top10 = list.slice(0, 10);
    try {
      localStorage.setItem(`arcade_lb_${gameKey}`, JSON.stringify(top10));
    } catch (e) {}
  }

  function renderLeaderboardTable(gameKey) {
    const tableBody = $('#leaderboardTableBody');
    if (!tableBody) return;

    const list = getLeaderboardData(gameKey);
    if (list.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Chưa có kỷ lục nào. Hãy là người đầu tiên!</td></tr>';
      return;
    }

    tableBody.innerHTML = list.map((item, idx) => `
      <tr class="${idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : ''}">
        <td class="r-rank">#${idx + 1}</td>
        <td class="r-name"><b>${escapeHtml(item.name)}</b></td>
        <td class="r-score">${item.score} pts</td>
        <td class="r-note"><small>${escapeHtml(item.note || item.date || '')}</small></td>
      </tr>
    `).join('');
  }

  function openLeaderboardModal(activeTab = 'kitchen') {
    const modal = $('#leaderboardModal');
    $('#saveScoreSection').classList.add('hidden');
    document.querySelectorAll('.lb-tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.game === activeTab);
    });
    renderLeaderboardTable(activeTab);
    modal.classList.remove('hidden');
  }

  function promptSaveScore(gameKey, score, note = '') {
    pendingSaveGame = gameKey;
    pendingSaveScore = score;
    pendingSaveNote = note;

    const modal = $('#leaderboardModal');
    const saveSec = $('#saveScoreSection');
    const promptText = $('#saveScorePrompt');
    const input = $('#playerNicknameInput');

    if (promptText) {
      promptText.innerHTML = `Chúc mừng! Bạn đạt <b>${score} điểm</b> trong chế độ <b>${gameKey.toUpperCase()}</b>.`;
    }
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 150);
    }

    saveSec.classList.remove('hidden');
    modal.classList.remove('hidden');
    renderLeaderboardTable(gameKey);
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return {
    init,
    getActiveGame,
    showScreen,
    promptSaveScore,
    openLeaderboardModal
  };
})();

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  ArcadeApp.init();
});
