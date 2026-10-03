const characterForm = document.querySelector('.character-form');
const characterError = document.querySelector('#character-error');
const requiredProfileFields = ['aynovaFirstName', 'aynovaLastName', 'aynovaAge', 'aynovaParentPhone', 'aynovaGender'];

if (!requiredProfileFields.every((field) => localStorage.getItem(field))) {
  window.location.replace('signup.html');
}

characterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const selectedCharacter = document.querySelector('input[name="character"]:checked');

  if (!selectedCharacter) {
    characterError.hidden = false;
    characterError.focus();
    return;
  }

  characterError.hidden = true;
  localStorage.setItem('aynovaCharacter', selectedCharacter.value);
  window.location.href = characterForm.action;
});
