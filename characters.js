const characterForm = document.querySelector('.character-form');
const characterError = document.querySelector('#character-error');

characterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const selectedCharacter = document.querySelector('input[name="character"]:checked');

  if (!selectedCharacter) {
    characterError.hidden = false;
    return;
  }

  characterError.hidden = true;
  localStorage.setItem('aynovaCharacter', selectedCharacter.value);
  window.location.href = characterForm.action;
});
