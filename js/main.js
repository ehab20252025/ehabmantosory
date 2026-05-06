// ====================== main.js ======================
// التحكم الرئيسي – التبويبات، الملف الشخصي، تهيئة الألعاب

let currentActiveTab = 'walk';

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    initTTS();
    initPage();
    loadChildData();
    initTabs();
    initProfile();
    
    // تهيئة الألعاب
    initEarthWalk();
    initQuiz();
    initGarden();
    
    // نطق ترحيبي
    const child = getCurrentChild();
    setTimeout(() => {
        speak(`أهلاً يا ${child.name}، عمرك ${child.age} سنوات. استعد للعب في مشوار الأرض`);
    }, 500);
});

// تحميل بيانات الطفل
function loadChildData() {
    const child = getCurrentChild();
    document.getElementById('childNameSpan').innerText = child.name;
    document.getElementById('childAgeSpan').innerHTML = `✨ ${child.age} سنوات`;
    document.getElementById('avatarImg').src = child.avatar;
}

// تهيئة التبويبات
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const panels = {
        walk: document.getElementById('panelWalk'),
        quiz: document.getElementById('panelQuiz'),
        garden: document.getElementById('panelGarden')
    };
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            Object.values(panels).forEach(panel => {
                if (panel) panel.classList.remove('active-panel');
            });
            
            if (panels[tabId]) {
                panels[tabId].classList.add('active-panel');
                currentActiveTab = tabId;
                
                // تحديث البيانات عند التبديل
                if (tabId === 'garden') {
                    renderGarden();
                }
                if (tabId === 'quiz') {
                    updateQuizStars();
                }
                if (tabId === 'walk') {
                    updateMilestonesList();
                }
            }
        });
    });
}

// تهيئة الملف الشخصي
function initProfile() {
    const profileBtn = document.getElementById('profileBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const familyBtn = document.getElementById('familyBtn');
    
    if (profileBtn) {
        profileBtn.addEventListener('click', showProfileModal);
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', showSettingsModal);
    }
    
    if (familyBtn) {
        familyBtn.addEventListener('click', showFamilyModal);
    }
}

// عرض نافذة تعديل الملف الشخصي
function showProfileModal() {
    const child = getCurrentChild();
    const modalHtml = `
        <div id="profileModal" class="modal" style="display:flex;">
            <div class="modal-content">
                <h3 style="color:#b6511a;">👤 ملفي الشخصي</h3>
                <input type="text" id="editName" placeholder="الاسم" value="${child.name}">
                <input type="number" id="editAge" placeholder="العمر" value="${child.age}" min="1" max="12">
                <button id="saveProfileBtn" class="btn-primary" style="margin-top:10px;">💾 حفظ التغييرات</button>
                <button id="closeProfileModal" class="btn-sm" style="margin-top:10px;">إغلاق</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    document.getElementById('saveProfileBtn').addEventListener('click', () => {
        const newName = document.getElementById('editName').value;
        const newAge = parseInt(document.getElementById('editAge').value);
        
        if (newName) updateChildName(newName);
        if (!isNaN(newAge) && newAge > 0) updateChildAge(newAge);
        
        loadChildData();
        
        // إعادة تهيئة المشوار بالعمر الجديد
        const newChild = getCurrentChild();
        totalStepsByAge = newChild.age;
        currentSteps = newChild.walkSteps || 0;
        updateWalkUI();
        updateEarthPosition();
        
        document.getElementById('profileModal').remove();
        speak(`تم تحديث الملف الشخصي لـ ${newName}`);
    });
    
    document.getElementById('closeProfileModal').addEventListener('click', () => {
        document.getElementById('profileModal').remove();
    });
}

// عرض نافذة الإعدادات
function showSettingsModal() {
    const modalHtml = `
        <div id="settingsModal" class="modal" style="display:flex;">
            <div class="modal-content">
                <h3 style="color:#b6511a;">⚙️ الإعدادات</h3>
                <div style="margin: 15px 0;">
                    <label>🗣️ لغة النطق:</label>
                    <select id="ttsLanguageSelect">
                        <option value="ar-EG">🇪🇬 عامية مصرية</option>
                        <option value="ar">📖 العربية الفصحى</option>
                    </select>
                </div>
                <div style="margin: 15px 0;">
                    <label>🔊 مستوى الصوت:</label>
                    <input type="range" id="ttsVolume" min="0" max="100" value="100">
                </div>
                <button id="saveSettingsBtn" class="btn-primary">💾 حفظ الإعدادات</button>
                <button id="closeSettingsModal" class="btn-sm" style="margin-top:10px;">إغلاق</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
        const language = document.getElementById('ttsLanguageSelect').value;
        const volume = document.getElementById('ttsVolume').value;
        ttsLanguage = language;
        speak(`تم تغيير اللغة إلى ${language === 'ar-EG' ? 'العامية المصرية' : 'العربية الفصحى'}`);
        document.getElementById('settingsModal').remove();
    });
    
    document.getElementById('closeSettingsModal').addEventListener('click', () => {
        document.getElementById('settingsModal').remove();
    });
}

// عرض نافذة العائلة (إدارة الأطفال)
function showFamilyModal() {
    const children = getChildrenList();
    let childrenHtml = '';
    children.forEach((child, idx) => {
        childrenHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #eee;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 40px; height: 40px; background: #e0b87a; border-radius: 50%; overflow: hidden;">
                        <img src="${child.avatar}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <div>
                        <strong>${child.name}</strong> (${child.age} سنوات)
                    </div>
                </div>
                <button onclick="switchToChild(${idx})" class="btn-sm">👆 اختيار</button>
            </div>
        `;
    });
    
    const modalHtml = `
        <div id="familyModal" class="modal" style="display:flex;">
            <div class="modal-content" style="max-width: 400px;">
                <h3 style="color:#b6511a;">👨‍👩‍👧 أطفال العائلة</h3>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${childrenHtml}
                </div>
                <div style="margin-top: 15px;">
                    <input type="text" id="newChildName" placeholder="اسم الطفل الجديد" style="width:100%; margin-bottom:8px;">
                    <input type="number" id="newChildAge" placeholder="العمر" min="1" max="12" style="width:100%;">
                    <button id="addChildBtn" class="btn-primary" style="margin-top:8px;">➕ إضافة طفل جديد</button>
                </div>
                <button id="closeFamilyModal" class="btn-sm" style="margin-top:15px;">إغلاق</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    window.switchToChild = (index) => {
        const child = children[index];
        saveCurrentChild(child);
        loadChildData();
        
        // إعادة تهيئة الألعاب
        totalStepsByAge = child.age;
        currentSteps = child.walkSteps || 0;
        quizPoints = child.quizPoints || 0;
        updateWalkUI();
        updateEarthPosition();
        updateQuizStars();
        renderGarden();
        
        document.getElementById('familyModal')?.remove();
        speak(`تم التبديل إلى ${child.name}`);
    };
    
    document.getElementById('addChildBtn')?.addEventListener('click', () => {
        const newName = document.getElementById('newChildName').value;
        const newAge = parseInt(document.getElementById('newChildAge').value);
        if (newName && !isNaN(newAge)) {
            addNewChild(newName, newAge);
            document.getElementById('familyModal').remove();
            showFamilyModal();
            speak(`تم إضافة ${newName} إلى العائلة`);
        }
    });
    
    document.getElementById('closeFamilyModal')?.addEventListener('click', () => {
        document.getElementById('familyModal').remove();
    });
}