const apiUrl = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const apiKey = process.env.OPENAI_API_KEY;

async function generateReply(message, name) {
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 500,
        messages: [
          { role: 'system', content: `تو «نوا» مربی صمیمی و باحوصلهٔ یادگیری ${name || 'دانش‌آموز'} هستی. فارسی روان، طبیعی و گرم جواب بده؛ خشک، رباتیک یا بیش‌ازحد رسمی نباش. پاسخ را کوتاه اما مفید بنویس، اگر سوال مبهم بود یک سوال روشن‌کننده بپرس، و برای کودک از زبان ساده و امن استفاده کن. دربارهٔ موضوعات درسی هوش مصنوعی مثال ساده بزن و اگر پاسخ را نمی‌دانی صادقانه بگو.` },
          { role: 'user', content: message.trim() }
        ]
      })
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { generateReply };
