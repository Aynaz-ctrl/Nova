const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, 'data', 'database.json');

function read() {
  if (!fs.existsSync(filePath)) {
    write({ learners: {} });
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function write(database) {
  const temporaryPath = `${filePath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(database, null, 2)}\n`);
  fs.renameSync(temporaryPath, filePath);
}

function getLearner(id) {
  const database = read();
  return database.learners[id] || null;
}

function upsertLearner(id, name) {
  const database = read();
  const learner = database.learners[id] || { id, name: 'دوست من', lessons: {}, quizzes: {}, challenges: {}, messages: [], createdAt: new Date().toISOString() };
  learner.name = name || learner.name;
  learner.updatedAt = new Date().toISOString();
  database.learners[id] = learner;
  write(database);
  return learner;
}

function saveProgress(id, progress) {
  const database = read();
  const learner = database.learners[id];
  if (!learner) return null;
  learner.lessons = progress.lessons || learner.lessons;
  learner.quizzes = progress.quizzes || learner.quizzes;
  learner.challenges = progress.challenges || learner.challenges;
  learner.updatedAt = new Date().toISOString();
  write(database);
  return learner;
}

function addMessage(id, role, text) {
  const database = read();
  const learner = database.learners[id];
  if (!learner) return null;
  learner.messages.push({ role, text, createdAt: new Date().toISOString() });
  learner.messages = learner.messages.slice(-100);
  learner.updatedAt = new Date().toISOString();
  write(database);
}

module.exports = { addMessage, getLearner, saveProgress, upsertLearner };
