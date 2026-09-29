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
    const isOpen = chapter.classList.toggle('open');
    list.classList.toggle('is-hidden', !isOpen);
    head.setAttribute('aria-expanded', String(isOpen));
  };
  head.addEventListener('click', sync);
  sync();
});
