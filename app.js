// Auto-split from single-file build (v1.4).
// Master data / constants

// ===============================
// 🎯 英雄別スロットアドバイス（S6対応）
// ===============================


// EW Lvに最も近いアドバイスを取得
function getHeroEwAdvice(heroId, ewLv) {
  const advice = (HERO_DB[heroId] && HERO_DB[heroId].advice);
  if (!advice) return null;
  const keys = Object.keys(advice.ewAdvice).map(Number).sort((a,b)=>b-a);
  for (const k of keys) {
    if (ewLv >= k) return advice.ewAdvice[k];
  }
  return advice.ewAdvice[0] || '';
}

const SHARD_ICON = 'img/original.webp';


// ===============================
// ⭐ メタ育成優先（兵種コア / tier）
// ===============================



// ===============================
// ⭐ 兵種シフト（完全自動推定）用の設定
// ※閾値は app.js 側で毎回推定（ここは係数とコア定義だけ）
// ===============================
const META_SHIFT = {
  core: {
    tank:   { ids:['kimberly','williams','stetmann'], targets:[30,20,20] },
    air:    { ids:['lucius','dva'],                   targets:[30,20] },  // DVAはLv20で覚醒前提を満たす
    missile:{ ids:['fiona','tesla','mcgregor'],        targets:[30,20,20] }
  },
  mult: {
    boostNext: 1.08,   // 次兵種を押し上げ（控えめ）
    dampPrev:  0.98,   // 前兵種を少し抑える（抑えすぎ防止）
    seedBoost: 1.05,   // 種まき段階（やや慎重）
    shiftBoost: 1.10,  // 本格移行段階
    weakOfftypeDamp: 0.90
  },
  progress: {
    maxWp: 30,
    minMult: 0.92,     // wp=0
    maxMult: 1.08      // wp=max
  }
};

const META_SHIFT_STAGE = {
  weakMain: 0.58,
  matureMain: 0.74,
  seedStart: 0.38,
  shiftStart: 0.60,
  fullShift: 0.82,
  keepCurrentCost: 1.06,
  keepCurrentFuture: 1.03,
  seedFuture: 1.04,
  shiftFuture: 1.10,
  lowMainOfftypeCost: 0.94,
  lowMainOfftypeFuture: 0.92
};


// ===============================
// ⭐ 汎用化ロジック用マスタ
// ===============================






const HERO_PAIR_SYNERGY = {
  // Air core
  dva: {
    lucius:   { base: 1.05, lv10: 1.06, lv20: 1.08, lv30: 1.10 },
    morrison: { base: 1.03, lv10: 1.04, lv20: 1.06, lv30: 1.07 },
    schuyler: { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 }, // CC封殺→単体バーストのコンボ
    murphy:   { base: 1.01, lv10: 1.02, lv20: 1.03, lv30: 1.04 }, // 4+1想定
    marshall: { base: 1.01, lv10: 1.02, lv20: 1.03, lv30: 1.04 } // 汎用支援（marshall→dvaの対称）
  },
  lucius: {
    dva:      { base: 1.05, lv10: 1.06, lv20: 1.08, lv30: 1.10 },
    schuyler: { base: 1.03, lv10: 1.04, lv20: 1.05, lv30: 1.06 },
    morrison: { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 },
    murphy:   { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 }, // 4+1想定
    carlie:   { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 } // 前衛2枚目（航空）
  },
  morrison: {
    dva:      { base: 1.03, lv10: 1.04, lv20: 1.06, lv30: 1.07 },
    lucius:   { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 },
    schuyler: { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 }
  },
  schuyler: {
    lucius:   { base: 1.03, lv10: 1.04, lv20: 1.05, lv30: 1.06 },
    dva:      { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 },
    morrison: { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 }, // morrison→schuylerの対称
    kimberly: { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 } // kimberly→schuylerの対称
  },
  carlie: {
    lucius:   { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 } // lucius→carlieの対称
  },

  // Tank core
  kimberly: {
    marshall: { base: 1.04, lv10: 1.06, lv20: 1.08, lv30: 1.09 },
    murphy:   { base: 1.03, lv10: 1.04, lv20: 1.06, lv30: 1.06 },
    williams: { base: 1.03, lv10: 1.04, lv20: 1.05, lv30: 1.06 },
    stetmann: { base: 1.03, lv10: 1.04, lv20: 1.05, lv30: 1.06 },
    schuyler: { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 } // CC封殺→AoE炸裂のコンボ（packsify推奨）
  },
  marshall: {
    kimberly: { base: 1.04, lv10: 1.06, lv20: 1.08, lv30: 1.09 },
    stetmann: { base: 1.03, lv10: 1.04, lv20: 1.05, lv30: 1.06 },
    dva:      { base: 1.01, lv10: 1.02, lv20: 1.03, lv30: 1.04 }, // 汎用支援
    murphy:   { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 }, // murphy→marshallの対称
    williams: { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 } // williams→marshallの対称
  },
  murphy: {
    williams: { base: 1.03, lv10: 1.04, lv20: 1.05, lv30: 1.06 },
    kimberly: { base: 1.03, lv10: 1.04, lv20: 1.06, lv30: 1.06 },
    marshall: { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 },
    dva:      { base: 1.01, lv10: 1.02, lv20: 1.03, lv30: 1.04 }, // dva→murphyの対称（4+1想定）
    lucius:   { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 } // lucius→murphyの対称（4+1想定）
  },
  williams: {
    murphy:   { base: 1.03, lv10: 1.04, lv20: 1.05, lv30: 1.06 },
    kimberly: { base: 1.03, lv10: 1.04, lv20: 1.05, lv30: 1.06 },
    marshall: { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 }
  },
  stetmann: {
    kimberly: { base: 1.03, lv10: 1.04, lv20: 1.05, lv30: 1.06 },
    marshall: { base: 1.03, lv10: 1.04, lv20: 1.05, lv30: 1.06 }
  },

  // Missile core
  adam: {
    tesla:    { base: 1.04, lv10: 1.05, lv20: 1.07, lv30: 1.08 },
    fiona:    { base: 1.04, lv10: 1.05, lv20: 1.07, lv30: 1.08 },
    mcgregor: { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 },
    swift:    { base: 1.01, lv10: 1.02, lv20: 1.03, lv30: 1.04 },
    venom:    { base: 1.02, lv10: 1.03, lv20: 1.05, lv30: 1.06 },
    brats:    { base: 1.02, lv10: 1.03, lv20: 1.05, lv30: 1.06 }
  },
  fiona: {
    tesla:    { base: 1.03, lv10: 1.04, lv20: 1.05, lv30: 1.06 },
    adam:     { base: 1.04, lv10: 1.05, lv20: 1.07, lv30: 1.08 },
    mcgregor: { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 },
    venom:    { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 },
    brats:    { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 }
  },
  swift: {
    adam:     { base: 1.01, lv10: 1.02, lv20: 1.03, lv30: 1.04 } // adam→swiftの対称
  },
  venom: {
    adam:     { base: 1.02, lv10: 1.03, lv20: 1.05, lv30: 1.06 }, // adam→venomの対称
    fiona:    { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 } // fiona→venomの対称
  },
  brats: {
    adam:     { base: 1.02, lv10: 1.03, lv20: 1.05, lv30: 1.06 }, // adam→bratsの対称
    fiona:    { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 } // fiona→bratsの対称
  },
  tesla: {
    fiona:    { base: 1.03, lv10: 1.04, lv20: 1.05, lv30: 1.06 },
    adam:     { base: 1.04, lv10: 1.05, lv20: 1.07, lv30: 1.08 },
    mcgregor: { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 } // mcgregor→teslaの対称
  },
  mcgregor: {
    adam:     { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 },
    fiona:    { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 },
    tesla:    { base: 1.02, lv10: 1.03, lv20: 1.04, lv30: 1.05 } // 前衛の挑発でテスラのDoT展開を守る
  }
};

// 互換用（既存 app.js 参照名）
const HERO_SYNERGY = HERO_PAIR_SYNERGY;



const MATCHUP_MODIFIER = {
  morrison: { vsEnemy: { murphy: 0.94 } },
  dvaFront: { vsEnemy: { williams: 0.93 } },
  lucius: { withEW30: 1.05 }
};



const TYPE_COUNTER_WEIGHT = {
  // 実際の相性：戦車はミサイルに強く航空に弱い／航空は戦車に強くミサイルに弱い／ミサイルは航空に強く戦車に弱い
  // 値は「自分の兵種から見て、相手の兵種に対する有利度」（1.00=最も有利、0.30=不利）
  tank:{ tank:0.30, air:0.50, mis:1.00 },
  air:{ tank:1.00, air:0.30, mis:0.50 },
  mis:{ tank:0.50, air:1.00, mis:0.30 },
  none:{ tank:0.50, air:0.50, mis:0.50 }
};

// プレイヤータイプ（無課金・微課金・重課金）別の重み付けプリセット。
// cost   = コスパ（強化値÷コスト）をどれだけ重視するか
// coverage = 編成の弱点対策をどれだけ重視するか
// future = 将来性・最大火力をどれだけ重視するか（コストは度外視しがち）
// 無課金ほどcostを高く、重課金ほどfutureを高くする設計。
// プレイヤータイプ別の「コストペナルティ指数」(cost^X の X)。
// 指数が小さいほど高コスト項目への割り負けが緩くなり、コストを気にしない重課金プレイヤー向けになる。
// 無課金は従来通りの0.52（コスパ重視）、重課金は0.20まで下げて高コスト・高威力の投資を上位表示しやすくする。
// ※ROUTE_WEIGHT_PRESETのcost/coverage/future重みは「3スコアの混ぜ方」の調整であり、
//   こちらはスコアの土台（basePerCost）そのもののコスト感度を変える、より根本的な調整。
const COST_PENALTY_EXP_PRESET = {
  f2p:   0.52,  // 無課金：コストの影響を強く受ける（コスパ重視）
  light: 0.38,  // 微課金：中間
  heavy: 0.20,  // 重課金：コストの影響を弱め、最大火力・将来性を重視
};

const ROUTE_WEIGHT_PRESET = {
  f2p:    { cost:0.65, coverage:0.25, future:0.10 },  // 無課金：コスパ最優先
  light:  { cost:0.45, coverage:0.30, future:0.25 },  // 微課金：バランス型（旧overall相当）
  heavy:  { cost:0.20, coverage:0.20, future:0.60 },  // 重課金：将来性・最大火力重視
  // 後方互換用（旧名）。新規コードはplayerType経由のpresetを使うこと。
  overall:{ cost:0.45, coverage:0.30, future:0.25 },
  safe:   { cost:0.60, coverage:0.25, future:0.15 }
};

// プレイヤータイプ別の「ロール別目標EW Lv」。達成率（部隊完成度）の基準値になる。
// 無課金は現実的なF2P目標、重課金はフルEW（Lv30/Lv30/Lv20）を目指す前提。
const ROLE_TARGET_PRESET = {
  f2p:   { atk:20, wall:20, sup:10 },
  light: { atk:25, wall:25, sup:15 },
  heavy: { atk:30, wall:30, sup:20 },
};

const PLAYER_TYPE_LABELS = {
  f2p:   { label: '無課金', icon: '🆓' },
  light: { label: '微課金', icon: '💳' },
  heavy: { label: '重課金', icon: '💎' },
};

// プレイヤータイプの保存・読み込み（localStorage、AIプロバイダ選択と同じ方式）
function loadPlayerType() {
    try {
        const v = localStorage.getItem('player_type');
        return (v && ROUTE_WEIGHT_PRESET[v] && ROLE_TARGET_PRESET[v]) ? v : 'f2p';
    } catch(e) { return 'f2p'; }
}
function savePlayerType(type) {
    try {
        if (ROUTE_WEIGHT_PRESET[type] && ROLE_TARGET_PRESET[type]) {
            localStorage.setItem('player_type', type);
        }
        updatePlayerTypeButtons();
        // プレイヤータイプの変更は達成率・育成優先ランキング・補強候補の計算全てに影響するため、
        // 編成評価と育成優先ランキングを再計算してUIに反映する。
        try { updateAllSquads(); } catch(e) {}
        try { generateAiSuggestion(); } catch(e) {}
    } catch(e) {}
}
function updatePlayerTypeButtons() {
    try {
        const current = loadPlayerType();
        ['f2p','light','heavy'].forEach(type => {
            const btn = $id('player-type-btn-' + type);
            if (!btn) return;
            const active = (type === current);
            btn.style.background = active ? '#2563eb' : '#fff';
            btn.style.color = active ? '#fff' : '#475569';
            btn.style.borderColor = active ? '#2563eb' : '#cbd5e1';
        });
    } catch(e) {}
}


// ===============================
// ⭐ 専用武装タグ（簡易判定用）
// ===============================
// ⚠️ 現状このオブジェクトはコード内のどこからも参照されていない（未使用データ）。
// スキル効果の分類（dot/shield/cc_stun等）に加え、UR昇格組には pve_value・early_pvp_hold
// 等のモード適性タグも一部存在する。将来PvE/PvP適性をスコアに反映したくなった場合の
// 土台として残してあるが、現状は評価軸（育成コスパ中心）に組み込む方針にしていない。
// 削除はせず、参考データとして保持。



// ===============================
// ⭐ 表示理由ラベル辞書（UI文言は data.js 管理）
// ===============================
const REASON_LABELS = {
  policy: {
    build_main: "主力編成の強化",
    hold: "今の編成で活躍",
    seed: "次世代の布石",
    seed_air: "航空の布石",
    seed_mis: "ロケランの布石",
    shift: "移行を加速",
    shift_air: "航空シフト中",
    shift_mis: "ロケランシフト中",
    full_shift: "兵種完全移行"
  },
  efficiency: {
    low_cost: "省コスト",
    mid_cost: "中コスト",
    high_cost: "大型投資",
    ew_milestone: "Lv節目",
    lv30: "MAX育成"
  },
  timing: {
    immediate: "即戦力UP",
    future: "長期向き",
    promoted_ur: "昇格UR"
  },
  synergy: {
    front2: "守りが安定する",
    mono_type: "兵種バフ維持",
    awaken_combo: "覚醒で火力倍増",
    meta_combo: "鉄板の組み合わせ",
    carry_support: "主力を後押し",
  }
};

const IMPACT_LABELS = {
  tankiness: "耐久補強",
  stability: "編成強化",
  carry: "火力強化",
  subdps: "後衛火力",
  support: "支援強化",
  burst: "爆発力",
  efficiency: "コスパ◎"
};

const REASON_BADGE_STYLE = {
  build_main: "neutral",
  hold: "neutral",
  seed: "accent",
  seed_air: "accent",
  seed_mis: "accent",
  shift: "accent",
  shift_air: "accent",
  shift_mis: "accent",
  full_shift: "accent",
  low_cost: "good",
  mid_cost: "neutral",
  high_cost: "warn",
  ew_milestone: "accent",
  lv30: "future",   // MAX育成 → 紫（将来への大投資）
  immediate: "good",
  future: "future",
  promoted_ur: "neutral",
  front2: "good",
  mono_type: "good",
  awaken_combo: "future",
  meta_combo: "future",
  carry_support: "accent",
};

const IMPACT_BADGE_STYLE = {
  tankiness: "defense",
  stability: "neutral",
  carry: "attack",
  subdps: "attack",
  support: "support",
  burst: "attack",
  efficiency: "good"
};

const REASON_BADGE_PRIORITY = [
  "synergy",
  "policy",
  "efficiency",
  "timing"
];

const REASON_EXCLUDE_BY_IMPACT = {
  tankiness: ["front_fill", "sustain"],
  stability: ["coverage"],
  carry: ["carry_boost"],
  subdps: ["subdps_boost"],
  support: ["support_value"],
  burst: [],
  efficiency: []
};


const SUMMARY_TEMPLATES = {
  build_main: {
    tankiness: "前衛タンクを育てて編成の耐久力を高めよう",
    stability: "今の編成バランスを維持しながら底上げできる",
    carry: "主力エースをさらに強くして火力を引き上げよう",
    subdps: "サブ火力を強化して攻撃の厚みを増やそう",
    support: "サポートを育てて全体のスキル回転を上げよう",
    burst: "開幕バーストの威力を高めて先手を取りやすくしよう",
    default: "1軍の戦力を直接引き上げられる"
  },
  hold: {
    tankiness: "前衛タンクを補強して編成の安定感を上げよう",
    stability: "現在の編成を崩さず底上げできる",
    carry: "主力エースをさらに育てて火力を上げよう",
    support: "サポートを強化してチーム全体を底上げしよう",
    default: "1軍の強化を安定して進められる"
  },
  seed: {
    tankiness: "次兵種の前衛タンク候補を先に育てておこう",
    stability: "兵種移行の下準備として育てておくと後が楽になる",
    carry: "次の主力候補を今から育て始めると移行がスムーズ",
    subdps: "次兵種の火力候補を先行育成しておこう",
    support: "次兵種向けサポートの準備を進めよう",
    burst: "次兵種の開幕火力候補として先行育成しておこう",
    default: "次の兵種移行に向けた先行投資として有効"
  },
  shift: {
    tankiness: "兵種移行中の前衛不足を補える重要な1枚",
    stability: "移行期の編成を安定させるために育てよう",
    carry: "新しい主力エースとして移行をリードできる",
    subdps: "新しい主軸の火力を補完できる",
    support: "移行後の編成を支えるサポートとして有効",
    default: "兵種移行を加速できるタイミング"
  },
  full_shift: {
    tankiness: "新兵種の前衛タンクを固めて編成を完成させよう",
    stability: "新しい主軸編成の完成度を高めよう",
    carry: "新しい主力エースをMAXに近づけよう",
    support: "移行完了後の編成に必要なサポートを育てよう",
    default: "新兵種の編成をさらに強化できる"
  },
  low_cost: {
    default: "少ないコストで着実に戦力を底上げできる"
  },
  high_cost: {
    default: "コストは重いが強化後の伸びが大きい"
  },
  lv30: {
    carry: "Lv30でエースの火力が大きく跳ね上がる",
    subdps: "Lv30でサブ火力の伸びが期待できる",
    support: "Lv30でサポート効果が本格的になる",
    default: "Lv30投資で戦力の伸びが大きい"
  },
  future: {
    default: "今は地味でも中長期で大きく戦力に貢献する"
  },
  immediate: {
    default: "育てるとすぐ1軍で活躍できる"
  }
};


// ===============================
// ⭐ S6 英雄覚醒システム
// ===============================
// 覚醒の構造：
//   ★0 = 未覚醒
//   ★1〜5：各★に5段階ティア（★1だけは4ティア）
//   表記例：awTier = { star:1, tier:3 } → 「★1-3」
//
// シャードコスト（cpt-hedge.com検証済み）:
//   解放     : 50個（名前付き）
//   ★1 ティア1〜4 : 各20個（計80個）  → ★1合計130
//   ★2 ティア1〜5 : 各40個（計200個） → ★2追加200
//   ★3 ティア1〜5 : 各70個（計350個） → ★3追加350
//   ★4 ティア1〜5 : 各80個（計400個） → ★4追加400（未公式推定）
//   ★5 ティア1〜5 : 各100個（計500個）→ ★5追加500（未公式推定）
//   最大合計 : 1,580個
//
// awTier の保存形式: "star-tier" 文字列（例 "1-3"）
//   未覚醒 = "0-0"  解放済み（★0完了）= "1-0"（★1への途中）

// 覚醒ティア構造：★0〜★5、各★に1〜5の5ティア
// "star-tier" 文字列で管理（例: "0-1"=★0-1, "1-3"=★1-3）
// 未覚醒 = "none"
//
// シャードコスト（cpt-hedge.com確認済み）:
//   ★0-1 : 専用覚醒かけら×50（名前付き、解放）
//   ★0-2〜★0-5 : 各20個（汎用可）
//   ★1-1〜★1-5 : 各40個
//   ★2-1〜★2-5 : 各70個
//   ★3-1〜★3-5 : 各80個（未公式・推定）
//   ★4-1〜★4-5 : 各100個（未公式・推定）
//   ★0合計130・★1〜4追加200/350/400/500、総計1,580個

// ★ごとのティアあたりシャードコスト（★0-1のみ特殊）
const AW_SHARD_PER_TIER = { 0:20, 1:40, 2:70, 3:80, 4:100, 5:0 }; // star=5はMAX
// ★0-1だけ専用かけら50（named:true で区別）

// ====================================================
// 📋 新ヒーロー追加ガイド（段階2以降：HERO_DBに一本化）
// ====================================================
// 新しいヒーローを追加するときは、data.js の HERO_DB に1ブロック追加するだけでよい。
// 旧7定数（HEROES/HERO_AI_PROFILE/HERO_SLOT_ADVICE/META_TIER/HERO_ROLE_PROFILE/
// HERO_EVAL_META/HERO_WEAPON_TAGS）は廃止済み。app.js側のコード（HERO_DB[id].xxx）は
// 新ヒーロー追加時に触る必要はない。
//
// HERO_DB[id] の構造：
//   name, type, role, ur, priority, carry?     … 基本データ（旧HEROES相当）
//   score: { immediate, longterm, cost10-30, coverage, future, mainTypeBonus,
//             promotedUrPenalty, skillPower:{lv0,10,20,30}, durability:{lv0,10,20,30} }
//                                                … スコア評価パラメータ（旧HERO_AI_PROFILE相当）※必須
//     ※ skillPower・durability は { lv0, lv10, lv20, lv30 } のLv帯別オブジェクト形式で書くこと
//        （固定の数値だけで書かない）。武装Lvに応じて__aiGetSkillPower/__aiGetDurabilityが線形補間
//        で実効値を取得する。武装Lvが低くても素の質が高いヒーロー（ウィリアムズの素の耐久）、
//        特定Lvが分水嶺になるヒーロー（マーフィのLv20 Mitigation解放、DVAのLv10/30二段階の伸び）等、
//        Lv依存度の違いを表現できる。前衛(wall)役はdurability、それ以外(atk/sup)はskillPowerが
//        評価に使われる。武装未実装のヒーロー（UR昇格組）は全Lv帯で同じ値（依存なし）にする。
//     ※ skillPower はスキル単体の質（戦況を変える効果の確実性）を表す。未来性(future)には乗算されない。
//        実際のスキル文章・コミュニティ評価を確認し、「確定/常時発動」（AoE・スタック型DoT・
//        確実なダメージ軽減等）は高め、「確率発動・タイミング依存・リスク同伴」（確率CC、
//        タウントで自分が落ちる等）は標準〜低めに設定する。priority値（編成内の構造的重要度）とは
//        別軸なので、必須前衛だがスキル単体は中堅、という評価が両立してよい。
//   advice: { catch, s6note, ewAdvice, synergy, priority, skillNote, weaponLvNotes,
//             globalReview, jpReview, warning? }
//                                                … スロット詳細のアドバイス文（旧HERO_SLOT_ADVICE相当）※必須
//   aiRole: { role, lane, core, promotedUr? }   … 役割プロファイル（旧HERO_ROLE_PROFILE相当）※必須
//   milestone10Fit, promotedUrImmediateFit?     … マイルストーン適合度（旧HERO_EVAL_META相当）※必須
//
// 【任意】無くてもクラッシュしないが、登録すると評価精度が上がる:
//   - HERO_DB[id].meta（環境ティア：ew/ewTarget。旧META_TIER相当。未登録は中立扱い）
//   - app.js : HERO_PAIR_SYNERGY（ペアシナジー。1人に閉じた情報ではないためHERO_DB外で維持。
//     未登録は1.0倍=効果なし）
//     ⚠️ 双方向に書く必要がある（A→Bを書いたらB→Aも書く）。片方だけだと
//        一方のヒーローのスコア計算にしか反映されない。
//
// 【自動生成・直接編集しない】
//   - app.js : __aiGetLongterm(heroId) は HERO_DB[id].score.longterm から都度取得される。
//     長期評価を変えたい場合は HERO_DB[id].score.longterm を編集すること。
//
// 追加・編集後は validateHeroData() をブラウザのコンソールで実行すると、
// 欠落や非対称を一覧表示できます。
function validateHeroData() {
  const heroIds = Object.keys(HERO_DB);
  const issues = { missing: [], asymmetric: [] };

  // 段階2以降、7定数は廃止しHERO_DBに一本化。各フィールドの登録漏れを直接チェックする。
  const requiredFields = [
    ['HERO_DB[id].score（旧HERO_AI_PROFILE）', id => !!HERO_DB[id].score],
    ['HERO_DB[id].advice（旧HERO_SLOT_ADVICE）', id => !!HERO_DB[id].advice],
    ['HERO_DB[id].aiRole（旧HERO_ROLE_PROFILE）', id => !!HERO_DB[id].aiRole],
    ['HERO_DB[id].milestone10Fit（旧HERO_EVAL_META）', id => HERO_DB[id].milestone10Fit !== undefined],
  ];
  const optionalFields = [
    ['HERO_DB[id].meta（旧META_TIER）', id => !!HERO_DB[id].meta],
  ];

  for (const [name, check] of requiredFields) {
    const missingIds = heroIds.filter(id => !check(id));
    if (missingIds.length) issues.missing.push(`${name}（必須）: ${missingIds.join(', ')}`);
  }
  for (const [name, check] of optionalFields) {
    const missingIds = heroIds.filter(id => !check(id));
    if (missingIds.length) issues.missing.push(`${name}（任意・未登録は中立扱い）: ${missingIds.join(', ')}`);
  }
  if (typeof HERO_PAIR_SYNERGY === 'object') {
    const missingIds = heroIds.filter(id => !(id in HERO_PAIR_SYNERGY));
    if (missingIds.length) issues.missing.push(`HERO_PAIR_SYNERGY（任意・未登録は中立扱い）: ${missingIds.join(', ')}`);
  }

  // skillPower/durability が Lv帯別オブジェクト（{lv0,lv10,lv20,lv30}）形式になっているか確認。
  // 数値の固定値で書かれている場合、武装Lv依存度が反映されず評価ロジックの精度が落ちる。
  {
    const lvBandKeys = ['skillPower', 'durability'];
    const badFormat = [];
    for (const id of heroIds) {
      const prof = HERO_DB[id].score;
      if (!prof) continue;
      for (const key of lvBandKeys) {
        const v = prof[key];
        if (v !== undefined && (typeof v !== 'object' || !('lv0' in v) || !('lv30' in v))) {
          badFormat.push(`${id}.${key}`);
        }
      }
    }
    if (badFormat.length) issues.missing.push(`HERO_DB[id].score（Lv帯別オブジェクト形式ではない）: ${badFormat.join(', ')}`);
  }

  // HERO_PAIR_SYNERGY の双方向対称性チェック
  if (typeof HERO_PAIR_SYNERGY === 'object') {
    for (const h1 in HERO_PAIR_SYNERGY) {
      const partners = HERO_PAIR_SYNERGY[h1];
      for (const h2 in partners) {
        const back = HERO_PAIR_SYNERGY[h2];
        if (!back || !(h1 in back)) {
          issues.asymmetric.push(`${h1}→${h2} はあるが ${h2}→${h1} が無い`);
        }
      }
    }
  }

  const hasIssues = issues.missing.length || issues.asymmetric.length;
  if (!hasIssues) {
    console.log('✅ validateHeroData: 問題は見つかりませんでした');
  } else {
    console.log('⚠️ validateHeroData: 以下の登録漏れ・非対称が見つかりました');
    if (issues.missing.length) {
      console.log('--- 登録漏れ ---');
      issues.missing.forEach(m => console.log('  ' + m));
    }
    if (issues.asymmetric.length) {
      console.log('--- HERO_PAIR_SYNERGY 非対称 ---');
      issues.asymmetric.forEach(m => console.log('  ' + m));
    }
  }

  // 覚醒対象ヒーロー一覧（増えていないかの目安。S6時点ではkimberly/dva/teslaの3人固定）
  if (typeof AWAKENING_HEROES === 'object') {
    const awIds = Object.keys(AWAKENING_HEROES);
    console.log(`覚醒対象ヒーロー（${awIds.length}人）: ${awIds.join(', ')}`);
    const hardcodedTrio = ['kimberly', 'dva', 'tesla'];
    const extra = awIds.filter(id => !hardcodedTrio.includes(id));
    if (extra.length) {
      console.log(`⚠️ kimberly/dva/tesla以外の覚醒対象が見つかりました: ${extra.join(', ')}`);
      console.log('   app.js の awakeningCtx 生成部分（generateAiSuggestion内）のガイドコメントを参照し、固有効果の追記が必要か確認してください。');
    }
  }

  return issues;
}

// ====================================================
// 📋 Claude.ai相談用：編成データをテキスト化してコピー
// ====================================================
function buildAiReportText() {
    const squadNames = { 1:'1軍', 2:'2軍', 3:'3軍', 4:'控え' };
    const roleNames = { atk:'アタッカー', wall:'前衛タンク', sup:'サポート', none:'未設定' };
    const typeNames = { tank:'戦車', air:'航空', mis:'ロケラン', none:'-' };
    const metaNames = { tank:'戦車環境', air:'航空環境', mis:'ロケラン環境' };

    let lines = [];
    lines.push('【Last War: Survival S6 編成データ】');
    const currentMeta = ($id('current-meta') || {}).value || 'mis';
    lines.push(`現在のメタ環境設定：${metaNames[currentMeta] || currentMeta}`);
    lines.push('');

    let fullRoster = [];
    for (let s = 1; s <= 4; s++) {
        const slotCount = (s === 4) ? 10 : 5;
        let squadLines = [];
        for (let p = 1; p <= slotCount; p++) {
            const sel = $id(`h-${s}-${p}`);
            const wpEl = $id(`w-${s}-${p}`);
            if (!sel || !wpEl) continue;
            const id = sel.value;
            if (id === 'empty') continue;
            const h = HERO_DB[id];
            if (!h) continue;
            const wp = parseInt(wpEl.value) || 0;
            let line = `  ${h.name}（${typeNames[h.type]}/${roleNames[h.role]}${h.ur ? '・UR' : ''}）武装Lv${wp}`;
            if (typeof AWAKENING_HEROES !== 'undefined' && AWAKENING_HEROES[id]) {
                const awTierStr = loadAwTier(id);
                const at = parseAwTier(awTierStr);
                if (at.star >= 0) line += `・覚醒${awStarLabel(at)}`;
            }
            squadLines.push(line);
            fullRoster.push({ id, s, p, wp, t:h.type, r:h.role, ur:h.ur, name:h.name, pr:h.priority });
        }
        if (squadLines.length) {
            lines.push(`■ ${squadNames[s]}`);
            lines.push(...squadLines);
            // 1〜3軍は達成率も付記（ツールの計算結果）
            if (s <= 3) {
                try {
                    const prog = computeDisplayedArmyProgress(s);
                    if (prog && prog.pct !== undefined) {
                        lines.push(`  → 達成率: ${prog.pct}%（主力兵種: ${typeNames[prog.mainType] || '-'}、兵種バフ+${Math.round((prog.buffRate||0)*100)}%）`);
                    }
                } catch(e) {}
            }
            lines.push('');
        }
    }

    // ツールの計算済み結果：育成優先ランキング上位（10人以上配置時のみ算出可能）
    if (fullRoster.length >= 10) {
        try {
            const full = calculateUpgradeEfficiencyFull(fullRoster);
            if (full && full.normal && full.normal.length) {
                lines.push('【ツールの計算結果：専用武装 育成優先ランキング（上位5件）】');
                full.normal.slice(0, 5).forEach((item, i) => {
                    lines.push(`  ${i+1}. ${item.name}（Lv${item.from}→${item.to}、必要かけら${item.cost}個）`);
                });
                lines.push('');
            }
            if (full && full.reinforceList && full.reinforceList.length) {
                lines.push('【ツールの計算結果：おすすめ育成プラン（短期・中期・長期）】');
                full.reinforceList.slice(0, 3).forEach((item, i) => {
                    const tfLabel = (item.growthType && item.growthType.label) || '';
                    lines.push(`  ${i+1}. ${item.name}${tfLabel ? `（${tfLabel}）` : ''}`);
                });
                lines.push('');
            }
        } catch(e) {}
    } else {
        lines.push('※ 配置英雄が10人未満のため、育成優先ランキング等は未算出です。');
        lines.push('');
    }

    lines.push('---');
    lines.push('上記は「Last War: Survival」というスマホゲームのS6（Shadow Rainforest）における自分の編成データと、');
    lines.push('育成シミュレーターが算出した計算結果です。これらを踏まえて、育成の優先順位や編成の強化ポイントに');
    lines.push('ついて一緒に相談しながら進めたいです。');
    return lines.join('\n');
}

// AI選択：localStorageへの保存・読み込み
const AI_PROVIDERS = {
    claude:  { label: 'Claude',  url: 'https://claude.ai/new',          icon: '🟠', autoOpen: true },
    // GeminiはAndroid Chromeのアプリ起動判定（App Links/Gemini in Chrome機能との競合）により
    // 新しいタブが開いた直後に閉じてしまう不安定な挙動が確認されたため、自動遷移をしない。
    // 代わりにURL自体をクリップボードにコピーし、手動でアドレスバーに貼り付けてもらう。
    gemini:  { label: 'Gemini',  url: 'https://gemini.google.com/app',  icon: '🔵', autoOpen: false },
    chatgpt: { label: 'ChatGPT', url: 'https://chatgpt.com/',           icon: '🟢', autoOpen: true },
};
function loadAiProvider() {
    try {
        const v = localStorage.getItem('ai_provider');
        return (v && AI_PROVIDERS[v]) ? v : 'claude';
    } catch(e) { return 'claude'; }
}
function saveAiProvider() {
    try {
        const sel = $id('ai-provider-select');
        if (sel) localStorage.setItem('ai_provider', sel.value);
        updateAiConsultButton();
    } catch(e) {}
}
function updateAiConsultButton() {
    const provider = loadAiProvider();
    const info = AI_PROVIDERS[provider] || AI_PROVIDERS.claude;
    const btn = $id('ai-consult-btn');
    if (btn) btn.textContent = `${info.icon} ${info.label}に相談`;
    const sel = $id('ai-provider-select');
    if (sel) sel.value = provider;
}
function copyForAi() {
    try {
        const provider = loadAiProvider();
        const info = AI_PROVIDERS[provider] || AI_PROVIDERS.claude;
        const text = buildAiReportText();
        const doToast = (msg, isWarn) => {
            const toast = $id('copy-claude-toast');
            if (toast) {
                if (msg) toast.innerHTML = msg;
                toast.style.display = 'block';
                if (isWarn) {
                    toast.style.background = '#fef3c7';
                    toast.style.borderColor = '#fde68a';
                    toast.style.color = '#92400e';
                } else {
                    toast.style.background = '#dbeafe';
                    toast.style.borderColor = '#93c5fd';
                    toast.style.color = '#1e40af';
                }
                setTimeout(() => { toast.style.display = 'none'; }, 8000);
            }
        };
        const copyText = (str, onDone) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(str).then(onDone).catch(() => {
                    const ta = document.createElement('textarea');
                    ta.value = str;
                    document.body.appendChild(ta);
                    ta.select();
                    try { document.execCommand('copy'); onDone(); } catch(e) {}
                    document.body.removeChild(ta);
                });
            } else {
                const ta = document.createElement('textarea');
                ta.value = str;
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); onDone(); } catch(e) {}
                document.body.removeChild(ta);
            }
        };

        if (!info.autoOpen) {
            // 自動遷移が不安定なAI（Gemini等）：URLを案内表示し、編成データだけコピーする
            copyText(text, () => {
                doToast(`✅ コピーしました。${info.label}のアプリまたは下のURLを開いて貼り付けてください。<br><span style="word-break:break-all;font-weight:400;">${info.url}</span>`, true);
            });
            return;
        }

        // モバイル（特にAndroid Chrome）では window.open より <a target="_blank"> のクリックの方が
        // アプリ起動インテント（App Links）と相性が良く、無反応になりにくい。
        let opened = false;
        try {
            const a = document.createElement('a');
            a.href = info.url;
            a.target = '_blank';
            a.rel = 'noopener';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            opened = true;
        } catch(e) {
            opened = !!window.open(info.url, '_blank');
        }
        copyText(text, () => {
            if (opened) {
                doToast(`✅ コピーしました＆${info.label}を開きました。新しい会話に貼り付け（長押し→貼り付け／Ctrl+V）て相談できます。`, false);
            } else {
                doToast(`⚠️ ${info.label}を開けませんでした。コピーは完了しているので、手動でアプリ／サイトを開いて貼り付けてください。`, true);
            }
        });
    } catch(e) {
        console.error('copyForAi failed:', e);
    }
}

// ====================================================
// S6 英雄覚醒データ（統合版）
// AWAKENING_HEROES と AWAKENING_HEROES を1つに統合
// ====================================================


// --- ユーティリティ ---

// awTier文字列 → {star, tier}
// 覚醒★数を編成画面の表記に統一して返す
// star=-1 → '未覚醒'
// star=0, tier=1以上 → '★0-1解放済み'（以降 ★0-N）
// star=1以上 → '★N-T'
function awStarLabel(at) {
  if (!at || at.star < 0) return '未覚醒';
  if (at.tier === 0) return `★${at.star}（到達）`;
  if (at.tier === 5) return `★${at.star + 1}（到達）`;
  return `★${at.star}-${at.tier}`;
}

function parseAwTier(val) {
  if (!val || val === 'none') return { star:-1, tier:0 };
  const m = String(val).match(/^(\d+)-(\d+)$/);
  if (!m) return { star:-1, tier:0 };
  return { star: parseInt(m[1]), tier: parseInt(m[2]) };
}

// {star, tier} → 表示文字列（例: "★1-3"）// 覚醒前提チェック
function checkAwakeningEligible(heroId, ewLv, heroStars) {
  const aw = AWAKENING_HEROES[heroId];
  if (!aw) return { eligible: false, reason: '覚醒非対応英雄' };
  if ((heroStars || 5) < aw.starRequired)
    return { eligible: false, reason: '英雄★' + aw.starRequired + 'が必要' };
  if ((ewLv || 0) < aw.ewMinRequired)
    return { eligible: false, reason: 'EW Lv' + aw.ewMinRequired + '以上が必要' };
  return { eligible: true };
}

// 覚醒スコア補正（star単位で線形補間、tier0-5で進行度）
function getAwakeningScoreBonus(heroId, awTierStr) {
  const aw = AWAKENING_HEROES[heroId];
  if (!aw) return 1.0;
  const at = parseAwTier(awTierStr);
  if (at.star < 0) return 1.0;
  const base = aw.scoreBonus[at.star] || 1.0;
  const next = aw.scoreBonus[Math.min(5, at.star + 1)] || base;
  const frac = at.tier / 5;
  return base + (next - base) * frac;  // ティア進行度をフルに反映
}

// 次のティアへのコスト
function awNextTierCost(awTierStr) {
  const at = parseAwTier(awTierStr);
  // 未覚醒 → ★0（到達）：無料
  if (at.star < 0) return { cost:0, named:false, nextStar:0, nextTier:0 };
  // ★5（到達）= MAX
  if (at.star >= 5) return null;
  if (at.tier < 5) {
    // 同じ★の次ティアへ（★0（到達）→★0-1のみ専用覚醒かけら、それ以外は汎用）
    const named = (at.star === 0 && at.tier === 0);
    const nt = at.tier + 1;
    // tier=5に達した場合は次の★（到達）と同値なので正規化
    if (nt === 5) return { cost: named ? 50 : AW_SHARD_PER_TIER[at.star], named, nextStar: at.star + 1, nextTier: 0 };
    return { cost: named ? 50 : AW_SHARD_PER_TIER[at.star], named, nextStar: at.star, nextTier: nt };
  }
  // tier=5（旧データ。★(star+1)到達と同値）から呼ばれた場合は、次の★の最初のティアへ
  const nextStar = at.star + 1;
  if (nextStar >= 5) return null; // 次が★5（MAX）を超える
  return { cost: AW_SHARD_PER_TIER[nextStar], named: false, nextStar, nextTier: 1 };
}

function escapeHtml(str){
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Auto-split from single-file build (v1.4)
// App logic
// --- マスタデータ ---






let previousAssignment = null;

// ===============================
// 🔁 乗り換え推奨度：色連動コピー（%で文言変化）
// ===============================

// === Shared helpers for squad-based transition/progress ===
function wpToPts(wp){
  // EW Lv → スコアポイント換算
  // 実際のゲーム：Lv10/20/30が主要節目、Lv1〜9の伸びは小さい
  // Lv0=50, Lv1=55, Lv5=75, Lv10=160, Lv20=260, Lv30=430
  wp = parseInt(wp, 10);
  if(!Number.isFinite(wp)) return 0;
  if(wp <= 0) return 50;
  wp = Math.max(0, Math.min(30, wp));
  let pts = 70;
  if (wp >= 30) pts += 360;
  else if (wp >= 20) pts += 190 + (wp - 20) * 8;
  else if (wp >= 10) pts += 90 + (wp - 10) * 5;
  else pts += 5 + wp * 2;   // Lv1〜9: 伸び小（5+wp*2）← 旧: 20+wp*3
  return pts;
}

function normalizeWpInputFixed(wpRaw){
  if(wpRaw == null) return 0;
  const s = String(wpRaw).trim();
  if(!s || s === '-' || s.includes('未')) return 0;
  const v = parseInt(s, 10);
  return Number.isFinite(v) ? v : 0;
}

function toggleTransitionPanel(){
  const body = $id('power-transition-body');
  const icon = $id('trans-icon');
  if(!body) return;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  if(icon) icon.classList.toggle('open', !isOpen);
  try { localStorage.setItem('panel_power-transition-body', isOpen ? '0' : '1'); } catch(e) {}
  // 展開時にコンテンツを更新
  if(!isOpen) try { updateTransitionRecommendationUI(); } catch(e) {}
}


function getArmyTypeCounts(members){
  const counts = { tank:0, air:0, mis:0 };
  (members || []).forEach(m => {
    if(!m || !m.t) return;
    if(counts[m.t] !== undefined) counts[m.t]++;
  });
  return counts;
}


function getArmyBuffInfo(members){
  const counts = getArmyTypeCounts(members);
  const totalFilled = (members || []).filter(m => m && m.t && m.t !== 'none').length;
  const entries = Object.entries(counts).sort((a,b) => b[1] - a[1]);
  const mainType = entries[0] ? entries[0][0] : 'tank';
  const maxCount = entries[0] ? entries[0][1] : 0;

  let buffRate = 0;
  if(maxCount >= 5) buffRate = 0.20;
  else if(maxCount === 4) buffRate = 0.15;
  else if(maxCount === 3){
    buffRate = (totalFilled >= 5) ? 0.10 : 0.05;
  }

  return { counts, mainType, maxCount, totalFilled, buffRate };
}


function collectArmyMembersForProgress(armyNo){
  const members = [];
  for(let p=1; p<=5; p++){
    const hidEl = $id(`h-${armyNo}-${p}`);
    const wpEl  = $id(`w-${armyNo}-${p}`);
    if(!hidEl || !wpEl) continue;
    const id = hidEl.value;
    if(!id || id === 'empty') continue;
    const h = HERO_DB[id];
    if(!h) continue;
    members.push({
      id,
      name: h.name,
      t: h.type,
      r: h.role,
      ur: h.ur,
      wp: normalizeWpInputFixed(wpEl.value),
      p   // カードDOM特定用のスロット番号（視覚マーキングで使用）
    });
  }
  return members;
}



function getIdealMembersForType(type){
  // F2P現実的目標（packsify/allclash準拠）
  // キャリー(atk): EW20 = 覚醒前提クリア・実戦十分な水準
  // タンク(wall):  EW20 = 前衛として十分な水準
  // サポート(sup): EW10 = マーシャル等はEW不要
  // EW30は長期目標のため基準から外す
  const idealType = ['tank','air','mis'].includes(type) ? type : 'tank';
  return [
    { id:`${idealType}-i1`, wp:20, t:idealType, r:'wall' },
    { id:`${idealType}-i2`, wp:20, t:idealType, r:'wall' },
    { id:`${idealType}-i3`, wp:20, t:idealType, r:'atk'  },
    { id:`${idealType}-i4`, wp:20, t:idealType, r:'atk'  },
    { id:`${idealType}-i5`, wp:10, t:idealType, r:'sup'  },
  ];
}

function computeDisplayedArmyProgress(armyNo){
  const members = collectArmyMembersForProgress(armyNo);
  if(!members.length){
    return { pct:0, maxCount:0, buffRate:0, detail:{attack:0, defense:0}, mainType:null };
  }

  const res = evaluateSquadRealCombat(members);

  // プレイヤータイプ別の目標EW Lv（無課金=F2P現実目標、微課金/重課金はより高いLvを目標にする）
  // 各英雄を「そのロールの目標EW」と1対1比較して平均達成率を算出
  const __pt = (typeof loadPlayerType === 'function') ? loadPlayerType() : 'f2p';
  const roleTarget = (typeof ROLE_TARGET_PRESET === 'object' && ROLE_TARGET_PRESET[__pt]) ? ROLE_TARGET_PRESET[__pt] : { atk:20, wall:20, sup:10 };

  let totalRate = 0;
  let count = 0;
  members.forEach(m => {
    if (m.ur) return; // UR昇格組は目標EWの考え方が異なるため除外（__aiSquadCompletionFactorと同じ扱い）
    const target = roleTarget[m.r] || 20;
    const rate = Math.min(1.0, m.wp / Math.max(target, 1));
    totalRate += rate;
    count++;
  });

  // 平均達成率（0〜100%、100%超えなし）
  const pct = count > 0
    ? Math.max(0, Math.min(100, Math.round((totalRate / count) * 100)))
    : 0;

  return {
    pct: pct,
    maxCount: res.maxCount,
    buffRate: res.buffRate,
    mainType: res.mainType,
    detail:{ attack:res.attack, defense:res.defense },
    members: members  // ボトルネック表示用
  };
}



function updateSlotEvalsFromCurrentInputs(){
  const baseColors = { 1:"#10b981", 2:"#3b82f6", 3:"#8b5cf6" };

  for(let armyNo=1; armyNo<=3; armyNo++){
    const el = $id(`slot-eval-${armyNo}`);
    if(!el) continue;

    const prog = computeDisplayedArmyProgress(armyNo);
    const pct = prog.pct;
    const c = pct < 40 ? "#ef4444" : (pct < 60 ? "#f59e0b" : baseColors[armyNo]);

    const weak = (typeof detectArmyWeaknessFromDetail === 'function')
      ? detectArmyWeaknessFromDetail(prog.detail)
      : 'balance';

    const label = weak === "defense"
      ? "📊 前衛が手薄"
      : (weak === "attack"
          ? "📊 火力が不足"
          : pct >= 80 ? "📊 バランス良好" : pct >= 45 ? "📊 育成中" : "📊 強化が必要");

    let buff = "";
    if (prog.maxCount === 5) buff = "✅ 兵種バフ20%";
    else if (prog.maxCount === 4) buff = "🔶 兵種バフ15%";
    else if (prog.maxCount === 3) buff = (prog.buffRate >= 0.10 ? "⚠️ 兵種バフ10%" : "⚠️ 兵種バフ5%");

    const buffSpan = buff ? `<span class="buff-badge">${buff}</span>` : "";

    // 進行度の段階別説明
    // ロール別目標EWへの達成率段階
    const pctNote = pct >= 100 ? '✅ 目標EW達成'
      : pct >= 80  ? '（あと少し）'
      : pct >= 60  ? '（育成中）'
      : pct >= 40  ? '（基盤完成）'
      : '（育成初期）';

    el.innerHTML =
      '<div class="row">' +
        '<div class="tag">' + label + '</div>' +
        '<div class="pct" title="各英雄のロール別目標EWへの平均到達度">達成率 <span style="color:' + c + ';">' + pct + '%</span><span style="font-size:0.65rem;color:#475569;margin-left:2px;">' + pctNote + '</span></div>' +
      '</div>' +
      (buffSpan ? ('<div class="row sub">' + buffSpan + '</div>') : '') +
      '<div class="bar"><div style="width:' + pct + '%; background:' + c + ';"></div></div>';
  }

  try { updateArmyGuide(); } catch(e) {}
}

const TRANSITION_TEXT_TABLE = [
  { min: 85, label: "今すぐ移行できる！", cls: "advice-now",  color: "#ef4444" },
  { min: 70, label: "移行の準備を始めよう",   cls: "advice-good", color: "#f59e0b" },
  { min: 55, label: "あと少しで移行圏",           cls: "advice-soon", color: "#eab308" },
  // ここから下は「様子見」系（CSS既存クラスに寄せる）
  { min: 40, label: "もう少し育成してから",     cls: "advice-wait", color: "#64748b" },
  { min: 25, label: "現在の編成を伸ばそう",           cls: "advice-wait", color: "#94a3b8" },
  { min: 0,  label: "まだ移行は早い",         cls: "advice-wait", color: "#cbd5e1" }
];

function getTransitionAdvice(score){
  const sc = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0;
  for(const row of TRANSITION_TEXT_TABLE){
    if(sc >= row.min) return { txt: row.label, cls: row.cls, color: row.color };
  }
  const last = TRANSITION_TEXT_TABLE[TRANSITION_TEXT_TABLE.length-1];
  return { txt: last.label, cls: last.cls, color: last.color };
}


// === 内部最適化ヘルパー（UI変更なし） ===
// getElementById をキャッシュ（初回 null の場合は再取得）
const $id = (() => {
  const cache = new Map();
  return (id) => {
    if (cache.has(id)) {
      const v = cache.get(id);
      // Re-rendered UI can replace nodes; cached elements may be detached.
      if (v && v.isConnected) return v;
      cache.delete(id);
    }
    const el = document.getElementById(id);
    if (el) cache.set(id, el);
    return el;
  };
})();

// AI計算をまとめて実行（連打・全軍更新時の多重計算を防止）
let __aiTimer = null;
function scheduleAi() {
  if (__aiTimer) clearTimeout(__aiTimer);
  __aiTimer = setTimeout(() => {
    __aiTimer = null;
    try { updateTransitionRecommendationUI(); } catch(e) {}
    generateAiSuggestion();
    try { updateSlotEvalsFromCurrentInputs(); } catch(e) {}
  }, 60);
}

const HOLD_PIN_STORAGE_KEY = 'lw_hold_pins_v1';
function loadHoldPins(){
  try{
    const raw = localStorage.getItem(HOLD_PIN_STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  }catch(e){
    return new Set();
  }
}
function saveHoldPins(setObj){
  try{ localStorage.setItem(HOLD_PIN_STORAGE_KEY, JSON.stringify(Array.from(setObj || []))); }catch(e){}
}
function getHoldPinKey(item){
  const id = item && (item.id || item.heroId || item.key || '');
  const from = item && item.from != null ? item.from : '';
  const to = item && item.to != null ? item.to : '';
  return `${id}__${from}__${to}`;
}
function isHoldPinned(item){
  return loadHoldPins().has(getHoldPinKey(item));
}
function toggleHoldPinByKey(pinKey){
  const pins = loadHoldPins();
  if(pins.has(pinKey)) pins.delete(pinKey);
  else pins.add(pinKey);
  saveHoldPins(pins);
  try{ generateAiSuggestion(); }catch(e){}
}
function getHoldPinnedItems(items){
  const pins = loadHoldPins();
  return (items || []).filter(item => pins.has(getHoldPinKey(item)));
}
function holdPinChipHtml(item){
  const pinKey = getHoldPinKey(item);
  const pinned = isHoldPinned(item);
  const cls = pinned ? ' is-active' : '';
  const label = pinned ? '保留解除' : '保留';
  return `<button type="button" class="rankhero-pinbtn${cls}" onclick="toggleHoldPinByKey('${pinKey}')" title="${label}" aria-label="${label}">📌</button>`;
}
function holdPinnedSummaryHtml(items){
  const list = getHoldPinnedItems(items).slice(0, 4);
  if(!list.length) return '';
  const chips = list.map(item => {
    const pinKey = getHoldPinKey(item);
    return `<button type="button" class="hold-pin-chip" onclick="toggleHoldPinByKey('${pinKey}')">📌 ${item.name} Lv${item.from}→${item.to}</button>`;
  }).join('');
  return `<div class="hold-pin-summary"><div class="hold-pin-title">後回し候補</div><div class="hold-pin-list">${chips}</div></div>`;
}


// === 戦力入力（任意）をAI判定に使う ===// 育成段階（初期/中盤/成熟）と移行先（航空寄り/ロケラン寄り）を汎用判定// ================= 戦力差ベース：乗り換え推奨度（%） =================

function updateTransitionRecommendationUI(){
  const body = $id('power-transition-body') || $id('power-transition');
  if(!body) return;

  const labels = { tank:"戦車", air:"航空", mis:"ロケラン" };
  const pool = { tank:[], air:[], mis:[] };
  const benchPool = { tank:[], air:[], mis:[] };

  // 1〜3軍の英雄をプール
  for(let s=1; s<=3; s++){
    for(let p=1; p<=5; p++){
      const hidEl = $id(`h-${s}-${p}`);
      const wpEl  = $id(`w-${s}-${p}`);
      if(!hidEl||!wpEl) continue;
      const id = hidEl.value;
      if(!id||id==='empty') continue;
      const h = HERO_DB[id];
      if(!h||h.ur) continue;
      const wp = normalizeWpInputFixed(wpEl.value);
      pool[h.type].push({ id, name:h.name||id, wp, pts:wpToPts(wp), squad:s });
    }
  }
  // 控えの英雄もプール
  for(let p=1; p<=10; p++){
    const hidEl = $id(`h-4-${p}`);
    const wpEl  = $id(`w-4-${p}`);
    if(!hidEl||!wpEl) continue;
    const id = hidEl.value;
    if(!id||id==='empty') continue;
    const h = HERO_DB[id];
    if(!h||h.ur) continue;
    const wp = normalizeWpInputFixed(wpEl.value);
    benchPool[h.type].push({ id, name:h.name||id, wp, pts:wpToPts(wp) });
  }

  const totalPicked = Object.values(pool).reduce((s,a)=>s+a.length,0);
  if(totalPicked < 5){
    body.innerHTML = '<div class="subtle-note">キャラを5人以上配置すると表示されます。</div>';
    return;
  }

  // 部隊強化の指針と連動：次に強化すべき軍を判定
  const armyPcts = [1,2,3].map(s => computeDisplayedArmyProgress(s).pct);
  const nextSquad = armyPcts[0] >= 80 && armyPcts[1] >= 65 ? 3
                  : armyPcts[0] >= 80 ? 2 : 1;
  const squadLabel = { 1:'1軍', 2:'2軍', 3:'3軍' };

  // 各兵種の「次の軍」向け戦力ポテンシャルを計算
  const typeScore = {};
  const typeDetail = {};

  // 候補メンバー（最大5人）の中にHERO_PAIR_SYNERGYで結ばれたペアがいれば、
  // そのシナジー分をスコアに加点する。役割シナジー（コントロール役×主力アタッカー等）も
  // この方法で自然に反映される（例：スカイラー+キムが候補に並べば自動的に加点）。
  const __calcCandidateSynergyRate = (candidates) => {
    const table = (typeof HERO_PAIR_SYNERGY === 'object') ? HERO_PAIR_SYNERGY : null;
    if (!table) return 0;
    const idSet = candidates.map(m => m.id);
    let bonus = 0;
    for (let i = 0; i < idSet.length; i++) {
      for (let j = i + 1; j < idSet.length; j++) {
        const pair = table[idSet[i]] && table[idSet[i]][idSet[j]];
        if (pair) {
          const mult = (typeof pair === 'number') ? pair : (pair.base || 1.0);
          bonus += (mult - 1.0); // 1.05倍なら+0.05として加算
        }
      }
    }
    return Math.min(bonus, 0.15); // 1セットの候補内で最大+15%まで（暴走防止）
  };

  ['tank','air','mis'].forEach(t => {
    const inSquad   = pool[t].filter(m => m.squad === nextSquad);
    const fromBench = benchPool[t].slice().sort((a,b)=>b.pts-a.pts);
    const otherSq   = pool[t].filter(m => m.squad !== nextSquad).sort((a,b)=>b.pts-a.pts);
    const candidates = [...inSquad, ...fromBench, ...otherSq].sort((a,b)=>b.pts-a.pts).slice(0,5);

    const buffInfo = getArmyBuffInfo(candidates);
    const synergyRate = __calcCandidateSynergyRate(candidates);
    const score = candidates.reduce((s,m)=>
      s + (m.t===t ? Math.round(m.pts*(1+buffInfo.buffRate+synergyRate)) : m.pts), 0);

    typeScore[t] = score;
    typeDetail[t] = { inSquad, fromBench: fromBench.slice(0,3), candidates, buffRate:buffInfo.buffRate, buffCount:buffInfo.maxCount, synergyRate };
  });

  const sorted = Object.entries(typeScore).sort((a,b)=>b[1]-a[1]);
  const bestType  = sorted[0][0];
  const bestScore = Math.max(sorted[0][1], 1);

  // S6覚醒チェック
  const kimAw   = parseAwTier(loadAwTier('kimberly'));
  const dvaAw   = parseAwTier(loadAwTier('dva'));
  const teslaAw = parseAwTier(loadAwTier('tesla'));
  const kimAwAll  = pool.tank.some(m=>m.id==='kimberly') && kimAw.star >= 0;
  const dvaAwAll  = [...pool.air,...benchPool.air].some(m=>m.id==='dva') && dvaAw.star >= 0;
  const hasTesla  = [...pool.mis,...benchPool.mis].some(m=>m.id==='tesla');

  // キム+DVA覚醒混成型の評価（packsify推奨）
  // 両方覚醒済みで手持ちにいる場合、混成型ボーナスを計算
  const kimExists = [...pool.tank,...benchPool.tank].some(m=>m.id==='kimberly');
  const dvaExists = [...pool.air,...benchPool.air].some(m=>m.id==='dva');
  const schuylerExists = [...pool.air,...benchPool.air].some(m=>m.id==='schuyler');
  const showMixedRecommend = kimAwAll && dvaAwAll && kimExists && dvaExists;

  const hName = id => (HERO_DB[id]||{}).name || id;

  const typeCard = (t, rank) => {
    const d = typeDetail[t];
    const pct = Math.round((typeScore[t] / bestScore) * 100);
    const isBest = t === bestType;
    const c = isBest ? '#d97706' : '#94a3b8';
    // 同兵種候補の実数（控え含む）で「目標バフ」を表示
    const allSameType = [...(pool[t]||[]), ...(benchPool[t]||[])];
    const targetCount = Math.min(5, allSameType.length);
    const buffBadge = targetCount >= 5 ? '5体編成・兵種バフ+20%達成可能'
      : targetCount === 4 ? '4体編成・兵種バフ+15%達成可能'
      : targetCount >= 3 ? `現在${targetCount}体（あと${5-targetCount}体で+20%バフ）`
      : `現在${targetCount}体（育成で兵種バフ獲得可能）`;
    const buffColor = targetCount>=5?'#059669':targetCount>=4?'#d97706':'#94a3b8';

    // 最も育っていない英雄 → 次の節目
    const weakest = d.candidates.length ? [...d.candidates].sort((a,b)=>a.wp-b.wp)[0] : null;
    const nextMile = weakest ? (weakest.wp<10?10:weakest.wp<20?20:weakest.wp<30?30:null) : null;
    const actionTxt = weakest && nextMile
      ? `次の強化目標<br><b>${hName(weakest.id)}</b>（現EW Lv${weakest.wp} → 目標Lv${nextMile}）`
      : weakest ? `<b>${hName(weakest.id)}</b> は目標EWに到達済み` : '';

    // 控えから補充候補
    const benchTxt = d.fromBench.length
      ? d.fromBench.map(m=>`<b>${hName(m.id)}</b>（EW${m.wp}）`).join('・')
      : 'なし';

    // 覚醒メモ・シナジーメモ（複数あれば結合表示）
    const memoList = [];
    if(t==='tank' && kimAwAll) memoList.push('キム覚醒済みのため戦車軸が強化されています');
    if(t==='air'  && dvaAwAll) memoList.push('DVA覚醒済みのため航空軸が強化されています');
    if(t==='air'  && !dvaAwAll && kimAwAll) memoList.push('DVA覚醒（Week3解放）後にさらに強化可能です');
    if(t==='mis'  && hasTesla && teslaAw.star < 0) memoList.push('テスラ覚醒（Week6解放）後にさらに強化可能です');
    if(d.synergyRate >= 0.03) memoList.push(`⚡ 候補内にシナジーの噛み合わせがあります（戦力+${Math.round(d.synergyRate*100)}%相当）`);
    const memo = memoList.join('<br>');

    return `<div style="background:#fff;border:${isBest?'var(--card-border-best)':'var(--card-border)'};border-radius:var(--card-radius);padding:var(--card-padding);margin-bottom:var(--card-gap);overflow:hidden;${isBest?'box-shadow:var(--card-shadow-best);':''}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;flex-wrap:wrap;gap:4px;">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          ${isBest?'<span style="font-size:var(--fs-xxs);font-weight:900;color:#d97706;background:#fffbeb;border:1px solid #fde68a;border-radius:var(--card-radius-sm);padding:1px 6px;white-space:nowrap;">推奨</span>':`<span style="font-size:var(--fs-xxs);color:#475569;font-weight:700;background:#f1f5f9;border-radius:var(--card-radius-sm);padding:1px 6px;white-space:nowrap;">${rank}番目</span>`}
          <span style="font-size:var(--fs-md);font-weight:900;color:#111827;white-space:nowrap;">${labels[t]}軸</span>
        </div>
        <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
          <span style="font-size:var(--fs-xxs);color:#94a3b8;white-space:nowrap;">相対戦力</span>
          <span style="font-size:var(--fs-md);font-weight:900;color:${c};white-space:nowrap;">${pct}%</span>
        </div>
      </div>
      <div style="font-size:var(--fs-xxs);font-weight:700;color:${buffColor};margin-bottom:6px;line-height:1.5;">${buffBadge}</div>
      ${actionTxt?`<div style="font-size:var(--fs-sm);color:#374151;margin-bottom:4px;line-height:1.5;">${actionTxt}</div>`:''}
      <div style="font-size:var(--fs-xs);color:#475569;margin-bottom:3px;line-height:1.5;">控え補充候補：${benchTxt}</div>
      ${memo?`<div style="font-size:var(--fs-xs);color:#7c3aed;font-weight:700;margin-top:2px;line-height:1.5;">${memo}</div>`:''}
      <div style="background:#f1f5f9;border-radius:4px;height:4px;margin-top:6px;">
        <div style="background:${c};width:${pct}%;height:100%;border-radius:4px;"></div>
      </div>
    </div>`;
  };

  // 混成型推奨カード
  const mixedCard = showMixedRecommend ? `
    <div style="background:linear-gradient(135deg,#fff7ed,#fff);border:2px solid #f59e0b;border-radius:var(--card-radius);padding:var(--card-padding);margin-bottom:var(--card-gap);box-shadow:0 2px 10px rgba(245,158,11,0.2);overflow:hidden;">
      <div style="display:flex;align-items:center;gap:5px;margin-bottom:5px;flex-wrap:wrap;">
        <span style="font-size:var(--fs-xxs);font-weight:900;color:#d97706;background:#fef3c7;border:1px solid #fde68a;border-radius:var(--card-radius-sm);padding:1px 6px;white-space:nowrap;">覚醒コンボ推奨</span>
        <span style="font-size:var(--fs-md);font-weight:900;color:#111827;white-space:nowrap;">${schuylerExists ? 'キム+DVA+スカイラー混成型' : 'キム+DVA混成型'}</span>
      </div>
      <div style="font-size:var(--fs-xxs);font-weight:700;color:#059669;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:var(--card-radius-sm);padding:2px 6px;display:inline-block;margin-bottom:6px;white-space:nowrap;">
        兵種バフ+15%（4体編成）
      </div>
      <div style="font-size:var(--fs-sm);color:#374151;margin-bottom:6px;line-height:1.6;">
        ${schuylerExists
          ? 'スカイラーのCC（行動妨害）で敵前衛を封殺し、AoE（覚醒キム）＋単体バースト（覚醒DVA）で突破する組み合わせ。現環境のPvPでよく見る最強クラスの混成編成です（packsify推奨）。'
          : 'AoE（覚醒キム）＋単体バースト（覚醒DVA）の組み合わせ。兵種バフは純粋5体構成（+20%）より下がりますが、覚醒効果で総合火力を上回ることが多いです（packsify推奨）。'}
      </div>
      <div style="font-size:var(--fs-xxs);font-weight:700;color:#7c3aed;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:var(--card-radius-sm);padding:4px 7px;margin-bottom:6px;line-height:1.5;">
        現在地点：キム${awStarLabel(kimAw)}・DVA${awStarLabel(dvaAw)}
      </div>
      <div style="font-size:var(--fs-xxs);color:#92400e;margin-bottom:6px;line-height:1.6;">
        最低ライン：キム★0-1＋DVA★0-1（両者覚醒解放済み）<br>理想ライン：キム★3（到達）＋DVA★3（到達）
      </div>
      <div style="font-size:var(--fs-xxs);color:#475569;border-top:1px solid #fde68a;padding-top:6px;line-height:1.6;">
        構成例：${schuylerExists ? 'ウィリアムズ＋マーフィ（前衛2体）＋キム＋DVA＋スカイラー' : 'ウィリアムズ＋マーフィ（前衛2体）＋キム＋DVA＋マーシャル'}
      </div>
    </div>` : '';

  body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
      <span style="font-size:var(--fs-md);font-weight:900;color:#374151;">${squadLabel[nextSquad]}の推奨兵種</span>
      <span style="font-size:var(--fs-xxs);color:#475569;background:#f1f5f9;border-radius:4px;padding:2px 7px;white-space:nowrap;flex-shrink:0;">手持ち＋控えから算出・現在の武装Lv基準</span>
    </div>
    ${mixedCard}
    ${sorted.map(([t],i) => typeCard(t,i+1)).join('')}
    <div style="font-size:var(--fs-xxs);color:#475569;margin-top:6px;border-top:1px solid #e2e8f0;padding-top:6px;">
      相対戦力は最もスコアが高い兵種を100%とした比較値です（達成率とは別の指標）。兵種バフは手持ち＋控えで実現可能な目標値を示します。
    </div>
  `;
}


function getPreciseCost(current, target) {
    if (current >= 30 || target <= current) return 0;
    let total = 0;
    for (let i = current + 1; i <= target; i++) {
        if (i === 1) total += 50;
        else if (i >= 2 && i <= 5) total += 20;
        else if (i >= 6 && i <= 10) total += 40;
        else if (i >= 11 && i <= 15) total += 60;
        else if (i >= 16 && i <= 20) total += 100;
        else if (i >= 21 && i <= 25) total += 150;
        else if (i >= 26 && i <= 30) total += 200;
    }
    return total;
}

function getNextMilestone(lv) {
    if (lv >= 30) return null;
    let target = lv < 10 ? 10 : (lv < 20 ? 20 : 30);
    return { target: target, cost: getPreciseCost(lv, target) };
}

window.onload = function() { 
    try{ let ref=document.getElementById('ref-panel'); if(ref) ref.style.display='none'; }catch(e){} 

    initSquadHTML();
    loadAllData();
    // renderPresetPanelはloadAllDataでロスターがDOMに反映された後に呼ぶ必要がある
    // （所持英雄の判定に現在のh-s-pの値を使うため）
    try { renderPresetPanel(); } catch(e) {} 
    try { renderCommunityTrainingOrder(); } catch(e) {}
try { updateAiConsultButton(); } catch(e) {}
try { updatePlayerTypeButtons(); } catch(e) {}

// ===== オンボーディング =====
function showOnboardIfNeeded() {
  try {
    const dismissed = localStorage.getItem('lw_onboard_dismissed');
    const hasData   = localStorage.getItem('lw_sim_v24_final') || localStorage.getItem('lw_sim_v23_final');
    if (dismissed === '1' || hasData) return; // 既存ユーザーはスキップ
    document.getElementById('onboard-overlay').style.display = 'flex';
  } catch(e) {}
}
function closeOnboard() {
  try {
    const noShow = document.getElementById('onboard-no-show');
    if (noShow && noShow.checked) {
      localStorage.setItem('lw_onboard_dismissed', '1');
    }
    const el = document.getElementById('onboard-overlay');
    if (el) {
      el.style.opacity = '0';
      el.style.transition = 'opacity .2s';
      setTimeout(() => el.style.display = 'none', 200);
    }
  } catch(e) {}
}

    showOnboardIfNeeded();
    try { restorePanelStates(); } catch(e) {}
    try { renderSlots(); } catch(e) {}
   
   // ★★★ これを追加（超重要）
    updateTransitionRecommendationUI();
    try{ updateSlotEvalsFromCurrentInputs(); }catch(e){}
};

function showTab(id, el) { 
    document.querySelectorAll('.tab-content').forEach(e => e.classList.remove('active')); 
    document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active')); 
    $id('tab-'+id).classList.add('active'); 
    if(el) el.classList.add('active'); 
    let ref = document.getElementById('ref-panel');
    if(ref) ref.style.display = (id === 'guide') ? 'block' : 'none';
    if(id === 'heroes') renderHeroDex();
}


function makeDataSvg(svg){
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}
function getHeroImagePath(heroId){
  if(!heroId || heroId === 'empty') return '';
  return `img/${heroId}.webp`;
}function makeShardIcon(){
  return makeDataSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#f97316"/></linearGradient></defs><rect x="6" y="6" width="52" height="52" rx="14" fill="url(#g)"/><path d="M32 14l8 14-8 22-8-22z" fill="rgba(255,255,255,.92)"/></svg>`);
}

function showToast(msg) { 
    let x = $id("toast"); 
    x.innerText = msg; x.style.visibility = "visible"; x.style.bottom = "80px"; 
    setTimeout(() => { x.style.visibility = "hidden"; x.style.bottom = "30px"; }, 2500); 
}


/* === UIアイコン（兵種/役割） === */




function uiIcon(src, alt){
  if(!src) return "";
  return `<img class="ui-ico" src="${src}" alt="${alt||''}">`;
}
function typeIcon(t){ return uiIcon(TYPE_ICON[t], t); }
function roleIcon(r){ return uiIcon(ROLE_ICON[r], r); }

/* 育成ランキング表示用：兵種アイコン - キャラ名 - 役割アイコン */
function effTitleLine(rank, item){
  const t = item.type || item.t;
  const r = item.roleKey || item.r;
  return `<div class="eff-title-line">${typeIcon(t)}<b>${rank}. ${item.name}</b>${roleIcon(r)}</div>`;
}

// ===============================
// 育成ランキング：カード用CSSを強制注入（styles.css をいじっても効かない問題対策）
// ===============================
(function(){
  try{
    if(document.getElementById('__eff_rank_css')) return;
    const st = document.createElement('style');
    st.id = '__eff_rank_css';
    st.textContent = `
      .eff-card{ padding:10px 10px; border-radius:12px; }
      .eff-card + .eff-card{ border-top:1px solid #f3c4dd; margin-top:10px; padding-top:14px; }
      .eff-card-best{ background:#fff7ed; border:1px solid #fdba74; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
      .eff-row{ display:flex; justify-content:space-between; gap:10px; align-items:flex-start; }
      .eff-left{ line-height:1.4; min-width:0; }
      .eff-right{ display:flex; flex-direction:column; align-items:flex-end; text-align:right; gap:6px; flex-shrink:0; }
      .eff-sub{ display:flex; justify-content:flex-end; width:100%; }
      .eff-subline{ display:inline-flex; align-items:center; gap:6px; white-space:nowrap; color:#475569; font-size:var(--fs-md); font-weight:900; }
      .eff-plus{ font-weight:900; }
      .gear-cost{ display:inline-flex; align-items:center; gap:4px; white-space:nowrap; }
      .gear-cost img{ width:36px; height:36px; flex-shrink:0; }
      .gear-num{ font-size:1.15em; font-weight:900; }
      .gear-cost .sep{ opacity:.65; margin-right:2px; }
      .rankhero-topbadge{ display:flex; align-items:flex-start; gap:6px; flex-wrap:wrap; justify-content:flex-end; }
      .rankhero-pinbtn{ appearance:none; border:1px solid #d1d5db; background:#fff; color:#475569; border-radius:999px; width:24px; height:24px; min-width:24px; padding:0; display:inline-flex; align-items:center; justify-content:center; font-size:.85rem; font-weight:900; line-height:1; cursor:pointer; transform:translateY(-3px); }
      .rankhero-pinbtn.is-active{ background:#fff7ed; border-color:#c2410c; color:#c2410c; border-radius:10px; width:auto; min-width:34px; padding:0 8px; }
      .hold-pin-summary{ margin:0 0 10px; padding:10px; border:1px dashed #fbcfe8; border-radius:10px; background:#fff; }
      .hold-pin-title{ font-size:var(--fs-md); font-weight:900; color:#a21caf; margin-bottom:6px; }
      .hold-pin-list{ display:flex; flex-wrap:wrap; gap:6px; }
      .hold-pin-chip{ appearance:none; border:1px solid #fdba74; background:#fff7ed; color:#c2410c; border-radius:999px; padding:5px 10px; font-size:.74rem; font-weight:900; cursor:pointer; }
      .rankhero-reasons{ display:flex; flex-wrap:wrap; gap:4px; margin-top:4px; }
      .rankhero-card--split,
      .reinf-card + .reinf-card{ position:relative; margin-top:14px; padding-top:16px; }
      .rankhero-card--split::before,
      .reinf-card + .reinf-card::before{ content:''; position:absolute; left:0; right:0; top:0; height:1px; background:linear-gradient(90deg, rgba(244,114,182,0), rgba(244,114,182,.42) 12%, rgba(244,114,182,.42) 88%, rgba(244,114,182,0)); }
      .reason-badge{ display:inline-flex; align-items:center; border-radius:999px; padding:2px 6px; font-size:var(--fs-xxs); font-weight:700; line-height:1.2; border:1px solid transparent; white-space:nowrap; }
      .reason-badge--neutral{ background:#f1f5f9; color:#475569; border-color:#475569; }
      .reason-badge--accent{ background:#e0e7ff; color:#3730a3; border-color:#a5b4fc; }
      .reason-badge--good{ background:#ecfdf5; color:#047857; border-color:#a7f3d0; }
      .reason-badge--warn{ background:#fff7ed; color:#c2410c; border-color:#c2410c; }
      .reason-badge--attack{ background:#fef2f2; color:#b91c1c; border-color:#fecaca; }
      .reason-badge--defense{ background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe; }
      .reason-badge--support{ background:#faf5ff; color:#7e22ce; border-color:#e9d5ff; }
      .reason-badge--future{ background:#ede9fe; color:#5b21b6; border-color:#c4b5fd; font-weight:900; }
      .rankhero-summary{ margin-top:5px; font-size:var(--fs-sm); line-height:1.5; color:#374151; }
    `;
    document.head.appendChild(st);
  }catch(e){}
})();

function effCardHtml(rank, item, opts){
  opts = opts || {};
  const isBest = !!opts.isBest;
  const isTop = !!opts.isTop;
  const mode = opts.mode || 'normal'; // normal | unlock

  const safeItem = Object.assign({}, item || {});
  // フォールバック（データ差分吸収）
  safeItem.type = safeItem.type || safeItem.t;
  safeItem.roleKey = safeItem.roleKey || safeItem.r;
  safeItem.name = safeItem.name || safeItem.n;

  const lvLine = safeItem.isAwakeningItem
    ? `<span class="eff-lv" style="color:#ef4444;font-weight:900;">👑 覚醒 ${safeItem.awTierStr==='none'?'未覚醒':awStarLabel(parseAwTier(safeItem.awTierStr))} → ${safeItem.nextTierLabel || ('★'+safeItem.nextTierStr)}</span>`
    : (safeItem.from !== undefined && safeItem.to !== undefined)
      ? `<span class="eff-lv">(Lv${safeItem.from}→${safeItem.to})</span>`
      : '';

  const badge = (mode === 'normal' && safeItem.growthType) ? growthBadge(safeItem.growthType) : (opts.rightBadge || '');

  let sub = '';
  if(mode === 'unlock'){
    const unlockLv = (safeItem.to !== undefined) ? ` <span class="eff-lv">(Lv${safeItem.from||0}→${safeItem.to})</span>` : '';
    sub = `<div class="eff-sub"><span class="eff-subline">解放時${unlockLv}</span></div>`;
  }else{
    const costPart = safeItem.isAwakeningItem
      ? `<span class="gear-cost"><span class="sep">必要：</span>${safeItem.nextShardNamed ? '🔑専用' : '<img src="img/kakusei.webp" style="width:30px;height:30px;vertical-align:middle;">'} <span class="gear-num">×${safeItem.nextShardCost}</span></span>`
      : (safeItem.cost !== undefined && safeItem.cost !== null)
        ? `<span class="gear-cost"><span class="sep">必要：</span><img src="${SHARD_ICON_SRC}" alt="gear"> <span class="gear-num">${safeItem.cost}</span></span>`
        : '';
    sub = `<div class="eff-sub"><span class="eff-subline">${costPart || ''}</span></div>`;
  }

  return `
    <div class="eff-card ${isTop?'eff-card-top':''} ${isBest?'eff-card-best':''}">
      <div class="eff-row">
        <div class="eff-left">
          ${effTitleLine(rank, safeItem)}
          ${isBest ? '<span class="eff-best">👑 最優先</span>' : ''}
          ${lvLine}
        </div>
        <div class="eff-right">
          ${badge}
          ${sub}
        </div>
      </div>
    </div>
  `;
}


function reinfCardHtml(rank, item){
  const safeItem = Object.assign({}, item || {});
  safeItem.type = safeItem.type || safeItem.t;
  safeItem.roleKey = safeItem.roleKey || safeItem.r;
  safeItem.name = safeItem.name || safeItem.n || '';
  safeItem.id = safeItem.id || safeItem.key || safeItem.heroId || '';

  // 育成ランキングと完全に同じ描画ルートを使う
  // （画像・名前行・右側メタの構造を揃える）
  return `<div class="reinf-card">${topRankCardHtml(rank, safeItem, { compact:true, showPin:false })}</div>`;
}

function topRankCardHtml(rank, item, opts){
  opts = opts || {};
  const compact = !!opts.compact;
  const safeItem = Object.assign({}, item || {});
  safeItem.type = safeItem.type || safeItem.t;
  safeItem.roleKey = safeItem.roleKey || safeItem.r;
  safeItem.name = safeItem.name || safeItem.n || '';

  const lvLine = (safeItem.from !== undefined && safeItem.to !== undefined)
    ? `<div class="rankhero-lv">(Lv${safeItem.from}→${safeItem.to})</div>`
    : '';

  const costPart = (safeItem.cost !== undefined && safeItem.cost !== null)
    ? `<span class="rankhero-cost"><span class="rankhero-cost-sep">あと</span><img class="rankhero-cost-icon" src="${SHARD_ICON_SRC}" alt="gear"> <span class="rankhero-cost-num">${safeItem.cost}</span></span>`
    : '';

  const badge = safeItem.growthType ? growthBadge(safeItem.growthType) : (opts.rightBadge || '');
  const reasonBadges = Array.isArray(safeItem.reasonCodes) ? __aiSelectReasonCodes(safeItem.reasonCodes, 2).map(reasonCodeBadge).join('') : '';
  const summaryText = __buildRecommendationSummary(safeItem);
  const pinBtn = (opts.showPin === false) ? '' : holdPinChipHtml(safeItem);
  const isBestRank = !!opts.isBest;
  const cardClass = compact
    ? 'rankhero-card rankhero-card--compact'
    : `rankhero-card ${isBestRank ? 'rankhero-card--best' : (rank>1?'rankhero-card--split':'')}`;
  const rowClass = compact ? 'rankhero-row rankhero-row--compact' : 'rankhero-row';

  return `
    <div class="${cardClass}">
      <div class="${rowClass}">
        <div class="rankhero-visual">
          <div class="rankhero-chip-row">
            <span class="rankhero-chip">${typeIcon(safeItem.type)}</span>
            <span class="rankhero-chip">${roleIcon(safeItem.roleKey)}</span>
          </div>
          <span class="rankhero-avatar-wrap">
            <img class="rankhero-avatar-img" src="${getHeroImagePath(safeItem.id || safeItem.key || safeItem.heroId || '')}" alt="${safeItem.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <span class="rankhero-avatar-fallback" style="display:none;">${typeIcon(safeItem.type)}</span>
          </span>
          <div class="rankhero-name">${rank}. ${safeItem.name}</div>
          ${(()=>{
            if(typeof AWAKENING_HEROES==='undefined') return '';
            const awData = AWAKENING_HEROES[safeItem.id||safeItem.key||safeItem.heroId||''];
            if(!awData) return '';
            const awTierStr = loadAwTier(safeItem.id||safeItem.key||safeItem.heroId||'');
            const awAt = (typeof parseAwTier!=='undefined') ? parseAwTier(awTierStr) : {star:-1,tier:0};
            if(awAt.star < 0) return '<span class="awaken-can-badge" style="display:inline-block;margin-top:2px;">覚醒可</span>';
            const tl = awStarLabel(awAt);
            return '<span style="display:inline-block;margin-top:2px;font-size:var(--fs-xxs);color:#b45309;background:#fef3c7;border:1px solid #fde68a;border-radius:4px;padding:1px 5px;font-weight:900;">' + tl + '</span>';
          })()}
        </div>

        <div class="rankhero-body">
          <div class="rankhero-topline">
            ${lvLine}
            <div class="rankhero-topbadge">${badge}${pinBtn}</div>
          </div>
          ${reasonBadges ? `<div class="rankhero-reasons">${reasonBadges}</div>` : ''}
          ${(safeItem.reasonLabel ? `<div style="font-size:var(--fs-xxs);color:#94a3b8;margin-top:1px;">${escapeHtml(safeItem.reasonLabel)}</div>` : '')}
          ${summaryText ? `<div class="rankhero-summary">${escapeHtml(summaryText)}</div>` : ''}
          ${(()=>{
            const hid = safeItem.id||safeItem.key||safeItem.heroId||'';
            const advice = __buildAwakeningAdvice(hid, safeItem.wp || safeItem.from || 0);
            return advice ? `<div class="rankhero-summary" style="color:#ef4444;border-left:2px solid #b91c1c;padding-left:6px;margin-top:3px;">${escapeHtml(advice)}</div>` : '';
          })()}
          <div class="rankhero-bottomline">
            <div class="rankhero-leftline">
              <!-- gain数値は非表示（効果バッジで表現） -->
            </div>
            <div class="rankhero-costwrap">${costPart}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 育成効率ランキング：Top3 + 「もっと見る」トグル
function toggleEffMore() {
    let more = $id('eff-more-list');
    let btn = $id('eff-more-btn');
    if(!more || !btn) return;
    let open = more.getAttribute('data-open') === '1';
    if(open) {
        more.style.display = 'none';
        more.setAttribute('data-open','0');
        btn.innerText = 'もっと見る（おすすめ）';
    } else {
        more.style.display = 'block';
        more.setAttribute('data-open','1');
        btn.innerText = '閉じる';
    }
}

// ===============================
// 📋 推奨編成テンプレート（コミュニティ検証済み）
// ===============================
// ===============================
// 推奨編成テンプレート（F2P〜微課金向け）
// EWは「推奨目標値」。EW Lv20が各英雄の現実的な節目。
// 出典: packsify/allclash/cpt-hedge/ldshop (2026年6月時点)
// ===============================


// 現在のロスター（1〜3軍＋控え）に配置されている英雄IDの集合を取得する。
// 推奨編成テンプレートの「移行しやすさ」判定・所持アイコンの色分けに使う。
function __collectCurrentRosterIds() {
  const ids = new Set();
  for (let s = 1; s <= 4; s++) {
    const slotCount = (s === 4) ? 10 : 5;
    for (let p = 1; p <= slotCount; p++) {
      const el = $id(`h-${s}-${p}`);
      if (el && el.value && el.value !== 'empty') ids.add(el.value);
    }
  }
  return ids;
}

// 現在のロスターの「英雄ID → 最大武装Lv」のMapを取得する。同じ英雄が複数スロットに
// いる場合は最大値を採用する（控えと本軍で重複する運用等を想定）。
// 推奨編成テンプレートが「もう卒業済みか」を判定するために使う。
function __collectCurrentRosterWpMap() {
  const map = new Map();
  for (let s = 1; s <= 4; s++) {
    const slotCount = (s === 4) ? 10 : 5;
    for (let p = 1; p <= slotCount; p++) {
      const hEl = $id(`h-${s}-${p}`);
      const wEl = $id(`w-${s}-${p}`);
      if (!hEl || !hEl.value || hEl.value === 'empty') continue;
      const wp = parseInt((wEl||{}).value) || 0;
      const prev = map.get(hEl.value) || 0;
      if (wp > prev) map.set(hEl.value, wp);
    }
  }
  return map;
}

function loadPresetSortMode() {
  try {
    const v = localStorage.getItem('preset_sort_mode');
    return (v === 'recommend') ? 'recommend' : 'fit';
  } catch(e) { return 'fit'; }
}
function setPresetSortMode(mode) {
  try { localStorage.setItem('preset_sort_mode', mode); } catch(e) {}
  renderPresetPanel();
}

// コミュニティ推奨育成順パネル（静的データ、ロスター状態に依存しないため一度描画すればOK）
// 育成優先順パネルの各ヒーロー行：通常スキル＋専用武装Lv別効果の折りたたみ詳細
function __trainingOrderSkillDetail(id) {
  const adv = HERO_DB[id] && HERO_DB[id].advice;
  if (!adv) return '';
  const kit = adv.skills;
  const lv = adv.weaponLvNotes;
  let html = '';
  if (kit) {
    const rows = [
      { key:'auto', label:'通常攻撃' },
      { key:'battle', label:'バトルスキル' },
      { key:'passive', label:'パッシブ' },
    ].filter(r => kit[r.key] && kit[r.key].name).map(r => `
      <div style="margin-bottom:4px;">
        <span style="font-size:10px;font-weight:900;color:#0891b2;">${r.label}</span>
        <span style="font-size:var(--fs-xs);font-weight:800;color:#0f172a;">${kit[r.key].name}</span>
        <div style="font-size:10px;color:#64748b;line-height:1.4;">${kit[r.key].effect}</div>
      </div>`).join('');
    if (rows) html += `<div style="margin-bottom:6px;">${rows}</div>`;
  }
  if (lv) {
    const rows = ['lv1','lv10','lv20','lv30'].filter(k => lv[k]).map(k => `
      <div style="display:flex;gap:6px;margin-bottom:3px;">
        <span style="flex-shrink:0;font-size:10px;font-weight:900;color:#fff;background:#7c3aed;border-radius:4px;padding:1px 5px;">${k.replace('lv','Lv')}</span>
        <span style="font-size:10px;color:#64748b;line-height:1.4;">${lv[k]}</span>
      </div>`).join('');
    if (rows) html += `<div style="font-size:10px;font-weight:900;color:#7c3aed;margin-bottom:3px;">🔧 専用武装</div>${rows}`;
  }
  return html;
}

function renderCommunityTrainingOrder() {
  const list = document.getElementById('training-order-list');
  if (!list || typeof COMMUNITY_TRAINING_ORDER === 'undefined') return;
  const CONF = {
    high:  { label: '✅ 複数ソース一致', color: '#059669' },
    mixed: { label: '⚠️ ソースにより差あり', color: '#d97706' },
  };
  list.innerHTML = COMMUNITY_TRAINING_ORDER.map(group => {
    const conf = CONF[group.confidence] || CONF.mixed;
    const rows = group.order.map((entry, i) => {
      const h = HERO_DB[entry.id] || {};
      const detailId = `training-detail-${group.type}-${entry.id}`;
      const detailHtml = __trainingOrderSkillDetail(entry.id);
      return `
        <div style="padding:6px 0;${i>0?'border-top:1px dashed #e2e8f0;':''}">
          <div style="display:flex;gap:8px;align-items:flex-start;">
            <div style="flex-shrink:0;width:22px;height:22px;border-radius:50%;background:#c026d3;color:#fff;font-size:var(--fs-xs);font-weight:900;display:flex;align-items:center;justify-content:center;margin-top:1px;">${i+1}</div>
            <div style="flex-shrink:0;width:36px;height:36px;border-radius:8px;overflow:hidden;background:#0b1220;">
              <img src="img/${entry.id}.webp" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.opacity=0">
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:var(--fs-sm);font-weight:900;color:#0f172a;">${h.name || entry.id}</div>
              <div style="font-size:var(--fs-xs);color:#64748b;line-height:1.5;">${entry.reason}</div>
              ${detailHtml ? `<button onclick="const e=document.getElementById('${detailId}');const open=e.style.display!=='none';e.style.display=open?'none':'block';this.textContent=open?'▼ スキルを見る':'▲ 閉じる';" style="margin-top:4px;font-size:10px;font-weight:900;color:#7c3aed;background:none;border:none;padding:0;cursor:pointer;">▼ スキルを見る</button>` : ''}
            </div>
          </div>
          ${detailHtml ? `<div id="${detailId}" style="display:none;margin:6px 0 0 66px;padding:8px;background:#faf5ff;border-radius:8px;border:1px solid #f3e8ff;">${detailHtml}</div>` : ''}
        </div>`;
    }).join('');
    return `
      <div style="background:#fff;border:1px solid #e8edf5;border-radius:12px;padding:12px;">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
          <span style="font-size:var(--fs-sm);font-weight:900;color:#0f172a;">${group.typeLabel}</span>
          <span style="font-size:var(--fs-xxs);font-weight:900;color:${conf.color};background:${conf.color}18;border:1px solid ${conf.color}44;border-radius:4px;padding:1px 5px;">${conf.label}</span>
        </div>
        ${rows}
        <div style="font-size:10px;color:#94a3b8;margin-top:6px;">📖 出典：${group.source}</div>
      </div>`;
  }).join('');
}

function renderPresetPanel() {
  const panel = document.getElementById('preset-panel');
  const list  = document.getElementById('preset-list');

  if (!panel || !list) return;
  panel.style.display = 'block';
  const TC = { tank:'#3b82f6', air:'#8b5cf6', mis:'#ef4444', mix:'#f59e0b' };
  const TL = { tank:'戦車軸', air:'航空軸', mis:'ロケラン軸', mix:'混成型' };
  const SL = { f2p:'🆓 無課金向け', low:'💰 低課金向け', mid:'💎 中課金向け' };
  const SC = { f2p:'#059669', low:'#2563eb', mid:'#7c3aed' };

  const ownedIds = __collectCurrentRosterIds();
  const wpMap = __collectCurrentRosterWpMap();
  const sortMode = loadPresetSortMode();

  // テンプレートの英雄アイコングリッドを生成する共通関数（通常カード・卒業済みセクション両方で使う）
  function renderHeroIconGrid(squad) {
    const heroCard = m => {
      const h = HERO_DB[m.id]||{};
      const isOwned = ownedIds.has(m.id);
      const currentWp = wpMap.get(m.id) || 0;

      // 4段階の枠線ステータス判定：
      // 未所持＝薄いグレー／所持・最低未達＝濃いグレー／所持・最低達成＝青／所持・理想達成＝オレンジ
      const targetMin   = (m.wpMin != null)   ? m.wpMin   : m.wp;
      const targetIdeal  = (m.wpIdeal != null) ? m.wpIdeal : m.wp;
      let ringColor, ringStyle;
      if (!isOwned) {
        ringColor = '#cbd5e1';
        ringStyle = 'border:4px solid '+ringColor+';opacity:0.55;';
      } else if (targetIdeal != null && currentWp >= targetIdeal) {
        ringColor = '#d97706'; // 理想達成：オレンジ
        ringStyle = 'border:4px solid '+ringColor+';box-shadow:0 0 0 3px rgba(217,119,6,0.35), 0 2px 6px rgba(217,119,6,0.4);';
      } else if (targetMin != null && currentWp >= targetMin) {
        ringColor = '#2563eb'; // 最低達成：青
        ringStyle = 'border:4px solid '+ringColor+';box-shadow:0 0 0 3px rgba(37,99,235,0.35), 0 2px 6px rgba(37,99,235,0.4);';
      } else {
        ringColor = '#64748b'; // 所持・最低未達：濃いグレー（未所持の薄いグレーと区別）
        ringStyle = 'border:4px solid '+ringColor+';opacity:1;';
      }

      // wpMin/wpIdealがあれば「最低/理想」を縦2行・色分けで表示。旧形式（wpのみ）との後方互換も維持。
      const ewBlock = (m.wpMin != null && m.wpIdeal != null)
        ? (m.wpMin === m.wpIdeal
            ? `<span class="preset-hero-ew">目標EW${m.wpMin}</span>`
            : `<span class="preset-hero-ew-min">最低EW${m.wpMin}</span><span class="preset-hero-ew-ideal">理想EW${m.wpIdeal}</span>`)
        : `<span class="preset-hero-ew">目標EW${m.wp}</span>`;
      return '<div class="preset-hero-col">'
        +'<div class="preset-hero-icon" style="'+ringStyle+'border-radius:10px;">'
        +'<img src="img/'+m.id+'.webp" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.opacity=0">'
        +'</div>'
        +'<span class="preset-hero-name">'+(h.name||m.id)+'</span>'
        +ewBlock
        +(m.note ? (
            m.noteEw != null
              ? '<span class="preset-hero-note-ew">EW'+m.noteEw+'で</span><span class="preset-hero-note">'+m.note+'</span>'
              : '<span class="preset-hero-note">'+m.note+'</span>'
          ) : '')
        +'</div>';
    };
    // スマホ(<640px): 3+2のグリッド配置（編成スロットと同じ見た目）
    // タブレット・PC(>=640px): 5列固定グリッド
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      const cards = squad.map(heroCard);
      return '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,70px));justify-content:center;gap:8px 58px;">'
        + '<div style="grid-column:1;grid-row:1;justify-self:end;transform:translateX(60px);">'+cards[0]+'</div>'
        + '<div style="grid-column:3;grid-row:1;justify-self:start;transform:translateX(-60px);">'+cards[1]+'</div>'
        + '<div style="grid-column:1;grid-row:2;justify-self:start;">'+cards[2]+'</div>'
        + '<div style="grid-column:2;grid-row:2;justify-self:center;">'+cards[3]+'</div>'
        + '<div style="grid-column:3;grid-row:2;justify-self:end;">'+cards[4]+'</div>'
        + '</div>';
    }
    return '<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));justify-items:center;gap:10px 6px;">'+squad.map(heroCard).join('')+'</div>';
  }



  // 移行しやすさ = テンプレートのメンバーのうち、現在のロスターに既にいる人数
  // 卒業済み = テンプレートの全メンバーについて、現在の武装Lvが理想目標（wpIdeal）以上になっている
  //（その兵種について「もうこのテンプレートの段階は通過済み」という意味）
  // ⚠️ >=を使うこと。目標武装Lv=0のヒーロー（マーシャル等、EW0で機能する設計）がいる場合、
  // 厳密な > だと current(0) > target(0) が常にfalseになり、永久に卒業判定されない不具合があった。
  const __presetTargetWp = m => (m.wpIdeal != null ? m.wpIdeal : m.wp);
  const allPresetsWithFit = FORMATION_PRESETS.map((p, idx) => {
    const ownedCount = p.squad.filter(m => ownedIds.has(m.id)).length;
    const isGraduated = ownedCount === p.squad.length
      && p.squad.every(m => (wpMap.get(m.id) || 0) >= __presetTargetWp(m));
    return { p, ownedCount, totalCount: p.squad.length, originalIndex: idx, isGraduated };
  });
  const presetsWithFit = allPresetsWithFit.filter(x => !x.isGraduated);
  const graduatedPresets = allPresetsWithFit.filter(x => x.isGraduated);
  if (sortMode === 'fit') {
    // 所持数が多い（移行しやすい）順に並び替え。同数なら元の順序を維持。
    presetsWithFit.sort((a, b) => b.ownedCount - a.ownedCount || a.originalIndex - b.originalIndex);
  } else {
    // 推奨順：FORMATION_PRESETSの元の並び（コミュニティ評価・課金度合いの低い順等）を維持
    presetsWithFit.sort((a, b) => a.originalIndex - b.originalIndex);
  }

  // ソート切り替えボタン
  const sortToggleHtml = `
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <button onclick="setPresetSortMode('fit')" style="flex:1;font-size:var(--fs-xs);padding:7px 8px;border-radius:8px;border:1px solid ${sortMode==='fit'?'#2563eb':'#cbd5e1'};background:${sortMode==='fit'?'#2563eb':'#fff'};color:${sortMode==='fit'?'#fff':'#475569'};font-weight:900;cursor:pointer;">🔄 今の編成に近い順</button>
      <button onclick="setPresetSortMode('recommend')" style="flex:1;font-size:var(--fs-xs);padding:7px 8px;border-radius:8px;border:1px solid ${sortMode==='recommend'?'#2563eb':'#cbd5e1'};background:${sortMode==='recommend'?'#2563eb':'#fff'};color:${sortMode==='recommend'?'#fff':'#475569'};font-weight:900;cursor:pointer;">⭐ コミュニティ推奨順</button>
    </div>
    <div style="font-size:var(--fs-xxs);color:#64748b;margin-bottom:8px;">
      ${sortMode === 'fit'
        ? '💡 今の手持ちで反映しやすい編成を優先表示しています。'
        : '💡 課金度合い・編成の完成度を基準にしたおすすめ順です。今の手持ちと離れていても、目指す形として参考にしてください。'}
    </div>`;

  list.innerHTML = sortToggleHtml + presetsWithFit.map(({p, ownedCount, totalCount}) => {
    const fitLabel = ownedCount === totalCount
      ? '✅ 全員所持'
      : ownedCount === 0
        ? '🆕 全員未所持'
        : `🔄 ${ownedCount}/${totalCount}人所持`;
    const fitColor = ownedCount === totalCount ? '#059669' : ownedCount === 0 ? '#94a3b8' : '#d97706';
    const bodyId = `preset-card-body-${p.id}`;
    const iconId = `preset-card-icon-${p.id}`;
    return `
    <div style="background:#fff;border:1px solid #e8edf5;border-radius:12px;overflow:hidden;padding:12px;">
      <div class="panel-collapse-header" onclick="togglePanel('${bodyId}','${iconId}')" style="align-items:flex-start;">
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-bottom:2px;">
            <span style="font-size:var(--fs-xxs);font-weight:900;color:${SC[p.spendLevel]};background:${SC[p.spendLevel]}18;border:1px solid ${SC[p.spendLevel]}44;border-radius:4px;padding:1px 5px;">${SL[p.spendLevel]}</span>
            <span style="font-size:var(--fs-xxs);font-weight:900;color:${TC[p.type]};background:${TC[p.type]}18;border-radius:4px;padding:1px 5px;">${TL[p.type]}</span>
            <span style="font-size:var(--fs-xxs);font-weight:900;color:${fitColor};background:${fitColor}18;border:1px solid ${fitColor}44;border-radius:4px;padding:1px 5px;">${fitLabel}</span>
          </div>
          <div style="font-size:var(--fs-md);font-weight:900;color:#111827;line-height:1.3;">${p.name}</div>
        </div>
        <span id="${iconId}" class="panel-collapse-icon${ownedCount > 0 ? ' open' : ''}" style="padding-top:2px;">▼</span>
      </div>
      <div id="${bodyId}" class="panel-collapsible preset-tall${ownedCount > 0 ? ' open' : ''}" style="margin-top:8px;">
      <!-- ボタン行 -->
      <div style="display:flex;gap:3px;justify-content:flex-end;margin-bottom:8px;">
        <button onclick="applyPreset('${p.id}',1)" style="font-size:var(--fs-xs);background:#2563eb;color:#fff;border:none;border-radius:8px;padding:7px 12px;font-weight:900;cursor:pointer;min-height:36px;">1軍</button>
        <button onclick="applyPreset('${p.id}',2)" style="font-size:var(--fs-xs);background:#7c3aed;color:#fff;border:none;border-radius:8px;padding:7px 12px;font-weight:900;cursor:pointer;min-height:36px;">2軍</button>
        <button onclick="applyPreset('${p.id}',3)" style="font-size:var(--fs-xs);background:#059669;color:#fff;border:none;border-radius:8px;padding:7px 12px;font-weight:900;cursor:pointer;min-height:36px;">3軍</button>
      </div>
      <!-- 説明 -->
      <div style="font-size:var(--fs-sm);color:#374151;margin-bottom:6px;">${p.desc}</div>
      <!-- F2P注意点 -->
      ${p.note ? '<div style="font-size:var(--fs-xxs);color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:4px 7px;margin-bottom:7px;">💡 '+p.note+'</div>' : ''}
      <!-- 英雄アイコン：前衛2体（上段）＋後衛3体（下段） -->
      <div style="font-size:var(--fs-xxs);color:#b45309;font-weight:700;margin-bottom:5px;">⚠️ EWは推奨目標値（現在のLvを保持して反映）</div>
      <div style="font-size:var(--fs-xxs);color:#64748b;margin-bottom:5px;line-height:1.6;">枠の色：<span style="color:#94a3b8;font-weight:900;">グレー薄</span>＝未所持／<span style="color:#64748b;font-weight:900;">グレー濃</span>＝所持・最低未達<br><span style="color:#2563eb;font-weight:900;">青</span>＝最低達成／<span style="color:#d97706;font-weight:900;">✨オレンジ＋発光</span>＝理想達成</div>
      ${renderHeroIconGrid(p.squad)}
      <div style="margin-top:6px;font-size:var(--fs-xxs);color:#475569;">📖 出典: ${p.source}</div>
      </div>
    </div>
  `;
  }).join('') + (graduatedPresets.length ? `
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;padding:12px;margin-top:4px;">
      <div class="panel-collapse-header" onclick="togglePanel('preset-graduated-body','preset-graduated-icon')">
        <div style="font-size:var(--fs-sm);font-weight:900;color:#64748b;">🎓 卒業済みテンプレート（${graduatedPresets.length}件）</div>
        <span id="preset-graduated-icon" class="panel-collapse-icon">▼</span>
      </div>
      <div id="preset-graduated-body" class="panel-collapsible preset-tall" style="margin-top:8px;">
        <div style="font-size:var(--fs-xxs);color:#94a3b8;margin-bottom:8px;">手持ちが目標武装Lvを上回り、達成済みのテンプレートです。必要であれば反映できます。</div>
        ${graduatedPresets.map(({p}) => {
          const gBodyId = `preset-graduated-card-body-${p.id}`;
          const gIconId = `preset-graduated-card-icon-${p.id}`;
          return `
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:10px;margin-top:8px;">
            <div class="panel-collapse-header" onclick="togglePanel('${gBodyId}','${gIconId}')" style="align-items:flex-start;">
              <span style="font-size:var(--fs-sm);color:#475569;font-weight:700;">✅ ${p.name}</span>
              <span id="${gIconId}" class="panel-collapse-icon" style="padding-top:2px;">▼</span>
            </div>
            <div id="${gBodyId}" class="panel-collapsible preset-tall" style="margin-top:8px;">
              <div style="display:flex;gap:3px;justify-content:flex-end;margin-bottom:8px;">
                <button onclick="applyPreset('${p.id}',1)" style="font-size:var(--fs-xxs);background:#2563eb;color:#fff;border:none;border-radius:6px;padding:5px 9px;font-weight:900;cursor:pointer;">1軍</button>
                <button onclick="applyPreset('${p.id}',2)" style="font-size:var(--fs-xxs);background:#7c3aed;color:#fff;border:none;border-radius:6px;padding:5px 9px;font-weight:900;cursor:pointer;">2軍</button>
                <button onclick="applyPreset('${p.id}',3)" style="font-size:var(--fs-xxs);background:#059669;color:#fff;border:none;border-radius:6px;padding:5px 9px;font-weight:900;cursor:pointer;">3軍</button>
              </div>
              ${renderHeroIconGrid(p.squad)}
            </div>
          </div>
        `;
        }).join('')}
      </div>
    </div>
  ` : '');
}
// ===============================
// 📖 キャラ紹介タブ（図鑑UI）
// ===============================
const __heroDexState = { type: 'all', role: 'all', owned: 'all' };

function __heroDexFilteredIds() {
  const ownedIds = __collectCurrentRosterIds();
  return Object.keys(HERO_DB).filter(id => {
    const h = HERO_DB[id];
    if (__heroDexState.type !== 'all' && h.type !== __heroDexState.type) return false;
    if (__heroDexState.role !== 'all' && h.role !== __heroDexState.role) return false;
    if (__heroDexState.owned === 'owned' && !ownedIds.has(id)) return false;
    if (__heroDexState.owned === 'unowned' && ownedIds.has(id)) return false;
    return true;
  });
}

function __heroDexFilterChip(groupKey, value, label) {
  const active = __heroDexState[groupKey] === value;
  return `<div class="dex-chip${active ? ' active' : ''}" onclick="__setHeroDexFilter('${groupKey}','${value}')">${label}</div>`;
}

function __setHeroDexFilter(groupKey, value) {
  __heroDexState[groupKey] = value;
  renderHeroDex();
}

function renderHeroDexFilterBar() {
  const bar = $id('hero-dex-filter-bar');
  if (!bar) return;
  bar.innerHTML = `
    <div class="dex-filter-row">
      <span class="dex-filter-label">兵種</span>
      ${__heroDexFilterChip('type','all','すべて')}
      ${__heroDexFilterChip('type','tank', uiIcon(TYPE_ICON.tank,'tank') + '戦車')}
      ${__heroDexFilterChip('type','air', uiIcon(TYPE_ICON.air,'air') + '航空')}
      ${__heroDexFilterChip('type','mis', uiIcon(TYPE_ICON.mis,'mis') + 'ロケラン')}
    </div>
    <div class="dex-filter-row">
      <span class="dex-filter-label">役割</span>
      ${__heroDexFilterChip('role','all','すべて')}
      ${__heroDexFilterChip('role','atk', uiIcon(ROLE_ICON.atk,'atk') + '火力')}
      ${__heroDexFilterChip('role','wall', uiIcon(ROLE_ICON.wall,'wall') + '壁')}
      ${__heroDexFilterChip('role','sup', uiIcon(ROLE_ICON.sup,'sup') + 'サポート')}
    </div>
    <div class="dex-filter-row">
      <span class="dex-filter-label">所持</span>
      ${__heroDexFilterChip('owned','all','すべて')}
      ${__heroDexFilterChip('owned','owned','所持済み')}
      ${__heroDexFilterChip('owned','unowned','未所持')}
    </div>
  `;
}

function renderHeroDexGrid() {
  const grid = $id('hero-dex-grid');
  if (!grid) return;
  const ownedIds = __collectCurrentRosterIds();
  const wpMap = __collectCurrentRosterWpMap();
  const ids = __heroDexFilteredIds();

  if (ids.length === 0) {
    grid.innerHTML = '<div style="padding:20px;text-align:center;color:#94a3b8;">条件に一致するキャラがいません</div>';
    return;
  }

  const cards = ids.map(id => {
    const h = HERO_DB[id] || {};
    const adv = (HERO_DB[id] && HERO_DB[id].advice) || {};
    const isOwned = ownedIds.has(id);
    const wp = wpMap.get(id) || 0;
    const awTier = isOwned ? loadAwTier(id) : 'none';

    const ringStyle = isOwned
      ? 'border:3px solid #2563eb;box-shadow:0 0 0 2px rgba(37,99,235,0.25);'
      : 'border:3px solid #cbd5e1;opacity:0.6;';

    const typeIcon = TYPE_ICON[h.type] ? `<img src="${TYPE_ICON[h.type]}" class="dex-type-icon">` : '';
    const wpBadge = isOwned ? `<span class="dex-wp-badge">EW${wp}</span>` : `<span class="dex-wp-badge dex-wp-badge-unowned">未所持</span>`;
    const tierCorner = __heroDexTierBadge(id) ? `<div class="dex-card-tier-corner">${__heroDexTierBadge(id)}</div>` : '';

    return `<div class="dex-card" onclick="openHeroDexDetail('${id}')">
      <div class="dex-card-icon" style="${ringStyle}">
        <img src="img/${id}.webp" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.opacity=0">
        ${typeIcon}
        ${tierCorner}
      </div>
      <span class="dex-card-name">${h.name || id}</span>
      ${wpBadge}
    </div>`;
  });

  grid.innerHTML = `<div class="dex-grid">${cards.join('')}</div>`;
}

function renderHeroDex() {
  renderHeroDexFilterBar();
  renderHeroDexGrid();
}

// --- 詳細モーダル ---
function __heroDexDynamicSummary(id) {
  const ownedIds = __collectCurrentRosterIds();
  const isOwned = ownedIds.has(id);
  if (!isOwned) {
    return `<div class="dex-dynamic-summary dex-dynamic-unowned">まだロスターに編成されていません。スロット編集画面でこのキャラを配置すると、現在の武装Lvに応じた進捗がここに表示されます。</div>`;
  }
  const wpMap = __collectCurrentRosterWpMap();
  const wp = wpMap.get(id) || 0;
  const awTier = loadAwTier(id);
  const meta = (HERO_DB[id] && HERO_DB[id].meta);
  const target = meta ? meta.ewTarget : null;

  const pct = (target != null && target > 0) ? Math.min(100, Math.round((wp / target) * 100)) : (target === 0 ? 100 : null);
  const remain = (target != null && target > wp) ? target - wp : 0;

  const awData = AWAKENING_HEROES[id];
  let awRow = '';
  if (awData) {
    awRow = (awTier !== 'none')
      ? `<div class="dex-dynamic-row"><span class="dex-dynamic-label">覚醒段階</span><span class="dex-dynamic-value">★${awTier}</span></div>`
      : `<div class="dex-dynamic-row"><span class="dex-dynamic-label">覚醒</span><span class="dex-dynamic-value">未解放</span></div>`;
  }

  const progressBar = (pct != null)
    ? `<div class="dex-progress-track"><div class="dex-progress-fill" style="width:${pct}%;"></div></div>
       <div class="dex-progress-caption">目標EW${target}まで${remain > 0 ? `あと${remain}` : '達成済み'}（${pct}%）</div>`
    : '';

  return `<div class="dex-dynamic-summary">
    <div class="dex-dynamic-row"><span class="dex-dynamic-label">現在の武装Lv</span><span class="dex-dynamic-value">EW${wp}</span></div>
    ${awRow}
    ${progressBar}
  </div>`;
}

function __heroDexTierBadge(id, withLabel) {
  const meta = (HERO_DB[id] && HERO_DB[id].meta);
  if (!meta) return '';
  const tierColors = { SSS:'#dc2626', SS:'#ea580c', S:'#d97706', A:'#2563eb', B:'#64748b', C:'#94a3b8', D:'#cbd5e1' };
  const color = tierColors[meta.ew] || '#94a3b8';
  const text = withLabel ? `Tier評価 ${meta.ew}` : meta.ew;
  return `<span class="dex-tier-badge" style="background:${color};">${text}</span>`;
}

// ===== スキル相性（通常スキルの効果から自動判定、表示専用） =====
// バトルスキルで確認できる「提供効果」を持つヒーローをキュレーションしたテーブル。
// スコア計算（__calcCandidateSynergyRate/__aiSynergyBias）には一切影響しない、表示専用の情報。
const HERO_SKILL_PROVIDERS = {
  mcgregor: { tags: ['taunt', 'atk_down'], reason: 'バトルスキル「揺るがぬ意志」で前衛の敵を挑発しつつ攻撃力を16.5%デバフ' },
  violet:   { tags: ['atk_down'], reason: 'バトルスキル「有毒ガス」で前衛の敵2体の攻撃力を6%デバフ' },
  morrison: { tags: ['def_down_stack'], reason: 'バトルスキル「徹甲射撃」で対象の防御力を最大25%までスタックデバフ' },
  carlie:   { tags: ['enemy_energy_atk_down'], reason: 'バトルスキル「ファイアサプライズ」で敵全体の与エネルギーダメージを5秒間15%軽減' },
  lucius:   { tags: ['ally_energy_dmg_reduction'], reason: 'バトルスキル「騎士道」で味方全体の被エネルギーダメージを5秒間19%軽減' },
  schuyler: { tags: ['stun_chance'], reason: 'バトルスキル「大大大爆撃」で敵後衛を20%の確率で2秒間スタン' },
  murphy:   { tags: ['ally_dmg_reduction', 'ally_temp_shield'], reason: 'パッシブで前衛の被ダメージを常時17%軽減、バトルスキルでさらに5秒間+29%（物理）軽減' },
  williams: { tags: ['ally_temp_shield'], reason: 'バトルスキル「鋼鉄の心」で前衛2体の防御力を10秒間50%アップ' },
  adam:     { tags: ['ally_dmg_reduction', 'counter'], reason: 'パッシブで前衛の被ダメージを常時13%軽減、バトルスキルで被弾ごとに反撃' },
  marshall: { tags: ['ally_atk_buff'], reason: 'バトルスキル「戦術指揮」で味方全体の攻撃力を6秒間16.5%アップ（兵種問わず全員に効く）' },
};

function __heroDexDamageType(id) {
  const auto = HERO_DB[id] && HERO_DB[id].advice && HERO_DB[id].advice.skills && HERO_DB[id].advice.skills.auto;
  if (!auto) return null;
  if (/エネルギーダメージ/.test(auto.effect)) return 'energy';
  if (/物理ダメージ/.test(auto.effect)) return 'physical';
  return null;
}

// タグ→「誰に効くか」の判定＋理由文を1箇所に集約し、提供側/受け手側どちらのページからでも
// 同じ結果が出るようにする（以前は提供側ページでdef_down_stack/taunt/stun_chance以外のタグが
// 素通りしていた非対称バグを解消）。
function __heroDexTagBeneficiaries(providerId, providerName, tag) {
  // otherId を受け取り、マッチすれば理由文を返す判定関数を返す
  switch (tag) {
    case 'def_down_stack':
      return (other, otherDmgType, otherIsAttacker) =>
        (otherDmgType === 'physical' && otherIsAttacker)
          ? `${providerName}の防御力デバフで${other.name}の物理ダメージが伸びる` : null;
    case 'taunt':
    case 'stun_chance':
      return (other, otherDmgType, otherIsAttacker, otherIsCore) =>
        (otherIsAttacker && otherIsCore)
          ? `${providerName}が敵の手を止めている隙に${other.name}が確殺を狙える` : null;
    case 'atk_down':
      return (other, otherDmgType, otherIsAttacker, otherIsCore, otherIsWall) =>
        otherIsWall ? `${providerName}の攻撃力デバフで前衛の${other.name}が受けるダメージが軽くなる` : null;
    case 'ally_dmg_reduction':
    case 'ally_temp_shield':
    case 'ally_energy_dmg_reduction':
      return (other, otherDmgType, otherIsAttacker) =>
        otherIsAttacker ? `${providerName}の被ダメージ軽減で前線が安定し、${other.name}が火力を出す時間が増える` : null;
    case 'enemy_energy_atk_down':
      return (other, otherDmgType, otherIsAttacker) =>
        (otherIsAttacker && otherDmgType !== 'physical')
          ? `${providerName}が敵の与エネルギーダメージを抑えるので、耐久の低い${other.name}が生き残りやすくなる` : null;
    case 'ally_atk_buff':
      return () => `${providerName}の攻撃力バフは兵種問わず全員に乗る`;
    default:
      return null;
  }
}

function __heroDexSkillSynergy(id) {
  const hero = HERO_DB[id];
  if (!hero) return '';
  const matches = [];

  if (HERO_SKILL_PROVIDERS[id]) {
    // このヒーロー自身が提供者の場合：誰に刺さるかを列挙
    const { tags } = HERO_SKILL_PROVIDERS[id];
    for (const otherId in HERO_DB) {
      if (otherId === id) continue;
      const other = HERO_DB[otherId];
      const otherDmgType = __heroDexDamageType(otherId);
      const otherIsAttacker = other.role === 'atk';
      const otherIsCore = !!(other.aiRole && other.aiRole.core);
      const otherIsWall = other.role === 'wall';
      for (const tag of tags) {
        const judge = __heroDexTagBeneficiaries(id, hero.name, tag);
        if (!judge) continue;
        const why = judge(other, otherDmgType, otherIsAttacker, otherIsCore, otherIsWall);
        if (why) matches.push({ id: otherId, name: other.name, why });
      }
    }
  } else {
    // このヒーロー自身が受け手側の場合：どの提供者と噛み合うかを列挙
    const dmgType = __heroDexDamageType(id);
    const isAttacker = hero.role === 'atk';
    const isCore = !!(hero.aiRole && hero.aiRole.core);
    const isWall = hero.role === 'wall';
    for (const providerId in HERO_SKILL_PROVIDERS) {
      if (providerId === id) continue;
      const providerHero = HERO_DB[providerId];
      if (!providerHero) continue;
      const { tags } = HERO_SKILL_PROVIDERS[providerId];
      for (const tag of tags) {
        const judge = __heroDexTagBeneficiaries(providerId, providerHero.name, tag);
        if (!judge) continue;
        const why = judge(hero, dmgType, isAttacker, isCore, isWall);
        if (why) matches.push({ id: providerId, name: providerHero.name, why });
      }
    }
  }

  // 重複除去（同じ相手が複数条件でヒットした場合は1件にまとめる）
  const seen = new Map();
  matches.forEach(m => { if (!seen.has(m.id)) seen.set(m.id, m); });
  const unique = [...seen.values()].slice(0, 5);
  if (!unique.length) return '';

  const rows = unique.map(m => `
    <div class="dex-skillsyn-row">
      <span class="dex-skillsyn-name">${m.name}</span>
      <span class="dex-skillsyn-why">${m.why}</span>
    </div>
  `).join('');
  return `<div class="dex-detail-section">
    <div class="dex-detail-section-title">🔗 スキル相性のいい相手</div>
    <div class="dex-skillsyn-list">${rows}</div>
    <div class="dex-skillkit-note">※ 通常スキルの効果から自動判定した参考情報です。ランキングや優先度の計算には使用していません。</div>
  </div>`;
}

// ===== 専用武装込みのコンボ（表示専用） =====
// weaponLvNotesの記述から確認できる、専用武装レベル依存の連携効果をキュレーション。
// レベル未到達だと発動しないため、通常スキルのコンボとは分けて表示する。
const HERO_EW_PROVIDERS = {
  tesla:    { tags: ['dot_stack'], reason: '専用武装Lv1で敵に「誘導電流」（継続エネルギーダメージ）を付与' },
  fiona:    { tags: ['dot_stack'], reason: '専用武装Lv1で敵に「余波」（継続物理ダメージ）を付与' },
  swift:    { tags: ['dot_stack'], reason: '専用武装Lv1で敵に「炎上」（継続物理ダメージ）を付与' },
  mcgregor: { tags: ['dot_amplify'], reason: '専用武装Lv1で敵に「激怒」を付与、継続ダメージを最大+100%（5スタック）増幅' },
  williams: { tags: ['enemy_energy_vuln'], reason: '専用武装Lv30の新バトルスキルで敵全体の被エネルギーダメージが4秒間+12%' },
  marshall: { tags: ['cd_reset_highest_atk'], reason: '専用武装Lv30でバトルスキルを3回発動するごとに、味方最高攻撃力ユニットのバトルスキルCDをリセット' },
};

function __heroDexEwComboJudge(providerId, providerName, tag) {
  switch (tag) {
    case 'dot_stack':
      return (other, otherDmgType) => {
        if (other.id === providerId) return null;
        const otherTags = (HERO_EW_PROVIDERS[other.id] || {}).tags || [];
        if (otherTags.includes('dot_amplify')) return null; // 増幅側は別条件で表示するのでここでは出さない
        if (otherTags.includes('dot_stack')) return `${providerName}と同時に継続ダメージ源を重ねられる（同編成のロケラン染めで層になる）`;
        return null;
      };
    case 'dot_amplify':
      return (other) => {
        const otherTags = (HERO_EW_PROVIDERS[other.id] || {}).tags || [];
        return otherTags.includes('dot_stack')
          ? `${providerName}の継続ダメージ増幅が${other.name}の継続ダメージに乗る（専用武装Lv1同士で機能）` : null;
      };
    case 'enemy_energy_vuln':
      return (other, otherDmgType) =>
        (otherDmgType === 'energy') ? `${providerName}の専用武装Lv30で敵の被エネルギーダメージが増えるので、${other.name}の火力が伸びる` : null;
    case 'cd_reset_highest_atk':
      return (other, otherDmgType, otherIsCore) =>
        otherIsCore ? `${providerName}の専用武装Lv30はバトルスキルCDリセット対象を味方最高攻撃力ユニットに向ける。${other.name}が最高攻撃力なら恩恵が大きい` : null;
    default:
      return null;
  }
}

function __heroDexEwCombo(id) {
  const hero = HERO_DB[id];
  if (!hero) return '';
  const matches = [];

  if (HERO_EW_PROVIDERS[id]) {
    const { tags } = HERO_EW_PROVIDERS[id];
    for (const otherId in HERO_DB) {
      if (otherId === id) continue;
      const other = HERO_DB[otherId];
      const otherWithId = Object.assign({ id: otherId }, other);
      const otherDmgType = __heroDexDamageType(otherId);
      const otherIsCore = !!(other.aiRole && other.aiRole.core);
      for (const tag of tags) {
        const judge = __heroDexEwComboJudge(id, hero.name, tag);
        if (!judge) continue;
        const why = judge(otherWithId, otherDmgType, otherIsCore);
        if (why) matches.push({ id: otherId, name: other.name, why });
      }
    }
  } else {
    const dmgType = __heroDexDamageType(id);
    const isCore = !!(hero.aiRole && hero.aiRole.core);
    const heroWithId = Object.assign({ id }, hero);
    for (const providerId in HERO_EW_PROVIDERS) {
      if (providerId === id) continue;
      const providerHero = HERO_DB[providerId];
      if (!providerHero) continue;
      const { tags } = HERO_EW_PROVIDERS[providerId];
      for (const tag of tags) {
        const judge = __heroDexEwComboJudge(providerId, providerHero.name, tag);
        if (!judge) continue;
        const why = judge(heroWithId, dmgType, isCore);
        if (why) matches.push({ id: providerId, name: providerHero.name, why });
      }
    }
  }

  const seen = new Map();
  matches.forEach(m => { if (!seen.has(m.id)) seen.set(m.id, m); });
  const unique = [...seen.values()].slice(0, 5);
  if (!unique.length) return '';

  const rows = unique.map(m => `
    <div class="dex-skillsyn-row">
      <span class="dex-skillsyn-name">${m.name}</span>
      <span class="dex-skillsyn-why">${m.why}</span>
    </div>
  `).join('');
  return `<div class="dex-detail-section">
    <div class="dex-detail-section-title">🔧 専用武装込みのコンボ</div>
    <div class="dex-skillsyn-list">${rows}</div>
    <div class="dex-skillkit-note">※ 専用武装のLv到達が前提の組み合わせです（本文中の必要Lvを参照）。ランキングや優先度の計算には使用していません。</div>
  </div>`;
}

function __heroDexReviewCompare(id) {
  const adv = (HERO_DB[id] && HERO_DB[id].advice);
  if (!adv) return '';
  const hasJp = !!adv.jpReview;
  const hasGlobal = !!adv.globalReview;
  if (!hasJp && !hasGlobal) return '';
  return `<div class="dex-detail-section">
    <div class="dex-detail-section-title">🗺️ コミュニティ評価の比較</div>
    <div class="dex-review-compare">
      <div class="dex-review-col">
        <div class="dex-review-col-label">🇯🇵 日本</div>
        <div class="dex-review-col-body">${hasJp ? adv.jpReview : '情報が見つかりませんでした。'}</div>
      </div>
      <div class="dex-review-col">
        <div class="dex-review-col-label">🌍 海外</div>
        <div class="dex-review-col-body">${hasGlobal ? adv.globalReview : '情報が見つかりませんでした。'}</div>
      </div>
    </div>
  </div>`;
}

function __heroDexWeaponLvTable(id) {
  const adv = (HERO_DB[id] && HERO_DB[id].advice);
  const lv = adv && adv.weaponLvNotes;
  if (!lv) return '';
  const rows = [
    { key: 'lv1', label: 'Lv1' },
    { key: 'lv10', label: 'Lv10' },
    { key: 'lv20', label: 'Lv20' },
    { key: 'lv30', label: 'Lv30' },
  ].filter(r => lv[r.key]).map(r => `
    <div class="dex-weaponlv-row">
      <div class="dex-weaponlv-badge">${r.label}</div>
      <div class="dex-weaponlv-text">${lv[r.key]}</div>
    </div>
  `).join('');
  if (!rows) return '';
  return `<div class="dex-detail-section"><div class="dex-detail-section-title">🔧 専用武装の効果（Lv帯別）</div><div class="dex-weaponlv-list">${rows}</div></div>`;
}

// ===== 通常スキル（通常攻撃／バトルスキル／パッシブ）表示 =====
// 特技（Super Sensing相当：★4解放でHP/ATK/DEF+20%・CD+10%）は全ヒーロー共通のため個別データ化せず、
// セクション末尾に一括注記する。
function __heroDexSkillKit(id) {
  const adv = (HERO_DB[id] && HERO_DB[id].advice);
  const kit = adv && adv.skills;
  if (!kit) return '';
  const rows = [
    { key: 'auto', label: '通常攻撃', badge: '#0891b2' },
    { key: 'battle', label: 'バトルスキル', badge: '#7c3aed' },
    { key: 'passive', label: 'パッシブ', badge: '#059669' },
  ].filter(r => kit[r.key] && kit[r.key].name).map(r => `
    <div class="dex-skillkit-row">
      <div class="dex-skillkit-head">
        <span class="dex-skillkit-badge" style="background:${r.badge};">${r.label}</span>
        <span class="dex-skillkit-name">${kit[r.key].name}</span>
      </div>
      <div class="dex-skillkit-effect">${kit[r.key].effect}</div>
    </div>
  `).join('');
  if (!rows) return '';
  // UR昇格前提のSSR英雄（メイソン/サラ/ヴェノム/ブラッツ/スカーレット/ヴィオラ）は
  // ★4特技が「特殊戦術」（HP/ATK/DEF+10%のみ、CD短縮なし）で、UR英雄の「超絶感知」とは別物。
  const SSR_PROMOTABLE = ['mason', 'sarah', 'venom', 'brats', 'scarlett', 'violet'];
  const expertiseNote = SSR_PROMOTABLE.includes(id)
    ? '※ 特技「特殊戦術」（★4解放、SSR形態）は全ヒーロー共通：HP・攻撃力・防御力+10%（UR昇格後は「超絶感知」に変化し、スキル再使用時間-10%が追加されます）'
    : '※ 特技「超絶感知」（★4解放）は全ヒーロー共通：HP・攻撃力・防御力+20%、スキル再使用時間-10%';
  return `<div class="dex-detail-section">
    <div class="dex-detail-section-title">🎯 通常スキル</div>
    <div class="dex-skillkit-list">${rows}</div>
    <div class="dex-skillkit-note">${expertiseNote}</div>
  </div>`;
}

function __heroDexSkillNote(id) {
  const adv = (HERO_DB[id] && HERO_DB[id].advice);
  if (!adv || !adv.skillNote) return '';
  return `<div class="dex-detail-section"><div class="dex-detail-section-title">⚔️ スキルの特徴</div><div class="dex-detail-section-body">${adv.skillNote}</div></div>`;
}

// ===== 評価スコアの可視化（HERO_DB[id].score を全ヒーロー相対のバーで表示） =====
// 各指標を21人全体でmin-max正規化し、「このヒーローが何に強いか」を視覚的に示す。
// スコアは内部評価用の乗数（0.4〜1.3程度）でそのままだと差がわかりにくいため、
// 相対順位ベースの棒の長さに変換する。新規リサーチ不要、既存HERO_DB[id].scoreのみ使用。
let __scoreChartRangesCache = null;
function __getScoreChartRanges() {
  if (__scoreChartRangesCache) return __scoreChartRangesCache;
  const fields = ['immediate', 'longterm', 'coverage', 'future'];
  const ranges = {};
  for (const f of fields) {
    const vals = Object.values(HERO_DB).map(h => h.score && h.score[f]).filter(v => typeof v === 'number');
    ranges[f] = { min: Math.min(...vals), max: Math.max(...vals) };
  }
  const spVals = Object.values(HERO_DB).map(h => h.score && h.score.skillPower && h.score.skillPower.lv30).filter(v => typeof v === 'number');
  const durVals = Object.values(HERO_DB).map(h => h.score && h.score.durability && h.score.durability.lv30).filter(v => typeof v === 'number');
  ranges.skillPower30 = { min: Math.min(...spVals), max: Math.max(...spVals) };
  ranges.durability30 = { min: Math.min(...durVals), max: Math.max(...durVals) };
  __scoreChartRangesCache = ranges;
  return ranges;
}
function __heroDexScoreChart(id) {
  const score = HERO_DB[id] && HERO_DB[id].score;
  if (!score) return '';
  const ranges = __getScoreChartRanges();
  const bars = [
    { label: '即戦力', key: 'immediate', val: score.immediate },
    { label: '長期価値', key: 'longterm', val: score.longterm },
    { label: 'スキル威力', key: 'skillPower30', val: score.skillPower && score.skillPower.lv30 },
    { label: '耐久', key: 'durability30', val: score.durability && score.durability.lv30 },
    { label: '汎用性', key: 'coverage', val: score.coverage },
    { label: '将来性', key: 'future', val: score.future },
  ].filter(b => typeof b.val === 'number');
  if (!bars.length) return '';
  const rows = bars.map(b => {
    const r = ranges[b.key];
    const pct = (r && r.max > r.min) ? Math.round(((b.val - r.min) / (r.max - r.min)) * 100) : 50;
    const clamped = Math.max(4, Math.min(100, pct));
    return `<div class="dex-score-row">
      <div class="dex-score-label">${b.label}</div>
      <div class="dex-progress-track"><div class="dex-progress-fill" style="width:${clamped}%;"></div></div>
    </div>`;
  }).join('');
  return `<div class="dex-detail-section">
    <div class="dex-detail-section-title">📊 評価スコア（全21人中の相対位置）</div>
    <div class="dex-score-chart">${rows}</div>
  </div>`;
}

function updateHeroDexModalHeader(id) {
  const wrap = $id('dex-modal-head-hero');
  const img = $id('dex-modal-head-hero-img');
  const nameEl = $id('dex-modal-head-hero-name');
  const catchEl = $id('dex-modal-head-hero-catch');
  const titleEl = $id('dex-modal-head-title');
  if (!wrap || !img || !nameEl || !titleEl) return;

  const h = HERO_DB[id] || null;
  if (!id || !h) {
    wrap.style.display = 'none';
    titleEl.style.display = 'block';
    return;
  }

  const adv = h.advice || {};
  img.src = `img/${id}.webp`;
  img.style.opacity = '1';
  img.className = `modal-head-hero-img ${h.type || ''}`;
  nameEl.textContent = h.name || id;
  catchEl.textContent = adv.catch || '';
  catchEl.style.display = adv.catch ? 'block' : 'none';

  wrap.style.display = 'flex';
  titleEl.style.display = 'none';
}

function openHeroDexDetail(id) {
  const h = HERO_DB[id] || {};
  const adv = (HERO_DB[id] && HERO_DB[id].advice) || {};
  const modal = $id('hero-dex-modal');
  if (!modal) return;

  updateHeroDexModalHeader(id);

  const typeNameLabel = {tank:'戦車', air:'航空', mis:'ロケラン'}[h.type] || '';
  const roleNameLabel = {atk:'火力', wall:'壁', sup:'サポート'}[h.role] || '';
  const typeLabel = (TYPE_ICON[h.type] ? uiIcon(TYPE_ICON[h.type], h.type) : '') + typeNameLabel;
  const roleLabel = (ROLE_ICON[h.role] ? uiIcon(ROLE_ICON[h.role], h.role) : '') + roleNameLabel;

  $id('hero-dex-modal-body').innerHTML = `
    <div class="dex-detail-head">
      <div class="dex-detail-icon"><img src="img/${id}.webp" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.opacity=0"></div>
      <div>
        <div class="dex-detail-name">${h.name || id}</div>
        <div class="dex-detail-tags">${typeLabel} ${roleLabel}${__heroDexTierBadge(id, true)}</div>
      </div>
    </div>
    ${(HERO_DB[id] && HERO_DB[id].meta) ? `<div class="dex-tier-note">Tier評価は性能ベースの評価軸です。スロット編集側の「優先度」（今のロスターでの育成コスパ）とは別の指標のため、数値が一致しない場合があります。</div>` : ''}
    ${adv.catch ? `<div class="dex-detail-catch">${adv.catch}</div>` : ''}
    ${__heroDexDynamicSummary(id)}
    ${__heroDexScoreChart(id)}
    ${__heroDexSkillNote(id)}
    ${__heroDexSkillKit(id)}
    ${__heroDexSkillSynergy(id)}
    ${__heroDexWeaponLvTable(id)}
    ${__heroDexEwCombo(id)}
    ${__heroDexReviewCompare(id)}
  `;
  modal.classList.add('open');
}

function closeHeroDexModal() {
  const modal = $id('hero-dex-modal');
  if (modal) modal.classList.remove('open');
}


function applyPreset(presetId, squadNum) {
  const s = squadNum || 1;
  const sLabel = s+'軍';
  const preset = FORMATION_PRESETS.find(p => p.id === presetId);
  if (!preset) return;
  if (!confirm('「'+preset.name+'」を'+sLabel+'に反映しますか？\nキャラ配置のみ変更し、現在のEW Lvはそのまま維持されます。')) return;

  // ステップ1: テンプレートに含まれるキャラのEW Lvを事前に収集
  // 他軍・控えから同キャラを見つけてEWを引き継ぐ
  const presetIds = new Set(preset.squad.map(m => m.id));
  const wpMap = {}; // heroId → 現在のEW Lv

  for (let os = 1; os <= 3; os++) {
    for (let pp = 1; pp <= 5; pp++) {
      const id = (document.getElementById('h-'+os+'-'+pp)||{}).value;
      const wp = parseInt((document.getElementById('w-'+os+'-'+pp)||{}).value)||0;
      if (id && presetIds.has(id) && !(id in wpMap)) wpMap[id] = wp;
    }
  }
  for (let pp = 1; pp <= 10; pp++) {
    const id = (document.getElementById('h-4-'+pp)||{}).value;
    const wp = parseInt((document.getElementById('w-4-'+pp)||{}).value)||0;
    if (id && presetIds.has(id) && !(id in wpMap)) wpMap[id] = wp;
  }

  // ステップ2: 他軍のスロットから重複するキャラを空にする（移動扱い）
  for (let os = 1; os <= 3; os++) {
    if (os === s) continue; // 反映先の軍はスキップ
    for (let pp = 1; pp <= 5; pp++) {
      const hEl = document.getElementById('h-'+os+'-'+pp);
      if (hEl && presetIds.has(hEl.value)) {
        hEl.value = 'empty';
        const wEl = document.getElementById('w-'+os+'-'+pp);
        if (wEl) wEl.value = 0;
      }
    }
  }
  // 控えからも除去
  for (let pp = 1; pp <= 10; pp++) {
    const hEl = document.getElementById('h-4-'+pp);
    if (hEl && presetIds.has(hEl.value)) {
      hEl.value = 'empty';
      const wEl = document.getElementById('w-4-'+pp);
      if (wEl) wEl.value = 0;
    }
  }

  // ステップ3: テンプレートを反映先の軍に配置
  preset.squad.forEach((m, i) => {
    const p = i + 1;
    const hEl = document.getElementById('h-'+s+'-'+p);
    const wEl = document.getElementById('w-'+s+'-'+p);
    if (!hEl) return;
    hEl.value = m.id;
    if (wEl) wEl.value = wpMap[m.id] !== undefined ? wpMap[m.id] : 0;
  });

  // ステップ4: 全軍を更新してランキング再計算
  try { for(let sq=1;sq<=3;sq++) updateSquad(sq); } catch(e) {}
  try { renderSlots(); } catch(e) {}
  try { updateAllSquads(); } catch(e) {}
  try { scheduleAi(); } catch(e) {}
  try { saveAllData(); } catch(e) {}
  try { renderPresetPanel(); } catch(e) {}
  showToast('✅ 「'+preset.name+'」を'+sLabel+'に反映（他軍の重複は移動）');
}

function initSquadHTML() {
    let html = '';
    let opts = '<option value="empty">未設定</option>';
    let grps = { tank: '<optgroup label="戦車">', air: '<optgroup label="航空">', mis: '<optgroup label="ロケラン">' };
    for(let k in HERO_DB) {
        grps[HERO_DB[k].type] += `<option value="${k}">${HERO_DB[k].name}${HERO_DB[k].ur?"(UR)":""}</option>`;
    }
    opts += grps.tank + '</optgroup>' + grps.air + '</optgroup>' + grps.mis + '</optgroup>';

    for(let s=1; s<=4; s++) {
        let isB = s===4;
        html += `<div class="squad-section"><div class="squad-header" onclick="toggleSquad(${s}, this)"><span>${isB?'控え室':'第'+s+'部隊'}</span><span>▶</span></div><div class="squad-body ${s===1?'open':''}" id="sq-body-${s}">`;
        
        if(!isB) { html += `<div id="adv-${s}" class="advice"></div>`; }
        
        html += `<div class="squad-grid">`;
        let slots = [];
        for(let p=1; p<=(isB?10:5); p++) {
            slots.push(`
            <div class="interactive-card" id="card-${s}-${p}">
                <div class="prio-badge" id="prio-${s}-${p}"></div>
                <div class="hero-portrait" id="img-${s}-${p}" style="display:none;"></div>
                <div class="card-icon-wrap">
                    <div class="icon-box" id="f-${s}-${p}" style="display:none;"></div>
                    <div class="icon-box" id="r-${s}-${p}" style="display:none;"></div>
                </div>
                <select class="card-select" id="h-${s}-${p}" onchange="updateSquad(${s})">${opts}</select>
                <div class="card-stepper" id="wp-box-${s}-${p}">
                    <button onclick="stepWp(${s},${p},-1)">-</button>
                    <input id="w-${s}-${p}" value="0" readonly>
                    <button onclick="stepWp(${s},${p},1)">+</button>
                </div>
                <div id="syn-${s}-${p}" class="shard-info"></div>
            </div>`);
        }
        
        if(isB) {
            html += `<div class="v-row bench">${slots.join('')}</div>`;
        } else {
            html += `<div class="v-row">${slots[0]}${slots[1]}</div><div class="v-row">${slots[2]}${slots[3]}${slots[4]}</div>`;
        }
        html += `</div></div></div>`;
    }
    $id('squad-container').innerHTML = html;
}

function toggleSquad(s, header) { let b = $id(`sq-body-${s}`); b.classList.toggle('open'); header.children[1].innerText = b.classList.contains('open') ? '▼' : '▶'; }
function stepWp(s, p, d) { let el = $id(`w-${s}-${p}`); if(el.value.includes("未"))return; el.value = Math.min(Math.max((parseInt(el.value)||0)+d, 0), 30); updateSquad(s); }
function updateAllSquads() { for(let i=1; i<=4; i++) updateSquad(i); try{ updateSlotEvalsFromCurrentInputs(); }catch(e){} try{ updateTransitionRecommendationUI(); }catch(e){} }

function lockDuplicateHeroes(s) {
    let selects = Array.from(document.querySelectorAll(`#sq-body-${s} .card-select`));
    let vals = selects.map(el => el.value).filter(v => v !== 'empty');
    selects.forEach(sel => {
        let prev = sel.getAttribute('data-prev') || 'empty';
        if (sel.value !== 'empty' && vals.filter(v => v === sel.value).length > 1) {
            showToast("⚠️ 同じ部隊内でキャラが重複しています");
            sel.value = prev; vals = selects.map(el => el.value).filter(v => v !== 'empty');
        } else { sel.setAttribute('data-prev', sel.value); }
        Array.from(sel.options).forEach(opt => {
            let isDup = opt.value !== 'empty' && vals.includes(opt.value) && opt.value !== sel.value;
            opt.disabled = isDup;
            if (isDup) { if (!opt.text.includes('済')) opt.text = opt.text + " (済)"; opt.style.color = "rgba(255,255,255,0.3)"; } 
            else { opt.text = opt.text.replace(" (済)", ""); opt.style.color = "#fff"; }
        });
    });
}

function updateSquad(s) {
    lockDuplicateHeroes(s);
    let actPool = []; let counts = {tank:0, air:0, mis:0, none:0};
    
    for(let p=1; p<=(s===4?10:5); p++) {
        let hid = $id(`h-${s}-${p}`).value, wpEl = $id(`w-${s}-${p}`);
        let h = HERO_DB[hid] || {}, v = parseInt(wpEl.value) || 0;
        let card = $id(`card-${s}-${p}`), fIcon = $id(`f-${s}-${p}`), rIcon = $id(`r-${s}-${p}`), imgEl = $id(`img-${s}-${p}`);
        card.className = 'interactive-card'; $id(`prio-${s}-${p}`).style.display = 'none';
        
        if(h.ur || hid === 'empty') { $id(`wp-box-${s}-${p}`).style.opacity = '0.3'; wpEl.value = h.ur ? "未実装" : "-"; v = 0; } 
        else { $id(`wp-box-${s}-${p}`).style.opacity = '1'; wpEl.value = v; }
        
        if (hid === 'empty') { 
            card.classList.add('card-empty'); counts.none++; card.style.backgroundImage = 'none'; if(imgEl){ imgEl.style.display = 'none'; imgEl.style.backgroundImage = 'none'; } fIcon.style.display = 'none'; rIcon.style.display = 'none'; $id(`syn-${s}-${p}`).innerHTML = '';
        } else {
            card.classList.add('card-'+(h.ur?'ur':h.type));
            card.style.backgroundImage = 'none';
            if(imgEl){ imgEl.style.display = 'block'; imgEl.style.backgroundImage = `url(${getHeroImagePath(hid)})`; }
            
            // 💡 兵種/役割アイコン（埋め込みSVG）
            fIcon.innerHTML = uiIcon(TYPE_ICON[h.type] || TYPE_ICON.tank, h.type || 'type');
            rIcon.innerHTML = uiIcon(ROLE_ICON[h.role] || ROLE_ICON.sup, h.role || 'role');
            
            if (v >= 30) {
                $id(`syn-${s}-${p}`).innerHTML = `<div class="awaken-badge">👑 覚醒</div>`;
            } else if (v === 0 && !h.ur) {
                $id(`syn-${s}-${p}`).innerHTML = `<span class="shard-info" style="color:#475569; font-size:var(--fs-md);">未解放</span>`;
                actPool.push({ p:p, h:h, wp:v });
            } else if (v > 0) { 
                let ms = getNextMilestone(v);
                let iconHtml = `<img src="${SHARD_ICON_SRC}" class="shard-icon">`;
                $id(`syn-${s}-${p}`).innerHTML = ms ? `<div class="shard-info"><span style="font-size:var(--fs-xs); margin-right:1px;">Lv${ms.target}迄</span>${iconHtml}<span style="font-size:var(--fs-xl);">${ms.cost}</span></div>` : ''; 
                actPool.push({ p:p, h:h, wp:v }); 
            }
        }
    }
    
    // 💡 優先度バッジ（①②③）ロジックの完全復元
    if(s !== 4 && actPool.length > 0) { 
        let squadAtks = actPool.filter(m => m.h.role === 'atk').sort((a,b)=>b.h.priority - a.h.priority);
        let squadWalls = actPool.filter(m => m.h.role === 'wall').sort((a,b)=>b.h.priority - a.h.priority);
        
        actPool.forEach(m => {
            let score = 0;
            let isMainAtk = squadAtks[0] === m;
            let isMainWall = squadWalls[0] === m;
            let isSubWall = squadWalls.length > 1 && squadWalls.includes(m) && !isMainWall;
            let isSubAtk = squadAtks.length > 1 && squadAtks.includes(m) && !isMainAtk;
            let isSup = m.h.role === 'sup';
            
            if (isMainAtk && m.wp < 20) score = 10000 + m.h.priority;
            else if (isMainWall && m.wp < 10) score = 9000 + m.h.priority;
            else if (m.wp < 10) score = 8000 + m.h.priority;
            else if (isMainWall && m.wp < 20) score = 7000 + m.h.priority;
            else if (isSubAtk && m.wp < 20) score = 6000 + m.h.priority;
            else if (isSup && m.wp < 20) score = 5000 + m.h.priority;
            else if (isMainAtk && m.wp < 30) score = 4000 + m.h.priority;
            else if (isSubWall && m.wp < 20) score = 3000 + m.h.priority;
            else score = m.h.priority;
            
            m.dynamicPr = score;
        });

        actPool.sort((a,b) => b.dynamicPr - a.dynamicPr);
        actPool.forEach((m,i)=>{ 
            if(i<3){ 
                let el=$id(`prio-${s}-${m.p}`); 
                el.innerHTML=["①","②","③"][i]; 
                el.className=`prio-badge prio-${i+1}`; 
                el.style.display='flex'; 
            }
        }); 
    }
    
    if(s!==4) analyzeSquad(s, counts);
    // 💡 リアルタイム更新
    scheduleAi();
}

function analyzeSquad(s, c) {
    let div = $id(`adv-${s}`); 
    let max = Math.max(c.tank, c.air, c.mis);
    
    if(max === 0) { 
        div.style.display = 'block'; 
        div.className = "advice adv-ng"; 
        div.innerHTML = `⚠️ <b>編成未完了：</b> 5人配置してバフを発動させましょう。`;
        return; 
    }
    
    div.style.display = 'block';
    let status = max === 5 ? 'perfect' : (max === 4 || max === 3) ? 'ok' : 'ng';
    
    let msg = max === 5 ? `✅ <b>5体統一編成：</b> 全員同兵種で兵種バフ+20%がフル適用されています。` 
            : max === 4 ? `🔶 <b>4体+1体編成：</b> 主力4体に兵種バフ+15%が適用されています。` 
            : max === 3 ? (c.none === 2
                ? `⚠️ <b>3体編成：</b> 同兵種が3体のみで兵種バフは+5%にとどまっています。`
                : `⚠️ <b>混成3体編成：</b> 主力3体に兵種バフ+10%が適用されています。`) 
            : `❌ <b>兵種バラバラ：</b> 同兵種が3体未満のため兵種バフが発生していません。`;
    
    if(max < 5 && max > 0 && c.none === 0) {
        // S6覚醒混成チェック：覚醒済みキム+DVAの4+1型は例外的に許容
        const squadIds = [];
        for(let p=1;p<=5;p++){
            const el=$id(`h-${s}-${p}`);
            if(el && el.value && el.value!=='empty') squadIds.push(el.value);
        }
        const kimAw = (typeof loadAwTier!=='undefined') ? parseAwTier(loadAwTier('kimberly')) : {star:-1};
        const dvaAw = (typeof loadAwTier!=='undefined') ? parseAwTier(loadAwTier('dva'))       : {star:-1};
        const kimAwakened = squadIds.includes('kimberly') && kimAw.star >= 0;
        const dvaAwakened = squadIds.includes('dva')       && dvaAw.star >= 0;

        if (kimAwakened && dvaAwakened) {
            msg += `<br><span style="display:inline-block;margin-top:6px;font-size:var(--fs-sm);color:#92400e;background:#fffbeb;padding:6px 8px;border-radius:6px;border:1px solid #fde68a;line-height:1.4;">👑 <b>S6覚醒混成：</b> 覚醒キム(戦車)+覚醒DVA(航空)の4+1型は海外ガチ勢推奨の強力構成です。通常の出張ペナルティより実戦スコアは高めです。</span>`;
        } else {
            msg += `<br><span style="display:inline-block;margin-top:6px;font-size:var(--fs-sm);color:#b91c1c;background:#fef2f2;padding:6px 8px;border-radius:6px;border:1px solid #fecaca;line-height:1.4;">⚠️ <b>別兵種キャラあり：</b> 他兵種のキャラはスキルチップの恩恵を受けられず、実力を発揮しにくくなります。</span>`;
        }
    }
    div.className = "advice adv-" + status; div.innerHTML = msg;
}

function combinations(arr, k) {
    let results = [];
    let backtrack = (start, combo) => {
        if(combo.length === k) { results.push([...combo]); return; }
        for(let i=start; i<arr.length; i++) {
            combo.push(arr[i]); backtrack(i+1, combo); combo.pop();
        }
    };
    backtrack(0, []);
    return results;
}


function getCombatBasePts(member){
    if(!member) return 0;
    let pts = wpToPts(member.wp);
    if(member.ur){
        const profile = __aiGetProfile(member.id);
        const evalMeta = __aiGetEvalMeta(member.id);
        let penalty = 20;
        if(profile.promotedUr){
            penalty = 14;
            if((evalMeta.promotedUrImmediateFit || 1) >= 1.08) penalty = 12;
        }
        pts -= penalty;
    }
    // 覚醒ボーナスを戦力スコアに反映
    // ※育成効率シミュレーション時（member.simulating===true）は
    //   覚醒前提未達の英雄にボーナスを乗せない
    if (typeof AWAKENING_HEROES !== 'undefined' && (AWAKENING_HEROES[member.id]||{}).milestones) {
        const awTierStr = loadAwTier(member.id);
        const awObj = (typeof parseAwTier !== 'undefined') ? parseAwTier(awTierStr) : {star:-1,tier:0};
        // 覚醒済みの場合のみボーナスを適用
        // シミュレーション中（simulating）かつ未覚醒の場合はスキップ
        const isAwakened = awObj.star >= 0;
        // シミュレーション中（育成効率計算）かつ未覚醒の場合はボーナスをスキップ
        // → 覚醒前提未達英雄が過大評価されるのを防ぐ
        const skipBonus = member.simulating && !isAwakened;
        if (isAwakened && !skipBonus) {
            let bonus = getAwakeningScoreBonus(member.id, awTierStr);
            // テスラ：誘導電流のスタック上限は味方ロケラン英雄数×3
            if (member.id === 'tesla' && awObj.star >= 1) {
                const misCount = member.squadMisCount || 1;
                const stackMult = misCount >= 3 ? 1.08 : misCount >= 2 ? 1.04 : 1.0;
                bonus *= stackMult;
            }
            pts = Math.round(pts * bonus);
        }
    }
    return Math.max(0, pts);
}

function evaluateSquadRealCombat(squadMembers) {
    if(squadMembers.length === 0) return {
        score: 0, maxCount: 0, buffRate: 0, mainType: null,
        attack: 0, defense: 0, totalPts: 0, buffedTotalPts: 0
    };

    // テスラ覚醒のスタック上限計算用にロケラン英雄数を付与
    const misCount = squadMembers.filter(m => m.t === 'mis').length;
    squadMembers.forEach(m => {
        m.squadMisCount = misCount;
        m.basePts = getCombatBasePts(m);
    });

    const buffInfo = getArmyBuffInfo(squadMembers);
    const mainType = buffInfo.mainType;
    const maxCount = buffInfo.maxCount;
    const buffRate = buffInfo.buffRate;

    let adjustedTotal = 0;
    let attackScore = 0;
    let defenseScore = 0;

    const roleCounts = { atk:0, wall:0, sup:0 };
    squadMembers.forEach(m => { if(roleCounts[m.r] !== undefined) roleCounts[m.r]++; });

    let compMult = 1.0;
    if(roleCounts.wall >= 2) {
        if(roleCounts.wall === 2)       compMult *= 1.05;
        else if(roleCounts.wall === 3)  compMult *= 0.95;
        else                            compMult *= 0.88; // 4体以上は過剰
    } else if(roleCounts.wall === 1) {
        compMult *= 0.92;
    } else {
        compMult *= 0.85;
    }
    // atk==0ペナルティ：wall>=3の場合は既にペナルティ済みなので適用しない
    if(roleCounts.atk === 0 && roleCounts.wall < 3) compMult *= 0.80;
    if(roleCounts.sup >= 2) compMult *= 0.97;

    squadMembers.forEach(m => {
        const isMainType = m.t === mainType;
        const buffedBase = isMainType ? (m.basePts * (1 + buffRate)) : m.basePts;

        let charScore = buffedBase;
        if (!isMainType) {
            let penalty = 0;
            if (m.r === 'atk') penalty = charScore * 0.40;
            else if (m.r === 'wall') penalty = m.wp >= 20 ? charScore * 0.15 : charScore * 0.30;
            else penalty = charScore * 0.25;
            // 4+1混成（他兵種を1人だけ混ぜる）の評価補正：
            // wall役は個別の耐久力（durability、武装Lvに応じて線形補間）、atk/sup役はスキルの質
            // （skillPower、同様に武装Lvで補間）で混成ペナルティを緩和する。例：航空編成に
            // マーフィ(戦車wall)を混ぜた場合、5体ボーナスは失うが、マーフィの武装Lvが上がるほど
            // （特にLv20のMitigation解放以降）ペナルティが和らぐ。ウィリアムズのように素の耐久が
            // 高いヒーローはLv0でも一定の緩和がかかる。
            const qualityStat = (m.r === 'wall')
                ? __aiGetDurability(m.id, m.wp)
                : __aiGetSkillPower(m.id, m.wp);
            const mitigation = Math.max(0, Math.min(0.45, ((qualityStat || 1.0) - 1.0) * 3));
            penalty *= (1 - mitigation);
            charScore -= penalty;
        } else {
            charScore += charScore * 0.10;
        }

        let finalCharScore = Math.max(0, charScore);
        adjustedTotal += finalCharScore;

        if (m.r === 'atk') attackScore += finalCharScore;
        else if (m.r === 'wall') defenseScore += finalCharScore;
        else { attackScore += finalCharScore * 0.5; defenseScore += finalCharScore * 0.5; }
    });

    let currentMeta = ($id('current-meta')||{}).value || '';
    // 育成方針の一貫性ボーナス：ユーザーが選択した「現在のメタ（注力兵種）」と実際の編成の
    // 主力兵種が一致しているかのタイブレーカー。三すくみのダメージ補正（ゲーム内では20%）の
    // 代用ではない——そちらは別途 TYPE_COUNTER_WEIGHT（補強候補ランキング用）で扱っている。
    // ここはあくまで「方針通りに育成が進んでいるか」を軽く優先するための+7%。
    let metaMult = (mainType === currentMeta) ? 1.07 : 1.0;

    // S6覚醒混成ボーナス
    // 覚醒済みキム(tank)+DVA(air)が同じ編成にいる場合、4+1混成を正当評価
    let awakeningMixBonus = 1.0;
    if (typeof AWAKENING_HEROES !== 'undefined' && typeof loadAwTier !== 'undefined') {
        const ids = squadMembers.map(m => m.id);
        const kimAw  = parseAwTier(loadAwTier('kimberly'));
        const dvaAw  = parseAwTier(loadAwTier('dva'));
        const hasKim = ids.includes('kimberly') && kimAw.star >= 0;
        const hasDva = ids.includes('dva')       && dvaAw.star >= 0;
        if (hasKim && hasDva) {
            // キム+DVA両方覚醒済み → 混成ペナルティ緩和
            // DVAのEW Lv依存：低Lvでは出張ペナルティが大きく混成ボーナスが薄い
            const dvaMember = squadMembers.find(m => m.id === 'dva');
            const dvaWp = dvaMember ? (dvaMember.wp || 0) : 0;
            const dvaWpMult = dvaWp >= 20 ? 1.06 : dvaWp >= 10 ? 1.02 : 1.0; // 下限1.0（DVA未育成でペナルティにしない）
            // 航空機英雄数でDVAのスタック効率が変わる
            const airCount = squadMembers.filter(m => m.t === 'air').length;
            const dvaAirMult = airCount >= 2 ? 1.04 : 1.0;
            // DVA覚醒★が高いほど恩恵大
            const dvaStarMult = dvaAw.star >= 2 ? 1.02 : 1.0;
            awakeningMixBonus = dvaWpMult * dvaAirMult * dvaStarMult;
        } else if (hasKim && kimAw.star >= 1) {
            // キム単独覚醒★1以上
            awakeningMixBonus = 1.04;
        }
    }

    const totalPts = Math.round(squadMembers.reduce((s,m)=>s + m.basePts, 0));
    const buffedTotalPts = Math.round(squadMembers.reduce((s,m)=>s + (m.t === mainType ? m.basePts * (1 + buffRate) : m.basePts), 0));

    return {
        score: Math.round(adjustedTotal * metaMult * compMult * awakeningMixBonus),
        maxCount: maxCount,
        buffRate: buffRate,
        mainType: mainType,
        attack: Math.round(attackScore * metaMult * compMult * awakeningMixBonus),
        defense: Math.round(defenseScore * metaMult * compMult * awakeningMixBonus),
        totalPts: totalPts,
        buffedTotalPts: buffedTotalPts
    };
}



function getMemberBasePts(member){
    return getCombatBasePts(member);
}

function calcMultiArmyTotalScore(assignment){
    if(!assignment) return 0;

    const army1 = evaluateSquadRealCombat(assignment.army1 || []).score;
    const army2 = evaluateSquadRealCombat(assignment.army2 || []).score;
    const army3 = evaluateSquadRealCombat(assignment.army3 || []).score;

    const bench = (assignment.bench || []).reduce((s, m) => s + getMemberBasePts(m), 0);
    const benchScore = Math.round(bench * 0.25);

    return (
        Math.round(army1 * 1.00) +
        Math.round(army2 * 0.90) +
        Math.round(army3 * 0.85) +
        benchScore
    );
}

// 残りメンバーの兵種分布から「後続の軍がどれだけ兵種統一しやすいか」を簡易スコア化する。
// 各兵種の人数を5で割った余りが0に近いほど（5人/10人ぴったり）綺麗に分割できるため高評価、
// 余りが4等の「あと1人で5体ボーナスを取れたのに惜しい」状態は低評価にする。
// 1軍選定時にこれを加味することで、1軍単体スコアは僅かに劣っても全体最適に近い組み合わせを
// 選べるようにする（純粋な貪欲法が陥る局所最適を緩和するヒューリスティック）。
function __estimateRemainderFlexibility(remainingMembers, squadSize) {
    const counts = { tank: 0, air: 0, mis: 0 };
    remainingMembers.forEach(m => { if (counts[m.t] !== undefined) counts[m.t]++; });
    let score = 0;
    for (const t in counts) {
        const n = counts[t];
        if (n === 0) continue;
        const fullGroups = Math.floor(n / squadSize);
        const remainder = n % squadSize;
        // ぴったり割れる人数が多いほど高評価、余りが多い（特にsquadSize-1）ほど低評価
        score += fullGroups * squadSize * 1.0;
        if (remainder > 0) {
            // 余りがsquadSize-1（あと1人で割り切れた）に近いほどペナルティを大きく
            score -= remainder * (remainder / squadSize) * 0.8;
        }
    }
    return score;
}

function optimizeMultiArmy(members, squadSize) {
    let pool = members;
    let combos1 = combinations(pool, squadSize);
    let best1 = null, best1Score = -1, maxC1 = 0, b1Details = {attack:0, defense:0};

    // 1軍候補のスコアに「残りメンバーの兵種統一しやすさ」ボーナスを加味して比較する。
    // 加重は控えめにし、1軍単体のスコア差が大きい場合は素直にそちらを優先する
    // （あくまで僅差・同等のケースで全体最適側に倒すための補正）。
    // 重みの検証：weight=5〜80の範囲で全探索と同じ最適解に到達することを実データで確認済み。
    // 安全マージンを持たせてweight=20を採用（極端な値による誤判定を避けつつ十分な補正力を持つ）。
    const FLEXIBILITY_WEIGHT = 20;
    combos1.forEach(combo => {
        let res = evaluateSquadRealCombat(combo);
        const remaining = pool.filter(m => !combo.some(c => c.id === m.id));
        const flexBonus = __estimateRemainderFlexibility(remaining, squadSize) * FLEXIBILITY_WEIGHT;
        const adjustedScore = res.score + flexBonus;
        if(adjustedScore > best1Score) {
            best1Score = adjustedScore;
            best1 = combo;
            maxC1 = res.maxCount;
            b1Details = {attack: res.attack, defense: res.defense};
        }
    });
    // best1Score は比較用に補正済みのため、表示・後続計算用には実際の素点を再計算する
    best1Score = evaluateSquadRealCombat(best1).score;

    let rem1 = pool.filter(m => !best1.some(b => b.id === m.id));

    let best2 = [], best2Score = 0, maxC2 = 0, b2Details = {attack:0, defense:0};
    if(rem1.length >= squadSize) {
        let combos2 = combinations(rem1, squadSize);
        combos2.forEach(combo => {
            let res = evaluateSquadRealCombat(combo);
            const remaining2 = rem1.filter(m => !combo.some(c => c.id === m.id));
            const flexBonus2 = __estimateRemainderFlexibility(remaining2, squadSize) * FLEXIBILITY_WEIGHT;
            const adjustedScore2 = res.score + flexBonus2;
            if(adjustedScore2 > best2Score) {
                best2Score = adjustedScore2;
                best2 = combo;
                maxC2 = res.maxCount;
                b2Details = {attack: res.attack, defense: res.defense};
            }
        });
        // 比較用に補正済みのため、表示・後続計算用には実際の素点を再計算する
        best2Score = evaluateSquadRealCombat(best2).score;
    } else { 
        let res = evaluateSquadRealCombat(rem1);
        best2 = rem1; 
        best2Score = res.score; 
        maxC2 = res.maxCount;
        b2Details = {attack: res.attack, defense: res.defense}; 
    }

    let rem2 = rem1.filter(m => !best2.some(b => b.id === m.id));

    let best3 = [], best3Score = 0, maxC3 = 0, b3Details = {attack:0, defense:0};
    if(rem2.length >= squadSize) {
        let combos3 = combinations(rem2, squadSize);
        combos3.forEach(combo => {
            let res = evaluateSquadRealCombat(combo);
            const remaining3 = rem2.filter(m => !combo.some(c => c.id === m.id));
            const flexBonus3 = __estimateRemainderFlexibility(remaining3, squadSize) * FLEXIBILITY_WEIGHT;
            const adjustedScore3 = res.score + flexBonus3;
            if(adjustedScore3 > best3Score) {
                best3Score = adjustedScore3;
                best3 = combo;
                maxC3 = res.maxCount;
                b3Details = {attack: res.attack, defense: res.defense};
            }
        });
        // 比較用に補正済みのため、表示・後続計算用には実際の素点を再計算する
        best3Score = evaluateSquadRealCombat(best3).score;
    } else { 
        let res = evaluateSquadRealCombat(rem2);
        best3 = rem2; 
        best3Score = res.score; 
        maxC3 = res.maxCount;
        b3Details = {attack: res.attack, defense: res.defense}; 
    }

    let bench = rem2.filter(m => !best3.some(b => b.id === m.id));
    // 3軍までの総合力を重視（同盟/総合寄り）
    // 以前の「1軍偏重」(army2:0.75 / army3:0.5) を緩和し、2〜3軍の価値を引き上げる
    let benchScore = Math.round(bench.reduce((s, m) => s + m.basePts, 0) * 0.25);

    let wScores = {
        army1: best1Score,
        army2: Math.round(best2Score * 0.90),
        army3: Math.round(best3Score * 0.85),
        bench: benchScore
    };
    
    return {
        assignment: { army1: best1, army2: best2, army3: best3, bench: bench },
        weightedScores: wScores,
        rawScores: { army1: best1Score, army2: best2Score, army3: best3Score, bench: benchScore },
        totalScore: calcMultiArmyTotalScore({ army1: best1, army2: best2, army3: best3, bench: bench }),
        maxCounts: { army1: maxC1, army2: maxC2, army3: maxC3 },
        armyDetails: { army1: b1Details, army2: b2Details, army3: b3Details }
    };
}

function growthBadge(g){
    if(!g || !g.label) g = { level: 1, axis: 'bal', label: 'バランス', strong:false };
    let axis = g.axis || 'bal';
    const strong = !!g.strong;
    const label = g.label || '';

    // ラベル→色クラス（5色体系）
    // atk=オレンジ(火力), wall=青(防御), bal=グレー(安定),
    // green=緑(即効・コスパ), purple=紫(将来・覚醒)
    const labelColorMap = {
        '火力補強':   'atk',   '主力強化':  'atk',   '不利属性の対策':  'atk',
        '防御補強':   'wall',  '耐久補強':  'wall',  '編成強化':  'wall',
        'バランス良く強化': 'bal', '今の編成で活躍':'bal', '主力編成の強化':'bal',
        '即戦力UP':   'green', 'コスパ◎':  'green',
        '低コストで戦力UP': 'green', '主力に成長': 'atk',
        '火力が大幅UP': 'atk strong', '耐久が大幅UP': 'wall strong', '支援力が大幅UP': 'bal strong',
        '耐久アップ': 'wall', '支援力アップ': 'bal',
        '長期投資向き': 'purple',
        '無理なく強化': 'bal',
        '👑 覚醒':   'purple strong',
        '🟢 短期で着手': 'green',
        '🔵 中期目標':   'wall',
        '🟣 長期投資':   'purple strong',
    };

    if(label === '火力補強') axis = 'atk';
    else if(label === '防御補強' || label === '耐久補強') axis = 'wall';

    let cls = labelColorMap[label] || (
        axis === 'atk'  ? ('atk'  + (strong ? ' strong' : '')) :
        axis === 'wall' ? ('wall' + (strong ? ' strong' : '')) : 'bal'
    );

    const icoCls = (axis === 'atk') ? 'atk' : (axis === 'wall') ? 'wall' : 'bal';
    return `<span class="impact-badge ${cls}"><span class="impact-ico ${icoCls}"></span>${label}</span>`;
}



function __aiReasonLabel(code){
  const dict = (typeof REASON_LABELS === 'object' && REASON_LABELS) ? REASON_LABELS : null;
  if(!dict || !code) return '';
  for(const groupKey of Object.keys(dict)){
    const group = dict[groupKey] || {};
    if(group && Object.prototype.hasOwnProperty.call(group, code)) return group[code];
  }
  return '';
}
function __aiReasonStyle(code){
  const dict = (typeof REASON_BADGE_STYLE === 'object' && REASON_BADGE_STYLE) ? REASON_BADGE_STYLE : null;
  return (dict && dict[code]) ? dict[code] : 'neutral';
}
function reasonCodeBadge(code){
  const label = __aiReasonLabel(code) || code || '';
  const style = __aiReasonStyle(code);
  return `<span class="reason-badge reason-badge--${style}">${label}</span>`;
}
function __aiReasonPriorityGroups(){
  const arr = (typeof REASON_BADGE_PRIORITY !== 'undefined' && Array.isArray(REASON_BADGE_PRIORITY)) ? REASON_BADGE_PRIORITY : ['policy','role','efficiency','timing'];
  return arr;
}
function __aiReasonGroupOf(code){
  const dict = (typeof REASON_LABELS === 'object' && REASON_LABELS) ? REASON_LABELS : null;
  if(!dict || !code) return '';
  for(const groupKey of Object.keys(dict)){
    const group = dict[groupKey] || {};
    if(group && Object.prototype.hasOwnProperty.call(group, code)) return groupKey;
  }
  return '';
}
function __aiTypedPolicyCode(baseCode, heroType){
  if(baseCode === 'seed'){
    if(heroType === 'air') return 'seed_air';
    if(heroType === 'mis') return 'seed_mis';
  }
  if(baseCode === 'shift'){
    if(heroType === 'air') return 'shift_air';
    if(heroType === 'mis') return 'shift_mis';
  }
  return baseCode;
}
function __aiSelectReasonCodes(codes, limit=2){
  const uniq = [];
  (codes || []).forEach(code => { if(code && !uniq.includes(code)) uniq.push(code); });
  if(!uniq.length) return [];

  const policyCodes = ['build_main','hold','seed_air','seed_mis','seed','shift_air','shift_mis','shift','full_shift'];
  const policyPriority = ['seed_air','seed_mis','shift_air','shift_mis','full_shift','shift','build_main','hold','seed'];
  const costCodes = ['lv30','high_cost','low_cost','mid_cost'];
  const timingCodes = ['future','immediate','promoted_ur'];

  const bestPolicyCode = policyPriority.find(code => uniq.includes(code)) || uniq.find(code => policyCodes.includes(code)) || '';
  const bestCostCode = costCodes.find(code => uniq.includes(code)) || '';
  const bestTimingCode = timingCodes.find(code => uniq.includes(code)) || '';

  const normalized = uniq.filter(code => !policyCodes.includes(code) && !costCodes.includes(code) && !timingCodes.includes(code));
  if(bestPolicyCode) normalized.unshift(bestPolicyCode);

  // policy がある場合は、汎用的すぎる mid_cost を優先しすぎない。
  if(bestCostCode && !(bestPolicyCode && bestCostCode === 'mid_cost' && bestTimingCode)) normalized.push(bestCostCode);
  if(bestTimingCode) normalized.push(bestTimingCode);

  const groups = __aiReasonPriorityGroups();
  const picked = [];
  groups.forEach(groupKey => {
    const found = normalized.find(code => __aiReasonGroupOf(code) === groupKey);
    if(found && !picked.includes(found) && picked.length < limit) picked.push(found);
  });
  normalized.forEach(code => { if(!picked.includes(code) && picked.length < limit) picked.push(code); });
  return picked.slice(0, limit);
}

function __summaryPolicyBase(reasonCodes = []){
  if(reasonCodes.includes('full_shift')) return 'full_shift';
  if(reasonCodes.includes('shift_air') || reasonCodes.includes('shift_mis') || reasonCodes.includes('shift')) return 'shift';
  if(reasonCodes.includes('seed_air') || reasonCodes.includes('seed_mis') || reasonCodes.includes('seed')) return 'seed';
  if(reasonCodes.includes('build_main')) return 'build_main';
  if(reasonCodes.includes('hold')) return 'hold';
  return '';
}
function __summaryImpactKey(item){
  if(!item) return 'default';
  const axis  = item.growthType && item.growthType.axis;
  const label = item.growthType && item.growthType.label;
  const role  = item.roleKey || '';

  // 1. ラベルによる明示的な分類（最優先）
  if(label === 'バランス良く強化' || label === '編成強化') return 'stability';
  if(label === '支援強化') return 'support';
  if(label === '後衛火力') return 'subdps';
  if(label === '爆発力')   return 'burst';
  if(label === '即戦力UP' || label === 'コスパ◎') return 'immediate';
  if(label === '長期投資向き') return 'future';
  if(label === '火力補強' || label === '主力強化') return role === 'wall' ? 'tankiness' : role === 'sup' ? 'support' : 'carry';
  if(label === '防御補強' || label === '耐久補強') return 'tankiness';
  if(label === '不利属性の対策') return role === 'wall' ? 'tankiness' : role === 'sup' ? 'support' : role === 'atk' ? 'subdps' : 'stability';

  // 2. 英雄の実際のロール（roleKey）を優先 ← ここが修正ポイント
  // wallロール（タンク）はどんな軸でも tankiness
  if(role === 'wall') return 'tankiness';
  if(role === 'sup')  return 'support';

  // 3. axis による分類（role が atk のときのみ）
  if(axis === 'atk') return role === 'atk' ? 'carry' : 'subdps';
  if(axis === 'wall') return 'tankiness';

  // 4. role fallback
  if(role === 'atk') return 'carry';
  return 'default';
}
function __pickSummaryTemplate(summaryKey, impactKey){
  const map = (typeof SUMMARY_TEMPLATES !== 'undefined' && SUMMARY_TEMPLATES) ? SUMMARY_TEMPLATES : null;
  if(!map || !summaryKey || !map[summaryKey]) return '';
  const bucket = map[summaryKey];
  return bucket[impactKey] || bucket.default || '';
}
function __buildRecommendationSummary(item){
  const reasonCodes = Array.isArray(item && item.reasonCodes) ? item.reasonCodes : [];
  const impactKey = __summaryImpactKey(item);
  const policyKey = __summaryPolicyBase(reasonCodes);
  let text = __pickSummaryTemplate(policyKey, impactKey);
  if(text) return text;
  if(reasonCodes.includes('lv30') || Number(item && (item.to || item.targetLv || 0)) >= 30){
    text = __pickSummaryTemplate('lv30', impactKey);
    if(text) return text;
  }
  if(reasonCodes.includes('high_cost') || (item && item.costTierLabel === '高コスト')){
    text = __pickSummaryTemplate('high_cost', impactKey);
    if(text) return text;
  }
  if(reasonCodes.includes('low_cost') || (item && item.costTierLabel === '低コスト')){
    text = __pickSummaryTemplate('low_cost', impactKey);
    if(text) return text;
  }
  if(reasonCodes.includes('future')){
    text = __pickSummaryTemplate('future', impactKey);
    if(text) return text;
  }
  if(reasonCodes.includes('immediate')){
    text = __pickSummaryTemplate('immediate', impactKey);
    if(text) return text;
  }
  return '戦力強化につながりやすい';
}

// 覚醒アドバイスをサマリに付記（rankheroカードの summary の後に独立して表示）
// ===============================
// S6 覚醒リソース配分警告
// ===============================
function checkAwakeningResourceWarning() {
    if (typeof AWAKENING_HEROES === 'undefined' || typeof loadAwTier === 'undefined') return '';

    const kimTier  = parseAwTier(loadAwTier('kimberly'));
    const dvaTier  = parseAwTier(loadAwTier('dva'));
    const teslaTier= parseAwTier(loadAwTier('tesla'));

    // 各英雄の覚醒進行度（0=未着手, 1=未使用, 2=★0台（0-1〜0-5）, 3=★1以上）
    const progress = (at) => {
        if (at.star < 0) return 0;
        if (at.star === 0 && at.tier === 0) return 1;
        if (at.star === 0) return 2;
        return 3;
    };

    const kimP   = progress(kimTier);
    const dvaP   = progress(dvaTier);
    const teslaP = progress(teslaTier);

    const warns = [];

    // キムに全投入してDVA/テスラが未着手
    if (kimTier.star >= 1 && dvaP === 0 && teslaP === 0) {
        warns.push('⚠️ <b>かけら集中注意：</b> キムの覚醒が進んでいますがDVA・テスラが未着手です。Week3(DVA)・Week5(テスラ)に備えかけらを分散確保することを推奨します。');
    } else if (kimTier.star >= 1 && dvaP === 0) {
        warns.push('💡 DVAの覚醒（Week3解放）にかけら130個が必要です。キム優先後でも確保できる見込みを確認しましょう。');
    }

    // DVA済みでテスラ未着手
    if (dvaTier.star >= 1 && teslaP === 0) {
        warns.push('💡 テスラ覚醒（Week5解放）：フィオナとのDoTコンボが強力です。ロケラン軸を視野に入れるならかけらを確保しておきましょう。');
    }

    if (!warns.length) return '';

    return `<div class="trans-note-orange">${warns.join('<br>')}</div>`;
}

function __buildAwakeningAdvice(heroId, ewLv) {
  if (typeof AWAKENING_HEROES === 'undefined') return '';
  const aw = AWAKENING_HEROES[heroId];
  if (!aw || !aw.milestones) return '';
  const awTierStr = (typeof loadAwTier !== 'undefined') ? loadAwTier(heroId) : 'none';
  const at = (typeof parseAwTier !== 'undefined') ? parseAwTier(awTierStr) : {star:0,tier:0};
  // MAX（★5（到達）= star:5,tier:0）
  if (at.star >= 5) return ''; // MAX
  const check = (typeof checkAwakeningEligible !== 'undefined')
    ? checkAwakeningEligible(heroId, ewLv, 5)
    : { eligible: (ewLv >= (aw.ewMinRequired||20)), reason: 'EW Lv'+aw.ewMinRequired+'以上が必要' };
  if (!check.eligible) {
    return '💡 覚醒条件：' + check.reason;
  }
  if (at.star < 0) {
    return '👑 覚醒できます！専用覚醒かけら×50で★0-1に解放（基礎ステ+20%）';
  }
  const next = (typeof awNextTierCost !== 'undefined') ? awNextTierCost(awTierStr) : null;
  if (!next) return '';
  const bonus = (aw.starBonuses || {})[next.nextStar] || '';
  const tierLabel = awStarLabel({ star: next.nextStar, tier: next.nextTier });
  return '👑 次：' + tierLabel + '（覚醒かけら：' + next.cost + '）' + (bonus ? ' → ' + bonus.substring(0,20)+'...' : '');
}

function __aiBuildReasonCodes(meta){
  const { hero, ms, roleKey, context, scoreCost, scoreCoverage, scoreFuture, roster } = meta || {};
  const codes = [];
  const synergyCodes = [];
  if(hero && context){
    const sameMain = hero.t === context.currentCombatType;
    const sameInvest = hero.t === context.investmentType;
    const inMainArmy = !!(context.mainArmyIds && context.mainArmyIds.has(hero.id));
    const stage = context.shiftStage || 'hold';
    let policyCode = 'hold';
    if((stage === 'seed' || String(context.transitionState||'').startsWith('seed_')) && sameInvest && !sameMain) policyCode = __aiTypedPolicyCode('seed', hero.t);
    else if((stage === 'shift' || stage === 'full_shift' || String(context.transitionState||'').startsWith('shift_to_')) && sameInvest && !sameMain) policyCode = (stage === 'full_shift') ? 'full_shift' : __aiTypedPolicyCode('shift', hero.t);
    else if(sameMain || inMainArmy) policyCode = 'build_main';
    codes.push(policyCode);
  }

  if(ms){
    if(ms.target >= 30) codes.push('lv30');
    else if(ms.target >= 20) codes.push('mid_cost');
    else codes.push('low_cost');
    if(ms.target === 10 || ms.target === 20) codes.push('ew_milestone');
  }
  const top = Math.max(Number(scoreCost)||0, Number(scoreCoverage)||0, Number(scoreFuture)||0);
  if(top > 0){
    if((Number(scoreFuture)||0) >= top * 0.98) codes.push('future');
    else if((Number(scoreCost)||0) >= top * 0.98) codes.push('immediate');
  }
  if(hero && hero.ur) codes.push('promoted_ur');

  // 編成シナジー由来の理由（前衛体制・兵種統一・覚醒コンボ・コミュニティ推奨編成）
  if(hero && Array.isArray(roster)){
    const frontCount = roster.filter(x => x && x.r === 'wall').length;
    const sameType = roster.filter(x => x && x.t === hero.t);
    if(hero.r === 'wall' && frontCount >= 2) synergyCodes.push('front2');
    if(sameType.length >= 4) synergyCodes.push('mono_type');
    if(context && context.awakeningCtx){
      const aw = context.awakeningCtx;
      if((hero.id === 'kimberly' || hero.id === 'dva') && aw.kimDvaCombo) synergyCodes.push('awaken_combo');
      if(hero.id === 'tesla' && aw.teslaFiona) synergyCodes.push('awaken_combo');
    }
    if(context && context.mainArmyIds){
      const ids = context.mainArmyIds;
      if(ids.has('kimberly') && ids.has('dva') && ids.has('schuyler') && ['kimberly','dva','schuyler'].includes(hero.id)) synergyCodes.push('meta_combo');
    }
    const profile = __aiGetProfile(hero.id);
    if(profile.role === 'support' || profile.role === 'front_tank') synergyCodes.push('carry_support');
  }

  // シナジー由来コードを優先的に1つ混ぜる（情報の重複を避けるため最大1つ）
  const finalCodes = synergyCodes.length ? [synergyCodes[0], ...codes] : codes;
  return __aiSelectReasonCodes(finalCodes, 2);
}

function detectArmyWeaknessFromDetail(detail){
    if(!detail) return "balance";
    let total = detail.attack + detail.defense;
    if(total === 0) return "balance";

    let attackRatio = detail.attack / total;

    if(attackRatio > 0.60) return "defense";
    if(attackRatio < 0.45) return "attack";

    return "balance";
}


function __aiGetProfile(heroId){
  return (HERO_DB[heroId] && HERO_DB[heroId].aiRole)
    ? HERO_DB[heroId].aiRole
    : { role:'other', lane:'back', core:false };
}
function __aiGetLongterm(heroId){
  const v = HERO_DB[heroId] && HERO_DB[heroId].score && HERO_DB[heroId].score.longterm;
  return Number.isFinite(v) ? v : 0.55;
}
function __aiGetEvalMeta(heroId){
  const h = HERO_DB[heroId];
  if (!h || h.milestone10Fit === undefined) return { milestone10Fit:1.0 };
  const entry = { milestone10Fit: h.milestone10Fit };
  if (h.promotedUrImmediateFit !== undefined) entry.promotedUrImmediateFit = h.promotedUrImmediateFit;
  return entry;
}
function __aiGetAiProfile(heroId){
  return (HERO_DB[heroId] && HERO_DB[heroId].score)
    ? HERO_DB[heroId].score
    : {
        immediate:1.0,
        longterm:1.0,
        cost10:1.0,
        cost20:1.0,
        cost30:1.0,
        coverage:1.0,
        future:1.0,
        mainTypeBonus:1.0,
        promotedUrPenalty:1.0,
        skillPower:{ lv0:1.0, lv10:1.0, lv20:1.0, lv30:1.0 },
        durability:{ lv0:1.0, lv10:1.0, lv20:1.0, lv30:1.0 }
      };
}
// Lv帯別オブジェクト（{lv0,lv10,lv20,lv30}）から、武装Lv(wp)に応じて線形補間で実効値を取得する汎用関数。
// 武装Lvが低くても素の質が高いヒーロー、特定Lvが分水嶺になるヒーロー等、Lv依存度の違いを反映する。
function __aiInterpolateLvBand(statObj, wp){
  if (!statObj || typeof statObj !== 'object') return (typeof statObj === 'number') ? statObj : 1.0;
  const lv = Math.max(0, Math.min(30, wp || 0));
  if (lv <= 10) {
    const t = lv / 10;
    return statObj.lv0 + (statObj.lv10 - statObj.lv0) * t;
  } else if (lv <= 20) {
    const t = (lv - 10) / 10;
    return statObj.lv10 + (statObj.lv20 - statObj.lv10) * t;
  } else {
    const t = (lv - 20) / 10;
    return statObj.lv20 + (statObj.lv30 - statObj.lv20) * t;
  }
}
// 武装Lv(wp)に応じて、HERO_AI_PROFILE.durability（{lv0,lv10,lv20,lv30}）から実効値を取得する。
// 例：武装Lvが低くても素の耐久力が高いヒーロー（ウィリアムズ）、武装Lv20が分水嶺になるヒーロー
// （マーフィのMitigation解放）等、Lv依存度の違いを反映する。
function __aiGetDurability(heroId, wp){
  const ai = __aiGetAiProfile(heroId);
  return __aiInterpolateLvBand(ai.durability, wp);
}
// 武装Lv(wp)に応じて、HERO_AI_PROFILE.skillPower（{lv0,lv10,lv20,lv30}）から実効値を取得する。
// 例：DVAはLv10とLv30で2段階の質的変化、武装解放だけで質的変化が起きるヒーロー（スカイラーの
// 確定スタン）等、Lv依存度の違いを反映する。
function __aiGetSkillPower(heroId, wp){
  const ai = __aiGetAiProfile(heroId);
  return __aiInterpolateLvBand(ai.skillPower, wp);
}
function __aiCounterMap(type){
  return (typeof TYPE_COUNTER_WEIGHT === 'object' && TYPE_COUNTER_WEIGHT[type])
    ? TYPE_COUNTER_WEIGHT[type]
    : { tank:0.5, air:0.5, mis:0.5 };
}
function __aiTopByType(roster, type, n=5){
  return roster.filter(h=>h.t===type).slice().sort((a,b)=>(b.wp-a.wp)||((HERO_DB[b.id]?.priority||0)-(HERO_DB[a.id]?.priority||0))).slice(0,n);
}
function __aiAvgWp(arr){ return arr.length ? arr.reduce((s,x)=>s+x.wp,0)/arr.length : 0; }
function __aiHasAny(arr, ids){ return arr.some(x=>ids.includes(x.id)); }
function __aiCostTierLabel(from, to){
  if(to >= 30) return '高コスト';
  if(to >= 20) return '中コスト';
  return '低コスト';
}function __aiNormalizeShiftType(type){
  if(type === 'missile') return 'mis';
  return ['tank','air','mis'].includes(type) ? type : 'tank';
}
function __aiShiftCfg(){
  return (typeof META_SHIFT === 'object' && META_SHIFT) ? META_SHIFT : {};
}
function __aiShiftStageCfg(){
  return (typeof META_SHIFT_STAGE === 'object' && META_SHIFT_STAGE) ? META_SHIFT_STAGE : {};
}
function __aiShiftCoreProgress(type, roster){
  const cfg = __aiShiftCfg();
  const core = cfg.core || {};
  const key = (type === 'mis' && core.missile) ? 'missile' : type;
  const row = core[key];
  if(!row || !Array.isArray(row.ids) || !row.ids.length) return 0;
  const targets = Array.isArray(row.targets) ? row.targets : [];
  const members = Array.isArray(roster) ? roster : [];
  let sum = 0;
  let cnt = 0;
  row.ids.forEach((id, idx) => {
    const hero = members.find(h => h && h.id === id);
    const wp = Math.max(0, Number(hero && hero.wp) || 0);
    const target = Math.max(1, Number(targets[idx]) || Number(cfg.progress && cfg.progress.maxWp) || 30);
    sum += Math.min(1, wp / target);
    cnt += 1;
  });
  return cnt ? (sum / cnt) : 0;
}
function __aiMainArmyType(army){
  const counts = { tank:0, air:0, mis:0 };
  (Array.isArray(army) ? army : []).forEach(h => {
    const t = __aiNormalizeShiftType(h && h.t);
    if(counts[t] !== undefined) counts[t] += 1;
  });
  return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'tank';
}
function __aiShiftStageName(mainProgress, nextProgress){
  const cfg = __aiShiftStageCfg();
  if(mainProgress < (cfg.weakMain || 0.55)) return 'build_main';
  if(nextProgress >= (cfg.fullShift || 0.80)) return 'full_shift';
  if(nextProgress >= (cfg.shiftStart || 0.55)) return 'shift';
  if(nextProgress >= (cfg.seedStart || 0.30)) return 'seed';
  if(mainProgress >= (cfg.matureMain || 0.78)) return 'mature_hold';
  return 'hold';
}
function __aiBuildContext(roster, base){
  const topTank = __aiTopByType(roster, 'tank');
  const topAir = __aiTopByType(roster, 'air');
  const topMis = __aiTopByType(roster, 'mis');
  const progress = {
    tank:{ top:topTank, avgWp:__aiAvgWp(topTank), count10:topTank.filter(x=>x.wp>=10).length, count20:topTank.filter(x=>x.wp>=20).length, count30:topTank.filter(x=>x.wp>=30).length, coreCount:topTank.filter(x=>['kimberly','murphy','williams','marshall','stetmann'].includes(x.id)).length },
    air:{ top:topAir, avgWp:__aiAvgWp(topAir), count10:topAir.filter(x=>x.wp>=10).length, count20:topAir.filter(x=>x.wp>=20).length, count30:topAir.filter(x=>x.wp>=30).length, coreCount:topAir.filter(x=>['dva','lucius','morrison','schuyler','carlie'].includes(x.id)).length },
    mis:{ top:topMis, avgWp:__aiAvgWp(topMis), count10:topMis.filter(x=>x.wp>=10).length, count20:topMis.filter(x=>x.wp>=20).length, count30:topMis.filter(x=>x.wp>=30).length, coreCount:topMis.filter(x=>['fiona','tesla','mcgregor','swift','adam'].includes(x.id)).length }
  };
  const typeScore = {
    tank: progress.tank.avgWp + progress.tank.count20*2 + progress.tank.count10 + progress.tank.count30*3 + progress.tank.coreCount*1.2,
    air: progress.air.avgWp + progress.air.count20*2 + progress.air.count10 + progress.air.count30*3 + progress.air.coreCount*1.2,
    mis: progress.mis.avgWp + progress.mis.count20*2 + progress.mis.count10 + progress.mis.count30*3 + progress.mis.coreCount*1.2,
  };
  const currentCombatType = Object.entries(typeScore).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'tank';
  const army1 = ((base && base.assignment && Array.isArray(base.assignment.army1)) ? base.assignment.army1 : []).filter(Boolean);
  const mainArmyType = army1.length ? __aiMainArmyType(army1) : currentCombatType;
  const mainCoreProgress = {
    tank: __aiShiftCoreProgress('tank', roster),
    air: __aiShiftCoreProgress('air', roster),
    mis: __aiShiftCoreProgress('mis', roster)
  };
  const mainSquadProgress = __aiShiftCoreProgress(mainArmyType, army1.length ? army1 : roster);
  const candidateTypes = ['tank','air','mis'].filter(t => t !== mainArmyType);
  const shiftTargetType = candidateTypes.sort((a,b)=>{
    const pa = mainCoreProgress[a] || 0;
    const pb = mainCoreProgress[b] || 0;
    if(pb !== pa) return pb - pa;
    return (typeScore[b] || 0) - (typeScore[a] || 0);
  })[0] || currentCombatType;
  const targetProgress = mainCoreProgress[shiftTargetType] || 0;
  const shiftStage = __aiShiftStageName(mainSquadProgress, targetProgress);

  let investmentType = currentCombatType;
  let transitionState = `stay_${currentCombatType}`;
  if(shiftStage === 'seed'){
    investmentType = shiftTargetType;
    transitionState = `seed_${shiftTargetType}`;
  } else if(shiftStage === 'shift' || shiftStage === 'full_shift'){
    investmentType = shiftTargetType;
    transitionState = `shift_to_${shiftTargetType}`;
  } else if(mainArmyType !== currentCombatType && mainSquadProgress >= 0.60){
    investmentType = mainArmyType;
    transitionState = `stay_${mainArmyType}`;
  }

  const main = progress[mainArmyType] || progress[currentCombatType];
  const mainTeamMaturity = (mainSquadProgress >= 0.78 || main.avgWp >= 20 || main.count20 >= 4 || main.count30 >= 1) ? 'high' : ((mainSquadProgress >= 0.55 || main.avgWp >= 12 || main.count10 >= 3) ? 'mid' : 'low');
  const mainArmyIds = new Set(army1.map(h=>h.id));
  // S6覚醒状況をコンテキストに追加
  // ⚠️ シーズン拡張ガイド：覚醒対象ヒーローはS6時点でkimberly/dva/teslaの3人に固定でハードコードされている。
  // S7以降で AWAKENING_HEROES に新しい覚醒対象を追加しても、ここには自動で乗らない。
  // 新ヒーローの専用コンボ・固有効果を追加する場合は、このブロックに kimAt/dvaAt/teslaAt と同じ
  // パターンで取得処理を追加し、戻り値オブジェクトにも追加する。
  // 同様のハードコードは下記にも分散している（grep "==='kimberly'" 等で検索すると一覧できる）：
  //   - L1337付近: 編成診断の覚醒考慮ロジック
  //   - L2119付近: テスラのDoTスタック上限計算（固有スキル効果）
  //   - L2628, L2980付近: awaken_combo シナジーコード判定（kimDvaCombo/teslaFiona）
  //   - L2879, L3038付近: 個別ヒーローのEW投資補正
  //   - L3901付近: スロットモーダルのシナジー説明文生成
  // これらは「各ヒーロー固有の覚醒スキル効果」を表現するための特化処理であり、完全な汎用化はせず、
  // 新ヒーロー追加時にそのヒーロー専用の分岐を追記する運用を想定している。
  const awakeningCtx = (() => {
    if (typeof loadAwTier === 'undefined' || typeof parseAwTier === 'undefined') return {};
    const kimAt  = parseAwTier(loadAwTier('kimberly'));
    const dvaAt  = parseAwTier(loadAwTier('dva'));
    const teslaAt= parseAwTier(loadAwTier('tesla'));
    const kimHas  = roster.some(h=>h.id==='kimberly') && kimAt.star >= 0;
    const dvaHas  = roster.some(h=>h.id==='dva')      && dvaAt.star >= 0;
    const teslaHas= roster.some(h=>h.id==='tesla')    && teslaAt.star >= 0;
    return {
      kim:   { awakened: kimHas,   star: kimAt.star,   tier: kimAt.tier   },
      dva:   { awakened: dvaHas,   star: dvaAt.star,   tier: dvaAt.tier   },
      tesla: { awakened: teslaHas, star: teslaAt.star, tier: teslaAt.tier },
      hasAwakened:   kimHas || dvaHas || teslaHas,
      kimDvaCombo:   kimHas && dvaHas,
      teslaFiona:    teslaHas && roster.some(h=>h.id==='fiona'),
    };
  })();
  return { progress, currentCombatType, investmentType, transitionState, mainTeamMaturity, mainArmyIds, mainArmyType, mainSquadProgress, shiftTargetType, shiftTargetProgress:targetProgress, shiftStage, coreProgress:mainCoreProgress, awakeningCtx };
}
function __aiTypePolicyMult(type, context, route='overall'){
  let mult = ((typeof META_SHIFT==='object' && META_SHIFT.weightBase && META_SHIFT.weightBase[type]) || 1.0);
  const current = context.currentCombatType;
  const invest = context.investmentType || current;
  const mainType = context.mainArmyType || current;
  const shiftStage = context.shiftStage || 'hold';
  const cfg = __aiShiftStageCfg();
  const multCfg = (typeof META_SHIFT === 'object' && META_SHIFT.mult) ? META_SHIFT.mult : {};

  if(route === 'cost'){
    if(type === mainType) mult *= (cfg.keepCurrentCost || 1.06);
    else mult *= 0.96;
    if(context.mainTeamMaturity === 'low' && type !== mainType) mult *= (cfg.lowMainOfftypeCost || multCfg.weakOfftypeDamp || 0.94);
    if(shiftStage === 'seed' && type === invest) mult *= (multCfg.seedBoost || cfg.seedFuture || 1.04);
    if((shiftStage === 'shift' || shiftStage === 'full_shift') && type === invest) mult *= 1.04;
  } else if(route === 'coverage'){
    const cm = __aiCounterMap(current);
    mult *= (0.9 + (cm[type] || 0.5) * 0.2);
    if(type === invest) mult *= 1.03;
    if(type === mainType && context.mainTeamMaturity !== 'high') mult *= 1.03;
  } else if(route === 'future'){
    if(type === mainType) mult *= (cfg.keepCurrentFuture || 1.03);
    else mult *= 0.95;
    if(type === invest) mult *= (shiftStage === 'seed' ? (cfg.seedFuture || multCfg.seedBoost || 1.04) : ((shiftStage === 'shift' || shiftStage === 'full_shift') ? (cfg.shiftFuture || multCfg.shiftBoost || 1.10) : 1.08));
    if(context.transitionState === 'seed_air' && type === 'air') mult *= 1.03;
    if(context.transitionState === 'shift_to_air' && type === 'air') mult *= 1.06;
    if(context.transitionState === 'seed_mis' && type === 'mis') mult *= 1.03;
    if(context.transitionState === 'shift_to_mis' && type === 'mis') mult *= 1.06;
    if(context.mainTeamMaturity === 'low' && type !== mainType) mult *= (cfg.lowMainOfftypeFuture || 0.92);
  }
  return Math.max(0.85, Math.min(1.20, mult));
}
function __aiHeroBias(heroId, route='overall', context=null, wp=undefined){
  const p = __aiGetProfile(heroId);
  const evalMeta = __aiGetEvalMeta(heroId);
  const ai = __aiGetAiProfile(heroId);
  let mult = 1.0;
  if(p.role === 'main_dps') mult *= 1.10;
  else if(p.role === 'sub_dps') mult *= 1.04;
  else if(p.role === 'front_tank') mult *= 1.02;
  else if(p.role === 'control') mult *= 1.03;
  else if(p.role === 'support') mult *= 0.98;
  // スキル単体の強度（確定CC・AoE・特殊効果等）。将来性（future）には乗せない。
  // 「育成すれば伸びる」のではなく「今のスキル内容自体が強い」ことの評価なので、
  // 即時性(cost)と編成価値(coverage)・無指定時の総合評価にのみ反映する。
  // wpが渡されていれば武装Lv帯別の実効値を使う（DVAのLv10/30二段階の伸び等を反映）。
  // ⚠️ evaluateSquadRealCombatの混成ペナルティ緩和ロジックと同じ役割分岐を適用する：
  // 前衛タンク(front_tank)はdurability（耐久力の質）、それ以外はskillPower（スキルの質）を使う。
  // これがないと、ルシウス等の前衛タンクの「武装Lvで耐久が大きく伸びる」という評価が、
  // 育成優先ランキングのスコアに反映されない不整合が生じる。
  const isFrontTankRole = (p.role === 'front_tank');
  const qualityStatObj = isFrontTankRole ? ai.durability : ai.skillPower;
  const skillPowerMult = (wp !== undefined)
      ? __aiInterpolateLvBand(qualityStatObj, wp)
      : __aiInterpolateLvBand(qualityStatObj, 20);
  if(route !== 'future') mult *= skillPowerMult;
  const meta = (HERO_DB[heroId] && HERO_DB[heroId].meta) || {};
  if(meta.ew === 'SSS') mult *= 1.10;
  else if(meta.ew === 'SS') mult *= 1.06;
  else if(meta.ew === 'S') mult *= 1.03;

  if(route === 'cost') mult *= (ai.immediate || 1.0);
  else if(route === 'coverage') mult *= (ai.coverage || 1.0);
  else if(route === 'future') mult *= (ai.future || 1.0) * (ai.longterm || 1.0);

  if(p.promotedUr || meta.ew === 'P'){
    const immediateFit = Math.max(0.88, Math.min(1.18, evalMeta.promotedUrImmediateFit || 1.0));
    const promotedPenalty = Math.max(0.72, Math.min(1.0, ai.promotedUrPenalty || 0.84));
    if(route === 'future') mult *= (__aiGetLongterm(heroId) * 0.84) * promotedPenalty;
    else if(route === 'cost') mult *= immediateFit;
    else if(route === 'coverage') mult *= (0.96 + Math.max(0, immediateFit - 1) * 0.70);
    else mult *= 0.94;
    return mult;
  }

  if(route === 'future') mult *= __aiGetLongterm(heroId);
  if(context && context.investmentType === 'air' && heroId === 'dva') mult *= 1.02;
  if(context && context.investmentType === 'air' && heroId === 'lucius'){
    mult *= 1.12;
    if(route === 'cost') mult *= 1.08;
    else if(route === 'coverage') mult *= 1.05;
    else if(route === 'future') mult *= 1.03;
  }
  return mult;
}
function __aiMilestoneBias(heroId, targetLv, route='overall'){
  const p = __aiGetProfile(heroId);
  const evalMeta = __aiGetEvalMeta(heroId);
  const ai = __aiGetAiProfile(heroId);
  const aiCost = targetLv === 30 ? (ai.cost30 || 1.0) : (targetLv === 20 ? (ai.cost20 || 1.0) : (ai.cost10 || 1.0));
  if(p.promotedUr){
    const immediateFit = Math.max(0.92, Math.min(1.12, evalMeta.promotedUrImmediateFit || 1.0));
    if(targetLv === 10) return (route === 'cost' ? (1.03 * immediateFit * aiCost) : 1.00);
    if(targetLv === 20) return route === 'cost' ? (0.92 * aiCost) : (route === 'future' ? 0.84 : 0.88);
    if(targetLv === 30) return route === 'cost' ? (0.72 * aiCost) : (route === 'future' ? 0.58 : 0.66);
  }
  if(targetLv === 10) return route === 'cost' ? (1.05 * aiCost) : 1.00;
  if(targetLv === 20) return route === 'cost' ? (1.15 * aiCost) : 1.11;
  if(targetLv === 30){
    if(p.role === 'main_dps') return route === 'future' ? 1.10 : (1.02 * aiCost);
    if(p.role === 'front_tank') return route === 'cost' ? (0.94 * aiCost) : 1.00;
    if(p.role === 'support') return route === 'cost' ? (0.90 * aiCost) : 0.90;
    return route === 'cost' ? aiCost : 1.0;
  }
  return route === 'cost' ? aiCost : 1.0;
}
function __aiSynergyBias(hero, roster, targetLv){
  const source = (typeof HERO_PAIR_SYNERGY === 'object' && HERO_PAIR_SYNERGY[hero.id])
    ? HERO_PAIR_SYNERGY
    : ((typeof HERO_SYNERGY === 'object') ? HERO_SYNERGY : null);
  const table = source && source[hero.id] ? source[hero.id] : null;
  if(!table) return 1.0;

  const rosterMap = {};
  roster.forEach(x => {
    if(!x || !x.id) return;
    const lv = Number.isFinite(parseInt(x.wp, 10)) ? parseInt(x.wp, 10) : 0;
    rosterMap[x.id] = Math.max(rosterMap[x.id] || 0, lv);
  });

  let mult = 1.0;
  for(const [partnerId, bonus] of Object.entries(table)){
    const partnerLv = rosterMap[partnerId] || 0;
    if(partnerLv <= 0) continue;

    let pairMult = (typeof bonus === 'number') ? bonus : (bonus.base || 1.0);
    if(typeof bonus === 'object'){
      if(partnerLv >= 30 && bonus.lv30) pairMult = bonus.lv30;
      else if(partnerLv >= 20 && bonus.lv20) pairMult = bonus.lv20;
      else if(partnerLv >= 10 && bonus.lv10) pairMult = bonus.lv10;
    }

    if(targetLv === 30){
      pairMult = 1 + (pairMult - 1) * 0.5;
    }

    mult *= pairMult;
  }

  return Math.min(mult, 1.12);
}

function __aiFormationSynergyBias(hero, roster, targetLv, context){
  const table = (typeof FORMATION_SYNERGY === 'object' && FORMATION_SYNERGY) ? FORMATION_SYNERGY : null;
  if(!table || !hero) return 1.0;
  const sameType = roster.filter(x => x && x.t === hero.t);
  const sameTypeCount = sameType.length;
  const frontCount = roster.filter(x => x && x.r === 'wall').length;
  const hasMainDps = roster.some(x => {
    const p = __aiGetProfile(x.id);
    return p.role === 'main_dps';
  });
  const hasSubDps = roster.some(x => {
    const p = __aiGetProfile(x.id);
    return p.role === 'sub_dps' || x.r === 'atk';
  });
  const hasSupport = roster.some(x => {
    const p = __aiGetProfile(x.id);
    return p.role === 'support' || x.r === 'sup';
  });
  let mult = 1.0;
  if(frontCount >= 2 && table.front2) mult *= table.front2;
  if(sameTypeCount >= 5 && table.monoType5) mult *= table.monoType5;
  else if(sameTypeCount >= 4 && table.monoType4plus1) mult *= table.monoType4plus1;
  if(hero.t === 'tank' && hasSupport && frontCount >= 2 && table.tankCarryCore) mult *= table.tankCarryCore;
  if(hero.t === 'air' && __aiHasAny(roster, ['lucius','dva','morrison']) && table.airBurstCore) mult *= table.airBurstCore;
  if(hero.t === 'air' && __aiHasAny(roster, ['lucius','schuyler']) && table.airControlCore) mult *= table.airControlCore;
  if(hero.t === 'mis' && __aiHasAny(roster, ['adam']) && (__aiHasAny(roster, ['tesla','fiona','mcgregor','swift','venom','brats'])) && table.missileCore) mult *= table.missileCore;
  if((__aiGetProfile(hero.id).promotedUr) && table.promotedUrBridge) mult *= table.promotedUrBridge;
  if(hasMainDps && hasSubDps && table.carryPlusSubDps) mult *= table.carryPlusSubDps;
  if(hasMainDps && hasSupport && table.carryPlusSupport) mult *= table.carryPlusSupport;
  // コントロール役（CC）×主力アタッカーの噛み合わせ：CCで敵前衛を封殺してから主力が突破する型
  const hasControl = __aiHasAny(roster, ['schuyler']);
  if(hasControl && hasMainDps && table.controlPlusCarry) mult *= table.controlPlusCarry;
  if(context && hero.t === context.currentCombatType){
    mult *= (__aiGetAiProfile(hero.id).mainTypeBonus || 1.0);
  }
  // S6覚醒シナジー
  if(context && context.awakeningCtx) {
    const aw = context.awakeningCtx;
    if(hero.id === 'kimberly' && aw.kim.awakened && frontCount >= 2 && table.awakenKimCore)
      mult *= table.awakenKimCore;
    if((hero.id === 'kimberly' || hero.id === 'dva') && aw.kimDvaCombo && table.awakenKimDvaCombo)
      mult *= table.awakenKimDvaCombo;
    if(hero.id === 'dva' && aw.dva.awakened && !aw.kimDvaCombo && hero.t === 'air' && table.awakenDvaMono)
      mult *= table.awakenDvaMono;
    if(hero.id === 'tesla' && aw.teslaFiona && table.awakenTeslaFiona)
      mult *= table.awakenTeslaFiona;
  }
  // コミュニティ推奨混成型シナジー（packsify: Kim+DVA+Schuyler）
  if(context && context.mainArmyIds) {
    const ids = context.mainArmyIds; // Set型
    const hasKim      = ids.has('kimberly');
    const hasDva      = ids.has('dva');
    const hasSchuyler = ids.has('schuyler');
    // キム+DVA+スカイラー同時採用 → 最強PvP編成ボーナス
    if(hasKim && hasDva && hasSchuyler && table.kimDvaSchuyler)
      mult *= (hero.id === 'kimberly' || hero.id === 'dva' || hero.id === 'schuyler')
        ? table.kimDvaSchuyler : 1.0;
    // スカイラーCC封殺型
    else if(hasSchuyler && frontCount >= 2 && table.schuylerControl)
      mult *= (hero.id === 'schuyler') ? table.schuylerControl : 1.0;
  }
  if(targetLv === 30) mult = 1 + (mult - 1) * 0.65;
  return Math.min(mult, 1.22); // 覚醒シナジー分上限を1.16→1.22に拡張
}

function __aiMatchupBias(hero, roster, context){
  const table = (typeof MATCHUP_MODIFIER === 'object' && MATCHUP_MODIFIER) ? MATCHUP_MODIFIER : null;
  if(!table || !hero) return 1.0;
  let mult = 1.0;
  if(table[hero.id] && table[hero.id].vsEnemy && context && context.currentCombatType){
    const mods = table[hero.id].vsEnemy;
    if(mods[context.currentCombatType]) mult *= mods[context.currentCombatType];
  }
  if(hero.id === 'lucius' && table.lucius && table.lucius.withEW30 && hero.wp >= 30){
    mult *= table.lucius.withEW30;
  }
  return Math.max(0.90, Math.min(mult, 1.12));
}

function __aiTankBranchBias(hero, targetLv, context){
  if(!hero || hero.t !== 'tank') return 1.0;
  const weaknesses = [context && context.weakness1, context && context.weakness2, context && context.weakness3].filter(Boolean);
  const defenseNeed = weaknesses.filter(x => x === 'defense').length;
  const attackNeed = weaknesses.filter(x => x === 'attack').length;
  const id = hero.id;
  let mult = 1.0;

  if(id === 'lucius'){
    mult *= 1.10;
    if(hero.wp < 10 && targetLv === 10) mult *= 1.24;
    if(targetLv === 20) mult *= 1.06;
    if(targetLv === 30) mult *= 0.96;
    if(defenseNeed > attackNeed) mult *= 1.05;
    if(attackNeed === defenseNeed && targetLv === 10) mult *= 1.03;
  }

  if(id === 'dva'){
    if(targetLv === 10) mult *= 0.98;
    if(targetLv === 20) mult *= 1.03;
    if(targetLv === 30) mult *= 1.06;
    if(attackNeed >= defenseNeed) mult *= 1.03;
  }

  if(id === 'williams'){
    if(defenseNeed > attackNeed) mult *= 1.10;
    else if(attackNeed > defenseNeed) mult *= 0.94;
    else mult *= 1.01;
  }

  if(id === 'murphy'){
    if(attackNeed > defenseNeed) mult *= 1.10;
    else if(defenseNeed > attackNeed) mult *= 0.95;
    else mult *= 1.01;
  }

  if(id === 'stetmann'){
    if(attackNeed > defenseNeed) mult *= 1.08;
    else if(defenseNeed > attackNeed) mult *= 0.97;
    else mult *= 1.01;
  }

  return Math.max(0.90, Math.min(mult, 1.20));
}

function __aiMatchesWeakness(roleKey, weaknesses){
  if(!Array.isArray(weaknesses) || !weaknesses.length) return false;
  const needDefense = weaknesses.includes('defense');
  const needAttack = weaknesses.includes('attack');
  if(needDefense && roleKey === 'wall') return true;
  if(needAttack && roleKey === 'atk') return true;
  return false;
}

function __aiReasonBadgeFromScores(meta){
  const { hero, ms, roleKey, context, weaknesses, scoreCost, scoreCoverage, scoreFuture } = meta || {};
  const entries = [
    { key:'cost', value:Number(scoreCost)||0 },
    { key:'coverage', value:Number(scoreCoverage)||0 },
    { key:'future', value:Number(scoreFuture)||0 }
  ].sort((a,b)=>b.value-a.value);

  const top = entries[0] || { key:'cost', value:0 };
  const second = entries[1] || { key:'coverage', value:0 };
  const close = top.value <= 0 ? false : second.value >= top.value * 0.965;
  const weaknessMatch = __aiMatchesWeakness(roleKey, weaknesses || []);
  const longterm = __aiGetLongterm(hero && hero.id);
  const sameInvest = !!(hero && context && hero.t === context.investmentType);
  const sameMain = !!(hero && context && hero.t === context.currentCombatType);
  const inMainArmy = !!(hero && context && context.mainArmyIds && context.mainArmyIds.has(hero.id));
  const safeQualified = !!(hero && ms && ms.target <= 20 && (sameMain || inMainArmy || hero.r === 'wall' || hero.r === 'sup'));

  function weaknessLabelFor(axisKey, role){
    if(axisKey === 'wall' || role === 'wall') return '耐久補強';
    if(axisKey === 'atk' || role === 'atk') return '火力補強';
    return '弱点補強';
  }

  let label = 'バランス良く強化';
  let axis = 'bal';
  let strong = false;

  if(top.key === 'coverage'){
    if(weaknessMatch && top.value >= second.value * 1.02){
      axis = (weaknesses || []).includes('attack') ? 'atk' : 'wall';
      label = weaknessLabelFor(axis, roleKey);
      strong = true;
    }else if(weaknessMatch && !close){
      axis = (weaknesses || []).includes('attack') ? 'atk' : 'wall';
      label = weaknessLabelFor(axis, roleKey);
    }
  } else if(top.key === 'future'){
    const futureQualified = (ms && ms.target >= 30) || sameInvest || longterm >= 0.72;
    if(futureQualified && top.value >= second.value * 1.03){
      label = '長期投資向き';
      axis = 'atk';
      strong = !!(ms && ms.target >= 30);
    }else if(futureQualified && !close && (ms && ms.target >= 20)){
      label = '長期投資向き';
      axis = 'atk';
    }
  } else if(top.key === 'cost'){
    const isWall = roleKey === 'wall';
    const isSup = roleKey === 'sup';
    const effectLabel = (ms && ms.target >= 30)
      ? (isWall ? '耐久が大幅UP' : isSup ? '支援力が大幅UP' : '火力が大幅UP')
      : (isWall ? '耐久アップ' : isSup ? '支援力アップ' : ms.target >= 20 ? '主力に成長' : '低コストで戦力UP');
    if(top.value >= second.value * 1.05){
      label = effectLabel;
    }else if(safeQualified || close){
      label = '無理なく強化';
    }else if(top.value >= second.value * 1.02){
      label = effectLabel;
    }
  }

  const level = (ms && ms.target>=30) ? 4 : ((ms && ms.target>=20) ? 3 : 2);
  return { level, axis, label, strong };
}

function __aiDisplaySafeLabel(hero, ms, context, reasonBadge, scoreCost, scoreCoverage, scoreFuture){
  if(!hero || !ms || !context || !reasonBadge) return '';
  const costLabels = ['低コストで戦力UP','主力に成長','耐久アップ','支援力アップ'];
  if(!costLabels.includes(reasonBadge.label)) return '';
  if(ms.target > 20) return '';
  const sameMain = hero.t === context.currentCombatType;
  const inMainArmy = context.mainArmyIds && context.mainArmyIds.has(hero.id);
  const top = Math.max(Number(scoreCost)||0, Number(scoreCoverage)||0, Number(scoreFuture)||0, 0);
  if(top <= 0) return '';
  if((Number(scoreCost)||0) < top * 0.97) return '';
  if(hero.t === context.currentCombatType) return 'バランス良く強化';
  if((inMainArmy || hero.r === 'wall' || hero.r === 'sup') && ms.target === 20) return 'バランス良く強化';
  return '';
}

// 部隊完成度係数：ロスター全体の「現在のプレイヤータイプの目標EWへの平均到達度」(0.0〜1.0)。
// 達成率が低い（基礎が未完成）ほど短期コスパ重視を強め、高い（基礎完成済み）ほど
// 将来性・長期投資を強める補正係数として使う。0.5を基準に±0.15の範囲で重みを微調整する。
function __aiSquadCompletionFactor(roster, playerType){
    if (!Array.isArray(roster) || !roster.length) return 0.5;
    const rt = (typeof ROLE_TARGET_PRESET === 'object' && ROLE_TARGET_PRESET[playerType]) ? ROLE_TARGET_PRESET[playerType] : { atk:20, wall:20, sup:10 };
    let totalRate = 0, count = 0;
    roster.forEach(hero => {
        if (hero.ur) return; // UR昇格組は目標EWの考え方が異なるため除外
        const role = hero.r || 'atk';
        const target = rt[role] || 20;
        const rate = Math.min(1.0, (hero.wp || 0) / Math.max(target, 1));
        totalRate += rate;
        count++;
    });
    return count > 0 ? (totalRate / count) : 0.5;
}

function calculateUpgradeEfficiencyFull(roster){
    if(roster.length < 10) return {normal:[], unlock:[], weakness1:"balance", weakness2:"balance", weakness3:"balance", reinforceList:[]};

    let base = optimizeMultiArmy(roster,5);
    let baseScore = calcMultiArmyTotalScore(base.assignment);
    if(baseScore === 0) return {normal:[], unlock:[], weakness1:"balance", weakness2:"balance", weakness3:"balance", reinforceList:[]};

    let weakness1 = detectArmyWeaknessFromDetail(base.armyDetails.army1);
    let weakness2 = detectArmyWeaknessFromDetail(base.armyDetails.army2);
    let weakness3 = detectArmyWeaknessFromDetail(base.armyDetails.army3);

    const context = __aiBuildContext(roster, base);
    const playerType = (typeof loadPlayerType === 'function') ? loadPlayerType() : 'f2p';
    const baseWeights = (typeof ROUTE_WEIGHT_PRESET === 'object' && ROUTE_WEIGHT_PRESET[playerType]) ? ROUTE_WEIGHT_PRESET[playerType] : { cost:0.65, coverage:0.25, future:0.10 };

    // 部隊完成度係数：基礎が未完成（係数が低い）ほどcostを強め、基礎完成済み（係数が高い）ほどfutureを強める。
    // 0.5を基準点として±0.15の範囲で補正し、極端な傾きにならないようにする。
    const completionFactor = __aiSquadCompletionFactor(roster, playerType);
    const completionAdj = (completionFactor - 0.5) * 0.3; // -0.15 ~ +0.15
    const adjCost = Math.max(0.05, baseWeights.cost - completionAdj);
    const adjFuture = Math.max(0.05, baseWeights.future + completionAdj);
    const weightSum = adjCost + baseWeights.coverage + adjFuture;
    const weights = {
        cost: adjCost / weightSum,
        coverage: baseWeights.coverage / weightSum,
        future: adjFuture / weightSum
    };

    let normalResults = [];
    let unlockResults = [];
    let awakenResults = [];  // 覚醒強化候補（専用武装ランキングとは別）

    roster.forEach((hero,index)=>{
        if(hero.ur) return;
        const profile = __aiGetProfile(hero.id);
        const roleKey = hero.r || (profile.role === 'front_tank' ? 'wall' : (profile.role === 'support' ? 'sup' : 'atk'));
        const roleBadge = getRoleBadge(roleKey);
        const simulated = roster.map(h => ({...h}));

        if(hero.wp === 0){
            const ewTarget = ((HERO_DB[hero.id] && HERO_DB[hero.id].meta) && (HERO_DB[hero.id] && HERO_DB[hero.id].meta).ewTarget) ? (HERO_DB[hero.id] && HERO_DB[hero.id].meta).ewTarget : 10;
            simulated[index].wp = ewTarget;
            simulated[index].simulating = true;
            const newResult = optimizeMultiArmy(simulated, 5);
            simulated[index].simulating = false;
            let gain = calcMultiArmyTotalScore(newResult.assignment) - baseScore;
            if(gain <= 0) gain = Math.max(1, Math.round(__aiGetLongterm(hero.id) * 18 - 6));
            gain = Math.round(gain * __aiTypePolicyMult(hero.t, context, 'future') * __aiHeroBias(hero.id, 'future', context, hero.wp) * __aiSynergyBias(hero, roster, ewTarget));
            if(gain > 0){
              unlockResults.push({ id:hero.id, name:hero.name, type:hero.t, gain, roleKey, roleBadge, from:0, to:ewTarget, growthType:{ level:2, axis:'atk', label:'長期投資向き', strong:false }, reasonCodes: __aiSelectReasonCodes(['future', hero.ur ? 'promoted_ur' : '', ewTarget>=30 ? 'lv30' : 'mid_cost', (context && context.investmentType===hero.t && context.shiftStage==='seed') ? __aiTypedPolicyCode('seed', hero.t) : ((context && context.investmentType===hero.t && (context.shiftStage==='shift'||context.shiftStage==='full_shift')) ? __aiTypedPolicyCode('shift', hero.t) : 'hold')], 2), costTierLabel:__aiCostTierLabel(0, ewTarget), safeHintLabel:'' });
            }
            return;
        }

        const ms = getNextMilestone(hero.wp);
        if(!ms) return;
        simulated[index].wp = ms.target;
        simulated[index].simulating = true;  // 覚醒ボーナスを現状のみ反映するフラグ
        const newResult = optimizeMultiArmy(simulated, 5);
        simulated[index].simulating = false;
        let gain = Math.round(calcMultiArmyTotalScore(newResult.assignment) - baseScore);
        if(gain <= 0){
            const delta = Math.max(1, Math.round((wpToPts(ms.target) - wpToPts(hero.wp)) * ((((HERO_DB[hero.id] && HERO_DB[hero.id].meta)||{}).ew === 'SSS') ? 1.15 : 1.0)));
            gain = delta;
        }
        if(gain <= 0) return;

        const cost = ms.cost;
        const costExp = (typeof COST_PENALTY_EXP_PRESET === 'object' && COST_PENALTY_EXP_PRESET[playerType] != null) ? COST_PENALTY_EXP_PRESET[playerType] : 0.52;
        const basePerCost = gain / Math.max(1, Math.pow(cost || 1, costExp));
        const sameMain = hero.t === context.currentCombatType;
        const sameInvest = hero.t === context.investmentType;
        const inMainArmy = context.mainArmyIds.has(hero.id);
        const synergy = __aiSynergyBias(hero, roster, ms.target);
        const formationSynergy = __aiFormationSynergyBias(hero, roster, ms.target, context);
        const matchupBias = __aiMatchupBias(hero, roster, context);
        const tankBranchBias = __aiTankBranchBias(hero, ms.target, { weakness1, weakness2, weakness3, currentCombatType: context.currentCombatType, investmentType: context.investmentType });
        const evalMeta = __aiGetEvalMeta(hero.id);
        const aiProfile = __aiGetAiProfile(hero.id);
        const milestone10EvalFit = (ms.target === 10) ? (evalMeta.milestone10Fit || 1.0) : 1.0;
        const mainTypeBonus = (sameMain ? (aiProfile.mainTypeBonus || 1.0) : 1.0);
        const sharedSynergy = synergy * formationSynergy * matchupBias * tankBranchBias * milestone10EvalFit;

        const scoreCost = basePerCost * __aiTypePolicyMult(hero.t, context, 'cost') * __aiHeroBias(hero.id, 'cost', context, hero.wp) * __aiMilestoneBias(hero.id, ms.target, 'cost') * sharedSynergy * (sameMain ? 1.08 : 0.96) * (inMainArmy ? 1.06 : 1.00) * mainTypeBonus;
        const scoreCoverage = basePerCost * __aiTypePolicyMult(hero.t, context, 'coverage') * __aiHeroBias(hero.id, 'coverage', context, hero.wp) * __aiMilestoneBias(hero.id, ms.target, 'coverage') * sharedSynergy * (sameMain ? 0.96 : 1.06) * (sameInvest ? 1.04 : 1.00) * mainTypeBonus;
        const scoreFuture = basePerCost * __aiTypePolicyMult(hero.t, context, 'future') * __aiHeroBias(hero.id, 'future', context, hero.wp) * __aiMilestoneBias(hero.id, ms.target, 'future') * sharedSynergy * (sameInvest ? 1.10 : 0.96) * mainTypeBonus;
        const efficiency = (scoreCost * weights.cost) + (scoreCoverage * weights.coverage) + (scoreFuture * weights.future);

        const weaknesses = [weakness1, weakness2, weakness3].filter(Boolean);
        const growthType = __aiReasonBadgeFromScores({
            hero, ms, roleKey, context, weaknesses,
            scoreCost, scoreCoverage, scoreFuture
        });
        const safeHintLabel = __aiDisplaySafeLabel(hero, ms, context, growthType, scoreCost, scoreCoverage, scoreFuture);
        const reasonCodes = __aiBuildReasonCodes({ hero, ms, roleKey, context, scoreCost, scoreCoverage, scoreFuture, roster });

        const reinforceMain = 30 * (sameMain ? 1 : 0) + 20 * (inMainArmy ? 1 : 0.4) + 20 * (((weakness1 === 'defense' || weakness2 === 'defense') && roleKey === 'wall') || ((weakness1 === 'attack' || weakness2 === 'attack') && roleKey === 'atk') ? 1 : 0.45) + 15 * (ms.target === 20 ? 1 : (ms.target === 10 ? 0.8 : 0.55)) + 10 * ((sameMain && context.mainTeamMaturity !== 'high') ? 1 : 0.5) + 5 * (sameMain ? 1 : 0.2);
        const reinforceCoverage = 30 * ((__aiCounterMap(context.currentCombatType)[hero.t]) || 0.5) + 25 * (profile.core ? 1 : 0.25) + 20 * Math.min(1.12, synergy * formationSynergy) + 15 * (!sameMain ? 1 : 0.45) + 10 * (ms.target <= 20 ? 1 : 0.55);
        // S6: reinforceFuture に覚醒状況を反映
        const awCtx = context.awakeningCtx || {};
        const heroAwInfo = awCtx[hero.id] || {};
        const awakenFutureBoost = heroAwInfo.awakened
          ? (1.0 + Math.min(0.12, (heroAwInfo.star||0) * 0.03))  // 覚醒済み★数に応じたブースト
          : (typeof AWAKENING_HEROES !== 'undefined' && AWAKENING_HEROES[hero.id] ? 1.04 : 1.0); // 未覚醒だが覚醒対象
        const kimDvaComboBoost = awCtx.kimDvaCombo && (hero.id==='kimberly'||hero.id==='dva') ? 1.06 : 1.0;
        const reinforceFuture = (30 * (sameInvest ? 1 : 0.2) + 25 * (profile.core ? 1 : 0.3) + 20 * __aiGetLongterm(hero.id) + 15 * (context.mainTeamMaturity === 'high' ? 1 : (context.mainTeamMaturity === 'mid' ? 0.7 : 0.35)) + 10 * (ms.target === 30 ? 1 : (ms.target === 20 ? 0.8 : 0.5))) * awakenFutureBoost * kimDvaComboBoost;

        normalResults.push({
            id: hero.id, name: hero.name, type: hero.t,
            from: hero.wp, to: ms.target,
            gain, cost, efficiency,
            roleKey, roleBadge,
            strength: (ms.target>=30 ? 'mega' : (ms.target>=20 ? 'high' : 'mid')),
            growthType,
            reasonCodes,
            costTierLabel: __aiCostTierLabel(hero.wp, ms.target),
            safeHintLabel,
            scoreCost, scoreCoverage, scoreFuture,
            reinforceMain, reinforceCoverage, reinforceFuture
        });
    });

    // isAwakeningItem を normalResults から除外（専用武装ランキングを純粋に保つ）
    normalResults = normalResults.filter(r => !r.isAwakeningItem);
    normalResults.sort((a,b)=> (b.efficiency-a.efficiency) || (b.gain-a.gain));
    unlockResults.sort((a,b)=> b.gain-a.gain);

    // -------------------------------------------------------
    // 覚醒ランキング用データを別途構築（normalResultsには混入させない）
    // キンバリー(Lv30)など EW MAX で次のEW強化がない英雄が対象
    // -------------------------------------------------------
    if (typeof AWAKENING_HEROES !== 'undefined' && typeof loadAwTier !== 'undefined') {
        roster.forEach(hero => {
            const aw = AWAKENING_HEROES[hero.id];
            if (!aw || !aw.milestones) return;
            if (hero.wp < (aw.ewMinRequired || 20)) return; // 前提未達はスキップ
            const awTierStr = loadAwTier(hero.id);
            const at = parseAwTier(awTierStr);
            if (at.star >= 5) return; // 覚醒MAX
            const next = awNextTierCost(awTierStr);
            if (!next) return;

            // スコア上昇量計算
            const BASE_PTS = wpToPts(hero.wp);
            const curBonus  = getAwakeningScoreBonus(hero.id, awTierStr);
            const nextTierStr = next.nextStar + '-' + next.nextTier;
            const nextBonus = getAwakeningScoreBonus(hero.id, nextTierStr);
            const ptGain = Math.round(BASE_PTS * (nextBonus - curBonus));
            if (ptGain <= 0) return;

            // コスト換算（専用かけら×15, 汎用かけら×10 強化石換算）
            const convRate = next.named ? 15 : 10;
            const costEquiv = next.cost * convRate;
            const awCostExp = (typeof COST_PENALTY_EXP_PRESET === 'object' && COST_PENALTY_EXP_PRESET[playerType] != null) ? COST_PENALTY_EXP_PRESET[playerType] : 0.52;
            const efficiency = ptGain / Math.max(1, Math.pow(costEquiv, awCostExp));

            // 重複チェック（同英雄がEWランキングにも出てる場合はawaken版を優先）
            const awItem = {
                id: hero.id,
                name: hero.name || (HERO_DB[hero.id]||{}).name || hero.id,
                type: hero.t,
                gain: ptGain,
                efficiency,
                roleKey: hero.r || 'atk',
                roleBadge: getRoleBadge(hero.r || 'atk'),
                from: hero.wp,
                to: hero.wp, // EW変化なし
                awTierStr,
                nextTierStr, // getAwakeningScoreBonus等の内部キー用（生の'star-tier'形式、表示には使わない）
                nextTierLabel: awStarLabel({ star: next.nextStar, tier: next.nextTier }), // 表示用ラベル
                nextShardCost: next.cost,
                nextShardNamed: next.named,
                isAwakeningItem: true,
                growthType: { level: 3, axis: 'atk', label: '👑 覚醒', strong: true },
                reasonCodes: ['awakening', at.star >= 1 ? 'future' : 'immediate'],
                costTierLabel: costEquiv >= 800 ? '高コスト' : '低コスト',
                safeHintLabel: ''
            };

            awakenResults.push(awItem);
        });
        awakenResults.sort((a,b)=> (b.efficiency-a.efficiency) || (b.gain-a.gain));
    }

    const used = new Set();
    const pickTop = (key, label, axis='bal', roleFilter=null) => {
      const arr = [...normalResults].sort((a,b)=> (b[key]-a[key]) || (b.efficiency-a.efficiency));
      for(const item of arr){
        if(used.has(item.id)) continue;
        const heroRole = (HERO_DB[item.id] || {}).role || '';
        if(roleFilter && heroRole !== roleFilter) continue;
        used.add(item.id);
        // hero の実際のロールから axis を決定（補強候補でも role を反映）
        const effectiveAxis = axis === 'bal'
          ? 'bal'
          : heroRole === 'wall' ? 'wall'
          : heroRole === 'sup'  ? 'sup'
          : heroRole === 'atk'  ? 'atk'
          : axis;
        return { ...item, growthType:{ level:2, axis:effectiveAxis, label, strong:false }, reasonCodes: __aiSelectReasonCodes(item.reasonCodes || [effectiveAxis==='atk' ? 'future' : 'coverage', item.costTierLabel==='高コスト' ? 'high_cost' : 'low_cost'], 2) };
      }
      return null;
    };
    const reinforceList = [];
    const mainPick = pickTop('reinforceMain', '主力強化', 'bal');
    const coveragePick = pickTop('reinforceCoverage', '不利属性の対策', 'wall');
    const futurePick = pickTop('reinforceFuture', '長期投資向き', 'atk');
    if(mainPick) reinforceList.push(mainPick);
    if(coveragePick) reinforceList.push(coveragePick);
    if(futurePick) reinforceList.push(futurePick);

    // おすすめ育成プラン（短期・中期・長期）：
    // 「どの節目（マイルストーン）に到達する投資か」で時間軸を判定する。
    // 武装Lvは0→10→20→30の節目で育成するため、到達先の節目そのものが実際の投資規模を表す。
    // 到達先がLv10の節目=短期、Lv20の節目=中期、Lv30の節目または覚醒=長期。
    // 元の「軸の種類」（主力強化／弱点対策／将来性）はreasonLabelに補足情報として残す。
    const TIMEFRAME_META = {
        short: { label: '🟢 短期で着手', axis: 'green' },
        mid:   { label: '🔵 中期目標',   axis: 'wall'  },
        long:  { label: '🟣 長期投資',   axis: 'purple' },
    };
    reinforceList.forEach(item => {
        item.reasonLabel = (item.growthType && item.growthType.label) || '';
        const toMilestone = item.to || 0;
        if (item.isAwakeningItem) {
            item.timeframe = 'long';
        } else if (toMilestone >= 30) {
            item.timeframe = 'long';   // Lv30の節目 = 長期
        } else if (toMilestone >= 20) {
            item.timeframe = 'mid';    // Lv20の節目 = 中期
        } else {
            item.timeframe = 'short';  // Lv10の節目（またはそれ以下） = 短期
        }
        const tfMeta = TIMEFRAME_META[item.timeframe];
        item.growthType = { level: 2, axis: tfMeta.axis, label: tfMeta.label, strong: (item.timeframe === 'long') };
    });

    return { normal: normalResults, unlock: unlockResults, awaken: awakenResults, weakness1, weakness2, weakness3, reinforceList };
}


// ================= 要約バー =================
function updateSummaryBar(result, effData){
    const el = $id('summary-bar');
    if(!el) return;

    // 10人未満の時
    if(!result || !effData){
        el.innerHTML = "まだデータが足りません（10人以上配置すると要約が表示されます）。";
        return;
    }

    // 最優先候補（効率ランキングの1位）
    const top = (effData.normal && effData.normal.length) ? effData.normal[0] : null;
    const weak1 = effData.weakness1 || "balance";

    const needText = (w) => {
        // 1軍の傾向（AIコメント風）
        return getWeaknessBadge(w);
    };

    if(!top){
        el.innerHTML = `
            <div class="summary-grid">
                <div style="flex:1; min-width:220px;">
                    <div class="summary-title">1軍の状態</div>
                    <div class="summary-main">${needText(weak1)}</div>
                    <div class="summary-sub">（育成優先ランキングが出ない状態です）</div>
                </div>
            </div>`;
        return;
    }

    // バッジ文言（数値は見せない）
    let badge = "効果あり";
    if(top.strength === "mega") badge = "効果絶大";
    else if(top.strength === "high") badge = "効果大";
    else if(top.strength === "mid") badge = "効果中";
    else if(top.strength === "low") badge = "まず様子見";

    const roleLabel = (top.roleKey === "atk") ? "火力" : (top.roleKey === "wall") ? "耐久" : "サポート";
    const reasonBadges = Array.isArray(top.reasonCodes) ? __aiSelectReasonCodes(top.reasonCodes, 2).map(reasonCodeBadge).join('') : '';
    const summaryText = __buildRecommendationSummary(top);

    el.innerHTML = `
        <div class="summary-grid">
            <div style="flex:1; min-width:0;">
                <div class="summary-title">⭐ 次の育成目標</div>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:3px;">
                  <span class="summary-main" style="font-size:var(--fs-lg);">${top.name}</span>
                  <span style="font-size:var(--fs-xs);background:#eff6ff;color:#1d4ed8;border-radius:5px;padding:2px 7px;font-weight:900;white-space:nowrap;">${roleLabel}強化</span>
                  <span style="font-size:var(--fs-xs);background:#f0fdf4;color:#15803d;border-radius:5px;padding:2px 7px;font-weight:900;white-space:nowrap;">${badge}</span>
                </div>
                <div class="summary-sub">目標 EW Lv${top.to}${summaryText ? '：' + escapeHtml(summaryText) : ''}</div>
                ${reasonBadges ? `<div style="margin-top:5px;display:flex;gap:4px;flex-wrap:wrap;">${reasonBadges}</div>` : ''}
            </div>
        </div>`;
}

function getPriorityLabel(p, minPercent){
    return "";
}

function getColor(percent, base){
    if(percent < 40) return "#ef4444";
    if(percent < 60) return "#f59e0b";
    return base;
}

// ===============================
// 🎯 部隊強化指針（部隊間の投資バランスアドバイス）
// 「1軍が十分育ったら2軍へ」という段階的投資の指針
// ===============================
// 「部隊強化の指針」パネルは削除済み。ここで計算していたボトルネック・控え昇格候補の情報は、
// テキストパネルの代わりに編成カード自体への視覚マーキング（枠線＋アイコンバッジ）として表示する。
function updateArmyGuide() {
  // 全軍のスコアと進行度を取得
  const armies = [1, 2, 3].map(s => {
    const prog = computeDisplayedArmyProgress(s);
    const members = collectArmyMembersForProgress(s);
    // 最もEW Lvが低いメンバー（育成の遅れている人）
    const weakest = members.length
      ? members.slice().sort((a, b) => a.wp - b.wp)[0]
      : null;
    return { s, prog, members, weakest, filled: members.length };
  });

  // 10人未満ならマーキング不要（クリアだけ行う）
  const totalFilled = armies.reduce((sum, a) => sum + a.filled, 0);
  if (totalFilled < 10) {
    __applyArmyGuideCardMarks([], []);
    return;
  }

  // 控えから昇格候補を検出（各軍の最弱メンバーより明確に強い控えがいるか）
  const benchCandidates = [];
  for (let p = 1; p <= 10; p++) {
    const id  = ($id(`h-4-${p}`) || {}).value;
    const wp  = parseInt(($id(`w-4-${p}`) || {}).value) || 0;
    if (!id || id === 'empty' || !HERO_DB[id]) continue;
    armies.forEach(army => {
      if (!army.weakest) return;
      if (wp > army.weakest.wp + 5) {
        benchCandidates.push({
          id, wp, squad: army.s,
          weakestId: army.weakest.id,
          weakestWp: army.weakest.wp,
          gain: wp - army.weakest.wp,
        });
      }
    });
  }
  // 同一(id+squad)で最大gainのみ残す
  const bestBench = {};
  benchCandidates.forEach(c => {
    const key = `${c.id}-${c.squad}`;
    if (!bestBench[key] || c.gain > bestBench[key].gain) bestBench[key] = c;
  });
  const topBench = Object.values(bestBench).sort((a, b) => b.gain - a.gain).slice(0, 3);

  __applyArmyGuideCardMarks(armies, topBench);
}

// 「部隊強化の指針」の情報（ボトルネック・控え昇格候補）を、テキストパネルではなく
// 編成カード自体に視覚マーキング（枠線＋アイコンバッジ）として反映する。
// 1〜3軍の全カードのマークをまず一旦クリアしてから、最新の判定結果を再適用する。
function __applyArmyGuideCardMarks(armies, topBench){
    try {
        // 既存マークを全クリア（1〜4軍・控え全スロット）
        // ※実際に表示されているのはslot-tile（renderSlots）。interactive-card（squad-container）は
        //   非表示パネル内のレガシーDOMのため対象外。
        for (let s = 1; s <= 4; s++) {
            const slotCount = (s === 4) ? 10 : 5;
            for (let p = 1; p <= slotCount; p++) {
                const tile = $id(`slot-tile-${s}-${p}`);
                if (tile) tile.classList.remove('card-bottleneck', 'card-promote-candidate');
            }
        }

        // ボトルネック（各軍の最弱メンバー）に枠線
        (armies || []).forEach(army => {
            if (!army.weakest || army.filled < 3) return;
            const p = army.weakest.p;
            if (!p) return;
            const tile = $id(`slot-tile-${army.s}-${p}`);
            if (tile) tile.classList.add('card-bottleneck');
        });

        // 控えから昇格候補：配置先の最弱メンバー（入替対象）に枠線
        (topBench || []).forEach(c => {
            const targetArmy = (armies || []).find(a => a.s === c.squad);
            if (!targetArmy || !targetArmy.weakest) return;
            const p = targetArmy.weakest.p;
            if (!p) return;
            const tile = $id(`slot-tile-${c.squad}-${p}`);
            if (tile) tile.classList.add('card-promote-candidate');
        });
    } catch(e) {}
}

function renderProgress(percent, baseColor){
    const color = getColor(percent, baseColor);
    return `
    <div class="progress-wrap">
        <div class="progress-bar">
            <div class="progress-fill" style="width:${percent}%; background:${color};"></div>
        </div>
        <div class="progress-label">
            進行度 <span class="progress-label-value" style="color:${color};">${percent}%</span>
        </div>
    </div>`;
}

function armyCard(title, content, baseColor, roleTag, progressPercent, minPercent, buffCount) {
    let buffText = "";
    if (buffCount === 5) buffText = `<span class="buff-pill buff-pill-5">🏆20%バフ</span>`;
    else if (buffCount === 4) buffText = `<span class="buff-pill buff-pill-4">🚜15%バフ</span>`;
    else if (buffCount === 3) buffText = `<span class="buff-pill buff-pill-3">⚠️5%バフ</span>`;

    return `
    <div class="army-card" style="border-left-color:${baseColor};">
        <div class="army-card-title">
            ${title} ${buffText} ${getPriorityLabel(progressPercent, minPercent)}
        </div>
        ${renderProgress(progressPercent, baseColor)}
        <div class="army-card-role">
            ${roleTag}
        </div>
        <div class="army-card-body">
            ${content}
        </div>
    </div>`;
}

function generateAiSuggestion() {
    let roster = []; 
    for(let s=1; s<=4; s++) for(let p=1; p<=(s===4?10:5); p++) {
        let id = $id(`h-${s}-${p}`).value; if(id==='empty') continue;
        let wp = parseInt($id(`w-${s}-${p}`).value)||0;
        let h = HERO_DB[id];
        roster.push({ id, s, p, wp, t: h.type, r: h.role, ur: h.ur, name: h.name, pr: h.priority });
    }
    
    let pool = roster.filter(h => h.id !== 'empty');
    if(pool.length < 10) {
        $id('ai-result').innerHTML = "<div style='font-size:var(--fs-lg); color:#475569;'>最低10人以上配置すると、自動的に全軍の最適化結果が表示されます。</div>"; 
        $id('eff-result').innerHTML = "<div style='font-size:var(--fs-lg); color:#475569;'>最低10人以上配置してください。</div>";
        updateSummaryBar(null, null);
        return;
    }

    let result = optimizeMultiArmy(pool, 5);
    previousAssignment = result.assignment;

    let effData = calculateUpgradeEfficiencyFull(pool);

    // 🥇 要約バー更新
    updateSummaryBar(result, effData);
    // 進行度バー＆兵種バフ（画像の見た目に合わせる）
    try{
        const s1 = result.weightedScores.army1 || 0;
        const s2 = result.weightedScores.army2 || 0;
        const s3 = result.weightedScores.army3 || 0;
        const maxScore = Math.max(s1, s2, s3, 1);
        const p1 = Math.round((s1 / maxScore) * 100);
        const p2 = Math.round((s2 / maxScore) * 100);
        const p3 = Math.round((s3 / maxScore) * 100);
        const minPercent = Math.min(p1, p2, p3);

        const weakText = (w) => {
            // 進行度タグ用：不足時だけ強めに目立つ
            return getWeaknessBadge(w);
        };

        const colorOf = (pct, base) => {
            if(pct < 40) return "#ef4444";
            if(pct < 60) return "#f59e0b";
            return base;
        };

        
        // ⚠️ 注意：このdetailedDiagと、別の場所にあるdetectArmyWeaknessFromDetail（スコア比率ベース）は
        // 評価軸が異なる2つの弱点判定ロジック。両方とも同じDOM要素（slot-eval-1/2/3）を更新するため、
        // 実行順序によって表示が変わりうる（generateAiSuggestion実行時はこちらが最終的に反映される）。
        // 新しい判定条件を追加する際は、もう一方のロジックとの整合性も確認すること。
        // 過去の教訓：前衛1人のケースで両者が矛盾した判定を出していた（武装Lv差だけでは
        // 「前衛の人数が少ない」という構造的弱点を検出できなかったため）。
        const detailedDiag = (armyArr, fallbackWeak) => {
            const list = (armyArr || []).filter(h => h && h.id && h.id !== 'empty' && !h.ur);
            const avg = (arr) => arr.length ? (arr.reduce((a,x)=>a + (parseInt(x.wp)||0), 0) / arr.length) : 0;

            const atk = list.filter(h => h.r === 'atk');
            const wall = list.filter(h => h.r === 'wall');
            const avgAll = avg(list);
            const avgAtk = avg(atk);
            const avgWall = avg(wall);

            let key = fallbackWeak || 'balance';
            let level = '中';

            // 役割の欠損・不足は最優先で判定（武装Lv差だけでは検出できない構造的弱点）
            if(wall.length === 0){
                key = 'defense'; level = '大';
            }else if(atk.length === 0){
                key = 'attack'; level = '大';
            }else if(wall.length === 1){
                // 前衛1人は「武装Lvが高くても崩れやすい」構造的弱点。武装Lv差の判定より優先する。
                key = 'defense'; level = '中';
            }else{
                const diff = avgAtk - avgWall; // +なら盾が遅れてる（耐久不足）
                if(diff >= 6){
                    key = 'defense';
                    level = (diff >= 12) ? '大' : (diff >= 8) ? '中' : '小';
                }else if(diff <= -6){
                    key = 'attack';
                    level = (diff <= -12) ? '大' : (diff <= -8) ? '中' : '小';
                }else{
                    key = 'balance';
                    level = (avgAll >= 20) ? '高' : (avgAll >= 12) ? '中' : '低';
                }

                // 絶対値が低い場合は段階を引き上げ
                if(key === 'defense'){
                    if(avgWall < 8) level = '大';
                    else if(avgWall < 12 && level === '小') level = '中';
                }
                if(key === 'attack'){
                    if(avgAtk < 8) level = '大';
                    else if(avgAtk < 12 && level === '小') level = '中';
                }
            }

            const label = (key === 'defense')
                ? (level === '大' ? '前衛が手薄' : level === '中' ? '耐久やや不足' : '耐久微不足')
                : (key === 'attack')
                ? (level === '大' ? '火力が不足' : level === '中' ? '火力やや不足' : '火力微不足')
                : (level === '高' ? 'バランス良好' : level === '中' ? 'バランス普通' : '全体的に育成中');
            return { key, level, label };
        };

        const setEval = (armyNo, pct, baseColor, tagHtml, buffCount) => {
            const el = document.getElementById(`slot-eval-${armyNo}`);
            if(!el) return;

            let buff = "";
            if (buffCount === 5) buff = "✅ 兵種バフ20%";
            else if (buffCount === 4) buff = "🔶 兵種バフ15%";
            else if (buffCount === 3) buff = "⚠️ 兵種バフ5%";

            const c = colorOf(pct, baseColor);

            const buffSpan = buff ? `<span class="buff-badge">${buff}</span>` : "";

            el.innerHTML =
              '<div class="row">' +
                '<div class="tag">' + tagHtml + '</div>' +
                '<div class="pct" title="各英雄のロール別目標EWへの平均到達度">達成率 <span style="color:' + c + ';">' + pct + '%</span></div>' +
              '</div>' +
              (buffSpan ? ('<div class="row sub">' + buffSpan + '</div>') : '') +
              '<div class="bar"><div style="width:' + pct + '%; background:' + c + ';"></div></div>';
        };

        const d1 = detailedDiag(result.assignment.army1, effData.weakness1);
        const d2 = detailedDiag(result.assignment.army2, effData.weakness2);
        const d3 = detailedDiag(result.assignment.army3, effData.weakness3 || 'balance');

        setEval(1, p1, "#10b981", '📊 ' + d1.label, result.maxCounts.army1);
        setEval(2, p2, "#3b82f6", '📊 ' + d2.label, result.maxCounts.army2);
        setEval(3, p3, "#8b5cf6", '📊 ' + d3.label, result.maxCounts.army3);
    }catch(e){}


    // ✅ 3軍総合最適化結果カードは表示しない（入力UI=slotタイルを主役にする）
    $id('ai-result').innerHTML = `
      <div style="font-size:var(--fs-lg); color:#475569; line-height:1.6;">
        上の <b>編成（キャラ枠タップで編集）</b> がそのまま評価画面です。<br>
        最適化案を反映したい場合は、下のボタンで <b>自動反映</b> できます。
      </div>
      <button class="apply-btn" onclick="applyMultiArmy()">この最強編成を自動反映する</button>
    `;


    let effOut = "";

    
if(effData.normal.length > 0){
        const TOP_N = 3;
        const MORE_MAX = 10;

        effOut += `
        <div style="background:#fdf4ff; border:1px solid #fbcfe8; padding:12px; border-radius:10px;">
            <div style="font-weight:900; color:#a21caf; margin-bottom:8px; font-size:var(--fs-xl);"></div>
            ${holdPinnedSummaryHtml(effData.normal)}`;

        // Top3（おすすめ）
        effData.normal.slice(0, TOP_N).forEach((item,i)=>{
            effOut += topRankCardHtml(i+1, item, { isBest:(i===0) });
        });

        // もっと見る（任意）
        if(effData.normal.length > TOP_N){
            let moreList = "";
            effData.normal.slice(TOP_N, Math.min(effData.normal.length, MORE_MAX)).forEach((item,idx)=>{
                let rank = TOP_N + idx + 1;
                moreList += topRankCardHtml(rank, item, { compact:true });
            });

            effOut += `
            <div id="eff-more-list" data-open="0" style="display:none; margin-top:6px;">
                ${moreList}
            </div>
            <button id="eff-more-btn" onclick="toggleEffMore()" class="gear-save-btn">
                もっと見る（おすすめ）
            </button>`;
        }

        effOut += "</div>";
    }

    if(effData.reinforceList && effData.reinforceList.length > 0){
        effOut += `
        <div class="best-card-box">
            <div style="font-weight:900; color:#ea580c; margin-bottom:4px; font-size:var(--fs-lg);">
                📅 おすすめ育成プラン（短期・中期・長期）
            </div>
            <div style="font-size:var(--fs-xs);color:#94a3b8;margin-bottom:8px;">
                今の編成を踏まえて、すぐ着手できるもの・中期目標・長期投資の3つを提案します。
            </div>`;

        effData.reinforceList.forEach((r,i)=>{
            effOut += reinfCardHtml(i+1, r);
        });
        effOut += `</div>`;
    }

    // 専用武装育成候補セクション削除（S6以降は育成ランキングに統合済み）
    // unlock英雄はnormalResultsに自動混在して評価される

    $id('eff-result').innerHTML = effOut || "<div style='color:#475569; font-size:var(--fs-lg);'>強化可能なキャラがいません。</div>";

    // -------------------------------------------------------
    // 覚醒ランキングパネルを描画
    // -------------------------------------------------------
    renderAwakenRanking(effData.awaken || []);
}

// ===============================================================
// ===============================================================
// 覚醒ランキング 3軸評価（コミュニティメタ反映版）
// 軸1: 即効性 - 今すぐ戦力になるか
// 軸2: コスパ - シャード1個あたりの戦力上昇
// 軸3: 将来性 - 長期的な戦力増加の大きさ（powerGain）
// ※ シナジー（編成との相乗効果）は別途カード内の「🤝 ○○あり」表示で提示
// ===============================================================

// ===============================================================
// 覚醒マイルストーン定義
// 「未覚醒→★0-1解放」「★0-5→★1到達」のような
// 実際にプレイヤーが意識する節目単位で評価
// コスト・戦力増加・優先度をコミュニティ検証値で設定
// 出典: packsify.com, cpt-hedge.com, ldshop.gg, Reddit r/LastWarSurvival
// ===============================================================
// ===============================================================
// マイルストーン定義
// starMin/starMax: この範囲の★にいるプレイヤーが対象
// to: 目標の内部キー（star-tier形式）
// toLabel: 表示用目標名
// ===============================================================
// 現在の覚醒状態から次のマイルストーンを取得
function getNextMilestone_aw(heroId, awTierStr) {
  const milestones = (AWAKENING_HEROES[heroId] || {}).milestones;
  if (!milestones) return null;
  const at = parseAwTier(awTierStr);
  // {star:N, tier:5} は {star:N+1, tier:0}（次の★に到達した状態）と同値。
  // starMin/starMax の範囲判定は「到達した★そのもの」を基準にするため、ここで正規化する。
  const currentStar = (at.star >= 0 && at.tier === 5) ? at.star + 1 : at.star; // -1=未覚醒, 0〜5=★0〜5

  for (const ms of milestones) {
    if (currentStar >= ms.starMin && currentStar <= ms.starMax) {
      // 目標に既に到達しているか確認
      const toAt = parseAwTier(ms.to);
      if (currentStar > toAt.star) continue;          // 既に超えている
      if (currentStar === toAt.star && at.tier >= toAt.tier && at.tier !== 5) continue; // 同★で到達済み（tier=5は正規化済みなので除外）
      return ms;
    }
  }
  return null; // MAX
}

// 現在の★数から次のマイルストーンまでの残りシャード数を計算
// 例: キンバリーが★1-3にいて★3到達を目指す場合
//   ★1-3→★1-5: 40×2=80
//   ★2-1→★2-5: 70×5=350
//   合計: 430枚
function calcRemainingShards(awTierStr, targetTierStr) {
  const at  = parseAwTier(awTierStr);
  const to  = parseAwTier(targetTierStr);
  if (at.star < 0) return null; // 未覚醒は専用かけら固定なのでここでは計算しない
  if (to.star < 0) return 0;
  if (at.star > to.star || (at.star === to.star && at.tier >= to.tier)) return 0; // 既に目標到達済み

  let total = 0;

  // 同じ★内の残りティア
  if (at.star === to.star) {
    const remaining = to.tier - at.tier;
    if (remaining <= 0) return 0;
    total += remaining * (AW_SHARD_PER_TIER[at.star] || 20);
    return total;
  }

  // 現在★の残りティア
  const tierInCurrentStar = 5 - at.tier;
  total += tierInCurrentStar * (AW_SHARD_PER_TIER[at.star] || 20);

  // 中間★を全部通過
  for (let s = at.star + 1; s < to.star; s++) {
    total += 5 * (AW_SHARD_PER_TIER[s] || 20);
  }

  // 目標★のティア分
  if (to.tier > 0) {
    total += to.tier * (AW_SHARD_PER_TIER[to.star] || 20);
  }

  return total;
}

function calcAwakenScore(heroId, awTierStr, roster) {
  const ms = getNextMilestone_aw(heroId, awTierStr);
  if (!ms) return null; // MAX or 未対応

  // 編成シナジー補正（1軍メンバーのみで計算）
  const squad1 = roster ? roster.filter(h => {
    // 1軍のIDを取得して絞り込み
    try {
      for (let p=1;p<=5;p++) {
        const el = document.getElementById('h-1-'+p);
        if (el && el.value === h.id) return true;
      }
    } catch(e) {}
    return false;
  }) : [];
  const main = squad1.length >= 3 ? squad1 : (roster || []);

  let synergyBonus = 0;
  let synergyNote  = '';
  if (heroId === 'kimberly') {
    const hasFront2  = main.filter(h=>h.t==='tank'&&h.r==='wall').length >= 2;
    const hasMarshall= main.some(h=>h.id==='marshall');
    if (hasFront2)   { synergyBonus += 2; synergyNote += '前衛2枚あり'; }
    if (hasMarshall) { synergyBonus += 1; synergyNote += (synergyNote?'・':'')+'マーシャルあり'; }
  }
  if (heroId === 'dva') {
    const kimAw = parseAwTier(loadAwTier('kimberly'));
    if (kimAw.star >= 0) { synergyBonus += 3; synergyNote += 'キム覚醒済み'; }
    const airCount = main.filter(h=>h.t==='air').length;
    if (airCount >= 2)   { synergyBonus += 1; synergyNote += (synergyNote?'・':'')+'航空'+airCount+'体(1軍)'; }
  }
  if (heroId === 'tesla') {
    const hasFiona = main.some(h=>h.id==='fiona');
    const misCount = main.filter(h=>h.t==='mis').length;
    if (hasFiona)          { synergyBonus += 3; synergyNote += 'フィオナあり'; }
    if (misCount >= 3)     { synergyBonus += 2; synergyNote += (synergyNote?'・':'')+'ロケラン'+misCount+'体(1軍)'; }
    else if (misCount >= 2){ synergyBonus += 1; synergyNote += (synergyNote?'・':'')+'ロケラン'+misCount+'体(1軍)'; }
  }
  const synergy = Math.min(10, 5 + synergyBonus);

  // 戦力増加の大きさを数値に変換
  const powerMap = { xlarge:10, large:8, mid:6, small:4 };
  const powerVal = powerMap[ms.powerGain] || 6;

  // 総合スコア（コスパ40%・即効性30%・戦力増加20%・シナジー10%）
  const total = ms.costpa*0.40 + ms.immediacy*0.30 + powerVal*0.20 + synergy*0.10;

  // 現在位置から次マイルストーンまでの残りシャードを計算
  let remainingShards = ms.shardCost; // デフォルトはマイルストーン固定値
  let remainingNamed  = ms.named;
  if (!ms.named && ms.to && awTierStr !== 'none' && awTierStr !== ms.from) {
    // 解放後で、現在位置がマイルストーム開始点と異なる場合は差分計算
    const toAt = parseAwTier(ms.to.replace('★',''));
    const calc = calcRemainingShards(awTierStr, ms.to.replace('★',''));
    if (calc !== null && calc > 0) remainingShards = calc;
  }
  // 「現在★X-Y → 目標★N まであとN枚」の表示用文字列
  const atNow = parseAwTier(awTierStr);
  const nowLabel = awStarLabel(atNow);
  const goalAt = parseAwTier(ms.to);
  const goalLabel = ms.toLabel || (goalAt.tier === 5 ? `★${goalAt.star + 1}${goalAt.star === 4 ? 'MAX' : ''}` : '★' + ms.to);
  const shardDisp = remainingNamed
    ? `${nowLabel} → ${goalLabel}（専用かけら×${remainingShards}）`
    : `${nowLabel} → ${goalLabel}（あと${remainingShards}枚）`;

  return {
    total,
    costpa:    ms.costpa,
    immediacy: ms.immediacy,
    powerGain: powerVal,
    synergy,
    synergyNote: synergyNote.trim() || '',
    note:    ms.note,
    verdict: ms.verdict,
    msLabel: ms.label,
    fromStr: ms.from,
    toStr:   ms.to,
    shardCost:  remainingShards,
    shardDisp,
    nowLabel,       // 現在の★表示（例：★1-3）
    goalLabel,      // 目標の★表示（例：★3）
    named:      remainingNamed,
  };
}

function renderAwakenRanking(awakenResults) {
    const panel  = document.getElementById('awaken-rank-panel');
    const result = document.getElementById('awaken-rank-result');
    if (!panel || !result) return;
    if (!awakenResults || awakenResults.length === 0) {
        panel.style.display = 'none';
        return;
    }
    panel.style.display = 'block';

    const heroNames = { kimberly:'キンバリー', dva:'DVA', tesla:'テスラ' };

    // 全ロースターを取得（シナジー計算用）
    const rosterForSynergy = (() => {
        try {
            const r = [];
            for (let s=1;s<=3;s++) for (let p=1;p<=5;p++) {
                const id = ($id(`h-${s}-${p}`)||{}).value;
                const wp = parseInt(($id(`w-${s}-${p}`)||{}).value)||0;
                if (id && id !== 'empty' && HERO_DB[id]) r.push({ id, wp, t:HERO_DB[id].type, r:HERO_DB[id].role });
            }
            return r;
        } catch(e) { return []; }
    })();

    // 3軸スコアを計算してソート
    const scored = awakenResults.map(item => {
        const sc = calcAwakenScore(item.id, item.awTierStr, rosterForSynergy);
        return { ...item, sc };
    }).filter(x => x.sc).sort((a,b) => b.sc.total - a.sc.total);

    let html = '';
    scored.forEach((item, i) => {
        const rank   = i + 1;
        const isBest = rank === 1;
        const sc     = item.sc;
        const aw     = AWAKENING_HEROES[item.id];
        const name   = heroNames[item.id] || item.name;
        const heroImg = `img/${item.id}.webp`;

        // コスト表示
        const shardLabel = sc.named
            ? `🔑 専用かけら×${sc.shardCost}`
            :  `<img src="img/kakusei.webp"
            style="width:34px;height:34px;vertical-align:-2px;margin-right:3px;"
            alt=""> ×${sc.shardCost}`;

        // 3軸バー（直感的な絵文字+ドット形式、10段階表示）
        const bar = (val, color, label, icon) => {
            const dots = [1,2,3,4,5,6,7,8,9,10].map(d =>
                `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;
                 background:${d <= Math.round(val) ? color : '#e2e8f0'};
                 flex-shrink:0;"></span>`
            ).join('');
            const levelLabel = val >= 9 ? '最高' : val >= 7 ? '高い' : val >= 5 ? '普通' : '低め';
            return `<div class="ucard-bar-row">
              <span class="ucard-bar-label">${icon} ${label}</span>
              <div style="display:flex;gap:2px;align-items:center;flex-shrink:0;">${dots}</div>
              <span class="ucard-bar-val" style="color:${color};font-size:var(--fs-xxs);">${Math.round(val)}/10 ${levelLabel}</span>
            </div>`;
        };

        html += `
        <div class="ucard ${isBest?'ucard--best':'ucard--awaken'}">
          <div class="ucard-row">
            <div class="ucard-avatar">
              <div class="ucard-rank">${rank}位</div>
              <div class="ucard-avatar-img">
                <img src="${heroImg}" onerror="this.style.opacity=0">
              </div>
            </div>
            <div class="ucard-body">
              <div class="ucard-header">
                <span class="ucard-name">${name}</span>
                <span class="awaken-ms-badge">目標 ${sc.goalLabel}</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:3px;">
                <!-- かけら行 -->
                <div><span style="background:#f8fafc;color:#374151;border:1px solid #e2e8f0;border-radius:5px;padding:2px 7px;font-size:var(--fs-xs);font-weight:700;">${shardLabel}</span></div>
                <!-- 編成相性行 -->
                ${sc.synergyNote ? `<div><span style="background:#f5f3ff;color:#6d28d9;border:1px solid #ddd6fe;border-radius:5px;padding:2px 7px;font-size:var(--fs-xs);font-weight:700;">🤝 ${sc.synergyNote}</span></div>` : ''}
              </div>
              <div class="ucard-summary">${sc.note}</div>
              <div class="ucard-bars">
                ${bar(sc.immediacy,'#3b82f6','即効性','⚡')}
                ${bar(sc.costpa,   '#10b981','コスパ','💎')}
                ${bar(sc.powerGain,'#f97316','将来性','📈')}
              </div>
              <details class="ucard-details">
                <summary>💬 海外ガチ勢の評価 ▼</summary>
                <div class="ucard-details-body">${sc.verdict}</div>
              </details>
            </div>
          </div>
        </div>`;
    });

    result.innerHTML = html || '<div style="color:#374151;font-size:var(--fs-lg);">覚醒対象英雄が見つかりません。</div>';
}

function applyMultiArmy() {
    let data = previousAssignment;
    let setSquad = (s, squadArray) => {
        let walls = squadArray.filter(h => HERO_DB[h.id].role === 'wall').sort((a,b) => b.wp - a.wp);
        let others = squadArray.filter(h => HERO_DB[h.id].role !== 'wall').sort((a,b) => b.wp - a.wp);
        let ordered = [...walls, ...others];
        
        for(let i=1; i<=5; i++) {
            let h = ordered[i-1];
            if(h) {
                $id(`h-${s}-${i}`).value = h.id;
                $id(`w-${s}-${i}`).value = h.wp;
            } else {
                $id(`h-${s}-${i}`).value = 'empty';
                $id(`w-${s}-${i}`).value = 0;
            }
        }
    };

    setSquad(1, data.army1);
    setSquad(2, data.army2);
    setSquad(3, data.army3);

    for(let i=1; i<=10; i++) {
        let h = data.bench[i-1];
        if(h) {
            $id(`h-4-${i}`).value = h.id;
            $id(`w-4-${i}`).value = h.wp;
        } else {
            $id(`h-4-${i}`).value = 'empty';
            $id(`w-4-${i}`).value = 0;
        }
    }

    updateAllSquads();
    try { saveAllData(); } catch(e) {}
    try { renderPresetPanel(); } catch(e) {}
    showToast("🔄 最強の編成を反映しました！");
}



// 編成データ（キャラ選択・武装Lv・メタ設定等）をlocalStorageに保存する。
// loadAllData() が読み込むフィールドと完全に対になっている必要がある。
// スロット編集の反映時など、編成データが変わるタイミングで必ず呼ぶこと。
function saveAllData() {
  try {
    let d = {};
    for (let s = 1; s <= 4; s++) {
      for (let p = 1; p <= (s === 4 ? 10 : 5); p++) {
        const hEl = $id(`h-${s}-${p}`);
        const wEl = $id(`w-${s}-${p}`);
        if (hEl) d[`h-${s}-${p}`] = hEl.value;
        if (wEl) d[`w-${s}-${p}`] = wEl.value;
      }
    }
    const metaEl = $id('current-meta');
    if (metaEl) d['current-meta'] = metaEl.value;
    const powTank = $id('pow-tank');
    const powAir = $id('pow-air');
    const powMis = $id('pow-mis');
    if (powTank) d['pow-tank'] = powTank.value;
    if (powAir) d['pow-air'] = powAir.value;
    if (powMis) d['pow-mis'] = powMis.value;

    localStorage.setItem('lw_sim_v24_final', JSON.stringify(d));
  } catch(e) {
    console.error('saveAllData failed:', e);
  }
}

function loadAllData() {
  let sv = localStorage.getItem('lw_sim_v24_final') || localStorage.getItem('lw_sim_v23_final'); 
  let d = {};
  if(sv){
    try { d = JSON.parse(sv) || {}; } catch(e){ d = {}; }
  }

  // （ここから下は今の処理をそのまま）
  for(let s=1; s<=4; s++) {
    for(let p=1; p<=(s===4?10:5); p++) { 
      if(d[`h-${s}-${p}`]) $id(`h-${s}-${p}`).value = d[`h-${s}-${p}`]; 
      if(d[`w-${s}-${p}`]) $id(`w-${s}-${p}`).value = d[`w-${s}-${p}`]; 
    }
  }

  // 装備データ読み込み削除済み

  if(d['current-meta']) $id('current-meta').value = d['current-meta'];
  if(d['pow-tank'] !== undefined && $id('pow-tank')) $id('pow-tank').value = d['pow-tank'];
  if(d['pow-air'] !== undefined && $id('pow-air')) $id('pow-air').value = d['pow-air'];
  if(d['pow-mis'] !== undefined && $id('pow-mis')) $id('pow-mis').value = d['pow-mis'];

  // ✅ ここは必ず実行される
  updateAllSquads();
  // gear処理削除済み
}


// ================= 統合スロットUI =================
let __slotModalState = { s:1, p:1, lv:0, awTier:'none' }; // awTier: 'star-tier' 例 '0-1'=★0-1, '2-3'=★2-3, 'none'=未覚醒

// 現在のフィルター状態
let __heroFilter = 'all';

function buildSlotHeroOptions(filter) {
    filter = filter || __heroFilter || 'all';
    const sel = document.getElementById('slot-modal-hero');
    if (!sel) return;
    const currentVal = sel.value; // 選択中の値を保持

    const typeLabel = { tank:'⚔️ 戦車', air:'✈️ 航空', mis:'🚀 ロケラン' };
    const awakenIds = new Set(Object.keys(AWAKENING_HEROES || {}));

    let opts = '<option value="empty">未設定</option>';
    const groups = { tank:[], air:[], mis:[] };

    Object.keys(HERO_DB).forEach(k => {
        const h = HERO_DB[k];
        // フィルター適用
        if (filter === 'tank'   && h.type !== 'tank') return;
        if (filter === 'air'    && h.type !== 'air')  return;
        if (filter === 'mis'    && h.type !== 'mis')  return;
        if (filter === 'awaken' && !awakenIds.has(k)) return;
        const label = h.name + (h.ur ? ' (UR)' : '') + (awakenIds.has(k) ? ' 👑' : '');
        groups[h.type].push(`<option value="${k}">${label}</option>`);
    });

    const mk = (title, arr) => arr.length ? `<optgroup label="${title}">${arr.join('')}</optgroup>` : '';
    opts += mk(typeLabel.tank, groups.tank) + mk(typeLabel.air, groups.air) + mk(typeLabel.mis, groups.mis);
    sel.innerHTML = opts;

    // 以前の選択を復元（フィルターで非表示になる場合はemptyに）
    if (currentVal && sel.querySelector(`option[value="${currentVal}"]`)) {
        sel.value = currentVal;
    } else {
        sel.value = 'empty';
    }
}

function filterHeroes(filter) {
    __heroFilter = filter;
    // ボタンのアクティブ状態を切り替え
    document.querySelectorAll('.hero-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    buildSlotHeroOptions(filter);
}

function renderSlots(){
    // 1〜3軍は5枠、控えは10枠
    const configs = [
        {s:1, n:5, el:'slot-tiles-1'},
        {s:2, n:5, el:'slot-tiles-2'},
        {s:3, n:5, el:'slot-tiles-3'},
        {s:4, n:10, el:'slot-tiles-4'}
    ];
    configs.forEach(cfg=>{
        const wrap = document.getElementById(cfg.el);
        if(!wrap) return;
        let html = '';
        for(let p=1; p<=cfg.n; p++){
            const hEl = document.getElementById(`h-${cfg.s}-${p}`);
            const wEl = document.getElementById(`w-${cfg.s}-${p}`);
            if(!hEl || !wEl){
                // まだ初期化前
                continue;
            }
            const id = hEl.value || 'empty';
            const h = HERO_DB[id] || {name:"未設定", type:"none", role:"none", ur:false, priority:0};
            const lvRaw = wEl.value;
            const lv = (typeof lvRaw === 'string' && (lvRaw.includes('未') || lvRaw === '-' )) ? 0 : (parseInt(lvRaw)||0);
            const isEmpty = (id === 'empty');
            const shortName = (h.name || '未設定').substring(0,3);

            if(isEmpty){
                html += `
                <div class="slot-tile slot-empty" id="slot-tile-${cfg.s}-${p}" onclick="openSlotModal(${cfg.s},${p});">
                    <div class="slot-avatar">
                        <div class="slot-fallback" style="display:flex;">+</div>
                    </div>
                    <div class="slot-lv">Lv.-</div>
                    <div class="slot-name">追加</div>
                </div>`;
            } else {
                // 覚醒バッジ
                let awBadge = '';
                const awData = (typeof AWAKENING_HEROES !== 'undefined') ? AWAKENING_HEROES[id] : null;
                const awTierStr = awData ? loadAwTier(id) : 'none';
                const awObj = (typeof parseAwTier !== 'undefined') ? parseAwTier(awTierStr) : {star:-1,tier:0};
                const isAwakened = awObj.star >= 0;
                if (isAwakened) {
                    const tierLabel = awObj.tier === 0
                        ? '覚醒★' + awObj.star
                        : awObj.tier === 5
                            ? '覚醒★' + (awObj.star + 1)
                            : '覚醒★' + awObj.star + '-' + awObj.tier;
                    awBadge = `<div class="awaken-badge-star">${tierLabel}</div>`;
                }
                html += `
                <div class="slot-tile${isAwakened ? ' is-awakened' : ''}" id="slot-tile-${cfg.s}-${p}" onclick="openSlotModal(${cfg.s},${p});">
                    <div class="slot-avatar">
                        <img src="${getHeroImagePath(id)}" alt="${h.name}" onerror="this.style.display='none'; this.parentNode.querySelector('.slot-fallback').style.display='flex';">
                        <div class="slot-fallback" style="display:none;">${shortName}</div>
                    </div>
                    ${awBadge}
                    <div class="slot-lv">Lv.${lv}</div>
                    <div class="slot-name">${h.name}</div>
                </div>`;
            }
        }
        wrap.innerHTML = html;
    });
}

function openSlotModal(s,p){
    __heroFilter = 'all';
    // フィルターボタンをリセット
    document.querySelectorAll('.hero-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === 'all');
    });
    buildSlotHeroOptions('all');
    __slotModalState.s = s; __slotModalState.p = p;

    const hEl = document.getElementById(`h-${s}-${p}`);
    const wEl = document.getElementById(`w-${s}-${p}`);
    const heroSel = document.getElementById('slot-modal-hero');

    const id = hEl ? (hEl.value || 'empty') : 'empty';
    heroSel.value = id;
    // hero変更時に覚醒セクション更新
    heroSel.onchange = function() {
        try { updateHeroAdvicePanel(this.value, __slotModalState.lv); } catch(e){}
        try { openAwakeningSection(this.value, __slotModalState.lv); } catch(e){}
    };

    const lvRaw = wEl ? wEl.value : 0;
    const lv = (typeof lvRaw === 'string' && (lvRaw.includes('未') || lvRaw === '-' )) ? 0 : (parseInt(lvRaw)||0);
    __slotModalState.lv = lv;
    document.getElementById('slot-modal-lv').innerText = lv;

    // --- 英雄アドバイス ---
    try { updateHeroAdvicePanel(id, lv); } catch(e) {}
    // --- 覚醒セクション ---
    try { openAwakeningSection(id, lv); } catch(e) {}

    document.getElementById('slot-modal').classList.add('open');
    const modalBody = document.querySelector('#slot-modal .modal-body');
    if (modalBody) modalBody.scrollTop = 0;
}

// スロット編集モーダルのヘッダーに、選択中キャラの画像と名前を表示する。
// 下にスクロールしてもヘッダーは固定（flex-shrink:0）なので、長いアドバイス文を
// 読んでいる間もどのキャラを編集中か分かるようにするための表示。
function updateSlotModalHeader(heroId) {
    const wrap  = document.getElementById('modal-head-hero');
    const img   = document.getElementById('modal-head-hero-img');
    const nameEl = document.getElementById('modal-head-hero-name');
    const catchEl = document.getElementById('modal-head-hero-catch');
    const titleEl = document.getElementById('modal-head-title');
    if (!wrap || !img || !nameEl || !titleEl) return;

    const hero = HERO_DB[heroId] || null;

    if (!heroId || heroId === 'empty' || !hero) {
        wrap.style.display = 'none';
        titleEl.style.display = 'block';
        return;
    }

    img.src = `img/${heroId}.webp`;
    img.style.opacity = '1';
    img.className = `modal-head-hero-img ${hero.type || ''}`;
    nameEl.textContent = hero.name || heroId;
    __slotModalState.currentHeroIdForDex = heroId;

    if (catchEl) {
        const adv = (HERO_DB[heroId] ? HERO_DB[heroId].advice : null);
        const catchPhrase = adv && adv.catch ? adv.catch : '';
        catchEl.textContent = catchPhrase;
        catchEl.style.display = catchPhrase ? 'block' : 'none';
    }

    wrap.style.display = 'flex';
    titleEl.style.display = 'none';
}

// スロット編集モーダルから「詳細はこちら」で呼ばれる。編集中のスロット状態は維持したまま、
// キャラ紹介の詳細モーダルを重ねて表示する（画面遷移ではなくオーバーレイ）。
function openHeroDexDetailFromSlot() {
    const heroId = __slotModalState.currentHeroIdForDex;
    if (!heroId || heroId === 'empty') return;
    openHeroDexDetail(heroId);
}

function updateHeroAdvicePanel(heroId, ewLv) {
    updateSlotModalHeader(heroId);
    const panel    = document.getElementById('hero-advice-panel');
    const roleEl   = document.getElementById('hero-advice-role');
    const ewEl     = document.getElementById('hero-advice-ew');
    const synEl    = document.getElementById('hero-advice-synergy');
    const warnEl   = document.getElementById('hero-advice-warning');
    if (!panel) return;

    const adv = (HERO_DB[heroId] ? HERO_DB[heroId].advice : null);
    if (!adv || !heroId || heroId === 'empty') {
        panel.style.display = 'none';
        return;
    }
    panel.style.display = 'block';

    // 役割バッジ
    const typeLabel = { tank:'⚔️ 戦車', air:'✈️ 航空', mis:'🚀 ロケラン' };
    const roleLabel = { atk:'🔴 アタッカー', wall:'🛡️ タンク', sup:'💚 サポート' };
    const hero = HERO_DB[heroId] || {};
    const prioColor = adv.priority === 'SSS' ? '#ef4444' : adv.priority === 'SS' ? '#f97316' : adv.priority === 'S' ? '#eab308' : '#94a3b8';

    roleEl.innerHTML = `
        <span style="background:#f1f5f9;color:#334155;border-radius:5px;padding:2px 7px;font-size:var(--fs-xs);font-weight:700;">${typeLabel[hero.type]||''} ${roleLabel[hero.role]||''}</span>
        <span style="background:${prioColor}22;color:${prioColor};border:1px solid ${prioColor}44;border-radius:5px;padding:2px 7px;font-size:var(--fs-xs);font-weight:900;">優先度 ${adv.priority}</span>
    `;

    // S6メモ（育成方針）：役割バッジから切り出した独立ボックス
    const s6El = document.getElementById('hero-advice-s6note');
    if (s6El) {
        s6El.innerHTML = adv.s6note ? `<b>S6メモ</b><br>${adv.s6note}` : '';
        s6El.style.display = adv.s6note ? 'block' : 'none';
    }

    // EW Lv別アドバイス
    const ewAdvice = (typeof getHeroEwAdvice !== 'undefined') ? getHeroEwAdvice(heroId, ewLv) : '';
    ewEl.innerHTML = ewAdvice ? `<b>EW Lv${ewLv} アドバイス</b><br>${ewAdvice}` : '';
    ewEl.style.display = ewAdvice ? 'block' : 'none';

    // 編成での役割・シナジー
    synEl.innerHTML = adv.synergy ? `<b>編成での役割</b><br>${adv.synergy}` : '';
    synEl.style.display = adv.synergy ? 'block' : 'none';

    // 注意事項（任意）
    if (warnEl) {
        warnEl.innerHTML = adv.warning ? `<b>注意</b><br>${adv.warning}` : '';
        warnEl.style.display = adv.warning ? 'block' : 'none';
    }
}

function openAwakeningSection(heroId, ewLv) {
    const section = document.getElementById('awaken-section');
    if (!section) return;

    const aw = (typeof AWAKENING_HEROES !== 'undefined') ? AWAKENING_HEROES[heroId] : null;
    if (!aw || !aw.milestones) {
        section.style.display = 'none';
        __slotModalState.awTier = 'none';
        return;
    }
    section.style.display = 'block';
    document.getElementById('awaken-hero-name').innerText = (HERO_DB[heroId] || {}).name || '';
    document.getElementById('awaken-skill-name').innerText = '「' + aw.skillName + '」';

    // 前提チェック
    const reqHint = document.getElementById('awaken-req-hint');
    const starRow = document.getElementById('awaken-star-row');
    const check = (typeof checkAwakeningEligible !== 'undefined')
        ? checkAwakeningEligible(heroId, ewLv, 5)
        : { eligible: false, reason: 'EW Lv' + (aw.ewMinRequired||20) + '以上が必要' };
    if (!check.eligible) {
        reqHint.style.display = 'block';
        reqHint.innerText = '⚠ ' + check.reason;
        starRow.classList.add('disabled-aw');
    } else {
        reqHint.style.display = 'none';
        starRow.classList.remove('disabled-aw');
    }

    // 保存済みティアを読み込む
    const saved = loadAwTier(heroId);
    __slotModalState.awTier = (saved && saved !== '0-0') ? saved : 'none';
    renderAwTierUI(__slotModalState.awTier, aw);
}

// awTier UIの描画
// 構造：★0〜★4、各★に1〜5の5ティア
// "star-tier" 文字列（例 "0-1"=★0-1, "2-3"=★2-3）
// 未覚醒 = "none"
function renderAwTierUI(awTierStr, aw) {
    const disp = document.getElementById('awaken-star-display');
    const valEl = document.getElementById('awaken-star-val');
    const bonusHint = document.getElementById('awaken-bonus-hint');
    const commHint = document.getElementById('awaken-community-hint');
    if (!disp) return;

    const at = (typeof parseAwTier !== 'undefined') ? parseAwTier(awTierStr) : { star:-1, tier:0 };
    const currentStar = at.star;  // -1=未覚醒, 0〜4=★0〜4
    const currentTier = at.tier;  // 0〜5（0=到達直後、1〜4=進行中、5=次の★に到達）

    // 表示ルール：
    //   未覚醒 = "none"（star=-1）
    //   ★N-0 = ★Nに到達した直後（ティア未進行）→「★N（到達）」と表示
    //   ★0-1〜★0-4 = ★0の中で投資進行中（専用覚醒かけら×50で0-1着地、以降汎用20個ずつ）
    //   ★N-5 = 次の★(N+1)に到達 →「★(N+1)（到達）」と表示（★N-0と同値）
    //   内部 star=N, tier=T(1〜4) → 表示「★N-T」そのまま

    function displayLabel(star, tier) {
        if (star < 0) return '未覚醒';
        if (tier === 0) return '★' + star + '（到達）';
        if (tier === 5) return '★' + (star + 1) + '（到達）';
        return '★' + star + '-' + tier;
    }

    const reachedStar = (s) => s + 1; // ★s-5完了で到達する★

    // ===== 星セクション塗りSVG生成 =====
    const cx = 50, cy = 52;
    function starOuterPts(outerR, innerR) {
        const pts = [];
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI / 5) * i - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
        }
        return pts;
    }
    const starPts = starOuterPts(46, 18);
    function sectionPath(tipIdx) {
        const prevInner = starPts[(tipIdx - 1 + 10) % 10];
        const tip = starPts[tipIdx];
        const nextInner = starPts[(tipIdx + 1) % 10];
        return `M${cx},${cy} L${prevInner[0]},${prevInner[1]} L${tip[0]},${tip[1]} L${nextInner[0]},${nextInner[1]} Z`;
    }
    const tipIndices = [0,8,6,4,2];
    function renderStarSvg(filledCount, isCurrent) {
        const outline = starPts.map(p => p.join(',')).join(' ');
        let svg = `<svg width="36" height="36" viewBox="0 0 100 100">`;
        svg += `<polygon points="${outline}" fill="none" stroke="${(isCurrent || filledCount>0) ? '#ef4444' : '#3a4356'}" stroke-width="4"/>`;
        for (let i = 0; i < 5; i++) {
            if (i < filledCount) svg += `<path d="${sectionPath(tipIndices[i])}" fill="#ef4444"/>`;
        }
        svg += `</svg>`;
        return svg;
    }

    // 5つの★を横に並べる（★0〜★4、ラベルなし）
    let starsHtml = '<div style="display:flex;gap:4px;justify-content:center;flex:1;min-width:0;">';
    for (let s = 0; s <= 4; s++) {
        let filled;
        if (currentStar > s) filled = 5;
        else if (currentStar === s) filled = currentTier;
        else filled = 0;
        const isCurrent = (currentStar === s);
        starsHtml += `<div style="cursor:pointer;" onclick="setAwTier(${s}, 1)" title="★${s}-1へ">
            ${renderStarSvg(filled, isCurrent)}
        </div>`;
    }
    starsHtml += '</div>';

    // 現在地点ラベル（未覚醒に戻すボタンの上に表示）
    const curLbl = displayLabel(currentStar, currentTier);
    const curLblHtml = `<div style="text-align:center;font-family:'JetBrains Mono',monospace;font-size:var(--fs-md);color:#ef4444;font-weight:700;margin-top:6px;">${curLbl}</div>`;

    // +/- ボタンで1ティアずつ移動
    const html = `<div style="display:flex;align-items:center;gap:8px;">
        <button onclick="stepAwTier(-1)" style="width:38px;height:38px;background:#ef4444;color:#fff;border:none;border-radius:0;font-size:1.2rem;font-weight:bold;cursor:pointer;flex-shrink:0;">−</button>
        ${starsHtml}
        <button onclick="stepAwTier(1)" style="width:38px;height:38px;background:#ef4444;color:#fff;border:none;border-radius:0;font-size:1.2rem;font-weight:bold;cursor:pointer;flex-shrink:0;">+</button>
    </div>
    ${curLblHtml}
    <div onclick="setAwTier(-1,0)" class="awaken-reset-btn" style="text-align:center;margin-top:4px;">未覚醒に戻す</div>`;
    disp.innerHTML = html;

    // 現在値ラベル（★0-5=★1 と表示）
    const lbl = displayLabel(currentStar, currentTier);
    if (valEl) valEl.innerText = lbl;

    // ボーナスヒント
    if (bonusHint && aw) {
        bonusHint.style.display = 'block';
        let bonusTxt = (aw.tierBonuses || {})[currentStar + '-' + currentTier] || '';
        if (!bonusTxt) {
            outer: for (let ss = currentStar; ss >= 0; ss--) {
                const maxT = (ss === currentStar) ? currentTier - 1 : 5;
                for (let tt = maxT; tt >= (ss === 0 ? 0 : 1); tt--) {
                    bonusTxt = (aw.tierBonuses || {})[ss + '-' + tt];
                    if (bonusTxt) { bonusTxt += '（継続中）'; break outer; }
                }
            }
        }
        bonusHint.innerText = currentStar >= 0
            ? (lbl + '：' + (bonusTxt || '—').replace(/\s*→\s*★\d+到達/, ''))
            : '★0の解放で覚醒スキルを習得し、基礎ステータスが約2倍になります';
    }
    if (commHint) {
        commHint.style.display = 'none';
    }

    // EW vs 覚醒 優先度判定パネル更新
    try { updateEwVsAwakenPanel(heroId, ewLv, awTierStr, aw); } catch(e) {}
}

function updateEwVsAwakenPanel(heroId, ewLv, awTierStr, aw) {
    const panel = document.getElementById('ew-vs-awaken-panel');
    if (!panel || !aw) return;

    const at = (typeof parseAwTier !== 'undefined') ? parseAwTier(awTierStr) : { star:-1, tier:0 };
    const nextEwLv = ewLv < 10 ? 10 : ewLv < 20 ? 20 : ewLv < 30 ? 30 : null;

    // EWスコア上昇量を計算
    function ewPts(lv) {
        lv = Math.max(0, Math.min(30, lv));
        let p = 70;
        if(lv>=30) p+=360; else if(lv>=20) p+=190+(lv-20)*8;
        else if(lv>=10) p+=90+(lv-10)*5; else p+=5+lv*2;
        return p;
    }

    // EW強化のコストあたりスコア上昇
    // getPreciseCost の実値に合わせる（Lv0→10: 330, Lv10→20: 800, Lv20→30: 1750）
    const EW_COST = { 10:330, 20:800, 30:1750 };
    let ewGain = 0, ewCost = 0, ewLabel = '';
    if (nextEwLv) {
        ewGain = ewPts(nextEwLv) - ewPts(ewLv);
        ewCost = EW_COST[nextEwLv] || 999;
        ewLabel = `EW Lv${ewLv}→${nextEwLv}`;
    }

    // 覚醒次ティアのコストあたりスコア上昇
    const BASE_PTS = ewPts(ewLv);
    let awGain = 0, awCost = 0, awLabel = '';

    if (at.star < 0) {
        // 未覚醒 → ★0-1解放: 専用覚醒かけら×50、スコア×1.20
        if (ewLv >= (aw.ewMinRequired || 20)) {
            awGain = Math.round(BASE_PTS * (1.20 - 1.0));
            awCost = 50; // 専用覚醒かけら（換算値：1個≒15強化石相当とする）
            awLabel = '覚醒★0-1（専用覚醒かけら×50）';
        }
    } else {
        const next = (typeof awNextTierCost !== 'undefined') ? awNextTierCost(awTierStr) : null;
        if (next) {
            const curBonus  = (typeof getAwakeningScoreBonus !== 'undefined') ? getAwakeningScoreBonus(heroId, awTierStr) : 1.0;
            const nextTierStr = next.nextStar + '-' + next.nextTier;
            const nextBonus = (typeof getAwakeningScoreBonus !== 'undefined') ? getAwakeningScoreBonus(heroId, nextTierStr) : 1.0;
            awGain = Math.round(BASE_PTS * (nextBonus - curBonus));
            // 専用かけら→強化石換算（1かけら≒15強化石）、汎用かけら→1かけら≒10強化石
            const convRate = next.named ? 15 : 10;
            awCost = next.cost * convRate;
            const nextTierLabel = awStarLabel({ star: next.nextStar, tier: next.nextTier });
            awLabel = `覚醒${nextTierLabel}（${next.named ? '専用' : '汎用'}かけら×${next.cost}）`;
        }
    }

    panel.style.display = 'block';
    // details要素も表示
    const det = document.getElementById('ew-vs-awaken-details');
    if (det) det.style.display = 'block';

    // 判定
    let html = '<div style="font-weight:900;color:#334155;margin-bottom:6px;">⚖️ EW強化 vs 覚醒 優先度</div>';

    // EW前提未達
    if (ewLv < (aw.ewMinRequired || 20)) {
        html += `<div style="color:#b91c1c;font-weight:700;">🔒 EW Lv${aw.ewMinRequired}未達 → まずEW強化が必須</div>`;
        panel.innerHTML = html;
        return;
    }

    // EW MAX
    if (!nextEwLv && awGain > 0) {
        html += `<div style="color:#065f46;font-weight:700;">✅ EW MAX → 覚醒を優先</div>`;
        if (awLabel) html += `<div style="color:#374151;">次: ${awLabel}（+${awGain}pt）</div>`;
        panel.innerHTML = html;
        return;
    }

    // コスパ比較
    const ewEff  = nextEwLv ? (ewGain / Math.max(1, ewCost) * 1000) : 0;
    const awEff  = awGain   ? (awGain  / Math.max(1, awCost) * 1000) : 0;

    if (ewEff > 0 || awEff > 0) {
        const ewBar  = Math.round((ewEff  / Math.max(ewEff, awEff, 0.001)) * 100);
        const awBar  = Math.round((awEff  / Math.max(ewEff, awEff, 0.001)) * 100);
        const winner = awEff >= ewEff ? 'awaken' : 'ew';

        html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">`;

        // EW列
        const ewColor = winner === 'ew' ? '#1e3a8a' : '#64748b';
        const ewBg    = winner === 'ew' ? '#eff6ff' : '#f1f5f9';
        html += `<div style="background:${ewBg};border-radius:8px;padding:6px 8px;border:1px solid ${winner==='ew'?'#bfdbfe':'#e2e8f0'};">`;
        html += `<div style="color:${ewColor};font-weight:900;">🔧 ${ewLabel || 'EW MAX'}</div>`;
        if (nextEwLv) {
            html += `<div style="color:#475569;">+${ewGain}pt / 強化石${ewCost}個</div>`;
            html += `<div style="background:#e2e8f0;border-radius:4px;height:6px;margin-top:4px;"><div style="background:${winner==='ew'?'#3b82f6':'#94a3b8'};width:${ewBar}%;height:100%;border-radius:4px;"></div></div>`;
        }
        html += `</div>`;

        // 覚醒列
        const awColor = winner === 'awaken' ? '#7f1d1d' : '#64748b';
        const awBg    = winner === 'awaken' ? '#fff1f2' : '#f1f5f9';
        html += `<div style="background:${awBg};border-radius:8px;padding:6px 8px;border:1px solid ${winner==='awaken'?'#fecaca':'#e2e8f0'};">`;
        html += `<div style="color:${awColor};font-weight:900;">👑 ${awLabel || '覚醒なし'}</div>`;
        if (awGain > 0) {
            html += `<div style="color:#475569;">+${awGain}pt / 換算${awCost}強化石</div>`;
            html += `<div style="background:#e2e8f0;border-radius:4px;height:6px;margin-top:4px;"><div style="background:${winner==='awaken'?'#ef4444':'#94a3b8'};width:${awBar}%;height:100%;border-radius:4px;"></div></div>`;
        } else {
            html += `<div style="color:#475569;">（覚醒MAX or 前提未達）</div>`;
        }
        html += `</div>`;
        html += `</div>`;

        // 推奨メッセージ
        const margin = Math.abs(awEff - ewEff) / Math.max(awEff, ewEff, 0.001);
        if (margin < 0.15) {
            html += `<div style="margin-top:6px;color:#92400e;font-weight:700;">⚠️ コスパはほぼ同等 — 覚醒かけらの在庫次第で判断</div>`;
        } else if (winner === 'awaken') {
            html += `<div style="margin-top:6px;color:#7f1d1d;font-weight:700;">✅ 覚醒優先がコスパ良好</div>`;
        } else {
            html += `<div style="margin-top:6px;color:#1e3a8a;font-weight:700;">✅ EW強化優先がコスパ良好</div>`;
        }
    }

    panel.innerHTML = html;
}

function setAwTier(star, tier) {
    const heroId = (document.getElementById('slot-modal-hero') || {}).value;
    const aw = (typeof AWAKENING_HEROES !== 'undefined') ? AWAKENING_HEROES[heroId] : null;
    let s = star, t = tier;
    if (s > 5) { s = 5; t = 0; }
    if (s === 5) t = 0; // ★5はMAX、tierは常に0
    const tierStr = (s < 0) ? 'none' : (s + '-' + t);
    __slotModalState.awTier = tierStr;
    renderAwTierUI(tierStr, aw);
    // EW vs 覚醒パネル更新
    try { updateEwVsAwakenPanel(heroId, __slotModalState.lv, tierStr, aw); } catch(e) {}
}

// +/- ボタンで現在地点から1ティアずつ前後させる（tier=0は「到達直後」、1〜4は進行中、5は次の★に到達=N+1-0と同値）
function stepAwTier(direction) {
    const cur = (typeof parseAwTier !== 'undefined') ? parseAwTier(__slotModalState.awTier) : { star:-1, tier:0 };
    let s = cur.star, t = cur.tier;

    if (direction > 0) {
        // 進める
        if (s < 0) { s = 0; t = 0; }
        else if (s >= 5) { /* 既にMAX */ }
        else if (t >= 4) { s = s + 1; t = 0; } // ★N-4の次は★(N+1)（到達）へ直行（tier=5を経由しない）
        else { t = t + 1; }
    } else {
        // 戻す
        if (s < 0) return; // 既に未覚醒
        if (t === 0) {
            if (s === 0) { s = -1; t = 0; } // 未覚醒に戻る
            else { s = s - 1; t = 4; }
        } else {
            t = t - 1;
        }
    }
    setAwTier(s, t);
}

function awTierKey(heroId) { return 'awTier_' + heroId; }
function saveAwTier(heroId, tierStr) {
    try { localStorage.setItem(awTierKey(heroId), String(tierStr)); } catch(e) {}
}
function loadAwTier(heroId) {
    try {
        const v = localStorage.getItem(awTierKey(heroId));
        return v !== null ? v : 'none';
    } catch(e) { return 'none'; }
}

function closeSlotModal(){
    document.getElementById('slot-modal').classList.remove('open');
}

function slotModalStep(d){
    __slotModalState.lv = Math.min(30, Math.max(0, (__slotModalState.lv||0) + d));
    document.getElementById('slot-modal-lv').innerText = __slotModalState.lv;
    try {
        const id = (document.getElementById('slot-modal-hero')||{}).value;
        if(id) {
            openAwakeningSection(id, __slotModalState.lv);
            // EW Lv低下で前提外れた場合は覚醒状態をUIからもリセット
            const aw = AWAKENING_HEROES && AWAKENING_HEROES[id];
            if (aw && __slotModalState.lv < (aw.ewMinRequired||20)) {
                __slotModalState.awTier = 'none';
            }
        }
    } catch(e){}
}
function slotModalSet(v){
    __slotModalState.lv = Math.min(30, Math.max(0, v));
    document.getElementById('slot-modal-lv').innerText = __slotModalState.lv;
    try {
        const id = (document.getElementById('slot-modal-hero')||{}).value;
        if(id) {
            openAwakeningSection(id, __slotModalState.lv);
            // 武装Lv変更時にEW Lvアドバイス等のアドバイスパネルも更新する
            // （以前はヒーロー選択時の初期値のまま固定されており、スライダー操作が反映されなかった）
            try { updateHeroAdvicePanel(id, __slotModalState.lv); } catch(e) {}
            const aw = AWAKENING_HEROES && AWAKENING_HEROES[id];
            if (aw && __slotModalState.lv < (aw.ewMinRequired||20)) {
                __slotModalState.awTier = 'none';
            }
        }
    } catch(e){}
}
function slotModalClear(){
    document.getElementById('slot-modal-hero').value = 'empty';
    slotModalSet(0);
    __slotModalState.awTier = 'none';
    try { openAwakeningSection('empty', 0); } catch(e) {}
}
function slotModalApply(){
    const s = __slotModalState.s, p = __slotModalState.p;
    const id = document.getElementById('slot-modal-hero').value;
    const lv = __slotModalState.lv;
    const awTier = __slotModalState.awTier;

    const hEl = document.getElementById(`h-${s}-${p}`);
    const wEl = document.getElementById(`w-${s}-${p}`);
    if(hEl) hEl.value = id;
    if(wEl) wEl.value = (id==='empty') ? 0 : lv;

    // 覚醒ティアを保存（前提条件チェック：EW Lv不足なら覚醒データをリセット）
    if (id !== 'empty' && typeof AWAKENING_HEROES !== 'undefined' && AWAKENING_HEROES[id]) {
        const awCheck = (typeof checkAwakeningEligible !== 'undefined')
            ? checkAwakeningEligible(id, lv, 5)
            : { eligible: lv >= (AWAKENING_HEROES[id].ewMinRequired || 20) };
        if (awCheck.eligible) {
            saveAwTier(id, awTier);
        } else {
            // 前提未達 → 覚醒データをリセット
            saveAwTier(id, 'none');
        }
    }

    // 再評価
    try { updateSquad(s); } catch(e) {}
    try { renderSlots(); } catch(e) {}
    closeSlotModal();
    try { updateAllSquads(); } catch(e) {}
    try { saveAllData(); } catch(e) {}
    try { renderPresetPanel(); } catch(e) {}
}

// updateAllSquads の後にタイルも更新する
// ⚠️ renderSlots()はslot-tileのinnerHTMLを完全に再構築するため、
//   元の処理内で適用したボトルネック等のマーキング（class/badge）が消えてしまう。
//   そのためrenderSlots()の後に再度マーキングを適用し直す。
const __origUpdateAllSquads = updateAllSquads;
updateAllSquads = function(){
    __origUpdateAllSquads();
    try { renderSlots(); } catch(e) {}
    try { updateArmyGuide(); } catch(e) {}
};

function exportAsImage() { showToast("📸 生成中..."); html2canvas($id('squad-container')).then(c => { let l = document.createElement('a'); l.download = `配置_${Date.now()}.png`; l.href = c.toDataURL(); l.click(); showToast("✨ 保存完了"); }); }
function resetSquads() { if(confirm("リセット？")) { localStorage.clear(); location.reload(); } }
function jumpToArmy(n){
    // どのタブからでも「部隊編成」へ戻してジャンプできるようにする
    try{
        const firstTab = document.querySelectorAll('.tab-btn')[0];
        showTab('squad', firstTab);
    }catch(e){}

    // 統合スロットUI（slot-army）を優先してスクロール
    const target = $id(`slot-army-${n}`) || $id("sq-body-"+n);
    if(!target) return;

    // 旧UI（アコーディオン）が存在する場合は開く
    if(target.id && target.id.startsWith("sq-body-")){
        const header = target.previousElementSibling;
        if(!target.classList.contains("open")){
            target.classList.add("open");
            if(header && header.children[1]) header.children[1].innerText = "▼";
        }
    }

    setTimeout(()=>{
        target.scrollIntoView({behavior:"smooth", block:"start"});
    }, 60);
}

// === Role Color Unified (UI polish) ===
function getRoleBadge(role){
    if(!role) return "";
    let cls = (role === 'atk') ? 'atk' : (role === 'wall' ? 'wall' : 'sup');
    return `<span class="role-badge ${cls}"><span class="role-ico ${cls}"></span></span>`;
}

// 弱点ラベル（不足時だけ強めに目立たせる）
function getWeaknessBadge(w){
    const role = (w === "attack") ? "atk" : (w === "defense") ? "wall" : "sup";
    const cls  = (w === "attack") ? "atk" : (w === "defense") ? "wall" : "bal";

    const txt =
        (w === "attack") ? "火力を強化しよう" :
        (w === "defense") ? "前衛を強化しよう" :
        "バランス良好";

    return `<span class="weak-badge ${cls}">${getRoleBadge(role)}<span class="t">${txt}</span></span>`;
}



// 🛠️ 装備強化優先度（役割ごと2装備 / 編成へは影響しない）
// ===============================

// 役割ごとの「見る装備」2つ（安全運用：編成最適化には一切反映しない）
// === ★上げ判定（UR/MRレシピの誤爆防止：費用対効果の簡易モデル） ===
// ※ゲーム内の正確な必要数はサーバー/仕様で変わり得るため、ここは「無・微課金向けの意思決定用ヒューリスティック」。
// 　必要数/重みはいつでも調整できるよう定数化している。// 無・微課金の「重さ」：MRの方が入手難と仮定（必要ならここを調整）
// ★の段階ごとの「伸び」を大雑把に表現（高★ほど価値が高い想定）
// 役割×装備の重要度（同一役割内の相対）
// 比較UIの状態

function recipeCostWeight(targetStar){
  const c = GEAR_RECIPE_COST_BY_TARGET_STAR[targetStar] || { mr:0, ur:0 };
  const w = (c.mr||0)*GEAR_RECIPE_WEIGHT.mr + (c.ur||0)*GEAR_RECIPE_WEIGHT.ur;
  // 0割り防止（低★の微コストを少しだけ効かせる）
  return Math.max(0.35, w);
}

function computeUpgradeCandidate(hero, gearKey, currentStar, role){
  const cur = Math.max(0, Math.min(5, parseInt(currentStar)||0));
  if(cur >= 5) return null;

  const targetStar = cur + 1;
  const lv = Math.max(0, Math.min(30, parseInt(hero.wp)||0));
  const lvW = 1 + (lv/30); // 1.0〜2.0（既存の考え方に合わせる） fileciteturn5file0L8-L12

  const impMap = (GEAR_IMPORTANCE[role] || {});
  const imp = (impMap[gearKey] !== undefined) ? impMap[gearKey] : 1.0;

  const marginal = (GEAR_MARGINAL_VALUE_BY_TARGET_STAR[targetStar] || 1.0);
  const costW = recipeCostWeight(targetStar);

  const score = (marginal * imp * lvW) / costW;

  const cost = (GEAR_RECIPE_COST_BY_TARGET_STAR[targetStar] || {mr:0, ur:0});
  return {
    heroId: hero.id,
    heroName: hero.name || hero.id,
    gearKey,
    currentStar: cur,
    targetStar,
    wp: lv,
    imp,
    marginal,
    cost,
    score
  };
}

function formatRecipeCost(cost){
  const mr = cost && cost.mr ? cost.mr : 0;
  const ur = cost && cost.ur ? cost.ur : 0;
  const parts = [];
  if(mr>0) parts.push(`MR×${mr}`);
  if(ur>0) parts.push(`UR×${ur}`);
  return parts.length ? parts.join(" + ") : "（軽）";
}
// 編成タブの入力（キャラ + 武装Lv）を流用して、装備タブで一覧にする
function getRosterFromSquadsUnique(){
  const map = new Map(); // id -> {id, wp, role, type, name}
  for(let s=1; s<=4; s++){
    const n = (s===4)?10:5;
    for(let p=1; p<=n; p++){
      const hEl = document.getElementById(`h-${s}-${p}`);
      const wEl = document.getElementById(`w-${s}-${p}`);
      if(!hEl || !wEl) continue;
      const id = (hEl.value || "empty");
      if(id==="empty") continue;
      const h = HERO_DB[id];
      if(!h || h.ur) continue;
      const wpRaw = wEl.value;
      const wp = (typeof wpRaw === "string" && (wpRaw.includes("未") || wpRaw === "-")) ? 0 : (parseInt(wpRaw)||0);
      const prev = map.get(id);
      if(!prev || wp > (prev.wp||0)){
        map.set(id, { id, wp, role: h.role, type: h.type, name: h.name });
      }
    }
  }
  return Array.from(map.values());
}




function renderStars(n){
  const v = Math.max(0, Math.min(5, parseInt(n)||0));
  let s = "";
  for(let i=0;i<5;i++) s += (i<v) ? "★" : "☆";
  return s;
}


function gearStarClear(){
  __gearModal.s1 = 0; __gearModal.s2 = 0;
  refreshGearStarModalStars();
}
window.gearStarClear = gearStarClear;
// inline handler / 外部から呼べるように window に公開
window.scheduleAi = scheduleAi;
window.updateTransitionRecommendationUI = updateTransitionRecommendationUI;


// ================= スロット: 折りたたみ =================
const SLOT_COLLAPSE_KEY_PREFIX = "slot-collapse-";
const SLOT_KEEP_EVAL_KEY = "slot-keep-eval-on-collapse";

function applyKeepEvalPref(keep){
  try{
    document.body.classList.toggle('keep-eval-collapse', !!keep);
  }catch(e){}
}

function initKeepEvalPref(){
  // default: 現状の見た目に合わせて「折りたたみ時は評価を消す」
  let keep = false;
  try{ keep = (localStorage.getItem(SLOT_KEEP_EVAL_KEY) === '1'); }catch(e){}
  applyKeepEvalPref(keep);

  const cb = document.getElementById('slot-keep-eval');
  if(cb){
    cb.checked = keep;
    cb.addEventListener('change', ()=>{
      const v = !!cb.checked;
      applyKeepEvalPref(v);
      try{ localStorage.setItem(SLOT_KEEP_EVAL_KEY, v ? '1' : '0'); }catch(e){}
    });
  }
}

function setSlotToggleState(n, isExpanded){
  const army = document.getElementById(`slot-army-${n}`);
  const btn = army ? (army.querySelector('.slot-toggle-btn') || army.querySelector('.slot-toggle')) : null;
  if(!army || !btn) return;

  // isExpanded: true = 展開（タイル表示）
  army.classList.toggle('slot-collapsed', !isExpanded);
  // Icon button (▼/▶)
  if(btn.classList.contains('slot-toggle-btn')){
    btn.textContent = isExpanded ? '▼' : '▶';
  }else{
    // legacy switch
    btn.setAttribute('aria-checked', String(!!isExpanded));
  }
  const label = (n===4) ? '控え' : `${n}軍`;
  btn.setAttribute('aria-label', isExpanded ? `${label}を折りたたむ` : `${label}を展開する`);
}

function toggleSlotArmy(n){
  const army = document.getElementById(`slot-army-${n}`);
  if(!army) return;
  const isExpanded = army.classList.contains('slot-collapsed'); // collapsed -> will expand
  setSlotToggleState(n, isExpanded);
  try{ localStorage.setItem(SLOT_COLLAPSE_KEY_PREFIX + n, isExpanded ? "0" : "1"); }catch(e){}
}
window.toggleSlotArmy = toggleSlotArmy;


// === トグルボタンだけで開閉（ヘッダー全体タップは無効） ===
// DOM再描画でボタンが差し替わっても効くように「イベント委譲」にする（PCでも安定）
(function(){
  function armyNoFromBtn(btn){
    const p = btn.closest("[id^='slot-army-']");
    if(p && p.id){
      const m = p.id.match(/slot-army-(\d+)/);
      if(m) return Number(m[1]);
    }
    const oc = btn.getAttribute('onclick') || '';
    const mm = oc.match(/toggleSlotArmy\((\d+)\)/);
    if(mm) return Number(mm[1]);
    return null;
  }
  function handler(e){
    const btn = e.target && e.target.closest ? e.target.closest('.slot-toggle-btn, .slot-toggle') : null;
    if(!btn) return;
    try{ e.preventDefault(); }catch(_){}
    try{ e.stopPropagation(); }catch(_){}
    if(e.stopImmediatePropagation){ try{ e.stopImmediatePropagation(); }catch(_){ } }
    const n = armyNoFromBtn(btn);
    if(!n) return;
    if(typeof window.toggleSlotArmy === 'function') window.toggleSlotArmy(n);
  }
  document.addEventListener('click', handler, true);
  document.addEventListener('touchend', handler, { capture:true, passive:false });
})();



function initSlotToggles(){
  for(let n=1; n<=4; n++){
    const army = document.getElementById(`slot-army-${n}`);
    if(!army) continue;
    const btn = army.querySelector('.slot-toggle-btn') || army.querySelector('.slot-toggle');
    if(!btn) continue;

    let collapsed = false;
    try{ collapsed = (localStorage.getItem(SLOT_COLLAPSE_KEY_PREFIX + n) === "1"); }catch(e){}
    setSlotToggleState(n, !collapsed);
  }
}

// index.html はスクリプトが末尾なので、基本は即時でOK
try{ initSlotToggles(); }catch(e){}
try{ initKeepEvalPref(); }catch(e){}
try{ window.toggleTransitionPanel = toggleTransitionPanel; }catch(e){}

try{ window.getArmyTypeCounts = getArmyTypeCounts; window.getArmyBuffInfo = getArmyBuffInfo; }catch(e){}


// ===== 折りたたみパネル（グローバル） =====
function togglePanel(bodyId, iconId) {
  const body = document.getElementById(bodyId);
  const icon = document.getElementById(iconId);
  if (!body) return;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  if (icon) icon.classList.toggle('open', !isOpen);
  try { localStorage.setItem('panel_' + bodyId, isOpen ? '0' : '1'); } catch(e) {}
}
function restorePanelStates() {
  const iconMap = {
    'power-transition-body': 'trans-icon',
    'awaken-rank-body':      'awaken-rank-icon',
    'preset-body':           'preset-icon',
    'preset-graduated-body': 'preset-graduated-icon',
  };
  Object.entries(iconMap).forEach(([id, iconId]) => {
    try {
      const saved = localStorage.getItem('panel_' + id);
      if (saved === null) return;
      const body = document.getElementById(id);
      const icon = document.getElementById(iconId);
      if (!body) return;
      const shouldOpen = saved === '1';
      body.classList.toggle('open', shouldOpen);
      if (icon) icon.classList.toggle('open', shouldOpen);
    } catch(e) {}
  });
}
