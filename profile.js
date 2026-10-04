const form = document.querySelector('#profile-form');
const avatar = document.querySelector('#avatar');
const picker = document.querySelector('#character-picker');
const pickerGrid = document.querySelector('#picker-grid');
const pickerNotice = document.querySelector('#picker-notice');
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

const characters = {
  girl: [
    { id: 'girl-initial', label: 'کاراکتر دختر', source: 'initial' },
    { id: 'girl-1', label: 'دختر ۱', image: 'assets/aynova-girl-characters.jpg', position: '0 0' },
    { id: 'girl-2', label: 'دختر ۲', image: 'assets/aynova-girl-characters.jpg', position: '25% 0' },
    { id: 'girl-3', label: 'دختر ۳', image: 'assets/aynova-girl-characters.jpg', position: '50% 0' },
    { id: 'girl-4', label: 'دختر ۴', image: 'assets/aynova-girl-characters.jpg', position: '75% 0' },
    { id: 'girl-5', label: 'دختر ۵', image: 'assets/aynova-girl-characters.jpg', position: '100% 0' },
    { id: 'girl-6', label: 'دختر ۶', image: 'assets/aynova-girl-characters.jpg', position: '0 100%' },
    { id: 'girl-7', label: 'دختر ۷', image: 'assets/aynova-girl-characters.jpg', position: '25% 100%' },
    { id: 'girl-8', label: 'دختر ۸', image: 'assets/aynova-girl-characters.jpg', position: '50% 100%' }
  ],
  boy: [
    { id: 'boy-initial', label: 'کاراکتر پسر', source: 'initial' },
    { id: 'boy-1', label: 'پسر ۱', image: 'assets/aynova-boy-characters.jpg', position: '0 0' },
    { id: 'boy-2', label: 'پسر ۲', image: 'assets/aynova-boy-characters.jpg', position: '25% 0' },
    { id: 'boy-3', label: 'پسر ۳', image: 'assets/aynova-boy-characters.jpg', position: '50% 0' },
    { id: 'boy-4', label: 'پسر ۴', image: 'assets/aynova-boy-characters.jpg', position: '75% 0' },
    { id: 'boy-5', label: 'پسر ۵', image: 'assets/aynova-boy-characters.jpg', position: '100% 0' },
    { id: 'boy-6', label: 'پسر ۶', image: 'assets/aynova-boy-characters.jpg', position: '0 100%' },
    { id: 'boy-7', label: 'پسر ۷', image: 'assets/aynova-boy-characters.jpg', position: '25% 100%' },
    { id: 'boy-8', label: 'پسر ۸', image: 'assets/aynova-boy-characters.jpg', position: '50% 100%' }
  ]
};

const savedSelection = JSON.parse(localStorage.getItem('aynovaCharacterSelection') || '{}');

function applySelection(selection) {
  avatar.classList.toggle('girl', !selection || selection.gender === 'girl');
  avatar.classList.toggle('boy', selection?.gender === 'boy');
  if (!selection || selection.source === 'initial') {
    avatar.style.backgroundImage = '';
    avatar.style.backgroundSize = '';
    avatar.style.backgroundPosition = '';
    return;
  }
  avatar.style.backgroundImage = `url('${selection.image}')`;
  avatar.style.backgroundSize = '500% 200%';
  avatar.style.backgroundPosition = selection.position;
}

function renderPicker(gender) {
  pickerGrid.innerHTML = '';
  characters[gender].forEach((character) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'picker-option';
    option.dataset.id = character.id;
    option.dataset.gender = gender;
    if (character.source === 'initial') {
      option.innerHTML = `<span class="picker-thumb ${gender}"></span><span>${character.label}</span>`;
    } else {
      option.innerHTML = `<span class="picker-thumb" style="background-image:url('${character.image}');background-size:500% 200%;background-position:${character.position}"></span><span>${character.label}</span>`;
    }
    if (savedSelection.id === character.id) option.classList.add('selected');
    option.addEventListener('click', () => {
      const selection = character.source === 'initial'
        ? { id: character.id, gender, source: 'initial' }
        : { id: character.id, gender, image: character.image, position: character.position };
      localStorage.setItem('aynovaCharacterSelection', JSON.stringify(selection));
      applySelection(selection);
      pickerNotice.textContent = `کاراکتر ${character.label} انتخاب شد.`;
      pickerNotice.hidden = false;
      document.querySelectorAll('.picker-option').forEach((item) => item.classList.toggle('selected', item.dataset.id === character.id));
    });
    pickerGrid.append(option);
  });
}

applySelection(savedSelection);

document.querySelector('#edit-avatar').addEventListener('click', () => {
  picker.hidden = !picker.hidden;
  pickerNotice.hidden = true;
  if (!picker.hidden) renderPicker(savedSelection.gender || 'girl');
});

document.querySelectorAll('.gender-choice').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.gender-choice').forEach((item) => item.classList.toggle('active', item === button));
    renderPicker(button.dataset.gender);
  });
});
document.querySelector('.gender-choice').classList.add('active');

const editableFields = Object.values(fields);
document.querySelector('#start-edit').addEventListener('click', () => {
  editableFields.forEach((field) => { field.disabled = false; });
  document.querySelector('#start-edit').hidden = true;
  document.querySelector('#save-profile').hidden = false;
  fields.firstName.focus();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  localStorage.setItem('aynovaFirstName', fields.firstName.value.trim() || 'دوست من');
  localStorage.setItem('aynovaLastName', fields.lastName.value.trim());
  localStorage.setItem('aynovaAge', fields.age.value);
  localStorage.setItem('aynovaParentPhone', fields.phone.value.trim());
  document.querySelector('#saved-message').hidden = false;
  editableFields.forEach((field) => { field.disabled = true; });
  document.querySelector('#start-edit').hidden = false;
  document.querySelector('#save-profile').hidden = true;
});
