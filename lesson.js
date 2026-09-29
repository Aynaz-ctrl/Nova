const lessonId = new URLSearchParams(window.location.search).get('lesson') || '1-1';
const markDone = document.querySelector('#mark-done');

const saved = JSON.parse(localStorage.getItem('aynovaLessons') || '{}');
if (saved[lessonId]) {
  markDone.textContent = 'انجام شد ✓';
  markDone.classList.add('done');
}

markDone.addEventListener('click', () => {
  const current = JSON.parse(localStorage.getItem('aynovaLessons') || '{}');
  current[lessonId] = true;
  localStorage.setItem('aynovaLessons', JSON.stringify(current));
  window.location.href = 'courses.html?v=3';
});
