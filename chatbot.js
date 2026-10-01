const name = localStorage.getItem('aynovaFirstName') || 'دوست من';
document.querySelector('#student-name').textContent = name;
const form = document.querySelector('#chat-form');
const input = document.querySelector('#chat-input');
const messages = document.querySelector('#chat-messages');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const userMessage = document.createElement('p');
  userMessage.className = 'message user';
  userMessage.textContent = text;
  messages.append(userMessage);
  input.value = '';
  const reply = document.createElement('p');
  reply.className = 'message assistant';
  reply.textContent = 'این نسخهٔ نمایشی چت‌بات است. فردا پاسخ‌گویی واقعی و امنِ نوا را به آن وصل می‌کنیم.';
  messages.append(reply);
  reply.scrollIntoView({ block: 'nearest' });
});
