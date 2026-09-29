const markDone = document.querySelector('#mark-done');

function lessonState() {
  const saved = JSON.parse(localStorage.getItem('aynovaLessons') || '{}');
  saved['1-1'] = true;
  localStorage.setItem('aynovaLessons', JSON.stringify(saved));
}

markDone.addEventListener('click', () => {
  lessonState();
  markDone.textContent = 'انجام شد ✓';
  markDone.classList.add('done');
  window.location.href = 'courses.html?v=2';
});
