/* MANS UZTURS ACTIVE - Workout Studio
 * Runs after exercise-data.js, active-v2.js and planner.js.
 * User selections are saved in existing per-profile local storage.
 */
let lbTab="mine",lbLevel="all",lbGroup="Visi",lbSearch="",lbFavOnly=false,lbRecentOnly=false,lbFocusId=null,lbProgramFavOnly=false,lbEquipment="all",lbVisible=24;
let lbTarget=25,lbBuildLevel="medium",lbBuildFocus="full",lbWorkDate=fitToday(),lbBuildEquipment="none",lbBuilderProfile=null,lbBuildBalance=false;
const LB_GROUPS=["Visi","Basketbolam","Kājas","Augšdaļa","Korpuss","Mobilitāte","Pilns ķermenis","Stabilitāte","Kondīcija","Mugura","Pleci","Rokas","Krūtis"];
const LB_LEVELS=[["all","Visi"],["easy","Viegli"],["medium","Vidēji"],["hard","Sarežģīti"]];

// One kettlebell at a time: the available bells have different weights.
// Prescriptions are conservative starting examples, not a personalized load test.
const KB_WEIGHTS=[5,10,15];
const KB_MOVES={
 'goblet-squat':{name:'Goblet squat - pietupiens ar svaru pie krūtīm',kg:5,next:10,reps:'8-12',sec:40,pattern:'squat',steps:['Ar abām rokām satver vienu svarbumbu pie krūtīm, pēdas nedaudz platāk par gurniem.','Saliec gurnus un ceļus, nolaižoties kontrolēti, papēži paliek uz grīdas.','Spied ar visu pēdu un piecelies, neizliecot muguru.'],cues:['Ceļgali pēdu virzienā','Svars tuvu krūtīm','Tikai kontrolēts dziļums']},
 'kettlebell-deadlift':{name:'Deadlift - vilkme no grīdas',kg:10,next:15,reps:'8-12',sec:40,pattern:'hinge',steps:['Novieto vienu svarbumbu starp pēdām, pēdas gurnu platumā.','Virzi gurnus atpakaļ, viegli saliec ceļus un satver rokturi ar abām rokām.','Sasprindzini vēderu, iztaisno gurnus un ceļus, svaru turi tuvu ķermenim.','Virzi gurnus atpakaļ un kontrolēti noliec bumbu uz grīdas.'],cues:['Mugura neitrāla','Nerauj svaru no grīdas','Augšā neatliecies']},
 'one-arm-kettlebell-row':{name:'One-arm row - vilkšana ar vienu roku',kg:5,next:10,reps:'8-10 katrai rokai',sec:75,pattern:'pull',steps:['Ieņem stabilu izklupiena stāju, noliecies no gurniem. Brīvo roku atbalsti uz augšstilba vai stabila balsta.','Svarbumbas roka brīvi lejā, pleci un gurni vērsti pret grīdu.','Velc elkoni atpakaļ gar sāniem līdz bumba tuvu viduklim.','Lēni nolaid bumbu, pabeidz vienu pusi un maini roku.'],cues:['Negriez ķermeni','Nevelc plecu pie auss','Vienāds apjoms abām pusēm']},
 'one-arm-kettlebell-floor-press':{name:'Floor press - spiešana guļus ar vienu roku',kg:5,next:10,reps:'8-10 katrai rokai',sec:75,pattern:'push',steps:['Ar abām rokām droši nogādā svarbumbu pie krūtīm, apgulies uz grīdas, pēdas uz zemes.','Satver rokturi ar darba roku, plauksta taisna un elkonis ap 30-45 grādiem no ķermeņa.','Izspied svaru vertikāli, plecu saglabājot uz grīdas.','Lēni nolaid, līdz augšdelms viegli pieskaras grīdai. Maini roku, droši noliekot svaru.'],cues:['Plauksta stabila','Nesit elkoni pret grīdu','Svars netiek virzīts pāri sejai']},
 'one-arm-kettlebell-shoulder-press':{name:'Strict press - spiešana virs galvas',kg:5,next:10,reps:'6-8 katrai rokai',sec:65,pattern:'push',steps:['Ar abām rokām droši pacel vienu bumbu pie darba rokas pleca.','Pēdas stabili, vēders sasprindzināts, ribas neizvirzi uz priekšu.','Izspied svaru augšup bez kāju grūdiena tikai nesāpīgā amplitūdā.','Lēni nolaid pie pleca, pēc sērijas maini roku.'],cues:['Neizliec muguru','Bez grūdiena ar kājām','Ja 5 kg par smagu, izvēlies atspiešanos pret sienu']},
 'kettlebell-reverse-lunge':{name:'Reverse lunge - izklupiens atpakaļ',kg:5,next:10,reps:'6-8 katrai kājai',sec:75,pattern:'lunge',steps:['Turi vienu svarbumbu pie krūtīm ar abām rokām un nostājies stabili.','Sper soli atpakaļ, saliec abus ceļus, aizmugurējo virzot grīdas virzienā.','Spied priekšējo pēdu grīdā un atgriezies stāvus.','Atkārto abās pusēs, sākumā var izmēģināt bez svara.'],cues:['Priekšējā pēda stabili uz grīdas','Celis seko pēdas virzienam','Bez lēcieniem']},
 'kettlebell-kickstand-deadlift':{name:'Kickstand deadlift - vilkme ar kāju atbalstā',kg:5,next:10,reps:'6-8 katrai kājai',sec:75,pattern:'hinge',steps:['Turi vienu svarbumbu ar abām rokām. Vienu pēdu novieto nedaudz aiz otras, aizmugurējā uz pirkstgaliem.','Lielāko svara daļu turi uz priekšējās kājas, celis nedaudz saliekts.','Virzi gurnus atpakaļ, svaru tuvu kājai, līdz jūti augšstilba aizmuguri.','Iztaisno gurnus un atgriezies stāvus, tad maini kāju.'],cues:['Gurni taisni','Aizmugurējā kāja palīdz līdzsvaram','Mugura neitrāla']},
 'one-arm-single-leg-kettlebell-romanian-deadlift':{name:'Single-leg RDL - Rumāņu vilkme uz vienas kājas',kg:5,next:10,reps:'6-8 katrai kājai',sec:75,pattern:'hinge',steps:['Nostājies uz vienas kājas, svarbumbu turi pretējā rokā. Vajadzības gadījumā brīvo roku atbalsti.','Atbalsta ceļgalu viegli saliec un virzi gurnus atpakaļ, otru kāju izstiep aiz sevis.','Nolaid bumbu tuvu atbalsta kājai tikai līdz stabilai amplitūdai.','Iztaisno gurnus, atgriezies stāvus un maini pusi.'],cues:['Gurnus negriez uz sāniem','Sākumā trenējies bez svara','Vispirms apgūsti kickstand variantu']},
 'suitcase-carry':{name:'Suitcase carry - iešana ar svaru vienā rokā',kg:5,next:10,reps:'20-30 s katrai pusei',sec:65,pattern:'core',steps:['Droši pacel vienu bumbu no grīdas ar gurnu un ceļu palīdzību.','Turi bumbu gar sānu, plecus vienādā augstumā, brīvo roku atslābini.','Ej lēniem, īsiem soļiem un neļauj svaram noliekt ķermeni.','Noliec bumbu kontrolēti, maini roku.'],cues:['Nešūpojies','Elpo vienmērīgi','Brīvs ceļš bez šķēršļiem']},
 'kettlebell-rack-hold':{name:'Rack hold - svara noturēšana pie pleca',kg:5,next:10,reps:'15-25 s katrai pusei',sec:55,pattern:'core',steps:['Ar abām rokām nogādā bumbu pie pleca, darba roka ap rokturi, bumba atbalstīta pret apakšdelmu.','Nostājies stabili, elkoni turi tuvu ķermenim, vēderu sasprindzini.','Elpo mierīgi, negriez un nenoliec ķermeni.','Droši noliec bumbu un maini pusi.'],cues:['Plauksta neieliecas','Neaizturi elpu','Pārtrauc, ja poza zūd']},
 'kettlebell-swing':{name:'Two-hand swing - vēziens ar abām rokām',kg:5,next:10,reps:'6-10',sec:30,pattern:'power',steps:['Vispirms apgūsti vilkmi un gurnu atvirzīšanu bez vēziena. Nostājies ar pēdām nedaudz platāk par gurniem, bumba mazliet priekšā.','Atvirzi gurnus, satver bumbu ar abām rokām un ievelc to starp kājām tuvu ķermenim.','Strauji iztaisno gurnus; rokas vada bumbu līdz krūšu augstumam, nevelk to ar pleciem.','Gaidot bumbas atgriešanos, atvirzi gurnus un atkārto. Beigās kontrolēti novieto svaru uz grīdas.'],cues:['Vēziens no gurniem, ne muguras vai rokām','Brīva zona ap sevi','Pārtrauc sēriju, kad ātrums vai tehnika zūd']},
 'kettlebell-halo':{name:'Halo - svarbumbas aplis ap galvu',kg:5,next:5,reps:'5-6 katrā virzienā',sec:55,pattern:'mobility',steps:['Satver vienu svarbumbu ar abām rokām pie krūtīm. Ja 5 kg ir par smagu, vingrini kustību bez svara.','Lēni virzi bumbu ap galvu nelielā, nesāpīgā lokā.','Ribas un gurnus turi stabili; atgriezies pie krūtīm.','Maini virzienu un atkārto.'],cues:['Lēni, bez rāvieniem','Neizliec muguru','Apstājies, ja plecā ir sāpes']}
};
const KB_BODY={
 deadbug:{reps:'6-8 katrā pusē',sec:55},'bird-dog':{reps:'6-8 katrā pusē',sec:55},
 sideplank:{reps:'15-25 s katrā pusē',sec:55},calf:{reps:'12-15',sec:40},
 'bodyweight-squat':{reps:'8-12',sec:40},'glute-bridge':{reps:'10-12',sec:40},
 'wall-push-ups':{reps:'8-12',sec:40},ankle:{reps:'8 katrai kājai',sec:45},hips:{reps:'20-30 s katrā pusē',sec:60}
};
const KB_PROGRAMS=[
 {id:'kb-start',label:'SVARBUMBAS · PAMATI',title:'Svarbumbu pamati',level:'VIEGLS',minutes:25,kind:'strength',sets:2,rest:75,summary:'Pirmajām 1-2 nedēļām: apgūsti pietupienu, vilkmi, spiešanu, vilkšanu un stabilu stāju. Viena bumba katram vingrinājumam.',moves:['goblet-squat','kettlebell-deadlift','one-arm-kettlebell-row','one-arm-kettlebell-floor-press','suitcase-carry']},
 {id:'kb-full',label:'SVARBUMBAS · SPĒKS',title:'Pilna ķermeņa spēks',level:'VIDĒJS',minutes:35,kind:'strength',sets:3,rest:90,summary:'Lielās muskuļu grupas, kontrolēti atkārtojumi un 2-3 atkārtojumi rezervē. 15 kg tikai tad, ja vilkmes tehnika stabila.',moves:['goblet-squat','kettlebell-deadlift','one-arm-kettlebell-row','one-arm-kettlebell-floor-press','suitcase-carry']},
 {id:'kb-basket',label:'SVARBUMBAS · BASKETBOLAM',title:'Basketbolista spēks un stabilitāte',level:'VIDĒJS',minutes:30,kind:'basket',sets:2,rest:90,summary:'Vienas kājas spēks, gurni, ikri, korsete. Neveic smagu sesiju pirms spēles vai ar nogurušām kājām.',moves:['kettlebell-reverse-lunge','kettlebell-kickstand-deadlift','calf','one-arm-kettlebell-row','suitcase-carry','deadbug']},
 {id:'kb-upper',label:'SVARBUMBAS · AUGŠDAĻA',title:'Augšdaļas spēks',level:'VIDĒJS',minutes:25,kind:'upper',sets:2,rest:90,summary:'Mugura, krūtis, pleci un korpuss. Labs variants, kad kājas jāsaudzē. Ja plecu spiešana nav komfortabla, izlaid to.',moves:['one-arm-kettlebell-row','one-arm-kettlebell-floor-press','one-arm-kettlebell-shoulder-press','kettlebell-rack-hold']},
 {id:'kb-legs',label:'SVARBUMBAS · KĀJAS',title:'Kāju un gurnu spēks',level:'VIDĒJS',minutes:30,kind:'strength',sets:2,rest:90,summary:'Pietupieni, gurnu vilkme un vienas kājas kontrole. Lielāko svaru lieto tikai ar labu tehniku un pietiekamu atpūtu.',moves:['goblet-squat','kettlebell-deadlift','kettlebell-reverse-lunge','kettlebell-kickstand-deadlift','calf']},
 {id:'kb-core',label:'SVARBUMBAS · KORPUSS',title:'Korpuss un līdzsvars',level:'VIEGLS',minutes:20,kind:'core',sets:2,rest:60,summary:'Stabils ķermenis bez lēcieniem. Piemērots mērenai papildu slodzei; pēc smagas spēles labāk tikai atjaunošanās.',moves:['suitcase-carry','kettlebell-rack-hold','deadbug','sideplank']},
 {id:'kb-circuit',label:'SVARBUMBAS · KONDĪCIJA',title:'Kontrolēts kondīcijas aplis',level:'VIDĒJS',minutes:25,kind:'basket',sets:2,rest:60,circuit:true,summary:'Pieci vingrinājumi apļos mierīgā tempā. Bez lēcieniem un bez vēzieniem. Atpūties ilgāk, ja tehnika pasliktinās.',moves:['goblet-squat','one-arm-kettlebell-row','kettlebell-deadlift','one-arm-kettlebell-floor-press','suitcase-carry']},
 {id:'kb-power',label:'SVARBUMBAS · EKSPLOZIVITĀTE',title:'Gurnu jauda un vēziens',level:'SAREŽĢĪTS',minutes:25,kind:'basket',sets:2,rest:90,advanced:true,summary:'Tikai pēc vilkmes un vēziena tehnikas apgūšanas, vēlams trenera uzraudzībā. Bez noguruma un ne pirms spēles. Neveic vēzienu virs galvas.',moves:['kettlebell-swing','goblet-squat','one-arm-kettlebell-row','suitcase-carry']}
];
function kbMove(id){return KB_MOVES[id]||KB_BODY[id]||null}
function kbProgram(id){return KB_PROGRAMS.find(p=>p.id===id)||LIVA_PRESETS.find(p=>p.id===id&&p.sets)||null}
function kbDose(id,sets,level='easy',rest=75){
 const m=kbMove(id);if(!m)return null;
 return {sets,reps:m.reps,kg:KB_MOVES[id]?(activeProfile==='liva'?5:KB_MOVES[id].kg):null,next:KB_MOVES[id]?(activeProfile==='liva'?Math.min(10,KB_MOVES[id].next):KB_MOVES[id].next):null,rest,seconds:m.sec};
}
function kbDoseText(d){return d?d.sets+' x '+d.reps+(d.kg===null?' · paša svars':' · sākumā '+d.kg+' kg'+(d.next>d.kg?' (vēlāk '+d.next+' kg, ja tehnika stabila)':''))+' · '+d.rest+' s atpūta':''}
function kbEstimatedMinutes(ids,doses,circuit=false,warmup=300,cooldown=180){
 let sec=warmup+cooldown;
 if(circuit){const rounds=doses[ids[0]].sets;sec+=rounds*ids.reduce((n,id)=>n+doses[id].seconds+doses[id].rest,0);}
 else for(const id of ids){const d=doses[id];sec+=d.sets*(d.seconds+d.rest);}
 return Math.ceil(sec/60);
}
function kbPlanFor(p,target,level,focus,balance=false,automatic=false){
 const desired=Math.max(10,Math.min(60,Number(target)||p.minutes));
 let sets=automatic?(desired<=10?1:desired<35?2:3):p.sets;
 if(level==='easy')sets=Math.min(sets,2);
 if(p.advanced)sets=Math.min(sets,2);
 let ids=p.moves.slice();
 // Short sessions use fewer exercises rather than rushed rest intervals.
 const warmup=automatic&&desired<=15?180:300,cooldown=automatic&&desired<=15?120:180;
 const balanceSeconds=balance&&!p.advanced&&desired>=20?120:0;
 let doses=Object.fromEntries(ids.map(id=>[id,kbDose(id,sets,level,p.rest)]));
 if(automatic){
  while(ids.length>1&&kbEstimatedMinutes(ids,doses,p.circuit,warmup,cooldown)+balanceSeconds/60>desired){ids.pop();doses=Object.fromEntries(ids.map(id=>[id,kbDose(id,sets,level,p.rest)]));}
  if(kbEstimatedMinutes(ids,doses,p.circuit,warmup,cooldown)+balanceSeconds/60>desired&&sets>1){sets=1;doses=Object.fromEntries(ids.map(id=>[id,kbDose(id,sets,level,p.rest)]));}
 }
 const minutes=kbEstimatedMinutes(ids,doses,p.circuit,warmup,cooldown)+balanceSeconds/60;
 return {kind:'kettlebell-reps',programId:p.id,title:p.title,minutes,targetMinutes:desired,level,focus,equipment:'kettlebell',ids,kbDoses:doses,circuit:!!p.circuit,advanced:!!p.advanced,rounds:sets,workSeconds:0,restSeconds:p.rest,roundRestSeconds:p.rest,warmupSeconds:warmup,cooldownSeconds:cooldown,balanceSeconds,balanceExerciseId:balanceSeconds?'balance-dome-stand':null};
}
for(const [id,m] of Object.entries(KB_MOVES)){
 const x=WORKOUT_LIBRARY.find(x=>x.id===id);if(!x||x.equipment!=='kettlebell')continue;
 x.name=m.name;x.guide=m.steps[0];x.instructions=m.steps.slice();x.cues=m.cues.slice();x.sets=kbDoseText(kbDose(id,2));
 x.minutes=Math.ceil((2*(m.sec+75))/60);x.tags=[...new Set([...x.tags,'Svaru bumba','Basketbolam'])];
}
for(const p of KB_PROGRAMS){
 const d=Object.fromEntries(p.moves.map(id=>[id,kbDose(id,p.sets,'easy',p.rest)]));
 p.minutes=kbEstimatedMinutes(p.moves,d,p.circuit);
 WORKOUT_PRESETS.push(p);
}


/* Profile-specific dance / weight management programs. */
const LIVA_PRESETS=[
 {id:'lv-dance-foundation',label:'TAUTAS DEJAS · SPĒKS',title:'Dejotājas kāju spēks',minutes:27,level:'VIDĒJS',kind:'dance',summary:'Pietupieni, izklupieni, ikru spēks un gurnu kontrole. Dienās bez intensīva mēģinājuma.',moves:['bodyweight-squat','reverse','glute-bridge','calf','side-lying-hip-abduction']},
 {id:'lv-dance-balance',label:'TAUTAS DEJAS · LĪDZSVARS',title:'Līdzsvars, pēdas un potītes',minutes:19,level:'VIEGLS',kind:'dance',summary:'Vienas kājas stāja, pēdu kontrole un stabilitāte. Turi balstu sasniedzamā vietā.',moves:['ankle','supported-single-leg-stand','heel-to-toe-walk','calf','bird-dog']},
 {id:'lv-dance-endurance',label:'TAUTAS DEJAS · IZTURĪBA',title:'Dejotājas izturība bez lēcieniem',minutes:25,level:'VIDĒJS',kind:'dance',summary:'Mērenā tempā; augstos ceļus izpildi soļojot, nevis skrienot.',moves:['walking','high-knees','bodyweight-squat','standing-hip-abduction','calf']},
 {id:'lv-fat-loss',label:'SVARA SAMAZINĀŠANA',title:'Pilna ķermeņa kondīcija',minutes:28,level:'VIDĒJS',kind:'weightloss',summary:'Mērena kustība un spēks muskuļu saglabāšanai. Svara samazināšanos nosaka ilgtermiņa enerģijas bilance.',moves:['high-knees','bodyweight-squat','wall-push-ups','glute-bridge','standing-hip-abduction','deadbug']},
 {id:'lv-recovery',label:'ATJAUNOŠANĀS',title:'Mobilitāte pēc deju mēģinājuma',minutes:15,level:'VIEGLS',kind:'recovery',summary:'Mierīga potīšu, ikru, gurnu un muguras mobilitāte. Bez agresīvas stiepšanas.',moves:['ankle','standing-calf-stretch','hips','cat-cow','thread-the-needle']},
 {id:'lv-posture',label:'KORPUSS · STĀJA',title:'Stāja un stabils korpuss',minutes:22,level:'VIEGLS',kind:'core',summary:'Korpusa, muguras un gūžu stabilitāte dejām un ikdienai.',moves:['bird-dog','deadbug','sideplank','glute-bridge','wall-push-ups']},
 {id:'lv-kb-dance',label:'SVARBUMBAS · TAUTAS DEJAS',title:'Dejotājas spēks ar svarbumbu',level:'VIDĒJS',minutes:30,kind:'dance',sets:2,rest:90,summary:'Kāju spēks un līdzsvars. Sāc bez svara vai ar 5 kg, ja kustība stabila.',moves:['goblet-squat','kettlebell-reverse-lunge','kettlebell-kickstand-deadlift','calf','suitcase-carry']},
 {id:'lv-kb-circuit',label:'SVARBUMBAS · KONDĪCIJA',title:'Spēka un kondīcijas aplis',level:'VIDĒJS',minutes:25,kind:'weightloss',sets:2,rest:75,circuit:true,summary:'Kontrolēta pilna ķermeņa slodze ar vienu svarbumbu, bez vēzieniem un lēcieniem.',moves:['goblet-squat','one-arm-kettlebell-row','kettlebell-deadlift','one-arm-kettlebell-floor-press','suitcase-carry']}
];
const LIVA_DOSES={walking:'2-4 min mierīgā tempā','high-knees':'2 x 30 s (soļojot)','standing-hip-abduction':'2 x 8-12 katrai kājai','side-lying-hip-abduction':'2 x 10 katrai kājai','supported-single-leg-stand':'2 x 20-30 s katrai kājai','standing-calf-stretch':'2 x 20-30 s katrai kājai','wall-push-ups':'2 x 8-12'};
for(const p of LIVA_PRESETS.filter(p=>p.sets)){const doses=Object.fromEntries(p.moves.map(id=>[id,kbDose(id,p.sets,'easy',p.rest)]));p.minutes=kbEstimatedMinutes(p.moves,doses,p.circuit);}
WORKOUT_PRESETS.push(...LIVA_PRESETS);
function lbIsLiva(){return activeProfile==='liva'}
function lbAvailablePrograms(){return lbIsLiva()?[...LIVA_PRESETS,...KB_PROGRAMS.filter(p=>['kb-start','kb-full','kb-upper','kb-legs','kb-core','kb-circuit'].includes(p.id))]:WORKOUT_PRESETS.filter(p=>!p.id.startsWith('lv-'))}
function lbFocusOptions(){return [['full','Pilns ķermenis'],...(lbIsLiva()?[['dance','Tautas dejām'],['weightloss','Svara samazināšanai']]:[['basket','Basketbolam']]),['strength','Spēks'],['core','Korpusa stabilitāte'],['recovery','Mobilitāte / atjaunošanās']]}
function lbResetProfile(){lbBuilderProfile=null;lbTab='mine';lbFocusId=null;lbLevel='all';lbGroup='Visi';lbSearch='';lbFavOnly=false;lbRecentOnly=false;lbProgramFavOnly=false;lbEquipment='all';lbVisible=24;lbWorkDate=fitToday();window.fitOpenRoutine=null;}
function lbDanceTag(x){return new Set(LIVA_PRESETS.flatMap(p=>p.moves)).has(x.id)||['lateral','rdl','single-leg-calf-raise'].includes(x.id)}
function lbLivaWarning(){return 'Pēc intensīva deju mēģinājuma vai pirms koncerta izvēlies vieglu mobilitāti. Pie sāpēm pārtrauc. Svara samazināšanai nepieciešama ilgtspējīga ēšanas un kustību sistēma.'}

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
 if(lbGroup==='Tautas dejām')arr=arr.filter(lbDanceTag);else if(lbGroup!=="Visi")arr=arr.filter(x=>x.group===lbGroup||x.tags.includes(lbGroup));
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
 return '<div class="lb-hero"><div><span class="lb-kicker">MANS UZTURS · TRENIŅU STUDIJA</span><h1>Tavs treniņš.<br><em>Tavi noteikumi.</em></h1><p>'+WORKOUT_LIBRARY.length+' vingrinājumi ar attēliem, gatavas programmas un savs treniņu komplekts.</p><div class="lb-hero-foot"><span>♥ '+lbFaves().length+' favorītos</span><span>✓ '+selected+' izvēlēti izvēlētajai dienai</span></div></div><div class="lb-hero-art"><img src="'+lbImage('reverse','peak')+'" alt="" loading="lazy"></div></div>'
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
 '<label class="lb-equipment">Inventārs<select data-lb-select="equipment" aria-label="Atlasīt inventāru"><option value="all">Viss inventārs</option>'+[...new Set(WORKOUT_LIBRARY.map(x=>x.equipment))].sort((a,b)=>lbEquipmentName({equipment:a}).localeCompare(lbEquipmentName({equipment:b}),'lv')).map(eq=>'<option value="'+eq+'" '+(lbEquipment===eq?'selected':'')+'>'+safe(lbEquipmentName({equipment:eq}))+' ('+WORKOUT_LIBRARY.filter(x=>x.equipment===eq).length+')</option>').join('')+'</select></label><p class="lb-safety">Nepieciešamais inventārs norādīts pie vingrinājuma.</p>'+
 '<div class="lb-input-wrap"><span>⌕</span><input id="lb-search" type="search" autocomplete="off" placeholder="Meklē vingrinājumu..." value="'+safe(lbSearch)+'" aria-label="Meklēt vingrinājumu"></div>'+
 '<div class="lb-categories">'+(lbIsLiva()?LB_GROUPS.map(g=>g==='Basketbolam'?'Tautas dejām':g):LB_GROUPS).map(group=>'<button type="button" class="'+(lbGroup===group?'active':'')+'" data-lb="group" data-value="'+group+'">'+group+'</button>').join('')+'</div>'+
 '<div class="lb-subfilters"><button type="button" class="'+(lbFavOnly?'active':'')+'" data-lb="fav-filter">♥ Favorīti</button><button type="button" class="'+(lbRecentOnly?'active':'')+'" data-lb="recent-filter">↺ Nesen izmantotie</button><span id="lb-count">'+lbFiltered().length+' rezultāti</span></div>'+
 '<div id="lb-list">'+lbListContent()+'</div></div>';
}
function lbProgramFavoriteButton(id){
 const fav=Array.isArray(state.programFavorites)&&state.programFavorites.includes(id);
 return '<button type="button" class="lb-detail-fav" data-lb="program-favorite" data-id="'+id+'" aria-pressed="'+fav+'">'+(fav?'♥ Programma favorītos':'♡ Pievienot programmu favorītiem')+'</button>';
}
function lbProgramCard(p){
 const x=lbEntry(p.moves[0]),level=p.level,done=!!state.homeSessions?.[fitToday()+'|'+p.id];
 return '<article class="lb-program-card"><div class="lb-program-img"><img src="'+lbImage(x?.id||'reverse')+'" alt="" loading="lazy" width="512" height="512"><span>'+p.label+'</span></div><div class="lb-program-body"><div class="lb-program-top"><span>'+p.minutes+' MIN · '+p.moves.length+' VINGRINĀJUMI</span>'+ (done?'<span class="lb-pdone">✓ PAVEIKTS</span>':'')+'</div><h3>'+safe(p.title)+'</h3>'+lbProgramFavoriteButton(p.id)+'<p>'+safe(p.summary)+'</p>'+(kbProgram(p.id)?'<p><strong>'+p.sets+(p.circuit?' apļi':' piegājieni')+' · '+p.rest+' s atpūta</strong></p><button type="button" data-lb="kb-plan" data-id="'+p.id+'">Pievienot izvēlētās dienas plānam</button>':'')+'<button type="button" data-lb="program" data-id="'+p.id+'">Atvērt programmu <span>↗</span></button></div></article>';
}
function lbPrograms(){
 return '<div class="lb-panel">'+
 '<div class="lb-head"><div><span>GATAVAS SESIJAS</span><h2>Izvēlies treniņa veidu</h2></div><div class="lb-head-count">'+lbAvailablePrograms().length+' PROGRAMMAS</div></div>'+
 '<div class="lb-subfilters"><button type="button" data-lb="program-fav-filter" aria-pressed="'+lbProgramFavOnly+'" class="'+(lbProgramFavOnly?'active':'')+'">♥ Programmu favorīti</button></div>'+
 '<div class="lb-program-grid">'+lbAvailablePrograms().filter(p=>!lbProgramFavOnly||(state.programFavorites||[]).includes(p.id)).map(lbProgramCard).join('')+'</div>'+
 (lbProgramFavOnly&&!lbAvailablePrograms().some(p=>(state.programFavorites||[]).includes(p.id))?'<p>Vēl nav saglabātu programmu. Pievieno programmu ar sirsniņu.</p>':'')+
 '<p class="lb-safety">'+(lbIsLiva()?lbLivaWarning():'Pēc intensīva basketbola vai pirms spēles izvēlies atjaunošanos. Lēcienu programmu veic tikai svaigā stāvoklī, bez sāpēm un ar pietiekamu atpūtu.')+'</p></div>';
}
function lbSelectedDay(){
 const ids=lbCheckWorkout(lbDay()).ids,done=lbDay().checked.length,total=ids.reduce((n,id)=>n+(lbEntry(id)?.minutes||0),0);
 return (ids.length?'<div class="lb-custom-top"><div><span>IZVĒLĒTĀ DIENA</span><h2>Mans treniņš</h2><p>'+ids.length+' vingrinājumi · '+lbWorkoutDuration()+'</p></div><div class="lb-my-progress">'+done+'/'+ids.length+'</div></div>':'')+'<div class="lb-date-picker"><label for="lb-date">Treniņa datums</label><input id="lb-date" type="date" value="'+lbWorkDate+'"><button type="button" data-lb="today">Šodiena</button></div>';
}
function lbMyCard(id,index){
 const x=lbEntry(id);if(!x)return '';
 const checked=lbDay().checked.includes(id);
 return '<div class="lb-my-row"><img src="'+lbImage(id)+'" loading="lazy" alt="" width="512" height="512"><div class="lb-my-copy"><span>'+String(index+1).padStart(2,"0")+' · '+lbLevelName(x.level)+'</span><strong>'+safe(x.name)+'</strong><small>'+(lbDay().plan?.kind==='kettlebell-reps'?safe(kbDoseText(lbDay().plan.kbDoses[id])):lbDay().plan?lbDay().plan.rounds+' apļi · '+lbDay().plan.workSeconds+' s darbs / '+lbDay().plan.restSeconds+' s atpūta':safe(x.sets)+' · '+lbDurationLabel(x))+'</small><button type="button" class="lb-my-technique" data-lb="view" data-id="'+id+'">Skatīt izpildi ↗</button>'+lbLoadField(x)+'</div><div class="lb-my-controls"><button data-lb="my-check" data-id="'+id+'" class="'+(checked?'done':'')+'" aria-label="Atzīmēt vingrinājumu">'+(checked?'✓':'○')+'</button><button data-lb="my-remove" data-id="'+id+'" aria-label="Izņemt vingrinājumu">×</button></div></div>';
}
function lbMyWorkout(){
 const workout=lbCheckWorkout(lbDay());
 return '<div class="lb-panel">'+lbSelectedDay()+lbGearCombos()+lbBuilderUI(workout)+(workout.ids.length?'<section class="lb-resume"><div><span>SAGLABĀTAIS TRENIŅŠ</span><strong>'+workout.ids.length+' vingrinājumi · '+lbWorkoutDuration()+'</strong></div><button type="button" data-lb="open-workout">Atvērt treniņu ↗</button></section>':'')+'</div>';
}
function lbOpenWorkout(){state.activeWorkoutDate=lbWorkDate;lbFocusId=null;save();go('mans-trenins');}
function lbWorkoutExercise(id,index,workout){
 const x=lbEntry(id);if(!x)return '';const p=workout.plan,done=workout.checked.includes(id),fav=lbFaves().includes(id);
 const dose=p?.kind==='kettlebell-reps'?kbDoseText(p.kbDoses[id]):p?p.rounds+' apļi · '+p.workSeconds+' s darbs · '+p.restSeconds+' s atpūta':x.sets;
 const steps=lbIsLiva()&&id==='high-knees'?['Soļo uz vietas, pārmaiņus paceļot ceļus sev ērtā augstumā.','Saglabā taisnu stāju, bez lēciena vai skrējiena.']:x.instructions||[x.guide];
 return '<article class="lb-run-exercise '+(done?'is-done':'')+'"><div class="lb-run-ex-heading"><span>VINGRINĀJUMS '+String(index+1).padStart(2,'0')+'</span><span>'+lbLevelName(x.level)+'</span></div><h2>'+safe(x.name)+'</h2><div class="lb-run-dose">'+safe(dose)+'</div><div class="lb-run-ex-content"><div class="lb-run-images">'+lbPoseImages(id,true)+'</div><div class="lb-run-instructions"><h3>Kā izpildīt'+'</h3><ol>'+steps.map(step=>'<li>'+safe(step)+'</li>').join('')+'</ol>'+(x.cues?.length?'<div class="lb-run-cues">'+x.cues.map(cue=>'<p>✓ '+safe(cue)+'</p>').join('')+'</div>':'')+lbLoadField(x)+'</div></div><div class="lb-run-actions"><button type="button" data-lb="my-check" data-id="'+id+'" aria-pressed="'+done+'" class="'+(done?'done':'')+'">'+(done?'✓ Paveikts':'○ Atzīmēt kā paveiktu')+'</button><button type="button" data-lb="favorite" data-id="'+id+'" aria-pressed="'+fav+'">'+(fav?'♥ Favorītos':'♡ Favorītiem')+'</button><button type="button" class="lb-run-remove" data-lb="my-remove" data-id="'+id+'" aria-label="Izņemt '+safe(x.name)+'">×</button></div></article>';
}
function renderCustomWorkout(){
 lbSyncBuilder();const savedDate=state.activeWorkoutDate;if(/^\d{4}-\d{2}-\d{2}$/.test(savedDate||''))lbWorkDate=savedDate;
 const workout=lbCheckWorkout(lbDay()),ids=workout.ids,done=workout.checked.length;
 if(!ids.length)return '<div class="ap-screen lb-page lb-run"><button type="button" class="lb-back" data-lb="return-builder">‹ Atpakaļ uz atlasi</button><div class="lb-empty"><h1>Treniņš vēl nav sagatavots</h1><p>Izvēlies ilgumu, grūtību un inventāru.</p><button type="button" data-lb="return-builder">Sagatavot treniņu</button></div></div>';
 return '<div class="ap-screen lb-page lb-run"><div class="lb-run-top"><button type="button" class="lb-back" data-lb="return-builder">‹ Atpakaļ uz atlasi</button><span>'+safe(lbWorkDate.split('-').reverse().join('.'))+'</span></div><header class="lb-run-title"><span>TAVS SAGATAVOTAIS TRENIŅŠ</span><h1>'+(workout.plan?workout.plan.minutes+' minūšu treniņš':'Tavs vingrinājumu saraksts')+'</h1><p>'+ids.length+' vingrinājumi · '+done+' paveikti</p></header><div class="lb-run-progress" role="progressbar" aria-label="Paveiktie vingrinājumi" aria-valuenow="'+done+'" aria-valuemin="0" aria-valuemax="'+ids.length+'"><i style="width:'+Math.round(done/ids.length*100)+'%"></i></div>'+lbPlanSummary(workout)+'<div class="lb-run-list">'+ids.map((id,index)=>lbWorkoutExercise(id,index,workout)).join('')+'</div>'+lbBalanceBlock(workout.plan)+'<button type="button" class="lb-generate lb-run-finish" data-lb="complete" '+(lbWorkDate>fitToday()?'disabled':'')+'>'+(lbWorkDate>fitToday()?'Ieplānots nākamajai dienai':workout.completed?'✓ Treniņš paveikts · atcelt atzīmi':'✓ Pabeigt treniņu')+'</button><button type="button" class="lb-run-change" data-lb="return-builder">Mainīt treniņa iestatījumus</button><div class="lb-attribution">Vingrinājumu attēli: <a href="https://repdb.co" target="_blank" rel="noopener noreferrer">Exercise data by RepDB (repdb.co)</a>.</div></div>';
}

function lbExerciseDetail(){
 const x=lbEntry(lbFocusId);if(!x){lbFocusId=null;return lbLibrary()}
 const fav=lbFaves().includes(x.id),selected=lbSelected(x.id);
 const video=ACTIVE_VIDEOS[x.id];
 return '<div class="lb-panel lb-detail"><button class="lb-back" data-lb="back">‹ Atpakaļ uz vingrinājumiem</button>'+
 '<div class="lb-detail-head"><span>'+lbLevelName(x.level)+' · '+safe(x.group)+'</span><h1>'+safe(x.name)+'</h1><p>'+lbDurationLabel(x)+' · '+safe(x.sets)+'</p></div>'+
 '<div class="lb-detail-photo">'+lbPoseImages(x.id,true)+'</div>'+
 '<div class="lb-detail-copy"><p><strong>Inventārs:</strong> '+safe(lbEquipmentName(x))+'</p><span>'+'IZPILDE'+'</span>'+(!x.instructions?'<p>'+safe(x.guide)+'</p>':'')+(x.instructions?'<ol>'+x.instructions.map(step=>'<li>'+safe(step)+'</li>').join('')+'</ol>':'')+'<h3>Tehnikas atgādne</h3><ul>'+x.cues.map(c=>'<li>✓ '+safe(c)+'</li>').join('')+'</ul></div>'+
 (x.level==='hard'?'<div class="lb-hard-warning"><strong>Paaugstināta slodze.</strong> Šo vingrinājumu izvēlies tikai tad, ja tam ir pietiekama spēka un kustību kontroles bāze. Neveic līdz spēku izsīkumam vai pirms '+(lbIsLiva()?'intensīva deju mēģinājuma':'spēles')+'.</div>':'')+
 '<div class="lb-detail-buttons"><button class="lb-detail-add '+(selected?'selected':'')+'" data-lb="add" data-id="'+x.id+'">'+(selected?'✓ Izņemt no izvēlētās dienas':'＋ Pievienot izvēlētajai dienai')+'</button><button class="lb-detail-fav" data-lb="favorite" data-id="'+x.id+'">'+(fav?'♥ Favorītos':'♡ Pievienot favorītiem')+'</button>'+(video?'<button data-ap-video="'+x.id+'" class="lb-detail-video">▶ Video demonstrācija</button>':'')+'</div></div>';
}
function lbReadiness(){
 if(lbIsLiva())return '<div class="lb-tips"><div><span>ĀTRĀ IZVĒLE</span><h2>Ko gribi darīt šodien?</h2></div><div class="lb-choice-row"><button data-lb="quick" data-value="recovery"><strong>Pēc mēģinājuma</strong><small>Mobilitāte</small></button><button data-lb="quick" data-value="weightloss"><strong>Svara samazināšana</strong><small>Kondīcija un spēks</small></button><button data-lb="quick" data-value="dance"><strong>Tautas dejām</strong><small>Spēks un līdzsvars</small></button></div></div>';
 return '<div class="lb-tips"><div><span>ĀTRĀ IZVĒLE</span><h2>Ko gribi darīt šodien?</h2></div><div class="lb-choice-row"><button data-lb="quick" data-value="recovery"><span>◌</span><strong>Viegli pēc spēles</strong><small>Mobilitāte un atjaunošanās</small></button><button data-lb="quick" data-value="strength"><span>↗</span><strong>Normāli pastrādāt</strong><small>Spēks un kontrole</small></button><button data-lb="quick" data-value="movement"><span>⬡</span><strong>Basketbola forma</strong><small>Sānu kustības un stabilitāte</small></button></div></div>';
}
renderFitnessHome=function(){
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
 const done=!!state.exerciseChecks?.[fitToday()+'|'+routine+'|'+id],hasVideo=!!ACTIVE_VIDEOS[id],kb=kbProgram(routine),dose=kb?kbDose(id,kb.sets,'easy',kb.rest):null;const lv=lbIsLiva()&&routine.startsWith('lv-'),guidance=lv&&id==='high-knees'?['Soļo uz vietas, pārmaiņus paceļot ceļus, bez lēciena.','Saglabā taisnu stāju un mērenu tempu.']:x.instructions||[x.guide];
 return '<article class="ap-exercise ap-exercise-visual">'+lbProgramGallery(id)+
 '<div class="ap-ex-info"><span>'+safe(dose?kbDoseText(dose):lv?(LIVA_DOSES[id]||x.sets):x.sets)+' · '+lbLevelName(x.level)+'</span><h3>'+safe(x.name)+'</h3><div class="ap-ex-instruction-label">KĀ IZPILDĪT</div>'+(kb||lv?'<ol>'+guidance.map(t=>'<li>'+safe(t)+'</li>').join('')+'</ol>':'<p>'+safe(x.guide)+'</p>')+'<ul>'+x.cues.map(t=>'<li>✓ '+safe(t)+'</li>').join('')+'</ul>'+
 '<div class="ap-ex-actions">'+(hasVideo?'<button data-ap-video="'+id+'">▶ VIDEO</button>':'')+
 '<button type="button" class="lb-detail-fav" data-lb="favorite" data-id="'+id+'" aria-pressed="'+lbFaves().includes(id)+'">'+(lbFaves().includes(id)?'♥ Favorītos':'♡ Favorītiem')+'</button>'+
 '<button class="'+(done?'done':'')+'" data-ap-check="'+id+'" data-ap-routine="'+routine+'">'+(done?'✓ PAVEIKTS':'○ ATZĪMĒT')+'</button></div></div></article>';
};
ACTIVE_PROGRAMS.splice(0,ACTIVE_PROGRAMS.length,...WORKOUT_PRESETS);
const lbPreviousRoutine=renderFitnessRoutine;
renderFitnessRoutine=function(id){lbSyncBuilder();if(!lbAvailablePrograms().some(p=>p.id===id))return '<div class="ap-screen"><button data-nav="majasha" class="lb-back">‹ Atpakaļ uz treniņiem</button><p>Izvēlies sava profila programmu.</p></div>';const html=lbPreviousRoutine(id),p=kbProgram(id);if(!p)return html;const intro='<section class="lb-kb-intro"><strong>Viena svarbumba katram vingrinājumam · 5 / 10 / 15 kg</strong><p>5 min iesildīšanās bez svara, '+p.rest+' s atpūta '+(p.circuit?'starp vingrinājumiem; izpildi '+p.sets+' apļus':'starp piegājieniem; pabeidz katra vingrinājuma piegājienus pēc kārtas')+', 3 min atsildīšanās. Izvēlies vieglāku svaru, ja nevari izpildīt atkārtojumus ar 2-3 rezervē.</p>'+(p.advanced?'<p><strong>Vēzienus izvēlies tikai pēc tehnikas apgūšanas, ne nogurumā.</strong></p>':'')+'<button type="button" data-lb="kb-plan" data-id="'+p.id+'">Pievienot izvēlētās dienas treniņam</button></section>';return html.replace('<div class="ap-routine-progress">',intro+'<div class="ap-routine-progress">');};
// Curated movements with known equipment and technique; the full catalog remains browsable.
const LB_AUTO_POOL=[
 ['bodyweight-squat','squat'],['split-squat','lunge'],['reverse','lunge'],['lateral','lunge'],['rdl','hinge'],['glute-bridge','hinge'],['single-leg-glute-bridge','hinge'],['bodyweight-good-morning','hinge'],
 ['wall-push-ups','push'],['knee-push-ups','push'],['push','push'],['pike-push-ups','push'],['archer-push-ups','push'],
 ['deadbug','core'],['dead-bug-hold','core'],['high-plank','core'],['bird-dog','core'],['sideplank','core'],['plank','core'],['bear-plank-hold','core'],['planktap','core'],['hollow-body-hold','core'],['side-plank-leg-lift','core'],
 ['calf','balance'],['single-leg-calf-raise','balance'],['heel-to-toe-walk','balance'],['supported-single-leg-stand','balance'],
 ['ankle','mobility'],['hips','mobility'],['cat-cow','mobility'],['thread-the-needle','mobility'],['90-90-switch','mobility'],['childs-pose','mobility'],
 ['step-ups','lunge',true],['bulgarian','lunge',true],['single-leg-box-squat','squat',true],['copenhagen-plank','core',true],
 ['db-goblet-squat','squat'],['dumbbell-romanian-deadlift','hinge'],['bent-over-db-row','pull'],['dumbbell-floor-press','push'],['dumbbell-shoulder-press','push'],['dumbbell-split-squat','lunge'],['hammer-curl','pull'],
 ['deadlift','hinge'],['romanian-deadlift','hinge'],['barbell-row','pull'],['barbell-curl','pull'],
 ['walking','cardio'],['high-knees','cardio'],['standing-hip-abduction','balance'],['side-lying-hip-abduction','balance'],['standing-calf-stretch','mobility'],['banded-squat','squat'],['banded-glute-bridge','hinge'],['banded-clamshell','hinge'],['banded-fire-hydrant','hinge'],['banded-lateral-walk','balance'],['banded-good-morning','hinge']
];
const LB_BUILD_EQUIPMENT=[['kettlebell','Svaru bumbas 5 / 10 / 15 kg + paša svars'],['none','Bez inventāra'],['support','Stabils sols / paaugstinājums'],['dumbbell','Hanteles + paša svars'],['barbell','Savienotais stienis + paša svars'],['loop_band','Gumijas cilpa + paša svars']];
const LB_GEAR_COMBOS=[
 {id:'kettlebell',name:'Svaru bumbas',note:'5 · 10 · 15 kg / viena bumba',equipment:'kettlebell',balance:false,focus:'strength'},
 {id:'body',name:'Paša svars',note:'Bez svaru komplekta',equipment:'none',balance:false,focus:'full'},
 {id:'dumbbells',name:'Hanteles',note:'Spēks un paša svars',equipment:'dumbbell',balance:false,focus:'strength'},
 {id:'bar',name:'Savienotais stienis',note:'Vilkmju un spēka darbs',equipment:'barbell',balance:false,focus:'strength'},
 {id:'db-balance',name:'Hanteles + pusbumba',note:'Spēks, pēc tam līdzsvars',equipment:'dumbbell',balance:true,focus:'basket'},
 {id:'bar-balance',name:'Stienis + pusbumba',note:'Spēks, pēc tam līdzsvars',equipment:'barbell',balance:true,focus:'basket'},
 {id:'balance-mobility',name:'Pusbumba + mobilitāte',note:'Līdzsvars un izkustēšanās',equipment:'none',balance:true,focus:'recovery'}
];
function lbGearCombos(){return '<section class="lb-gear"><div><span>TAVS MĀJAS INVENTĀRS</span><h3>Izvēlies kombināciju</h3><p>Svaru bumbas: 5, 10 un 15 kg. Hanteļu komplekts: ap 20 kg kopā. Pusbumba - atsevišķā blokā bez svariem.</p></div><div class="lb-gear-grid" role="group" aria-label="Inventāra kombinācijas">'+LB_GEAR_COMBOS.map(c=>'<button type="button" data-lb="gear-combo" data-value="'+c.id+'" class="'+(lbBuildEquipment===c.equipment&&lbBuildBalance===c.balance?'selected':'')+'" aria-pressed="'+(lbBuildEquipment===c.equipment&&lbBuildBalance===c.balance)+'"><strong>'+c.name+'</strong><small>'+c.note+'</small></button>').join('')+'</div></section>';}
function lbBalanceToggle(){return '<label class="lb-balance-toggle"><input type="checkbox" data-lb-select="balance-block" '+(lbBuildBalance?'checked':'')+'><span><strong>Līdzsvara pusbumba</strong><small>Atsevišķs 2-3 min bloks bez svariem.</small></span></label>';}
function lbLoadField(x){if(x.equipment==='kettlebell'){const value=lbDay().loads?.[x.id];const dose=lbDay().plan?.kbDoses?.[x.id];const hint=dose?.kg??KB_MOVES[x.id]?.kg;return '<label class="lb-load-label">Izmantotā svarbumba'+(hint?' · sākumā '+hint+' kg':'')+'<select data-lb-load="'+safe(x.id)+'" aria-label="Izmantotā svarbumba"><option value="">Izvēlies svaru</option>'+KB_WEIGHTS.map(w=>'<option value="'+w+'" '+(value===w?'selected':'')+'>'+w+' kg</option>').join('')+'<option value="0" '+(value===0?'selected':'')+'>0 kg / bez svara</option></select></label>';}if(!['dumbbell','barbell'].includes(x.equipment))return '';const value=lbDay().loads?.[x.id];return '<label class="lb-load-label">'+(x.equipment==='barbell'?'Stieņa kopējais svars, kg':x.id==='db-goblet-squat'?'Hanteles svars, kg':'Hanteļu kopējais svars, kg')+'<input type="text" inputmode="decimal" autocomplete="off" data-lb-load="'+x.id+'" value="'+(Number.isFinite(value)?value:'')+'" placeholder="Ievadi kg" aria-label="'+safe(x.name)+' - izmantotie kg"></label>';}
function lbBalanceExercise(p){return lbEntry(p?.balanceExerciseId||({easy:'balance-dome-stand',medium:'balance-dome-squat-hold',hard:'balance-dome-plank'})[p?.level]||'balance-dome-stand');}
function lbBalanceBlock(p){if(!p?.balanceSeconds)return '';const x=lbBalanceExercise(p);if(!x)return '';const names={'balance-dome-stand':'Stāja uz līdzsvara pusbumbas','balance-dome-squat-hold':'Pietupiena noturēšana uz pusbumbas','balance-dome-plank':'Balsts uz pusbumbas'};return '<section class="lb-balance-block"><div><span>ATSEVIŠĶS BLOKS · BEZ SVARIEM</span><h3>Līdzsvara pusbumba</h3><b>'+lbClock(p.balanceSeconds)+'</b></div><h4>'+names[x.id]+'</h4>'+lbPoseImages(x.id,true)+'<p>'+p.balanceSeconds/60+' apļi: 30 s vingrinājums un 30 s atpūta. Veic pēc galvenajiem apļiem, bez hantelēm un stieņa.</p><ol>'+x.instructions.map(step=>'<li>'+safe(step)+'</li>').join('')+'</ol><p>Izmanto attēlā un instrukcijā norādīto pusi, kustoties sev kontrolējamā amplitūdā. Ja vajag, atbalsties pie stabila balsta.</p></section>';}

function lbSyncBuilder(){if(lbBuilderProfile===activeProfile)return;lbBuilderProfile=activeProfile;const o=state.workoutBuilder||{};lbTarget=[10,15,20,25,30,35,40,45,50,55,60].includes(o.minutes)?o.minutes:25;lbBuildLevel=['easy','medium','hard'].includes(o.level)?o.level:'medium';lbBuildFocus=lbFocusOptions().some(([v])=>v===o.focus)?o.focus:lbIsLiva()?'dance':'full';lbBuildEquipment=LB_BUILD_EQUIPMENT.some(x=>x[0]===o.equipment)?o.equipment:'none';lbBuildBalance=!!o.balance;}
function lbRememberBuilder(){state.workoutBuilder={minutes:lbTarget,level:lbBuildLevel,focus:lbBuildFocus,equipment:lbBuildEquipment,balance:lbBuildBalance};save();}
function lbWorkoutDuration(){return lbDay().plan?lbDay().plan.minutes+' min plānā':lbTimeSummary(lbDay().ids);}
function lbBuilderUI(workout){return '<section class="lb-builder lb-auto"><div class="lb-auto-heading"><span>TAVS LAIKS. TAVA SLODZE.</span><h3>Saliec man treniņu</h3></div><div class="lb-auto-time"><label for="lb-build-time">Treniņa ilgums</label><output id="lb-duration-value" for="lb-build-time">'+lbTarget+' <small>min</small></output></div><input id="lb-build-time" type="range" min="10" max="60" step="5" value="'+lbTarget+'" aria-label="Treniņa ilgums minūtēs"><div class="lb-duration">'+[10,20,30,45,60].map(m=>'<button type="button" data-lb="duration" data-value="'+m+'" aria-pressed="'+(lbTarget===m)+'" class="'+(lbTarget===m?'selected':'')+'">'+m+' min</button>').join('')+'</div><span class="lb-auto-label">GRŪTĪBA</span><div class="lb-auto-levels" role="group" aria-label="Treniņa grūtība">'+[['easy','Viegli','Mierīgs temps'],['medium','Vidēji','Līdzsvarota slodze'],['hard','Grūti','Vairāk darba, īsāka atpūta']].map(([v,l,n])=>'<button type="button" data-lb="build-level" data-value="'+v+'" class="'+(lbBuildLevel===v?'selected':'')+'" aria-pressed="'+(lbBuildLevel===v)+'" '+(lbBuildFocus==='recovery'&&v!=='easy'?'disabled':'')+'><strong>'+l+'</strong><small>'+n+'</small></button>').join('')+'</div><div class="lb-build-inputs"><label>Mērķis<select data-lb-select="focus">'+lbFocusOptions().map(([v,l])=>'<option value="'+v+'" '+(lbBuildFocus===v?'selected':'')+'>'+l+'</option>').join('')+'</select></label><label>Pieejamais inventārs<select data-lb-select="build-equipment">'+LB_BUILD_EQUIPMENT.map(([v,l])=>'<option value="'+v+'" '+(lbBuildEquipment===v?'selected':'')+'>'+l+'</option>').join('')+'</select></label></div>'+lbBalanceToggle()+'<button type="button" class="lb-generate" data-lb="generate">'+(workout.ids.length?'↻ Sagatavot citu variantu':'✦ Atlasīt vingrinājumus')+'</button>'+(workout.ids.length?'<p class="lb-auto-note">Aizstās izvēlētās dienas komplektu.</p>':'')+'</section>';}
function lbClock(seconds){return Math.floor(seconds/60)+' min'+(seconds%60?' '+seconds%60+' s':'');}
function lbPlanSummary(workout){const p=workout.plan;if(!p)return '';if(p.kind==='kettlebell-reps'){return '<section class="lb-plan-summary"><div><span>SVARBUMBU TRENIŅŠ</span><strong>'+safe(p.title)+' · ~'+p.minutes+' min</strong></div><div class="lb-plan-badges"><span>'+p.rounds+(p.circuit?' apļi':' piegājieni')+'</span><span>'+p.restSeconds+' s atpūta</span><span>5 / 10 / 15 kg</span></div><p>'+(p.warmupSeconds/60)+' min iesildīšanās: soļošana, viegli pietupieni, gurnu atvirzīšana bez svara un plecu kustības. Pēc treniņa '+(p.cooldownSeconds/60)+' min mierīga atsildīšanās.</p><p>'+(p.circuit?'Izpildi vienu piegājienu no katra vingrinājuma, tad atkārto apli.':'Pabeidz visus viena vingrinājuma piegājienus pirms nākamā. Vienpusējiem vingrinājumiem izpildi abas puses.')+' Atpūties ilgāk, ja nepieciešams. Atstāj 2-3 kvalitatīvus atkārtojumus rezervē.</p><p>Norādītais svars ir sākuma ieteikums, nevis pienākums. Ja 5 kg ir par smagu, izlaid vai aizstāj vingrinājumu. Pārej uz nākamo svaru tikai tad, kad visi piegājieni augšējā atkārtojumu robežā izdodas ar tīru tehniku un 2-3 atkārtojumu rezervi. Smagu kāju slodzi neplāno tieši pirms '+(lbIsLiva()?'deju mēģinājuma vai koncerta':'spēles')+'.</p><button type="button" class="lb-plan-build" data-lb="builder">Mainīt iestatījumus</button></section>';}return '<section class="lb-plan-summary"><div><span>TAVS SAGATAVOTAIS PLĀNS</span><strong>'+p.minutes+' min <small>· '+({easy:'viegli',medium:'vidēji',hard:'grūti'})[p.level]+'</small></strong></div><div class="lb-plan-badges"><span>'+p.rounds+' apļi</span><span>'+p.workSeconds+' s darbs</span><span>'+p.restSeconds+' s atpūta</span><span>'+safe(LB_BUILD_EQUIPMENT.find(x=>x[0]===p.equipment)?.[1]||'Paša svars')+'</span></div><p>2 min iesildīšanās · '+p.roundRestSeconds+' s starp apļiem · '+lbClock(p.cooldownSeconds)+' atsildīšanās.</p><p>'+p.ids.length+' vingrinājumi norādītajā secībā katrā aplī. Vienpusējos vingrinājumos pusi darba laika katrai pusei. Strādā kontrolēti; ja vajag, pagarini atpūtu.</p><button type="button" class="lb-plan-build" data-lb="builder">Mainīt iestatījumus</button></section>';}

function kbApply(p,target,level,focus,balance,automatic){
 if(p.advanced&&!confirm('Vēzieni paredzēti tikai pēc vilkmes un vēziena tehnikas apgūšanas. Vai tiešām vēlies šo programmu?'))return;
 const day=lbDay();
 if(day.ids.length&&!confirm('Aizstāt izvēlētās dienas treniņu ar svarbumbu programmu?'))return;
 const plan=kbPlanFor(p,target,level,focus,balance,automatic);
 if(!plan.ids.every(id=>lbEntry(id)&&kbMove(id))){toast('Neizdevās sagatavot svarbumbu programmu.');return;}
 day.ids=plan.ids.slice();lbResetFinished(day);day.plan=plan;
 // A replacement workout must not inherit old measured loads.
 day.loads={};
 lbTarget=Math.max(10,Math.min(60,Math.round(target/5)*5));lbBuildLevel=level;lbBuildFocus=focus;lbBuildEquipment='kettlebell';lbBuildBalance=!!plan.balanceSeconds;
 lbRememberBuilder();lbTab='mine';lbFocusId=null;lbSave();lbOpenWorkout();toast('Svarbumbu treniņš ir gatavs.');
}
function kbGenerate(){
 if(lbBuildFocus==='recovery'){toast('Atjaunošanās treniņam izvēlies bez inventāra. Svaru bumbas atstāj spēka dienai.');return;}
 const p=kbProgram(lbBuildFocus==='core'?'kb-core':lbIsLiva()&&lbBuildFocus==='dance'?'lv-kb-dance':lbIsLiva()&&lbBuildFocus==='weightloss'?'lv-kb-circuit':lbBuildFocus==='basket'?'kb-basket':lbBuildLevel==='easy'?'kb-start':'kb-full');
 if(p)kbApply(p,lbTarget,lbBuildLevel,lbBuildFocus,lbBuildBalance,true);
}

function lbGenerate(){
 if(lbBuildEquipment==='kettlebell')return kbGenerate();
 const target=Math.max(10,Math.min(60,Math.round(Number(lbTarget)/5)*5||25));
 const level=lbBuildFocus==='recovery'?'easy':lbBuildLevel,rank={easy:0,medium:1,hard:2},focus=lbBuildFocus;
 let pool=LB_AUTO_POOL.map(([id,pattern,support])=>({x:lbEntry(id),pattern,support})).filter(o=>o.x&&(!o.support||lbBuildEquipment==='support')&&rank[o.x.level]<=rank[level]);
 pool=pool.filter(o=>{const eq=o.x.equipment||'bodyweight';return eq==='bodyweight'||(lbBuildEquipment==='support'&&eq==='plyo_box')||eq===lbBuildEquipment;});
 if(focus==='core')pool=pool.filter(o=>o.pattern==='core');
 else if(focus==='recovery')pool=pool.filter(o=>['mobility','balance'].includes(o.pattern));
 else if(focus==='dance'||focus==='weightloss')pool=pool.filter(o=>o.pattern!=='mobility');else pool=pool.filter(o=>o.pattern!=='mobility'&&o.pattern!=='cardio');
 const count=Math.min(pool.length,target<15?4:target<25?5:target<40?6:8);
 if(count<3){toast('Šai izvēlei nepietiek vingrinājumu. Maini inventāru vai mērķi.');return;}
 // Give favorites a slight preference, then vary each generated plan.
 pool=pool.map(o=>({...o,score:Math.random()+(lbFaves().includes(o.x.id)?.35:0)})).sort((a,b)=>b.score-a.score);
 const patterns=focus==='core'?['core']:focus==='recovery'?['mobility','balance']:focus==='basket'?['lunge','balance','hinge','core','squat','push','pull','core']:focus==='dance'?['balance','lunge','hinge','core','cardio','squat','pull','balance']:focus==='weightloss'?['cardio','squat','push','hinge','cardio','pull','core','balance']:['squat','push','hinge','core','pull','lunge','balance','core'];
 const chosen=[];for(let i=0;i<count;i++){const candidates=pool.filter(o=>!chosen.some(c=>c.x.id===o.x.id));const desired=patterns[i%patterns.length];chosen.push(candidates.find(o=>o.pattern===desired)||candidates[0]);}
 if(level==='hard'&&!lbIsLiva()&&!chosen.some(o=>o.x.level==='hard')){const hard=pool.find(o=>o.x.level==='hard'&&!chosen.some(c=>c.x.id===o.x.id));if(hard)chosen[chosen.length-1]=hard;}
 const weighted=pool.filter(o=>o.x.equipment===lbBuildEquipment);
 if(['dumbbell','barbell','loop_band'].includes(lbBuildEquipment)&&weighted.length){
  const wanted=Math.min(2,weighted.length,count);for(const candidate of weighted){if(chosen.filter(o=>o.x.equipment===lbBuildEquipment).length>=wanted)break;if(chosen.some(o=>o.x.id===candidate.x.id))continue;let i=chosen.findIndex(o=>o.pattern===candidate.pattern&&o.x.equipment!==lbBuildEquipment);if(i<0)i=chosen.findIndex(o=>o.x.equipment!==lbBuildEquipment);if(i>=0)chosen[i]=candidate;}
 }
 // Each slot includes work and transition/rest. The complete planned total matches the selected time.
 const balanceSeconds=lbBuildBalance?(target<20?120:180):0;
 const rounds=Math.max(balanceSeconds&&target<15?1:2,Math.round((target*60-180-balanceSeconds)/(count*60+60))),roundRestSeconds=60,slots=count*rounds;
 const available=target*60-240-balanceSeconds-(rounds-1)*roundRestSeconds,slotSeconds=Math.floor(available/slots/5)*5;
 const workSeconds=Math.max(15,Math.min(level==='easy'?35:level==='medium'?45:60,Math.floor(slotSeconds*({easy:.5,medium:.65,hard:.75})[level]/5)*5)),restSeconds=slotSeconds-workSeconds;
 const day=lbDay();day.ids=chosen.map(o=>o.x.id);lbResetFinished(day);
 day.plan={minutes:target,level,focus,equipment:lbBuildEquipment,balanceSeconds,balanceExerciseId:balanceSeconds?({easy:'balance-dome-stand',medium:'balance-dome-squat-hold',hard:'balance-dome-plank'})[level]:null,rounds,workSeconds,restSeconds,roundRestSeconds,warmupSeconds:120,cooldownSeconds:120+(available-slotSeconds*slots),ids:[...day.ids]};
 lbTarget=target;lbBuildLevel=level;lbRememberBuilder();lbTab='mine';lbFocusId=null;lbSave();lbOpenWorkout();toast('Tavs '+target+' minūšu treniņš ir gatavs.');
}
document.addEventListener('click',event=>{
 const target=event.target.closest('[data-lb]');if(!target)return;
 const act=target.dataset.lb,id=target.dataset.id;
 if(act==="program-fav-filter"){lbProgramFavOnly=!lbProgramFavOnly;render();return}
 if(act==="program-favorite"){if(!lbAvailablePrograms().some(p=>p.id===id))return;state.programFavorites=Array.isArray(state.programFavorites)?state.programFavorites:[];const i=state.programFavorites.indexOf(id);if(i>=0)state.programFavorites.splice(i,1);else state.programFavorites.push(id);save();render();return}
 if(act==="more"){lbVisible+=24;render();return}
 if(["level","group","fav-filter","recent-filter","clear"].includes(act))lbVisible=24;
 if(act==="open-workout"){lbOpenWorkout();return}
 if(act==="return-builder"){lbFocusId=null;lbTab="mine";go("majasha");return}
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
 if(act==="program"){if(!lbAvailablePrograms().some(p=>p.id===id))return;window.fitOpenRoutine=id;go("fitroutine");return}
 if(act==="quick"){lbTab="mine";lbBuildFocus=target.dataset.value==='movement'?(lbIsLiva()?'dance':'basket'):target.dataset.value;lbBuildLevel=lbBuildFocus==='recovery'?'easy':'medium';lbRememberBuilder();render();return}
 if(act==="duration"){lbTarget=Number(target.dataset.value);lbRememberBuilder();render();return}
 if(act==="build-level"){if(lbBuildFocus==='recovery')return;lbBuildLevel=target.dataset.value;lbRememberBuilder();render();return}
 if(act==="builder"){const p=lbDay().plan;if(p){lbTarget=Math.max(10,Math.min(60,Math.round((p.targetMinutes||p.minutes)/5)*5));lbBuildLevel=p.level;lbBuildFocus=p.focus;lbBuildEquipment=p.equipment;lbBuildBalance=!!p.balanceSeconds;lbRememberBuilder();lbTab="mine";go("majasha");}return}
 if(act==="gear-combo"){const c=LB_GEAR_COMBOS.find(c=>c.id===target.dataset.value);if(!c)return;lbBuildEquipment=c.equipment;lbBuildBalance=c.balance;lbBuildFocus=lbIsLiva()&&c.focus==='basket'?'dance':c.focus;if(c.focus==='recovery')lbBuildLevel='easy';lbRememberBuilder();render();return}
 if(act==="generate"){lbGenerate();return}
 if(act==='kb-plan'){const p=kbProgram(id);if(p&&lbAvailablePrograms().some(x=>x.id===id))kbApply(p,p.minutes,p.level==='VIEGLS'?'easy':p.advanced?'hard':'medium',p.kind==='core'?'core':p.kind==='dance'?'dance':p.kind==='weightloss'?'weightloss':p.kind==='basket'?'basket':'strength',false,false);return}
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
 if(event.target?.dataset?.lbLoad){const id=event.target.dataset.lbLoad,raw=event.target.value.trim().replace(',','.');if(lbEntry(id)?.equipment==='kettlebell'&&raw!==''&&![0,...KB_WEIGHTS].includes(Number(raw))){toast('Izvēlies 5, 10 vai 15 kg.');return;}if(!raw){if(lbDay().loads)delete lbDay().loads[id];save();return;}const value=Number(raw);if(!Number.isFinite(value)||value<0||value>100){toast('Ievadi izmantoto kopējo svaru no 0 līdz 100 kg.');event.target.value=lbDay().loads?.[id]??'';return;}lbDay().loads??={};lbDay().loads[id]=value;save();return}
 if(event.target?.id==='lb-build-time'){lbTarget=Number(event.target.value);lbRememberBuilder();render();return}
 if(event.target?.id==='lb-date'){const date=event.target.value;if(/^\d{4}-\d{2}-\d{2}$/.test(date)){lbWorkDate=date;render()}return}
 const key=event.target?.dataset?.lbSelect;
 if(key==='equipment'){lbEquipment=event.target.value;lbVisible=24;render();return}
 if(key==='focus'){lbBuildFocus=event.target.value;if(lbBuildFocus==='recovery')lbBuildLevel='easy';lbRememberBuilder();render()}
 if(key==='build-level'){lbBuildLevel=event.target.value;lbRememberBuilder();render()}
 if(key==='balance-block'){lbBuildBalance=event.target.checked;lbRememberBuilder();render();return}
 if(key==='build-equipment'){lbBuildEquipment=event.target.value;lbRememberBuilder();render()}
});
render();
