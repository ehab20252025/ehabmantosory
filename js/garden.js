// ====================== garden.js ======================
// حديقة الامتنان – إضافة وحذف زهور الشكر

function initGarden() {
    renderGarden();
    
    const addBtn = document.getElementById('addGratitudeBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addGratitudeFlower);
    }
    
    const certificateBtn = document.getElementById('certificateBtn');
    if (certificateBtn) {
        certificateBtn.addEventListener('click', () => generateCertificate());
    }
}

// عرض حديقة الامتنان
function renderGarden() {
    const container = document.getElementById('gardenGrid');
    if (!container) return;
    
    const child = getCurrentChild();
    const gratitudeList = child.gratitudeList || [];
    
    if (gratitudeList.length === 0) {
        container.innerHTML = '<div class="flower-card">🌱 أضف أول زهرة شكر</div>';
        return;
    }
    
    container.innerHTML = '';
    gratitudeList.forEach((item, index) => {
        const flower = document.createElement('div');
        flower.className = 'flower-card';
        flower.innerHTML = `
            🌼 ${item}
            <button class="delete-flower" data-index="${index}">✖</button>
        `;
        container.appendChild(flower);
    });
    
    // ربط أزرار الحذف
    document.querySelectorAll('.delete-flower').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            removeGratitudeFlower(index);
        });
    });
}

// إضافة زهرة شكر جديدة
function addGratitudeFlower() {
    const newFlower = prompt("ما الشيء الجميل الذي حدث لك هذا العام؟\nاكتبه هنا:");
    if (newFlower && newFlower.trim()) {
        addGratitudeItem(newFlower.trim());
        renderGarden();
        speak(`شكراً لإضافة: ${newFlower}. حديقتك تزدهر بالامتنان`);
    }
}

// حذف زهرة شكر
function removeGratitudeFlower(index) {
    const child = getCurrentChild();
    const removed = child.gratitudeList[index];
    removeGratitudeItem(index);
    renderGarden();
    speak(`تم حذف: ${removed}. يمكنك إضافة شيء جديد`);
}

// تحديث حديقة الامتنان بعد تغيير الطفل
function refreshGarden() {
    renderGarden();
}