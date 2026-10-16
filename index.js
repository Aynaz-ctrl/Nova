for (let index = localStorage.length - 1; index >= 0; index -= 1) {
  const key = localStorage.key(index);
  if (key?.startsWith('aynova')) localStorage.removeItem(key);
}

window.location.replace('signup.html?v=7');

const questionForm = document.querySelector('#question-form');
const questionNotice = document.querySelector('#question-notice');
const introButton = document.querySelector('#intro-button');
const introNotice = document.querySelector('#intro-notice');

introButton.addEventListener('click', () => {
  introNotice.hidden = false;
});

function toEnglishDigits(value) {
  return value.replace(/[۰-۹]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit));
}

function showNotice(message, isError) {
  questionNotice.textContent = message;
  questionNotice.classList.toggle('error', isError);
  questionNotice.hidden = false;
  questionNotice.focus();
}

questionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const firstName = document.querySelector('#question-first-name').value.trim();
  const lastName = document.querySelector('#question-last-name').value.trim();
  const phone = toEnglishDigits(document.querySelector('#question-phone').value.trim());
  const question = document.querySelector('#question-text').value.trim();

  if (!firstName || !lastName || !phone || !question) {
    showNotice('لطفاً نام، نام خانوادگی، شمارهٔ همراه و سؤال خود را کامل کنید.', true);
    return;
  }

  if (!/^09\d{9}$/.test(phone)) {
    showNotice('لطفاً شمارهٔ همراه را به‌صورت یک شمارهٔ موبایل معتبر وارد کنید.', true);
    return;
  }

  showNotice('اطلاعات کامل است. برای ارسال واقعی سؤال، فعلاً از یکی از راه‌های ارتباطی آی‌نوا استفاده کنید.', false);
});
