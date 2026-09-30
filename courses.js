const savedLessons = JSON.parse(localStorage.getItem('aynovaLessons') || '{}');
const courseData = {
  2: ['ابزارهای کاربردی هوش مصنوعی', 'ساخت تصویر با ابزارهای AI', 'انتخاب ابزار مناسب'],
  3: ['Prompt چیست؟', 'نوشتن Prompt بهتر', 'تمرین Prompt نویسی'],
  4: ['ایده‌پردازی با AI', 'ساخت اولین پروژه', 'تبدیل ایده به محصول']
};
const modal = document.querySelector('#payment-modal');
const paymentForm = document.querySelector('#payment-form');
const paymentError = document.querySelector('#payment-error');

function updateChecks(scope = document) {
  scope.querySelectorAll('.check').forEach((mark) => {
    const done = Boolean(savedLessons[mark.dataset.lesson]);
    mark.classList.toggle('done', done);
    mark.textContent = done ? '✓' : '';
  });
}

function setupChapter(chapter) {
  const head = chapter.querySelector('.chapter-head');
  const list = chapter.querySelector('.lesson-list');
  if (!head || !list) return;
  list.classList.toggle('is-hidden', !chapter.classList.contains('open'));
  head.setAttribute('aria-expanded', String(chapter.classList.contains('open')));
  head.addEventListener('click', () => {
    const open = chapter.classList.toggle('open');
    list.classList.toggle('is-hidden', !open);
    head.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('.chapter:not(.locked)').forEach(setupChapter);
updateChecks();
const lessonCount = document.querySelector('#lesson-count');
if (lessonCount) {
  const marks = document.querySelectorAll('#chapter-1-lessons .check');
  const done = [...marks].filter((mark) => savedLessons[mark.dataset.lesson]).length;
  lessonCount.textContent = `${done.toLocaleString('fa-IR')} از ${marks.length.toLocaleString('fa-IR')} درس تکمیل شده`;
}

function closePayment() {
  modal.hidden = true;
  paymentError.hidden = true;
}

document.querySelector('#payment-close').addEventListener('click', closePayment);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closePayment();
});

document.querySelectorAll('.locked-head').forEach((head) => {
  head.addEventListener('click', () => {
    if (localStorage.getItem('aynovaFullAccess') === 'true') {
      unlockCourses();
      return;
    }
    modal.hidden = false;
    document.querySelector('#card-number').focus();
  });
});

paymentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = [...paymentForm.querySelectorAll('input')];
  if (fields.some((field) => !field.value.trim())) {
    paymentError.hidden = false;
    return;
  }
  localStorage.setItem('aynovaFullAccess', 'true');
  closePayment();
  unlockCourses();
});

function unlockCourses() {
  document.querySelectorAll('.chapter.locked').forEach((chapter) => {
    const number = chapter.dataset.chapter;
    const lessons = courseData[number];
    if (!lessons) return;
    const title = chapter.querySelector('strong').textContent;
    chapter.classList.remove('locked');
    chapter.classList.add('unlocked');
    chapter.innerHTML = '';

    const head = document.createElement('button');
    head.className = 'chapter-head';
    head.type = 'button';
    head.setAttribute('aria-expanded', 'false');
    head.innerHTML = `<span class="chapter-copy"><strong>${title}</strong><small>۰ از ${lessons.length} درس تکمیل شده</small></span><span class="status available">در دسترس</span><span class="chapter-toggle" aria-hidden="true">⌄</span>`;

    const list = document.createElement('ul');
    list.className = 'lesson-list is-hidden';
    lessons.forEach((lesson, index) => {
      const id = `${number}-${index + 1}`;
      const item = document.createElement('li');
      item.innerHTML = `<a class="lesson-row" href="lesson.html?v=5&lesson=${id}"><span>${lesson}</span><span class="lesson-start">شروع</span><span class="check" data-lesson="${id}" aria-hidden="true"></span></a>`;
      list.append(item);
    });
    chapter.append(head, list);
    setupChapter(chapter);
    updateChecks(chapter);
  });
}

if (localStorage.getItem('aynovaFullAccess') === 'true') unlockCourses();
