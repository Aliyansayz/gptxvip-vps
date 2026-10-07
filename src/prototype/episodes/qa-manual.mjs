/** Agent C manual navbar regression after prototype stylesheet integration. */
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:3001',output=process.env.QA_OUTPUT||'/tmp/gptx-prototype-qa';
const routes=['','sunshine_distribution_manual','ai_data_analyst_agent','competitive_intelligence_agent','market_intelligence_agent','vulnerability_remediation_agent','insurance_claims_agent','coldchain_erp','customer_support_agent'];
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']}),page=await browser.newPage();page.setDefaultTimeout(8000);const results=[];let errors=[];
page.on('pageerror',e=>errors.push(e.message));
try { for(const route of routes){const row={route,pass:true,widths:[],errors:[]};results.push(row);errors=[];try{
 await page.goto(`${base}/software_manual/${route}`,{waitUntil:'networkidle'});await page.locator('.manual-navigation').waitFor();
 for(const width of [1440,1024,390,320]){await page.setViewportSize({width,height:900});const header=page.locator('header').first();assert(await header.isVisible());
 const metrics=await header.evaluate(el=>({bounds:el.getBoundingClientRect().width,doc:document.documentElement.scrollWidth,width:innerWidth,links:[...el.querySelectorAll('a')].filter(a=>a.getClientRects().length).map(a=>({text:a.textContent,size:parseFloat(getComputedStyle(a).fontSize),color:getComputedStyle(a).color}))}));assert(metrics.bounds<=width+1);assert(metrics.links.length>=2);row.widths.push({width,links:metrics.links});
 await page.screenshot({path:`${output}/manual-${route||'catalog'}-${width}.png`});}
 await page.setViewportSize({width:1440,height:900});
 const sections=page.locator('header nav a');const selected=sections.nth(1);const href=await selected.getAttribute('href');await selected.click();
 await page.waitForFunction(expected=>document.querySelector(`header nav a[href="${expected}"]`)?.getAttribute('aria-current')==='location',href);
 row.activeSection=href;
 if(route){await page.locator('header .header-catalog-link').click();await page.waitForURL(/\/software_manual\/?$/);row.catalogReturn=true;}
 assert(!errors.length,errors.join('\n'));
 }catch(e){row.pass=false;row.errors.push(e.stack);}console.log(route||'catalog',row.pass);}
}finally{await browser.close();await fs.mkdir(output,{recursive:true});await fs.writeFile(`${output}/manual-results.json`,JSON.stringify({base,results},null,2));}
if(results.some(row=>!row.pass))process.exitCode=1;
