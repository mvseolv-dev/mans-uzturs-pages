
/* MANS UZTURS ACTIVE / V2 - modern performance interface
 * Preserves all existing profile, meal and progress storage.
 * Video previews are sourced from YouTube and loaded only for display.
 */
const ACTIVE_VIDEOS={
 reverse:{id:"beGBOkX8Cp0",source:"Keele University Sport",title:"Izklupiens atpakaļ"},
 push:{id:"WDIpL0pjun0",source:"National Academy of Sports Medicine",title:"Atspiešanās no grīdas"},
 rdl:{id:"IJDw_imNzw8",source:"Keele University Sport",title:"Rumāņu vilkme uz vienas kājas"},
 bulgarian:{id:"QJ8CHHY4A3w",source:"Keele University Sport",title:"Bulgāru pietupiens"},
 sideplank:{id:"yPFBx64XHbs",source:"Keele University Sport",title:"Sānu planks"},
 lateral:{id:"JE8y33m0Lf0",source:"Keele University Sport",title:"Sānu izklupiens"},
 calf:{id:"LFfmd7lzVWQ",source:"Keele University Sport",title:"Ikru pacelšanās"},
 planktap:{id:"lwQHInWHKrs",source:"Keele University Sport",title:"Planks ar plecu pieskārieniem"},
 deadbug:{id:"Gse7WT-spEQ",source:"Keele University Sport",title:"Dead bug"},
 ankle:{id:"9n4Mrej5s3s",source:"Motus Physiotherapy",title:"Potīšu mobilitāte"},
 hips:{id:"RHA3eCUQkQ4",source:"Rehab and Revive Physical Therapy",title:"Gurnu saliecēja stiepšana"}
};
const ACTIVE_PROGRAMS=[
 {id:"strength",label:"STRENGTH",title:"Basketbolista spēks",minutes:28,level:"VIDĒJS+",summary:"Pilns ķermenis: vienas kājas spēks, atspiešanās, stabilitāte un ikri. Vienu reizi nedēļā, ja jūties atjaunojies.",moves:["reverse","push","rdl","calf","sideplank"]},
 {id:"core",label:"ATHLETIC",title:"Stabilitāte un kustību kontrole",minutes:22,level:"VIDĒJS",summary:"Sānu kustības, vienas kājas kontrole un spēcīgs korpuss basketbolam. Vari izmantot kā otro vieglāko spēka dienu.",moves:["lateral","planktap","bulgarian","deadbug"]},
 {id:"mobility",label:"RECOVERY",title:"Mobilitāte un atjaunošanās",minutes:12,level:"VIEGLS",summary:"Potītes, gurni un korpusa kontrole pēc treniņiem. Tā nav obligāta papildu slodze.",moves:["ankle","hips","deadbug"]}
];
const ACTIVE_TIPS={
 reverse:{name:"Izklupiens atpakaļ",sets:"3 x 8 katrai kājai",tip:"No stāvus pozīcijas sper soli atpakaļ un nolaid aizmugurējo celi gandrīz līdz grīdai. Ar priekšējo kāju atgriezies sākumā. Sāc bez svara.",cues:["Priekšējās kājas pēda uz grīdas","Celis seko pēdas virzienam","8-10 atkārtojumi ar kontroli"]},
 push:{name:"Atspiešanās no grīdas",sets:"3 x 8-15",tip:"Plaukstas nedaudz platāk par pleciem. Sasprindzini vēderu, nolaid krūtis līdz ērtam dziļumam un spiedies augšup. Kad kļūst viegli, palielini atkārtojumus.",cues:["Ķermenis taisnā līnijā","Elkoņi aptuveni 30-45° no ķermeņa","Neieliec muguras lejasdaļu"]},
 rdl:{name:"Rumāņu vilkme uz vienas kājas",sets:"2 x 8 katrai kājai",tip:"Stāvi uz vienas kājas ar viegli saliektu celi. Virzi gurnus atpakaļ, otru kāju stiepjot aiz sevis. Mugura paliek neitrāla, gurni vērsti uz leju.",cues:["Kustība notiek gurnos, ne mugurā","Lēni 2-3 sekundes uz leju","Svarīgāka stabilitāte, ne dziļums"]},
 bulgarian:{name:"Bulgāru pietupiens",sets:"2 x 6-8 katrai kājai",tip:"Aizmugurējo pēdu atbalsti uz stabila, ne pārāk augsta paaugstinājuma. Nolaid gurnus lejup un pacelies ar priekšējās kājas spēku. Sāc tikai ar ķermeņa svaru.",cues:["Atbalsts nedrīkst slīdēt","Ceļgals priekšējās pēdas virzienā","Neizpildi līdz spēku izsīkumam"]},
 sideplank:{name:"Sānu planks",sets:"2 x 25-40 s katrā pusē",tip:"Atbalsties uz apakšdelma, elkonis zem pleca. Pacel gurnus un noturi ķermeni vienā līnijā. Ja viegli, palielini laiku.",cues:["Plecs virs elkoņa","Gurni nenokrīt","Elpo vienmērīgi"]},
 lateral:{name:"Sānu izklupiens",sets:"2 x 8 katrā pusē",tip:"Sper platu soli sānis, saliec soļa kāju un virzi gurnus atpakaļ, otru kāju atstājot taisnāku. Spiedies atpakaļ stāvus.",cues:["Pēdas vērstas uz priekšu","Svars vairāk uz saliektās kājas","Kusties kontrolēti, bez rāviena"]},
 calf:{name:"Ikru pacelšanās",sets:"3 x 12-15",tip:"Stāvus lēni pacelies uz pirkstgaliem, augšā noturi sekundi un kontrolēti nolaid papēžus. Ja ar abām kājām viegli, pārej uz vienu kāju.",cues:["2 sekundes augšup, 2 lejup","Nelek un neatsperies","Vajadzības gadījumā pieturies"]},
 planktap:{name:"Planks ar plecu pieskārieniem",sets:"2 x 10 katrai rokai",tip:"Augstā plankā pārmaiņus pieskaries pretējam plecam. Kājas nedaudz platāk, lai gurni nešūpotos.",cues:["Sasprindzini vēdera muskuļus","Gurnus turi paralēli grīdai","Nešūpo ķermeni sānis"]},
 deadbug:{name:"Dead bug",sets:"2 x 10 katrā pusē",tip:"Guļus uz muguras, rokas un kājas paceltas. Lēni izstiep pretējo roku un kāju, muguras lejasdaļai paliekot stabilai.",cues:["Muguru neizliec","Kusties lēni","Izelpo izstiepjoties"]},
 ankle:{name:"Potīšu mobilitāte",sets:"1 x 10 katrai kājai",tip:"Uz stabila paaugstinājuma novieto vienu pēdu. Lēnām virzi celi uz priekšu pēdas virzienā, papēdi turot uz atbalsta. Izpildi tikai ērtā amplitūdā.",cues:["Papēdis uz grīdas","Bez sāpēm","Lēns un kontrolēts ritms"]},
 hips:{name:"Gurnu saliecēju stiepšana",sets:"1-2 x 30 s katrā pusē",tip:"Pusceļos maigi virzi gurnus uz priekšu, turot vēderu un sēžas muskuļus sasprindzinātus. Jājūt neliela stiepšanās gurna priekšpusē.",cues:["Neizliec muguru","Nepārspīlē stiepšanās dziļumu","Mierīgi elpo"]}
};
const ACTIVE_STILLS={
 reverse:['start','peak'],push:['start','peak'],rdl:['start','peak'],
 bulgarian:['start','peak'],sideplank:['main'],lateral:['start','peak'],
 calf:['start','peak'],planktap:['main'],deadbug:['start','peak'],
 ankle:['main'],hips:['main']
};
function activePoseGallery(id){
 const parts=ACTIVE_STILLS[id];if(!parts)return '';
 const ex=activeT(id),one=parts.length===1;
 const labels=one?['POZĪCIJA']:['01 · SĀKUMS','02 · KUSTĪBA'];
 const photos=parts.map((part,i)=>'<figure class="ap-pose"><img src="./assets/exercises/'+id+'-'+part+'.webp" alt="'+safe(ex.name)+' - '+(one?'vingrinājuma pozīcija':i?'kustības beigu pozīcija':'sākuma pozīcija')+'" loading="lazy" decoding="async" width="512" height="512"><figcaption>'+labels[i]+'</figcaption></figure>').join('');
 const note=id==='planktap'?'Attēlā redzama sākuma pozīcija. No planka pārmaiņus pieskaries pretējam plecam, gurnus turi nekustīgus.':
 id==='ankle'?'Attēlā ir potītes mobilitātes variants ar paaugstinājumu. Video rāda alternatīvu kustības pārbaudi.':'';
 return '<div class="ap-pose-gallery '+(one?'ap-pose-single':'')+'">'+photos+(note?'<div class="ap-pose-note">'+note+'</div>':'')+'</div>';
}
const ACTIVE_COVER="https://images.pexels.com/photos/974525/pexels-photo-974525.jpeg?auto=compress&cs=tinysrgb&w=1250";
function activeImg(id){return "https://i.ytimg.com/vi/"+ACTIVE_VIDEOS[id].id+"/hqdefault.jpg"}
function activeT(id){return ACTIVE_TIPS[id]||FIT_EXERCISES[id]}
function activeTitle(eyebrow,title,desc){return '<div class="ap-heading"><span>'+eyebrow+'</span><h1>'+title+'</h1>'+(desc?'<p>'+desc+'</p>':'')+'</div>'}
function activeSection(label,title,right=""){return '<div class="ap-section"><div><span>'+label+'</span><h2>'+title+'</h2></div>'+right+'</div>'}
function activeTag(t,kind=""){return '<span class="ap-tag '+kind+'">'+safe(t)+'</span>'}
function activeCard(r){
 const done=!!state.homeSessions?.[fitToday()+"|"+r.id];
 return '<button class="ap-program" data-ap-open="'+r.id+'"><img src="'+activeImg(r.moves[0])+'" alt="Treniņa priekšskatījums" loading="lazy" referrerpolicy="no-referrer"><span class="ap-program-shadow"></span><span class="ap-program-type">'+r.label+'</span><span class="ap-program-copy"><strong>'+safe(r.title)+'</strong><small>'+r.minutes+' MIN · '+r.level+(done?' · ✓ PAVEIKTS':'')+'</small></span><span class="ap-play">▶</span></button>';
}
function activeWeekLine(s){
 const done=fitDone(s),kind=s.type==="Pastaiga"?"walking":s.type==="Iespējams"?"maybe":"basket";
 return '<div class="ap-week-item '+(done?'done':'')+'"><span class="ap-week-date"><b>'+s.name.slice(0,2)+'</b><small>'+s.date.slice(-2)+'</small></span><div class="ap-week-content"><span>'+kind.toUpperCase()+' · '+fitD(s.date)+'</span><strong>'+safe(s.title)+'</strong><small>'+safe(s.time)+' · '+safe(s.place)+'</small></div>'+activeTag(done?'PAVEIKTS':kind==="maybe"?"IESPĒJAMS":"PLĀNĀ",done?'lime':'')+'</div>';
}
function activeWeeklyStats(){
 const s=fitSummary();return '<div class="ap-stats">'+
  '<div><span>PAVEIKTS</span><strong>'+s.done+'<small> / '+s.planned+'</small></strong><em>treniņi šonedēļ</em></div>'+
  '<div><span>AKTĪVAIS LAIKS</span><strong>'+s.minutes+'<small> min</small></strong><em>atzīmētā slodze</em></div>'+
  '<div><span>MĀJĀS</span><strong>'+s.home+'</strong><em>papildus sesijas</em></div></div>';
}
function activeChart(){
 const a=latestWeights().slice(-12);
 if(a.length<2)return '<div class="ap-chart-empty">Vēl viens svara ieraksts, un te būs tava progresa līkne.</div>';
 const values=a.map(v=>v.weight),lowest=Math.min(...values)-0.5,highest=Math.max(...values)+0.5,span=highest-lowest;
 const pts=a.map((v,i)=>[20+i/(a.length-1)*332,19+(highest-v.weight)/span*96]);
 const points=pts.map(x=>x.map(v=>v.toFixed(1)).join(',')).join(' ');
 return '<svg viewBox="0 0 375 145" role="img" aria-label="Svara tendences grafiks" class="ap-chart"><defs><linearGradient id="activeChartFade" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#cefb39" stop-opacity=".25"/><stop offset="1" stop-color="#cefb39" stop-opacity="0"/></linearGradient></defs><path d="M20 24H352 M20 70H352 M20 115H352" fill="none" stroke="#303730"/><polygon points="20,115 '+points+' 352,115" fill="url(#activeChartFade)"/><polyline points="'+points+'" fill="none" stroke="#cefb39" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+pts.map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3" fill="#cefb39"/>').join('')+'</svg>';
}
renderFitnessDashboard=function(){
 const today=fitToday(),next=fitNext(),week=sportItems(),s=fitSummary(week),last=latestWeights().at(-1);
 const percent=s.planned?Math.round(100*s.done/s.planned):0;
 return '<div class="ap-screen"><div class="ap-welcome"><div class="ap-avatar">MV</div><div><span>MANS UZTURS ACTIVE</span><strong>Laiks kustēties <i>✳</i></strong></div><div class="ap-welcome-date">'+fitD(today)+'</div></div>'+
 '<section class="ap-hero" style="--ap-photo:url('+ACTIVE_COVER+')"><div class="ap-hero-dim"></div><div class="ap-hero-info"><div class="ap-hero-pill">✦ GAME MODE / ON</div><h1>TRAIN.<br>PLAY.<br><em>REPEAT.</em></h1><p>Tavs basketbols, tavs ritms.<br>Gudrāka slodze un atjaunošanās.</p><button data-nav="trenini">SKATĪT GRAFIKU <b>↗</b></button></div></section>'+
 activeSection("TODAY","Nākamā aktivitāte",activeTag("NEXT UP","lime"))+
 '<div class="ap-next"><div class="ap-next-icon">🏀</div><div><small>'+next.name.toUpperCase()+' · '+fitD(next.date)+'</small><h3>'+safe(next.title)+'</h3><p>'+safe(next.time)+' · '+safe(next.place)+'</p></div><button data-nav="trenini">↗</button></div>'+
 activeSection("THIS WEEK","Nedēļas ritms",'<div class="ap-mini-ring" style="--ap-percent:'+percent+'%">'+percent+'%</div>')+
 '<div class="ap-day-strip">'+week.map(x=>'<button data-nav="trenini" class="'+(x.date===today?'now ':'')+(fitDone(x)?'marked':'')+'"><span>'+x.name.slice(0,2)+'</span><b>'+x.date.slice(-2)+'</b><small>'+(fitDone(x)?'✓':x.type==='Pastaiga'?'◉':'·')+'</small></button>').join('')+'</div>'+
 activeWeeklyStats()+
 activeSection("TEAM / BUKI","Komandas treniņi",'<button class="ap-text-btn" data-nav="komanda">Atvērt ↗</button>')+
 '<button class="ap-team-shortcut" data-nav="komanda"><span class="ap-team-shortcut-icon">🏀</span><span><strong>Ko trenēsim ar zēniem?</strong><small>112 vingrinājumi · cilvēku skaits · metieni · dribls · aizsardzība</small></span><b>↗</b></button>'+
 activeSection("TRAINING LIBRARY","Vingrojumi mājās",'<button class="ap-text-btn" data-nav="majasha">Visi ↗</button>')+
 '<div class="ap-program-grid">'+ACTIVE_PROGRAMS.slice(0,2).map(activeCard).join('')+'</div>'+
 activeSection("BODY METRICS","Svara tendence",'<button class="ap-text-btn" data-nav="progress">Progress ↗</button>')+
 '<div class="ap-metrics-panel"><div><span>PAŠREIZĒJAIS SVARS</span><h3>'+(last?fmt(last.weight,1):'--')+' <small>kg</small></h3><p>Mērķis: '+fmt(state.config.goal,0)+' kg</p></div>'+activeChart()+'</div></div>';
};
function activeSelectedSession(s){
 const isWalk=s.type==='Pastaiga',done=fitDone(s),label=s.type==='Atcelts'?'Nenotiek':done?'Paveikts':s.type==='Iespējams'||(s.day===6&&!s.choice)?'Jāprecizē':'Ieplānots';
 const duration=Math.max(5,Math.min(300,Number(state.sportLog?.[s.date]?.minutes)||s.minutes));
 const thursday=s.day===3?'<div class="ap-selected-options"><span>TRENIŅA VIETA</span><div class="ap-location-toggle"><button type="button" data-ap-choice="garden" data-date="'+s.date+'" class="'+(s.choice!=='veterans'?'selected':'')+'" aria-pressed="'+(s.choice!=='veterans')+'">Gardene <small>19:00</small></button><button type="button" data-ap-choice="veterans" data-date="'+s.date+'" class="'+(s.choice==='veterans'?'selected':'')+'" aria-pressed="'+(s.choice==='veterans')+'">Veterānu treniņš <small>19:00</small></button></div></div>':'';
 const other=s.day===2||s.day===6?'<div class="ap-selected-options">'+fitChoice(s)+'</div>':'';
 return '<article class="ap-selected-card">'+
 '<div class="ap-selected-meta"><span>'+s.name.toUpperCase()+' · '+fitD(s.date)+'</span><span class="ap-selected-state '+(done?'done':s.type==='Iespējams'?'pending':'')+'">'+label+'</span></div>'+
 '<div class="ap-selected-title"><div class="ap-selected-symbol">'+(isWalk?'◉':'🏀')+'</div><div><h3>'+safe(s.title)+'</h3><p>'+safe(s.time)+(s.place?' · '+safe(s.place):'')+'</p></div></div>'+
 thursday+other+
 '<div class="ap-selected-footer"><label>ILGUMS, MIN<input type="number" inputmode="numeric" min="5" max="300" data-fit-minutes="'+s.date+'" value="'+duration+'"></label><button type="button" class="ap-selected-confirm" data-fit="toggle-activity" data-date="'+s.date+'" '+(s.type==='Atcelts'?'disabled':'')+'>'+(done?'✓ Atcelt paveikto':'✓ Atzīmēt kā paveiktu')+'</button></div></article>';
}
renderFitnessSchedule=function(){
 if(fitSelectedDay===null)fitSelectedDay=(rigaToday().getUTCDay()+6)%7;
 const week=fitWeek(),current=week[fitSelectedDay]||week[0];
 return '<div class="ap-screen">'+activeTitle("YOUR CALENDAR","Treniņu grafiks","Basketbols, pastaigas un atjaunošanās vienā plānā.")+
 '<div class="ap-week-header"><div><span>WEEKLY SCHEDULE</span><h2>'+fitD(week[0].date)+' - '+fitD(week[6].date)+'</h2></div><div><button data-fit="week-prev" aria-label="Iepriekšējā nedēļa">‹</button><button data-fit="week-next" aria-label="Nākamā nedēļa">›</button></div></div>'+
 '<div class="ap-day-strip">'+week.map(x=>'<button data-fit="day" data-day="'+x.day+'" class="'+(fitSelectedDay===x.day?'now ':'')+(fitDone(x)?'marked':'')+'"><span>'+x.name.slice(0,2)+'</span><b>'+x.date.slice(-2)+'</b><small>'+(fitDone(x)?'✓':'·')+'</small></button>').join('')+'</div>'+
 activeWeeklyStats()+activeSection("SELECTED DAY","Izvēlētā aktivitāte",activeTag(fitD(current.date),"lime"))+activeSelectedSession(current)+
 activeSection("UPCOMING","Nedēļas aktivitātes")+'<div class="ap-week-list">'+week.filter(x=>x.day!==fitSelectedDay).map(activeWeekLine).join('')+'</div>'+
 '<div class="ap-notice"><b>Atjaunošanās ir daļa no treniņa</b><p>60 min pastaigas ir mierīgā tempā. Ja pēc spēles vai treniņa jūties noguris, saīsini pastaigu vai izvēlies atpūtu.</p></div></div>';
};
renderFitnessHome=function(){
 return '<div class="ap-screen">'+activeTitle("WORKOUT LIBRARY","Mājas treniņi","Reāli vingrinājumu video, skaidri soļi un īsas programmas bez inventāra.")+
 '<div class="ap-highlight"><div><span>MOVE BETTER / FEEL BETTER</span><h2>YOUR<br>BODY.<br><em>YOUR POWER.</em></h2><p>Sāc ar 12-20 minūtēm.</p></div><img src="'+activeImg("reverse")+'" alt="Vingrinājuma video priekšskatījums" loading="lazy" referrerpolicy="no-referrer"/></div>'+
 activeSection("CHOOSE A WORKOUT","Programmas",activeTag("3 PROGRAMMAS","lime"))+
 '<div class="ap-workout-list">'+ACTIVE_PROGRAMS.map(r=>'<button class="ap-workout-row" data-ap-open="'+r.id+'"><img src="'+activeImg(r.moves[0])+'" alt="" loading="lazy" referrerpolicy="no-referrer"><div><small>'+r.label+'</small><strong>'+safe(r.title)+'</strong><span>'+r.minutes+' MIN · '+r.moves.length+' VINGRINĀJUMI · '+r.level+'</span><p>'+r.summary+'</p></div><b>↗</b></button>').join('')+'</div>'+
 '<div class="ap-notice"><b>Izvēlies pēc basketbola slodzes</b><p>Sāc ar vienu spēka vai stabilitātes sesiju nedēļā. Starp smagu kāju slodzi un spēli atstāj atjaunošanās laiku; ja ir vairākas intensīvas basketbola dienas, izvēlies tikai mobilitāti. Spēka vingrinājumos atstāj 2-3 atkārtojumus rezervē.</p></div></div>';
};
function activeExercise(id,routine,index){
 const ex=activeT(id),meta=ACTIVE_VIDEOS[id],done=!!state.exerciseChecks?.[fitToday()+"|"+routine+"|"+id];
 return '<article class="ap-exercise ap-exercise-visual">'+
 '<div class="ap-ex-visual"><div class="ap-ex-visual-kicker">0'+(index+1)+' · VIZUĀLĀ PAMĀCĪBA</div>'+activePoseGallery(id)+'</div>'+
 '<div class="ap-ex-info"><span>'+ex.sets+'</span><h3>'+safe(ex.name)+'</h3><div class="ap-ex-instruction-label">KĀ IZPILDĪT</div><p>'+safe(ex.tip)+'</p><ul>'+ex.cues.map(x=>'<li>✓ '+safe(x)+'</li>').join('')+'</ul><div class="ap-ex-actions"><button data-ap-video="'+id+'">▶ SKATĪT VIDEO</button><button class="'+(done?'done':'')+'" data-ap-check="'+id+'" data-ap-routine="'+routine+'">'+(done?'✓ PAVEIKTS':'○ ATZĪMĒT')+'</button></div><div class="ap-ex-credit-video">Video: '+safe(meta.source)+'</div></div></article>';
}
renderFitnessRoutine=function(id){
 const routine=ACTIVE_PROGRAMS.find(x=>x.id===id)||ACTIVE_PROGRAMS[0],key=fitToday()+"|"+routine.id,done=!!state.homeSessions?.[key],doneCount=routine.moves.filter(m=>!!state.exerciseChecks?.[fitToday()+"|"+routine.id+"|"+m]).length;
 return '<div class="ap-screen"><button class="ap-back" data-nav="majasha">‹ ATPAKAĻ UZ PROGRAMMĀM</button>'+
 '<div class="ap-routine-cover" style="--ap-photo:url('+activeImg(routine.moves[0])+')"><div><span>'+routine.label+' / '+routine.minutes+' MIN</span><h1>'+safe(routine.title)+'</h1><p>'+safe(routine.summary)+'</p>'+activeTag(routine.level,"lime")+'</div></div>'+
 '<div class="ap-routine-progress"><span>PAVEIKTIE VINGRINĀJUMI <b>'+doneCount+' / '+routine.moves.length+'</b></span><div><i style="width:'+Math.round(doneCount/routine.moves.length*100)+'%"></i></div></div>'+
 activeSection("EXERCISES","Vingrinājumi attēlos",activeTag("ATTĒLI + VIDEO","lime"))+
 '<div class="ap-ex-list">'+routine.moves.map((m,i)=>activeExercise(m,routine.id,i)).join('')+'</div>'+
 '<button class="ap-cta-wide" data-ap-finish="'+routine.id+'">'+(done?'✓ ATCELT PAVEIKTO':'✓ ATZĪMĒT TRENIŅU KĀ PAVEIKTU')+'</button>'+
 '<p class="ap-disclaimer">Ieteicamā atpūta starp piegājieniem: 45-90 sekundes. Sāc ar mazāku apjomu un uzturi labu tehniku. Attēli ir ilustratīvi, video paliek kā papildu demonstrācija. Pie sāpēm pārtrauc vingrinājumu. <a href="https://repdb.co" target="_blank" rel="noopener noreferrer">Exercise data by RepDB (repdb.co)</a>.</p></div>';
};
renderFitnessNutrition=function(){
 const today=fitToday(),custom=state.customMeals?.[today]||[],idx=(rigaToday().getUTCDay()+6)%7;
 let k=0,p=0;for(const meal of MEALS){if(state.checks?.[today]?.[meal.id]&&!custom.some(x=>x.mealId===meal.id)){const r=RECIPES[plannedRecipeId(idx,meal.id)];k+=r.kcal;p+=r.protein}}
 for(const c of custom){k+=Number(c.kcal)||0;p+=Number(c.protein)||0}
 const percent=Math.min(100,Math.round(k/state.config.kcal*100));
 return '<div class="ap-screen">'+activeTitle("FOOD & FUEL","Uzturs","Vienkāršs pieraksts, aptuvenas kalorijas un ēdienu plānošana.")+
 '<div class="ap-nutrition-stat"><span>ŠODIEN APĒSTS</span><h2>'+fmt(k)+' <small>KCAL</small></h2><div><i style="width:'+percent+'%"></i></div><p>'+fmt(p)+' g olbaltumvielu · mērķis '+fmt(state.config.kcal)+' kcal</p></div>'+
 activeSection("YOUR FOOD","Ko vēlies izdarīt?")+
 '<div class="ap-nutrition-list">'+[['diena','◉','Maltīšu pieraksti','Ieraksti, ko apēdi un kādā porcijā'],['nedela','▦','Nedēļas ēdienkarte','Septiņu dienu plāns ar receptēm'],['iepirkumi','≡','Iepirkumu saraksts','Pievieno un dzēs savas preces'],['gatavosana','◷','Gatavošanas grafiks','Pagatavo maltītes iepriekš']].map(x=>'<button data-nav="'+x[0]+'"><i>'+x[1]+'</i><span><strong>'+x[2]+'</strong><small>'+x[3]+'</small></span><b>↗</b></button>').join('')+'</div></div>';
};
renderFitnessProgress=function(){
 const entries=latestWeights(),first=entries[0],last=entries.at(-1),goal=state.config.goal,start=first?.weight||0,cur=last?.weight||0,delta=last?start-cur:0,pct=last&&start>goal?Math.max(0,Math.min(100,Math.round(delta/(start-goal)*100))):0;
 return '<div class="ap-screen">'+activeTitle("YOUR NUMBERS","Progress","Svara tendence, kustība un ieradumi. Ne tikai cipars uz svariem.")+
 '<div class="ap-progress-hero"><span>PAŠREIZĒJAIS SVARS</span><h2>'+(last?fmt(cur,1):'--')+' <small>KG</small></h2><p>Sākums '+(first?fmt(start,1):'--')+' kg · mērķis '+fmt(goal,1)+' kg</p><div><i style="width:'+pct+'%"></i></div><small>'+(last?(delta>=0?'Samazinājums ':'Pieaugums ')+fmt(Math.abs(delta),1)+' kg':'Pievieno pirmo svaru')+'</small></div>'+
 activeWeeklyStats()+activeSection("WEIGHT CURVE","Tendence")+'<div class="ap-chart-card">'+activeChart()+'</div>'+
 activeSection("LOG YOUR WEIGHT","Pierakstīt svaru")+'<form id="weight-form" class="ap-weight-form"><label>Datums<input name="date" type="date" value="'+fitToday()+'" max="'+fitToday()+'" required></label><label>Svars (kg)<input name="weight" type="text" inputmode="text" placeholder="99,5" required></label><button type="submit">SAGLABĀT SVARU ↗</button></form>'+
 '<details class="ap-details"><summary>Svēršanās vēsture ('+entries.length+')</summary>'+entries.slice().reverse().slice(0,40).map(x=>'<div class="weight-record"><b>'+fmt(x.weight,1)+' kg</b><small>'+x.date+'</small><button data-action="delete-weight" data-date="'+x.date+'">Dzēst</button></div>').join('')+'</details>'+
 '<details class="ap-details"><summary>Eksportēt vai importēt datus</summary><div><button class="btn small" data-action="export">Eksportēt</button><label class="btn small" for="import-data">Importēt</label><input type="file" id="import-data" accept="application/json,.json" hidden></div><p>Dati glabājas šajā ierīcē. Pirms telefona maiņas eksportē datu kopiju.</p></details></div>';
};
function activeOpenVideo(id){
 const m=ACTIVE_VIDEOS[id];if(!m)return;
 const modal=document.getElementById('modal');if(!modal)return;
 const youtube="https://www.youtube.com/watch?v="+m.id;
 modal.hidden=false;
 modal.innerHTML='<div class="ap-video-modal" role="dialog" aria-modal="true" aria-label="'+safe(m.title)+'"><div class="ap-video-title"><div><span>VIDEO DEMONSTRĀCIJA</span><h3>'+safe(m.title)+'</h3><small>'+safe(m.source)+'</small></div><button type="button" data-ap-close aria-label="Aizvērt video">×</button></div><div class="ap-video-box"><iframe title="'+safe(m.title)+'" src="https://www.youtube-nocookie.com/embed/'+m.id+'?playsinline=1&rel=0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe></div><a href="'+youtube+'" target="_blank" rel="noopener noreferrer">Ja video neatveras, skatīties YouTube ↗</a></div>';
 document.body.style.overflow='hidden';
}
document.addEventListener('click',event=>{
 const btn=event.target.closest('[data-ap-choice],[data-ap-open],[data-ap-video],[data-ap-check],[data-ap-finish],[data-ap-close]');if(!btn)return;
 if(btn.dataset.apChoice){const date=btn.dataset.date;state.sportChoices??={};state.sportChoices[date]=btn.dataset.apChoice;save();render();return}
 if(btn.dataset.apOpen){window.fitOpenRoutine=btn.dataset.apOpen;go('fitroutine');return}
 if(btn.dataset.apVideo){activeOpenVideo(btn.dataset.apVideo);return}
 if(btn.hasAttribute('data-ap-close')){closeModal();return}
 if(btn.dataset.apCheck){const k=fitToday()+"|"+btn.dataset.apRoutine+"|"+btn.dataset.apCheck;state.exerciseChecks??={};if(state.exerciseChecks[k])delete state.exerciseChecks[k];else state.exerciseChecks[k]=true;save();render();return}
 if(btn.dataset.apFinish){const k=fitToday()+"|"+btn.dataset.apFinish;state.homeSessions??={};if(state.homeSessions[k])delete state.homeSessions[k];else state.homeSessions[k]=true;save();render();}
});
render();
