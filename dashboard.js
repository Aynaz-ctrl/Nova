const studentName = localStorage.getItem('aynovaFirstName') || 'دوست من';
const progress = Number(localStorage.getItem('aynovaProgress') || 0);
document.querySelector('#student-name').textContent = studentName;
document.querySelector('#progress-number').textContent = `${progress}٪`;
document.querySelector('#progress-fill').style.width = `${progress}%`;
