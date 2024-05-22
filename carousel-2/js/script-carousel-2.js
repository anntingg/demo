// 取出移動目標 => 內層框 .carousel-inner 
const carouselInner = document.querySelector(".carousel-inner");
// 取出所有輪播項目 => 為 NodeList集合物件，用 Array.from 轉成陣列
const carouselItems = Array.from(document.querySelectorAll(".carousel-item"));

const totalItems = carouselItems.length;    // 陣列原始個數，不會抓取複製的項目
let currentIndex = 0;                       // 起始的項目編號 
const itemsToDuplicate = 5;                 // 需複製的項目數量，取最大數 5 個
let scaleIndex;                             // 需放大的項目編號
let initialScale;                           // 最初要放大的項目編號

// 計算需被放大的項目 => 監聽螢幕尺寸改變時，會重新呼叫
function updateScaleIndex() {
    if (window.innerWidth > 1200) {
        scaleIndex = currentIndex + 2;
    } else {
        scaleIndex = currentIndex + 1;
    }
}
window.addEventListener("resize", updateScaleIndex);

// 播放下一個項目的函式
function showNextItem() {

    // 取得項目寬度，設定每執行一次，框框往左移動的距離等同項目寬度
    const itemWidth = carouselItems[0].offsetWidth;
    const offset = -(currentIndex * itemWidth);
    carouselInner.style.transform = `translateX(${offset}px)`;

    // 先刪除每個項目的 "scaled" class 或 JS 附加上去的 style = "scale()"
    carouselItems.forEach(item => item.classList.remove("scaled"));
    carouselItems.forEach(item => item.style.transform = "");
    carouselItems.forEach(item => item.style.transition = "");

    // 每次執行，重新計算需被放大的項目編號 => currentIndex +1，下次執行時就會為往後一個項目播放
    updateScaleIndex();
    carouselItems[scaleIndex].classList.add("scaled");
    currentIndex++;

    // 當第一個複製項目到達最左側時，將框框重製回原本位置
    if (currentIndex === totalItems + 1) {

        // 等移動的 transition 0.5 秒做完時，暫停 transition，重置框框位置 & 編號 & 放大項目
        setTimeout(() => {
            carouselInner.style.transition = "none";

            currentIndex = 0;
            scaleInitialItem();     // 因為編號已重置為 0，放大的會是第二個項目

            const resetOffset = -(currentIndex * itemWidth);
            carouselInner.style.transform = `translateX(${resetOffset}px)`;

            // 0.05 秒後，重新加回 transition 效果
            setTimeout(() => {
                carouselInner.style.transition = "transform 0.5s cubic-bezier(.5,.5,.3,1.3)";
                carouselItems[scaleIndex].style.transition = "transform 0.35s ease-in-out";
                // 編號加 1，下次執行時跳下一個項目
                currentIndex++;
            }, 50);
        }, 500); // 等待執行的秒數 => 等同於移動的 transition 秒數
    }
}

// 一開始中間項目直接放大，縮小時才開始 transition => 重置位置時也呼叫一次
function scaleInitialItem() {
    updateScaleIndex();
    carouselItems[scaleIndex].style.transform = "scale(1.35)";
    carouselItems[scaleIndex].style.transition = "none";
}

// 一開始先呼叫執行播放函式，之後每個 2 秒執行一次
function initializeCarousel() {

    // 複製項目，並新增到最後 => 跑到最後一個項目時的重疊項目
    for (let i = 0; i < itemsToDuplicate; i++) {
        const clone = carouselItems[i].cloneNode(true);     // true 代表複製所有內容，含子元素等
        carouselInner.appendChild(clone);                   // 新增複製項目至框框中
        carouselItems.push(clone);                          // 新增複製項目至 carouselItems 陣列
    }

    scaleInitialItem();
    showNextItem();
    intervalId = setInterval(showNextItem, 2000);
}

initializeCarousel();