const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const firstName = document.querySelector('#first-name').value.trim();
  localStorage.setItem('aynovaFirstName', firstName || 'دوست من');
  localStorage.setItem('aynovaLastName', document.querySelector('#last-name').value.trim());
  localStorage.setItem('aynovaAge', document.querySelector('#age').value);
  localStorage.setItem('aynovaParentPhone', document.querySelector('#parent-phone').value.trim());
  window.location.href = signupForm.action;
});
