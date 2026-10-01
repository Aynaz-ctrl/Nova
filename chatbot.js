const name = localStorage.getItem('aynovaFirstName') || 'دوست من';
document.querySelector('#student-name').textContent = name;
const form = document.querySelector('#chat-form');
const input = document.querySelector('#chat-input');
const messages = document.querySelector('#chat-messages');
const submitButton = form.querySelector('button');

function appendMessage(text, type) {
  const message = document.createElement('p');
  message.className = `message ${type}`;
  message.textContent = text;
  messages.append(message);
  message.scrollIntoView({ block: 'nearest' });
  return message;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  input.value = '';
  input.disabled = true;
  submitButton.disabled = true;
  const pendingReply = appendMessage('نوا در حال فکرکردن است…', 'assistant pending');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, name })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'پاسخی دریافت نشد.');
    pendingReply.textContent = data.reply;
  } catch (error) {
    pendingReply.textContent = error.message || 'ارتباط با نوا برقرار نشد. دوباره تلاش کن.';
    pendingReply.classList.add('error');
  } finally {
    input.disabled = false;
    submitButton.disabled = false;
    input.focus();
  }
});
