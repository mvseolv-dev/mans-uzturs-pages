/* MANS UZTURS ACTIVE - exercise library v1. Licensed static illustrations: repdb.co */
const WL_EXERCISES=[
 {id:"ankle",name:"Potīšu mobilitāte",level:"easy",cat:"Mobilitāte",sets:"1 x 10 katrai kājai",minutes:3,desc:"Celi virzi pāri pēdai bez papēža atraušanas. Ja attēlā izmantots paaugstinājums, tam jābūt stabilam.",cues:["Papēdis uz atbalsta","Bez sāpēm","Lēna amplitūda"],img:["main"]},
 {id:"hips",name:"Gurnu priekšpuses stiepšana",level:"easy",cat:"Mobilitāte",sets:"2 x 30 s katrā pusē",minutes:3,desc:"Pusceļos maigi virzi gurnus uz priekšu. Sasprindzini sēžas muskuļus un neizliec muguras lejasdaļu.",cues:["Mugura neitrāla","Vieglas stiepšanās sajūta","Elpo mierīgi"],img:["main"]},
 {id:"deadbug",name:"Dead bug",level:"easy",cat:"Korpuss",sets:"2 x 8 katrai pusei",minutes:4,desc:"Guļus uz muguras izstiep pretējo roku un kāju, saglabājot stabilu korpusu.",cues:["Jostas daļa stabila","Kusties lēni","Izelpo izstiepjoties"],img:["start","peak"]},
 {id:"calf",name:"Ikru pacelšanās",level:"easy",cat:"Kājas",sets:"3 x 12-15",minutes:4,desc:"Pacelies uz pirkstgaliem un lēni nolaidies. Kad kļūst viegli, pārej uz vienas kājas variantu.",cues:["Nelec","Noturi augšā 1 s","Kontrolē nolaišanos"],img:["start","peak"]},
 {id:"bridge",name:"Gurnu tiltiņš",level:"easy",cat:"Kājas",sets:"2 x 12-15",minutes:4,desc:"No guļus pozīcijas pacel gurnus, sasprindzinot sēžu. Nekompensē ar muguras izliekšanu.",cues:["Pēdas uz grīdas","Gurni uz augšu","Izelpo augšā"],img:["start","peak"]},
 {id:"bird",name:"Bird-dog",level:"easy",cat:"Korpuss",sets:"2 x 8 katrai pusei",minutes:4,desc:"Četrrāpus izstiep pretējo roku un kāju. Saglabā gurnus paralēlus grīdai.",cues:["Nesagriez gurnus","Galva neitrāli","Noturi 2 s"],img:["start","peak"]},
 {id:"squat",name:"Pietupiens ar ķermeņa svaru",level:"easy",cat:"Kājas",sets:"2 x 12",minutes:4,desc:"Pietupies ar pēdām aptuveni plecu platumā. Virzi gurnus atpakaļ un turi līdzsvaru.",cues:["Pēdas stabili","Ceļgali seko pēdām","Taisna mugura"],img:["start","peak"]},
 {id:"wallsit",name:"Sēdiens pie sienas",level:"easy",cat:"Kājas",sets:"2 x 30-45 s",minutes:4,desc:"Atspied muguru pret sienu un pietupies līdz ērtai pozīcijai. Noturi bez kustības.",cues:["Pēdas nedaudz priekšā","Nesāp ceļi","Elpo vienmērīgi"],img:["main"]},
 {id:"catcow",name:"Kaķa-govs muguras mobilitāte",level:"easy",cat:"Mobilitāte",sets:"2 x 8",minutes:3,desc:"Četrrāpus pārmaiņus lēnām noapaļo un izstiep muguru.",cues:["Kusties lēni","Bez sāpēm","Saskaņo ar elpu"],img:["main"]},
 {id:"butterfly",name:"Gurnu atvēršana sēdus",level:"easy",cat:"Mobilitāte",sets:"2 x 30 s",minutes:3,desc:"Sēdus saliec pēdas kopā un atslābini ceļus sānis. Nekādā gadījumā nespied ar spēku.",cues:["Mugura gara","Pleci brīvi","Mierīga stiepšana"],img:["main"]},
 {id:"kickback",name:"Sēžas muskuļu aktivācija",level:"easy",cat:"Kājas",sets:"2 x 12 katrai kājai",minutes:4,desc:"Četrrāpus spied vienu kāju uz aizmuguri un augšu, nekustinot muguru.",cues:["Gurni stabili","Nepārspīlē amplitūdu","Sasprindzini sēžu"],img:["start","peak"]},
 {id:"kneechest",name:"Celis pie krūtīm guļus",level:"easy",cat:"Mobilitāte",sets:"2 x 20-30 s katrai kājai",minutes:3,desc:"Guļus uz muguras saudzīgi pievelc vienu celi krūtīm. Otru kāju turi ērtā pozīcijā.",cues:["Nevajag raut","Pleci uz grīdas","Vienmērīga elpa"],img:["main"]},
 {id:"reverse",name:"Izklupiens atpakaļ",level:"medium",cat:"Kājas",sets:"3 x 8 katrai kājai",minutes:5,desc:"Sper soli atpakaļ, nolaid celi un atgriezies ar priekšējās kājas spēku.",cues:["Priekšējā pēda stabili","Celis pēdas virzienā","Bez steigas"],img:["start","peak"]},
 {id:"push",name:"Atspiešanās no grīdas",level:"medium",cat:"Augšdaļa",sets:"3 x 8-15",minutes:5,desc:"Saglabā ķermeni vienā līnijā, nolaid krūtis kontrolēti un izspiedies augšup.",cues:["Vēders sasprindzināts","Elkoņi ap 30-45°","Mugura taisna"],img:["start","peak"]},
 {id:"rdl",name:"Vienas kājas rumāņu vilkme",level:"medium",cat:"Kājas",sets:"2 x 8 katrai kājai",minutes:5,desc:"Uz vienas kājas virzi gurnus atpakaļ, otru kāju izstiepjot aiz sevis. Nepagriez gurnus.",cues:["Līdzsvars vispirms","Mugura neitrāla","Lēna nolaišanās"],img:["start","peak"]},
 {id:"bulgarian",name:"Bulgāru pietupiens",level:"medium",cat:"Kājas",sets:"2 x 8 katrai kājai",minutes:5,desc:"Aizmugurējā pēda uz stabila atbalsta. Nolaidies kontrolēti un celies ar priekšējo kāju.",cues:["Stabils atbalsts","Nepārspīlē dziļumu","Nepildi līdz izsīkumam"],img:["start","peak"]},
 {id:"sideplank",name:"Sānu planks",level:"medium",cat:"Korpuss",sets:"2 x 30-40 s katrā pusē",minutes:4,desc:"Atbalsts uz viena apakšdelma. Pacel gurnus un turi taisnu līniju.",cues:["Elkonis zem pleca","Gurni nekrīt","Elpo mierīgi"],img:["main"]},
 {id:"lateral",name:"Sānu izklupiens",level:"medium",cat:"Kājas",sets:"2 x 8 katrā pusē",minutes:5,desc:"Sper platu soli sānis, saliec atbalsta kāju un virzi gurnus atpakaļ.",cues:["Pēdas uz priekšu","Svars uz saliektās kājas","Kontrolē kustību"],img:["start","peak"]},
 {id:"planktap",name:"Planks ar plecu pieskārieniem",level:"medium",cat:"Korpuss",sets:"2 x 10 katrai rokai",minutes:4,desc:"Augstā plankā pārmaiņus pieskaries pretējam plecam. Attēls rāda sākuma planku.",cues:["Gurni nesvārstās","Kājas mazliet platāk","Lēns ritms"],img:["main"]},
 {id:"stepup",name:"Uzkāpšana uz sola",level:"medium",cat:"Kājas",sets:"2 x 10 katrai kājai",minutes:5,desc:"Uzkāp uz stingra, zema paaugstinājuma, iztaisno kāju un lēni nokāp.",cues:["Atbalsts neslīd","Nepalīdz ar atspērienu","Kontrolē nokāpšanu"],img:["start","peak"]},
 {id:"singlecalf",name:"Ikru pacelšanās uz vienas kājas",level:"medium",cat:"Kājas",sets:"2 x 10-12 katrai kājai",minutes:4,desc:"Balansējot uz vienas kājas, lēni pacel un nolaid papēdi.",cues:["Pieturies līdzsvaram","Nelec","Pilna, ērta amplitūda"],img:["start","peak"]},
 {id:"bearplank",name:"Lāča planks",level:"medium",cat:"Korpuss",sets:"3 x 20-30 s",minutes:4,desc:"Četrrāpus pacel ceļus dažus centimetrus no grīdas un noturi stabilu ķermeni.",cues:["Rokas zem pleciem","Ceļi zemu","Vēders sasprindzināts"],img:["main"]},
 {id:"mountain",name:"Mountain climbers",level:"medium",cat:"Pilns ķermenis",sets:"3 x 25 s",minutes:5,desc:"Augstā plankā pārmaiņus virzi celi krūtīm, nesvārstot gurnus.",cues:["Sākumā lēnā tempā","Rokas zem pleciem","Turi ritmu"],img:["start","peak"]},
 {id:"split",name:"Statisks izklupiens",level:"medium",cat:"Kājas",sets:"2 x 10 katrai kājai",minutes:5,desc:"No izklupiena pozīcijas nolaidies vertikāli lejup un celies augšā, nemainot pēdu vietu.",cues:["Priekšējais papēdis pie grīdas","Kustība augšup un lejup","Līdzsvars"],img:["start","peak"]},
 {id:"singlebridge",name:"Gurnu tiltiņš uz vienas kājas",level:"medium",cat:"Kājas",sets:"2 x 10 katrai kājai",minutes:5,desc:"Guļus pacel gurnus ar vienu atbalsta kāju. Neļauj iegurnim sagriezties.",cues:["Gurni vienā līmenī","Sēžas muskuļi aktīvi","Lēna nolaišana"],img:["start","peak"]},
 {id:"hollow",name:"Hollow hold",level:"medium",cat:"Korpuss",sets:"3 x 20-30 s",minutes:4,desc:"Guļus noturi sasprindzinātu vēderu ar rokām un kājām virs grīdas. Ja grūti, saliec ceļus.",cues:["Mugura piespiesta grīdai","Neaizturi elpu","Īsāks laiks ir labi"],img:["main"]},
 {id:"jumpsquat",name:"Pietupiens ar lēcienu",level:"hard",cat:"Sprādzienveida",sets:"3 x 5",minutes:5,desc:"Pietupies mēreni, lec vertikāli un piezemējies mīksti. Veic tikai labi atjaunojies.",cues:["Klusa piezemēšanās","Ceļi seko pēdām","Pilnīga atpūta starp sērijām"],img:["start","peak"]},
 {id:"burpees",name:"Burpees",level:"hard",cat:"Pilns ķermenis",sets:"3 x 6-10",minutes:6,desc:"No stāvus pārej plankā, atgriez kājas pie rokām un piecelies vai palecies.",cues:["Mugura stabila plankā","Kontrolē piezemēšanos","Izvēlies savu tempu"],img:["main"]},
 {id:"pike",name:"Pike atspiešanās",level:"hard",cat:"Augšdaļa",sets:"3 x 5-8",minutes:5,desc:"No apgriezta V stāvokļa saliec elkoņus un tuvojies ar galvu grīdai, tad izspiedies atpakaļ.",cues:["Gurni augstu","Rokas stabilas","Galva kontrolēti"],img:["start","peak"]},
 {id:"pistol",name:"Pietupiens uz vienas kājas",level:"hard",cat:"Kājas",sets:"3 x 4-6 katrai kājai",minutes:6,desc:"Uz vienas kājas lēnām nolaidies pietupienā ar otru kāju priekšā. Sāc pie stabila atbalsta.",cues:["Tikai ja pietiek mobilitātes","Nekrīti lejup","Pie vajadzības atbalsts"],img:["start","peak"]},
 {id:"copenhagen",name:"Kopenhāgenas planks",level:"hard",cat:"Korpuss",sets:"2 x 15-25 s katrā pusē",minutes:5,desc:"Sānu plankā augšējo kāju novieto uz stabila paaugstinājuma, noturi gurnus paceltus.",cues:["Stabils atbalsts","Bez sāpēm cirksnī","Sāc ar īsāku laiku"],img:["main"]},
 {id:"cossack",name:"Kazaku pietupiens",level:"hard",cat:"Kājas",sets:"2 x 6 katrā pusē",minutes:6,desc:"Plati stāvus pārnes svaru uz vienu kāju, pietupies sānis un otru kāju iztaisno.",cues:["Nespied amplitūdu","Papēdis atbalstīts","Kusties lēni"],img:["start","peak"]},
 {id:"plyolunge",name:"Izklupieni ar lēcienu",level:"hard",cat:"Sprādzienveida",sets:"3 x 5 katrai kājai",minutes:6,desc:"No izklupiena pārlec un samaini kājas gaisā. Augsta slodze ceļiem un cīpslām.",cues:["Iepriekš apgūsti izklupienus","Mīksta piezemēšanās","Nedari pirms spēles"],img:["start","peak"]},
 {id:"clappush",name:"Atspiešanās ar plaukšķi",level:"hard",cat:"Augšdaļa",sets:"3 x 3-6",minutes:5,desc:"No atspiešanās izspiedies pietiekami eksplozīvi, lai plaukstas atrautos no grīdas. Pieredzējušiem.",cues:["Tikai ar labu tehniku","Pilnīga plaukstu kontrole","Izvairies, ja sāp plaukstas"],img:["start","peak"]},
 {id:"bearcrawl",name:"Lāča rāpošana",level:"hard",cat:"Pilns ķermenis",sets:"3 x 15-20 m",minutes:6,desc:"Rāpo uz rokām un pēdām, ceļus turot tuvu grīdai un ķermeni stabilu.",cues:["Gurni zemu","Pretēja roka un kāja","Vienmērīga elpa"],img:["start","peak"]},
 {id:"sideplanklift",name:"Sānu planks ar kājas pacelšanu",level:"hard",cat:"Korpuss",sets:"2 x 8 katrā pusē",minutes:5,desc:"Sānu plankā kontrolēti pacel augšējo kāju, nepagriežot gurnus.",cues:["Sāc ar parasto sānu planku","Gurni saglabājas augstu","Neliela amplitūda pietiek"],img:["start","peak"]}
];
const WL_LEVELS=[["easy","Viegli"],["medium","Vidēji"],["hard","Sarežģīti"]];
let wlFilter="medium",wlFocus="Visi",wlSearch="",wlOnlyFavorites=false,wlDetail=null;
const wlCategoryNames=["Visi","Kājas","Korpuss","Mobilitāte","Augšdaļa","Pilns ķermenis","Sprādzienveida"];
function wlEntry(id){return WL_EXERCISES.find(x=>x.id===id)||null}
function wlFavs(){return Array.isArray(state.favoriteExercises)?state.favoriteExercises:[]}
function wlSelected(){const data=state.myWorkoutByDate?.[fitToday()];return Array.isArray(data)?data.filter(x=>!!wlEntry(x)):[]}
function wlDone(){const data=state.exerciseChecks||{};return id=>!!data[fitToday()+"|custom|"+id]}
function wlPicture(id,pose){return "./assets/exercises/"+id+"-"+pose+".webp"}
function wlThumbnail(ex){return wlPicture(ex.id,ex.img[ex.img.length-1])}
function wlCredit(){return '<div class="wl-credit">Vingrinājumu ilustrācijas: <a href="https://repdb.co" target="_blank" rel="noopener noreferrer">RepDB (repdb.co)</a>. Attēli ir ilustratīvi.</div>'}
function wlLevelLabel(level){return WL_LEVELS.find(x=>x[0]===level)?.[1]||"Vidēji"}
function wlCount(level){return WL_EXERCISES.filter(x=>x.level===level).length}
function wlCard(ex){
 const selected=wlSelected().includes(ex.id),fav=wlFavs().includes(ex.id);
 return '<article class="wl-card"><button class="wl-card-media" type="button" data-wl-open="'+ex.id+'" aria-label="Apskatīt '+safe(ex.name)+'"><img src="'+wlThumbnail(ex)+'" alt="'+safe(ex.name)+' - vingrinājuma ilustrācija" loading="lazy" decoding="async"><span class="wl-card-arrow">↗</span></button>'+
 '<div class="wl-card-content"><div class="wl-card-label">'+safe(ex.cat)+' · '+ex.minutes+' MIN</div><button class="wl-card-name" type="button" data-wl-open="'+ex.id+'">'+safe(ex.name)+'</button><div class="wl-card-sets">'+safe(ex.sets)+'</div><div class="wl-card-actions"><button type="button" class="wl-favorite '+(fav?'selected':'')+'" data-wl-fav="'+ex.id+'" aria-label="'+(fav?'Izņemt no favorītiem':'Pievienot favorītiem')+'" aria-pressed="'+fav+'">'+(fav?'♥':'♡')+'</button><button type="button" class="wl-add '+(selected?'selected':'')+'" data-wl-toggle="'+ex.id+'">'+(selected?'✓ Pievienots':'+ Izvēlēties')+'</button></div></div></article>';
}
function wlRoutineCard(r){
 const id=r.moves[0],ex=wlEntry(id),pic=ex?wlThumbnail(ex):wlThumbnail(WL_EXERCISES[0]);
 return '<button class="wl-routine" data-wl-routine="'+r.id+'"><div class="wl-routine-photo"><img src="'+pic+'" alt="Vingrinājuma '+safe(ex?.name||'')+' ilustrācija" loading="lazy"></div><div class="wl-routine-info"><span>'+r.label+' · '+r.minutes+' MIN</span><h3>'+safe(r.title)+'</h3><p>'+r.moves.length+' vingrinājumi · '+r.level+'</p></div><span class="wl-routine-arrow">↗</span></button>';
}
function wlRecommendation(){
 const now=fitToday(),today=plannerSessions().filter(x=>x.date===now&&fitPossible(x)),tomorrowDate=new Date(now+'T12:00:00Z');tomorrowDate.setUTCDate(tomorrowDate.getUTCDate()+1);
 const tomorrow=dateISO(tomorrowDate),next=plannerSessions().filter(x=>x.date===tomorrow&&fitPossible(x));
 const busy=[...today,...next].some(x=>["Basketbols","BUKI","Spēle"].includes(x.type));
 return busy?{level:"easy",title:"Spēle vai basketbols tuvumā",desc:"Izvēlies mobilitāti vai vieglu korpusa aktivāciju. Atstāj kājām spēku laukumam."}:{level:"medium",title:"Šodien vari izvēlēties vidēju slodzi",desc:"Spēks un stabilitāte ir labs papildinājums basketbolam, ja jūties atjaunojies."};
}
function renderFitnessHome(){
 if(activeProfile==='liva')return renderDay();
 const recommend=wlRecommendation(),selected=wlSelected(),filtered=WL_EXERCISES.filter(x=>(wlFilter==="all"||x.level===wlFilter)&&(wlFocus==="Visi"||x.cat===wlFocus)&&(!wlOnlyFavorites||wlFavs().includes(x.id))&&(x.name+" "+x.cat).toLocaleLowerCase('lv-LV').includes(wlSearch.toLocaleLowerCase('lv-LV')));
 return '<div class="ap-screen wl-page"><div class="wl-header"><div><span>WORKOUT STUDIO</span><h1>Tavs treniņš.<br><em>Tava izvēle.</em></h1><p>36 vingrinājumi. Izvēlies savu slodzi un saliec šodienas programmu.</p></div><div class="wl-studio-mark">✳</div></div>'+
 '<div class="wl-recommend"><div class="wl-recommend-symbol">◎</div><div><strong>'+recommend.title+'</strong><p>'+recommend.desc+'</p></div><button data-wl-level="'+recommend.level+'">Skatīt ↗</button></div>'+
 '<button class="wl-builder-cta" data-wl-custom><div><small>ŠODIENAS TRENIŅŠ</small><strong>'+selected.length+' izvēlēti vingrinājumi</strong><span>'+Math.max(0,selected.reduce((n,id)=>n+(wlEntry(id)?.minutes||0),0))+' min + iesildīšanās</span></div><span>Atvērt ↗</span></button>'+
 '<div class="wl-section-head"><div><span>GATAVS KOMPLEKTS</span><h2>Treniņu programmas</h2></div></div><div class="wl-routines">'+ACTIVE_PROGRAMS.map(wlRoutineCard).join('')+'</div>'+
 '<div class="wl-section-head"><div><span>ATRODI SAVU VINGRINĀJUMU</span><h2>Vingrinājumu bibliotēka</h2></div><b>'+WL_EXERCISES.length+' kopā</b></div>'+
 '<div class="wl-filters" role="group" aria-label="Grūtības līmenis">'+[["all","Visi",WL_EXERCISES.length],...WL_LEVELS.map(([id,label])=>[id,label,wlCount(id)])].map(([id,label,n])=>'<button type="button" data-wl-level="'+id+'" class="'+(wlFilter===id?'on':'')+'" aria-pressed="'+(wlFilter===id)+'">'+label+' <small>'+n+'</small></button>').join('')+'</div>'+
 '<div class="wl-search-row"><label class="wl-search"><span>⌕</span><input id="wl-search" type="search" value="'+safe(wlSearch)+'" placeholder="Meklēt vingrinājumu..." aria-label="Meklēt vingrinājumu"></label><button type="button" class="wl-only-faves '+(wlOnlyFavorites?'on':'')+'" data-wl-onlyfav aria-pressed="'+wlOnlyFavorites+'" aria-label="Rādīt tikai favorītus">♥</button></div>'+
 '<div class="wl-categories">'+wlCategoryNames.map(x=>'<button data-wl-cat="'+x+'" class="'+(wlFocus===x?'on':'')+'" aria-pressed="'+(wlFocus===x)+'">'+x+'</button>').join('')+'</div>'+
 '<div class="wl-library-count">'+filtered.length+' vingrinājumi · '+(wlFilter==="all"?'visi līmeņi':wlLevelLabel(wlFilter))+'</div>'+
 (filtered.length?'<div class="wl-grid">'+filtered.map(wlCard).join('')+'</div>':'<div class="wl-empty">Šim filtram nav vingrinājumu. Izvēlies citu kategoriju vai atcel meklēšanu.</div>')+
 '<div class="wl-safety">Sarežģītos lēcienu vingrinājumus neveic pirms spēles vai pēc ļoti smagas basketbola dienas. Iesildies 5-10 min, netrenējies caur sāpēm un sāc ar mazāku apjomu.</div>'+wlCredit()+'</div>';
}
function wlPoses(ex){
 const labels=ex.img.length===1?["POZĪCIJA"]:["01 · SĀKUMS","02 · KUSTĪBA"];
 return '<div class="wl-poses '+(ex.img.length===1?'one':'')+'">'+ex.img.map((pose,i)=>'<figure><img src="'+wlPicture(ex.id,pose)+'" alt="'+safe(ex.name)+' - '+labels[i]+'" loading="lazy" decoding="async"><figcaption>'+labels[i]+'</figcaption></figure>').join('')+'</div>';
}
function wlDetailedExercise(ex,index,programId){
 const selected=wlSelected().includes(ex.id),checked=!!state.exerciseChecks?.[fitToday()+'|'+programId+'|'+ex.id];
 const video=ACTIVE_VIDEOS?.[ex.id];
 return '<article class="wl-exercise"><div class="wl-ex-head"><span>'+String(index+1).padStart(2,'0')+' / '+safe(ex.cat)+' · '+wlLevelLabel(ex.level)+'</span><button data-wl-fav="'+ex.id+'" aria-label="Pievienot favorītiem">'+(wlFavs().includes(ex.id)?'♥':'♡')+'</button></div><h3>'+safe(ex.name)+'</h3><div class="wl-ex-sets">'+safe(ex.sets)+' · ~'+ex.minutes+' min</div>'+
 wlPoses(ex)+'<div class="wl-ex-instructions"><b>KĀ PAREIZI IZPILDĪT</b><p>'+safe(ex.desc)+'</p><ul>'+ex.cues.map(c=>'<li>✓ '+safe(c)+'</li>').join('')+'</ul></div>'+
 '<div class="wl-ex-buttons"><button data-wl-toggle="'+ex.id+'" class="'+(selected?'selected':'')+'">'+(selected?'✓ Manā treniņā':'+ Pievienot treniņam')+'</button><button data-wl-done="'+ex.id+'" data-wl-program="'+programId+'" class="'+(checked?'selected':'')+'">'+(checked?'✓ Paveikts':'○ Atzīmēt')+'</button>'+(video?'<button data-ap-video="'+ex.id+'" class="wl-video-button">▶ Video</button>':'')+'</div></article>';
}
function wlDetailView(id){
 const ex=wlEntry(id);if(!ex)return renderFitnessHome();
 const selected=wlSelected().includes(id);
 return '<div class="ap-screen wl-page"><button class="wl-back" data-nav="majasha">‹ VINGRINĀJUMU BIBLIOTĒKA</button>'+
 '<div class="wl-detail-heading"><span>'+wlLevelLabel(ex.level).toUpperCase()+' / '+ex.cat.toUpperCase()+'</span><h1>'+safe(ex.name)+'</h1><p>'+safe(ex.sets)+' · apmēram '+ex.minutes+' min</p></div>'+
 wlDetailedExercise(ex,0,'custom')+
 '<button class="wl-wide-action" data-wl-toggle="'+id+'">'+(selected?'✓ Izņemt no šodienas treniņa':'+ Pievienot šodienas treniņam')+'</button>'+wlCredit()+'</div>';
}
function wlCustomView(){
 const ids=wlSelected(),done=wlDone(),complete=ids.filter(done).length;
 const estimated=ids.reduce((sum,id)=>sum+(wlEntry(id)?.minutes||0),0);
 return '<div class="ap-screen wl-page"><button class="wl-back" data-nav="majasha">‹ ATPAKAĻ UZ BIBLIOTĒKU</button>'+
 '<div class="wl-detail-heading"><span>MANS TRENIŅŠ · '+fitD(fitToday())+'</span><h1>Šodienas izvēle</h1><p>'+ids.length+' vingrinājumi · aptuveni '+(estimated+5)+' min kopā ar iesildīšanos</p></div>'+
 '<div class="wl-custom-progress"><div><span>PAVEIKTS</span><strong>'+complete+' / '+ids.length+'</strong></div><div class="wl-custom-bar"><i style="width:'+(ids.length?Math.round(100*complete/ids.length):0)+'%"></i></div></div>'+
 (ids.length?'<div class="wl-my-list">'+ids.map((id,i)=>{const ex=wlEntry(id);return '<div class="wl-my-item"><img src="'+wlThumbnail(ex)+'" alt="" loading="lazy"><div><span>'+safe(ex.cat)+' · '+wlLevelLabel(ex.level)+'</span><strong>'+safe(ex.name)+'</strong><small>'+safe(ex.sets)+'</small></div><div class="wl-my-controls"><button data-wl-shift="'+id+'" data-step="-1" '+(i===0?'disabled':'')+' aria-label="Pārvietot augstāk">↑</button><button data-wl-shift="'+id+'" data-step="1" '+(i===ids.length-1?'disabled':'')+' aria-label="Pārvietot zemāk">↓</button><button data-wl-toggle="'+id+'" aria-label="Noņemt">×</button></div><button class="wl-my-check '+(done(id)?'selected':'')+'" data-wl-done="'+id+'" data-wl-program="custom">'+(done(id)?'✓':'○')+'</button></div>'}).join('')+'</div>':'<div class="wl-empty">Pagaidām nav izvēlēts neviens vingrinājums. Atver bibliotēku, izvēlies līmeni un nospied + Izvēlēties.</div>')+
 '<div class="wl-custom-actions"><button data-nav="majasha">+ Pievienot vingrinājumus</button>'+(ids.length?'<button data-wl-clear>Notīrīt izvēli</button>':'')+'</div>'+
 (ids.length?'<div class="wl-section-head"><div><span>VIZUĀLĀ PAMĀCĪBA</span><h2>Izpildes instrukcijas</h2></div></div><div class="wl-exercises-stack">'+ids.map((id,i)=>wlDetailedExercise(wlEntry(id),i,'custom')).join('')+'</div>':'')+
 '<div class="wl-safety">Izvēlies tādu apjomu, ko vari izpildīt ar labu tehniku. Pie smagas basketbola slodzes droši saīsini treniņu.</div>'+wlCredit()+'</div>';
}
function wlProgramView(id){
 const p=ACTIVE_PROGRAMS.find(x=>x.id===id);if(!p)return renderFitnessHome();
 const exercises=p.moves.map(wlEntry).filter(Boolean);
 const key=fitToday()+'|'+p.id,complete=!!state.homeSessions?.[key];
 return '<div class="ap-screen wl-page"><button class="wl-back" data-nav="majasha">‹ TRENIŅU PROGRAMMAS</button>'+
 '<div class="wl-detail-heading"><span>'+p.label+' / '+p.level+'</span><h1>'+safe(p.title)+'</h1><p>'+safe(p.summary)+'</p><div class="wl-detail-stat">'+p.minutes+' min · '+exercises.length+' vingrinājumi</div></div>'+
 '<div class="wl-exercises-stack">'+exercises.map((x,i)=>wlDetailedExercise(x,i,p.id)).join('')+'</div>'+
 '<button class="wl-wide-action" data-ap-finish="'+p.id+'">'+(complete?'✓ Atcelt paveikto':'✓ Atzīmēt visu programmu kā paveiktu')+'</button>'+wlCredit()+'</div>';
}
renderFitnessRoutine=function(id){
 if(id==='custom')return wlCustomView();
 if(typeof id==='string'&&id.startsWith('single:'))return wlDetailView(id.slice(7));
 return wlProgramView(id);
};
function wlRefresh(rememberSearch=false){
 const inp=rememberSearch?document.getElementById('wl-search'):null;
 const start=inp?.selectionStart??null;
 render();
 if(rememberSearch){
  const e=document.getElementById('wl-search');
  if(e){e.focus();if(start!==null&&e.setSelectionRange)try{e.setSelectionRange(start,start)}catch(_){}}
 }
}
document.addEventListener('click',event=>{
 const btn=event.target.closest('[data-wl-open],[data-wl-level],[data-wl-cat],[data-wl-toggle],[data-wl-fav],[data-wl-onlyfav],[data-wl-custom],[data-wl-routine],[data-wl-done],[data-wl-program],[data-wl-shift],[data-wl-clear]');
 if(!btn)return;
 const d=btn.dataset;
 if(d.wlOpen){window.fitOpenRoutine='single:'+d.wlOpen;go('fitroutine');return}
 if(d.wlRoutine){window.fitOpenRoutine=d.wlRoutine;go('fitroutine');return}
 if(btn.hasAttribute('data-wl-custom')){window.fitOpenRoutine='custom';go('fitroutine');return}
 if(d.wlLevel){wlFilter=d.wlLevel;wlFocus="Visi";wlSearch="";wlRefresh();return}
 if(d.wlCat){wlFocus=d.wlCat;wlRefresh();return}
 if(btn.hasAttribute('data-wl-onlyfav')){wlOnlyFavorites=!wlOnlyFavorites;wlRefresh();return}
 if(d.wlFav){state.favoriteExercises??=[];const favs=state.favoriteExercises;if(favs.includes(d.wlFav))state.favoriteExercises=favs.filter(x=>x!==d.wlFav);else favs.push(d.wlFav);save();wlRefresh();return}
 if(d.wlToggle){state.myWorkoutByDate??={};let items=wlSelected();if(items.includes(d.wlToggle)){items=items.filter(id=>id!==d.wlToggle);}else if(items.length<20){items.push(d.wlToggle);}else{toast('Vienam treniņam vari izvēlēties līdz 20 vingrinājumiem.');return;}state.myWorkoutByDate[fitToday()]=items;save();wlRefresh();return}
 if(d.wlDone){const key=fitToday()+'|'+(d.wlProgram||'custom')+'|'+d.wlDone;state.exerciseChecks??={};state.exerciseChecks[key]=!state.exerciseChecks[key];save();wlRefresh();return}
 if(d.wlShift){const items=wlSelected(),at=items.indexOf(d.wlShift),to=at+Number(d.step);if(at>=0&&to>=0&&to<items.length){[items[at],items[to]]=[items[to],items[at]];state.myWorkoutByDate[fitToday()]=items;save();wlRefresh()}return}
 if(btn.hasAttribute('data-wl-clear')){if(!confirm('Notīrīt šodienas izvēlēto vingrinājumu sarakstu?'))return;state.myWorkoutByDate??={};state.myWorkoutByDate[fitToday()]=[];save();wlRefresh();}
});
document.addEventListener('input',event=>{
 if(event.target?.id!=='wl-search')return;
 wlSearch=event.target.value;
 const area=document.querySelector('.wl-grid'),counter=document.querySelector('.wl-library-count');
 const cards=area?.querySelectorAll('.wl-card');
 if(!cards){wlRefresh(true);return}
 let visible=0;
 cards.forEach(card=>{
 const text=(card.querySelector('.wl-card-name')?.textContent||'').toLocaleLowerCase('lv-LV');
 const show=text.includes(wlSearch.toLocaleLowerCase('lv-LV'));card.hidden=!show;if(show)visible++;
 });
 if(counter)counter.textContent=visible+' vingrinājumi · '+(wlFilter==='all'?'visi līmeņi':wlLevelLabel(wlFilter));
});
render();
