// 定期更新の開始
function startUpdating() {
    initTodayCalendarData();
    displayCopingStrategies();
    displayReasons();
    updateDashboard();
    updateInterval = setInterval(updateDashboard, 1000);
}

// ダッシュボードの更新
function updateDashboard() {
    const now = new Date();
    const quitDate = new Date(quitData.quitDate);
    const diffMs = now - quitDate;

    if (diffMs < 0) {
        return; // 未来の日付が設定されている場合
    }

    const diffMinutes = Math.floor(diffMs / 60000);
    const diffSeconds = Math.floor(diffMs / 1000);

    // 開始からの経過時間の計算
    const startDays = Math.floor(diffMinutes / 1440);
    const startHours = Math.floor((diffMinutes % 1440) / 60);
    const startMinutes = diffMinutes % 60;
    const startSeconds = diffSeconds % 60;

    // 開始からの経過時間を小さめ表示に更新
    document.getElementById('startDays').textContent = startDays;
    document.getElementById('startHours').textContent = startHours;
    document.getElementById('startMinutes').textContent = startMinutes;
    document.getElementById('startSeconds').textContent = startSeconds;

    // 最後に吸ってしまってからの経過時間の計算
    let referenceDate = quitDate; // デフォルトは開始日
    if (slips.length > 0) {
        // 最後に吸った日がある場合はそれを使用
        referenceDate = new Date(slips[0].timestamp);
    }

    const slipDiffMs = now - referenceDate;
    const slipDiffMinutes = Math.floor(slipDiffMs / 60000);
    const slipDiffSeconds = Math.floor(slipDiffMs / 1000);

    const slipDays = Math.floor(slipDiffMinutes / 1440);
    const slipHours = Math.floor((slipDiffMinutes % 1440) / 60);
    const slipMinutes = slipDiffMinutes % 60;
    const slipSeconds = slipDiffSeconds % 60;

    // 最後に吸ってからの経過時間をメイン表示に更新
    document.getElementById('slipDays').textContent = slipDays;
    document.getElementById('slipHours').textContent = slipHours;
    document.getElementById('slipMinutes').textContent = slipMinutes;
    document.getElementById('slipSeconds').textContent = slipSeconds;

    // 統計の計算
    const cigarettesAvoided = Math.floor((diffMinutes / 1440) * quitData.cigarettesPerDay);
    const moneySaved = Math.floor(cigarettesAvoided * quitData.pricePerCigarette);
    const lifeRegained = cigarettesAvoided * 11; // 1本あたり11分寿命が縮むとされる

    // 健康スコアの計算（15年で100%）
    const healthScore = Math.min(100, Math.floor((diffMinutes / 7884000) * 100));

    // 統計の表示
    document.getElementById('moneySaved').textContent = `¥${moneySaved.toLocaleString()}`;
    document.getElementById('cigarettesAvoided').textContent = cigarettesAvoided.toLocaleString();
    document.getElementById('lifeRegained').textContent = lifeRegained.toLocaleString();
    document.getElementById('healthScore').textContent = `${healthScore}%`;

    // マイルストーンの更新（最後に吸ってからの時間で判定）
    updateMilestones(slipDiffMinutes);

    // バッジの更新（最後に吸ってからの時間で判定）
    updateBadges(slipDiffMinutes, moneySaved);

    // 進捗バーの更新（最後に吸ってからの時間で判定）
    updateProgress(slipDiffMinutes);

    // モチベーションメッセージの更新（1日ごとに変更）
    const messageIndex = slipDays % motivationMessages.length;
    document.getElementById('motivationText').textContent = motivationMessages[messageIndex];

    // カレンダーヒートマップの更新
    updateCalendarHeatmap();

    // 渇望記録の更新
    updateCravingsDisplay();

    // 吸っちゃった記録の更新
    updateSlipsDisplay();
}
