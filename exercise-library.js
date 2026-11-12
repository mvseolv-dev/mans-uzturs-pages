/* MANS UZTURS ACTIVE - Workout Studio
 * Runs after exercise-data.js, active-v2.js and planner.js.
 * User selections are saved in existing per-profile local storage.
 */
let lbTab="library",lbLevel="all",lbGroup="Visi",lbSearch="",lbFavOnly=false,lbRecentOnly=false,lbFocusId=null,lbProgramFavOnly=false,lbEquipment="all",lbVisible=24;
let lbTarget=25,lbBuildLevel="medium",lbBuildFocus="basket",lbWorkDate=fitToday();
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
function lbResetFinished(day){day.completed=false;day.checked=[];if(state.homeSessions)delete state.homeSessions[lbWorkDate+'|custom'];}
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
function lbTabs(){const items=[["library","Vingrinājumi"],["programs","Programmas"],["mine","Mans treniņš"]];return '<div class="lb-tabs" role="group" aria-label="Treniņu sadaļas">'+items.map(([v,l])=>'<button type="button" data-lb="tab" data-value="'+v+'" aria-pressed="'+(lbTab===v)+'" class="'+(lbTab===v?'current':'')+'">'+l+(v==='mine'?'<span>'+lbDay().ids.length+'</span>':'')+'</button>').join('')+'</div>'}
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
 return '<div class="lb-custom-top"><div><span>IZVĒLĒTĀ DIENA</span><h2>Mans treniņš</h2><p>'+ids.length+' vingrinājumi · '+lbTimeSummary(ids)+'</p></div><div class="lb-my-progress">'+done+'/'+ids.length+'</div></div><div class="lb-date-picker"><label for="lb-date">Treniņa datums</label><input id="lb-date" type="date" value="'+lbWorkDate+'"><button type="button" data-lb="today">Šodiena</button></div>';
}
function lbMyCard(id,index){
 const x=lbEntry(id);if(!x)return '';
 const checked=lbDay().checked.includes(id);
 return '<div class="lb-my-row"><img src="'+lbImage(id)+'" loading="lazy" alt="" width="512" height="512"><div class="lb-my-copy"><span>'+String(index+1).padStart(2,"0")+' · '+lbLevelName(x.level)+'</span><strong>'+safe(x.name)+'</strong><small>'+safe(x.sets)+' · '+lbDurationLabel(x)+'</small><button type="button" class="lb-my-technique" data-lb="view" data-id="'+id+'">Skatīt izpildi ↗</button></div><div class="lb-my-controls"><button data-lb="my-check" data-id="'+id+'" class="'+(checked?'done':'')+'" aria-label="Atzīmēt vingrinājumu">'+(checked?'✓':'○')+'</button><button data-lb="my-remove" data-id="'+id+'" aria-label="Izņemt vingrinājumu">×</button></div></div>';
}
function lbMyWorkout(){
 const workout=lbCheckWorkout(lbDay()),ids=workout.ids,total=ids.reduce((n,id)=>n+(lbEntry(id)?.minutes||0),0);
 return '<div class="lb-panel">'+lbSelectedDay()+
 '<div class="lb-builder"><div><h3>Saliec automātiski</h3><p>Izvēlies mērķi, grūtību un laiku. Varēsi pēc tam visu labot.</p></div>'+
 '<div class="lb-build-inputs"><label>Mērķis<select data-lb-select="focus"><option value="basket" '+(lbBuildFocus==='basket'?'selected':'')+'>Basketbolam</option><option value="strength" '+(lbBuildFocus==='strength'?'selected':'')+'>Spēks</option><option value="core" '+(lbBuildFocus==='core'?'selected':'')+'>Core</option><option value="recovery" '+(lbBuildFocus==='recovery'?'selected':'')+'>Atjaunošanās</option></select></label><label>Līmenis<select data-lb-select="build-level">'+[['easy','Viegli'],['medium','Vidēji'],['hard','Sarežģīti']].map(([k,v])=>'<option value="'+k+'" '+(lbBuildLevel===k?'selected':'')+'>'+v+'</option>').join('')+'</select></label></div>'+
 '<div class="lb-duration">'+[15,25,40].map(m=>'<button data-lb="duration" data-value="'+m+'" class="'+(lbTarget===m?'selected':'')+'">'+m+' min</button>').join('')+'</div><button class="lb-generate" data-lb="generate">✦ Salikt man treniņu</button></div>'+
 (ids.length?'<div class="lb-current-list">'+ids.map(lbMyCard).join('')+'</div>'+
 '<div class="lb-my-bottom"><div><span>KOPĀ</span><strong>'+ids.length+' vingrinājumi · '+lbTimeSummary(ids)+'</strong></div><button data-lb="complete" '+(lbWorkDate>fitToday()?'disabled':'')+' class="'+(workout.completed?'completed':'')+'">'+(lbWorkDate>fitToday()?'Ieplānots nākamajai dienai':workout.completed?'✓ Treniņš paveikts':'✓ Pabeigt treniņu')+'</button></div>'+
 '<button class="lb-clear-workout" data-lb="clear-workout">Notīrīt šodienas treniņu</button>':
 '<div class="lb-empty lb-my-empty"><span>＋</span><h3>Izvēlētās dienas treniņš ir tukšs</h3><p>Izvēlies vingrinājumus no bibliotēkas vai saliec programmu automātiski.</p><button data-lb="tab" data-value="library">Apskatīt vingrinājumus</button></div>')+
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
 return '<div class="ap-screen lb-page">'+(lbFocusId?lbExerciseDetail():lbHero()+lbReadiness()+lbTabs()+(lbTab==='library'?lbLibrary():lbTab==='programs'?lbPrograms():lbMyWorkout())+
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
function lbGenerate(){
 const wishlist={basket:["lateral","rdl","step-ups","reverse","sideplank","cossack-squat","planktap","jump-squat","plyo-lunge"],
 strength:["reverse","push","rdl","bulgarian","calf","sideplank","split-squat","single-leg-glute-bridge","bodyweight-squat"],
 core:["deadbug","planktap","sideplank","bear-plank-hold","hollow-body-hold","bird-dog","plank","copenhagen-plank"],
 recovery:["ankle","hips","deadbug","bird-dog","cat-cow","thread-the-needle","heel-to-toe-walk","glute-bridge"]};
 let ids=wishlist[lbBuildFocus]||wishlist.basket;
 if(lbBuildLevel==="easy")ids=[...ids.filter(id=>lbEntry(id)?.level==="easy"),...WORKOUT_LIBRARY.filter(x=>REPDB_LOCAL_IDS.has(x.id)&&x.level==="easy").map(x=>x.id)];
 if(lbBuildLevel==="medium"&&lbBuildFocus!=="recovery")ids=[...ids.filter(id=>lbEntry(id)?.level!=="hard"),...WORKOUT_LIBRARY.filter(x=>REPDB_LOCAL_IDS.has(x.id)&&x.level==="medium").map(x=>x.id)];
 if(lbBuildLevel==="hard"&&lbBuildFocus!=="recovery")ids=[...ids.filter(id=>lbEntry(id)?.level==="hard"),...WORKOUT_LIBRARY.filter(x=>REPDB_LOCAL_IDS.has(x.id)&&x.level==="hard").map(x=>x.id),...ids.filter(id=>lbEntry(id)?.level!=="hard")];
 ids=[...new Set(ids)].filter(id=>!!lbEntry(id));
 const workout=[],cap=lbTarget>=40?8:lbTarget>=25?6:4;let duration=0;
 for(const id of ids){if(workout.length>=cap||duration>=lbTarget)break;workout.push(id);duration+=lbEntry(id).minutes}
 const day=lbDay();day.ids=workout;lbResetFinished(day);lbSave();render();toast('Šodienas treniņš sagatavots.');
}
document.addEventListener('click',event=>{
 const target=event.target.closest('[data-lb]');if(!target)return;
 const act=target.dataset.lb,id=target.dataset.id;
 if(act==="program-fav-filter"){lbProgramFavOnly=!lbProgramFavOnly;render();return}
 if(act==="program-favorite"){if(!WORKOUT_PRESETS.some(p=>p.id===id))return;state.programFavorites=Array.isArray(state.programFavorites)?state.programFavorites:[];const i=state.programFavorites.indexOf(id);if(i>=0)state.programFavorites.splice(i,1);else state.programFavorites.push(id);save();render();return}
 if(act==="more"){lbVisible+=24;render();return}
 if(["level","group","fav-filter","recent-filter","clear"].includes(act))lbVisible=24;
 if(act==="tab"){lbTab=target.dataset.value;lbFocusId=null;render();return}
 if(act==="today"){lbWorkDate=fitToday();render();return}
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
 if(act==="quick"){window.fitOpenRoutine=target.dataset.value;go("fitroutine");return}
 if(act==="duration"){lbTarget=Number(target.dataset.value);render();return}
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
 if(event.target?.id!=="lb-search")return;
 lbSearch=event.target.value;lbVisible=24;
 const list=document.getElementById("lb-list"),count=document.getElementById("lb-count");
 if(list)list.innerHTML=lbListContent();
 if(count)count.textContent=lbFiltered().length+" rezultāti";
});
document.addEventListener('change',event=>{
 if(event.target?.id==='lb-date'){const date=event.target.value;if(/^\d{4}-\d{2}-\d{2}$/.test(date)){lbWorkDate=date;render()}return}
 const key=event.target?.dataset?.lbSelect;
 if(key==='equipment'){lbEquipment=event.target.value;lbVisible=24;render();return}
 if(key==='focus'){lbBuildFocus=event.target.value;render()}
 if(key==='build-level'){lbBuildLevel=event.target.value;render()}
});
render();
