// data.js — Dữ liệu cho cả 3 chế độ chơi của Code Arcade

const ARCADE_DATA = {
  // ==========================================
  // CHẾ ĐỘ 1: CODE KITCHEN (5 ĐƠN HÀNG)
  // ==========================================
  kitchenOrders: [
    {
      id: 1,
      dishName: "Súp Khai Vị 'Hello World'",
      customer: {
        name: "Cáo Lập Trình Viên",
        role: "Thực khách sơ cấp",
        speech: "Chào đầu bếp! Tôi mới vào nghề, muốn mở màn bằng một tô súp in ra dòng chữ 'Hello World' chuẩn chỉnh!"
      },
      timeLimit: 60,
      prep: {
        instructions: "Chọn đúng các thành phần khai báo & chuỗi ký tự cần thiết:",
        items: [
          { id: 'p1_1', text: 'msg = "Hello World"', correct: true, desc: 'Biến chứa chuỗi ký tự chào mừng' },
          { id: 'p1_2', text: 'greeting_prefix = ">>> "', correct: true, desc: 'Tiền tố trang trí dòng in' },
          { id: 'p1_bad1', text: 'msg = Hello World', correct: false, reason: 'Chuỗi văn bản trong Python phải đặt trong dấu nháy "..."' },
          { id: 'p1_bad2', text: 'msg = 12345', correct: false, reason: 'Đây là số nguyên, không phải lời chào!' }
        ]
      },
      cook: {
        instructions: "Bỏ các bước logic vào nồi theo thứ tự thực thi:",
        steps: [
          { id: 'c1_1', code: 'msg = "Hello World"', text: 'msg = "Hello World"', correctOrder: 0 },
          { id: 'c1_2', code: 'print(">>> " + msg)', text: 'print(">>> " + msg)', correctOrder: 1 }
        ],
        distractors: [
          { text: 'echo msg', reason: "'echo' là lệnh shell/Bash, Python dùng hàm print()" },
          { text: 'print(msg + 10)', reason: 'Không thể cộng chuỗi với số nguyên (TypeError)' }
        ]
      },
      serve: {
        dishIcon: "🍲",
        outputLabel: ">>> Hello World",
        reviewS: "Súp ngọt thanh, in dòng chữ không lỗi font! Quá tuyệt!",
        reviewA: "Món ăn thơm ngon, đúng chuẩn khai vị!",
        reviewB: "Súp hơi nguội nhưng vẫn ăn tốt!",
        reviewC: "Món ra hơi chậm, lần sau nhớ khẩn trương hơn nhé!"
      }
    },
    {
      id: 2,
      dishName: "Pizza Lọc Topping Số Chẵn",
      customer: {
        name: "Gấu Mê Ăn Chẵn",
        role: "Chuyên gia kén ăn",
        speech: "Cho tôi một chiếc pizza với topping chỉ lấy các số chẵn từ khay nguyên liệu [1, 2, 3, 4, 5, 6]!"
      },
      timeLimit: 75,
      prep: {
        instructions: "Chọn nguyên liệu mảng ban đầu và danh sách hứng kết quả:",
        items: [
          { id: 'p2_1', text: 'toppings = [1, 2, 3, 4, 5, 6]', correct: true, desc: 'Mảng các topping ban đầu' },
          { id: 'p2_2', text: 'even_toppings = []', correct: true, desc: 'Khởi tạo danh sách rỗng hứng số chẵn' },
          { id: 'p2_bad1', text: 'even_toppings = ""', correct: false, reason: 'Chuỗi không có phương thức .append() cho danh sách' },
          { id: 'p2_bad2', text: 'toppings = (1, 2, 3, 4, 5, 6)', correct: false, reason: 'Tuple là bất biến, đề bài cần danh sách số' }
        ]
      },
      cook: {
        instructions: "Lần lượt duyệt mảng, kiểm tra điều kiện chẵn và gom vào đĩa:",
        steps: [
          { id: 'c2_1', code: 'for x in toppings:', text: 'for x in toppings:', correctOrder: 0 },
          { id: 'c2_2', code: '    if x % 2 == 0:', text: 'if x % 2 == 0:', correctOrder: 1 },
          { id: 'c2_3', code: '        even_toppings.append(x)', text: 'even_toppings.append(x)', correctOrder: 2 },
          { id: 'c2_4', code: 'print(even_toppings)', text: 'print(even_toppings)', correctOrder: 3 }
        ],
        distractors: [
          { text: 'if x % 2 = 0:', reason: "Phải dùng toán tử so sánh '==' chứ không dùng '=' gán" },
          { text: 'even_toppings.push(x)', reason: "Python dùng .append(), phương thức .push() thuộc JavaScript!" }
        ]
      },
      serve: {
        dishIcon: "🍕",
        outputLabel: "[2, 4, 6]",
        reviewS: "Pizza giòn rụm! Chỉ toàn số chẵn thơm ngon, 10/10!",
        reviewA: "Đúng các topping chẵn tôi thích, ngon lắm!",
        reviewB: "Bánh hơi mềm, nhưng topping lọc rất chuẩn.",
        reviewC: "Suýt nữa là nguội ngắt rồi, may mà vị vẫn chuẩn."
      }
    },
    {
      id: 3,
      dishName: "Bánh Mì Hàm Tính Tổng (Add Sub)",
      customer: {
        name: "Mèo Kỹ Sư Phần Mềm",
        role: "Tech Lead quán xá",
        speech: "Đóng gói cho tôi một chiếc bánh mì kẹp hàm 'calc_total(price, tax)' trả về tổng tiền price + tax nhé!"
      },
      timeLimit: 70,
      prep: {
        instructions: "Chọn các biến tham số và giá trị test thử nghiệm:",
        items: [
          { id: 'p3_1', text: 'price = 50', correct: true, desc: 'Giá gốc món ăn' },
          { id: 'p3_2', text: 'tax = 5', correct: true, desc: 'Thuế giá trị gia tăng' },
          { id: 'p3_bad1', text: 'price = "50"', correct: false, reason: 'Giá trị tiền phải là số nguyên int, không phải chuỗi str' },
          { id: 'p3_bad2', text: 'tax = None', correct: false, reason: 'Thuế không thể là None khi thực hiện phép tính cộng' }
        ]
      },
      cook: {
        instructions: "Định nghĩa hàm, trả về kết quả và gọi hàm với tham số:",
        steps: [
          { id: 'c3_1', code: 'def calc_total(p, t):', text: 'def calc_total(p, t):', correctOrder: 0 },
          { id: 'c3_2', code: '    return p + t', text: 'return p + t', correctOrder: 1 },
          { id: 'c3_3', code: 'total = calc_total(price, tax)', text: 'total = calc_total(price, tax)', correctOrder: 2 },
          { id: 'c3_4', code: 'print(f"Total: {total}")', text: 'print(f"Total: {total}")', correctOrder: 3 }
        ],
        distractors: [
          { text: 'function calc_total(p, t):', reason: "Python dùng từ khóa 'def' để định nghĩa hàm, không dùng 'function'" },
          { text: 'print(p + t)', reason: 'Hàm cần return giá trị để tái sử dụng, không nên chỉ print' }
        ]
      },
      serve: {
        dishIcon: "🥪",
        outputLabel: "Total: 55",
        reviewS: "Hàm tính chuẩn xác từng xu, bánh giòn rụm! Code clean cực kỳ!",
        reviewA: "Bánh mì ngon, hàm tái sử dụng rất tốt!",
        reviewB: "Bánh hơi mặn một xíu, nhưng logic rất ổn.",
        reviewC: "Giao hơi sát giờ nhưng hóa đơn rất minh bạch!"
      }
    },
    {
      id: 4,
      dishName: "Salad Đảo Ngược Chuỗi Python",
      customer: {
        name: "Hổ Đam Mê Thuật Toán",
        role: "Thực khách khó tính",
        speech: "Trộn cho tôi đĩa salad từ chữ 'PYTHON' nhưng phải lật ngược lại thành 'NOHTYP' bằng cú pháp slicing!"
      },
      timeLimit: 65,
      prep: {
        instructions: "Chuẩn bị từ khóa gốc và bước nhảy cắt lát (slice):",
        items: [
          { id: 'p4_1', text: 'word = "PYTHON"', correct: true, desc: 'Chuỗi văn bản nguồn' },
          { id: 'p4_2', text: 'step = -1', correct: true, desc: 'Bước nhảy đảo ngược chuỗi' },
          { id: 'p4_bad1', text: 'word = ["P","Y","T"]', correct: false, reason: 'Cần một chuỗi đơn, không phải mảng ký tự' },
          { id: 'p4_bad2', text: 'step = 0', correct: false, reason: 'Bước nhảy slice step không thể bằng 0 (ValueError)' }
        ]
      },
      cook: {
        instructions: "Áp dụng cú pháp cắt lát slice[::-1] trứ danh của Python:",
        steps: [
          { id: 'c4_1', code: 'word = "PYTHON"', text: 'word = "PYTHON"', correctOrder: 0 },
          { id: 'c4_2', code: 'reversed_word = word[::-1]', text: 'reversed_word = word[::-1]', correctOrder: 1 },
          { id: 'c4_3', code: 'print(reversed_word)', text: 'print(reversed_word)', correctOrder: 2 }
        ],
        distractors: [
          { text: 'reversed_word = word[::1]', reason: 'Bước nhảy 1 sẽ giữ nguyên chuỗi, không hề đảo ngược!' },
          { text: 'word.reverse()', reason: 'Chuỗi trong Python là bất biến (immutable), không có phương thức .reverse()' }
        ]
      },
      serve: {
        dishIcon: "🥗",
        outputLabel: "NOHTYP",
        reviewS: "Salad tươi giòn! Cú pháp [::-1] tinh gọn đẳng cấp Pythonista!",
        reviewA: "Rất ngon và chuẩn bài, cảm ơn đầu bếp!",
        reviewB: "Salad trộn đều tay, đảo ngược chữ rất đúng.",
        reviewC: "Chờ hơi lâu nhưng lát cắt rất nghệ thuật!"
      }
    },
    {
      id: 5,
      dishName: "Lẩu Giai Thừa Đệ Quy (Factorial)",
      customer: {
        name: "Cú Thông Thái",
        role: "Giám khảo ẩm thực",
        speech: "Tôi muốn thưởng thức nồi lẩu giai thừa 5! = 120, nấu bằng hàm đệ quy có điều kiện dừng chuẩn xác!"
      },
      timeLimit: 80,
      prep: {
        instructions: "Chuẩn bị số n đầu vào và điều kiện cơ sở (base case):",
        items: [
          { id: 'p5_1', text: 'n = 5', correct: true, desc: 'Số nguyên cần tính giai thừa' },
          { id: 'p5_2', text: 'base_case = 1', correct: true, desc: 'Giá trị cơ sở khi n == 1' },
          { id: 'p5_bad1', text: 'n = -5', correct: false, reason: 'Giai thừa không định nghĩa cho số nguyên âm trong bài này' },
          { id: 'p5_bad2', text: 'base_case = 0', correct: false, reason: 'Nhân với 0 sẽ khiến toàn bộ giai thừa về 0!' }
        ]
      },
      cook: {
        instructions: "Thiết lập điều kiện dừng if n <= 1 và bước gọi đệ quy n * fact(n - 1):",
        steps: [
          { id: 'c5_1', code: 'def fact(n):', text: 'def fact(n):', correctOrder: 0 },
          { id: 'c5_2', code: '    if n <= 1: return 1', text: 'if n <= 1: return 1', correctOrder: 1 },
          { id: 'c5_3', code: '    return n * fact(n - 1)', text: 'return n * fact(n - 1)', correctOrder: 2 },
          { id: 'c5_4', code: 'print(fact(5))', text: 'print(fact(5))', correctOrder: 3 }
        ],
        distractors: [
          { text: 'return n * fact(n)', reason: 'Gọi fact(n) không giảm n sẽ gây tràn ngăn xếp đệ quy (RecursionError)!' },
          { text: 'if n == 0: return 0', reason: 'Quy ước 0! = 1; nếu trả về 0 thì cả chuỗi nhân sẽ bằng 0' }
        ]
      },
      serve: {
        dishIcon: "🍲",
        outputLabel: "120",
        reviewS: "Tuyệt phẩm lẩu đệ quy! Vừa vặn điều kiện dừng, nước lẩu đậm đà!",
        reviewA: "Rất ngon miệng, logic đệ quy chặt chẽ!",
        reviewB: "Lẩu sôi hơi to, nhưng kết quả 120 hoàn toàn chính xác.",
        reviewC: "May mà không bị tràn stack! Ăn xong ấm hết cả người."
      }
    }
  ],

  // ==========================================
  // CHẾ ĐỘ 2: CODE BLAST (10 CÂU TĂNG DẦN ĐỘ KHÓ)
  // Quy chuẩn size:
  // - size "s" (4ch): 1-3 ký tự
  // - size "m" (8ch): 4-7 ký tự
  // - size "l" (12ch): >= 8 ký tự
  // ==========================================
  blastLevels: [
    {
      id: 1,
      prompt: "In ra lời chào Python",
      lines: [
        { tokens: ['print(', { e: '"Python"', size: 'm' }, ')'] }
      ],
      tray: [
        { t: '"Python"', size: 'm' },
        { t: 'Python', size: 'm', h: 'Chuỗi ký tự trong Python bắt buộc có dấu nháy ""' },
        { t: 'python()', size: 'm', h: 'python() là lời gọi hàm, không phải chuỗi' }
      ]
    },
    {
      id: 2,
      prompt: "Khai báo biến x, y và in tổng ra 10",
      lines: [
        { tokens: ['x = 4'] },
        { tokens: ['y =', { e: '6', size: 's' }] },
        { tokens: ['print(x', { e: '+', size: 's' }, 'y)'] }
      ],
      tray: [
        { t: '6', size: 's' },
        { t: '+', size: 's' },
        { t: '-', size: 's', h: 'Đề bài yêu cầu tính tổng x + y' },
        { t: '"6"', size: 's', h: '"6" là chuỗi, x + "6" sẽ báo lỗi TypeError' }
      ]
    },
    {
      id: 3,
      prompt: "Lặp 5 lần in các số từ 0 đến 4",
      lines: [
        { tokens: ['for i in', { e: 'range(5)', size: 'l' }, ':'] },
        { indent: 1, tokens: ['print(', { e: 'i', size: 's' }, ')'] }
      ],
      tray: [
        { t: 'range(5)', size: 'l' },
        { t: 'i', size: 's' },
        { t: 'range(1, 5)', size: 'l', h: 'range(1, 5) sẽ bỏ mất số 0 ban đầu' },
        { t: '5', size: 's', h: 'Cần biến lặp i để in từng giá trị 0..4' }
      ]
    },
    {
      id: 4,
      prompt: "Kiểm tra số chẵn lẻ bằng if-else",
      lines: [
        { tokens: ['n = 7'] },
        { tokens: ['if n', { e: '% 2 != 0', size: 'l' }, ':'] },
        { indent: 1, tokens: ['print(', { e: '"Odd"', size: 'm' }, ')'] }
      ],
      tray: [
        { t: '% 2 != 0', size: 'l' },
        { t: '"Odd"', size: 'm' },
        { t: '% 2 == 0', size: 'l', h: 'n = 7 là số lẻ, n % 2 != 0 mới đúng điều kiện' },
        { t: '"Even"', size: 'm', h: 'Đề bài cần in "Odd" (lẻ)' }
      ]
    },
    {
      id: 5,
      prompt: "Vòng lặp while đếm ngược từ 3 về 1",
      lines: [
        { tokens: ['c = 3'] },
        { tokens: ['while c', { e: '> 0', size: 'm' }, ':'] },
        { indent: 1, tokens: ['print(c)'] },
        { indent: 1, tokens: ['c', { e: '-= 1', size: 'm' }] }
      ],
      tray: [
        { t: '> 0', size: 'm' },
        { t: '-= 1', size: 'm' },
        { t: '< 0', size: 'm', h: 'c khởi tạo bằng 3 nên c < 0 sẽ làm vòng lặp dừng ngay' },
        { t: '+= 1', size: 'm', h: 'Tăng c sẽ làm vòng lặp chạy vô hạn!' }
      ]
    },
    {
      id: 6,
      prompt: "Viết hàm tính diện tích hình chữ nhật",
      lines: [
        { tokens: ['def', { e: 'area', size: 'm' }, '(w, h):'] },
        { indent: 1, tokens: ['return', { e: 'w * h', size: 'm' }] },
        { tokens: ['print(area(3, 4))'] }
      ],
      tray: [
        { t: 'area', size: 'm' },
        { t: 'w * h', size: 'm' },
        { t: 'Area', size: 'm', h: 'Python phân biệt chữ hoa thường: Area khác area' },
        { t: 'w + h', size: 'm', h: 'Diện tích hình chữ nhật là tích dài x rộng (*)' }
      ]
    },
    {
      id: 7,
      prompt: "Thêm phần tử vào danh sách colors",
      lines: [
        { tokens: ['colors = ["red", "blue"]'] },
        { tokens: ['colors.', { e: 'append', size: 'm' }, '("green")'] },
        { tokens: ['print(', { e: 'len(colors)', size: 'l' }, ')'] }
      ],
      tray: [
        { t: 'append', size: 'm' },
        { t: 'len(colors)', size: 'l' },
        { t: 'push', size: 'm', h: 'Danh sách trong Python dùng .append(), không có .push()' },
        { t: 'colors.size', size: 'l', h: 'Lấy độ dài danh sách dùng hàm built-in len()' }
      ]
    },
    {
      id: 8,
      prompt: "Lấy giá trị từ từ điển (Dictionary)",
      lines: [
        { tokens: ['user = {"name": "An", "score": 99}'] },
        { tokens: ['pts = user[', { e: '"score"', size: 'm' }, ']'] },
        { tokens: ['print(pts', { e: '+ 1', size: 's' }, ')'] }
      ],
      tray: [
        { t: '"score"', size: 'm' },
        { t: '+ 1', size: 's' },
        { t: 'score', size: 'm', h: 'Key của dict là chuỗi nên cần nháy kép "score"' },
        { t: '+ "1"', size: 's', h: 'pts là số nguyên, không thể cộng trực tiếp với chuỗi "1"' }
      ]
    },
    {
      id: 9,
      prompt: "List Comprehension tạo bình phương số",
      lines: [
        { tokens: ['sq = [x ** 2 for x in', { e: 'range(4)', size: 'l' }, ']'] },
        { tokens: ['print(', { e: 'sq', size: 's' }, ')'] }
      ],
      tray: [
        { t: 'range(4)', size: 'l' },
        { t: 'sq', size: 's' },
        { t: 'range(0)', size: 'l', h: 'range(0) tạo danh sách rỗng, không có phần tử nào' },
        { t: 'x', size: 's', h: 'Cần in danh sách kết quả sq' }
      ]
    },
    {
      id: 10,
      prompt: "Bắt ngoại lệ chia cho 0 bằng try-except",
      lines: [
        { tokens: ['try:'] },
        { indent: 1, tokens: ['res = 10 / 0'] },
        { tokens: ['except', { e: 'ZeroDivisionError', size: 'l' }, ':'] },
        { indent: 1, tokens: ['print(', { e: '"DIV_ZERO"', size: 'l' }, ')'] }
      ],
      tray: [
        { t: 'ZeroDivisionError', size: 'l' },
        { t: '"DIV_ZERO"', size: 'l' },
        { t: 'ValueError', size: 'l', h: 'Lỗi chia cho 0 trong Python là ZeroDivisionError' },
        { t: '"ERROR_VAL"', size: 'l', h: 'Chọn đúng nhãn thông báo DIV_ZERO' }
      ]
    }
  ],

  // ==========================================
  // CHẾ ĐỘ 3: BIG-O GRAND PRIX (12 CÂU DSA MCQ)
  // Mỗi câu gồm 3 cổng ở 3 làn: 0 (Trái), 1 (Giữa), 2 (Phải)
  // Cổng đúng có optimal: true
  // ==========================================
  racingQuestions: [
    {
      id: 1,
      title: "Tìm kiếm trong mảng đã sắp xếp (Sorted Array)",
      question: "Thuật toán Binary Search có độ phức tạp thời gian là gì?",
      gates: [
        { lane: 0, label: "O(log n)", optimal: true, explain: "Chính xác! Binary Search chia đôi không gian tìm kiếm mỗi bước." },
        { lane: 1, label: "O(n)", optimal: false, explain: "O(n) là Linear Search duyệt từng phần tử, chưa tận dụng mảng đã sắp xếp." },
        { lane: 2, label: "O(n²)", optimal: false, explain: "Quá chậm! Đây là độ phức tạp của các thuật toán so sánh lặp 2 vòng." }
      ]
    },
    {
      id: 2,
      title: "Truy xuất phần tử mảng bằng Index",
      question: "Thời gian truy xuất arr[i] trong Array / List liên tục trên bộ nhớ?",
      gates: [
        { lane: 0, label: "O(n)", optimal: false, explain: "Sai! Truy xuất theo chỉ mục tính được địa chỉ bộ nhớ ngay lập tức." },
        { lane: 1, label: "O(1)", optimal: true, explain: "Tuyệt vời! Direct Memory Offset cho phép truy xuất trong thời gian hằng số O(1)." },
        { lane: 2, label: "O(log n)", optimal: false, explain: "O(log n) là tìm kiếm trên cây hoặc chia đôi, không phải index mảng." }
      ]
    },
    {
      id: 3,
      title: "QuickSort trong trường hợp xấu nhất (Worst Case)",
      question: "Khi chọn Pivot xấu liên tục trên mảng đã sắp sẵn, QuickSort tốn bao lâu?",
      gates: [
        { lane: 0, label: "O(n log n)", optimal: false, explain: "O(n log n) là trường hợp trung bình hoặc tốt nhất của QuickSort." },
        { lane: 1, label: "O(n²)", optimal: true, explain: "Chuẩn! Cây đệ quy bị lệch thành đường thẳng độ sâu n, tốn O(n²)." },
        { lane: 2, label: "O(n)", optimal: false, explain: "Không thuật toán so sánh tổng quát nào đạt O(n) trong trường hợp xấu." }
      ]
    },
    {
      id: 4,
      title: "Cấu trúc dữ liệu đảo ngược từ (LIFO)",
      question: "CTDL nào phù hợp nhất để quản lý Undo / Redo hoặc đảo ngược chuỗi?",
      gates: [
        { lane: 0, label: "Queue", optimal: false, explain: "Queue là FIFO (First In First Out), món vào trước sẽ ra trước." },
        { lane: 1, label: "Stack", optimal: true, explain: "Chính xác! Stack hoạt động theo cơ chế LIFO (Last In First Out)." },
        { lane: 2, label: "Binary Tree", optimal: false, explain: "Binary Tree dùng cho phân cấp tìm kiếm, cấu trúc cồng kềnh cho Undo." }
      ]
    },
    {
      id: 5,
      title: "Chèn phần tử vào đầu Danh Sách Liên Kết Đơn",
      question: "Độ phức tạp khi insert một node vào đầu Singly Linked List (có head)?",
      gates: [
        { lane: 0, label: "O(1)", optimal: true, explain: "Tăng tốc! Chỉ cần trỏ new_node.next = head và cập nhật head tốn O(1)." },
        { lane: 1, label: "O(n)", optimal: false, explain: "O(n) là của mảng tĩnh phải dời toàn bộ phần tử sang phải." },
        { lane: 2, label: "O(log n)", optimal: false, explain: "Không cần tìm kiếm chia đôi khi đã có sẵn con trỏ head." }
      ]
    },
    {
      id: 6,
      title: "Độ phức tạp thời gian của MergeSort",
      question: "MergeSort luôn đảm bảo thời gian bao nhiêu ở mọi trường hợp (Best/Avg/Worst)?",
      gates: [
        { lane: 0, label: "O(n²)", optimal: false, explain: "MergeSort không bao giờ bị tụt xuống O(n²) như Bubble/QuickSort." },
        { lane: 1, label: "O(n log n)", optimal: true, explain: "Chuẩn xác! Cây chia luôn cân bằng log n tầng và mỗi tầng tốn O(n) để trộn." },
        { lane: 2, label: "O(n)", optimal: false, explain: "Thuật toán sắp xếp dựa trên so sánh bị chặn dưới bởi Ω(n log n)." }
      ]
    },
    {
      id: 7,
      title: "Hàng đợi khám bệnh tại bệnh viện (FIFO)",
      question: "Người đến trước được phục vụ trước tương ứng cấu trúc dữ liệu nào?",
      gates: [
        { lane: 0, label: "Queue", optimal: true, explain: "Đúng làn! Queue là hàng đợi First-In First-Out chuẩn mực." },
        { lane: 1, label: "Stack", optimal: false, explain: "Stack là vào sau ra trước, người đến sau cùng lại được khám trước!" },
        { lane: 2, label: "Heap", optimal: false, explain: "Heap là hàng đợi ưu tiên theo trọng số, không bảo toàn thứ tự thời gian thuần túy." }
      ]
    },
    {
      id: 8,
      title: "Tra cứu phần tử trong Hash Table",
      question: "Thời gian tra cứu trung bình (Average Case) của Hash Table / Dictionary?",
      gates: [
        { lane: 0, label: "O(1)", optimal: true, explain: "Nitro kích hoạt! Hàm băm đưa trực tiếp đến bucket trong O(1)." },
        { lane: 1, label: "O(log n)", optimal: false, explain: "O(log n) là tra cứu trên Balanced BST như Red-Black Tree." },
        { lane: 2, label: "O(n)", optimal: false, explain: "O(n) chỉ xảy ra ở Worst Case khi mọi key bị va chạm băm (hash collision)." }
      ]
    },
    {
      id: 9,
      title: "Đường đi ngắn nhất trên đồ thị trọng số không âm",
      question: "Thuật toán nào tối ưu để tìm đường đi ngắn nhất từ 1 đỉnh nguồn (Non-negative)?",
      gates: [
        { lane: 0, label: "Dijkstra", optimal: true, explain: "Chính xác! Dijkstra dùng Greedy + Priority Queue giải quyết tối ưu trong O((V+E)log V)." },
        { lane: 1, label: "Floyd-Warshall", optimal: false, explain: "Floyd-Warshall tìm mọi cặp đỉnh tốn O(V³), quá nặng cho 1 nguồn." },
        { lane: 2, label: "DFS", optimal: false, explain: "DFS chỉ duyệt sâu, không đảm bảo tìm ra đường đi có tổng trọng số ngắn nhất." }
      ]
    },
    {
      id: 10,
      title: "Duyệt cây nhị phân n node (Tree Traversal)",
      question: "Duyệt In-order, Pre-order hay Post-order toàn bộ cây nhị phân tốn thời gian bao nhiêu?",
      gates: [
        { lane: 0, label: "O(log n)", optimal: false, explain: "Duyệt toàn bộ phải ghé thăm tất cả n node, không thể chỉ tốn O(log n)." },
        { lane: 1, label: "O(n)", optimal: true, explain: "Rất chuẩn! Mỗi node trong cây được ghé thăm đúng 1 lần nên là O(n)." },
        { lane: 2, label: "O(n²)", optimal: false, explain: "Quá chậm! Không cần duyệt lại các node đã thăm." }
      ]
    },
    {
      id: 11,
      title: "Không gian bộ nhớ Stack của DFS trên cây cân bằng",
      question: "Độ phức tạp bộ nhớ (Space Complexity) của DFS trên cây nhị phân cân bằng chiều cao h?",
      gates: [
        { lane: 0, label: "O(n)", optimal: false, explain: "O(n) chỉ xảy ra khi cây bị suy biến thành danh sách liên kết." },
        { lane: 1, label: "O(log n)", optimal: true, explain: "Tuyệt đỉnh! Chiều cao cây cân bằng là h = log₂(n), call stack tối đa O(log n)." },
        { lane: 2, label: "O(1)", optimal: false, explain: "Đệ quy DFS phải giữ các khung hàm gọi trên call stack." }
      ]
    },
    {
      id: 12,
      title: "Sắp xếp mảng số nguyên nhỏ [0..k] với k << n",
      question: "Thuật toán sắp xếp phi so sánh nào đạt thời gian tuyến tính O(n + k)?",
      gates: [
        { lane: 0, label: "Counting Sort", optimal: true, explain: "Đích đến hoàn hảo! Counting Sort đếm tần suất phần tử trong O(n + k)." },
        { lane: 1, label: "Heap Sort", optimal: false, explain: "Heap Sort luôn tốn O(n log n) dựa trên so sánh." },
        { lane: 2, label: "Bubble Sort", optimal: false, explain: "Bubble Sort rất chậm O(n²)." }
      ]
    }
  ]
};
