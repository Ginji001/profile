export const products = [
  {
    emoji: '🧴', name: { ja: 'スキンケア帳', en: 'Skincare Book' },
    description: {
      ja: '化粧品の登録と、曜日ごとの朝・夜ルーティンを管理する無料のPWA。成分の重なりや、刺激が出やすいとされる組み合わせも表示。',
      en: 'A free PWA to register your cosmetics and plan morning and night routines by weekday. It also flags overlapping ingredients and combinations said to irritate.',
    }, tags: ['PWA', 'Skincare'], live: true,
    app: 'https://ginji001.github.io/skincare-pwa/', code: 'https://github.com/Ginji001/skincare-pwa',
  },
  {
    emoji: '🏋️', name: { ja: '筋トレ記録', en: 'Workout Log' },
    description: {
      ja: 'ジムのトレーニングを記録して、次回の重量を自動で入れる筋トレPWA。テンプレートからメニューを作れ、ログイン不要でデータは端末の中だけ。',
      en: 'A workout PWA for the gym that fills in your next weights automatically. Start from a template; no login, data stays on your device.',
    }, tags: ['PWA', 'Workout'], live: true,
    app: 'https://ginji001.github.io/kintore-log/', code: 'https://github.com/Ginji001/kintore-log',
  },
  {
    emoji: '📒', name: { ja: '日本化粧品検定1級 学習ノート', en: 'Japan Cosmetic Exam Lv.1 Study Notes' },
    description: {
      ja: '学習計画、問題ごとの記録と正答率、間違いノート、直前暗記カードをまとめた受験勉強用のPWA。',
      en: 'A study PWA for the exam: study plan, per-question records and accuracy, a mistakes notebook, and last-minute flashcards.',
    }, tags: ['PWA'], live: true,
    app: 'https://ginji001.github.io/cosme-kentei-note/', code: 'https://github.com/Ginji001/cosme-kentei-note', unofficial: true,
  },
  {
    emoji: '🧪', name: { ja: '化粧品成分検定1級 学習ノート', en: 'Cosmetic Ingredient Exam Lv.1 Study Notes' },
    description: {
      ja: '成分のまとめ、問題演習の記録と正答率、直前暗記カードをまとめた受験勉強用のPWA。',
      en: 'A study PWA with ingredient notes, practice-question records and accuracy, and last-minute flashcards.',
    }, tags: ['PWA'], live: true,
    app: 'https://ginji001.github.io/seibun-kentei-note/', code: 'https://github.com/Ginji001/seibun-kentei-note', unofficial: true,
  },
  {
    emoji: '🐾', name: { ja: 'ハチワレ手帳', en: 'Hachiware Notebook' },
    description: {
      ja: 'デイリー、マンスリー、INBOX、習慣、コレクション、ほしい物リストをまとめた手帳PWA。ログイン不要で、写真も含めてデータは端末の中だけ。',
      en: 'A notebook PWA with daily and monthly pages, an inbox, habits, collections, and a wishlist. No login; data, including photos, stays on your device.',
    }, tags: ['PWA', 'Notebook'], live: true,
    app: 'https://ginji001.github.io/hachiware-techo/', code: 'https://github.com/Ginji001/hachiware-techo',
  },
]
