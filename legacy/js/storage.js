// データの保存
function saveData() {
    localStorage.setItem('quitData', JSON.stringify(quitData));
    localStorage.setItem('calendarData', JSON.stringify(calendarData));
    localStorage.setItem('cravings', JSON.stringify(cravings));
    localStorage.setItem('slips', JSON.stringify(slips));
    localStorage.setItem('copingStrategies', JSON.stringify(copingStrategies));
    localStorage.setItem('sosHistory', JSON.stringify(sosHistory));
    localStorage.setItem('reasons', JSON.stringify(reasons));
}

// データの読み込み
function loadData() {
    // カレンダーデータの読み込み
    const savedCalendar = localStorage.getItem('calendarData');
    if (savedCalendar) {
        calendarData = JSON.parse(savedCalendar);
    }

    // 渇望記録の読み込み
    const savedCravings = localStorage.getItem('cravings');
    if (savedCravings) {
        cravings = JSON.parse(savedCravings);
    }

    // 吸っちゃった記録の読み込み
    const savedSlips = localStorage.getItem('slips');
    if (savedSlips) {
        slips = JSON.parse(savedSlips);
    }

    // 対処法の読み込み（初回はデフォルトデータを使用）
    const savedStrategies = localStorage.getItem('copingStrategies');
    if (savedStrategies) {
        copingStrategies = JSON.parse(savedStrategies);
    } else {
        copingStrategies = [...defaultCopingStrategies];
        saveData();
    }

    // SOS履歴の読み込み
    const savedSosHistory = localStorage.getItem('sosHistory');
    if (savedSosHistory) {
        sosHistory = JSON.parse(savedSosHistory);
    }

    // 禁煙理由の読み込み（初回はデフォルトデータを使用）
    const savedReasons = localStorage.getItem('reasons');
    if (savedReasons) {
        reasons = JSON.parse(savedReasons);
    } else {
        reasons = [...defaultReasons];
        saveData();
    }

    // まずURLクエリパラメータをチェック
    const urlData = loadDataFromURL();
    if (urlData) {
        quitData = urlData;
        // URLから読み込んだデータもローカルストレージに保存
        saveData();
        showDashboard();
        startUpdating();
        return;
    }

    // URLにデータがない場合、ローカルストレージをチェック
    const saved = localStorage.getItem('quitData');
    if (saved) {
        quitData = JSON.parse(saved);
        showDashboard();
        startUpdating();
    } else {
        showSetup();
    }
}

// URLクエリパラメータから禁煙データを読み取る
function loadDataFromURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('quitDate') && params.has('cigarettesPerDay') &&
        params.has('pricePerPack') && params.has('cigarettesPerPack')) {

        const cigarettesPerDay = parseInt(params.get('cigarettesPerDay'));
        const pricePerPack = parseInt(params.get('pricePerPack'));
        const cigarettesPerPack = parseInt(params.get('cigarettesPerPack'));

        return {
            quitDate: params.get('quitDate'),
            cigarettesPerDay,
            pricePerPack,
            cigarettesPerPack,
            pricePerCigarette: pricePerPack / cigarettesPerPack
        };
    }

    return null;
}
