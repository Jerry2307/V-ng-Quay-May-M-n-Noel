// localStorage.removeItem("spinCount"); // Xóa số lần quay
// localStorage.removeItem("lastSpinTime"); // Xóa thời gian quay cuối cùng
// localStorage.removeItem("highlightedRows"); // Xóa danh sách các hàng được highlight
// localStorage.removeItem("wonItems"); // Xóa danh sách vật phẩm đã trúng
/* --------------- Spin Wheel  --------------------- */
const spinWheel = document.getElementById("spinWheel");
const spinBtn = document.getElementById("spin_btn");
const text = document.getElementById("text");
const spinCountText = document.getElementById("spin_count_text"); // Thêm phần tử hiển thị số lần quay

/* --------------- Âm thanh  --------------------- */
const spinSound = new Audio("147239759.mp3"); // Âm thanh quay
const celebrationSound = new Audio(
  "11086859_jackpot_by_crazytunes_preview.mp3"
); // Âm thanh chúc mừng

/* --------------- Minimum And Maximum Angle For A value  --------------------- */
const spinValues = [
  { minDegree: 61, maxDegree: 90, value: "số 1" },
  { minDegree: 31, maxDegree: 60, value: "số 2" },
  { minDegree: 0, maxDegree: 30, value: "số 3" },
  { minDegree: 331, maxDegree: 360, value: "số 4" },
  { minDegree: 301, maxDegree: 330, value: "số 5" },
  { minDegree: 271, maxDegree: 300, value: "số 6" },
  { minDegree: 241, maxDegree: 270, value: "số 7" },
  { minDegree: 211, maxDegree: 240, value: "số 8" },
  { minDegree: 181, maxDegree: 210, value: "số 9" },
  { minDegree: 151, maxDegree: 180, value: "số 10" },
  { minDegree: 121, maxDegree: 150, value: "số 11" },
  { minDegree: 91, maxDegree: 120, value: "số 12" },
];

/* --------------- Size Of Each Piece  --------------------- */
const size = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];

/* --------------- Background Colors  --------------------- */
var spinColors = [
  "#FF0000", // Đỏ
  "#008000", // Xanh lá cây
  "#FFD700", // Vàng
  "#FF6347", // Đỏ cam
  "#FF4500", // Cam đậm
  "#32CD32", // Xanh lá cây tươi
  "#FFA500", // Cam
  "#B22222", // Đỏ tươi
  "#FF8C00", // Cam tối
  "#228B22", // Xanh lá cây đậm
  "#FFD700", // Vàng
  "#CD5C5C", // Hồng đậm
];

/* --------------- Kiểm tra số lần quay và các phần thưởng đã trúng  --------------------- */
let spinCount = parseInt(localStorage.getItem("spinCount")) || 0; // Lấy số lần quay từ localStorage
let lastSpinTime = localStorage.getItem("lastSpinTime") || null; // Lấy thời gian quay cuối cùng
let highlightedRows = JSON.parse(localStorage.getItem("highlightedRows")) || []; // Lấy danh sách các hàng đã highlight

// Hiển thị số lần quay
spinCountText.innerHTML = `<p>Số lần đã quay: ${spinCount}/2</p>`;

// Áp dụng highlight cho các hàng đã trúng trước đó
const tableRows = document.querySelectorAll("table tbody tr");
highlightedRows.forEach((rowIndex) => {
  tableRows[rowIndex].classList.add("highlight");
});

// Kiểm tra nếu đã quay 2/2 lần
if (spinCount >= 2) {
  if (lastSpinTime) {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - parseInt(lastSpinTime);
    const oneYear = 365 * 24 * 60 * 60 * 1000; // Thời gian 1 năm

    if (timeDifference < oneYear) {
      const remainingDays = Math.ceil(
        (oneYear - timeDifference) / (24 * 60 * 60 * 1000)
      ); // Tính thời gian còn lại theo ngày
      spinBtn.disabled = true;
      text.innerHTML = `<p>Bạn đã quay đủ 2 lần. Vui lòng thử lại sau ${remainingDays} ngày!</p>`;
    } else {
      // Nếu đã qua 1 năm, reset số lần quay
      spinCount = 0;
      highlightedRows = [];
      localStorage.setItem("spinCount", spinCount);
      localStorage.setItem("highlightedRows", JSON.stringify(highlightedRows));
      spinBtn.disabled = false;
      spinCountText.innerHTML = `<p>Số lần đã quay: ${spinCount}/2</p>`;
    }
  }
}

/* --------------- Chart --------------------- */
let spinChart = new Chart(spinWheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    datasets: [
      {
        backgroundColor: spinColors,
        data: size,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: {
        display: false,
      },
      datalabels: {
        rotation: 90,
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

/* --------------- Display Value Based On The Angle --------------------- */
const maxPrizes = 2; // Số vật phẩm tối đa hiển thị trong bảng bên trái
let wonItems = JSON.parse(localStorage.getItem("wonItems")) || []; // Lấy danh sách vật phẩm đã trúng từ localStorage

// Hàm cập nhật bảng bên trái
const updateLeftTable = () => {
  const leftResultBody = document.getElementById("left_result_body");
  leftResultBody.innerHTML = ""; // Xóa nội dung cũ

  wonItems.forEach((item) => {
    const row = document.createElement("tr");
    row.classList.add("won-item-row"); // Thêm lớp để áp dụng màu sắc
    row.innerHTML = `<td>${item.stt}</td><td>${item.reward}</td>`;
    leftResultBody.appendChild(row);
  });
};

// Gọi hàm cập nhật bảng khi trang được tải
updateLeftTable();
const generateValue = (angleValue) => {
  for (let i of spinValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      // Lấy số thứ tự và phần thưởng tương ứng
      const stt = spinValues.indexOf(i) + 1; // Số thứ tự (STT)
      const rewardText = document.querySelector(
        `.table-container tbody tr:nth-child(${stt}) td:nth-child(2)`
      ).innerText;

      // Hiển thị phần thưởng trúng trong text
      text.innerHTML = `<p>Chúc mừng em đã trúng ${rewardText}!</p>`;
      spinBtn.disabled = false;

      // Dừng âm thanh quay và phát nhạc chúc mừng
      spinSound.pause();
      spinSound.currentTime = 0;
      celebrationSound.play(); // Phát nhạc chúc mừng

      // Highlight hàng trúng trong bảng chính
      const tableRows = document.querySelectorAll(".table-container tbody tr");
      tableRows[stt - 1].classList.add("highlight"); // Thêm lớp highlight cho hàng trong bảng chính

      // Thêm vật phẩm vào danh sách trúng thưởng bên trái (nếu chưa tồn tại)
      if (!wonItems.some((item) => item.stt === stt)) {
        wonItems.push({ stt, reward: rewardText }); // Thêm vào danh sách
        if (wonItems.length > maxPrizes) wonItems.shift(); // Giữ tối đa 2 vật phẩm
        localStorage.setItem("wonItems", JSON.stringify(wonItems)); // Cập nhật localStorage
        updateLeftTable(); // Cập nhật bảng bên trái
      }

      // Tăng số lần quay
      spinCount++;
      localStorage.setItem("spinCount", spinCount); // Lưu số lần quay vào localStorage
      localStorage.setItem("lastSpinTime", new Date().getTime()); // Lưu thời gian quay cuối cùng

      // Cập nhật số lần quay hiển thị
      spinCountText.innerHTML = `<p>Số lần đã quay: ${spinCount}/2</p>`;
      break;
    }
  }
};

/* --------------- Spinning Code --------------------- */
let count = 0;
let resultValue = 101;
spinBtn.addEventListener("click", () => {
  if (spinCount >= 2) {
    alert("Em đã quay đủ 2 lần. Năm sau quay tiếp nhe hehe!");
    return;
  }

  // Dừng nhạc chúc mừng nếu đang phát
  celebrationSound.pause();
  celebrationSound.currentTime = 0;

  spinBtn.disabled = true;
  text.innerHTML = `<p>Chúc em may mắn kkk!</p>`;

  // Bắt đầu phát âm thanh quay
  spinSound.loop = true; // Lặp lại âm thanh quay
  spinSound.play();

  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  let rotationInterval = window.setInterval(() => {
    spinChart.options.rotation = spinChart.options.rotation + resultValue;
    spinChart.update();
    if (spinChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      spinChart.options.rotation = 0;
    } else if (count > 15 && spinChart.options.rotation == randomDegree) {
      generateValue(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});

/* --------------- End Spin Wheel  --------------------- */
