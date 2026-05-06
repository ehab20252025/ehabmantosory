// ====================== quiz.js ======================
// لعبة تحدي التواريخ (أسئلة عن الزمن والسنة)

let currentQuizQuestion = null;
let quizPoints = 0;
let quizStars = 0;

// بنك الأسئلة (يمكن استيراده من ملف JSON)
const quizBank = [
    { q: "كم شهراً في السنة؟", a: "12 شهراً", opts: ["10", "12 شهراً", "11", "9"] },
    { q: "كم يوماً في السنة تقريباً؟", a: "365 يوماً", opts: ["300", "365 يوماً", "400", "350"] },
    { q: "ماذا تحتاج الأرض لتدور حول الشمس دورة كاملة؟", a: "سنة كاملة", opts: ["يوم", "سنة كاملة", "شهر", "أسبوع"] },
    { q: "بعد ٤ سنوات كم يصبح عمر الطفل؟", a: "٤ سنوات", opts: ["٣", "٤ سنوات", "٥", "٦"] },
    { q: "كم يوماً في الأسبوع؟", a: "٧ أيام", opts: ["٥", "٦", "٧ أيام", "٨"] },
    { q: "كم أسبوعاً في الشهر تقريباً؟", a: "٤ أسابيع", opts: ["٣", "٤ أسابيع", "٥", "٦"] },
    { q: "المشي حول الشمس دورة كاملة يمثل ماذا؟", a: "سنة كاملة", opts: ["شهر", "سنة كاملة", "أسبوع", "يوم"] }
];

// تهيئة اللعبة
function initQuiz() {
    const child = getCurrentChild();
    quizPoints = child.quizPoints || 0;
    quizStars = Math.min(3, Math.floor(quizPoints / 3));
    updateQuizStars();
    loadRandomQuestion();
    
    document.getElementById('nextQuizBtn')?.addEventListener('click', loadRandomQuestion);
}

// تحميل سؤال عشوائي
function loadRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * quizBank.length);
    currentQuizQuestion = { ...quizBank[randomIndex] };
    
    const questionEl = document.getElementById('quizQuestion');
    if (questionEl) {
        questionEl.innerText = currentQuizQuestion.q;
    }
    
    const optionsContainer = document.getElementById('quizOptions');
    if (!optionsContainer) return;
    
    optionsContainer.innerHTML = '';
    
    // خلط الخيارات
    const shuffled = [...currentQuizQuestion.opts];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    shuffled.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.innerText = opt;
        btn.addEventListener('click', () => checkQuizAnswer(opt, btn));
        optionsContainer.appendChild(btn);
    });
    
    // إعادة تعيين التغذية الراجعة
    const feedbackEl = document.getElementById('quizFeedback');
    if (feedbackEl) {
        feedbackEl.innerHTML = '🤔 اختر الإجابة الصحيحة';
        feedbackEl.style.background = '#ffe2b5';
    }
}

// التحقق من الإجابة
function checkQuizAnswer(selected, btnElement) {
    const isCorrect = (selected === currentQuizQuestion.a);
    const feedbackEl = document.getElementById('quizFeedback');
    
    if (isCorrect) {
        quizPoints++;
        quizStars = Math.min(3, Math.floor(quizPoints / 3));
        updateQuizStars();
        updateQuizPoints(quizPoints);
        
        if (feedbackEl) {
            feedbackEl.innerHTML = '✅ إجابة صحيحة! ✅ +1 نقطة';
            feedbackEl.style.background = '#d4edda';
            feedbackEl.style.color = '#155724';
        }
        
        // تأثير الإجابة الصحيحة
        btnElement.classList.add('correct');
        setTimeout(() => btnElement.classList.remove('correct'), 500);
        
        speakQuizResult(true, currentQuizQuestion.a);
        speakEncouragement(getCurrentChild().name);
        
        // إذا وصل لـ 3 نجوم
        if (quizStars === 3) {
            showCelebration();
            speak("يا سلام! وصلت لـ 3 نجوم. أنت بطل التواريخ!");
        }
        
        // تحميل سؤال جديد بعد تأخير بسيط
        setTimeout(() => {
            loadRandomQuestion();
        }, 1500);
    } else {
        if (feedbackEl) {
            feedbackEl.innerHTML = `❌ الإجابة الصحيحة هي: ${currentQuizQuestion.a}. جرب مرة تانية`;
            feedbackEl.style.background = '#f8d7da';
            feedbackEl.style.color = '#721c24';
        }
        
        btnElement.classList.add('wrong');
        setTimeout(() => btnElement.classList.remove('wrong'), 500);
        
        speakQuizResult(false, currentQuizQuestion.a);
    }
}

// تحديث عرض النجوم
function updateQuizStars() {
    const starsContainer = document.getElementById('quizStars');
    if (!starsContainer) return;
    
    let html = '';
    for (let i = 0; i < 3; i++) {
        html += `<span class="star ${i < quizStars ? 'filled' : ''}">★</span>`;
    }
    starsContainer.innerHTML = html;
}