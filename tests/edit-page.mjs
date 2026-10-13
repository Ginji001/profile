const pw = await import(process.env.PLAYWRIGHT_MODULE_PATH ? process.env.PLAYWRIGHT_MODULE_PATH + '/index.mjs' : 'playwright');
import fs from 'node:fs';
const yamlText = fs.readFileSync(new URL('../content.yaml', import.meta.url),'utf8');
const b = await pw.chromium.launch();
async function run(width, mode){
  const p = await (await b.newContext({viewport:{width,height:844}})).newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  let put=null, puts=0;
  await p.route('https://api.github.com/**', async r => {
    const req=r.request(), u=req.url();
    if (u.includes('/contents/content.yaml') && req.method()==='GET') return r.fulfill({json:{sha:'abc',content:Buffer.from(yamlText).toString('base64'),encoding:'base64'}});
    if (u.includes('/contents/content.yaml') && req.method()==='PUT') { puts++; put=JSON.parse(req.postData()); return r.fulfill({json:{content:{sha:'def'},commit:{sha:'c1'}}}); }
    if (u.includes('/actions/runs')) return r.fulfill({json:{workflow_runs:[]}});
    return r.fulfill({status:404,json:{}});
  });
  await p.goto('http://localhost:4180/profile/edit');
  await p.getByPlaceholder('GitHubの鍵を貼り付け').fill('test_token_dummy');
  await p.getByRole('button',{name:'この端末に鍵を保存'}).click();
  const about = p.locator('label.edit-field').filter({hasText:'自己紹介'}).first().locator('textarea, input');
  await about.waitFor({timeout:8000});
  const out={mode};
  if(mode==='nochange'){
    await p.getByRole('button',{name:'保存して公開'}).click(); await p.waitForTimeout(800);
    out.text=(await p.locator('body').innerText()).match(/変更がない[^\n]*/)?.[0];
  } else if(mode==='bad'){
    await p.locator('input[value="https://github.com/Ginji001"]').first().fill('github.com/Ginji001');
    await p.getByRole('button',{name:'保存して公開'}).click(); await p.waitForTimeout(800);
    out.alerts = await p.getByRole('alert').allTextContents();
  } else {
    await about.fill('テストで書き換えた自己紹介');
    await p.getByRole('button',{name:'保存して公開'}).click(); await p.waitForTimeout(1500);
    const y=Buffer.from(put.content,'base64').toString('utf8');
    out.diffLines = y.split('\n').filter((l,i)=>l!==yamlText.split('\n')[i]).length;
    out.text=(await p.locator('body').innerText()).match(/公開まで[^\n]*/)?.[0];
  }
  out.puts=puts; out.errs=errs; console.log(JSON.stringify(out));
}
await run(390,"nochange"); await run(390,"ok"); await run(390,"bad");
await b.close();
// 使い方: npm run build && npx vite preview --port 4180 --strictPort を起動してから
// PLAYWRIGHT_MODULE_PATH=... node tests/edit-page.mjs
// 期待: nochange は puts 0、ok は diffLines 1 / puts 1、bad は puts 0
