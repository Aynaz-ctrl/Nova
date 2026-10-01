const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { addMessage, getLearner, saveProgress, upsertLearner } = require('./database');

const port = Number(process.env.PORT) || 3000;
const publicDirectory = __dirname;
const maxMessageLength = 600;

function replyFor(message, name) {
  const text = message.trim().toLowerCase();
  const learner = name || 'دوست من';

  if (/سلام|درود|خوبی/.test(text)) return `سلام ${learner}! آماده‌ام دربارهٔ هوش مصنوعی و درس‌ها با هم یاد بگیریم. سوالت چیست؟`;
  if (/هوش مصنوعی|ai چیست|یعنی چه/.test(text)) return 'هوش مصنوعی فناوری‌ای است که با بررسی داده‌ها الگوها را یاد می‌گیرد و برای انجام کارهایی مثل پاسخ‌دادن، ساخت تصویر یا پیشنهاد دادن از آن الگوها استفاده می‌کند.';
  if (/پرامپت|prompt/.test(text)) return 'پرامپت همان دستور یا توضیحی است که به ابزار هوش مصنوعی می‌دهی. یک پرامپت خوب هدف روشن، جزئیات لازم و نتیجهٔ موردانتظار را بیان می‌کند.';
  if (/تصویر|عکس/.test(text)) return 'برای ساخت تصویر با AI، ایده‌ات را با یک پرامپت دقیق توضیح بده: موضوع، سبک، رنگ‌ها و جزئیات مهم. سپس نتیجه را بررسی کن و در صورت نیاز پرامپت را بهتر کن.';
  if (/درس|فصل|دوره/.test(text)) return 'دوره از چهار فصل تشکیل شده است: دنیای هوش مصنوعی، ابزارهای هوش مصنوعی، هنر پرامپت‌نویسی و ساختن با AI. هر فصل را قدم‌به‌قدم تمام کن تا آزمون آن باز شود.';
  if (/آزمون|کوئیز|quiz/.test(text)) return 'بعد از کامل‌کردن تمام درس‌های هر فصل، آزمون همان فصل باز می‌شود. پاسخ درست ۱۰ امتیاز و پاسخ نادرست ۵ امتیاز دارد؛ پس نگران اشتباه‌کردن نباش.';
  if (/چالش|تمرین/.test(text)) return 'چالش‌ها برای تمرین‌کردن هستند. اول هدف چالش را بخوان، یک پاسخ ساده بنویس و بعد آن را با جزئیات بیشتر بهتر کن.';
  return `سوال خوبی پرسیدی ${learner}. من فعلاً دربارهٔ درس‌های هوش مصنوعی، ابزارها، پرامپت‌نویسی، آزمون‌ها و چالش‌ها راهنمایی می‌کنم. می‌توانی سوالت را کمی دقیق‌تر و مرتبط با یکی از این موضوع‌ها بپرسی؟`;
}

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 4096) reject(new Error('too-large'));
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('invalid-json'));
      }
    });
    request.on('error', reject);
  });
}

function learnerId(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9-]{10,80}$/.test(value) ? value : randomUUID();
}

function publicLearner(learner) {
  return { id: learner.id, name: learner.name, lessons: learner.lessons, quizzes: learner.quizzes, challenges: learner.challenges, updatedAt: learner.updatedAt };
}

function serveStatic(request, response) {
  const requestPath = new URL(request.url, `http://${request.headers.host}`).pathname;
  const fileName = requestPath === '/' ? 'index.html' : decodeURIComponent(requestPath).replace(/^\/+/, '');
  const filePath = path.resolve(publicDirectory, fileName);
  const privatePath = fileName.startsWith('data/') || fileName === 'server.js' || fileName === 'database.js' || fileName === 'package.json';

  if (privatePath || !filePath.startsWith(`${publicDirectory}${path.sep}`) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('صفحه پیدا نشد.');
    return;
  }

  const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
  response.writeHead(200, { 'Content-Type': `${types[path.extname(filePath)] || 'application/octet-stream'}; charset=utf-8` });
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  try {
    if (request.method === 'POST' && url.pathname === '/api/learners') {
      const body = await readBody(request);
      const learner = upsertLearner(learnerId(body.learnerId), typeof body.name === 'string' ? body.name.trim().slice(0, 50) : '');
      sendJson(response, 201, { learner: publicLearner(learner) });
      return;
    }

    const progressMatch = url.pathname.match(/^\/api\/learners\/([a-zA-Z0-9-]{10,80})\/progress$/);
    if (request.method === 'PUT' && progressMatch) {
      const body = await readBody(request);
      const learner = saveProgress(progressMatch[1], body);
      if (!learner) {
        sendJson(response, 404, { error: 'پروفایل پیدا نشد.' });
        return;
      }
      sendJson(response, 200, { learner: publicLearner(learner) });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/chat') {
      const body = await readBody(request);
      if (typeof body.message !== 'string' || !body.message.trim()) {
        sendJson(response, 400, { error: 'پیام را وارد کن.' });
        return;
      }
      if (body.message.length > maxMessageLength) {
        sendJson(response, 400, { error: 'پیام باید حداکثر ۶۰۰ نویسه باشد.' });
        return;
      }
      const id = learnerId(body.learnerId);
      const learner = upsertLearner(id, typeof body.name === 'string' ? body.name.trim().slice(0, 50) : '');
      const reply = replyFor(body.message, learner.name);
      addMessage(id, 'user', body.message.trim());
      addMessage(id, 'assistant', reply);
      sendJson(response, 200, { learnerId: id, reply });
      return;
    }
  } catch (error) {
    sendJson(response, error.message === 'too-large' ? 413 : 400, { error: error.message === 'too-large' ? 'درخواست خیلی بزرگ است.' : 'درخواست معتبر نیست.' });
    return;
  }

  if (request.method === 'GET' || request.method === 'HEAD') {
    serveStatic(request, response);
    return;
  }

  sendJson(response, 405, { error: 'این روش درخواست پشتیبانی نمی‌شود.' });
});

server.listen(port, () => {
  console.log(`AyNova is running on port ${port}`);
});
