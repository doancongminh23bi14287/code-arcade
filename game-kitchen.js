// game-kitchen.js — Chế độ CODE KITCHEN: Học sâu 4 khâu (Papa's Pizzeria style)

const GameKitchen = (() => {
  'use strict';

  let currentOrderIdx = 0;
  let activeStation = 1; // 1: Order, 2: Prep, 3: Cook, 4: Serve
  let timerInterval = null;
  let timeLeft = 0;
  let maxTime = 60;
  let accuracy = 100;
  let totalScore = 0;
  let completedOrdersCount = 0;

  // Trạng thái của từng khâu trong đơn hiện tại
  let prepPlaced = [];
  let cookCurrentStep = 0;
  let cookedSteps = [];
  let isOrderReceived = false;
  let isDishServed = false;

  const $ = sel => document.querySelector(sel);

  // SVG Avatars dễ thương cho các khách hàng
  function getCustomerAvatar(name) {
    if (name.includes('Panda') || name.includes('Gấu')) {
      return `<svg viewBox="0 0 64 64" width="72" height="72">
        <circle cx="16" cy="16" r="10" fill="#222"/>
        <circle cx="48" cy="16" r="10" fill="#222"/>
        <circle cx="32" cy="34" r="24" fill="#f4f4f4" stroke="#222" stroke-width="3"/>
        <ellipse cx="23" cy="32" rx="5" ry="7" fill="#222"/>
        <ellipse cx="41" cy="32" rx="5" ry="7" fill="#222"/>
        <circle cx="24" cy="31" r="2" fill="#fff"/>
        <circle cx="42" cy="31" r="2" fill="#fff"/>
        <polygon points="32,38 28,43 36,43" fill="#222"/>
        <path d="M28,46 Q32,50 36,46" fill="none" stroke="#222" stroke-width="2"/>
      </svg>`;
    } else if (name.includes('Mèo')) {
      return `<svg viewBox="0 0 64 64" width="72" height="72">
        <polygon points="12,28 20,8 28,24" fill="#ee8c2b" stroke="#000" stroke-width="2"/>
        <polygon points="52,28 44,8 36,24" fill="#ee8c2b" stroke="#000" stroke-width="2"/>
        <circle cx="32" cy="36" r="22" fill="#ffcd75" stroke="#000" stroke-width="3"/>
        <circle cx="23" cy="34" r="4" fill="#1b1e3a"/>
        <circle cx="41" cy="34" r="4" fill="#1b1e3a"/>
        <circle cx="24" cy="33" r="1.5" fill="#fff"/>
        <circle cx="42" cy="33" r="1.5" fill="#fff"/>
        <polygon points="32,40 29,43 35,43" fill="#ef4a5a"/>
        <line x1="12" y1="36" x2="22" y2="38" stroke="#000" stroke-width="1.5"/>
        <line x1="12" y1="42" x2="22" y2="41" stroke="#000" stroke-width="1.5"/>
        <line x1="52" y1="36" x2="42" y2="38" stroke="#000" stroke-width="1.5"/>
        <line x1="52" y1="42" x2="42" y2="41" stroke="#000" stroke-width="1.5"/>
      </svg>`;
    } else if (name.includes('Hổ')) {
      return `<svg viewBox="0 0 64 64" width="72" height="72">
        <polygon points="12,26 18,10 26,22" fill="#ee8c2b" stroke="#000" stroke-width="2"/>
        <polygon points="52,26 46,10 38,22" fill="#ee8c2b" stroke="#000" stroke-width="2"/>
        <circle cx="32" cy="35" r="22" fill="#ee8c2b" stroke="#000" stroke-width="3"/>
        <line x1="32" y1="16" x2="32" y2="24" stroke="#000" stroke-width="3"/>
        <line x1="24" y1="20" x2="28" y2="25" stroke="#000" stroke-width="2"/>
        <line x1="40" y1="20" x2="36" y2="25" stroke="#000" stroke-width="2"/>
        <circle cx="23" cy="34" r="4" fill="#000"/>
        <circle cx="41" cy="34" r="4" fill="#000"/>
        <polygon points="32,40 28,45 36,45" fill="#000"/>
      </svg>`;
    } else {
      // Cáo / Cú mặc định
      return `<svg viewBox="0 0 64 64" width="72" height="72">
        <polygon points="14,24 20,6 28,20" fill="#c0398f" stroke="#000" stroke-width="2"/>
        <polygon points="50,24 44,6 36,20" fill="#c0398f" stroke="#000" stroke-width="2"/>
        <circle cx="32" cy="36" r="22" fill="#f4f4f4" stroke="#000" stroke-width="3"/>
        <circle cx="22" cy="34" r="5" fill="#29adff"/>
        <circle cx="42" cy="34" r="5" fill="#29adff"/>
        <circle cx="23" cy="33" r="2" fill="#000"/>
        <circle cx="43" cy="33" r="2" fill="#000"/>
        <polygon points="32,41 29,46 35,46" fill="#ef4a5a"/>
      </svg>`;
    }
  }

  // Bắt đầu game hoặc nạp đơn hàng mới
  function init(orderIdx = 0) {
    currentOrderIdx = orderIdx % ARCADE_DATA.kitchenOrders.length;
    activeStation = 1;
    isOrderReceived = false;
    isDishServed = false;
    accuracy = 100;
    prepPlaced = [];
    cookCurrentStep = 0;
    cookedSteps = [];

    const order = ARCADE_DATA.kitchenOrders[currentOrderIdx];
    maxTime = order.timeLimit || 60;
    timeLeft = maxTime;

    clearInterval(timerInterval);
    renderOrderTicket();
    renderStationNav();
    showStation(1);
    updateScoreUI();
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      renderPatienceBar();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
      }
    }, 1000);
    renderPatienceBar();
  }

  function renderPatienceBar() {
    const fill = $('#kitchenPatienceFill');
    const text = $('#kitchenPatienceText');
    if (!fill) return;

    const pct = Math.max(0, (timeLeft / maxTime) * 100);
    fill.style.width = pct + '%';
    text.textContent = `${timeLeft}s`;

    if (pct > 50) {
      fill.style.background = '#38b764'; // xanh
    } else if (pct > 25) {
      fill.style.background = '#ffcd75'; // vàng
    } else {
      fill.style.background = '#ef4a5a'; // đỏ cảnh báo
    }
  }

  function renderOrderTicket() {
    const order = ARCADE_DATA.kitchenOrders[currentOrderIdx];
    const ticket = $('#kitchenOrderTicket');
    if (!ticket) return;

    ticket.innerHTML = `
      <div class="ticket-header">
        <span class="ticket-pin">📌 TICKET #${order.id}</span>
        <b class="ticket-dish">${order.dishName}</b>
      </div>
      <div class="ticket-patience">
        <small>LÒNG KIÊN NHẪN CỦA KHÁCH:</small>
        <div class="patience-track">
          <div id="kitchenPatienceFill" class="patience-fill" style="width: 100%;"></div>
          <span id="kitchenPatienceText" class="patience-text">${timeLeft}s</span>
        </div>
      </div>
      <ul class="ticket-checklist">
        <li id="chk-order" class="${isOrderReceived ? 'done' : 'active'}">
          ${isOrderReceived ? '✓' : '○'} 1. Tiếp khách nhận đơn
        </li>
        <li id="chk-prep" class="${activeStation > 2 ? 'done' : activeStation === 2 ? 'active' : ''}">
          ${activeStation > 2 ? '✓' : '○'} 2. Sơ chế nguyên liệu
        </li>
        <li id="chk-cook" class="${activeStation > 3 ? 'done' : activeStation === 3 ? 'active' : ''}">
          ${activeStation > 3 ? '✓' : '○'} 3. Nấu code logic
        </li>
        <li id="chk-serve" class="${isDishServed ? 'done' : activeStation === 4 ? 'active' : ''}">
          ${isDishServed ? '✓' : '○'} 4. Giao đĩa cho khách
        </li>
      </ul>
    `;
    renderPatienceBar();
  }

  function renderStationNav() {
    const nav = $('#kitchenStationNav');
    if (!nav) return;

    const stations = [
      { id: 1, name: "1. Tiếp Khách", icon: "🛎️" },
      { id: 2, name: "2. Bàn Sơ Chế", icon: "🔪" },
      { id: 3, name: "3. Bếp Nấu", icon: "🍳" },
      { id: 4, name: "4. Giao Món", icon: "🍽️" }
    ];

    nav.innerHTML = stations.map(s => `
      <button class="station-btn ${activeStation === s.id ? 'active' : ''} ${s.id > 1 && !isOrderReceived ? 'disabled' : ''}" data-station="${s.id}">
        <span class="station-icon">${s.icon}</span>
        <span class="station-title">${s.name}</span>
      </button>
    `).join('');

    nav.querySelectorAll('.station-btn:not(.disabled)').forEach(b => {
      b.addEventListener('click', () => {
        const sid = parseInt(b.dataset.station, 10);
        showStation(sid);
      });
    });
  }

  function showStation(stationId) {
    activeStation = stationId;
    renderStationNav();
    renderOrderTicket();

    // Ẩn tất cả station views
    document.querySelectorAll('.station-view').forEach(v => v.classList.add('hidden'));

    if (stationId === 1) renderStation1_Order();
    else if (stationId === 2) renderStation2_Prep();
    else if (stationId === 3) renderStation3_Cook();
    else if (stationId === 4) renderStation4_Serve();
  }

  // ==========================================
  // TRẠM 1: TIẾP KHÁCH (ORDER)
  // ==========================================
  function renderStation1_Order() {
    const view = $('#stationView-1');
    view.classList.remove('hidden');
    const order = ARCADE_DATA.kitchenOrders[currentOrderIdx];

    view.innerHTML = `
      <div class="customer-podium">
        <div class="avatar-frame">
          ${getCustomerAvatar(order.customer.name)}
        </div>
        <div class="speech-bubble">
          <div class="customer-tag">
            <b>${order.customer.name}</b> · <small>${order.customer.role}</small>
          </div>
          <p class="customer-speech">"${order.customer.speech}"</p>
          <div class="order-wanted">
            <span>MÓN YÊU CẦU:</span> <strong>${order.dishName}</strong>
          </div>
        </div>
      </div>

      <div class="station-actions">
        ${!isOrderReceived ? `
          <button id="btnReceiveOrder" class="arcade-btn primary big">
            🛎️ NHẬN ĐƠN & BẮT ĐẦU NẤU
          </button>
        ` : `
          <button id="btnGoPrep" class="arcade-btn primary">
            🔪 ĐÃ NHẬN ĐƠN — VÀO BÀN SƠ CHẾ ➡️
          </button>
        `}
      </div>
    `;

    const btnReceive = $('#btnReceiveOrder');
    if (btnReceive) {
      btnReceive.addEventListener('click', () => {
        ArcadeAudio.orderBell();
        isOrderReceived = true;
        startTimer();
        showStation(2);
      });
    }

    const btnGoPrep = $('#btnGoPrep');
    if (btnGoPrep) {
      btnGoPrep.addEventListener('click', () => showStation(2));
    }
  }

  // ==========================================
  // TRẠM 2: BÀN SƠ CHẾ (PREP)
  // ==========================================
  function renderStation2_Prep() {
    const view = $('#stationView-2');
    view.classList.remove('hidden');
    const order = ARCADE_DATA.kitchenOrders[currentOrderIdx];
    const neededCount = order.prep.items.filter(i => i.correct).length;
    const isPrepComplete = prepPlaced.length === neededCount;

    view.innerHTML = `
      <div class="prep-stage">
        <div class="prep-guide">
          <b>HƯỚNG DẪN SƠ CHẾ:</b>
          <p>${order.prep.instructions}</p>
          <div class="prep-stat">Đã chọn: <b>${prepPlaced.length}/${neededCount}</b> nguyên liệu chuẩn</div>
        </div>

        <div class="prep-board-wrap">
          <div class="chopping-board" id="choppingBoard">
            <div class="board-header">🪵 THỚT SƠ CHẾ NGUYÊN LIỆU</div>
            <div class="board-slots" id="boardSlots">
              ${prepPlaced.length === 0 ? '<div class="empty-hint">Chạm hoặc kéo nguyên liệu đúng từ khay đặt lên thớt</div>' : ''}
              ${prepPlaced.map(item => `
                <div class="ingredient-card placed">
                  <span class="ing-check">✓</span>
                  <code>${escapeHtml(item.text)}</code>
                  <small>${item.desc || ''}</small>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="ingredients-tray">
            <div class="tray-title">🛒 KHAY NGUYÊN LIỆU ĐẦU VÀO & BIẾN (chọn đúng, né bẫy):</div>
            <div class="tray-items" id="prepTray">
              ${order.prep.items.map(item => {
                const isSelected = prepPlaced.some(p => p.id === item.id);
                return `
                  <button class="ingredient-card ${isSelected ? 'selected' : ''}" data-id="${item.id}" ${isSelected ? 'disabled' : ''}>
                    <code>${escapeHtml(item.text)}</code>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <div class="station-actions">
          <button id="btnFinishPrep" class="arcade-btn primary ${isPrepComplete ? '' : 'disabled'}" ${isPrepComplete ? '' : 'disabled'}>
            🍳 ĐƯA VÀO BẾP NẤU ➡️
          </button>
        </div>
      </div>
    `;

    // Click chọn nguyên liệu
    view.querySelectorAll('#prepTray .ingredient-card:not(.selected)').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.id;
        const item = order.prep.items.find(i => i.id === itemId);
        if (!item) return;

        if (item.correct) {
          ArcadeAudio.snap();
          prepPlaced.push(item);
          btn.classList.add('selected');
          renderStation2_Prep();
        } else {
          ArcadeAudio.error();
          accuracy = Math.max(0, accuracy - 12);
          showKitchenToast(`❌ Sai rồi: ${item.reason || 'Nguyên liệu không khớp!'} (-12% chính xác)`, false);
          btn.classList.add('bad-shake');
          setTimeout(() => btn.classList.remove('bad-shake'), 400);
        }
      });
    });

    const btnFinish = $('#btnFinishPrep');
    if (btnFinish && isPrepComplete) {
      btnFinish.addEventListener('click', () => {
        ArcadeAudio.click();
        showStation(3);
      });
    }
  }

  // ==========================================
  // TRẠM 3: BẾP NẤU (COOK)
  // ==========================================
  function renderStation3_Cook() {
    const view = $('#stationView-3');
    view.classList.remove('hidden');
    const order = ARCADE_DATA.kitchenOrders[currentOrderIdx];
    const totalSteps = order.cook.steps.length;
    const isCookComplete = cookCurrentStep >= totalSteps;

    // Gộp steps và distractors rồi xáo trộn ngẫu nhiên một lần nếu chưa xáo
    const availablePills = [
      ...order.cook.steps.filter(s => !cookedSteps.some(c => c.id === s.id)),
      ...order.cook.distractors.map((d, idx) => ({ id: `d_${idx}`, text: d.text, isDistractor: true, reason: d.reason }))
    ].sort(() => 0.5 - Math.random());

    view.innerHTML = `
      <div class="cook-stage">
        <div class="cook-top-guide">
          <b>BẾP LÒ ĐỒNG BỘ LIVE PYTHON CODE:</b>
          <p>${order.cook.instructions}</p>
        </div>

        <div class="cook-workspace">
          <!-- Bếp lò & Nồi nấu -->
          <div class="pot-container ${isCookComplete ? 'ready' : ''}">
            <div class="steam-wrap">
              <span class="steam s1">♨️</span>
              <span class="steam s2">♨️</span>
              <span class="steam s3">♨️</span>
            </div>
            <div class="pot-body">
              <div class="pot-soup" id="potSoup">
                <span class="soup-bubble"></span>
                <span class="soup-bubble"></span>
                <span class="soup-dish-icon">${order.serve.dishIcon}</span>
              </div>
            </div>
            <div class="stove-fire">
              <span class="fire f1">🔥</span>
              <span class="fire f2">🔥</span>
              <span class="fire f3">🔥</span>
            </div>
            <div class="pot-caption">NỒI NẤU ĐANG SÔI (Bỏ từng bước logic vào)</div>
          </div>

          <!-- Màn hình Live Code Terminal -->
          <div class="live-code-panel">
            <div class="terminal-bar">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
              <span class="term-title">main.py (Live Cooking Output)</span>
            </div>
            <pre class="terminal-body" id="liveTerminalCode"><code>${renderLiveCode()}</code></pre>
          </div>
        </div>

        <!-- Khay các mảnh logic để thả vào nồi -->
        <div class="logic-tray-wrap">
          <div class="tray-title">📜 CHỌN MẢNH LOGIC TIẾP THEO (Thứ tự: ${cookCurrentStep + 1}/${totalSteps}):</div>
          <div class="logic-pills-list">
            ${availablePills.map(p => `
              <button class="logic-pill-btn" data-id="${p.id}" data-dist="${p.isDistractor ? '1' : '0'}">
                <code>${escapeHtml(p.text)}</code>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="station-actions">
          <button id="btnFinishCook" class="arcade-btn primary ${isCookComplete ? '' : 'disabled'}" ${isCookComplete ? '' : 'disabled'}>
            🍽️ SANG QUẦY GIAO MÓN ➡️
          </button>
        </div>
      </div>
    `;

    // Click bỏ mảnh logic vào nồi
    view.querySelectorAll('.logic-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (isCookComplete) return;
        const isDist = btn.dataset.dist === '1';
        const id = btn.dataset.id;

        if (isDist) {
          ArcadeAudio.error();
          accuracy = Math.max(0, accuracy - 15);
          const dObj = order.cook.distractors.find((_, idx) => `d_${idx}` === id);
          showKitchenToast(`⚠️ Bẫy cú pháp: ${dObj ? dObj.reason : 'Lỗi cú pháp'} (-15% chính xác)`, false);
          btn.classList.add('bad-shake');
          setTimeout(() => btn.classList.remove('bad-shake'), 400);
          return;
        }

        const nextTargetStep = order.cook.steps[cookCurrentStep];
        if (id === nextTargetStep.id) {
          ArcadeAudio.sizzle();
          cookedSteps.push(nextTargetStep);
          cookCurrentStep++;
          renderStation3_Cook();
        } else {
          ArcadeAudio.error();
          accuracy = Math.max(0, accuracy - 8);
          showKitchenToast('⚠️ Sai thứ tự thực thi! Hãy kiểm tra dòng nào phải chạy trước.', false);
          btn.classList.add('bad-shake');
          setTimeout(() => btn.classList.remove('bad-shake'), 400);
        }
      });
    });

    const btnFinishCook = $('#btnFinishCook');
    if (btnFinishCook && isCookComplete) {
      btnFinishCook.addEventListener('click', () => {
        ArcadeAudio.click();
        showStation(4);
      });
    }
  }

  function renderLiveCode() {
    const order = ARCADE_DATA.kitchenOrders[currentOrderIdx];
    let output = '';
    // Thêm các biến sơ chế
    prepPlaced.forEach(p => {
      output += `<span class="c-prep">${escapeHtml(p.text)}</span>\n`;
    });
    if (prepPlaced.length > 0) output += '\n';

    // Thêm các bước đã nấu
    order.cook.steps.forEach((s, idx) => {
      if (idx < cookCurrentStep) {
        output += `<span class="c-active">${escapeHtml(s.code)}</span>  <span class="c-ok"># OK</span>\n`;
      } else if (idx === cookCurrentStep) {
        output += `<span class="c-waiting">${escapeHtml(s.code.replace(/./g, '·'))}</span>  <span class="c-cursor">◄ CẦN BỎ VÀO NỒI</span>\n`;
      }
    });

    return output || '# Hãy bắt đầu bỏ nguyên liệu vào nồi...';
  }

  // ==========================================
  // TRẠM 4: QUẦY GIAO MÓN (SERVE & REVIEW)
  // ==========================================
  function renderStation4_Serve() {
    const view = $('#stationView-4');
    view.classList.remove('hidden');
    const order = ARCADE_DATA.kitchenOrders[currentOrderIdx];

    view.innerHTML = `
      <div class="serve-stage">
        <div class="serve-header">
          <b>QUẦY GIAO MÓN & CHẤM ĐIỂM THỰC KHÁCH</b>
          <p>Kéo đĩa món ăn thả vào khách (hoặc chạm vào đĩa rồi chạm vào khách)</p>
        </div>

        <div class="serve-arena">
          <!-- Đĩa món ăn mang nhãn Output -->
          <div class="dish-drop-source" id="dishSource">
            <div class="dish-plate ${isDishServed ? 'served' : ''}" id="kitchenDishPlate" draggable="${!isDishServed}">
              <div class="plate-inner">
                <span class="plate-emoji">${order.serve.dishIcon}</span>
                <span class="plate-output-tag">${order.serve.outputLabel}</span>
              </div>
              <small class="plate-hint">${isDishServed ? 'Đã giao thành công!' : '👆 KÉO HOẶC CHẠM ĐĨA'}</small>
            </div>
          </div>

          <!-- Mũi tên chỉ hướng -->
          <div class="serve-arrow">➡️ ➡️ ➡️</div>

          <!-- Khách hàng chờ nhận đĩa -->
          <div class="customer-target-zone ${isDishServed ? 'happy' : ''}" id="customerZone">
            <div class="customer-avatar-box">
              ${getCustomerAvatar(order.customer.name)}
            </div>
            <div class="customer-name-badge">${order.customer.name}</div>
            <div class="zone-prompt">${isDishServed ? '😋 ĐÃ THƯỞNG THỨC' : '🎯 THẢ MÓN VÀO ĐÂY'}</div>
          </div>
        </div>

        <!-- Hộp kết quả chấm điểm sau khi giao -->
        <div id="reviewResultBox" class="review-box ${isDishServed ? '' : 'hidden'}"></div>
      </div>
    `;

    setupDishDragAndDrop();

    if (isDishServed) {
      displayReview();
    }
  }

  function setupDishDragAndDrop() {
    const plate = $('#kitchenDishPlate');
    const zone = $('#customerZone');
    if (!plate || !zone || isDishServed) return;

    // Kéo thả Desktop Drag & Drop API
    plate.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', 'dish');
      plate.classList.add('dragging');
    });
    plate.addEventListener('dragend', () => plate.classList.remove('dragging'));

    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      serveDishSuccess();
    });

    // Hỗ trợ Touch Mobile (Chạm đĩa rồi chạm khách)
    let selectedPlate = false;
    plate.addEventListener('click', () => {
      selectedPlate = !selectedPlate;
      plate.classList.toggle('selected-touch', selectedPlate);
      if (selectedPlate) showKitchenToast('Đã chọn đĩa! Giờ hãy chạm vào Khách hàng để giao.', true);
    });

    zone.addEventListener('click', () => {
      if (selectedPlate) {
        selectedPlate = false;
        plate.classList.remove('selected-touch');
        serveDishSuccess();
      }
    });
  }

  function serveDishSuccess() {
    if (isDishServed) return;
    isDishServed = true;
    clearInterval(timerInterval);
    ArcadeAudio.serve();

    const plate = $('#kitchenDishPlate');
    if (plate) plate.classList.add('served');

    displayReview();
  }

  function displayReview() {
    const order = ARCADE_DATA.kitchenOrders[currentOrderIdx];
    const reviewBox = $('#reviewResultBox');
    if (!reviewBox) return;

    // Tính điểm và xếp hạng
    const timeBonus = Math.max(0, Math.round((timeLeft / maxTime) * 100));
    const finalAccuracy = Math.round(accuracy);
    const orderPoints = Math.round(finalAccuracy * 10 + timeBonus * 5);
    totalScore += orderPoints;
    completedOrdersCount++;

    let grade = 'C';
    let stars = '⭐';
    let tip = '$10';
    let comment = order.serve.reviewC;

    if (finalAccuracy >= 95 && timeBonus >= 40) {
      grade = 'S';
      stars = '⭐⭐⭐';
      tip = '$50';
      comment = order.serve.reviewS;
    } else if (finalAccuracy >= 80 && timeBonus >= 25) {
      grade = 'A';
      stars = '⭐⭐⭐';
      tip = '$35';
      comment = order.serve.reviewA;
    } else if (finalAccuracy >= 60) {
      grade = 'B';
      stars = '⭐⭐';
      tip = '$20';
      comment = order.serve.reviewB;
    }

    reviewBox.classList.remove('hidden');
    reviewBox.innerHTML = `
      <div class="review-card">
        <div class="grade-stamp grade-${grade.toLowerCase()}">${grade}</div>
        <h3 class="review-title">ĐÁNH GIÁ MÓN ĂN: ${stars}</h3>
        <p class="review-comment">"${comment}"</p>

        <div class="review-stats-grid">
          <div class="r-stat"><span>Độ chính xác:</span> <b>${finalAccuracy}%</b></div>
          <div class="r-stat"><span>Thời gian còn:</span> <b>${timeLeft}s (${timeBonus}%)</b></div>
          <div class="r-stat"><span>Tiền Tip:</span> <b class="tip-coin">${tip}</b></div>
          <div class="r-stat"><span>Điểm đơn hàng:</span> <b class="pts">+${orderPoints} pts</b></div>
        </div>

        <div class="review-actions">
          ${currentOrderIdx < ARCADE_DATA.kitchenOrders.length - 1 ? `
            <button id="btnNextOrder" class="arcade-btn primary big">
              ĐƠN HÀNG TIẾP THEO ▶
            </button>
          ` : `
            <button id="btnFinishShift" class="arcade-btn primary big">
              🎉 HOÀN THÀNH CA LÀM VIỆC & LƯU ĐIỂM
            </button>
          `}
        </div>
      </div>
    `;

    updateScoreUI();

    const btnNext = $('#btnNextOrder');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        ArcadeAudio.click();
        init(currentOrderIdx + 1);
      });
    }

    const btnFinish = $('#btnFinishShift');
    if (btnFinish) {
      btnFinish.addEventListener('click', () => {
        ArcadeAudio.win();
        if (window.ArcadeApp) {
          window.ArcadeApp.promptSaveScore('kitchen', totalScore, `Hoàn thành ${completedOrdersCount} đơn hàng!`);
        }
      });
    }
  }

  function handleTimeout() {
    ArcadeAudio.error();
    showKitchenToast('⏰ HẾT GIỜ! Khách hàng đã mất kiên nhẫn bỏ về.', false);
    accuracy = Math.max(0, accuracy - 40);
    // Tự động chuyển đến quầy giao món để chấm điểm khẩn cấp
    showStation(4);
    serveDishSuccess();
  }

  function showKitchenToast(msg, isOk = true) {
    const t = $('#kitchenToast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'kitchen-toast show' + (isOk ? ' ok' : ' err');
    clearTimeout(t._t);
    t._t = setTimeout(() => { t.className = 'kitchen-toast'; }, 3500);
  }

  function updateScoreUI() {
    const el = $('#kitchenTotalScore');
    if (el) el.textContent = totalScore;
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return {
    start() {
      totalScore = 0;
      completedOrdersCount = 0;
      init(0);
    },
    quit() {
      clearInterval(timerInterval);
    }
  };
})();
