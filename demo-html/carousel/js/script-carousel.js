let slides = document.querySelectorAll('.carousel');    // 所有輪播圖，為一組陣列
let btnPrev = document.querySelector(".btn-prev");
let btnNext = document.querySelector(".btn-next");
let navigation = document.querySelector('.navigation');
let indicators = [];    // 所有指示條，為一組空陣列，在下方以 forEach 產生每個長條
let currentSlide = 0;   // 設定輪播圖編號一開始為 0 
// console.log(slides);
// console.log(indicators);

// 建立指示長條 => 以 forEach 迴圈，讓每個輪播圖都建立對應的長條
slides.forEach((element, index) => {
    let indicator = document.createElement("span");     // 建立 span 標籤 => 以變數 indicator 表示
    indicator.classList.add("indicator");   // 將 indicator 加上 class "indicator"
    navigation.appendChild(indicator);      // 把 indicator 加到 navigation 中
    indicators.push(indicator);     // 將個別的 indicator 加到原本 indicators 空陣列中

    indicator.addEventListener("click", () => {
        currentSlide = index;       // 點擊到的那個編號，就等於跳轉播放的輪播圖編號
        showSlide(currentSlide);
        restartInterval();          // 點擊後重新計算 3 秒自動輪播
    });   
});

// -----------------輪播圖播放-----------------
function showSlide(n) {
    slides.forEach((element) => {
        element.classList.remove("active");
    });

    slides[n].classList.add("active");

    indicators.forEach((element) => {
        element.classList.remove("active");
    });
    indicators[n].classList.add("active");
}
// 呼叫 showSlide 函式，讓一開始就從第一張播放
showSlide(currentSlide);

// -----------------切換上一張／下一張-----------------
function prevSlide() {
    // 前一個編號：(現在編號 - 1 + 總數量) => 再取總數量的取餘數
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function nextSlide() {
    // 後一個編號：(現在編號 + 1 + 總數量) => 再取總數量的取餘數
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

//-----------------自動播放 + 前後按鈕 click 事件-----------------
// window.setInterval(函式, 毫秒); => 每個一段時間，執行函式 
// 使用 setInterval 達到自動播放：每 3 秒執行一次 nextSlide()，並將排程編號丟回 intervalId
intervalId = setInterval(nextSlide, 3000); 

// 前後按鈕的 click 事件 => 點擊後重新計算 3 秒自動輪播
function restartInterval (){
    clearInterval(intervalId);
    intervalId = setInterval(nextSlide, 3000); 
    // console.log(intervalId);
}

btnPrev.addEventListener("click", ()=> {
    prevSlide();
    restartInterval();
});

btnNext.addEventListener("click", ()=>{
    nextSlide();
    restartInterval();
});




