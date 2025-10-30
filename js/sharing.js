// 共有用URLを生成
function generateShareURL() {
    if (!quitData) return null;

    const baseURL = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
        quitDate: quitData.quitDate,
        cigarettesPerDay: quitData.cigarettesPerDay,
        pricePerPack: quitData.pricePerPack,
        cigarettesPerPack: quitData.cigarettesPerPack
    });

    return `${baseURL}?${params.toString()}`;
}

// 共有URLをコピー
function copyShareURL() {
    const shareURL = generateShareURL();
    if (!shareURL) return;

    navigator.clipboard.writeText(shareURL).then(() => {
        const btn = document.getElementById('shareBtn');
        const originalText = btn.textContent;
        btn.textContent = '✓ URLをコピーしました！';
        btn.style.background = 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        alert('URLのコピーに失敗しました: ' + err);
    });
}
