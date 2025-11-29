// db.js
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'db.json');

function readDb() {
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('readDb error', err);
    return { workers: [], jobs: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('writeDb error', err);
  }
}

function getNextId(items) {
  const ids = (items || [])
    .map((i) => i.id)
    .filter((id) => Number.isInteger(id));
  return ids.length ? Math.max(...ids) + 1 : 1;
}

// опциональная функция — разовая санитация базы,
// присваивает id тем элементам, у которых id не integer.
// Внимание: выполняй её только если понимаешь последствия.
function sanitizeDb(db) {
  const copy = { ...db };
  copy.jobs = (copy.jobs || []).map((it, idx) => {
    if (!Number.isInteger(it.id)) it.id = idx + 1;
    return it;
  });
  copy.workers = (copy.workers || []).map((it, idx) => {
    if (!Number.isInteger(it.id)) it.id = idx + 1 + (copy.jobs.length || 0);
    return it;
  });
  return copy;
}

module.exports = { readDb, writeDb, getNextId, sanitizeDb };
