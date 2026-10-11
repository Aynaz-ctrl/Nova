const lessonId = new URLSearchParams(window.location.search).get('lesson') || '1-1';
const lessons = {
  1: ['هوش مصنوعی چیست؟', 'هوش مصنوعی چگونه یاد می‌گیرد؟', 'آشنایی با چت جی پی تی'],
  2: ['ساخت جیمیل بخش ۱', 'ساخت جیمیل بخش ۲', 'ورود و ثبت نام در هوش مصنوعی'],
  3: ['Prompt چیست؟', 'اصول پرامت نویسی بخش ۱', 'اصول پرامت نویسی بخش ۲', 'تست پرامت'],
  4: ['ایده‌پردازی با AI', 'ساخت اولین پروژه', 'تبدیل ایده به محصول']
};
const chapterTitles = { 1: 'آشنایی با دنیای هوش مصنوعی', 2: 'جیمیل و ورود', 3: 'هنر Prompt نویسی', 4: 'ساختن با AI' };
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
  nextPart.href = `lesson.html?v=7&lesson=${nextId}`;
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
