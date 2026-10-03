const signupForm = document.querySelector('#signup-form');
const signupError = document.querySelector('#signup-error');
const completionMessage = 'بعد از تکمیل کامل این بخش می‌توانید وارد بخش بعدی شوید.';

function toEnglishDigits(value) {
  return value.replace(/[۰-۹]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit));
}

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const firstName = document.querySelector('#first-name').value.trim();
  const lastName = document.querySelector('#last-name').value.trim();
  const parentPhone = document.querySelector('#parent-phone').value.trim();
  const age = document.querySelector('#age').value;
  const gender = document.querySelector('input[name="gender"]:checked');

  if (!firstName || !lastName || !parentPhone || !age || !gender) {
    signupError.textContent = completionMessage;
    signupError.hidden = false;
    signupError.focus();
    return;
  }

  const phoneDigits = toEnglishDigits(parentPhone);
  if (!/^09\d{9}$/.test(phoneDigits)) {
    signupError.textContent = 'لطفاً شمارهٔ تماس والد را به‌صورت یک شمارهٔ موبایل معتبر وارد کنید.';
    signupError.hidden = false;
    signupError.focus();
    return;
  }

  signupError.hidden = true;
  localStorage.setItem('aynovaFirstName', firstName);
  localStorage.setItem('aynovaLastName', lastName);
  localStorage.setItem('aynovaAge', age);
  localStorage.setItem('aynovaParentPhone', phoneDigits);
  localStorage.setItem('aynovaGender', gender.value);
  window.location.href = signupForm.action;
});
