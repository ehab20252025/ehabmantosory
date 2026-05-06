// ====================== storage.js ======================
// حفظ واسترجاع بيانات الطفل والتقدم

const STORAGE_KEYS = {
    CURRENT_CHILD: 'montessori_current_child',
    CHILDREN_LIST: 'montessori_children_list'
};

// البيانات الافتراضية
const defaultChild = {
    id: Date.now(),
    name: "أوليفيا",
    age: 4,
    avatar: "assets/images/default-avatar.png",
    walkSteps: 0,
    quizPoints: 0,
    gratitudeList: ["🍎 ساعدت ماما", "🎨 رسمت شمس جميلة", "📖 حفظت أسماء الكواكب"],
    createdAt: new Date().toISOString()
};

// الحصول على قائمة الأطفال
function getChildrenList() {
    const stored = localStorage.getItem(STORAGE_KEYS.CHILDREN_LIST);
    if (stored) {
        return JSON.parse(stored);
    }
    return [defaultChild];
}

// حفظ قائمة الأطفال
function saveChildrenList(children) {
    localStorage.setItem(STORAGE_KEYS.CHILDREN_LIST, JSON.stringify(children));
}

// الحصول على الطفل الحالي
function getCurrentChild() {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_CHILD);
    if (stored) {
        return JSON.parse(stored);
    }
    const children = getChildrenList();
    return children[0];
}

// حفظ الطفل الحالي
function saveCurrentChild(child) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_CHILD, JSON.stringify(child));
    // تحديث القائمة أيضاً
    const children = getChildrenList();
    const index = children.findIndex(c => c.id === child.id);
    if (index !== -1) {
        children[index] = child;
    } else {
        children.push(child);
    }
    saveChildrenList(children);
}

// إضافة طفل جديد
function addNewChild(name, age) {
    const newChild = {
        id: Date.now(),
        name: name,
        age: age,
        avatar: "assets/images/default-avatar.png",
        walkSteps: 0,
        quizPoints: 0,
        gratitudeList: ["🎉 مرحباً بك في اللعبة"],
        createdAt: new Date().toISOString()
    };
    const children = getChildrenList();
    children.push(newChild);
    saveChildrenList(children);
    return newChild;
}

// تحديث تقدم المشوار
function updateWalkProgress(steps) {
    const child = getCurrentChild();
    child.walkSteps = steps;
    saveCurrentChild(child);
}

// تحديث نقاط التحدي
function updateQuizPoints(points) {
    const child = getCurrentChild();
    child.quizPoints = points;
    saveCurrentChild(child);
}

// إضافة زهرة امتنان
function addGratitudeItem(item) {
    const child = getCurrentChild();
    child.gratitudeList.push(item);
    saveCurrentChild(child);
}

// حذف زهرة امتنان
function removeGratitudeItem(index) {
    const child = getCurrentChild();
    child.gratitudeList.splice(index, 1);
    saveCurrentChild(child);
}

// تحديث صورة الطفل
function updateChildAvatar(avatarUrl) {
    const child = getCurrentChild();
    child.avatar = avatarUrl;
    saveCurrentChild(child);
}

// تحديث اسم الطفل
function updateChildName(name) {
    const child = getCurrentChild();
    child.name = name;
    saveCurrentChild(child);
}

// تحديث عمر الطفل
function updateChildAge(age) {
    const child = getCurrentChild();
    child.age = age;
    saveCurrentChild(child);
}