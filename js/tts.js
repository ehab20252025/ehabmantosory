// ====================== tts.js ======================
// النطق بالعربية (عامية مصرية أو فصحى حسب اختيار المستخدم)

let ttsEnabled = true;
let ttsLanguage = "ar-EG"; // ar-EG = عامية مصرية, ar = فصحى

// تهيئة النطق
function initTTS() {
    if (!window.speechSynthesis) {
        console.warn("المتصفح لا يدعم النطق الصوتي");
        ttsEnabled = false;
        return false;
    }
    return true;
}

// نطق نص معين
function speak(text, forceLanguage = null) {
    if (!ttsEnabled) return;
    
    // إلغاء أي نطق سابق
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = forceLanguage || ttsLanguage;
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    
    // محاولة اختيار صوت عربي
    const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        let arabicVoice = voices.find(v => v.lang === ttsLanguage || v.lang.startsWith('ar'));
        if (arabicVoice) {
            utterance.voice = arabicVoice;
        }
        window.speechSynthesis.speak(utterance);
    };
    
    if (window.speechSynthesis.getVoices().length > 0) {
        setVoice();
    } else {
        window.speechSynthesis.onvoiceschanged = setVoice;
    }
}

// نطق رسائل تشجيعية
function speakEncouragement(childName) {
    const messages = [
        `يا سلام يا ${childName}! أنت بطل حقيقي`,
        `ممتاز يا ${childName}، كمل زي ما انت`,
        `برافو عليك يا ${childName}!`,
        `أحسنت يا ${childName}، أنت بتتعلم بسرعة`,
        `عاش يا ${childName}!`
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    speak(randomMsg);
}

// نطق تقدم المشوار
function speakWalkProgress(steps, total) {
    if (steps >= total) {
        speak(`مبروك! أكملت ${total} دورة حول الشمس. كل سنة وأنت طيب`);
    } else {
        speak(`أكملت ${steps} من ${total} دورة. كمل يا بطل`);
    }
}

// نطق نتيجة السؤال
function speakQuizResult(isCorrect, correctAnswer) {
    if (isCorrect) {
        speak("إجابة صحيحة! أحسنت");
    } else {
        speak(`للأسف خطأ. الإجابة الصحيحة هي ${correctAnswer}. جرب مرة تانية`);
    }
}

// تغيير لغة النطق
function setTTSLanguage(isEgyptian) {
    ttsLanguage = isEgyptian ? "ar-EG" : "ar";
    speak(`تم تغيير اللغة إلى ${isEgyptian ? "العامية المصرية" : "العربية الفصحى"}`);
}