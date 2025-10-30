// マイルストーンの更新
function updateMilestones(currentMinutes) {
    const milestonesContainer = document.getElementById('milestones');
    milestonesContainer.innerHTML = '';

    let nextMilestoneFound = false;

    healthMilestones.forEach(milestone => {
        const div = document.createElement('div');
        div.className = 'milestone';

        let statusText = '';
        let statusClass = '';
        let remainingText = '';

        if (currentMinutes >= milestone.minutes) {
            div.classList.add('achieved');
            statusText = '達成済み ✓';
            statusClass = 'milestone-status';
        } else if (!nextMilestoneFound) {
            div.classList.add('next');
            statusText = '次の目標 →';
            statusClass = 'milestone-status';
            nextMilestoneFound = true;

            // 残り時間を計算
            const remainingMinutes = milestone.minutes - currentMinutes;
            remainingText = `<div class="milestone-remaining">あと ${formatRemainingTime(remainingMinutes)}</div>`;
        } else {
            div.classList.add('upcoming');
            statusText = '未達成';
            statusClass = 'milestone-status';

            // 残り時間を計算
            const remainingMinutes = milestone.minutes - currentMinutes;
            remainingText = `<div class="milestone-remaining">あと ${formatRemainingTime(remainingMinutes)}</div>`;
        }

        const timeText = formatMilestoneTime(milestone.minutes);

        div.innerHTML = `
            <span class="milestone-icon">${milestone.icon}</span>
            <div class="${statusClass}">${statusText}</div>
            <div class="milestone-time">${timeText}</div>
            <div class="milestone-benefit">${milestone.text}</div>
            ${remainingText}
        `;

        milestonesContainer.appendChild(div);
    });
}

// 残り時間のフォーマット
function formatRemainingTime(minutes) {
    if (minutes < 60) {
        return `${minutes}分`;
    } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
    } else if (minutes < 43200) {
        const days = Math.floor(minutes / 1440);
        const hours = Math.floor((minutes % 1440) / 60);
        return hours > 0 ? `${days}日${hours}時間` : `${days}日`;
    } else if (minutes < 525600) {
        const months = Math.floor(minutes / 43200);
        const days = Math.floor((minutes % 43200) / 1440);
        return days > 0 ? `${months}ヶ月${days}日` : `${months}ヶ月`;
    } else {
        const years = Math.floor(minutes / 525600);
        const months = Math.floor((minutes % 525600) / 43200);
        return months > 0 ? `${years}年${months}ヶ月` : `${years}年`;
    }
}

// マイルストーン時間のフォーマット
function formatMilestoneTime(minutes) {
    if (minutes < 60) {
        return `${minutes}分`;
    } else if (minutes < 1440) {
        return `${Math.floor(minutes / 60)}時間`;
    } else if (minutes < 43200) {
        return `${Math.floor(minutes / 1440)}日`;
    } else if (minutes < 525600) {
        return `${Math.floor(minutes / 43200)}ヶ月`;
    } else {
        return `${Math.floor(minutes / 525600)}年`;
    }
}

// バッジの更新
function updateBadges(currentMinutes, moneySaved) {
    const badgesContainer = document.getElementById('badges');
    badgesContainer.innerHTML = '';

    achievements.forEach(achievement => {
        const div = document.createElement('div');
        div.className = 'badge';

        let earned = false;
        if (achievement.condition === 'money') {
            earned = moneySaved >= achievement.threshold;
        } else {
            earned = currentMinutes >= achievement.minutes;
        }

        if (earned) {
            div.classList.add('earned');
        }

        div.innerHTML = `
            <div class="badge-icon">${achievement.icon}</div>
            <div class="badge-name">${achievement.name}</div>
        `;

        badgesContainer.appendChild(div);
    });
}

// 進捗バーの更新
function updateProgress(currentMinutes) {
    // 1週間（10080分）
    const week1Percent = Math.min(100, Math.floor((currentMinutes / 10080) * 100));
    document.getElementById('week1Progress').textContent = `${week1Percent}%`;
    document.getElementById('week1Bar').style.width = `${week1Percent}%`;
    document.getElementById('week1Bar').textContent = week1Percent > 0 ? `${week1Percent}%` : '';

    // 1ヶ月（43200分）
    const month1Percent = Math.min(100, Math.floor((currentMinutes / 43200) * 100));
    document.getElementById('month1Progress').textContent = `${month1Percent}%`;
    document.getElementById('month1Bar').style.width = `${month1Percent}%`;
    document.getElementById('month1Bar').textContent = month1Percent > 0 ? `${month1Percent}%` : '';

    // 1年（525600分）
    const year1Percent = Math.min(100, Math.floor((currentMinutes / 525600) * 100));
    document.getElementById('year1Progress').textContent = `${year1Percent}%`;
    document.getElementById('year1Bar').style.width = `${year1Percent}%`;
    document.getElementById('year1Bar').textContent = year1Percent > 0 ? `${year1Percent}%` : '';
}
