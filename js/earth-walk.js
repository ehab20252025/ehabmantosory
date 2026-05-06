// ====================== earth-walk.js ======================
// منطق لعبة مشوار الأرض (السحب والدوران)

let currentSteps = 0;
let totalStepsByAge = 4;
let isDraggingEarth = false;
let startDragAngle = 0;
let startStepsValue = 0;
let currentEarthAngle = -90;
const orbitCenter = { x: 0, y: 0 };
const orbitRadius = 125; // نصف قطر المدار (بالبكسل)

// تهيئة اللعبة
function initEarthWalk() {
    const child = getCurrentChild();
    totalStepsByAge = child.age;
    currentSteps = child.walkSteps || 0;
    
    updateMilestonesList();
    updateEarthPosition();
    updateWalkUI();
    
    // ربط أحداث السحب
    const earth = document.getElementById('earthBtn');
    if (earth) {
        earth.addEventListener('mousedown', startDrag);
        earth.addEventListener('touchstart', startDrag, { passive: false });
    }
    
    // زر إعادة التعيين
    const resetBtn = document.getElementById('resetWalk');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetWalk);
    }
}

// تحديث قائمة الإنجازات
function updateMilestonesList() {
    const container = document.getElementById('milestonesList');
    if (!container) return;
    
    const child = getCurrentChild();
    const age = child.age;
    
    const achievements = {
        1: "🚼 بدأت أمشي ونطقت أول كلمة، تعلمت الثقة بالكون",
        2: "🎨 أمسكت القلم وحدي، أحب الاستكشاف",
        3: "🍽️ آكل بنفسي وأرتدي حذائي، أصبحت أكثر استقلالاً",
        4: "📖 أحب الأرقام والحروف وأساعد أصدقائي",
        5: "✍️ أكتب اسمي وأحل المسائل الصغيرة",
        6: "🧠 أقرأ الجمل القصيرة وأهتم بالآخرين",
        7: "🌱 أتعلم عن الكواكب والطبيعة وأحب الزراعة",
        8: "⚙️ أبني مشاريع صغيرة وأسأل عن كل شيء",
        9: "📚 أقرأ كتباً وحدي وأحلم بالمستقبل",
        10: "🌟 أخطط لأهدافي وأشكر الحياة على كل شيء"
    };
    
    let html = '';
    for (let i = 1; i <= age; i++) {
        const achievement = achievements[i] || `🎈 السنة ${i} كانت مليئة بالاكتشافات والمرح`;
        const isCompleted = i <= currentSteps;
        html += `
            <div class="milestone-card" style="${isCompleted ? 'background:#ffe0b5; border-right-color:#2ecc71;' : ''}">
                <strong>🌟 السنة ${i} 🌟</strong><br>
                ${achievement}
                ${isCompleted ? '<span style="color:#2ecc71;"> ✓ مكتملة</span>' : ''}
            </div>
        `;
    }
    container.innerHTML = html;
    
    // التمرير لأخر إنجاز مكتمل
    if (currentSteps > 0) {
        const cards = container.children;
        if (cards[currentSteps - 1]) {
            cards[currentSteps - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

// تحديث موقع الأرض بناءً على الزاوية
function updateEarthPosition() {
    const earth = document.getElementById('earthBtn');
    const orbitDiv = document.getElementById('orbitDiv');
    if (!earth || !orbitDiv) return;
    
    const orbitRect = orbitDiv.getBoundingClientRect();
    const containerRect = document.querySelector('.orbit-zone').getBoundingClientRect();
    
    orbitCenter.x = orbitRect.left + orbitRect.width / 2 - containerRect.left;
    orbitCenter.y = orbitRect.top + orbitRect.height / 2 - containerRect.top;
    
    const angleRad = (currentEarthAngle * Math.PI) / 180;
    const earthX = orbitCenter.x + orbitRadius * Math.cos(angleRad) - earth.offsetWidth / 2;
    const earthY = orbitCenter.y + orbitRadius * Math.sin(angleRad) - earth.offsetHeight / 2;
    
    earth.style.left = earthX + 'px';
    earth.style.top = earthY + 'px';
}

// تحديث واجهة اللعبة
function updateWalkUI() {
    const progressPercent = (currentSteps / totalStepsByAge) * 100;
    const progressBar = document.getElementById('walkProgress');
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }
    
    const feedback = document.getElementById('walkFeedback');
    const owlMsg = document.getElementById('owlWalkMsg');
    
    if (currentSteps >= totalStepsByAge) {
        if (feedback) {
            feedback.innerHTML = `🎉🎂 مبروك! أكملت ${totalStepsByAge} دورة حول الشمس! كل سنة وأنت طيب 🎂🎉`;
        }
        if (owlMsg) {
            owlMsg.innerHTML = "🦉 أحسنت! لقد نما عمرك سنة كاملة بالكون. أنت فخر للعائلة";
        }
        showCelebration();
        speak(`مبروك! أكملت ${totalStepsByAge} دورة حول الشمس`);
    } else {
        if (feedback) {
            feedback.innerHTML = `🌀 أكملت ${currentSteps} من ${totalStepsByAge} دورة. اسحب الأرض لكل سنة من عمرك`;
        }
        if (owlMsg) {
            owlMsg.innerHTML = `🦉 ساعد الأرض تدور حول الشمس ${totalStepsByAge - currentSteps} دورات أخرى. كل دورة = سنة كاملة`;
        }
    }
    
    updateMilestonesList();
    updateWalkProgress(currentSteps);
}

// بدء السحب
function startDrag(e) {
    e.preventDefault();
    isDraggingEarth = true;
    
    const point = e.touches ? e.touches[0] : e;
    startDragAngle = getAngleFromPoint(point);
    startStepsValue = currentSteps;
    
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchmove', onDrag);
    window.addEventListener('touchend', stopDrag);
}

// أثناء السحب
function onDrag(e) {
    if (!isDraggingEarth) return;
    e.preventDefault();
    
    const point = e.touches ? e.touches[0] : e;
    const currentAngle = getAngleFromPoint(point);
    let angleDelta = currentAngle - startDragAngle;
    
    // حساب الفرق في الزاوية
    if (angleDelta > 180) angleDelta -= 360;
    if (angleDelta < -180) angleDelta += 360;
    
    const anglePerStep = 360 / totalStepsByAge;
    const stepDelta = Math.round(angleDelta / anglePerStep);
    let newSteps = startStepsValue + stepDelta;
    
    newSteps = Math.max(0, Math.min(totalStepsByAge, newSteps));
    
    if (newSteps !== currentSteps) {
        currentSteps = newSteps;
        currentEarthAngle = startDragAngle + (stepDelta * anglePerStep);
        updateEarthPosition();
        updateWalkUI();
        
        if (stepDelta !== 0) {
            speak(`أكملت ${currentSteps} من ${totalStepsByAge} دورة`);
        }
        
        startDragAngle = getAngleFromPoint(point);
        startStepsValue = currentSteps;
    } else {
        // تحديث الزاوية بشكل مستمر أثناء السحب
        currentEarthAngle = currentAngle;
        updateEarthPosition();
    }
}

// إنهاء السحب
function stopDrag() {
    isDraggingEarth = false;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
    window.removeEventListener('touchmove', onDrag);
    window.removeEventListener('touchend', stopDrag);
    
    // ضبط الزاوية النهائية
    const anglePerStep = 360 / totalStepsByAge;
    currentEarthAngle = startDragAngle + (currentSteps - startStepsValue) * anglePerStep;
    updateEarthPosition();
}

// حساب الزاوية من نقطة الفأرة/اللمس
function getAngleFromPoint(point) {
    const orbitDiv = document.getElementById('orbitDiv');
    if (!orbitDiv) return 0;
    
    const orbitRect = orbitDiv.getBoundingClientRect();
    const centerX = orbitRect.left + orbitRect.width / 2;
    const centerY = orbitRect.top + orbitRect.height / 2;
    
    let angle = Math.atan2(point.clientY - centerY, point.clientX - centerX) * 180 / Math.PI;
    angle = (angle + 360) % 360;
    return angle;
}

// إعادة تعيين المشوار
function resetWalk() {
    currentSteps = 0;
    currentEarthAngle = -90;
    updateEarthPosition();
    updateWalkUI();
    speak("تم إعادة المشوار. ابدأ من جديد واسحب الأرض حول الشمس");
}