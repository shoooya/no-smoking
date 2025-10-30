// 対処法の表示
function displayCopingStrategies() {
    const container = document.getElementById('strategyGrid');
    container.innerHTML = '';

    let filteredStrategies = copingStrategies;

    if (currentStrategyFilter === 'favorite') {
        filteredStrategies = copingStrategies.filter(s => s.favorite);
    } else if (currentStrategyFilter !== 'all') {
        filteredStrategies = copingStrategies.filter(s => s.category === currentStrategyFilter);
    }

    if (filteredStrategies.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px; grid-column: 1/-1;">該当する対処法がありません</p>';
        return;
    }

    filteredStrategies.forEach(strategy => {
        const div = document.createElement('div');
        div.className = 'strategy-item';

        const favoriteClass = strategy.favorite ? 'active' : '';

        div.innerHTML = `
            <div class="strategy-header">
                <div class="strategy-emoji">${strategy.emoji}</div>
                <button class="strategy-favorite ${favoriteClass}" data-id="${strategy.id}">⭐</button>
            </div>
            <div class="strategy-name">${strategy.name}</div>
            <div class="strategy-duration">⏱️ ${strategy.duration}</div>
            <div class="strategy-description">${strategy.description}</div>
            <div class="strategy-stats">
                <span>使用回数: ${strategy.timesUsed}</span>
            </div>
            <button class="strategy-use-btn" data-id="${strategy.id}">この対処法を試す</button>
        `;

        container.appendChild(div);
    });

    // イベントリスナーの追加
    container.querySelectorAll('.strategy-favorite').forEach(btn => {
        btn.addEventListener('click', function() {
            toggleStrategyFavorite(this.dataset.id);
        });
    });

    container.querySelectorAll('.strategy-use-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            useStrategy(this.dataset.id);
        });
    });
}

// 対処法のお気に入りトグル
function toggleStrategyFavorite(id) {
    const strategy = copingStrategies.find(s => s.id === id);
    if (strategy) {
        strategy.favorite = !strategy.favorite;
        saveData();
        displayCopingStrategies();
    }
}

// 対処法を使用
function useStrategy(id) {
    const strategy = copingStrategies.find(s => s.id === id);
    if (strategy) {
        strategy.timesUsed++;
        saveData();
        displayCopingStrategies();
        alert(`「${strategy.name}」を実行します。${strategy.duration}かかります。\n\n${strategy.description}`);
    }
}
