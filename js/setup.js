// セットアップフォームの処理
function handleSetup(e) {
    e.preventDefault();

    const quitDate = new Date(document.getElementById('quitDate').value);
    const cigarettesPerDay = parseInt(document.getElementById('cigarettesPerDay').value);
    const pricePerPack = parseInt(document.getElementById('pricePerPack').value);
    const cigarettesPerPack = parseInt(document.getElementById('cigarettesPerPack').value);

    quitData = {
        quitDate: quitDate.toISOString(),
        cigarettesPerDay,
        pricePerPack,
        cigarettesPerPack,
        pricePerCigarette: pricePerPack / cigarettesPerPack
    };

    saveData();
    showDashboard();
    startUpdating();
}

// リセット処理
function handleReset() {
    if (confirm('本当にデータをリセットしますか？これまでの記録は全て削除されます。')) {
        localStorage.removeItem('quitData');
        localStorage.removeItem('calendarData');
        localStorage.removeItem('cravings');
        localStorage.removeItem('slips');
        localStorage.removeItem('copingStrategies');
        localStorage.removeItem('sosHistory');
        localStorage.removeItem('reasons');
        quitData = null;
        calendarData = {};
        cravings = [];
        slips = [];
        sosHistory = [];
        if (updateInterval) {
            clearInterval(updateInterval);
        }
        showSetup();
    }
}

// セットアップ画面を表示
function showSetup() {
    document.getElementById('setup').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('dashboard').style.display = 'none';
}

// ダッシュボードを表示
function showDashboard() {
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('setup').style.display = 'none';
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('cravingFab').classList.remove('hidden');
    document.getElementById('slipButton').classList.remove('hidden');
    document.getElementById('sosButton').classList.remove('hidden');
}
