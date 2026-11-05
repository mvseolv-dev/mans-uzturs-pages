/* Run: node --test tests/coachboard-v5.test.cjs
   No browser, AI API, tokens, or network access required. */
'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const scripts=['team-data.js','team-shooting.js','team-visuals-v4.js','team-visuals-v5.js'];
const source=scripts.map(name=>fs.readFileSync(path.join(root,name),'utf8')).join('\n');
const init='var window={};function tmVisualSteps(){}function tmCoachPreview(){}function tmCoachStepThumb(){}function tmCoachMain(){}\n';
const runtime=new Function(init+source+'\nreturn {catalog:TEAM_DRILLS,api:window.TeamCoachAuditV5,points:window.TMBoardInternals.PT};')();
const {catalog,api,points}=runtime;
test('Complete drill catalog is available, without duplicate IDs',()=>{
 assert.equal(catalog.length,170);
 assert.equal(new Set(catalog.map(x=>x.id)).size,catalog.length);
 assert.ok(catalog.every(x=>x.id&&x.setup&&x.action&&x.coach));
});
test('Every diagram has enough players, a start view and ordered instructions',()=>{
 const audit=api.drills();
 assert.equal(audit.length,catalog.length);
 for(const d of audit){
  assert.ok(d.people>=d.minPlayers,d.id+' missing players: '+d.people+'/'+d.minPlayers);
  assert.ok(d.steps>=3,d.id+' has too few steps');
  assert.ok(d.svgOk,d.id+' cannot render SVG');
  const steps=api.steps(d.id);
  assert.equal(steps[0].label,'SĀKUMS',d.id+' missing placement');
  assert.equal(steps.at(-1).label,'TRENERA UZSVARS',d.id+' missing coach emphasis');
  for(const [idx,step] of steps.entries()){
   assert.ok(step.title&&step.text,d.id+' step '+idx+' has no explanation');
   const svg=api.render(d.id,idx);
   assert.ok(svg?.startsWith('<svg')&&svg?.endsWith('</svg>'),d.id+' step '+idx+' cannot render');
   assert.ok(!/\bNaN\b|\bundefined\b/.test(svg),d.id+' step '+idx+' has invalid geometry');
  }
 }
});
test('Four-cone 5-4-3-2-1 drill uses the user-corrected setup',()=>{
 assert.equal(api.drills().find(d=>d.id==='s54321').cones,4);
 assert.ok(points.ft[1]<points.arc[1]);
 assert.ok(points.arc[1]>=305&&points.arc[1]<=333,'point 1 must be near the top of the 3pt arc');
 const steps=api.steps('s54321').map(x=>x.title+' '+x.text).join('\n');
 assert.match(steps,/soda metienu līnijas kreisās malas/);
 assert.match(steps,/0 konusam/);
 assert.match(steps,/gar gala līniju/);
 const crossing=api.render('s54321',4);
 assert.match(crossing,/M70 143 C177 119 383 119 490 143/);
 assert.ok(!/M70 143 L70 51 L490 51/.test(crossing),'must not route out of bounds');
});
test('Live play is not incorrectly marked as a guaranteed movement',()=>{
 const cases=['g07','g08','d10','q050'];
 for(const id of cases){
  const d=api.drills().find(x=>x.id===id);
  assert.ok(d,'missing '+id);
  assert.notEqual(d.status,'KONKRĒTA SECĪBA',id+' incorrectly approved');
 }
});
test('Drills that require defenders and multiple pairs show correct personnel',()=>{
 const ids=['s08','s12','p03','p07','p09','r04','r05','a06','a07','q008','q029','q036','q045','q046','q048','q050','q053','q057'];
 const result=api.drills();
 for(const id of ids){
  const d=result.find(x=>x.id===id);
  assert.ok(d,'missing '+id);
  assert.ok(d.people>=d.minPlayers,id+': incorrect athlete count');
 }
});
