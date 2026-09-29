const savedLessons = JSON.parse(localStorage.getItem('aynovaLessons') || '{}');
const totalLessons = document.querySelectorAll('.lesson-row').length;
const doneLessons = document.querySelectorAll('.lesson-row').length
  ? [...document.querySelectorAll('.check')].filter((mark) => savedLessons[mark.dataset.lesson]).length
  : 0;

document.querySelectorAll('.check').forEach((mark) => {
  mark.classList.toggle('done', Boolean(savedLessons[mark.dataset.lesson]));
  mark.textContent = savedLessons[mark.dataset.lesson] ? '✓' : '';
});

const lessonCount = document.querySelector('#lesson-count');
lessonCount.textContent = `${doneLessons.toLocaleString('fa-IR')} از ${totalLessons.toLocaleString('fa-IR')} درس تکمیل شده`;

document.querySelector('.chapter-head').addEventListener('click', (event) => {
  const chapter = event.currentTarget.closest('.chapter');
  const isOpen = chapter.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(isOpen));
});
