const savedLessons = JSON.parse(localStorage.getItem('aynovaLessons') || '{}');
const checkMarks = [...document.querySelectorAll('.check')];

checkMarks.forEach((mark) => {
  const isDone = Boolean(savedLessons[mark.dataset.lesson]);
  mark.classList.toggle('done', isDone);
  mark.textContent = isDone ? '✓' : '';
});

const lessonCount = document.querySelector('#lesson-count');
const doneCount = checkMarks.filter((mark) => savedLessons[mark.dataset.lesson]).length;
if (lessonCount && checkMarks.length) {
  lessonCount.textContent = `${doneCount.toLocaleString('fa-IR')} از ${checkMarks.length.toLocaleString('fa-IR')} درس تکمیل شده`;
}

document.querySelectorAll('.chapter-head').forEach((head) => {
  const chapter = head.closest('.chapter');
  const list = document.getElementById(head.getAttribute('aria-controls'));
  const sync = () => {
    const isOpen = chapter.classList.contains('open');
    list.classList.toggle('is-hidden', !isOpen);
    head.setAttribute('aria-expanded', String(isOpen));
  };
  head.addEventListener('click', () => {
    chapter.classList.toggle('open');
    sync();
  });
  sync();
});

const courseData = {
  2: ['ابزارهای کاربردی هوش مصنوعی', 'ساخت تصویر با ابزارهای AI', 'انتخاب ابزار مناسب'],
  3: ['Prompt چیست؟', 'نوشتن Prompt بهتر', 'تمرین Prompt نویسی'],
  4: ['ایده‌پردازی با AI', 'ساخت اولین پروژه', 'تبدیل ایده به محصول']
};
const modal = document.querySelector('#payment-modal');
const paymentForm = document.querySelector('#payment-form');
const paymentError = document.querySelector('#payment-error');
const closePayment = () => { modal.hidden = true; paymentError.hidden = true; };

document.querySelector('#payment-close').addEventListener('click', closePayment);
modal.addEventListener('click', (event) => { if (event.target === modal) closePayment(); });

document.querySelectorAll('.locked-chapter').forEach((button) => {
  button.addEventListener('click', () => {
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
    if (!lessons || chapter.classList.contains('unlocked')) return;
    const title = chapter.querySelector('strong').textContent;
    chapter.classList.remove('locked');
    chapter.classList.add('unlocked');
    chapter.innerHTML = `<button class="chapter-head" type="button" aria-expanded="false"><span class="chapter-copy"><strong>${title}</strong><small>۰ از ${lessons.length} درس تکمیل شده</small></span><span class="status available">در دسترس</span><span class="chapter-toggle" aria-hidden="true">⌄</span></button><ul class="lesson-list is-hidden"></ul>`;
    const list = chapter.querySelector('.lesson-list');
    lessons.forEach((lesson, index) => {
      const id = `${number}-${index + 1}`;
      const item = document.createElement('li');
      item.innerHTML = `<a class="lesson-row" href="lesson.html?v=4&lesson=${id}"><span>${lesson}</span><span class="lesson-start">شروع</span><span class="check" data-lesson="${id}" aria-hidden="true"></span></a>`;
      list.append(item);
    });
    const head = chapter.querySelector('.chapter-head');
    head.addEventListener('click', () => {
      const open = chapter.classList.toggle('open');
      list.classList.toggle('is-hidden', !open);
      head.setAttribute('aria-expanded', String(open));
    });
  });
}

if (localStorage.getItem('aynovaFullAccess') === 'true') unlockCourses();
