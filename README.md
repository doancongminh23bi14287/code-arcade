# CODE ARCADE 🕹️

Máy game thùng lập trình 8-bit / 16-bit chạy thuần web (HTML5, CSS3, ES6 JavaScript, Web Audio API), không cần cài đặt bất kỳ thư viện ngoài nào.

---

## 🚀 Cách chạy nhanh

### Cách 1: Mở trực tiếp (Không cần cài đặt, không cần mạng)
Mở trực tiếp file `index.html` bằng trình duyệt (Chrome, Firefox, Edge, Safari).

### Cách 2: Qua Local Server (Hỗ trợ chơi trên điện thoại cùng Wi-Fi)
- **Linux / macOS:**
  ```bash
  ./run.sh
  # Hoặc: sh run.sh
  ```
- **Windows:** Bấm đúp chuột vào `run.bat`
- Mở trên điện thoại: Truy cập `http://<IP-máy-tính>:8000` (hoặc `8080`) trong cùng mạng Wi-Fi.

---

## 🎮 3 Chế độ chơi chính

### 1. 🍕 CODE KITCHEN (Học sâu 4 khâu — Phong cách Papa's Pizzeria)
- **Trạm 1 — Tiếp khách (Order):** Thực khách Pixel SVG đưa yêu cầu bài toán bằng ngôn ngữ đời thường. Nhận đơn, rung chuông `orderBell` và kích hoạt đồng hồ kiên nhẫn.
- **Trạm 2 — Bàn sơ chế (Prep):** Đặt đúng các biến đầu vào Input & Khởi tạo lên thớt gỗ, né các nguyên liệu bẫy.
- **Trạm 3 — Bếp nấu (Cook):** Bỏ các mảnh logic (`for`, `if`, `.append()`, `return`) vào nồi theo đúng thứ tự thực thi. Màn hình Live Python Code hiển thị đồng bộ kết quả.
- **Trạm 4 — Giao món & Chấm điểm (Serve & Review):** Kéo thả đĩa món ăn (hoặc chạm trên mobile) giao cho khách. Khách chấm điểm xếp hạng **S / A / B / C** (1–3 Sao ⭐), tính tiền Tip và đưa nhận xét vui.

### 2. ⚡ CODE BLAST (Luyện cú pháp Endless — 3 Mạng ❤️❤️❤️)
- **Free-Snap:** Người chơi được tự do xếp khối vào các ô trống mà không bị chặn ngay từng ô. Chạm ô đã điền để gỡ khối về khay.
- **Chống lộ đáp án theo độ dài:** 3 hạng kích thước khối chuẩn S (`4ch`), M (`8ch`), L (`12ch`), ô trống ban đầu hiển thị `···`.
- **Hỗ trợ cảm ứng Mobile:** Khi kéo bằng ngón tay (`touch`), khối tự động nổi lên trên đầu ngón tay 50px để không bị che khuất chữ.
- **Auto-Scanline:** Khi điền kín ô cuối, tia laser xanh tự động quét từ trên xuống:
  - Đúng hết: Dòng sáng xanh "COMPILED!", nổ hạt pixel, âm thanh Combo tăng cao độ, trượt code cũ lên trên và kéo wave mới từ dưới lên.
  - Có ô sai: Laser dừng tại dòng lỗi, trừ 1 tim, ngắt combo, hiện gợi ý và chỉ bật khối sai về khay.

### 3. 🏎️ BIG-O GRAND PRIX (MCQ Speed Run — Môn DSA)
- Đua xe Canvas 8-bit 3 làn đường (điều khiển bằng phím mũi tên ◀ ▶, phím A/D hoặc chạm nút ảo trên điện thoại).
- **Bức tường lửa TLE (Time Limit Exceeded)** bập bùng rượt đuổi phía sau.
- Đi qua 3 cổng đáp án trắc nghiệm DSA:
  - Cổng tối ưu: Kích hoạt **NITRO 🚀**, tăng tốc độ, đẩy lùi tường TLE, cộng điểm Combo.
  - Cổng chậm/sai: Động cơ **OVERHEAT ⚠️**, xe bốc khói đen chậm lại, tường lửa TLE áp sát!

---

## 🏆 Bảng xếp hạng (Leaderboard) & Âm thanh 8-bit
- Lưu trữ điểm cao độc lập cho 3 chế độ bằng `localStorage`.
- Cho phép nhập Nickname (3–8 ký tự) để ghi danh bảng vàng.
- Nút bật/tắt hiệu ứng quét dòng **Scanline CRT** cổ điển.
- Tổng hợp âm thanh đa dạng bằng **Web Audio API** (Click, Snap, Order Bell, Sizzle, Nitro, Overheat, Combo, Error, Win).

---

## 📁 Cấu trúc thư mục

| File | Vai trò |
|---|---|
| `index.html` | Cấu trúc máy Arcade thùng, thanh Marquee, 3 màn hình game & modal Leaderboard |
| `style.css` | Phong cách Retro Pixel, viền bậc thang, font pixel/monospace, hiệu ứng CRT |
| `audio.js` | Bộ tổng hợp âm thanh 8-bit Web Audio API không phụ thuộc file mp3 ngoài |
| `data.js` | Dữ liệu 5 đơn hàng Kitchen, 10 câu Python Blast, 12 câu DSA Racing |
| `game-kitchen.js` | Logic 4 trạm Code Kitchen, thanh kiên nhẫn, chấm điểm |
| `game-blast.js` | Logic Endless Code Blast, Free-Snap, Auto-Scanline laser |
| `game-racing.js` | Canvas loop 60FPS Big-O Grand Prix, tường lửa TLE |
| `app.js` | Router chuyển màn hình, Leaderboard 3 tab, lưu trữ LocalStorage |
| `run.sh` / `run.bat` | Script khởi chạy máy chủ thử nghiệm trên Linux/macOS/Windows |
