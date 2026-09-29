const progress = Number(localStorage.getItem('aynovaProgress') || 0);
const completedLessons = Math.min(Math.floor(progress / 25), 4);
document.querySelector('#lesson-count').textContent = `${completedLessons.toLocaleString('fa-IR')} از ۴ درس تکمیل شده`;
