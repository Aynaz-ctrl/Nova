const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT) || 3000;
const publicDirectory = __dirname;
const maxMessageLength = 600;

function replyFor(message, name) {
  const text = message.trim().toLowerCase();
  const learner = name || 'دوست من';

  if (/سلام|درود|خوبی/.test(text)) {
    return `سلام ${learner}! آماده‌ام دربارهٔ هوش مصنوعی و درس‌ها با هم یاد بگیریم. سوالت چیست؟`;
  }
  if (/هوش مصنوعی|ai چیست|یعنی چه/.test(text)) {
    return 'هوش مصنوعی فناوری‌ای است که با بررسی داده‌ها الگوها را یاد می‌گیرد و برای انجام کارهایی مثل پاسخ‌دادن، ساخت تصویر یا پیشنهاد دادن از آن الگوها استفاده می‌کند.';
  }
  if (/پرامپت|prompt/.test(text)) {
    return 'پرامپت همان دستور یا توضیحی است که به ابزار هوش مصنوعی می‌دهی. یک پرامپت خوب هدف روشن، جزئیات لازم و نتیجهٔ موردانتظار را بیان می‌کند.';
  }
  if (/تصویر|عکس/.test(text)) {
    return 'برای ساخت تصویر با AI، ایده‌ات را با یک پرامپت دقیق توضیح بده: موضوع، سبک، رنگ‌ها و جزئیات مهم. سپس نتیجه را بررسی کن و در صورت نیاز پرامپت را بهتر کن.';
  }
  if (/درس|فصل|دوره/.test(text)) {
    return 'دوره از چهار فصل تشکیل شده است: دنیای هوش مصنوعی، ابزارهای هوش مصنوعی، هنر پرامپت‌نویسی و ساختن با AI. هر فصل را قدم‌به‌قدم تمام کن تا آزمون آن باز شود.';
  }
  if (/آزمون|کوئیز|quiz/.test(text)) {
    return 'بعد از کامل‌کردن تمام درس‌های هر فصل، آزمون همان فصل باز می‌شود. پاسخ درست ۱۰ امتیاز و پاسخ نادرست ۵ امتیاز دارد؛ پس نگران اشتباه‌کردن نباش.';
  }
  if (/چالش|تمرین/.test(text)) {
    return 'چالش‌ها برای تمرین‌کردن هستند. اول هدف چالش را بخوان، یک پاسخ ساده بنویس و بعد آن را با جزئیات بیشتر بهتر کن.';
  }
  return `سوال خوبی پرسیدی ${learner}. من فعلاً دربارهٔ درس‌های هوش مصنوعی، ابزارها، پرامپت‌نویسی، آزمون‌ها و چالش‌ها راهنمایی می‌کنم. می‌توانی سوالت را کمی دقیق‌تر و مرتبط با یکی از این موضوع‌ها بپرسی؟`;
}

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(body));
}

function serveStatic(request, response) {
  const requestPath = new URL(request.url, `http://${request.headers.host}`).pathname;
  const fileName = requestPath === '/' ? 'index.html' : decodeURIComponent(requestPath).replace(/^\/+/, '');
  const filePath = path.resolve(publicDirectory, fileName);

  if (!filePath.startsWith(`${publicDirectory}${path.sep}`) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('صفحه پیدا نشد.');
    return;
  }

  const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
  response.writeHead(200, { 'Content-Type': `${types[path.extname(filePath)] || 'application/octet-stream'}; charset=utf-8` });
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/api/chat') {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 4096) request.destroy();
    });
    request.on('end', () => {
      try {
        const { message, name } = JSON.parse(body);
        if (typeof message !== 'string' || !message.trim()) {
          sendJson(response, 400, { error: 'پیام را وارد کن.' });
          return;
        }
        if (message.length > maxMessageLength) {
          sendJson(response, 400, { error: 'پیام باید حداکثر ۶۰۰ نویسه باشد.' });
          return;
        }
        sendJson(response, 200, { reply: replyFor(message, typeof name === 'string' ? name.slice(0, 50) : '') });
      } catch {
        sendJson(response, 400, { error: 'درخواست معتبر نیست.' });
      }
    });
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
