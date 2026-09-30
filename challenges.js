const challenges = {
  1: {
    title: 'ساخت تصویر با AI',
    prompt: 'برای تصویر زیر یک پرامت بساز.',
    helper: 'به موضوع، سبک تصویر، نور، رنگ‌ها و جزئیات مهم فکر کن.',
    visual: 'تصویر تمرینی: یک شهر آینده‌نگر در غروب'
  },
  2: {
    title: 'ابزار مناسب را بگو',
    prompt: 'من می‌خواهم تصویر بسازم؛ از چه چیزی استفاده کنم؟',
    helper: 'نام یک ابزار مناسب را بنویس و خیلی کوتاه توضیح بده چرا برای ساخت تصویر انتخابش کردی.'
  },
  3: {
    title: 'چالش عملی',
    prompt: 'فکر کن می‌خواهی پاورپوینت بسازی ولی وقت نداری؛ چه کار می‌کنی؟',
    helper: 'با استفاده از ابزارها و پرامت‌هایی که یاد گرفتی، راه‌حل خودت را بنویس.'
  }
};

const selectedId = new URLSearchParams(window.location.search).get('challenge');
const page = document.querySelector('#challenges-page');

if (challenges[selectedId]) {
  const challenge = challenges[selectedId];
  page.innerHTML = `<a class="back" href="challenges.html?v=1">← بازگشت به چالش‌ها</a><section class="challenge-view"><p class="challenge-title"><span>چالش ${Number(selectedId).toLocaleString('fa-IR')}</span></p><h2>${challenge.title}</h2><p class="challenge-prompt">${challenge.prompt}</p>${challenge.visual ? `<div class="challenge-visual"><span>${challenge.visual}</span></div>` : ''}<p class="challenge-helper">${challenge.helper}</p><form class="challenge-form" id="challenge-form"><label for="challenge-answer">پاسخ تو</label><textarea id="challenge-answer" placeholder="پاسخت را اینجا بنویس..."></textarea><p class="challenge-error" id="challenge-error" hidden>اول پاسخ خودت را بنویس.</p><button type="submit">ارسال برای ارزیابی</button></form><section class="score-result" id="score-result" hidden></section></section>`;

  document.querySelector('#challenge-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const answer = document.querySelector('#challenge-answer').value.trim();
    const error = document.querySelector('#challenge-error');
    if (!answer) {
      error.hidden = false;
      return;
    }
    error.hidden = true;
    const score = Math.min(10, Math.max(1, Math.ceil(answer.length / 18)));
    const result = document.querySelector('#score-result');
    result.hidden = false;
    result.innerHTML = `<strong>امتیاز تو: ${score.toLocaleString('fa-IR')} از ۱۰</strong><p>ارزیابی آزمایشی ثبت شد. پاسخ دقیق‌تر و با جزئیات بیشتر، امتیاز بالاتری می‌گیرد.</p>`;
    localStorage.setItem(`aynovaChallenge${selectedId}`, JSON.stringify({ answer, score }));
  });
}
