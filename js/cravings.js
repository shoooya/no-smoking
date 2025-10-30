// 渇望記録モーダルを開く
function openCravingModal() {
    document.getElementById('cravingModal').classList.add('active');
    document.getElementById('intensitySlider').value = 5;
    document.getElementById('intensityValue').textContent = 5;
}

// 渇望記録モーダルを閉じる
function closeCravingModal() {
    document.getElementById('cravingModal').classList.remove('active');
    document.getElementById('cravingForm').reset();
}

// 渇望記録フォームの送信処理
function handleCravingSubmit(e) {
    e.preventDefault();

    const intensity = parseInt(document.getElementById('intensitySlider').value);
    const situation = document.querySelector('input[name="situation"]:checked').value;
    const trigger = document.getElementById('cravingTrigger').value;
    const notes = document.getElementById('cravingNotes').value;

    const craving = {
        id: new Date().getTime().toString(),
        timestamp: new Date().toISOString(),
        intensity: intensity,
        situation: situation,
        trigger: trigger,
        copingMethod: '',
        notes: notes,
        resolved: false
    };

    cravings.unshift(craving);

    // 今日のカレンダーデータを更新
    const today = formatDateStr(new Date());
    if (calendarData[today]) {
        calendarData[today].cravingCount++;
    }

    saveData();
    closeCravingModal();
    updateCravingsDisplay();
    updateCalendarHeatmap();

    // 渇望記録後のメッセージ表示（オプション）
    alert('渇望を記録しました。深呼吸をして、水を飲みましょう。この感覚は必ず消えます。');
}

// 渇望記録の表示更新
function updateCravingsDisplay() {
    // 統計情報の更新
    const totalCravings = cravings.length;
    const avgIntensity = totalCravings > 0
        ? (cravings.reduce((sum, c) => sum + c.intensity, 0) / totalCravings).toFixed(1)
        : 0;

    const today = formatDateStr(new Date());
    const todayCravings = cravings.filter(c => {
        const cravingDate = formatDateStr(new Date(c.timestamp));
        return cravingDate === today;
    }).length;

    document.getElementById('totalCravings').textContent = totalCravings;
    document.getElementById('avgIntensity').textContent = avgIntensity;
    document.getElementById('todayCravings').textContent = todayCravings;

    // 渇望記録一覧の更新
    const listContainer = document.getElementById('cravingsList');
    listContainer.innerHTML = '';

    if (cravings.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">まだ渇望記録がありません</p>';
        return;
    }

    // 最新10件を表示
    const recentCravings = cravings.slice(0, 10);
    recentCravings.forEach(craving => {
        const div = document.createElement('div');
        div.className = 'craving-item';

        const date = new Date(craving.timestamp);
        const timeStr = date.toLocaleString('ja-JP', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        div.innerHTML = `
            <div class="craving-header">
                <div class="craving-time">${timeStr}</div>
                <div class="craving-intensity">強度: ${craving.intensity}/10</div>
            </div>
            <div class="craving-details">
                <strong>状況:</strong> ${craving.situation}<br>
                ${craving.trigger ? `<strong>トリガー:</strong> ${craving.trigger}<br>` : ''}
                ${craving.notes ? `<strong>メモ:</strong> ${craving.notes}` : ''}
            </div>
        `;

        listContainer.appendChild(div);
    });
}
