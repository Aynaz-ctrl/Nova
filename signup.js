const signupForm = document.querySelector('#signup-form');
const signupError = document.querySelector('#signup-error');

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const firstName = document.querySelector('#first-name').value.trim();
  const lastName = document.querySelector('#last-name').value.trim();
  const parentPhone = document.querySelector('#parent-phone').value.trim();
  const age = document.querySelector('#age').value;
  const gender = document.querySelector('input[name="gender"]:checked');

  if (!firstName || !lastName || !parentPhone || !age || !gender) {
    signupError.hidden = false;
    return;
  }

  signupError.hidden = true;
  localStorage.setItem('aynovaFirstName', firstName);
  localStorage.setItem('aynovaLastName', lastName);
  localStorage.setItem('aynovaAge', age);
  localStorage.setItem('aynovaParentPhone', parentPhone);
  localStorage.setItem('aynovaGender', gender.value);
  window.location.href = signupForm.action;
});
