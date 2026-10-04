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

const collages = {
  girl: 'assets/aynova-girl-characters.jpg',
  boy: 'assets/aynova-boy-characters.jpg'
};

function collagePosition(index) {
  const column = index % 4;
  const row = Math.floor(index / 4);
  return `${(column / 3) * 100}% ${(row / 1) * 100}%`;
}

function buildCharacters(gender) {
  const labels = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸'];
  const noun = gender === 'girl' ? 'دختر' : 'پسر';
  return [
    { id: `${gender}-initial`, label: `کاراکتر ${noun}`, source: 'initial' },
    ...labels.map((label, index) => ({ id: `${gender}-${index + 1}`, label: `${noun} ${label}`, image: collages[gender], position: collagePosition(index) }))
  ];
}

const characters = { girl: buildCharacters('girl'), boy: buildCharacters('boy') };

const savedSelection = JSON.parse(localStorage.getItem('aynovaCharacterSelection') || '{}');

function applySelection(selection) {
  const onboardingGender = localStorage.getItem('aynovaCharacter') || 'girl';
  const isOnboardingPick = !selection || selection.source === 'initial';
  const gender = isOnboardingPick ? onboardingGender : selection.gender;
  avatar.classList.toggle('girl', gender === 'girl');
  avatar.classList.toggle('boy', gender === 'boy');
  if (isOnboardingPick) {
    avatar.style.backgroundImage = "url('assets/aynova-characters.jpg')";
    avatar.style.backgroundSize = '200% 100%';
    avatar.style.backgroundPosition = onboardingGender === 'boy' ? 'right center' : 'left center';
    return;
  }
  avatar.style.backgroundImage = `url('${selection.image}')`;
  avatar.style.backgroundSize = '400% 200%';
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
      option.innerHTML = `<span class="picker-thumb" style="background-image:url('${character.image}');background-size:400% 200%;background-position:${character.position}"></span><span>${character.label}</span>`;
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
