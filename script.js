// 核心变量定义
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');
const wishInput = document.getElementById('wishInput');
const goScratchBtn = document.getElementById('goScratchBtn');
const scratchMask = document.getElementById('scratchMask');
const scratchTrigger = document.getElementById('scratchTrigger');
const blessingText = document.getElementById('blessingText');
const scratchAllBtn = document.getElementById('scratchAllBtn');
const showBlessing = document.getElementById('showBlessing');
const showWish = document.getElementById('showWish');
const resetBtn = document.getElementById('resetBtn');
const fireworkCanvas = document.getElementById('fireworkCanvas');
const mainPage = document.getElementById('mainPage');
const enterBtn = document.getElementById('enterBtn');
const card = document.getElementById('card');
const backMainBtn = document.getElementById('backMainBtn');
const luckyBtn = document.getElementById('luckyBtn');
const luckyResult = document.getElementById('luckyResult');
const musicBtn = document.getElementById('musicBtn');
const backgroundMusic = document.getElementById('backgroundMusic');
const countdownTip = document.getElementById('countdownTip');
const poweredBy = document.getElementById('poweredBy');
const poemModal = document.getElementById('poemModal');
const closeModal = document.getElementById('closeModal');

// 基础配置
const targetDate = new Date('2026-02-17T00:00:00').getTime();
const blessingList = [
    "龙马精神，万事如意",
    "一马当先，前程似锦",
    "马到成功，岁岁平安",
    "日富一日，年富一年",
    "策马奔腾，好运连连",
    "金马迎春，大吉大利",
    "心想事成，马上享福"
];

const luckyList = [
    "风生水起 🎉",
    "福泽满盈 🎉",
    "身强体壮 💪",
    "万事无忧 🎉",
    "阖家幸福 🎉",
    "平安喜乐 🎉",
    "蒸蒸日上 ✨",
    "步步生花 ✨",
    "光芒万丈 ✨",
    "笑口常开 ✨"
];

const scratchRadius = 25;
let userWish = '';
let randomBless = '';
let ctx = null;
let isScratching = false;

// ========== 音乐播放功能 ==========
function initMusic() {
    // 自动播放尝试
    backgroundMusic.play().catch(err => {
        console.log('自动播放失败，等待用户交互:', err);
        document.addEventListener('click', () => {
            backgroundMusic.play().catch(err => console.log('播放失败:', err));
        }, { once: true });
    });

    // 播放/暂停切换
    musicBtn.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicBtn.classList.remove('paused');
            musicBtn.classList.add('playing');
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            backgroundMusic.pause();
            musicBtn.classList.add('paused');
            musicBtn.classList.remove('playing');
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    });

    // 状态监听
    backgroundMusic.addEventListener('play', () => {
        musicBtn.classList.remove('paused');
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    });

    backgroundMusic.addEventListener('pause', () => {
        musicBtn.classList.add('paused');
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });
}

// ========== 春节倒计时 ==========
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<div style="font-size:2rem;">🎆 春节快乐！🎆</div>';
        countdownTip.innerText = '春节已至，万象更新！(0^ω^0)';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}

// ========== 幸运抽签 ==========
luckyBtn.addEventListener('click', () => {
    luckyResult.innerText = '抽签中...';
    setTimeout(() => {
        luckyResult.innerText = luckyList[Math.floor(Math.random() * luckyList.length)];
        createConfetti();
    }, 800);
});

// ========== 彩色纸屑 ==========
function createConfetti() {
    const colors = ['#c51616', '#fcd34d', '#fbbf24', '#38bdf8', '#a78bfa'];

    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `${Math.random() * 100}vh`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        confetti.animate([
            { transform: `translateY(0) rotate(${Math.random() * 360}deg)`, opacity: 1 },
            { transform: `translateY(100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'ease-in'
        });

        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

// ========== 界面切换 ==========
enterBtn.addEventListener('click', () => {
    backgroundMusic.play().catch(err => console.log('播放失败:', err));
    mainPage.classList.add('closing');

    setTimeout(() => {
        mainPage.style.display = 'none';
        card.style.display = 'block';

        setTimeout(() => {
            card.classList.add('active');
            createConfetti();
        }, 50);
    }, 800);
});

backMainBtn.addEventListener('click', () => {
    // 重置状态
    userWish = '';
    randomBless = '';
    wishInput.value = '';
    luckyResult.innerText = '';
    isScratching = false;

    page3.classList.remove('active');
    page1.classList.add('active');
    card.classList.remove('active');

    setTimeout(() => {
        card.style.display = 'none';
        mainPage.classList.remove('closing');
        mainPage.style.display = 'flex';
        setTimeout(loopMainFirework, 1000);
    }, 500);
});

// ========== 刮刮乐核心 ==========
function initCanvas() {
    const scratchBox = document.querySelector('.scratch-box');
    if (scratchBox.offsetWidth === 0) return;

    scratchMask.width = scratchBox.offsetWidth;
    scratchMask.height = scratchBox.offsetHeight;
    ctx = scratchMask.getContext('2d');

    // 渐变涂层
    const grad = ctx.createLinearGradient(0, 0, scratchMask.width, scratchMask.height);
    grad.addColorStop(0, '#c51616');
    grad.addColorStop(0.5, '#fcd34d');
    grad.addColorStop(1, '#c51616');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, scratchMask.width, scratchMask.height);

    ctx.globalCompositeOperation = 'destination-out';
}

function bindScratchEvents() {
    // 移除旧事件
    scratchTrigger.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMouseMove);
    scratchTrigger.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchend', handleTouchEnd);
    document.removeEventListener('touchmove', handleTouchMove);

    // 绑定新事件
    scratchTrigger.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    scratchTrigger.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchmove', handleTouchMove);
}

// 刮擦事件处理
function handleMouseDown(e) { isScratching = true; scratch(e); }
function handleMouseUp() { isScratching = false; }
function handleMouseMove(e) { if (isScratching) scratch(e); }
function handleTouchStart(e) { e.preventDefault(); isScratching = true; scratch(e, true); }
function handleTouchEnd() { isScratching = false; }
function handleTouchMove(e) { e.preventDefault(); if (isScratching) scratch(e, true); }

function scratch(e, isTouch = false) {
    const scratchBox = document.querySelector('.scratch-box');
    const rect = scratchBox.getBoundingClientRect();
    let x = isTouch ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    let y = isTouch ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, scratchRadius, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercent();
}

// 刮开进度检测
let lastCheckTime = 0;
function checkScratchPercent() {
    const now = Date.now();
    if (now - lastCheckTime < 100) return;
    lastCheckTime = now;

    const imgData = ctx.getImageData(0, 0, scratchMask.width, scratchMask.height);
    const pixels = imgData.data;
    let transparentPixels = 0;
    const step = 10;

    for (let i = 3; i < pixels.length; i += 4 * step) {
        if (pixels[i] === 0) transparentPixels++;
    }

    const percent = (transparentPixels * step) / (pixels.length / 4);
    if (percent > 0.7) setTimeout(goToResult, 300);
}

// ========== 页面逻辑 ==========
goScratchBtn.addEventListener('click', () => {
    userWish = wishInput.value.trim();
    if (!userWish) {
        alert('请写下你的新年心愿吧～');
        return;
    }

    randomBless = blessingList[Math.floor(Math.random() * blessingList.length)];
    blessingText.textContent = randomBless;

    page1.classList.remove('active');
    page2.classList.add('active');

    setTimeout(() => {
        initCanvas();
        bindScratchEvents();
        showFirework();
    }, 100);
});

scratchAllBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, scratchMask.width, scratchMask.height);
    setTimeout(goToResult, 300);
    showFirework();
});

function goToResult() {
    page2.classList.remove('active');
    page3.classList.add('active');
    showBlessing.textContent = randomBless;
    showWish.textContent = `你的心愿：${userWish} · 定会实现 ✨`;
    createConfetti();
}

resetBtn.addEventListener('click', () => {
    userWish = '';
    randomBless = '';
    wishInput.value = '';
    luckyResult.innerText = '';
    isScratching = false;

    page3.classList.remove('active');
    page1.classList.add('active');
    fireworkCanvas.classList.remove('show');
});

// ========== 烟花特效 ==========
function resizeFwCanvas() {
    fireworkCanvas.width = window.innerWidth;
    fireworkCanvas.height = window.innerHeight;
}
resizeFwCanvas();
window.addEventListener('resize', resizeFwCanvas);

function showFirework() {
    fireworkCanvas.classList.add('show');

    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            createFirework(
                Math.random() * fireworkCanvas.width,
                Math.random() * fireworkCanvas.height * 0.7
            );
        }, i * 200);
    }

    setTimeout(() => fireworkCanvas.classList.remove('show'), 5000);
}

// 烟花类
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = Math.random() * 4 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.012 + 0.005;
        this.color = Math.random() > 0.5 ? '#c51616' : '#fcd34d';
        this.size = Math.random() * 2 + 1;
    }
    update() {
        this.vy += 0.05;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.size *= 0.98;
    }
    draw() {
        const fwCtx = fireworkCanvas.getContext('2d');
        fwCtx.save();
        fwCtx.globalAlpha = this.alpha;
        fwCtx.beginPath();
        fwCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        fwCtx.fillStyle = this.color;
        fwCtx.fill();
        fwCtx.restore();
    }
}

let fireworks = [];
function createFirework(x, y) {
    for (let i = 0; i < 60; i++) {
        fireworks.push(new Firework(x, y));
    }
}

let lastFrameTime = 0;
function animateFirework(timestamp) {
    if (timestamp - lastFrameTime < 16) {
        requestAnimationFrame(animateFirework);
        return;
    }
    lastFrameTime = timestamp;

    const fwCtx = fireworkCanvas.getContext('2d');
    fwCtx.fillStyle = 'rgba(255,255,255,0.1)';
    fwCtx.fillRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);

    for (let i = fireworks.length - 1; i >= 0; i--) {
        const f = fireworks[i];
        f.update();
        f.draw();
        if (f.alpha <= 0) fireworks.splice(i, 1);
    }

    requestAnimationFrame(animateFirework);
}

// 主界面烟花循环
function loopMainFirework() {
    if (!mainPage.style.display || mainPage.style.display !== 'none') {
        createFirework(
            Math.random() * fireworkCanvas.width,
            Math.random() * fireworkCanvas.height * 0.8
        );

        setTimeout(loopMainFirework, Math.random() * 3000 + 3000);
    }
}

// ========== 祝福诗弹窗功能 ==========
function initPoemModal() {
    // 打开弹窗
    poweredBy.addEventListener('click', () => {
        poemModal.classList.add('show');
        createConfetti(); // 点击时触发纸屑效果
    });

    // 关闭弹窗
    closeModal.addEventListener('click', () => {
        poemModal.classList.remove('show');
    });

    // 点击弹窗外区域关闭
    poemModal.addEventListener('click', (e) => {
        if (e.target === poemModal) {
            poemModal.classList.remove('show');
        }
    });

    // 键盘ESC关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && poemModal.classList.contains('show')) {
            poemModal.classList.remove('show');
        }
    });
}

// ========== 辅助功能 ==========
window.addEventListener('resize', () => {
    if (page2.classList.contains('active')) setTimeout(initCanvas, 100);
});

wishInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        goScratchBtn.click();
    }
});

// 初始化
initMusic();
updateCountdown();
setInterval(updateCountdown, 1000);
animateFirework(0);
loopMainFirework();
initPoemModal();