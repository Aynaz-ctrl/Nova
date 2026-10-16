const learners = [
  ['آریا', 'محمدی', 890, 18, 7, 9, 'boy'], ['نورا', 'احمدی', 840, 17, 6, 8, 'girl'], ['پارسا', 'رضایی', 800, 16, 6, 8, 'boy'], ['هلیا', 'حسینی', 760, 15, 5, 8, 'girl'], ['سام', 'کاظمی', 730, 14, 6, 7, 'boy'], ['سارا', 'موسوی', 700, 14, 5, 7, 'girl'], ['بردیا', 'کریمی', 670, 13, 5, 7, 'boy'], ['آوا', 'نوری', 650, 13, 5, 6, 'girl'], ['ماهان', 'اکبری', 620, 12, 4, 6, 'boy'], ['نیلا', 'صادقی', 600, 12, 4, 6, 'girl'], ['رادین', 'جعفری', 570, 11, 4, 5, 'boy'], ['یاسمن', 'مرادی', 550, 11, 4, 5, 'girl'], ['کیان', 'عباسی', 530, 10, 3, 5, 'boy'], ['هانا', 'فلاحی', 510, 10, 3, 5, 'girl'], ['آرمین', 'رحیمی', 490, 9, 3, 4, 'boy'], ['رها', 'میرزایی', 470, 9, 3, 4, 'girl'], ['آراد', 'توحیدی', 450, 8, 3, 4, 'boy'], ['نازنین', 'شریفی', 430, 8, 2, 4, 'girl'], ['امیرعلی', 'قاسمی', 410, 7, 2, 3, 'boy'], ['آتنا', 'باقری', 390, 7, 2, 3, 'girl']
];

const leaderboard = document.querySelector('#leaderboard');

function avatarPosition(index) {
  const column = index % 4;
  const row = Math.floor(index / 4) % 2;
  return `${(column / 3) * 100}% ${row * 100}%`;
}

learners.forEach(([firstName, lastName, points, lessons, challenges, quizzes], index) => {
  const card = document.createElement('article');
  const gender = learners[index][6];
  card.className = `leader-card${index < 3 ? ' top-three' : ''}`;
  card.innerHTML = `<span class="rank">${(index + 1).toLocaleString('fa-IR')}</span><span class="avatar ${gender}" style="background-position:${avatarPosition(index)}" aria-hidden="true"></span><h2 class="leader-name">${firstName} ${lastName}</h2><p class="points">${points.toLocaleString('fa-IR')} امتیاز</p><div class="stats"><span><b>${lessons.toLocaleString('fa-IR')}</b><em>قسمت دیده‌شده</em></span><span><b>${challenges.toLocaleString('fa-IR')}</b><em>چالش درست</em></span><span><b>${quizzes.toLocaleString('fa-IR')}</b><em>آزمون درست</em></span></div>`;
  leaderboard.append(card);
});
