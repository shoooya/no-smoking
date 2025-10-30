// 健康マイルストーン（医学的根拠に基づく）
const healthMilestones = [
    { minutes: 20, text: '血圧と脈拍が正常値に戻り始めます', icon: '❤️' },
    { minutes: 480, text: '血中の一酸化炭素濃度が正常値に戻ります', icon: '🫁' },
    { minutes: 1440, text: '心臓発作のリスクが減少し始めます', icon: '💓' },
    { minutes: 2880, text: '味覚と嗅覚が回復し始めます', icon: '👃' },
    { minutes: 10080, text: '肺機能が改善し、呼吸が楽になります', icon: '🌬️' },
    { minutes: 43200, text: '循環器系が大幅に改善されます', icon: '🩸' },
    { minutes: 129600, text: '肺がきれいになり、感染症のリスクが低下します', icon: '✨' },
    { minutes: 525600, text: '心臓病のリスクが半減します', icon: '💪' },
    { minutes: 2628000, text: '肺がん等のリスクが大幅に低下します', icon: '🎯' },
    { minutes: 7884000, text: '健康状態がほぼ非喫煙者レベルに！', icon: '🏆' }
];

// 達成バッジ
const achievements = [
    { id: 'first-hour', minutes: 60, name: '最初の1時間', icon: '⭐' },
    { id: 'first-day', minutes: 1440, name: '1日達成', icon: '🌟' },
    { id: 'three-days', minutes: 4320, name: '3日達成', icon: '✨' },
    { id: 'one-week', minutes: 10080, name: '1週間達成', icon: '🎖️' },
    { id: 'two-weeks', minutes: 20160, name: '2週間達成', icon: '🏅' },
    { id: 'one-month', minutes: 43200, name: '1ヶ月達成', icon: '🥇' },
    { id: 'three-months', minutes: 129600, name: '3ヶ月達成', icon: '👑' },
    { id: 'six-months', minutes: 259200, name: '6ヶ月達成', icon: '💎' },
    { id: 'one-year', minutes: 525600, name: '1年達成', icon: '🏆' },
    { id: 'money-saver', condition: 'money', threshold: 10000, name: '節約1万円', icon: '💰' },
    { id: 'big-saver', condition: 'money', threshold: 50000, name: '節約5万円', icon: '💵' },
    { id: 'mega-saver', condition: 'money', threshold: 100000, name: '節約10万円', icon: '💴' }
];

// 対処法の初期データ
const defaultCopingStrategies = [
    {
        id: "deep-breathing",
        name: "深呼吸エクササイズ",
        category: "即効性",
        duration: "2-3分",
        emoji: "🫁",
        description: "4秒吸って、7秒止めて、8秒吐く。これを3-5回繰り返します。",
        effectiveness: 0,
        timesUsed: 0,
        favorite: false
    },
    {
        id: "water-drink",
        name: "水を飲む",
        category: "即効性",
        duration: "1分",
        emoji: "💧",
        description: "コップ1杯の水をゆっくり飲みます。口の中をリフレッシュ。",
        effectiveness: 0,
        timesUsed: 0,
        favorite: false
    },
    {
        id: "hand-massage",
        name: "手のマッサージ",
        category: "即効性",
        duration: "2-3分",
        emoji: "🤲",
        description: "手のツボを押したり、指を揉んだりします。",
        effectiveness: 0,
        timesUsed: 0,
        favorite: false
    },
    {
        id: "walk",
        name: "短い散歩",
        category: "中期対策",
        duration: "10-15分",
        emoji: "🚶",
        description: "外の空気を吸いながら歩きます。環境を変えることが効果的。",
        effectiveness: 0,
        timesUsed: 0,
        favorite: false
    },
    {
        id: "call-friend",
        name: "友人に電話",
        category: "中期対策",
        duration: "5-10分",
        emoji: "📞",
        description: "サポートしてくれる人と話します。",
        effectiveness: 0,
        timesUsed: 0,
        favorite: false
    },
    {
        id: "snack",
        name: "健康的なスナック",
        category: "即効性",
        duration: "3-5分",
        emoji: "🥕",
        description: "ニンジンスティック、ガム、ナッツなどを食べます。",
        effectiveness: 0,
        timesUsed: 0,
        favorite: false
    },
    {
        id: "exercise",
        name: "軽い運動",
        category: "中期対策",
        duration: "15-30分",
        emoji: "🏃",
        description: "ジョギング、ストレッチ、ヨガなど体を動かします。",
        effectiveness: 0,
        timesUsed: 0,
        favorite: false
    },
    {
        id: "hobby",
        name: "趣味に没頭",
        category: "長期戦略",
        duration: "30分以上",
        emoji: "🎨",
        description: "読書、音楽、ゲーム、クラフトなど好きなことをします。",
        effectiveness: 0,
        timesUsed: 0,
        favorite: false
    },
    {
        id: "meditation",
        name: "瞑想・マインドフルネス",
        category: "中期対策",
        duration: "10-20分",
        emoji: "🧘",
        description: "静かに座って、呼吸に意識を向けます。",
        effectiveness: 0,
        timesUsed: 0,
        favorite: false
    },
    {
        id: "support-group",
        name: "サポートグループ参加",
        category: "長期戦略",
        duration: "継続的",
        emoji: "👥",
        description: "禁煙仲間とのコミュニティに参加します。",
        effectiveness: 0,
        timesUsed: 0,
        favorite: false
    }
];

// デフォルトの禁煙理由
const defaultReasons = [
    { id: 'health', emoji: '❤️', text: '健康のために', category: '健康' },
    { id: 'money', emoji: '💰', text: 'お金を節約したい', category: 'お金' },
    { id: 'family', emoji: '👨‍👩‍👧‍👦', text: '家族のために', category: '家族' }
];

// モチベーションメッセージ
const motivationMessages = [
    '素晴らしい！あなたは健康への第一歩を踏み出しました。',
    '一本吸わない度に、あなたの体は回復しています。',
    '禁煙は最高の自己投資です。続けましょう！',
    'あなたの意志の強さは素晴らしいです。',
    '毎日が新しい勝利です。誇りに思ってください！',
    'タバコなしの人生は、より明るく健康的です。',
    'あなたは自分の健康をコントロールしています。',
    '禁煙の道のりは簡単ではありませんが、あなたならできます！',
    '今日も禁煙を続けることができました。素晴らしい！',
    'あなたの努力は、必ず報われます。頑張りましょう！'
];
