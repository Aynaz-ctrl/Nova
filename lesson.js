const lessonId = new URLSearchParams(window.location.search).get('lesson') || '1-1';
const lessons = {
  1: ['هوش مصنوعی چیست؟', 'هوش مصنوعی چگونه یاد می‌گیرد؟', 'AI چه کارهایی می‌تواند انجام دهد؟', 'انسان و هوش مصنوعی'],
  2: ['ابزارهای کاربردی هوش مصنوعی', 'ساخت تصویر با ابزارهای AI', 'انتخاب ابزار مناسب'],
  3: ['Prompt چیست؟', 'نوشتن Prompt بهتر', 'تمرین Prompt نویسی'],
  4: ['ایده‌پردازی با AI', 'ساخت اولین پروژه', 'تبدیل ایده به محصول']
};
const chapterTitles = { 1: 'آشنایی با دنیای هوش مصنوعی', 2: 'آشنایی با ابزارهای هوش مصنوعی', 3: 'هنر Prompt نویسی', 4: 'ساختن با AI' };
const [chapterId, lessonNumber] = lessonId.split('-').map(Number);
const lessonTitle = lessons[chapterId]?.[lessonNumber - 1] || 'درس آموزشی';
const markDone = document.querySelector('#mark-done');
const nextPart = document.querySelector('#next-part');

document.title = `${lessonTitle} | AyNova AI`;
document.querySelector('#chapter-name').textContent = `فصل ${chapterId.toLocaleString('fa-IR')}: ${chapterTitles[chapterId]}`;
document.querySelector('#lesson-title').textContent = lessonTitle;

const saved = JSON.parse(localStorage.getItem('aynovaLessons') || '{}');
if (saved[lessonId]) {
  markDone.textContent = 'انجام شد ✓';
  markDone.classList.add('done');
}

const nextId = lessonNumber < lessons[chapterId].length ? `${chapterId}-${lessonNumber + 1}` : null;
if (nextId) {
  nextPart.href = `lesson.html?v=6&lesson=${nextId}`;
} else {
  nextPart.href = 'courses.html?v=10';
  nextPart.textContent = 'بازگشت به دوره‌ها';
}

markDone.addEventListener('click', () => {
  const current = JSON.parse(localStorage.getItem('aynovaLessons') || '{}');
  current[lessonId] = true;
  localStorage.setItem('aynovaLessons', JSON.stringify(current));
  markDone.textContent = 'انجام شد ✓';
  markDone.classList.add('done');
});
