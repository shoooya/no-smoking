// 吸っちゃった記録モーダルを開く
function openSlipModal() {
    document.getElementById('slipModal').classList.add('active');
    document.getElementById('slipCountSlider').value = 1;
    document.getElementById('slipCountValue').textContent = 1;
}

// 吸っちゃった記録モーダルを閉じる
function closeSlipModal() {
    document.getElementById('slipModal').classList.remove('active');
    document.getElementById('slipForm').reset();
}

// 吸っちゃった記録フォームの送信処理
function handleSlipSubmit(e) {
    e.preventDefault();

    const count = parseInt(document.getElementById('slipCountSlider').value);
    const situation = document.querySelector('input[name="slipSituation"]:checked').value;
    const trigger = document.getElementById('slipTrigger').value;
    const feelings = document.getElementById('slipFeelings').value;

    const slip = {
        id: new Date().getTime().toString(),
        timestamp: new Date().toISOString(),
        count: count,
        situation: situation,
        trigger: trigger,
        feelings: feelings
    };

    slips.unshift(slip);

    // 今日のカレンダーデータを更新（slipステータスに）
    const today = formatDateStr(new Date());
    if (calendarData[today]) {
        calendarData[today].status = 'slip';
    }

    saveData();
    closeSlipModal();
    updateSlipsDisplay();
    updateCalendarHeatmap();

    // 励ましのメッセージ
    alert('記録しました。大丈夫、これは失敗ではなく学びです。また今から始めましょう！');
}

// 吸っちゃった記録の表示更新
function updateSlipsDisplay() {
    // 統計情報の更新
    const totalSlips = slips.length;
    const totalCigarettes = slips.reduce((sum, s) => sum + s.count, 0);

    document.getElementById('totalSlips').textContent = totalSlips;
    document.getElementById('totalSlipCigarettes').textContent = totalCigarettes;

    // 吸っちゃった記録一覧の更新
    const listContainer = document.getElementById('slipsList');
    listContainer.innerHTML = '';

    if (slips.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">記録がありません。素晴らしい！</p>';
        return;
    }

    // 最新10件を表示
    const recentSlips = slips.slice(0, 10);
    recentSlips.forEach(slip => {
        const div = document.createElement('div');
        div.className = 'slip-item';

        const date = new Date(slip.timestamp);
        const timeStr = date.toLocaleString('ja-JP', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        div.innerHTML = `
            <div class="slip-header">
                <div class="slip-time">${timeStr}</div>
                <div class="slip-count">${slip.count}本</div>
            </div>
            <div class="slip-details">
                <strong>状況:</strong> ${slip.situation}<br>
                ${slip.trigger ? `<strong>きっかけ:</strong> ${slip.trigger}<br>` : ''}
                ${slip.feelings ? `<strong>気持ち:</strong> ${slip.feelings}` : ''}
            </div>
        `;

        listContainer.appendChild(div);
    });

    // 励ましメッセージを追加
    if (slips.length > 0) {
        const encouragement = document.createElement('div');
        encouragement.className = 'encouragement-message';
        encouragement.textContent = '過去は変えられませんが、未来は変えられます。一度の失敗で全てが無駄になるわけではありません。今この瞬間から、また禁煙を続けましょう！';
        listContainer.appendChild(encouragement);
    }
}
