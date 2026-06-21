// ==========================================
// data.js - 英雄データ・覚醒データ・推奨編成テンプレート
// ==========================================

const HEROES = {
    empty: {n:"未設定", t:"none", r:"none", ur:false, pr:0},
    kimberly: {n:"キンバリー", t:"tank", r:"atk", ur:false, pr:100, carry:true}, dva: {n:"DVA", t:"air", r:"atk", ur:false, pr:100, carry:true}, tesla: {n:"テスラ", t:"mis", r:"atk", ur:false, pr:100, carry:true}, murphy: {n:"マーフィ", t:"tank", r:"wall", ur:false, pr:90}, lucius: {n:"ルシウス", t:"air", r:"wall", ur:false, pr:90}, mcgregor: {n:"マクレガー", t:"mis", r:"wall", ur:false, pr:90}, stetmann: {n:"ステッドマン", t:"tank", r:"atk", ur:false, pr:80}, schuyler: {n:"スカイラー", t:"air", r:"atk", ur:false, pr:80}, fiona: {n:"フィオナ", t:"mis", r:"atk", ur:false, pr:80}, morrison: {n:"モリソン", t:"air", r:"atk", ur:false, pr:75}, swift: {n:"スウィフト", t:"mis", r:"atk", ur:false, pr:75}, mason: {n:"メイソン", t:"tank", r:"atk", ur:true, pr:70}, sarah: {n:"サラ", t:"air", r:"sup", ur:true, pr:70}, venom: {n:"ベノム", t:"mis", r:"atk", ur:true, pr:70}, brats: {n:"ブラッツ", t:"mis", r:"atk", ur:true, pr:70}, williams: {n:"ウィリアムズ", t:"tank", r:"wall", ur:false, pr:60}, carlie: {n:"カーリー", t:"air", r:"wall", ur:false, pr:60}, adam: {n:"アダム", t:"mis", r:"wall", ur:false, pr:60}, scarlett: {n:"スカーレット", t:"tank", r:"wall", ur:true, pr:55}, violet: {n:"ヴィオラ", t:"tank", r:"wall", ur:true, pr:55}, marshall: {n:"マーシャル", t:"tank", r:"sup", ur:false, pr:50}
};

const FORMATION_SYNERGY = {
  front2: 1.06,
  monoType5: 1.10,
  monoType4plus1: 1.05,
  carryPlusSubDps: 1.04,
  carryPlusSupport: 1.03,
  controlPlusCarry: 1.03,
  tankCarryCore: 1.08,          // Kim + front2 + Marshall
  airBurstCore: 1.10,           // Lucius + DVA + Morrison
  airControlCore: 1.06,         // Lucius + Schuyler
  missileCore: 1.09,            // Adam + 2 missile attackers
  promotedUrBridge: 1.02,       // 手持ち事情でのつなぎ採用
  // S6覚醒シナジー
  awakenKimCore: 1.08,          // 覚醒キム（★0以上）+ 前衛2枚: 決意状態が開幕即発動
  awakenKimDvaCombo: 1.10,      // 覚醒キム + 覚醒DVA: 4+1混成の黄金コンビ
  awakenDvaMono: 1.05,          // 覚醒DVA単独 + 航空軸: エースの矜持スタック効率UP
  awakenTeslaFiona: 1.08,       // 覚醒テスラ + フィオナ: 誘導電流×DoTコンボ
};

const HERO_AI_PROFILE = {
  kimberly:{ immediate:1.10, longterm:1.08, cost10:1.03, cost20:1.06, cost30:1.06, coverage:1.05, future:1.12, mainTypeBonus:1.06, promotedUrPenalty:1.00 }, // S6: 覚醒「燃ゆる決意」で長期評価大幅UP
  dva:{ immediate:1.08, longterm:1.06, cost10:1.03, cost20:1.08, cost30:1.02, coverage:1.04, future:1.10, mainTypeBonus:1.05, promotedUrPenalty:1.00 }, // S6: 覚醒「エーススター」でEW20が主要節目に
  fiona:{ immediate:1.06, longterm:0.96, cost10:1.03, cost20:1.05, cost30:1.03, coverage:1.02, future:1.07, mainTypeBonus:1.03, promotedUrPenalty:1.00 },
  lucius:{ immediate:1.07, longterm:0.88, cost10:1.05, cost20:1.08, cost30:0.98, coverage:1.07, future:1.05, mainTypeBonus:1.05, promotedUrPenalty:1.00 },
  // ウィリアムズ: チーム全体ダメージ軽減でPvP/ラリー必須（packsify/allclash）
  williams:{ immediate:1.08, longterm:1.00, cost10:1.05, cost20:1.08, cost30:1.00, coverage:1.08, future:1.05, mainTypeBonus:1.05, promotedUrPenalty:1.00 },
  stetmann:{ immediate:1.04, longterm:0.86, cost10:1.02, cost20:1.05, cost30:0.97, coverage:1.03, future:1.02, mainTypeBonus:1.03, promotedUrPenalty:1.00 },
  morrison:{ immediate:1.03, longterm:0.85, cost10:1.01, cost20:1.04, cost30:0.97, coverage:1.02, future:1.02, mainTypeBonus:1.03, promotedUrPenalty:1.00 },
  tesla:{ immediate:1.03, longterm:0.92, cost10:1.03, cost20:1.05, cost30:1.00, coverage:1.03, future:1.06, mainTypeBonus:1.03, promotedUrPenalty:1.00 }, // S6: 覚醒「電磁共鳴」DoTがロケラン軸で強力
  mcgregor:{ immediate:1.03, longterm:0.83, cost10:1.03, cost20:1.05, cost30:0.98, coverage:1.04, future:1.01, mainTypeBonus:1.03, promotedUrPenalty:1.00 },
  // スカイラー: 推奨PvP編成に含まれる重要CCロール（packsify "Williams+Kim+DVA+Schuyler+Murphy"）
  schuyler:{ immediate:1.05, longterm:0.88, cost10:1.04, cost20:1.06, cost30:0.98, coverage:1.06, future:1.03, mainTypeBonus:1.04, promotedUrPenalty:1.00 },
  adam:{ immediate:1.03, longterm:0.76, cost10:1.03, cost20:1.04, cost30:0.96, coverage:1.05, future:1.01, mainTypeBonus:1.03, promotedUrPenalty:1.00 },
  marshall:{ immediate:1.02, longterm:0.74, cost10:1.05, cost20:1.03, cost30:0.88, coverage:1.05, future:0.98, mainTypeBonus:1.01, promotedUrPenalty:1.00 },
  murphy:{ immediate:1.03, longterm:0.72, cost10:1.05, cost20:1.03, cost30:0.94, coverage:1.05, future:0.97, mainTypeBonus:1.01, promotedUrPenalty:1.00 },
  carlie:{ immediate:1.01, longterm:0.70, cost10:1.02, cost20:1.02, cost30:0.94, coverage:1.02, future:0.97, mainTypeBonus:1.01, promotedUrPenalty:1.00 },
  swift:{ immediate:1.01, longterm:0.68, cost10:1.03, cost20:1.02, cost30:0.94, coverage:1.01, future:0.97, mainTypeBonus:1.01, promotedUrPenalty:1.00 },
  // UR英雄: SSRフル育成が中途半端なURを上回れる（packsify） → ペナルティ緩和
  scarlett:{ immediate:1.05, longterm:0.72, cost10:1.04, cost20:1.01, cost30:0.90, coverage:1.04, future:0.90, mainTypeBonus:1.02, promotedUrPenalty:0.94 },
  mason:{ immediate:1.06, longterm:0.64, cost10:1.04, cost20:1.02, cost30:0.90, coverage:1.03, future:0.88, mainTypeBonus:1.02, promotedUrPenalty:0.93 },
  venom:{ immediate:1.02, longterm:0.62, cost10:1.04, cost20:1.01, cost30:0.89, coverage:1.02, future:0.87, mainTypeBonus:1.02, promotedUrPenalty:0.87 },
  brats:{ immediate:1.02, longterm:0.62, cost10:1.04, cost20:1.01, cost30:0.89, coverage:1.02, future:0.87, mainTypeBonus:1.02, promotedUrPenalty:0.87 },
  sarah:{ immediate:1.01, longterm:0.58, cost10:1.03, cost20:1.00, cost30:0.88, coverage:1.02, future:0.85, mainTypeBonus:1.01, promotedUrPenalty:0.85 },
  violet:{ immediate:0.98, longterm:0.46, cost10:1.02, cost20:0.98, cost30:0.86, coverage:0.99, future:0.82, mainTypeBonus:1.00, promotedUrPenalty:0.82 }
};

const AWAKENING_HEROES = {
  kimberly: {
    skillName: '燃ゆる決意',
    ewMinRequired: 20,
    // スキル説明: 敵に10回発砲(攻撃力×244.81%)、エネルギー増幅1スタックにつき追加4発（最大30回）
    // 超絶感知: 体力/攻撃/防御+20%、スキルヘイスト+10%
    scoreBonus: { 0:1.20, 1:1.26, 2:1.38, 3:1.55, 4:1.68, 5:1.82 },
    tierBonuses: {
      '0-0': '解放：超絶感知（体力/攻撃/防御+20%）+ 燃ゆる決意習得',
      '0-5': 'エネルギー増幅パッシブ（+3%、最大+15%）→ ★1到達',
      '1-1': '★1：戦闘開始時に自動で「決意」状態（会心率+10%、20秒）',
      '1-5': '★2：追加ダメージ+20% → ★2到達',
      '2-5': '★3：覚醒前にエネルギー増幅2スタック先行獲得 → ★3到達',
      '3-5': '★4：追加ダメージ+40%（合計+60%）→ ★4到達',
      '4-5': '★5：増幅スタックごとに追加1発（MAX）→ ★5到達',
    },
    milestones: [
      { id:'unlock', starMin:-1, starMax:-1, to:'0-1', shardCost:50, named:true,
        powerGain:'large', costpa:9, immediacy:9,
        note:'基礎ステ+20%・燃ゆる決意習得。F2Pでも最優先の1手',
        verdict:'専用かけら50個という最小コストで、体力/攻撃/防御+20%という大幅な基礎ステ強化が手に入ります。スキルも10連射（1発あたり攻撃力×140.04%）の「燃ゆる決意」に切り替わり、ここから先の投資すべての土台になります。whaleアカウントの多くが「まず最初に取るべき1手」と評価しており、後回しにすると後続の投資効率も下がるため最優先で取りましょう（packsify）。' },
      { id:'star1', starMin:0, starMax:0, to:'0-5', shardCost:80, named:false,
        powerGain:'large', costpa:7, immediacy:8,
        note:'自動「決意」状態発動（会心率+10%）。開幕から全力モードに',
        verdict:'戦闘開始時に自動で会心率+10%の「決意」状態（20秒間）が発動するため、何もしなくても開幕から火力が上がっている状態になります。PvPのラリー戦で特に体感しやすいという報告が多く、対人戦をよくする人ほど価値が高い段階です（cpt-hedge）。' },
      { id:'star3', starMin:1, starMax:2, to:'2-5', shardCost:550, named:false,
        powerGain:'xlarge', costpa:5, immediacy:9,
        note:'エネルギー増幅2スタック先行獲得→最大30発が現実的に。最重要マイルストーン',
        verdict:'覚醒前からエネルギー増幅2スタックを先行で持てるようになり、最大25〜30発の連射が現実的な範囲になります。1発あたり攻撃力×140.04%なので、フル連射時の総ダメージは攻撃力の3,500%超に達する計算です。キム覚醒の中で最も「質的な変化」を感じる段階とされ、ここに到達すると火力が2倍近くなる実感があるという報告が複数あります（packsify/cpt-hedge/Reddit）。コストは550かけらと大きいですが、最重要マイルストーンとして優先して問題ありません。' },
      { id:'star5', starMin:3, starMax:4, to:'4-5', shardCost:900, named:false,
        powerGain:'mid', costpa:3, immediacy:7,
        note:'増幅スタックごとに追加1発。追加ダメージ合計+60%。長期目標向け',
        verdict:'増幅スタックごとに追加1発が乗り、追加ダメージは合計+60%まで伸びます。ただし★3までの伸びと比べると追加分の実感は小さく、900かけらという投資量に対するコスパは控えめです。★3を達成して余裕ができてから、長期目標として腰を据えて進めるのが現実的です（cpt-hedge）。' },
    ],
  },
  dva: {
    skillName: 'エーススター',
    ewMinRequired: 20,
    // スキル説明: 5秒間空へ突進、通常攻撃1回につき追加で前衛優先に攻撃力×251.09%
    // エースの矜持: 味方航空機英雄1体につき1スタック、攻撃速度+20%（最大5スタック）
    scoreBonus: { 0:1.20, 1:1.28, 2:1.36, 3:1.44, 4:1.56, 5:1.68 },
    tierBonuses: {
      '0-0': '解放：超絶感知（体力/攻撃/防御+20%）+ エーススター習得',
      '0-5': 'エースの矜持パッシブ強化（攻撃速度+20%/スタック）→ ★1到達',
      '1-1': '★1：エースの矜持1スタックにつき攻撃速度さらに+10%',
      '1-5': '★2：追撃ダメージ+20% → ★2到達',
      '2-5': '★3：エースの矜持1スタックにつき攻撃力+5% → ★3到達',
      '3-5': '★4：追撃ダメージ+40% → ★4到達',
      '4-5': '★5：滞空時間+1秒（MAX）→ ★5到達',
    },
    milestones: [
      { id:'unlock', starMin:-1, starMax:-1, to:'0-1', shardCost:50, named:true,
        powerGain:'large', costpa:8, immediacy:8,
        note:'基礎ステ+20%・エーススター習得。キム覚醒後の第2優先',
        verdict:'体力/攻撃/防御+20%の基礎ステ強化に加え、5秒間空中に突進して通常攻撃ごとに前衛優先で攻撃力×251.09%の追加攻撃を行う「エーススター」を習得します。AoE（覚醒キム）と単体バースト（覚醒DVA）の組み合わせが完成する重要な一手で、キム覚醒が終わった直後に取るべき第2優先とされています（packsify）。' },
      { id:'star1', starMin:0, starMax:0, to:'0-5', shardCost:80, named:false,
        powerGain:'mid', costpa:6, immediacy:7,
        note:'エースの矜持スタック効率UP（攻撃速度+10%/スタック追加）',
        verdict:'パッシブ「エースの矜持」は航空機英雄1体につき1スタック（攻撃速度+20%、最大5スタック）が入る仕組みですが、★1でさらに+10%が乗ります。つまり航空英雄が多い編成ほど恩恵が大きく、5体航空編成なら攻撃速度+150%相当まで伸びる計算です。航空軸を本格運用する場合に効果が大きい段階です（allclash）。' },
      { id:'star3', starMin:1, starMax:2, to:'2-5', shardCost:550, named:false,
        powerGain:'mid', costpa:4, immediacy:7,
        note:'追撃+20%＋攻撃力+5%/スタック。総合的な火力底上げ',
        verdict:'追撃ダメージ+20%と、エースの矜持スタックごとに攻撃力+5%が追加されます。キムの★3（覚醒の本番）と比べると伸びは控えめで、550かけらの投資に対する効果は「総合的な底上げ」止まりです。キムの★3を先に終えてから取り組む、という優先順位が妥当です（cpt-hedge）。' },
      { id:'star5', starMin:3, starMax:4, to:'4-5', shardCost:900, named:false,
        powerGain:'mid', costpa:3, immediacy:6,
        note:'滞空+1秒・追撃+40%。航空火力の最終強化',
        verdict:'滞空時間+1秒で追加攻撃のチャンスが増え、追撃ダメージも+40%まで伸びます。航空軸の最終強化という位置づけですが、900かけらは大型投資です。キムの★5より優先する理由は薄く、キムの育成が一段落してから着手するのが現実的です（allclash）。' },
    ],
  },
  tesla: {
    skillName: '電磁共鳴',
    ewMinRequired: 20,
    // スキル説明: ライトニングチェーン7回反射（攻撃力×1,069.55%）
    // 誘導電流: 攻撃力×3%/秒×30秒、スタック上限=ロケラン英雄数×3（最大15）
    scoreBonus: { 0:1.20, 1:1.28, 2:1.35, 3:1.44, 4:1.58, 5:1.72 },
    tierBonuses: {
      '0-0': '解放：超絶感知（体力/攻撃/防御+20%）+ 電磁共鳴習得',
      '0-5': '誘導電流パッシブ（反射ごとに2スタック付与）→ ★1到達',
      '1-1': '★1：誘導電流DoT（攻撃力×3%/秒×30秒、最大15スタック）',
      '1-5': '★2：追加ダメージ+20% → ★2到達',
      '2-5': '★3：反射回数+1（計8回）→ ★3到達',
      '3-5': '★4：追加ダメージ+40% → ★4到達',
      '4-5': '★5：反射+1（計9回）（MAX）→ ★5到達',
    },
    milestones: [
      { id:'unlock', starMin:-1, starMax:-1, to:'0-1', shardCost:50, named:true,
        powerGain:'mid', costpa:6, immediacy:5,
        note:'基礎ステ+20%・電磁共鳴習得。フィオナがいると即シナジー',
        verdict:'基礎ステ+20%に加え、攻撃力×1,069.55%の「ライトニングチェーン」（7回反射）を持つ「電磁共鳴」を習得します。ただしテスラはロケラン軸が整ってから真価を発揮するタイプなので、ロケラン英雄が揃っていない段階では優先度は控えめです。フィオナがいればDoTシナジーが即座に効きますが、いない場合はキム→DVAの育成を先に終えてからで問題ありません（Reddit）。' },
      { id:'star1', starMin:0, starMax:0, to:'0-5', shardCost:80, named:false,
        powerGain:'mid', costpa:5, immediacy:6,
        note:'誘導電流DoT発動（攻撃力×3%/秒×30秒）。ロケラン数×3がスタック上限',
        verdict:'誘導電流という継続ダメージ（攻撃力×3%/秒×30秒）が発動します。スタック上限は「ロケラン英雄数×3（最大15）」と編成依存の仕組みなので、ロケラン3体以上＋フィオナがいる編成だとDoTコンボが本格化します。フィオナのDoTとテスラの電磁共鳴が噛み合い、継続火力が大きく伸びる段階です（cpt-hedge）。' },
      { id:'star3', starMin:1, starMax:2, to:'2-5', shardCost:550, named:false,
        powerGain:'mid', costpa:4, immediacy:6,
        note:'反射回数+1（8回）・追加ダメージ+20%',
        verdict:'ライトニングチェーンの反射回数が7回→8回に増え、追加ダメージも+20%乗ります。ロケラン軸をメインで使う場合は550かけらをかけて★3まで視野に入れる価値がありますが、ロケランがサブ軸の場合は優先度を下げて問題ありません（allclash）。' },
      { id:'star5', starMin:3, starMax:4, to:'4-5', shardCost:900, named:false,
        powerGain:'mid', costpa:3, immediacy:6,
        note:'反射+1（9回）・追加ダメージ+40%（MAX）',
        verdict:'反射回数が8回→9回（MAX）まで伸び、追加ダメージも+40%に達します。900かけらという投資量に対して、★3からの伸びは漸進的なものなので、ロケラン軸が完全に主力になっている場合のみ、長期目標として余裕があれば着手する形が現実的です（allclash）。' },
    ],
  },
};

const IMG = "img/";

const TYPE_ICON = { tank: IMG + "tank.png", air: IMG + "air.png", mis: IMG + "misile.png" };

const ROLE_ICON = { atk: IMG + "karyoku.png", wall: IMG + "tateyaku.png", sup: IMG + "support.png" };

const SHARD_ICON_SRC = IMG + "original.webp";

const FORMATION_PRESETS = [
  {
    id: 'f2p_tank_early',
    name: '【F2P序盤】戦車5体安定型',
    desc: 'キムがEW20未満でも組める安定編成。ウィリアムズ・マーフィの前衛2枚でキムを守る基本形。まずこれを目指そう。',
    source: 'allclash推奨',
    type: 'tank',
    spendLevel: 'f2p',  // f2p / low / mid
    note: 'EW Lv10でも機能する入門編成。各英雄EW20到達後に上位テンプレへ移行。',
    squad: [
      { id:'williams',  wp:10, note:'最優先でEW20へ' },
      { id:'murphy',    wp:10, note:'前衛2枚目・EW20へ' },
      { id:'kimberly',  wp:20, note:'EW20で覚醒前提達成' },
      { id:'marshall',  wp:0,  note:'EW0で機能・余裕があれば10〜20も有効' },
      { id:'stetmann',  wp:10, note:'サブ火力・EW20へ' },
    ]
  },
  {
    id: 'standard_tank',
    name: '【標準】戦車メタ完成形',
    desc: 'packsify標準メタ編成。キムEW30+覚醒★0以上が前提。マーシャルはEW0で機能（余裕があればEW10〜20も有効）。',
    source: 'packsify標準',
    type: 'tank',
    spendLevel: 'low',
    note: 'キムEW20で覚醒解放後、★1到達を目指しながら運用。EW30は長期目標でOK。',
    squad: [
      { id:'williams',  wp:20, note:'EW20が現実的節目' },
      { id:'murphy',    wp:10, note:'前衛安定役' },
      { id:'kimberly',  wp:30, note:'主力・覚醒優先' },
      { id:'marshall',  wp:0,  note:'EW0で機能・余裕があれば10〜20も有効' },
      { id:'stetmann',  wp:20, note:'サブ火力・EW20が節目' },
    ]
  },
  {
    id: 'kim_dva_whale',
    name: '【上位】キム+DVA混成最強型',
    desc: 'AoE（キム覚醒）＋単体バースト（DVA覚醒）の最強PvP編成。両者EW20+覚醒★0以上が前提。',
    source: 'packsify whale tier',
    type: 'mix',
    spendLevel: 'mid',
    note: 'DVA覚醒はWeek3解放。キム覚醒後にDVAへ投資。EW20で覚醒前提を満たしてから。',
    squad: [
      { id:'williams',  wp:20, note:'前衛必須' },
      { id:'murphy',    wp:10, note:'前衛2枚目' },
      { id:'kimberly',  wp:30, note:'覚醒★1以上推奨' },
      { id:'dva',       wp:20, note:'覚醒★0以上推奨' },
      { id:'marshall',  wp:0,  note:'EW0で機能・余裕があれば10〜20も有効' },
    ]
  },
  {
    id: 'air_standard',
    name: '【航空軸】DVA中心型',
    desc: '航空5体バフ+20%。DVA覚醒でさらに強化。ルシウスEW20が安定の鍵。',
    source: 'allclash推奨',
    type: 'air',
    spendLevel: 'low',
    note: '5航空を無理に組むより、コアが育ってから移行推奨（ldshop）。',
    squad: [
      { id:'lucius',    wp:20, note:'前衛・EW20が節目' },
      { id:'carlie',    wp:10, note:'前衛2枚目' },
      { id:'dva',       wp:20, note:'主力・覚醒対象' },
      { id:'morrison',  wp:10, note:'サブ火力' },
      { id:'schuyler',  wp:10, note:'CC役' },
    ]
  },
  {
    id: 'missile_dot',
    name: '【ロケラン軸】テスラDoT型',
    desc: 'テスラ覚醒（Week6解放）+フィオナのDoTコンボ。F2Pは覚醒キム→DVA後に検討。',
    source: 'cpt-hedge推奨',
    type: 'mis',
    spendLevel: 'low',
    note: 'テスラ覚醒はWeek6解放。1シーズンに1英雄集中のF2P原則ならキム優先。',
    squad: [
      { id:'mcgregor',  wp:10, note:'前衛タンク' },
      { id:'adam',      wp:10, note:'前衛2枚目' },
      { id:'fiona',     wp:20, note:'DoTコンボの核' },
      { id:'tesla',     wp:20, note:'覚醒後に真価' },
      { id:'swift',     wp:10, note:'サブ火力' },
    ]
  },
];

