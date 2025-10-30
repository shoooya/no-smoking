// カレンダーヒートマップの生成と更新
function updateCalendarHeatmap() {
    const container = document.getElementById('calendarHeatmap');
    container.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const quitDate = new Date(quitData.quitDate);
    quitDate.setHours(0, 0, 0, 0);

    // 禁煙開始日から今日までの日数を計算
    const daysSinceQuit = Math.floor((today - quitDate) / (1000 * 60 * 60 * 24));
    const totalDays = Math.max(daysSinceQuit + 1, 7); // 最低1週間は表示
    const weeks = Math.ceil(totalDays / 7);

    // 禁煙開始日を起点に設定
    const startDate = new Date(quitDate);

    for (let week = 0; week < weeks; week++) {
        const weekDiv = document.createElement('div');
        weekDiv.className = 'calendar-week';

        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + (week * 7) + day);

            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';

            const dateStr = formatDateStr(currentDate);
            dayDiv.dataset.date = dateStr;

            // 日付の状態を判定
            if (currentDate > today) {
                // 未来の日付
                dayDiv.classList.add('future');
            } else if (currentDate < quitDate) {
                // 禁煙開始前の日付
                dayDiv.classList.add('future');
            } else {
                // 禁煙開始後の日付
                const dayData = calendarData[dateStr];
                if (dayData) {
                    if (dayData.status === 'slip') {
                        dayDiv.classList.add('slip');
                    } else if (dayData.cravingCount > 0) {
                        dayDiv.classList.add('has-craving');
                    } else {
                        dayDiv.classList.add('success-perfect');
                    }
                } else {
                    // データがない場合は継続中として扱う
                    dayDiv.classList.add('success-light');
                }
            }

            // ホバー時のツールチップ
            dayDiv.addEventListener('mouseenter', function(e) {
                showCalendarTooltip(e, currentDate, dateStr);
            });

            dayDiv.addEventListener('mouseleave', function() {
                hideCalendarTooltip();
            });

            weekDiv.appendChild(dayDiv);
        }

        container.appendChild(weekDiv);
    }
}

// 日付を文字列にフォーマット（YYYY-MM-DD）
function formatDateStr(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// カレンダーツールチップの表示
function showCalendarTooltip(event, date, dateStr) {
    const tooltip = document.getElementById('calendarTooltip');
    const dayData = calendarData[dateStr];
    const today = new Date();
    const quitDate = new Date(quitData.quitDate);

    let content = '';

    if (date > today) {
        content = `${dateStr}<br>未到達`;
    } else if (date < quitDate) {
        content = `${dateStr}<br>禁煙開始前`;
    } else {
        const daysDiff = Math.floor((date - quitDate) / (1000 * 60 * 60 * 24)) + 1;
        content = `${dateStr}<br>禁煙${daysDiff}日目`;

        if (dayData) {
            if (dayData.status === 'slip') {
                content += '<br>❌ スリップ';
            } else if (dayData.cravingCount > 0) {
                content += `<br>⚠️ 渇望${dayData.cravingCount}回`;
            } else {
                content += '<br>✓ 完璧な1日';
            }
            if (dayData.notes) {
                content += `<br>${dayData.notes}`;
            }
        } else {
            content += '<br>✓ 禁煙継続中';
        }
    }

    tooltip.innerHTML = content;
    tooltip.style.display = 'block';

    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = (rect.left + window.scrollX) + 'px';
    tooltip.style.top = (rect.bottom + window.scrollY + 5) + 'px';
}

// カレンダーツールチップの非表示
function hideCalendarTooltip() {
    const tooltip = document.getElementById('calendarTooltip');
    tooltip.style.display = 'none';
}

// 今日のカレンダーデータを初期化（まだ存在しない場合）
function initTodayCalendarData() {
    const today = formatDateStr(new Date());
    if (!calendarData[today]) {
        calendarData[today] = {
            status: 'success',
            cravingCount: 0,
            notes: ''
        };
        saveData();
    }
}
