/* MANS UZTURS ACTIVE - Workout Studio
 * Runs after exercise-data.js, active-v2.js and planner.js.
 * User selections are saved in existing per-profile local storage.
 */
let lbTab="mine",lbLevel="all",lbGroup="Visi",lbSearch="",lbFavOnly=false,lbRecentOnly=false,lbFocusId=null,lbProgramFavOnly=false,lbEquipment="all",lbVisible=24;
let lbTarget=25,lbBuildLevel="medium",lbBuildFocus="full",lbWorkDate=fitToday(),lbBuildEquipment="none",lbBuilderProfile=null;
const LB_GROUPS=["Visi","Basketbolam","Kājas","Augšdaļa","Core","Mobilitāte","Pilns ķermenis","Stabilitāte","Kondīcija","Mugura","Pleci","Rokas","Krūtis"];
const LB_LEVELS=[["all","Visi"],["easy","Viegli"],["medium","Vidēji"],["hard","Sarežģīti"]];
const LB_LOOKUP=Object.fromEntries(WORKOUT_LIBRARY.map(x=>[x.id,x]));
function lbEntry(id){return LB_LOOKUP[id]||null}
function lbImage(id,pose){const parts=WORKOUT_MEDIA[id]||["main"];if(REPDB_IMAGES[id])return REPDB_IMAGE_ROOT+REPDB_IMAGES[id][pose||parts[0]];return './assets/exercises/'+id+'-'+(pose||parts[0])+'.webp'}
function lbFaves(){return Array.isArray(state.exerciseFavorites)?state.exerciseFavorites:[]}
function lbRecent(){return Array.isArray(state.exerciseHistory)?state.exerciseHistory:[]}
function lbDay(date=lbWorkDate){state.customDayWorkouts??={};return state.customDayWorkouts[date]||(state.customDayWorkouts[date]={ids:[],checked:[],completed:false})}
function lbCheckWorkout(obj){if(!Array.isArray(obj.ids))obj.ids=[];if(!Array.isArray(obj.checked))obj.checked=[];obj.ids=obj.ids.filter(id=>!!lbEntry(id));obj.checked=obj.checked.filter(id=>obj.ids.includes(id));return obj}
function lbSave(){save()}
function lbResetFinished(day){day.completed=false;day.checked=[];delete day.plan;if(state.homeSessions)delete state.homeSessions[lbWorkDate+'|custom'];}
function lbSelected(id){return lbCheckWorkout(lbDay()).ids.includes(id)}
function lbToggleSelected(id){
 if(!lbEntry(id))return;
 const d=lbCheckWorkout(lbDay()),i=d.ids.indexOf(id);if(i>=0)d.ids.splice(i,1);else if(d.ids.length<15)d.ids.push(id);
 else{toast('Vienā treniņā atļauti līdz 15 vingrinājumiem.');return}
 lbResetFinished(d);lbSave();render();
}
function lbToggleFav(id){
 if(!lbEntry(id))return;
 state.exerciseFavorites??=[];const k=state.exerciseFavorites.indexOf(id);
 if(k>=0)state.exerciseFavorites.splice(k,1);else state.exerciseFavorites.push(id);
 lbSave();render();
}
function lbLevelName(level){return ({easy:"VIEGLI",medium:"VIDĒJI",hard:"SAREŽĢĪTI"})[level]||""}
function lbDifficulty(id){const e=lbEntry(id);return e?lbLevelName(e.level):""}
function lbNormalize(x){return String(x||"").normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("lv-LV")}
function lbFiltered(){
 let arr=WORKOUT_LIBRARY;
 if(lbEquipment!=="all")arr=arr.filter(x=>x.equipment===lbEquipment);
 if(lbLevel!=="all")arr=arr.filter(x=>x.level===lbLevel);
 if(lbGroup!=="Visi")arr=arr.filter(x=>x.group===lbGroup||x.tags.includes(lbGroup));
 if(lbFavOnly)arr=arr.filter(x=>lbFaves().includes(x.id));
 if(lbRecentOnly)arr=arr.filter(x=>lbRecent().some(y=>y.id===x.id));
 const needle=lbNormalize(lbSearch.trim());
 if(needle)arr=arr.filter(x=>lbNormalize([x.name,x.sourceName,x.group,lbEquipmentName(x),...x.tags,x.guide].join(" ")).includes(needle));
 return arr;
}
function lbPoseImages(id,full=false){
 const x=lbEntry(id),poses=WORKOUT_MEDIA[id]||["main"];if(!x)return "";
 return '<div class="lb-pose-pair '+(poses.length===1?'single':'')+'">'+poses.map((pose,i)=>
 '<figure><img loading="lazy" decoding="async" src="'+lbImage(id,pose)+'" alt="'+safe(x.name)+' - '+(poses.length===1?'pozīcija':i?'beigu pozīcija':'sākuma pozīcija')+'" width="512" height="512"><figcaption>'+(poses.length===1?'POZĪCIJA':i?'02 · KUSTĪBA':'01 · SĀKUMS')+'</figcaption></figure>').join('')+'</div>';
}
function lbThumb(x){return '<div class="lb-thumb"><img loading="lazy" decoding="async" src="'+lbImage(x.id)+'" alt="'+safe(x.name)+' - pozīcijas ilustrācija" width="512" height="512"><span class="lb-thumb-tag '+x.level+'">'+lbLevelName(x.level)+'</span></div>'}
function lbActivityLabel(){const today=fitToday(),items=(typeof plannerSessions==='function'?plannerSessions():sportItems()).filter(s=>s.date===today&&fitPossible(s));return items.some(s=>/basket|spēle|buki/i.test((s.type||'')+' '+s.title))?'Pēc basketbola izvēlies mobilitāti':items.length?'Šodien jau ir ieplānota aktivitāte':'Šodien vari izvēlēties mājas treniņu'}
function lbHero(){
 const selected=lbDay().ids.length;
 return '<div class="lb-hero"><div><span class="lb-kicker">MANS UZTURS · WORKOUT STUDIO</span><h1>Tavs treniņš.<br><em>Tavi noteikumi.</em></h1><p>'+WORKOUT_LIBRARY.length+' vingrinājumi ar attēliem, gatavas programmas un savs treniņu komplekts.</p><div class="lb-hero-foot"><span>♥ '+lbFaves().length+' favorītos</span><span>✓ '+selected+' izvēlēti izvēlētajai dienai</span></div></div><div class="lb-hero-art"><img src="'+lbImage('reverse','peak')+'" alt="" loading="lazy"></div></div>'
}
function lbTabs(){const items=[["mine","Mans treniņš"],["programs","Programmas"],["library","Vingrinājumi"]];return '<div class="lb-tabs" role="group" aria-label="Treniņu sadaļas">'+items.map(([v,l])=>'<button type="button" data-lb="tab" data-value="'+v+'" aria-pressed="'+(lbTab===v)+'" class="'+(lbTab===v?'current':'')+'">'+l+(v==='mine'?'<span>'+lbDay().ids.length+'</span>':'')+'</button>').join('')+'</div>'}
function lbCard(x){
 const fav=lbFaves().includes(x.id),chosen=lbSelected(x.id);
 return '<article class="lb-ex-card">'+
 '<button type="button" class="lb-ex-open" data-lb="view" data-id="'+x.id+'">'+lbThumb(x)+'<span class="lb-ex-name">'+safe(x.name)+'</span><span class="lb-ex-meta">'+safe(x.group)+' · '+safe(lbEquipmentName(x))+' · '+lbDurationLabel(x)+'</span></button>'+
 '<div class="lb-ex-actions"><button type="button" class="lb-favorite '+(fav?'on':'')+'" data-lb="favorite" data-id="'+x.id+'" aria-label="'+(fav?'Izņemt no favorītiem':'Pievienot favorītiem')+'">'+(fav?'♥':'♡')+'</button><button type="button" class="lb-add '+(chosen?'chosen':'')+'" data-lb="add" data-id="'+x.id+'">'+(chosen?'✓ Izvēlēts':'+ Pievienot')+'</button></div></article>';
}
function lbListContent(){
 const list=lbFiltered();
 return list.length?'<div class="lb-grid">'+list.slice(0,lbVisible).map(lbCard).join('')+'</div>'+(list.length>lbVisible?'<button type="button" class="lb-generate" data-lb="more">Rādīt vēl ('+Math.min(24,list.length-lbVisible)+')</button>':''):'<div class="lb-empty"><span>◎</span><h3>Nekas nav atrasts</h3><p>Nomaini filtrus vai meklē citu vingrinājuma nosaukumu.</p><button data-lb="clear">Notīrīt filtrus</button></div>';
}
function lbLibrary(){
 const amounts={all:WORKOUT_LIBRARY.length,easy:WORKOUT_LIBRARY.filter(x=>x.level==="easy").length,medium:WORKOUT_LIBRARY.filter(x=>x.level==="medium").length,hard:WORKOUT_LIBRARY.filter(x=>x.level==="hard").length};
 return '<div class="lb-panel">'+
 '<div class="lb-head"><div><span>IZVĒLIES LĪMENI</span><h2>Vingrinājumu bibliotēka</h2></div><div class="lb-head-count">'+WORKOUT_LIBRARY.length+' VINGRINĀJUMI</div></div>'+
 '<div class="lb-levels">'+LB_LEVELS.map(([val,label])=>'<button type="button" data-lb="level" data-value="'+val+'" class="'+(lbLevel===val?'active':'')+'">'+label+' <small>'+amounts[val]+'</small></button>').join('')+'</div>'+
 '<label class="lb-equipment">Inventārs<select data-lb-select="equipment" aria-label="Atlasīt inventāru"><option value="all">Viss inventārs</option>'+[...new Set(WORKOUT_LIBRARY.map(x=>x.equipment))].sort((a,b)=>lbEquipmentName({equipment:a}).localeCompare(lbEquipmentName({equipment:b}),'lv')).map(eq=>'<option value="'+eq+'" '+(lbEquipment===eq?'selected':'')+'>'+safe(lbEquipmentName({equipment:eq}))+' ('+WORKOUT_LIBRARY.filter(x=>x.equipment===eq).length+')</option>').join('')+'</select></label><p class="lb-safety">Papildinājumu instrukcijas ir angļu valodā. Nepieciešamais inventārs norādīts pie vingrinājuma.</p>'+
 '<div class="lb-input-wrap"><span>⌕</span><input id="lb-search" type="search" autocomplete="off" placeholder="Meklē vingrinājumu..." value="'+safe(lbSearch)+'" aria-label="Meklēt vingrinājumu"></div>'+
 '<div class="lb-categories">'+LB_GROUPS.map(group=>'<button type="button" class="'+(lbGroup===group?'active':'')+'" data-lb="group" data-value="'+group+'">'+group+'</button>').join('')+'</div>'+
 '<div class="lb-subfilters"><button type="button" class="'+(lbFavOnly?'active':'')+'" data-lb="fav-filter">♥ Favorīti</button><button type="button" class="'+(lbRecentOnly?'active':'')+'" data-lb="recent-filter">↺ Nesen izmantotie</button><span id="lb-count">'+lbFiltered().length+' rezultāti</span></div>'+
 '<div id="lb-list">'+lbListContent()+'</div></div>';
}
function lbProgramFavoriteButton(id){
 const fav=Array.isArray(state.programFavorites)&&state.programFavorites.includes(id);
 return '<button type="button" class="lb-detail-fav" data-lb="program-favorite" data-id="'+id+'" aria-pressed="'+fav+'">'+(fav?'♥ Programma favorītos':'♡ Pievienot programmu favorītiem')+'</button>';
}
function lbProgramCard(p){
 const x=lbEntry(p.moves[0]),level=p.level,done=!!state.homeSessions?.[fitToday()+'|'+p.id];
 return '<article class="lb-program-card"><div class="lb-program-img"><img src="'+lbImage(x?.id||'reverse')+'" alt="" loading="lazy" width="512" height="512"><span>'+p.label+'</span></div><div class="lb-program-body"><div class="lb-program-top"><span>'+p.minutes+' MIN · '+p.moves.length+' VINGRINĀJUMI</span>'+ (done?'<span class="lb-pdone">✓ PAVEIKTS</span>':'')+'</div><h3>'+safe(p.title)+'</h3>'+lbProgramFavoriteButton(p.id)+'<p>'+safe(p.summary)+'</p><button type="button" data-lb="program" data-id="'+p.id+'">Atvērt programmu <span>↗</span></button></div></article>';
}
function lbPrograms(){
 return '<div class="lb-panel">'+
 '<div class="lb-head"><div><span>GATAVAS SESIJAS</span><h2>Izvēlies treniņa veidu</h2></div><div class="lb-head-count">6 PROGRAMMAS</div></div>'+
 '<div class="lb-subfilters"><button type="button" data-lb="program-fav-filter" aria-pressed="'+lbProgramFavOnly+'" class="'+(lbProgramFavOnly?'active':'')+'">♥ Programmu favorīti</button></div>'+
 '<div class="lb-program-grid">'+WORKOUT_PRESETS.filter(p=>!lbProgramFavOnly||(state.programFavorites||[]).includes(p.id)).map(lbProgramCard).join('')+'</div>'+
 (lbProgramFavOnly&&!WORKOUT_PRESETS.some(p=>(state.programFavorites||[]).includes(p.id))?'<p>Vēl nav saglabātu programmu. Pievieno programmu ar sirsniņu.</p>':'')+
 '<p class="lb-safety">Pēc intensīva basketbola vai pirms spēles izvēlies atjaunošanos. Lēcienu programmu veic tikai svaigā stāvoklī, bez sāpēm un ar pietiekamu atpūtu.</p></div>';
}
function lbSelectedDay(){
 const ids=lbCheckWorkout(lbDay()).ids,done=lbDay().checked.length,total=ids.reduce((n,id)=>n+(lbEntry(id)?.minutes||0),0);
 return '<div class="lb-custom-top"><div><span>IZVĒLĒTĀ DIENA</span><h2>Mans treniņš</h2><p>'+ids.length+' vingrinājumi · '+lbWorkoutDuration()+'</p></div><div class="lb-my-progress">'+done+'/'+ids.length+'</div></div><div class="lb-date-picker"><label for="lb-date">Treniņa datums</label><input id="lb-date" type="date" value="'+lbWorkDate+'"><button type="button" data-lb="today">Šodiena</button></div>';
}
function lbMyCard(id,index){
 const x=lbEntry(id);if(!x)return '';
 const checked=lbDay().checked.includes(id);
 return '<div class="lb-my-row"><img src="'+lbImage(id)+'" loading="lazy" alt="" width="512" height="512"><div class="lb-my-copy"><span>'+String(index+1).padStart(2,"0")+' · '+lbLevelName(x.level)+'</span><strong>'+safe(x.name)+'</strong><small>'+(lbDay().plan?lbDay().plan.rounds+' apļi · '+lbDay().plan.workSeconds+' s darbs / '+lbDay().plan.restSeconds+' s atpūta':safe(x.sets)+' · '+lbDurationLabel(x))+'</small><button type="button" class="lb-my-technique" data-lb="view" data-id="'+id+'">Skatīt izpildi ↗</button></div><div class="lb-my-controls"><button data-lb="my-check" data-id="'+id+'" class="'+(checked?'done':'')+'" aria-label="Atzīmēt vingrinājumu">'+(checked?'✓':'○')+'</button><button data-lb="my-remove" data-id="'+id+'" aria-label="Izņemt vingrinājumu">×</button></div></div>';
}
function lbMyWorkout(){
 const workout=lbCheckWorkout(lbDay()),ids=workout.ids,total=ids.reduce((n,id)=>n+(lbEntry(id)?.minutes||0),0);
 return '<div class="lb-panel">'+lbSelectedDay()+
 lbBuilderUI(workout)+lbPlanSummary(workout)+
 (ids.length?'<div class="lb-current-list">'+ids.map(lbMyCard).join('')+'</div>'+
 '<div class="lb-my-bottom"><div><span>KOPĀ</span><strong>'+ids.length+' vingrinājumi · '+lbWorkoutDuration()+'</strong></div><button data-lb="complete" '+(lbWorkDate>fitToday()?'disabled':'')+' class="'+(workout.completed?'completed':'')+'">'+(lbWorkDate>fitToday()?'Ieplānots nākamajai dienai':workout.completed?'✓ Treniņš paveikts':'✓ Pabeigt treniņu')+'</button></div>'+
 '<button class="lb-clear-workout" data-lb="clear-workout">Notīrīt izvēlētās dienas treniņu</button>':
 '')+
 '<p class="lb-safety">Tava izvēle saglabājas šajā ierīcē. Smagākas sesijas neplāno tieši pirms basketbola spēles.</p></div>';
}
function lbExerciseDetail(){
 const x=lbEntry(lbFocusId);if(!x){lbFocusId=null;return lbLibrary()}
 const fav=lbFaves().includes(x.id),selected=lbSelected(x.id);
 const video=ACTIVE_VIDEOS[x.id];
 return '<div class="lb-panel lb-detail"><button class="lb-back" data-lb="back">‹ Atpakaļ uz vingrinājumiem</button>'+
 '<div class="lb-detail-head"><span>'+lbLevelName(x.level)+' · '+safe(x.group)+'</span><h1>'+safe(x.name)+'</h1><p>'+lbDurationLabel(x)+' · '+safe(x.sets)+'</p></div>'+
 '<div class="lb-detail-photo">'+lbPoseImages(x.id,true)+'</div>'+
 '<div class="lb-detail-copy"><p><strong>Inventārs:</strong> '+safe(lbEquipmentName(x))+'</p><span>'+(x.catalog?'IZPILDE (ANGĻU VALODĀ)':'IZPILDE')+'</span><p>'+safe(x.guide)+'</p>'+(x.instructions?'<ol>'+x.instructions.map(step=>'<li>'+safe(step)+'</li>').join('')+'</ol>':'')+'<h3>Tehnikas atgādne</h3><ul>'+x.cues.map(c=>'<li>✓ '+safe(c)+'</li>').join('')+'</ul></div>'+
 (x.level==='hard'?'<div class="lb-hard-warning"><strong>Paaugstināta slodze.</strong> Šo vingrinājumu izvēlies tikai tad, ja tam ir pietiekama spēka un kustību kontroles bāze. Neveic līdz spēku izsīkumam vai pirms spēles.</div>':'')+
 '<div class="lb-detail-buttons"><button class="lb-detail-add '+(selected?'selected':'')+'" data-lb="add" data-id="'+x.id+'">'+(selected?'✓ Izņemt no izvēlētās dienas':'＋ Pievienot izvēlētajai dienai')+'</button><button class="lb-detail-fav" data-lb="favorite" data-id="'+x.id+'">'+(fav?'♥ Favorītos':'♡ Pievienot favorītiem')+'</button>'+(video?'<button data-ap-video="'+x.id+'" class="lb-detail-video">▶ Video demonstrācija</button>':'')+'</div></div>';
}
function lbReadiness(){
 return '<div class="lb-tips"><div><span>ĀTRĀ IZVĒLE</span><h2>Ko gribi darīt šodien?</h2></div><div class="lb-choice-row"><button data-lb="quick" data-value="recovery"><span>◌</span><strong>Viegli pēc spēles</strong><small>Mobilitāte un atjaunošanās</small></button><button data-lb="quick" data-value="strength"><span>↗</span><strong>Normāli pastrādāt</strong><small>Spēks un kontrole</small></button><button data-lb="quick" data-value="movement"><span>⬡</span><strong>Basketbola forma</strong><small>Sānu kustības un stabilitāte</small></button></div></div>';
}
renderFitnessHome=function(){
 if(activeProfile!=='maris')return renderDay();
 lbSyncBuilder();
 return '<div class="ap-screen lb-page">'+(lbFocusId?lbExerciseDetail():(lbTab==='mine'?'<header class="lb-simple-heading"><span>PIELĀGOTS TEV</span><h1>Tavs treniņš</h1></header>':lbHero()+lbReadiness())+lbTabs()+(lbTab==='library'?lbLibrary():lbTab==='programs'?lbPrograms():lbMyWorkout())+
 '<div class="lb-attribution">Vingrinājumu attēli: <a href="https://repdb.co" target="_blank" rel="noopener noreferrer">Exercise data by RepDB (repdb.co)</a>. Attēli ir ilustratīvi. Pie sāpēm pārtrauc vingrinājumu.</div>')+'</div>';
};
function lbProgramGallery(id){const x=lbEntry(id);if(!x)return '';
 return '<div class="ap-ex-visual"><div class="ap-ex-visual-kicker">VINGRINĀJUMS ATTĒLOS</div>'+lbPoseImages(id,true)+'</div>';
}
activeImg=function(id){return lbImage(id)};
activeExercise=function(id,routine,index){
 const x=lbEntry(id);if(!x)return '';
 const done=!!state.exerciseChecks?.[fitToday()+'|'+routine+'|'+id],hasVideo=!!ACTIVE_VIDEOS[id];
 return '<article class="ap-exercise ap-exercise-visual">'+lbProgramGallery(id)+
 '<div class="ap-ex-info"><span>'+x.sets+' · '+lbLevelName(x.level)+'</span><h3>'+safe(x.name)+'</h3><div class="ap-ex-instruction-label">KĀ IZPILDĪT</div><p>'+safe(x.guide)+'</p><ul>'+x.cues.map(t=>'<li>✓ '+safe(t)+'</li>').join('')+'</ul>'+
 '<div class="ap-ex-actions">'+(hasVideo?'<button data-ap-video="'+id+'">▶ VIDEO</button>':'')+
 '<button type="button" class="lb-detail-fav" data-lb="favorite" data-id="'+id+'" aria-pressed="'+lbFaves().includes(id)+'">'+(lbFaves().includes(id)?'♥ Favorītos':'♡ Favorītiem')+'</button>'+
 '<button class="'+(done?'done':'')+'" data-ap-check="'+id+'" data-ap-routine="'+routine+'">'+(done?'✓ PAVEIKTS':'○ ATZĪMĒT')+'</button></div></div></article>';
};
ACTIVE_PROGRAMS.splice(0,ACTIVE_PROGRAMS.length,...WORKOUT_PRESETS);
// Curated movements with known equipment and technique; the full catalog remains browsable.
const LB_AUTO_POOL=[
 ['bodyweight-squat','squat'],['split-squat','lunge'],['reverse','lunge'],['lateral','lunge'],['rdl','hinge'],['glute-bridge','hinge'],['single-leg-glute-bridge','hinge'],['bodyweight-good-morning','hinge'],
 ['wall-push-ups','push'],['knee-push-ups','push'],['push','push'],['pike-push-ups','push'],['archer-push-ups','push'],
 ['deadbug','core'],['dead-bug-hold','core'],['high-plank','core'],['bird-dog','core'],['sideplank','core'],['plank','core'],['bear-plank-hold','core'],['planktap','core'],['hollow-body-hold','core'],['side-plank-leg-lift','core'],
 ['calf','balance'],['single-leg-calf-raise','balance'],['heel-to-toe-walk','balance'],['supported-single-leg-stand','balance'],
 ['ankle','mobility'],['hips','mobility'],['cat-cow','mobility'],['thread-the-needle','mobility'],['90-90-switch','mobility'],['childs-pose','mobility'],
 ['step-ups','lunge',true],['bulgarian','lunge',true],['single-leg-box-squat','squat',true],['copenhagen-plank','core',true],
 ['db-goblet-squat','squat'],['dumbbell-romanian-deadlift','hinge'],['bent-over-db-row','pull'],['dumbbell-floor-press','push'],['dumbbell-shoulder-press','push'],['dumbbell-split-squat','lunge'],['hammer-curl','pull'],
 ['banded-squat','squat'],['banded-glute-bridge','hinge'],['banded-clamshell','hinge'],['banded-fire-hydrant','hinge'],['banded-lateral-walk','balance'],['banded-good-morning','hinge']
];
const LB_BUILD_EQUIPMENT=[['none','Bez inventāra'],['support','Stabils sols / paaugstinājums'],['dumbbell','Hanteles + paša svars'],['loop_band','Gumijas cilpa + paša svars']];
function lbSyncBuilder(){if(lbBuilderProfile===activeProfile)return;lbBuilderProfile=activeProfile;const o=state.workoutBuilder||{};lbTarget=[10,15,20,25,30,35,40,45,50,55,60].includes(o.minutes)?o.minutes:25;lbBuildLevel=['easy','medium','hard'].includes(o.level)?o.level:'medium';lbBuildFocus=['full','basket','strength','core','recovery'].includes(o.focus)?o.focus:'full';lbBuildEquipment=LB_BUILD_EQUIPMENT.some(x=>x[0]===o.equipment)?o.equipment:'none';}
function lbRememberBuilder(){state.workoutBuilder={minutes:lbTarget,level:lbBuildLevel,focus:lbBuildFocus,equipment:lbBuildEquipment};save();}
function lbWorkoutDuration(){return lbDay().plan?lbDay().plan.minutes+' min plānā':lbTimeSummary(lbDay().ids);}
function lbBuilderUI(workout){return '<section class="lb-builder lb-auto"><div class="lb-auto-heading"><span>TAVS LAIKS. TAVA SLODZE.</span><h3>Saliec man treniņu</h3></div><div class="lb-auto-time"><label for="lb-build-time">Treniņa ilgums</label><output id="lb-duration-value" for="lb-build-time">'+lbTarget+' <small>min</small></output></div><input id="lb-build-time" type="range" min="10" max="60" step="5" value="'+lbTarget+'" aria-label="Treniņa ilgums minūtēs"><div class="lb-duration">'+[10,20,30,45,60].map(m=>'<button type="button" data-lb="duration" data-value="'+m+'" aria-pressed="'+(lbTarget===m)+'" class="'+(lbTarget===m?'selected':'')+'">'+m+' min</button>').join('')+'</div><span class="lb-auto-label">GRŪTĪBA</span><div class="lb-auto-levels" role="group" aria-label="Treniņa grūtība">'+[['easy','Viegli','Mierīgs temps'],['medium','Vidēji','Līdzsvarota slodze'],['hard','Grūti','Vairāk darba, īsāka atpūta']].map(([v,l,n])=>'<button type="button" data-lb="build-level" data-value="'+v+'" class="'+(lbBuildLevel===v?'selected':'')+'" aria-pressed="'+(lbBuildLevel===v)+'" '+(lbBuildFocus==='recovery'&&v!=='easy'?'disabled':'')+'><strong>'+l+'</strong><small>'+n+'</small></button>').join('')+'</div><div class="lb-build-inputs"><label>Mērķis<select data-lb-select="focus">'+[['full','Pilns ķermenis'],['basket','Basketbolam'],['strength','Spēks'],['core','Korpusa stabilitāte'],['recovery','Mobilitāte / atjaunošanās']].map(([v,l])=>'<option value="'+v+'" '+(lbBuildFocus===v?'selected':'')+'>'+l+'</option>').join('')+'</select></label><label>Pieejamais inventārs<select data-lb-select="build-equipment">'+LB_BUILD_EQUIPMENT.map(([v,l])=>'<option value="'+v+'" '+(lbBuildEquipment===v?'selected':'')+'>'+l+'</option>').join('')+'</select></label></div><button type="button" class="lb-generate" data-lb="generate">'+(workout.ids.length?'↻ Sagatavot citu variantu':'✦ Atlasīt vingrinājumus')+'</button>'+(workout.ids.length?'<p class="lb-auto-note">Aizstās izvēlētās dienas komplektu.</p>':'')+'</section>';}
function lbClock(seconds){return Math.floor(seconds/60)+' min'+(seconds%60?' '+seconds%60+' s':'');}
function lbPlanSummary(workout){const p=workout.plan;if(!p)return '';return '<section class="lb-plan-summary"><div><span>TAVS SAGATAVOTAIS PLĀNS</span><strong>'+p.minutes+' min <small>· '+({easy:'viegli',medium:'vidēji',hard:'grūti'})[p.level]+'</small></strong></div><div class="lb-plan-badges"><span>'+p.rounds+' apļi</span><span>'+p.workSeconds+' s darbs</span><span>'+p.restSeconds+' s atpūta</span></div><p>2 min iesildīšanās · '+p.roundRestSeconds+' s starp apļiem · '+lbClock(p.cooldownSeconds)+' atsildīšanās.</p><p>'+p.ids.length+' vingrinājumi norādītajā secībā katrā aplī. Vienpusējos vingrinājumos pusi darba laika katrai pusei. Strādā kontrolēti; ja vajag, pagarini atpūtu.</p><button type="button" class="lb-plan-build" data-lb="builder">Lietot šī plāna iestatījumus</button></section>';}
function lbGenerate(){
 const target=Math.max(10,Math.min(60,Math.round(Number(lbTarget)/5)*5||25));
 const level=lbBuildFocus==='recovery'?'easy':lbBuildLevel,rank={easy:0,medium:1,hard:2},focus=lbBuildFocus;
 let pool=LB_AUTO_POOL.map(([id,pattern,support])=>({x:lbEntry(id),pattern,support})).filter(o=>o.x&&(!o.support||lbBuildEquipment==='support')&&rank[o.x.level]<=rank[level]);
 pool=pool.filter(o=>{const eq=o.x.equipment||'bodyweight';return eq==='bodyweight'||(lbBuildEquipment==='support'&&eq==='plyo_box')||eq===lbBuildEquipment;});
 if(focus==='core')pool=pool.filter(o=>o.pattern==='core');
 else if(focus==='recovery')pool=pool.filter(o=>['mobility','balance'].includes(o.pattern));
 else pool=pool.filter(o=>o.pattern!=='mobility');
 const count=Math.min(pool.length,target<15?4:target<25?5:target<40?6:8);
 if(count<3){toast('Šai izvēlei nepietiek vingrinājumu. Maini inventāru vai mērķi.');return;}
 // Give favorites a slight preference, then vary each generated plan.
 pool=pool.map(o=>({...o,score:Math.random()+(lbFaves().includes(o.x.id)?.35:0)})).sort((a,b)=>b.score-a.score);
 const patterns=focus==='core'?['core']:focus==='recovery'?['mobility','balance']:focus==='basket'?['lunge','balance','hinge','core','squat','push','pull','core']:['squat','push','hinge','core','pull','lunge','balance','core'];
 const chosen=[];for(let i=0;i<count;i++){const candidates=pool.filter(o=>!chosen.some(c=>c.x.id===o.x.id));const desired=patterns[i%patterns.length];chosen.push(candidates.find(o=>o.pattern===desired)||candidates[0]);}
 if(level==='hard'&&!chosen.some(o=>o.x.level==='hard')){const hard=pool.find(o=>o.x.level==='hard'&&!chosen.some(c=>c.x.id===o.x.id));if(hard)chosen[chosen.length-1]=hard;}
 // Each slot includes work and transition/rest. The complete planned total matches the selected time.
 const rounds=Math.max(2,Math.round((target*60-180)/(count*60+60))),roundRestSeconds=60,slots=count*rounds;
 const available=target*60-240-(rounds-1)*roundRestSeconds,slotSeconds=Math.floor(available/slots/5)*5;
 const workSeconds=Math.max(15,Math.min(level==='easy'?35:level==='medium'?45:60,Math.floor(slotSeconds*({easy:.5,medium:.65,hard:.75})[level]/5)*5)),restSeconds=slotSeconds-workSeconds;
 const day=lbDay();day.ids=chosen.map(o=>o.x.id);lbResetFinished(day);
 day.plan={minutes:target,level,focus,equipment:lbBuildEquipment,rounds,workSeconds,restSeconds,roundRestSeconds,warmupSeconds:120,cooldownSeconds:120+(available-slotSeconds*slots),ids:[...day.ids]};
 lbTarget=target;lbBuildLevel=level;lbRememberBuilder();lbTab='mine';lbFocusId=null;lbSave();render();toast('Tavs '+target+' minūšu treniņš ir gatavs.');
}
document.addEventListener('click',event=>{
 const target=event.target.closest('[data-lb]');if(!target)return;
 const act=target.dataset.lb,id=target.dataset.id;
 if(act==="program-fav-filter"){lbProgramFavOnly=!lbProgramFavOnly;render();return}
 if(act==="program-favorite"){if(!WORKOUT_PRESETS.some(p=>p.id===id))return;state.programFavorites=Array.isArray(state.programFavorites)?state.programFavorites:[];const i=state.programFavorites.indexOf(id);if(i>=0)state.programFavorites.splice(i,1);else state.programFavorites.push(id);save();render();return}
 if(act==="more"){lbVisible+=24;render();return}
 if(["level","group","fav-filter","recent-filter","clear"].includes(act))lbVisible=24;
 if(act==="tab"){lbTab=target.dataset.value;lbFocusId=null;render();return}
 if(act==="today"){lbWorkDate=fitToday(),lbBuildEquipment="none",lbBuilderProfile=null;render();return}
 if(act==="level"){lbLevel=target.dataset.value;render();return}
 if(act==="group"){lbGroup=target.dataset.value;render();return}
 if(act==="fav-filter"){lbFavOnly=!lbFavOnly;render();return}
 if(act==="recent-filter"){lbRecentOnly=!lbRecentOnly;render();return}
 if(act==="clear"){lbLevel='all';lbGroup='Visi';lbFavOnly=false;lbRecentOnly=false;lbSearch="";lbEquipment="all";render();return}
 if(act==="view"){lbFocusId=id;render();window.scrollTo?.({top:0,behavior:'smooth'});return}
 if(act==="back"){lbFocusId=null;render();return}
 if(act==="favorite"){lbToggleFav(id);return}
 if(act==="add"){lbToggleSelected(id);return}
 if(act==="program"){window.fitOpenRoutine=id;go("fitroutine");return}
 if(act==="quick"){lbTab="mine";lbBuildFocus=target.dataset.value==='movement'?'basket':target.dataset.value;lbBuildLevel=lbBuildFocus==='recovery'?'easy':'medium';lbRememberBuilder();render();return}
 if(act==="duration"){lbTarget=Number(target.dataset.value);lbRememberBuilder();render();return}
 if(act==="build-level"){if(lbBuildFocus==='recovery')return;lbBuildLevel=target.dataset.value;lbRememberBuilder();render();return}
 if(act==="builder"){const p=lbDay().plan;if(p){lbTarget=p.minutes;lbBuildLevel=p.level;lbBuildFocus=p.focus;lbBuildEquipment=p.equipment;lbRememberBuilder();render();}return}
 if(act==="generate"){lbGenerate();return}
 if(act==="my-remove"){lbToggleSelected(id);return}
 if(act==="my-check"){const d=lbDay(),k=d.checked.indexOf(id);if(k>=0)d.checked.splice(k,1);else d.checked.push(id);d.completed=false;if(state.homeSessions)delete state.homeSessions[lbWorkDate+'|custom'];lbSave();render();return}
 if(act==="complete"){if(lbWorkDate>fitToday()){toast('Nākotnes treniņu vēl nevar atzīmēt kā paveiktu.');return}const d=lbDay();if(!d.ids.length)return;d.completed=!d.completed;
  state.homeSessions??={};if(d.completed){state.homeSessions[lbWorkDate+'|custom']=true;d.checked=[...d.ids];
  state.exerciseHistory??=[];for(const key of d.ids){state.exerciseHistory=state.exerciseHistory.filter(x=>x.id!==key);state.exerciseHistory.unshift({id:key,date:lbWorkDate})}
  state.exerciseHistory=state.exerciseHistory.slice(0,60);
  }else{delete state.homeSessions[lbWorkDate+'|custom'];d.checked=[]}
  lbSave();render();toast(d.completed?'Treniņš paveikts!':'Treniņa atzīme atcelta.');return}
 if(act==="clear-workout"){if(!confirm("Notīrīt izvēlētās dienas vingrinājumu izvēli?"))return;const d=lbDay();d.ids=[];lbResetFinished(d);lbSave();render();return}
});
document.addEventListener('input',event=>{
 if(event.target?.id==='lb-build-time'){lbTarget=Number(event.target.value);document.getElementById('lb-duration-value').innerHTML=lbTarget+' <small>min</small>';return}
 if(event.target?.id!=="lb-search")return;
 lbSearch=event.target.value;lbVisible=24;
 const list=document.getElementById("lb-list"),count=document.getElementById("lb-count");
 if(list)list.innerHTML=lbListContent();
 if(count)count.textContent=lbFiltered().length+" rezultāti";
});
document.addEventListener('change',event=>{
 if(event.target?.id==='lb-build-time'){lbTarget=Number(event.target.value);lbRememberBuilder();render();return}
 if(event.target?.id==='lb-date'){const date=event.target.value;if(/^\d{4}-\d{2}-\d{2}$/.test(date)){lbWorkDate=date;render()}return}
 const key=event.target?.dataset?.lbSelect;
 if(key==='equipment'){lbEquipment=event.target.value;lbVisible=24;render();return}
 if(key==='focus'){lbBuildFocus=event.target.value;if(lbBuildFocus==='recovery')lbBuildLevel='easy';lbRememberBuilder();render()}
 if(key==='build-level'){lbBuildLevel=event.target.value;lbRememberBuilder();render()}
 if(key==='build-equipment'){lbBuildEquipment=event.target.value;lbRememberBuilder();render()}
});
render();
