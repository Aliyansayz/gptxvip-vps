/** Agent C independent storage-failure and original reference workflow regressions. */
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:3001';
const output=process.env.QA_OUTPUT||'/tmp/gptx-prototype-qa';
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
const results=[];
const run=async(name,body)=>{try{await body();results.push({name,pass:true});}catch(error){results.push({name,pass:false,error:error.stack});}console.log(name,results.at(-1).pass);};
const context=await browser.newContext({viewport:{width:1440,height:900},timezoneId:'Asia/Karachi'});
const page=await context.newPage();page.setDefaultTimeout(8000);
try {
 await run('Project Management implemented views, project identity and keyboard kanban',async()=>{
  await page.goto(`${base}/agents/prototypes/project-management`,{waitUntil:'networkidle'});
  const ws=page.locator('.project-management-prototype');
  await ws.getByRole('button',{name:'Project',exact:true}).click();
  const title=await ws.locator('h3').first().textContent();await ws.locator('h3').first().click();assert(await ws.getByRole('heading',{name:title,exact:true}).count());
  await ws.getByRole('button',{name:'Kanban',exact:true}).click();
  const move=ws.getByRole('combobox').first();const label=await move.getAttribute('aria-label');const before=await move.inputValue();
  const target=await move.locator('option').evaluateAll((rows,old)=>rows.find(row=>row.value!==old).value,before);await move.selectOption(target);
  assert.equal(await ws.getByLabel(label,{exact:true}).inputValue(),target);
  for(const name of ['Analytics','Dashboard']){await ws.getByRole('button',{name,exact:true}).click();assert(await ws.locator('h2').count());}
 });
 await run('Logistics real create/validation/assignment/exception/approval/reload',async()=>{
  await page.goto(`${base}/agents/prototypes/logistics`,{waitUntil:'networkidle'});const ws=page.locator('.logistics-prototype');
  await ws.getByRole('button',{name:'New delivery',exact:true}).click();const d=page.getByRole('dialog');
  for(const [label,value] of Object.entries({'Customer':'QA local customer','Pickup address':'1 QA Road','Drop-off address':'2 QA Road','Region':'North','Window starts':'2026-10-05T13:00','Window ends':'2026-10-05T12:00'}))await d.getByLabel(label,{exact:true}).fill(value);
  await d.getByRole('button',{name:'Create delivery'}).click();assert(await d.getByRole('alert').count());
  await d.getByLabel('Window ends').fill('2026-10-05T14:00');await d.getByRole('button',{name:'Create delivery'}).click();await d.waitFor({state:'hidden'});
  await ws.getByRole('button',{name:'Dispatch board',exact:true}).click();await ws.getByLabel('Search deliveries').fill('QA local customer');
  assert.equal(await ws.locator('tbody tr').count(),1);
  const assign=ws.getByRole('combobox');await assign.selectOption('drv-002');
  await ws.getByRole('button',{name:'Start delivery'}).click();
  await page.reload({waitUntil:'networkidle'});await ws.getByRole('button',{name:'Dispatch board',exact:true}).click();await ws.getByLabel('Search deliveries').fill('QA local customer');assert(await ws.getByText('en route',{exact:true}).count());
  await ws.getByRole('button',{name:'Exceptions',exact:true}).click();await ws.getByRole('button',{name:'Resolve exception'}).first().click();assert(await ws.getByText('resolved',{exact:true}).count());
  await ws.getByRole('button',{name:'Approvals & settings',exact:true}).click();await ws.getByRole('button',{name:'Approve',exact:true}).first().click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('dispatchos-prototype:state:v1')));assert(saved.bootstrap.jobs.some(row=>row.customer==='QA local customer'&&row.status==='en_route'));assert(saved.bootstrap.exceptions.some(row=>row.status==='resolved'));
 });
 await run('Fundview actual local report preview enable, expiry and disable',async()=>{
  const route=`${base}/agents/prototypes/fundview`;
  await page.goto(route,{waitUntil:'networkidle'});const ws=page.locator('[data-prototype="fundview"]');
  await ws.locator('aside nav').getByRole('button',{name:/Quarterly Report \/ Sharing$/}).click();
  await ws.getByRole('button',{name:'Enable preview for 1 hour',exact:true}).click();
  const url=await ws.getByRole('link',{name:'Open local report preview'}).getAttribute('href');
  await page.goto(url,{waitUntil:'networkidle'});assert(await page.getByRole('heading',{name:'Performance bridge',exact:true}).count());
  await page.goto(route,{waitUntil:'networkidle'});await ws.getByRole('button',{name:'Simulate expiry',exact:true}).click();
  await page.goto(url,{waitUntil:'networkidle'});assert(await page.getByRole('heading',{name:'Report preview unavailable',exact:true}).count());
  await page.goto(route,{waitUntil:'networkidle'});await ws.getByRole('button',{name:'Enable preview for 1 hour',exact:true}).click();await ws.getByRole('button',{name:'Disable preview',exact:true}).click();
  await page.goto(url,{waitUntil:'networkidle'});assert(await page.getByRole('heading',{name:'Report preview unavailable',exact:true}).count());
 });
 await context.close();
 for(const slug of ['pulse-analytics','storefront-pro','ledgerline','orbit-crm','saas-metrics-kit','adsphere','clinicare','chainpulse','hq-admin','insight-boards','fundview']){
  await run(`${slug} unavailable storage fallback`,async()=>{
   const isolated=await browser.newContext();await isolated.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new Error('QA blocked storage')};Storage.prototype.setItem=()=>{throw new Error('QA blocked storage')};});
   const p=await isolated.newPage();p.setDefaultTimeout(8000);try{await p.goto(`${base}/agents/prototypes/${slug}`,{waitUntil:'networkidle'});const ws=p.locator(`[data-prototype="${slug}"]`);await ws.getByText('Browser storage is unavailable.',{exact:false}).waitFor();assert(await ws.getByText('Changes kept in this tab',{exact:false}).count());}finally{await isolated.close();}
  });
 }
}finally{await browser.close();await fs.mkdir(output,{recursive:true});await fs.writeFile(`${output}/foundation-results.json`,JSON.stringify({base,results},null,2));}
if(results.some(row=>!row.pass))process.exitCode=1;
