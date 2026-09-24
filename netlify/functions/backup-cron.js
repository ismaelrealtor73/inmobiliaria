import { getStore } from '@netlify/blobs';

export const config = { schedule: '@daily' };

const GH_API = 'https://api.github.com/repos/';

export default async () => {
  const store = getStore('crm');
  const raw = await store.get('data', { type: 'text' });
  if (!raw) return new Response('sin datos', { status: 200 });

  const token = process.env.GITHUB_PAT;
  const repo = process.env.BACKUP_REPO;
  if (!token || !repo) {
    console.log('backup-cron: GITHUB_PAT o BACKUP_REPO no configurados, copia omitida');
    return new Response('omitido: credenciales no configuradas', { status: 200 });
  }

  const parts = repo.trim().split('/');
  if (parts.length !== 2) return new Response('BACKUP_REPO inválido', { status: 500 });
  const [owner, name] = parts;

  const date = new Date().toISOString().slice(0, 10);
  const filePath = 'crm-backups/' + date + '.json';
  const url = GH_API + owner + '/' + name + '/contents/' + filePath;
  const headers = {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json'
  };

  let sha = null;
  try {
    const existing = await fetch(url, { headers });
    if (existing.ok) {
      const meta = await existing.json();
      sha = meta.sha;
    }
  } catch (e) {
    console.log('backup-cron: no se pudo consultar el archivo existente', e.message);
  }

  const body = {
    message: 'backup crm ' + date,
    content: Buffer.from(raw, 'utf8').toString('base64')
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('backup-cron: GitHub push fallo', res.status, detail);
    return new Response('fallo GitHub: ' + res.status, { status: 500 });
  }

  console.log('backup-cron: copia subida OK -> crm-backups/' + date + '.json');
  return new Response('backup ok', { status: 200 });
};