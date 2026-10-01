const form = document.querySelector('#profile-form');
const avatar = document.querySelector('#avatar');
const fields = {
  firstName: document.querySelector('#profile-first-name'),
  lastName: document.querySelector('#profile-last-name'),
  age: document.querySelector('#profile-age'),
  phone: document.querySelector('#profile-phone')
};

fields.firstName.value = localStorage.getItem('aynovaFirstName') || '';
fields.lastName.value = localStorage.getItem('aynovaLastName') || '';
fields.age.value = localStorage.getItem('aynovaAge') || '';
fields.phone.value = localStorage.getItem('aynovaParentPhone') || '';

function setCharacter(character) {
  avatar.classList.toggle('girl', character === 'girl');
  avatar.classList.toggle('boy', character === 'boy');
}

setCharacter(localStorage.getItem('aynovaCharacter') || 'girl');
document.querySelector('#edit-avatar').addEventListener('click', () => {
  const character = avatar.classList.contains('girl') ? 'boy' : 'girl';
  localStorage.setItem('aynovaCharacter', character);
  setCharacter(character);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  localStorage.setItem('aynovaFirstName', fields.firstName.value.trim() || 'دوست من');
  localStorage.setItem('aynovaLastName', fields.lastName.value.trim());
  localStorage.setItem('aynovaAge', fields.age.value);
  localStorage.setItem('aynovaParentPhone', fields.phone.value.trim());
  document.querySelector('#saved-message').hidden = false;
});
