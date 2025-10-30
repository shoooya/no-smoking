// イベントリスナーの設定
function setupEventListeners() {
    document.getElementById('setupForm').addEventListener('submit', handleSetup);
    document.getElementById('resetBtn').addEventListener('click', handleReset);
    document.getElementById('shareBtn').addEventListener('click', copyShareURL);

    // 渇望記録関連
    document.getElementById('cravingFab').addEventListener('click', openCravingModal);
    document.getElementById('closeCravingModal').addEventListener('click', closeCravingModal);
    document.getElementById('cravingModal').addEventListener('click', function(e) {
        if (e.target.id === 'cravingModal') {
            closeCravingModal();
        }
    });
    document.getElementById('cravingForm').addEventListener('submit', handleCravingSubmit);
    document.getElementById('intensitySlider').addEventListener('input', function(e) {
        document.getElementById('intensityValue').textContent = e.target.value;
    });

    // 吸っちゃった記録関連
    document.getElementById('slipButton').addEventListener('click', openSlipModal);
    document.getElementById('closeSlipModal').addEventListener('click', closeSlipModal);
    document.getElementById('slipModal').addEventListener('click', function(e) {
        if (e.target.id === 'slipModal') {
            closeSlipModal();
        }
    });
    document.getElementById('slipForm').addEventListener('submit', handleSlipSubmit);
    document.getElementById('slipCountSlider').addEventListener('input', function(e) {
        document.getElementById('slipCountValue').textContent = e.target.value;
    });

    // 対処法のカテゴリーフィルター
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentStrategyFilter = this.dataset.category;
            displayCopingStrategies();
        });
    });

    // SOS関連
    document.getElementById('sosButton').addEventListener('click', openSOS);
    document.getElementById('sosOvercomeBtn').addEventListener('click', closeSOS);

    // 禁煙理由
    document.getElementById('addReasonBtn').addEventListener('click', addReason);

    // トグルボタン
    setupToggleButtons();
}

// トグル機能の設定
function setupToggleButtons() {
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.classList.toggle('hidden');
                this.classList.toggle('collapsed');

                // トグルの状態をローカルストレージに保存
                const isHidden = targetElement.classList.contains('hidden');
                localStorage.setItem(`toggle_${targetId}`, isHidden);
            }
        });
    });

    // ローカルストレージからトグル状態を復元
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        const targetId = btn.dataset.target;
        const targetElement = document.getElementById(targetId);
        const savedState = localStorage.getItem(`toggle_${targetId}`);

        if (savedState === 'true' && targetElement) {
            targetElement.classList.add('hidden');
            btn.classList.add('collapsed');
        }
    });
}

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();

    // 現在時刻をデフォルト値として設定
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('quitDate').value = now.toISOString().slice(0, 16);
});
