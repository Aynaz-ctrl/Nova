const chapterInfo = {
  1: { lessons: 4, title: 'آشنایی با دنیای هوش مصنوعی', question: 'کدام گزینه هوش مصنوعی را بهتر توضیح می‌دهد؟', options: ['فناوری‌ای که از داده‌ها الگو یاد می‌گیرد.', 'یک نوع تلفن همراه است.', 'فقط برای بازی استفاده می‌شود.'], answer: 0 },
  2: { lessons: 3, title: 'آشنایی با ابزارهای هوش مصنوعی', question: 'برای ساخت تصویر با AI چه چیزی به ابزار می‌دهیم؟', options: ['یک پرامت با جزئیات روشن.', 'فقط یک عدد.', 'رمز عبور حساب کاربری.'], answer: 0 },
  3: { lessons: 3, title: 'هنر Prompt نویسی', question: 'Prompt خوب چه ویژگی دارد؟', options: ['دقیق، روشن و همراه با جزئیات لازم است.', 'همیشه فقط یک کلمه است.', 'نباید هدف مشخصی داشته باشد.'], answer: 0 },
  4: { lessons: 3, title: 'ساختن با AI', question: 'برای ساخت یک پروژه با AI چه کار درستی انجام می‌دهیم؟', options: ['ابزار مناسب و پرامت مناسب را انتخاب می‌کنیم.', 'بدون فکر هر دکمه‌ای را می‌زنیم.', 'از بررسی نتیجه خودداری می‌کنیم.'], answer: 0 }
};

const quizId = new URLSearchParams(window.location.search).get('quiz');
const page = document.querySelector('#quizzes-page');
const savedLessons = JSON.parse(localStorage.getItem('aynovaLessons') || '{}');

function isChapterComplete(id) {
  return [...Array(chapterInfo[id].lessons)].every((_, index) => savedLessons[`${id}-${index + 1}`]);
}

function showQuiz(id) {
  const quiz = chapterInfo[id];
  page.innerHTML = `<a class="back" href="quizzes.html?v=1">← بازگشت به آزمون‌ها</a><section class="quiz-view"><p class="quiz-title"><span>آزمون پایان فصل ${Number(id).toLocaleString('fa-IR')}</span></p><h2>${quiz.title}</h2><p class="quiz-question">${quiz.question}</p><form id="quiz-form"><div class="answer-options">${quiz.options.map((option, index) => `<label class="answer-option"><input type="radio" name="answer" value="${index}" /><span>${option}</span></label>`).join('')}</div><p class="quiz-error" id="quiz-error" hidden>یک گزینه را انتخاب کن.</p><button class="quiz-submit" type="submit">ثبت پاسخ</button></form><section class="quiz-result" id="quiz-result" hidden></section></section>`;
  document.querySelector('#quiz-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const selected = document.querySelector('input[name="answer"]:checked');
    const error = document.querySelector('#quiz-error');
    if (!selected) {
      error.hidden = false;
      return;
    }
    error.hidden = true;
    const correct = Number(selected.value) === quiz.answer;
    const result = document.querySelector('#quiz-result');
    result.hidden = false;
    result.innerHTML = `<strong>${correct ? 'آفرین! پاسخ درست بود.' : 'تلاش خوبی بود؛ یکبار دیگر درس را مرور کن.'}</strong><p>امتیاز این آزمون: ${correct ? '۱۰' : '۵'} از ۱۰</p>`;
    localStorage.setItem(`aynovaQuiz${id}`, JSON.stringify({ correct, score: correct ? 10 : 5 }));
  });
}

if (quizId && chapterInfo[quizId] && isChapterComplete(quizId)) {
  showQuiz(quizId);
} else {
  document.querySelectorAll('.quiz-card').forEach((card) => {
    const id = card.dataset.chapter;
    const ready = isChapterComplete(id);
    const state = card.querySelector('.quiz-state');
    if (ready) {
      card.classList.add('ready');
      state.textContent = 'شروع آزمون';
      card.querySelector('em').textContent = 'فصل کامل شده و آزمون آماده است.';
    } else {
      state.textContent = 'قفل‌شده';
    }
    card.addEventListener('click', () => {
      if (ready) {
        window.location.href = `quizzes.html?v=1&quiz=${id}`;
        return;
      }
      const message = document.querySelector('#locked-message');
      message.textContent = `این آزمون بعد از پایان فصل ${Number(id).toLocaleString('fa-IR')} می‌توانید آزمون بدهید.`;
      message.hidden = false;
    });
  });
}
