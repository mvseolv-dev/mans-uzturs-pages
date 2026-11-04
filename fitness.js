/* MANS UZTURS ACTIVE - standalone sports UI extension, preserves existing state. */
let fitWeekOffset=0;
let fitSelectedDay=null;
const FIT_NAMES=['P','O','T','C','Pk','S','Sv'];
const FIT_ROUTINES=[
 {id:'mobility',emoji:'◌',type:'ATJAUNOŠANĀS',name:'Mobilitāte pēc basketbola',minutes:12,desc:'Vieglas kustības potītēm, gurniem un mugurai. Bez steigas un bez spēka izsīkuma.',exercise:['ankle','hips','bird']},
 {id:'core',emoji:'◇',type:'STABILITĀTE',name:'Stabils korpuss',minutes:18,desc:'Īss papildtreniņš stājai, korsetes muskuļiem un kontrolei laukumā.',exercise:['bird','bridge','push']},
 {id:'strength',emoji:'↗',type:'VIEGLS SPĒKS',name:'Spēks bez inventāra',minutes:20,desc:'Veic tikai tad, ja kājas ir atjaunojušās. Mērķis ir tehnika, nevis maksimāla slodze.',exercise:['squat','push','bridge']}
];
const FIT_EXERCISES={
 squat:{name:'Pietupiens pie krēsla',sets:'2 x 8-10',tip:'Pēdas plecu platumā. Virzi gurnus atpakaļ, pieskaries krēslam un celies, spiežot grīdā ar visu pēdu.',cues:['Saglabā muguru neitrālu','Ceļgali virzās pēdu virzienā','Sāc ar lēnu kustību'],art:'squat'},
 push:{name:'Atspiešanās pret sienu',sets:'2 x 8-12',tip:'Plaukstas uz sienas aptuveni plecu augstumā. Lēni pietuvini krūtis sienai, pēc tam izspiedies atpakaļ.',cues:['Ķermenis vienā līnijā','Elkoņi ne pārāk plati','Izspiežoties izelpo'],art:'push'},
 bridge:{name:'Gurnu tiltiņš',sets:'2 x 10-12',tip:'Guļus uz muguras, ceļi saliekti. Pacel gurnus līdz pleci, gurni un ceļi veido taisnu līniju.',cues:['Sasprindzini sēžas muskuļus','Neizliec muguras lejasdaļu','Augšā noturi 1 sekundi'],art:'bridge'},
 bird:{name:'Bird-dog',sets:'2 x 6-8 katrā pusē',tip:'Četrrāpus lēni izstiep pretējo roku un kāju. Noturi ķermeni stabili, tad samaini puses.',cues:['Gurnus turi paralēlus grīdai','Nesagriez muguru','Kusties lēnām'],art:'bird'},
 ankle:{name:'Potīšu mobilitāte',sets:'1-2 x 8 katrai kājai',tip:'Stāvus ar atbalstu. Virzi celi uz priekšu virs pēdas, papēdi neatceļot no grīdas.',cues:['Kustība bez sāpēm','Papēdis paliek uz grīdas','Lēns ritms'],art:'ankle'},
 hips:{name:'Gurnu mobilitāte',sets:'1-2 x 30 s katrā pusē',tip:'No stabila izklupiena maigi virzi gurnus uz priekšu, līdz jūti vieglu stiepšanos gurna priekšpusē.',cues:['Mugura taisna','Bez atsperīgām kustībām','Elpo mierīgi'],art:'hips'}
};
function fitD(date){return new Intl.DateTimeFormat('lv-LV',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'))}
function fitToday(){return dateISO(rigaToday())}
function fitDone(s){return !!state.sportLog?.[s.date]?.done}
function fitPossible(s){return s.type!=='Atcelts'&&s.type!=='Iespējams'&&(s.day!==6||s.choice==='game'||s.choice==='practice')}
function fitWeek(offset=fitWeekOffset){return sportItems(offset)}
function fitSummary(sessions=fitWeek()){
 const known=sessions.filter(fitPossible),completed=sessions.filter(fitDone);
 const minutes=completed.reduce((n,x)=>n+Math.max(0,Number(state.sportLog?.[x.date]?.minutes)||x.minutes),0);
 const home=Object.entries(state.homeSessions||{}).filter(([key,value])=>value&&key.slice(0,10)>=sessions[0].date&&key.slice(0,10)<=sessions[6].date);
 return {planned:known.length,done:completed.length,minutes,home:home.length};
}
function fitNext(){const dates=[...sportItems(0),...sportItems(1)];return dates.find(s=>s.date>=fitToday()&&!fitDone(s)&&fitPossible(s))||dates.find(s=>!fitDone(s)&&fitPossible(s))||dates[0]}
function fitIcon(id){const d={
 home:'M3 10.5 12 3l9 7.5V21h-7v-7h-4v7H3z',
 ball:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0v20M2 12h20M5 5c7 5 7 9 14 14M19 5C12 10 12 14 5 19',
 spark:'M12 2l2.7 6.9L22 12l-7.3 3.1L12 22l-2.7-6.9L2 12l7.3-3.1z',
 fork:'M5 3v8m4-8v8M5 7h4M7 11v10M17 3v18m-4-9c0-5 2-9 4-9',
 chart:'M3 18l6-6 4 3 8-9M3 6v15h18',
 check:'M4 12l5 5L20 6',
 arrow:'M5 12h14m-6-6 6 6-6 6',
 walk:'M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3 7 3-2 3 2 1 4M8 21l3-6-2-4M13 15l5 6',
 clock:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2',
 back:'M15 18l-6-6 6-6'
 }[id]||'M4 12h16';return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+d+'"/></svg>'}
function fitHeading(kicker,title,sub){return '<div class="fit-heading"><div><div class="fit-overline">'+kicker+'</div><h1>'+title+'</h1>'+(sub?'<p>'+sub+'</p>':'')+'</div></div>'}
function fitArt(type){
 const pieces={
 squat:{a:'M58 36L58 69L45 104M58 69L73 104M58 48L39 64M58 48L78 62',b:'M198 42L184 73L206 83L207 105M184 73L171 102M191 55L215 68',p1:[58,24],p2:[202,31]},
 push:{a:'M52 37L62 75L39 105M62 75L75 105M52 49L100 49M100 20V109',b:'M196 37L204 75L181 105M204 75L218 105M196 51L230 61L243 51M244 20V109',p1:[51,26],p2:[195,26]},
 bridge:{a:'M28 93L55 94L82 71L108 103M55 94L45 105M108 103L118 103',b:'M168 94L200 66L227 70L247 104M200 66L191 48M247 104L253 104',p1:[20,88],p2:[160,89]},
 bird:{a:'M32 82L57 62L88 64L105 90M57 62L49 95M88 64L86 96M57 62L43 48',b:'M169 81L191 63L220 63L251 41M191 63L162 44M220 63L225 98M191 63L184 97',p1:[26,76],p2:[164,73]}
 ,ankle:{a:'M54 42L54 77L70 96L96 105M54 77L43 105M54 56L74 58',b:'M201 42L201 76L222 96L248 104M201 76L190 103M201 56L221 58',p1:[54,30],p2:[201,30]},
 hips:{a:'M56 42L57 73L78 85L103 106M57 73L42 100M57 56L77 65',b:'M200 42L204 74L229 84L245 105M204 74L190 104M204 55L224 65',p1:[55,30],p2:[199,30]}
 }[type]||null;
 if(!pieces)return '';
 const h='<defs><linearGradient id="figureShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a7f44d"/><stop offset="100%" stop-color="#39b986"/></linearGradient></defs>';
 return '<svg viewBox="0 0 290 132" role="img" aria-label="Vingrinājuma sākuma un beigu pozīcijas shēma">'+h+'<rect x="2" y="2" width="129" height="127" rx="18" fill="#f0f5f1"/><rect x="159" y="2" width="129" height="127" rx="18" fill="#f0f5f1"/><text x="15" y="17" font-size="10" fill="#497b67" font-weight="800">01</text><text x="172" y="17" font-size="10" fill="#497b67" font-weight="800">02</text><path d="M136 65h16m-5-5 5 5-5 5" stroke="#2d8b66" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g fill="none" stroke="#245943" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"><path d="'+pieces.a+'"/><path d="'+pieces.b+'"/></g><circle cx="'+pieces.p1[0]+'" cy="'+pieces.p1[1]+'" r="9" fill="#f6b98a" stroke="#245943" stroke-width="2.5"/><circle cx="'+pieces.p2[0]+'" cy="'+pieces.p2[1]+'" r="9" fill="#f6b98a" stroke="#245943" stroke-width="2.5"/></svg>'
}
function fitDayChip(s,selected){const done=fitDone(s),isToday=s.date===fitToday(),dt=Number(s.date.slice(-2));return '<button class="fit-day '+(selected?'is-selected ':'')+(isToday?'is-today ':'')+(done?'is-done':'')+'" data-fit="day" data-day="'+s.day+'" aria-label="'+s.name+' '+dt+'" aria-pressed="'+(selected?'true':'false')+'"><span>'+s.name.slice(0,2)+'</span><strong>'+dt+'</strong><i>'+(done?'✓':fitPossible(s)?'•':'')+'</i></button>'}
function fitStrip(week){return '<div class="fit-weekbar"><button data-fit="week-prev" aria-label="Iepriekšējā nedēļa">'+fitIcon('back')+'</button><div class="fit-week-label">'+fitD(week[0].date)+' - '+fitD(week[6].date)+'</div><button data-fit="week-next" aria-label="Nākamā nedēļa">'+fitIcon('arrow')+'</button></div><div class="fit-days">'+week.map(x=>fitDayChip(x,x.day===fitSelectedDay)).join('')+'</div>'}
function fitStatus(s){
 if(fitDone(s))return '<span class="fit-status done">Paveikts</span>';
 if(s.type==='Atcelts')return '<span class="fit-status muted">Brīvs</span>';
 if(s.type==='Iespējams'||(s.day===6&&!s.choice))return '<span class="fit-status maybe">Jāprecizē</span>';
 return '<span class="fit-status planned">Ieplānots</span>';
}
function fitChoice(s){
 const opts=s.day===2?[['','Vēl nav apstiprināts'],['yes','Treniņš notiks'],['no','Nenotiks']]:s.day===3?[['','Gardene'],['veterans','Pie veterāniem']]:s.day===6?[['','Vēl nav zināms'],['game','BUKI spēle'],['practice','BUKI treniņš'],['rest','Atpūta']]:null;
 return opts?'<label class="fit-input-label">Precizēt aktivitāti<select data-fit-choice="'+s.date+'">'+opts.map(o=>'<option value="'+o[0]+'"'+(o[0]===s.choice?' selected':'')+'>'+o[1]+'</option>').join('')+'</select></label>':'';
}
function fitSession(s,expanded){
 const what=s.type==='Pastaiga'?'walk':'ball',shownTime=s.time,place=s.place;
 const btn=fitDone(s)?'Atcelt atzīmi':'Atzīmēt kā paveiktu';
 return '<article class="fit-session '+(fitDone(s)?'is-finished':'')+'"><div class="fit-session-top"><div class="fit-session-icon '+(what==='walk'?'is-walk':'')+'">'+fitIcon(what)+'</div><div class="fit-session-main"><div class="fit-overline">'+s.name.toUpperCase()+' · '+fitD(s.date)+'</div><h3>'+safe(s.title)+'</h3><p>'+safe(shownTime)+(place?' · '+safe(place):'')+'</p></div>'+fitStatus(s)+'</div>'+(expanded?'<div class="fit-session-lower">'+fitChoice(s)+'<div class="fit-session-foot"><label>Ilgums, min<input type="number" min="5" max="300" value="'+(state.sportLog?.[s.date]?.minutes||s.minutes)+'" data-fit-minutes="'+s.date+'"></label><button data-fit="toggle-activity" data-date="'+s.date+'" '+(s.type==='Atcelts'?'disabled':'')+'>'+fitIcon('check')+' '+btn+'</button></div></div>':'')+'</article>';
}
function fitKpi(label,value,note){return '<div class="fit-kpi"><div>'+label+'</div><strong>'+value+'</strong><span>'+note+'</span></div>'}
function fitTrainingSummary(){const s=fitSummary();return '<div class="fit-kpi-grid">'+fitKpi('AKTIVITĀTES',s.done+' / '+s.planned,'šajā nedēļā')+fitKpi('AKTĪVAIS LAIKS',s.minutes+' min','atzīmētās aktivitātes')+fitKpi('MĀJĀS',s.home,'papildu sesijas')+'</div>'}
function renderFitnessDashboard(){
 const today=fitToday(),week=sportItems(),next=fitNext(),stats=fitSummary(week),weight=latestWeights().at(-1),first=latestWeights()[0],goal=state.config.goal;
 const delta=first&&weight?(first.weight-weight.weight):0;
 const percent=stats.planned?Math.min(100,Math.round(stats.done/stats.planned*100)):0;
 const current=week.find(x=>x.date===today),currentLabel=current&&fitPossible(current)?current.title:current?.type==='Iespējams'?'Iespējams treniņš':'Atjaunošanās diena';
 return '<div class="fit-page"><section class="fit-cover"><div class="fit-cover-content"><div class="fit-overline">MANS UZTURS  /  ACTIVE</div><h1>Tavs ritms.<br><em>Tava spēle.</em></h1><p>Basketbols. Kustība. Atjaunošanās.<br>Viss vienā vietā.</p><button class="fit-primary fit-cover-cta" data-nav="trenini">Mans treniņu plāns '+fitIcon('arrow')+'</button></div><div class="fit-court" aria-hidden="true"><svg viewBox="0 0 260 260"><circle cx="130" cy="130" r="109" fill="none" stroke="#a8fa64" stroke-width="2" opacity=".48"/><circle cx="130" cy="130" r="54" fill="none" stroke="#a8fa64" stroke-width="2" opacity=".45"/><path d="M130 22V238M22 130H238M36 56q94 71 188 0M36 204q94-71 188 0" stroke="#a8fa64" stroke-width="2.5" fill="none" opacity=".48"/></svg></div></section>'+
 '<div class="fit-greeting"><span>ŠODIEN · '+fitD(today)+'</span><h2>'+safe(currentLabel||'Turpini kustēties')+'</h2></div>'+
 '<div class="fit-today-grid"><div class="fit-feature-card"><div class="fit-feature-top">'+fitIcon('clock')+' NĀKAMĀ AKTIVITĀTE</div><h3>'+safe(next.title)+'</h3><div class="fit-feature-meta">'+fitD(next.date)+' · '+safe(next.time)+'</div><p>'+safe(next.place)+'</p><button data-nav="trenini">Apskatīt grafiku '+fitIcon('arrow')+'</button></div><div class="fit-progress-ring-card"><span>NEDĒĻAS PROGRESS</span><div class="fit-ring" style="--fit-pct:'+percent+'%"><strong>'+percent+'%</strong></div><p>'+stats.done+' no '+stats.planned+' ieplānotajām aktivitātēm</p></div></div>'+
 '<div class="fit-section-head"><div><span>TAVA NEDĒĻA</span><h2>Aktivitāšu ritms</h2></div><button data-nav="trenini">Viss grafiks '+fitIcon('arrow')+'</button></div><div class="fit-week-preview">'+week.map(s=>'<div class="fit-week-preview-day '+(fitDone(s)?'done':s.date===today?'current':'')+'"><b>'+s.name.slice(0,2)+'</b><span>'+ (fitDone(s)?'✓':s.type==='Pastaiga'?'◦':s.type==='Iespējams'?'?':s.type==='Atcelts'?'·':'●')+'</span><small>'+s.date.slice(-2)+'</small></div>').join('')+'</div>'+
 '<div class="fit-section-head"><div><span>GALVENIE RĀDĪTĀJI</span><h2>Forma un kustība</h2></div></div><div class="fit-kpi-grid">'+fitKpi('AKTĪVĀS MINŪTES',stats.minutes+' min','pabeigtā slodze')+fitKpi('PĒDĒJAIS SVARS',weight?fmt(weight.weight,1)+' kg':'--','mērķis '+fmt(goal,0)+' kg')+fitKpi('SVARA IZMAIŅA',weight&&first?(delta>=0?'-':'+' )+fmt(Math.abs(delta),1)+' kg':'--','kopš pirmā pieraksta')+'</div>'+
 '<div class="fit-section-head"><div><span>ĪSAKIE CEĻI</span><h2>Ko darīsim tālāk?</h2></div></div><div class="fit-shortcuts"><button data-nav="majasha"><div class="fit-shortcut-icon">'+fitIcon('spark')+'</div><strong>Mājas treniņš</strong><span>15-20 min · bez inventāra</span>'+fitIcon('arrow')+'</button><button data-nav="uzturs"><div class="fit-shortcut-icon">'+fitIcon('fork')+'</div><strong>Uztura dienasgrāmata</strong><span>Ēdienreizes un iepirkumi</span>'+fitIcon('arrow')+'</button></div></div>';
}
function renderFitnessSchedule(){
 if(fitSelectedDay===null)fitSelectedDay=(rigaToday().getUTCDay()+6)%7;
 const week=fitWeek(),focus=week[fitSelectedDay]||week[0];
 return '<div class="fit-page">'+fitHeading('TAVS SPĒLES PLĀNS','Treniņu grafiks','Basketbols, pastaigas un atjaunošanās ar iespēju atzīmēt paveikto.')+
 fitTrainingSummary()+fitStrip(week)+fitSession(focus,true)+
 '<div class="fit-section-head"><div><span>KALENDĀRS</span><h2>Visas aktivitātes</h2></div></div><div class="fit-session-list">'+week.filter(x=>x.day!==fitSelectedDay).map(s=>'<button class="fit-timeline-item" data-fit="day" data-day="'+s.day+'"><span class="fit-timeline-date">'+s.name.slice(0,2)+'</span><span class="fit-timeline-main"><strong>'+safe(s.title)+'</strong><small>'+safe(s.time)+(s.place?' · '+safe(s.place):'')+'</small></span>'+fitStatus(s)+fitIcon('arrow')+'</button>').join('')+'</div>'+
 '<div class="fit-tip"><strong>Slodzi pielāgo pašsajūtai.</strong><p>Basketbols jau veido ievērojamu nedēļas slodzi. Ja ir spēle svētdien, pirmdienas treniņš var prasīt papildu atjaunošanos. Pastaigas ir mierīgā tempā, nevis sacensība.</p></div></div>';
}
function renderFitnessHome(){
 const today=fitToday(),count=Object.entries(state.homeSessions||{}).filter(([k,v])=>v&&k.startsWith(today+'|')).length;
 return '<div class="fit-page">'+fitHeading('TRENIŅŠ BEZ INVENTĀRA','Mājas treniņi','Īsi un konkrēti papildtreniņi, kas netraucē basketbola slodzei.')+
 '<section class="fit-home-feature"><div class="fit-overline">TAVS PAPILDU RITMS</div><h2>15 minūtes.<br>Spēcīgāks pamats.</h2><p>Izvēlies vieglu treniņu tikai dienā, kad jūties pietiekami atjaunojies.</p><div class="fit-home-feature-mark">15<span>MIN</span></div></section>'+
 '<div class="fit-section-head"><div><span>IZVĒLIES SESIJU</span><h2>Treniņu programmas</h2></div><span class="fit-secondary-label">'+count+' šodien paveikti</span></div>'+
 '<div class="fit-routine-list">'+FIT_ROUTINES.map(r=>'<article class="fit-routine"><div class="fit-routine-mark">'+r.emoji+'</div><div><span>'+r.type+' · '+r.minutes+' MIN</span><h3>'+r.name+'</h3><p>'+r.desc+'</p><button data-fit="routine-open" data-routine="'+r.id+'">Apskatīt vingrinājumus '+fitIcon('arrow')+'</button></div></article>').join('')+'</div>'+
 '<div class="fit-tip"><strong>Papildtreniņš nav obligāts katru dienu.</strong><p>Ja nedēļā ir 3-5 basketbola aktivitātes, izvēlies vienu mājas sesiju un vieglas pastaigas. Ja jūti ilgstošu nogurumu, prioritāte ir miegs un atjaunošanās.</p></div></div>';
}
function renderFitnessRoutine(id){
 const r=FIT_ROUTINES.find(x=>x.id===id)||FIT_ROUTINES[0],today=fitToday(),key=today+'|'+r.id,done=!!state.homeSessions?.[key];
 return '<div class="fit-page"><button class="fit-back" data-nav="majasha">'+fitIcon('back')+' Visi mājas treniņi</button>'+
 '<section class="fit-routine-head"><span>'+r.type+'</span><h1>'+r.name+'</h1><p>'+r.desc+'</p><div class="fit-routine-duration">'+fitIcon('clock')+' '+r.minutes+' min · bez inventāra</div></section>'+
 '<div class="fit-section-head"><div><span>SOĻI</span><h2>Vingrinājumi</h2></div></div><div class="fit-exercise-list">'+r.exercise.map((id,i)=>{const x=FIT_EXERCISES[id];return '<article class="fit-exercise"><div class="fit-exercise-art">'+fitArt(x.art)+'</div><div class="fit-exercise-info"><span>0'+(i+1)+' / '+x.sets+'</span><h3>'+x.name+'</h3><p>'+x.tip+'</p><ul>'+x.cues.map(v=>'<li>'+v+'</li>').join('')+'</ul></div></article>'}).join('')+'</div>'+
 '<div class="fit-tip"><strong>Drošība.</strong><p>Kustību shēmas ir vienkāršotas. Veic vingrinājumus bez sāpēm, elpo mierīgi un starp piegājieniem atpūties 30-60 sekundes.</p></div>'+
 '<button class="fit-primary fit-wide" data-fit="home-complete" data-routine="'+r.id+'">'+fitIcon('check')+' '+(done?'Atcelt paveikto':'Atzīmēt treniņu kā paveiktu')+'</button></div>';
}
function renderFitnessNutrition(){
 const today=fitToday(),custom=state.customMeals?.[today]||[],idx=(rigaToday().getUTCDay()+6)%7;
 const checked=state.checks?.[today]||{},entries=MEALS.reduce((sum,meal)=>{if(!checked[meal.id]||custom.some(x=>x.mealId===meal.id))return sum;const rec=RECIPES[plannedRecipeId(idx,meal.id)];return {kcal:sum.kcal+rec.kcal,protein:sum.protein+rec.protein}},{kcal:0,protein:0});
 const consumed={kcal:Math.round(entries.kcal+custom.reduce((n,v)=>n+(Number(v.kcal)||0),0)),protein:Math.round(entries.protein+custom.reduce((n,v)=>n+(Number(v.protein)||0),0))};
 return '<div class="fit-page">'+fitHeading('FORMA SĀKAS IKDIENĀ','Uzturs un enerģija','Maltīšu pieraksti, aptuvenās kalorijas un vienkāršs iepirkumu saraksts.')+
 '<div class="fit-nutrition-top"><div class="fit-overline">ŠODIEN APĒSTS</div><h2>'+fmt(consumed.kcal)+' <small>kcal</small></h2><div class="fit-meter"><div style="width:'+Math.min(100,Math.round(consumed.kcal/state.config.kcal*100))+'%"></div></div><p>Dienas mērķis '+fmt(state.config.kcal)+' kcal · '+fmt(consumed.protein)+' g olbaltumvielu</p></div>'+
 '<div class="fit-nutrition-links">'+[
 ['diena','◉','Maltīšu pieraksti','Ko apēdi šodien un aptuvenā uzturvērtība'],
 ['nedela','▦','7 dienu ēdienkarte','Ēdienu plāns ar recepšu izvēli'],
 ['iepirkumi','≡','Iepirkumu saraksts','Pievieno vai izņem produktus'],
 ['gatavosana','◷','Gatavošanas plāns','Sagatavo maltītes nākamajām dienām']
 ].map(v=>'<button data-nav="'+v[0]+'"><span class="fit-link-icon">'+v[1]+'</span><span><strong>'+v[2]+'</strong><small>'+v[3]+'</small></span>'+fitIcon('arrow')+'</button>').join('')+'</div></div>';
}
function renderFitnessProgress(){
 const records=latestWeights(),first=records[0],latest=records.at(-1),goal=state.config.goal,start=first?.weight||0,current=latest?.weight||0;
 const total=start-goal,change=latest?start-current:0,percent=latest&&total>0?Math.max(0,Math.min(100,Math.round(change/total*100))):0;
 const stat=fitSummary();
 return '<div class="fit-page">'+fitHeading('SKAITĻI, KAS PALĪDZ','Tavs progress','Svara tendence, aktivitātes un rezultāti bez lieka trokšņa.')+
 '<section class="fit-weight-hero"><div class="fit-overline">PAŠREIZĒJAIS SVARS</div><h2>'+(latest?fmt(current,1):'--')+' <small>kg</small></h2><div class="fit-weight-grid"><span>Sākumā <b>'+(first?fmt(start,1):'--')+' kg</b></span><span>Mērķis <b>'+fmt(goal,1)+' kg</b></span></div><div class="fit-meter"><div style="width:'+percent+'%"></div></div><p>'+(latest?(change>=0?'Samazinājies par ':'Palielinājies par ')+fmt(Math.abs(change),1)+' kg kopš pirmā pieraksta.':'Pievieno pirmo svara ierakstu.')+'</p></section>'+
 '<div class="fit-kpi-grid">'+fitKpi('AKTIVITĀTES',stat.done+' / '+stat.planned,'šajā nedēļā')+fitKpi('SLĒDZES LAIKS',stat.minutes+' min','paveiktie treniņi')+fitKpi('MĀJAS TRENIŅI',stat.home,'šonedēļ')+'</div>'+
 '<div class="fit-section-head"><div><span>SVARA LĪKNE</span><h2>Tendence</h2></div></div><div class="fit-chart-wrap">'+progressSvg(records)+'</div>'+
 '<div class="fit-section-head"><div><span>PIERAKSTS</span><h2>Pievienot svaru</h2></div></div><form id="weight-form" class="fit-weight-form"><label>Datums<input type="date" name="date" value="'+fitToday()+'" max="'+fitToday()+'" required></label><label>Svars (kg)<input name="weight" type="text" inputmode="text" placeholder="Piemēram 99,5" required></label><button class="fit-primary" type="submit">Saglabāt svaru '+fitIcon('arrow')+'</button></form><p class="fit-footnote">Vērtē svara tendenci, nevis vienas dienas svārstības. Vislabāk svērties no rīta līdzīgos apstākļos.</p>'+
 '<details class="fit-details"><summary>Svēršanās vēsture · '+records.length+' ieraksti</summary>'+records.slice().reverse().slice(0,40).map(x=>'<div class="weight-record"><b>'+fmt(x.weight,1)+' kg <small>'+x.date+'</small></b><button data-action="delete-weight" data-date="'+x.date+'">Dzēst</button></div>').join('')+'</details>'+
 '<details class="fit-details"><summary>Datu kopija</summary><div class="fit-export"><button class="btn secondary small" data-action="export">Eksportēt datus</button><label for="import-data" class="btn secondary small">Importēt datus</label><input hidden type="file" id="import-data" accept=".json,application/json"></div><p class="fit-footnote">Dati paliek šajā ierīcē. Pirms ierīces maiņas saglabā kopiju.</p></details></div>';
}
document.addEventListener('click',event=>{
 const el=event.target.closest('[data-fit]');if(!el)return;
 const act=el.dataset.fit;
 if(act==='day'){fitSelectedDay=Number(el.dataset.day);render();return}
 if(act==='week-prev'){fitWeekOffset--;fitSelectedDay=0;render();return}
 if(act==='week-next'){fitWeekOffset++;fitSelectedDay=0;render();return}
 if(act==='toggle-activity'){const d=el.dataset.date;state.sportLog??={};if(state.sportLog[d]?.done)delete state.sportLog[d];else{const s=fitWeek().find(x=>x.date===d),input=document.querySelector('[data-fit-minutes="'+d+'"]');const n=Number(input?.value||s?.minutes||60);state.sportLog[d]={done:true,minutes:Math.max(5,Math.min(300,n))};}save();render();return}
 if(act==='routine-open'){window.fitOpenRoutine=el.dataset.routine;go('fitroutine');return}
 if(act==='home-complete'){const k=fitToday()+'|'+el.dataset.routine;state.homeSessions??={};if(state.homeSessions[k])delete state.homeSessions[k];else state.homeSessions[k]=true;save();render();return}
});
document.addEventListener('change',event=>{
 const el=event.target.closest('[data-fit-choice]');if(!el)return;
 state.sportChoices??={};const date=el.dataset.fitChoice;state.sportChoices[date]=el.value;const day=SPORT_DAYS.find(x=>sportDate(x.day,fitWeekOffset)===date);if((day?.day===2&&el.value==='no')||(day?.day===6&&el.value==='rest')){if(state.sportLog)delete state.sportLog[date];}save();render();
});
