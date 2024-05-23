// ------------變數設定------------
// 外層框 => 顯示的固定區塊
const carouselArticles = document.querySelector(".carousel-articles");
// 取出移動目標 => 內層框 .articles-box
const articlesBox = document.querySelector(".articles-box");
// 取出所有輪播項目 => 為 NodeList 集合物件
const articleCards = document.querySelectorAll('.article-card');
const btnPrevCard = document.querySelector(".btn-prev-card");
const btnNextCard = document.querySelector(".btn-next-card");

let currentCardIndex = 0;                       // 目前的項目編號 => 起始為 0
const cardToDuplicate = 4;                      // 需複製的數量，取最大數 4 個
let intervalIdCard;

let cardWidth;                                  // 卡片寬度 = 移動的距離 => 監聽螢幕尺寸改變時，會重新計算
let shownCardNumber;                            // 一次顯示的數量 => 監聽螢幕尺寸改變時，會重新計算
function getSettings (){
    cardWidth = getOuterWidth(articleCards[0]);
    if (window.innerWidth > 1200) {
        shownCardNumber = 4;
    } else if (window.innerWidth > 992){
        shownCardNumber = 3;
    } else if (window.innerWidth > 576){
        shownCardNumber = 2;
    }else {
        shownCardNumber = 1;
    }   
}
getSettings();
window.addEventListener("resize", getSettings);

// ------------基本函式------------
function getOuterWidth(element) {
    const style = getComputedStyle(element);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    return element.offsetWidth + margin;
}

// 取得項目寬度，設定移動的距離等同項目寬度 => 每次執行時重抓寬度
function moveOffset() {
    const offset = -((currentCardIndex) * cardWidth);
    articlesBox.style.transform = `translateX(${offset}px)`;
}

function restartInterval() {
    clearInterval(intervalIdCard);
    intervalIdCard = setInterval(showNextCard, 3000);
}

// ------------播放前一項／後一項------------
function showNextCard() {
    // currentIndex +1，執行時往後一個項目播放
    currentCardIndex++;
    moveOffset();

    // 當第一個複製項目到達最左側時，將框框重製回原本位置
    if (currentCardIndex === articleCards.length) {

        // 等移動的 transition 0.5 秒做完時，暫停 transition，重置框框位置 & 編號
        setTimeout(() => {
            articlesBox.style.transition = "none";
            currentCardIndex = 0;
            moveOffset();

            // 0.05 秒後，重新加回 transition 效果
            setTimeout(() => {
                articlesBox.style.transition = "all 0.5s ease-in-out";
            }, 50);
        }, 500); // 等待執行的秒數 => 等同於移動的 transition 秒數
    } 
}

function showPrevCard() {
    // 當在第一個項目時，將框框送去最後的位置
    if (currentCardIndex === 0) {
        currentCardIndex = articleCards.length - shownCardNumber + 1;
        articlesBox.style.opacity = 0.5;

        setTimeout(() => {
            articlesBox.style.opacity = 1;
        }, 500);
    }

    // currentIndex -1，執行時往前一個項目播放
    currentCardIndex--;
    moveOffset();
}

// ------------前後按鈕 => 點擊後重新計算 3 秒自動輪播------------
btnNextCard.addEventListener("click", () => {
    showNextCard();
    restartInterval();
});

btnPrevCard.addEventListener("click", () => {
    showPrevCard();
    restartInterval();
});

// ------------初始值設定------------
// 複製項目，並新增到最後 => 跑到最後一個項目時的重疊項目
function startCardCarousel() {
    for (let i = 0; i < shownCardNumber; i++) {
        const cloneCard = articleCards[i].cloneNode(true);     // true 代表複製所有內容，含子元素等
        articlesBox.appendChild(cloneCard);                    // 新增複製項目至框框中
    }

    // currentCardIndex => 初始值 = 0
    intervalIdCard = setInterval(showNextCard, 3000);
}
startCardCarousel();


// ------------滑鼠進入／離開／拖移------------
// 拖移效果
let isDragging = false;
let startX = 0;
let distanceX = 0;

function detectDrag (event){
    event.preventDefault();
    distanceX = event.clientX - startX;
    // articlesBox.style.transform = `translateX(${currentTransformX + distanceX}px)`;
}

function endDrag (){
    if (!isDragging) return;
    isDragging = false;

    carouselArticles.removeEventListener("mousemove", detectDrag);
    carouselArticles.classList.remove("dragging");

    if (distanceX < -cardWidth / 3) {
        showNextCard();
    } else if (distanceX > cardWidth / 3) {
        showPrevCard();
    } 
    // 下次拖移時 => 重置拖移距離
    distanceX = 0;
}

// 滑鼠進入時，停止輪播
carouselArticles.addEventListener("mouseenter", () => clearInterval(intervalIdCard));

// 滑鼠按下，開始偵測拖移距離
carouselArticles.addEventListener("mousedown", (event) => {
    isDragging = true;
    startX = event.clientX;

    carouselArticles.classList.add("dragging");
    carouselArticles.addEventListener("mousemove", detectDrag);
});

// 滑鼠放開 => 執行拖移結果
carouselArticles.addEventListener("mouseup", endDrag);

// 滑鼠離開，重啟輪播，並執行拖移結果 => 若在拖移過程中離開區域
carouselArticles.addEventListener("mouseleave", () => {
    endDrag();
    restartInterval();
});

// ------------手機觸控效果------------
function detectTouch(event) {
    event.preventDefault();
    distanceX = event.touches[0].clientX - startX;
}

function endTouch() {
    if (!isDragging) return;
    isDragging = false;

    carouselArticles.removeEventListener("touchmove", detectTouch);

    if (distanceX < -cardWidth / 5) {
        showNextCard();
    } else if (distanceX > cardWidth / 5) {
        showPrevCard();
    }
    // 下次拖移時 => 重置拖移距離
    distanceX = 0;
}

// 觸控開始 => 停止輪播，開始偵測拖移距離
carouselArticles.addEventListener("touchstart", (event) => {
    clearInterval(intervalIdCard);

    isDragging = true;
    startX = event.touches[0].clientX;
    carouselArticles.addEventListener("touchmove", detectTouch);
});

// 觸控結束 => 執行拖移結果
carouselArticles.addEventListener("touchend", () => {
    endTouch();
    restartInterval();
});

// 觸控取消 => 執行拖移結果並重啟輪播 (e.g., touch moves off screen)
carouselArticles.addEventListener("touchcancel", () => {
    endTouch();
    restartInterval();
});