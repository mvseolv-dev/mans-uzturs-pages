/* MANS UZTURS ACTIVE: Basketball Team Studio. Local-first, no server, no AI API required. */
let tmTab="generate",tmFocusDrill=null,tmCategory="all",tmSearch="",tmFavoritesOnly=false;
function tmState(){
 state.teamStudio??={players:4,balls:2,hoops:1,minutes:75,intensity:"medium",mode:"regular",focus:["shoot","handle"],date:dateISO(rigaToday()),seed:0,favorites:[],draft:null,plans:[]};
 const s=state.teamStudio;
 if(!Array.isArray(s.focus))s.focus=["shoot","handle"];
 if(!Array.isArray(s.favorites))s.favorites=[];
 if(!Array.isArray(s.plans))s.plans=[];
 s.players=Math.max(1,Math.min(16,Number(s.players)||4));
 s.balls=Math.max(0,Math.min(8,Number.isFinite(Number(s.balls))?Number(s.balls):2));
 s.hoops=Math.max(0,Math.min(2,Number.isFinite(Number(s.hoops))?Number(s.hoops):1));
 s.minutes=Math.max(25,Math.min(150,Number(s.minutes)||75));
 return s;
}
function tmCat(cat){return TEAM_CATEGORIES.find(([id])=>id===cat)?.[1]||"Cits"}
function tmModeAllowed(d,mode,intensity){
 const scale={low:1,medium:2,high:3};
 const ceiling=mode==="pregame"?2:mode==="recovery"?1:scale[intensity]||2;
 if(scale[d.intensity]>ceiling)return false;
 if(mode==="pregame"&&(d.category==="fitness"||d.intensity==="high"||["small"].includes(d.category)))return false;
 if(mode==="recovery"&&(d.phase==="main"&&["small","screen","transition","fitness"].includes(d.category)))return false;
 return true;
}
function tmEligible(d,s=tmState()){
 return d.minPlayers<=s.players&&d.maxPlayers>=s.players&&d.minBalls<=s.balls&&
 (d.minHoops||(["shoot","finish","rebound","small"].includes(d.category)?1:0))<=s.hoops&&
 tmModeAllowed(d,s.mode,s.intensity);
}
function tmDraft(){return tmState().draft}
function tmPlanTotal(items){return (items||[]).reduce((n,x)=>n+(Number(x.minutes)||0),0)}
function tmSeedValue(str,seed){let h=2166136261;for(const c of str+"_"+seed){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0)%10000}
function tmScored(list,selected,seed){
 return list.sort((a,b)=>{
  const sa=(selected.includes(a.category)?110:0)+(a.phase==="warm"?15:0)+tmSeedValue(a.id,seed)/100;
  const sb=(selected.includes(b.category)?110:0)+(b.phase==="warm"?15:0)+tmSeedValue(b.id,seed)/100;
  return sb-sa;
 });
}
function tmGenerate(){
 const s=tmState();s.seed=(s.seed||0)+1;
 const available=TEAM_DRILLS.filter(d=>tmEligible(d,s));
 const warm=tmScored(available.filter(d=>d.phase==="warm"),[],s.seed),cool=tmScored(available.filter(d=>d.phase==="cool"),[],s.seed),main=tmScored(available.filter(d=>d.phase==="main"),s.focus,s.seed);
 const chosen=[],ids=new Set(),maxTime=s.minutes;
 function take(d){if(!d||ids.has(d.id)||chosen.length>=20)return false;const left=maxTime-tmPlanTotal(chosen);if(left<4)return false;const minutes=Math.min(d.minutes,left);if(minutes<4)return false;chosen.push({id:d.id,minutes});ids.add(d.id);return true}
 const warmTarget=s.minutes>=65?2:1;
 for(let i=0;i<warmTarget&&i<warm.length;i++)take(warm[i]);
 const coolDrill=cool[0]||available.find(d=>d.intensity==="low"&&d.phase==="warm");
 const reserve=s.minutes>=45&&coolDrill?Math.min(coolDrill.minutes,8):0;
 for(const d of main){
  if(maxTime-tmPlanTotal(chosen)<=reserve+3)break;
  if(chosen.length>=18)break;
  const left=maxTime-tmPlanTotal(chosen)-reserve;
  if(left<4)break;
  const mins=Math.max(4,Math.min(d.minutes,left));
  if(ids.has(d.id))continue;
  chosen.push({id:d.id,minutes:mins});ids.add(d.id);
 }
 if(reserve>0&&!ids.has(coolDrill.id))take(coolDrill);
 if(!chosen.length){toast("Šādiem nosacījumiem treniņu nevar salikt. Palielini spēlētāju skaitu vai inventāru.");return}
 s.draft={date:s.date,items:chosen,created:Date.now(),criteria:{players:s.players,balls:s.balls,hoops:s.hoops,mode:s.mode,intensity:s.intensity,focus:[...s.focus]},editId:null};
 save();tmTab="generate";tmFocusDrill=null;render();toast("Sagatavots treniņš: "+chosen.length+" vingrinājumi.");
}
function tmPlanText(items=tmDraft()?.items||[]){
 const s=tmState(),header="BUKI / KOMANDAS TRENIŅŠ\n"+(tmDraft()?.date||s.date)+" | "+(tmDraft()?.criteria?.players||s.players)+" spēlētāji | "+tmPlanTotal(items)+" min\n";
 return header+items.map((e,i)=>{const d=TEAM_BY_ID[e.id];return (i+1)+". "+(d?.title||e.id)+" ("+e.minutes+" min)\n   "+(d?.action||"")+"\n   Uzsvars: "+(d?.coach||"")}).join("\n");
}
function tmDraftAdd(id){
 const s=tmState(),d=TEAM_BY_ID[id];if(!d)return;
 if(!tmEligible(d,s)){toast("Šis vingrinājums neatbilst cilvēku skaitam, slodzei vai inventāram.");return}
 if(!s.draft)s.draft={date:s.date,items:[],criteria:{players:s.players,balls:s.balls,hoops:s.hoops,mode:s.mode,intensity:s.intensity,focus:[...s.focus]},editId:null};
 if(s.draft.items.some(x=>x.id===id)){toast("Vingrinājums jau ir plānā.");return}
 if(s.draft.items.length>=24){toast("Vienā plānā var būt ne vairāk kā 24 vingrinājumi.");return}
 s.draft.items.push({id,minutes:d.minutes});save();render();toast("Pievienots treniņa plānam.");
}
function tmSave(){
 const s=tmState(),p=s.draft;
 if(!p?.items?.length){toast("Vispirms pievieno vingrinājumus.");return}
 if(!/^\d{4}-\d{2}-\d{2}$/.test(p.date||""))p.date=s.date;
 const data={id:p.editId||"team-"+Date.now()+"-"+(s.seed||1),date:p.date,created:Date.now(),items:p.items.map(e=>({id:e.id,minutes:Number(e.minutes)||6})),criteria:{...p.criteria},completed:false};
 const index=s.plans.findIndex(x=>x.id===data.id);
 if(index>=0){data.created=s.plans[index].created;data.completed=s.plans[index].completed;s.plans[index]=data}else s.plans.unshift(data);
 s.plans=s.plans.slice(0,80);p.editId=data.id;save();render();toast("Treniņš saglabāts šajā ierīcē.");
}
function tmMatchingDrills(){
 const s=tmState(),search=tmSearch.trim().toLocaleLowerCase("lv-LV");
 return TEAM_DRILLS.filter(d=>tmEligible(d,s)&&
 (tmCategory==="all"||d.category===tmCategory)&&(!tmFavoritesOnly||s.favorites.includes(d.id))&&
 (!search||(d.title+" "+d.action+" "+d.setup+" "+tmCat(d.category)).toLocaleLowerCase("lv-LV").includes(search)));
}
function tmControlSelect(key,choices){
 const s=tmState();
 return '<select data-tm-select="'+key+'" aria-label="'+key+'">'+choices.map(([value,label])=>'<option value="'+value+'"'+(String(s[key])===String(value)?' selected':'')+'>'+label+'</option>').join('')+'</select>';
}
function tmHeader(){
 const s=tmState();
 return '<section class="tm-hero"><div class="tm-hero-copy"><span>BUKI / TEAM TRAINING STUDIO</span><h1>LABĀKS<br><em>TRENIŅŠ.</em></h1><p>Pielāgo vingrinājumus cilvēku skaitam, slodzei un spēles dienai.</p><div class="tm-hero-tags"><b>'+s.players+' SPĒLĒTĀJI</b><b>'+s.minutes+' MIN</b><b>'+TEAM_DRILLS.length+' VINGRINĀJUMI</b></div></div><div class="tm-hero-court">'+tmCourt("threevthree",true)+'</div></section>';
}
function tmTabs(){
 return '<div class="tm-tabs" role="group" aria-label="Komandas treniņu sadaļas">'+[["generate","Ģenerators"],["library","Bibliotēka"],["saved","Saglabātie"]].map(([val,label])=>'<button type="button" data-tm="tab" data-value="'+val+'" class="'+(tmTab===val?'current':'')+'" aria-pressed="'+(tmTab===val)+'">'+label+(val==="saved"?'<small>'+tmState().plans.length+'</small>':'')+'</button>').join('')+'</div>';
}
function tmCriteria(){
 const s=tmState(),focus=s.focus;
 return '<div class="tm-config"><div class="tm-section-title"><span>01 / TRENIŅA NOSACĪJUMI</span><h2>Cik jūs esat?</h2></div>'+
 '<div class="tm-player-count"><div class="tm-player-figure"><strong id="tm-player-read">'+s.players+'</strong><span>SPĒLĒTĀJI</span></div><div class="tm-player-input"><label for="tm-player-range">Pavelc vai ievadi cilvēku skaitu</label><input id="tm-player-range" type="range" min="1" max="16" step="1" value="'+s.players+'" data-tm-range="players"><div class="tm-player-scale"><span>1</span><span>4</span><span>8</span><span>12</span><span>16</span></div></div><input id="tm-player-number" data-tm-input="players" type="number" min="1" max="16" value="'+s.players+'" inputmode="numeric" aria-label="Cilvēku skaits"></div>'+
 '<div class="tm-config-grid"><label>Treniņa veids'+tmControlSelect("mode",Object.entries(TEAM_MODES))+'</label><label>Intensitāte'+tmControlSelect("intensity",Object.entries(TEAM_LEVELS))+'</label>'+
 '<label>Ilgums, min<input data-tm-input="minutes" type="number" min="25" max="150" step="5" value="'+s.minutes+'" inputmode="numeric"></label>'+
 '<label>Datums<input data-tm-input="date" type="date" value="'+s.date+'"></label>'+
 '<label>Pieejamās bumbas<input data-tm-input="balls" type="number" min="0" max="8" value="'+s.balls+'" inputmode="numeric"></label>'+
 '<label>Pieejamie grozi'+tmControlSelect("hoops",[[0,"Bez groza"],[1,"1 grozs"],[2,"2 grozi"]])+'</label></div>'+
 '<div class="tm-section-title"><span>02 / SATURS</span><h2>Ko šodien trenēsim?</h2></div>'+
 '<div class="tm-focus">'+TEAM_CATEGORIES.filter(([id])=>!["warm","fitness"].includes(id)).map(([id,label])=>'<button type="button" data-tm="focus" data-id="'+id+'" class="'+(focus.includes(id)?'active':'')+'" aria-pressed="'+focus.includes(id)+'">'+(focus.includes(id)?'✓ ':'')+label+'</button>').join('')+'</div>'+
 '<div class="tm-availability"><span><strong id="tm-eligible-count">'+TEAM_DRILLS.filter(d=>tmEligible(d,s)).length+'</strong> piemēroti vingrinājumi</span><span>'+((s.mode==="pregame"||s.mode==="recovery")?'Augstas intensitātes vingrinājumi šajā režīmā netiek piedāvāti.':'Shēmās O ir uzbrukums, X ir aizsardzība.')+'</span></div>'+
 '<button class="tm-generate" data-tm="generate">✦ IZVEIDOT '+s.minutes+' MIN TRENIŅU <span>↗</span></button></div>';
}
function tmCard(d,opts={}){
 const s=tmState(),inPlan=(s.draft?.items||[]).some(x=>x.id===d.id),favorite=s.favorites.includes(d.id);
 return '<article class="tm-drill-card"><button type="button" class="tm-drill-open" data-tm="detail" data-id="'+d.id+'"><div class="tm-drill-preview">'+tmCourt(d.diagram,true)+'</div><div class="tm-drill-text"><span>'+tmCat(d.category)+' · '+TEAM_LEVELS[d.intensity]+'</span><h3>'+safe(d.title)+'</h3><p>'+d.minPlayers+'+ spēlētāji · '+d.minutes+' min · '+(d.minBalls?'ar bumbu':'bez bumbas')+'</p></div></button>'+
 '<div class="tm-drill-footer"><button type="button" data-tm="favorite" data-id="'+d.id+'" aria-label="'+(favorite?'Izņemt no favorītiem':'Pievienot favorītiem')+'" class="tm-fave '+(favorite?'on':'')+'">'+(favorite?'♥':'♡')+'</button>'+
 '<button type="button" data-tm="add" data-id="'+d.id+'" class="tm-add '+(inPlan?'added':'')+'">'+(inPlan?'✓ Plānā':'+ Pievienot')+'</button></div></article>';
}
function tmPlanCard(item,i,total){
 const d=TEAM_BY_ID[item.id];if(!d)return '';
 return '<article class="tm-plan-item"><div class="tm-plan-index">'+String(i+1).padStart(2,"0")+'</div><button class="tm-plan-main" data-tm="detail" data-id="'+d.id+'"><div class="tm-plan-diagram">'+tmCourt(d.diagram,true)+'</div><div class="tm-plan-copy"><span>'+tmCat(d.category)+' · '+TEAM_LEVELS[d.intensity]+'</span><strong>'+safe(d.title)+'</strong><small>'+safe(d.action)+'</small></div></button>'+
 '<div class="tm-plan-edit"><label>MIN<input type="number" data-tm-duration="'+i+'" min="3" max="30" value="'+item.minutes+'" inputmode="numeric"></label><div><button type="button" data-tm="up" data-index="'+i+'" '+(i===0?'disabled':'')+' aria-label="Pārvietot uz augšu">↑</button><button type="button" data-tm="down" data-index="'+i+'" '+(i===total-1?'disabled':'')+' aria-label="Pārvietot uz leju">↓</button><button type="button" data-tm="remove" data-index="'+i+'" aria-label="Izņemt vingrinājumu">×</button></div></div></article>';
}
function tmDraftPanel(){
 const s=tmState(),draft=s.draft;if(!draft?.items?.length)return '<div class="tm-empty"><span>◉</span><h3>Treniņš vēl nav izveidots</h3><p>Izvēlies cilvēku skaitu un nospied "Izveidot treniņu" vai pievieno vingrinājumus pats bibliotēkā.</p></div>';
 const items=draft.items.filter(e=>TEAM_BY_ID[e.id]),minutes=tmPlanTotal(items);
 const warm=items.filter(e=>TEAM_BY_ID[e.id].phase==="warm").length,main=items.filter(e=>TEAM_BY_ID[e.id].phase==="main").length,cool=items.filter(e=>TEAM_BY_ID[e.id].phase==="cool").length;
 return '<div class="tm-draft"><div class="tm-draft-head"><div><span>03 / TAVS TRENIŅŠ · '+draft.date+'</span><h2>'+items.length+' vingrinājumi · '+minutes+' min</h2><p>Iesildīšanās: '+warm+' · Galvenā daļa: '+main+' · Nobeigums: '+cool+'</p></div><b class="tm-duration-badge">'+minutes+' MIN</b></div>'+
 (minutes<tmState().minutes*.7?'<div class="tm-shortfall">Šiem nosacījumiem iespējams piedāvāt tikai '+minutes+' min no '+tmState().minutes+' min. Lai iegūtu pilnāku treniņu, pievieno bumbu vai grozu, izvēlies citu intensitāti vai atkārto tehnikas daļas.</div>':'')+
 '<div class="tm-plan-list">'+items.map((item,i)=>tmPlanCard(item,i,items.length)).join('')+'</div>'+
 '<div class="tm-plan-actions"><button class="tm-save" data-tm="save">✓ Saglabāt plānu</button><button class="tm-outline" data-tm="copy">Kopēt tekstu</button><button class="tm-outline" data-tm="print">Drukāt</button><button class="tm-danger" data-tm="clear">Notīrīt</button></div>'+
 '<p class="tm-footnote">Vari mainīt ilgumu, pārvietot vingrinājumus, tos izņemt vai pievienot citus no bibliotēkas. Saglabātais plāns glabājas tavā ierīcē.</p></div>';
}
function tmGenerator(){
 return tmCriteria()+tmDraftPanel();
}
function tmLibrary(){
 const s=tmState(),list=tmMatchingDrills();
 return '<div class="tm-library"><div class="tm-section-title"><span>VINGRINĀJUMU BIBLIOTĒKA</span><h2>'+TEAM_DRILLS.length+' varianti basketbolam</h2><p>Redzami tikai treniņa nosacījumiem piemēroti vingrinājumi. Maini cilvēku skaitu un intensitāti ģeneratorā.</p></div>'+
 '<div class="tm-search"><span>⌕</span><input id="tm-search" value="'+safe(tmSearch)+'" type="search" autocomplete="off" placeholder="Meklēt metienu, driblu, aizsardzību..." aria-label="Meklēt vingrinājumus"></div>'+
 '<div class="tm-cat-scroll">'+[["all","Visi"],...TEAM_CATEGORIES].map(([id,label])=>'<button data-tm="category" data-value="'+id+'" class="'+(tmCategory===id?'active':'')+'">'+label+'</button>').join('')+'</div>'+
 '<div class="tm-library-bar"><button data-tm="favonly" class="'+(tmFavoritesOnly?'active':'')+'">♥ Favorīti</button><span id="tm-results-count">'+list.length+' piemēroti</span></div>'+
 '<div id="tm-library-results">'+(list.length?'<div class="tm-drill-grid">'+list.map(d=>tmCard(d)).join('')+'</div>':'<div class="tm-empty"><h3>Neviens vingrinājums neatbilst filtriem</h3><p>Samazini intensitāti vai izvēlies citu kategoriju.</p></div>')+'</div></div>';
}
function tmSaved(){
 const s=tmState();
 return '<div class="tm-saved"><div class="tm-section-title"><span>TAVI PIERAKSTI</span><h2>Saglabātie treniņi</h2></div>'+
 (!s.plans.length?'<div class="tm-empty"><span>▤</span><h3>Saglabātu treniņu vēl nav</h3><p>Izveido vai saliec savu plānu un nospied "Saglabāt plānu".</p></div>':
 '<div class="tm-saved-list">'+s.plans.map(p=>'<article class="tm-saved-card"><div><span>'+safe(p.date||"")+' · '+(p.criteria?.players||"?")+' spēlētāji</span><h3>'+tmPlanTotal(p.items)+' min · '+p.items.length+' vingrinājumi</h3><p>'+safe(TEAM_MODES[p.criteria?.mode]||"Treniņš")+' · '+p.items.slice(0,3).map(x=>TEAM_BY_ID[x.id]?.title).filter(Boolean).map(safe).join(", ")+'</p></div><div class="tm-saved-actions"><button data-tm="load" data-id="'+p.id+'">Atvērt</button><button data-tm="complete" data-id="'+p.id+'" class="'+(p.completed?'done':'')+'">'+(p.completed?'✓ Paveikts':'Atzīmēt')+'</button><button data-tm="delete" data-id="'+p.id+'">Dzēst</button></div></article>').join('')+'</div>')+
 '<div class="tm-resource"><b>Par datiem</b><p>Treniņi tiek glabāti šī telefona pārlūkā. Lai saglabātu tos citā ierīcē, eksportē datus sadaļā "Progress".</p></div></div>';
}
function tmDetail(){
 const d=TEAM_BY_ID[tmFocusDrill],s=tmState();
 if(!d){tmFocusDrill=null;return tmLibrary()}
 return '<div class="tm-detail"><button data-tm="back" class="tm-back">‹ Atpakaļ uz treniņiem</button>'+
 '<div class="tm-detail-title"><span>'+tmCat(d.category)+' · '+TEAM_LEVELS[d.intensity]+'</span><h1>'+safe(d.title)+'</h1><p>'+d.minPlayers+'+ spēlētāji · '+d.minutes+' min · '+d.minBalls+' bumbas</p></div>'+
 '<div class="tm-large-diagram">'+tmCourt(d.diagram)+tmLegend()+'</div>'+
 '<div class="tm-detail-steps"><div><b>01</b><div><h3>Izvietojums</h3><p>'+safe(d.setup)+'</p></div></div>'+
 '<div><b>02</b><div><h3>Izpilde</h3><p>'+safe(d.action)+'</p></div></div>'+
 '<div><b>03</b><div><h3>Trenera uzsvars</h3><p>'+safe(d.coach)+'</p></div></div></div>'+
 '<div class="tm-detail-info"><span>NEPIECIEŠAMAIS</span><strong>'+Math.max(0,d.minBalls)+' bumbas · '+d.minPlayers+' vai vairāk cilvēki</strong><span>LOKĀLĀ PIELĀGOŠANA</span><p>'+((s.players>d.minPlayers&&d.minPlayers>=2)?'Sadaliet dalībniekus mazās grupās un mainiet lomas ik pēc dažiem atkārtojumiem.':'Mainiet puses un lomas pēc katras īsās sērijas.')+'</p></div>'+
 '<div class="tm-detail-buttons"><button data-tm="add" data-id="'+d.id+'">＋ Pievienot manam plānam</button><button data-tm="favorite" data-id="'+d.id+'">'+(s.favorites.includes(d.id)?'♥ Favorītos':'♡ Favorītiem')+'</button></div>'+
 '<p class="tm-footnote">Shēma ir konkrētā vingrinājuma izvietojuma un galvenās kustības ilustrācija, nevis pilna animācija. Vienlaikus rotējošus spēlētājus nolasiet pēc izpildes apraksta.</p></div>';
}
function renderTeamStudio(){
 if(activeProfile!=="maris")return renderDay();
 const s=tmState();
 return '<div class="ap-screen tm-app">'+(tmFocusDrill?tmDetail():tmHeader()+tmTabs()+
 (tmTab==="generate"?tmGenerator():tmTab==="library"?tmLibrary():tmSaved())+
 '<div class="tm-resource"><b>Metodika</b><p>Treniņu struktūra balstās uz Jr. NBA un FIBA treneru principiem par mazām grupām, atkārtojumu kvalitāti un spēles situācijām. Programmas salikšana notiek ierīcē pēc izvēlētajiem filtriem, nevis ar ārēju AI servisu.</p><a href="https://jr.nba.com/basketball-practice-plans/starter/" target="_blank" rel="noopener noreferrer">Jr. NBA prakses plāni ↗</a></div>')+'</div>';
}
function tmChange(key,value){
 const s=tmState();
 if(key==="players")s.players=Math.max(1,Math.min(16,Math.round(Number(value)||1)));
 if(key==="balls")s.balls=Math.max(0,Math.min(8,Math.round(Number(value)||0)));
 if(key==="hoops")s.hoops=Math.max(0,Math.min(2,Math.round(Number(value)||0)));
 if(key==="minutes")s.minutes=Math.max(25,Math.min(150,Math.round((Number(value)||75)/5)*5));
 if(key==="intensity"&&TEAM_LEVELS[value])s.intensity=value;
 if(key==="mode"&&TEAM_MODES[value])s.mode=value;
 if(key==="date"&&/^\d{4}-\d{2}-\d{2}$/.test(value))s.date=value;
 if(["pregame","recovery"].includes(s.mode)&&s.intensity==="high")s.intensity=s.mode==="pregame"?"medium":"low";
 save();render();
}
document.addEventListener('click',async event=>{
 const target=event.target.closest('[data-tm]');if(!target)return;
 const act=target.dataset.tm,s=tmState(),id=target.dataset.id,idx=Number(target.dataset.index);
 if(act==="tab"){tmTab=target.dataset.value;tmFocusDrill=null;render();return}
 if(act==="focus"){const i=s.focus.indexOf(id);if(i>=0)s.focus.splice(i,1);else s.focus.push(id);save();render();return}
 if(act==="category"){tmCategory=target.dataset.value;render();return}
 if(act==="favonly"){tmFavoritesOnly=!tmFavoritesOnly;render();return}
 if(act==="favorite"){const i=s.favorites.indexOf(id);if(i>=0)s.favorites.splice(i,1);else s.favorites.push(id);save();render();return}
 if(act==="detail"){tmFocusDrill=id;render();window.scrollTo?.({top:0,behavior:"smooth"});return}
 if(act==="back"){tmFocusDrill=null;render();return}
 if(act==="add"){tmDraftAdd(id);return}
 if(act==="generate"){tmGenerate();return}
 if(act==="remove"&&s.draft){s.draft.items.splice(idx,1);save();render();return}
 if((act==="up"||act==="down")&&s.draft){
  const dest=idx+(act==="up"?-1:1);
  if(idx>=0&&idx<s.draft.items.length&&dest>=0&&dest<s.draft.items.length){
   [s.draft.items[idx],s.draft.items[dest]]=[s.draft.items[dest],s.draft.items[idx]];save();render();}return;
 }
 if(act==="clear"){if(!confirm("Notīrīt pašreizējo treniņa plānu?"))return;s.draft=null;save();render();return}
 if(act==="save"){tmSave();return}
 if(act==="copy"){
  const txt=tmPlanText();
  try{await navigator.clipboard.writeText(txt);toast("Plāns iekopēts starpliktuvē.");}catch(_){toast("Neizdevās iekopēt. Izmanto saglabāšanu vai drukāšanu.");}
  return;
 }
 if(act==="print"){window.print?.();return}
 if(act==="load"){
  const p=s.plans.find(x=>x.id===id);if(!p)return;
  s.draft={date:p.date,items:p.items.map(x=>({...x})),criteria:{...p.criteria},editId:p.id};
  s.date=p.date;s.players=p.criteria?.players||s.players;s.mode=p.criteria?.mode||s.mode;s.intensity=p.criteria?.intensity||s.intensity;
  s.balls=p.criteria?.balls??s.balls;s.hoops=p.criteria?.hoops??s.hoops;s.focus=p.criteria?.focus||s.focus;
  s.minutes=Math.max(25,Math.min(150,tmPlanTotal(p.items)));save();tmTab="generate";render();return;
 }
 if(act==="complete"){const p=s.plans.find(x=>x.id===id);if(p){p.completed=!p.completed;save();render();}return}
 if(act==="delete"){if(!confirm("Dzēst saglabāto treniņu?"))return;s.plans=s.plans.filter(p=>p.id!==id);if(s.draft?.editId===id)s.draft.editId=null;save();render();return}
});
document.addEventListener('input',event=>{
 const e=event.target;
 if(e?.dataset?.tmRange==="players"){
  const counter=document.getElementById("tm-player-read"),number=document.getElementById("tm-player-number");
  if(counter)counter.textContent=e.value;if(number)number.value=e.value;return;
 }
 if(e?.id==="tm-search"){
  tmSearch=e.value;
  const results=document.getElementById("tm-library-results"),count=document.getElementById("tm-results-count");
  if(results){
   const list=tmMatchingDrills();
   results.innerHTML=list.length?'<div class="tm-drill-grid">'+list.map(d=>tmCard(d)).join('')+'</div>':'<div class="tm-empty"><h3>Nav piemērotu vingrinājumu</h3></div>';
   if(count)count.textContent=list.length+" piemēroti";
  }
 }
});
document.addEventListener('change',event=>{
 const e=event.target;
 if(e?.dataset?.tmSelect){tmChange(e.dataset.tmSelect,e.value);return}
 if(e?.dataset?.tmInput){tmChange(e.dataset.tmInput,e.value);return}
 if(e?.dataset?.tmRange){tmChange(e.dataset.tmRange,e.value);return}
 if(e?.dataset?.tmDuration!==undefined){
  const i=Number(e.dataset.tmDuration),s=tmState();
  if(s.draft?.items[i]){
   s.draft.items[i].minutes=Math.max(3,Math.min(30,Math.round(Number(e.value)||6)));
   save();render();
  }
 }
});

// Restore a direct #komanda link after all Team Studio modules have loaded.
window.teamStudioReady=true;
if(typeof render==='function'&&page==='komanda'&&activeProfile==='maris')render();
