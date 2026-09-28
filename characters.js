const characterForm = document.querySelector('.character-form');

characterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const selectedCharacter = document.querySelector('input[name="character"]:checked');
  localStorage.setItem('aynovaCharacter', selectedCharacter?.value || 'girl');
  window.location.href = characterForm.action;
});
