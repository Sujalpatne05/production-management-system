// Simple API login check against backend
// Assumes backend at http://localhost:3000 with /api prefix
// Update credentials if different in seed data

const BASE_URL = 'http://localhost:3000/api';

async function run() {
  console.log('API Login Test — starting');
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@demo.com', password: 'admin123' }),
    });
    console.log('Status:', res.status);
    const data = await res.json();
    const token = data?.access_token || data?.accessToken;
    if (res.ok && token) {
      console.log('PASS: Received JWT token');
      console.log('Token (truncated):', String(token).slice(0, 24) + '...');
      process.exit(0);
    } else {
      console.log('WARN: Login failed or no token');
      console.log('Response:', data);
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('ERROR:', err?.message || String(err));
    process.exitCode = 1;
  }
}

run();
