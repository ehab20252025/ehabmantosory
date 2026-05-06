// ====================== utils.js ======================
// دوال مساعدة عامة

// تحديث شريط التقدم
function updateProgressBar(progressId, current, total) {
    const percent = (current / total) * 100;
    const progressBar = document.getElementById(progressId);
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }
}

// تحديث عرض النجوم
function updateStars(containerId, count, total = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let starsHtml = "";
    for (let i = 0; i < total; i++) {
        starsHtml += `<span class="star ${i < count ? 'filled' : ''}">★</span>`;
    }
    container.innerHTML = starsHtml;
}

// عرض رسالة مؤقتة
function showTemporaryMessage(elementId, message, duration = 3000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const originalText = element.innerHTML;
    element.innerHTML = message;
    setTimeout(() => {
        element.innerHTML = originalText;
    }, duration);
}

// تشغيل تأثير احتفالي (بالونات)
function showCelebration() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1000';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);
    
    const balloons = ['🎈', '🎉', '🎂', '🌟', '🎁'];
    
    for (let i = 0; i < 30; i++) {
        const balloon = document.createElement('div');
        balloon.innerHTML = balloons[Math.floor(Math.random() * balloons.length)];
        balloon.style.position = 'absolute';
        balloon.style.fontSize = (30 + Math.random() * 30) + 'px';
        balloon.style.left = Math.random() * 100 + '%';
        balloon.style.bottom = '-50px';
        balloon.style.animation = `floatUp ${3 + Math.random() * 3}s linear forwards`;
        container.appendChild(balloon);
    }
    
    // إزالة البالونات بعد 5 ثواني
    setTimeout(() => {
        container.remove();
    }, 5000);
}

// إضافة حركة الطفو للبالونات
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-100vh) rotate(15deg); opacity: 0; }
    }
`;
document.head.appendChild(style);

// نطق إنجازات السنة
function announceMilestone(year, achievement) {
    speak(`السنة ${year}: ${achievement}`);
}

// تهيئة الصفحة
function initPage() {
    // إضافة دعم للغة العربية
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    
    // تفعيل النطق
    initTTS();
}