// server.js (усиленный)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { readDb, writeDb, getNextId, sanitizeDb } = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// при старте — разовая санитация (если нужно)
const db0 = readDb();
const dbSan = sanitizeDb(db0);
writeDb(dbSan);

// === helpers for dedupe
function isSameJob(a, b) {
  if (!a || !b) return false;
  return (
    a.companyName &&
    b.companyName &&
    a.companyName.trim() === b.companyName.trim() &&
    a.email &&
    b.email &&
    a.email.trim() === b.email.trim()
  );
}
function isSameWorker(a, b) {
  if (!a || !b) return false;
  return (
    a.firstName &&
    b.firstName &&
    a.firstName.trim() === b.firstName.trim() &&
    a.lastName &&
    b.lastName &&
    a.lastName.trim() === b.lastName.trim() &&
    a.email &&
    b.email &&
    a.email.trim() === b.email.trim()
  );
}

// ===== Workers =====
app.get('/workers', (req, res) => {
  const db = readDb();
  res.json(db.workers || []);
});

app.post('/workers', (req, res) => {
  const db = readDb();
  db.workers = db.workers || [];
  const incoming = req.body;
  // простая защита от явных дублей
  const existing = db.workers.find((w) => isSameWorker(w, incoming));
  if (existing) {
    // возвращаем существующий (или можно обновить)
    return res.json(existing);
  }
  const newWorker = { id: getNextId(db.workers), ...incoming };
  db.workers.push(newWorker);
  writeDb(db);
  res.json(newWorker);
});

app.put('/workers/:id', (req, res) => {
  const db = readDb();
  const workerId = parseInt(req.params.id, 10);
  const idx = (db.workers || []).findIndex((w) => w.id === workerId);
  if (idx !== -1) {
    db.workers[idx] = { ...db.workers[idx], ...req.body, id: workerId };
    writeDb(db);
    res.json(db.workers[idx]);
  } else {
    res.status(404).json({ message: 'Worker not found' });
  }
});

app.delete('/workers/:id', (req, res) => {
  const db = readDb();
  const workerId = parseInt(req.params.id, 10);
  const found = (db.workers || []).some((w) => w.id === workerId);
  if (!found) return res.status(404).json({ message: 'Worker not found' });
  db.workers = (db.workers || []).filter((w) => w.id !== workerId);
  writeDb(db);
  res.json({ message: 'Worker deleted' });
});

// ===== Jobs =====
app.get('/jobs', (req, res) => {
  const db = readDb();
  res.json(db.jobs || []);
});

app.post('/jobs', (req, res) => {
  const db = readDb();
  db.jobs = db.jobs || [];
  const incoming = req.body;
  const existing = db.jobs.find((j) => isSameJob(j, incoming));
  if (existing) {
    // если похожая запись есть — возвращаем её (так мы избегаем дублирования тестовых записей)
    return res.json(existing);
  }
  const newJob = { id: getNextId(db.jobs), ...incoming };
  db.jobs.push(newJob);
  writeDb(db);
  res.json(newJob);
});

app.put('/jobs/:id', (req, res) => {
  const db = readDb();
  const jobId = parseInt(req.params.id, 10);
  const idx = (db.jobs || []).findIndex((j) => j.id === jobId);
  if (idx !== -1) {
    db.jobs[idx] = { ...db.jobs[idx], ...req.body, id: jobId };
    writeDb(db);
    res.json(db.jobs[idx]);
  } else {
    res.status(404).json({ message: 'Job not found' });
  }
});

app.delete('/jobs/:id', (req, res) => {
  const db = readDb();
  const jobId = parseInt(req.params.id, 10);
  const found = (db.jobs || []).some((j) => j.id === jobId);
  if (!found) return res.status(404).json({ message: 'Job not found' });
  db.jobs = (db.jobs || []).filter((j) => j.id !== jobId);
  writeDb(db);
  res.json({ message: 'Job deleted' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
