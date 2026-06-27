// functions/api/ai-evaluate.js
//
// Cloudflare Pages Functions のサーバーサイド関数。
// ブラウザから直接 Gemini API を呼ぶと API キーが露出してしまうため、
// このサーバーレス関数を「中継役」として挟み、キーは環境変数として
// Cloudflare Pages 側にのみ保持する。
//
// 必須設定（Cloudflare Pages の管理画面で行う・コードには書かない）：
//   Settings > Environment variables > GEMINI_API_KEY を追加（Secret として）
//
// フロントエンド（app.js）からは fetch('/api/ai-evaluate', { method:'POST', body: ... })
// で呼び出す。エンドポイントのURLは常に自分のサイト内なので、外部にキーが漏れることはない。

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return jsonResponse({ error: 'サーバー側にAPIキーが設定されていません（GEMINI_API_KEY未設定）。' }, 500);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse({ error: 'リクエストボディがJSONとして解析できませんでした。' }, 400);
    }

    const prompt = (body && typeof body.prompt === 'string') ? body.prompt.trim() : '';
    if (!prompt) {
      return jsonResponse({ error: 'promptが空です。' }, 400);
    }

    // 簡易的な長さ制限（暴走防止・無料枠の節約）
    const MAX_PROMPT_LEN = 12000;
    if (prompt.length > MAX_PROMPT_LEN) {
      return jsonResponse({ error: `プロンプトが長すぎます（${prompt.length}文字）。${MAX_PROMPT_LEN}文字以内にしてください。` }, 400);
    }

    // モデルは無料枠で使える Flash 系を指定。
    // 将来モデル名が変わった場合はここだけ書き換えればよい。
    const MODEL = 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: prompt }] }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048
        }
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => '');
      return jsonResponse({
        error: `Gemini API呼び出しに失敗しました（HTTP ${geminiRes.status}）。`,
        detail: errText.slice(0, 500)
      }, 502);
    }

    const data = await geminiRes.json();

    // Gemini のレスポンス構造から本文テキストを抽出
    const text = extractText(data);

    if (!text) {
      return jsonResponse({
        error: 'Gemini APIから本文を取得できませんでした（フィルタ等でブロックされた可能性があります）。',
        raw: data
      }, 502);
    }

    return jsonResponse({ text });

  } catch (err) {
    return jsonResponse({ error: '予期しないエラーが発生しました。', detail: String(err && err.message || err) }, 500);
  }
}

// GET アクセス時は簡単な動作確認メッセージを返す（疎通確認用）
export async function onRequestGet(context) {
  const hasKey = !!(context.env && context.env.GEMINI_API_KEY);
  return jsonResponse({
    ok: true,
    message: 'ai-evaluate エンドポイントは稼働中です。POSTで {prompt: "..."} を送ってください。',
    apiKeyConfigured: hasKey
  });
}

function extractText(geminiData) {
  try {
    const candidates = geminiData && geminiData.candidates;
    if (!Array.isArray(candidates) || candidates.length === 0) return '';
    const parts = candidates[0] && candidates[0].content && candidates[0].content.parts;
    if (!Array.isArray(parts)) return '';
    return parts.map(p => p.text || '').join('').trim();
  } catch (e) {
    return '';
  }
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
