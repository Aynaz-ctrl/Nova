const chapters = [
  { id: 1, lessons: 4, title: 'فصل ۱: آشنایی با دنیای هوش مصنوعی' },
  { id: 2, lessons: 3, title: 'فصل ۲: آشنایی با ابزارهای هوش مصنوعی' },
  { id: 3, lessons: 3, title: 'فصل ۳: هنر Prompt نویسی' },
  { id: 4, lessons: 3, title: 'فصل ۴: ساختن با AI' }
];
const savedLessons = JSON.parse(localStorage.getItem('aynovaLessons') || '{}');
const name = localStorage.getItem('aynovaFirstName') || 'تو';
const completedLessons = Object.values(savedLessons).filter(Boolean).length;
const totalLessons = chapters.reduce((total, chapter) => total + chapter.lessons, 0);
const quizScore = chapters.reduce((total, chapter) => total + (JSON.parse(localStorage.getItem(`aynovaQuiz${chapter.id}`) || '{}').score || 0), 0);
const challengeScore = [1, 2, 3].reduce((total, id) => total + (JSON.parse(localStorage.getItem(`aynovaChallenge${id}`) || '{}').score || 0), 0);
const totalScore = completedLessons * 10 + quizScore + challengeScore;
const percentage = Math.round((completedLessons / totalLessons) * 100);

document.querySelector('#student-name').textContent = name;
document.querySelector('#score-name').textContent = name;
document.querySelector('#overall-progress').textContent = `${percentage.toLocaleString('fa-IR')}٪`;
document.querySelector('#overall-fill').style.width = `${percentage}%`;
document.querySelector('#completed-lessons').textContent = completedLessons.toLocaleString('fa-IR');
document.querySelector('#lesson-total').textContent = `از ${totalLessons.toLocaleString('fa-IR')} درس`;
document.querySelector('#total-score').textContent = totalScore.toLocaleString('fa-IR');

const progressList = document.querySelector('#chapter-progress');
chapters.forEach((chapter) => {
  const complete = [...Array(chapter.lessons)].filter((_, index) => savedLessons[`${chapter.id}-${index + 1}`]).length;
  const chapterPercent = Math.round((complete / chapter.lessons) * 100);
  const row = document.createElement('div');
  row.className = 'chapter-progress-row';
  row.innerHTML = `<strong>${chapter.title}</strong><span>${complete.toLocaleString('fa-IR')} از ${chapter.lessons.toLocaleString('fa-IR')} درس</span><div class="progress-track"><i style="width: ${chapterPercent}%"></i></div>`;
  progressList.append(row);
});
