// 禁煙理由の表示
function displayReasons() {
    const container = document.getElementById('reasonList');
    container.innerHTML = '';

    if (reasons.length === 0) {
        container.innerHTML = '<p style="text-align: center; opacity: 0.8;">まだ理由が登録されていません</p>';
        return;
    }

    reasons.forEach(reason => {
        const div = document.createElement('div');
        div.className = 'reason-item';

        div.innerHTML = `
            <div class="reason-header">
                <span class="reason-emoji">${reason.emoji}</span>
            </div>
            <div class="reason-text">${reason.text}</div>
        `;

        container.appendChild(div);
    });
}

// 禁煙理由を追加
function addReason() {
    const text = prompt('禁煙する理由を入力してください:');
    if (!text) return;

    const emojis = ['❤️', '💰', '👨‍👩‍👧‍👦', '✨', '🕊️', '💪', '🌟', '🎯'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    reasons.push({
        id: new Date().getTime().toString(),
        emoji: emoji,
        text: text,
        category: 'カスタム'
    });

    saveData();
    displayReasons();
}
