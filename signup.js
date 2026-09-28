const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const firstName = document.querySelector('#first-name').value.trim();
  localStorage.setItem('aynovaFirstName', firstName || 'دوست من');
  window.location.href = signupForm.action;
});
