const http = require('http');

function check(path){
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => resolve(res.statusCode));
    req.on('error', () => resolve(0));
  });
}

(async () => {
  const wait = (ms)=>new Promise(r=>setTimeout(r,ms));
  // daj serwerowi chwilę na start w dev
  for (let i=0;i<10;i++){ const s = await check('/api/health'); if (s===200) break; await wait(1000); }
  const home = await check('/');
  const health = await check('/api/health');
  const ok = (home===200 || home===301 || home===302) && health===200;
  console.log(JSON.stringify({ home, health, ok }, null, 2));
  process.exit(ok ? 0 : 1);
})();
