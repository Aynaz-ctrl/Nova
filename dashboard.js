const studentName = localStorage.getItem('aynovaFirstName') || 'دوست من';
const savedProgress = Number(localStorage.getItem('aynovaProgress') || 0);
const studentNameElement = document.querySelector('#student-name');
const progressNumber = document.querySelector('#progress-number');
const progressFill = document.querySelector('#progress-fill');
const continueButton = document.querySelector('#continue-lesson');

let progress = savedProgress;
studentNameElement.textContent = studentName;

function renderProgress() {
  progressNumber.textContent = `${progress}٪`;
  progressFill.style.width = `${progress}%`;
}

function openNextLesson() {
  progress = Math.min(progress + 20, 100);
  localStorage.setItem('aynovaProgress', progress);
  renderProgress();
}

continueButton.addEventListener('click', openNextLesson);

renderProgress();
