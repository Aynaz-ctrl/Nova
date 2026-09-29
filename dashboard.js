const studentName = localStorage.getItem('aynovaFirstName') || 'دوست من';
document.querySelector('#student-name').textContent = studentName;
