// ====================== certificate.js ======================
// توليد وعرض شهادة تقدير للطفل

function generateCertificate() {
    const child = getCurrentChild();
    const totalSteps = child.walkSteps || 0;
    const completed = totalSteps >= child.age;
    
    // نافذة منبثقة للشهادة
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '2000';
    
    const certificateHtml = `
        <div style="background: #fffaf0; border-radius: 50px; padding: 30px; max-width: 500px; width: 90%; text-align: center; border: 8px solid #f5c67b;">
            <div style="font-size: 3rem;">🏆🌍🏆</div>
            <h1 style="color: #b6511a; margin: 15px 0;">شهادة تقدير</h1>
            <h2 style="color: #e67e22;">${child.name}</h2>
            <div style="margin: 20px 0; padding: 15px; background: #ffe2b5; border-radius: 30px;">
                <p>🎂 أكملت <strong>${child.age}</strong> سنوات حول الشمس</p>
                <p>🌍 مشوار الأرض: ${totalSteps} من ${child.age} دورات مكتملة</p>
                <p>📅 عدد النقاط في تحدي التواريخ: ${child.quizPoints || 0}</p>
                <p>🌻 عدد زهور الامتنان: ${(child.gratitudeList || []).length}</p>
                ${completed ? '<p style="color: #2ecc71;">✅ مشوار الأرض مكتمل بنجاح ✅</p>' : '<p style="color: #e67e22;">⭐ لا تزال في رحلتك الرائعة ⭐</p>'}
            </div>
            <p style="margin: 20px 0;">🦉 "كل عام وأنت تنمو وتزدهر وتصبح أكثر استقلالاً"</p>
            <p>📅 ${new Date().toLocaleDateString('ar-EG')}</p>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #e67e22; border: none; padding: 12px 25px; border-radius: 50px; color: white; font-weight: bold; margin-top: 20px; cursor: pointer;">إغلاق الشهادة</button>
            <button onclick="printCertificate()" style="background: #2c6e49; border: none; padding: 12px 25px; border-radius: 50px; color: white; font-weight: bold; margin-top: 20px; margin-right: 10px; cursor: pointer;">🖨️ طباعة</button>
        </div>
    `;
    
    modal.innerHTML = certificateHtml;
    document.body.appendChild(modal);
    
    window.printCertificate = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html dir="rtl"><head><meta charset="UTF-8"><title>شهادة ${child.name}</title>
            <style>
                body { font-family: 'Cairo', sans-serif; text-align: center; padding: 40px; background: #fffaf0; }
                .cert { border: 8px solid #f5c67b; border-radius: 50px; padding: 30px; max-width: 600px; margin: auto; }
                h1 { color: #b6511a; }
                h2 { color: #e67e22; }
                .box { background: #ffe2b5; border-radius: 30px; padding: 15px; margin: 20px 0; }
            </style></head>
            <body><div class="cert">
                <div style="font-size: 3rem;">🏆🌍🏆</div>
                <h1>شهادة تقدير</h1>
                <h2>${child.name}</h2>
                <div class="box">
                    <p>🎂 أكملت ${child.age} سنوات حول الشمس</p>
                    <p>🌍 مشوار الأرض: ${totalSteps} من ${child.age} دورات مكتملة</p>
                    <p>📅 عدد النقاط: ${child.quizPoints || 0}</p>
                    <p>🌻 عدد زهور الامتنان: ${(child.gratitudeList || []).length}</p>
                </div>
                <p>🦉 كل عام وأنت تنمو وتزدهر</p>
                <p>📅 ${new Date().toLocaleDateString('ar-EG')}</p>
            </div></body></html>
        `);
        printWindow.document.close();
        printWindow.print();
    };
}