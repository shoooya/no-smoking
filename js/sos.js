// SOS画面を開く
function openSOS() {
    const now = new Date();
    const quitDate = new Date(quitData.quitDate);
    const diffMs = now - quitDate;
    const diffMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(diffMinutes / 1440);

    const cigarettesAvoided = Math.floor((diffMinutes / 1440) * quitData.cigarettesPerDay);
    const moneySaved = Math.floor(cigarettesAvoided * quitData.pricePerCigarette);

    // メッセージの設定
    document.getElementById('sosMessage').innerHTML = `
        あなたはここまで<strong>${days}日間</strong>頑張ってきました！<br>
        <strong>¥${moneySaved.toLocaleString()}</strong>も節約しています！<br>
        <strong>${cigarettesAvoided}本</strong>のタバコを避けました！<br><br>
        あと5分だけ待ちましょう。<br>
        この感覚は必ず消えます。
    `;

    // 統計の設定
    document.getElementById('sosStats').innerHTML = `
        <div class="sos-stats-item">🏆 ${days}日間の継続</div>
        <div class="sos-stats-item">💰 ¥${moneySaved.toLocaleString()} 節約</div>
        <div class="sos-stats-item">🚬 ${cigarettesAvoided}本 回避</div>
    `;

    // オーバーレイを表示
    document.getElementById('sosOverlay').classList.add('active');

    // カウントダウン開始（5分）
    let remainingSeconds = 300;
    const countdownEl = document.getElementById('sosCountdown');

    if (sosCountdownInterval) {
        clearInterval(sosCountdownInterval);
    }

    sosCountdownInterval = setInterval(() => {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        countdownEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        remainingSeconds--;

        if (remainingSeconds < 0) {
            clearInterval(sosCountdownInterval);
            countdownEl.textContent = '時間です！';
        }
    }, 1000);
}

// SOS画面を閉じる
function closeSOS() {
    if (sosCountdownInterval) {
        clearInterval(sosCountdownInterval);
    }

    // 成功を記録
    sosHistory.push({
        timestamp: new Date().toISOString(),
        success: true
    });

    saveData();

    document.getElementById('sosOverlay').classList.remove('active');

    alert('素晴らしい！あなたは渇望を乗り越えました！この勝利を誇りに思ってください！');
}
