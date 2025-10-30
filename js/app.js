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
