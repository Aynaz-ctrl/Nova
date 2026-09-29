const completeLesson = document.querySelector('#complete-lesson');

completeLesson.addEventListener('click', () => {
  const progress = Number(localStorage.getItem('aynovaProgress') || 0);
  localStorage.setItem('aynovaProgress', Math.min(progress + 20, 100));
  window.location.href = 'dashboard.html';
});
