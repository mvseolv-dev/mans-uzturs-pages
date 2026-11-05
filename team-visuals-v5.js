/* MANS UZTURS ACTIVE | Coachboard v5
   A structured court view with evidence-bound steps. No photos or invented cones.
   Designed to be audited by Codex with a low-cost model. */
(function(){
'use strict';
const core=window.TMBoardInternals;
if(!core || typeof tmVisualSteps!=='function') return;
const P=core.PT, COL={run:'#1768bb',dribble:'#0f7ebc',pass:'#7847b2',shoot:'#d58021',def:'#c34b48',screen:'#aa741f'};
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const loc=k=>typeof k==='string'?core.at(k):k;
const fmt=p=>p?Math.round(p[0])+','+Math.round(p[1]):'';
let serial=0;
const scene=d=>{
 const base=core.scene(d);
 // One player starts at the free throw lane side, not on cone 0.
 // Court: y=19 is the far baseline, the rim is y=89, and the arc top is y~309.
 if(d.id==='s54321'){
  const s=base;
  s.approx=false;
  s.people=[{id:'O1',pos:[215,230]}];
  s.marks=[{n:'0',pos:P.ft,kind:'cone'},{n:'1',pos:P.arc,kind:'cone'},
    {n:'2',pos:P.rcorner,kind:'cone'},{n:'3',pos:P.lcorner,kind:'cone'}];
  s.events=[
   {type:'dribble',label:'Caurgājiens no soda līnijas sāna',
    text:'Sāc no soda metienu līnijas kreisās malas un veic lay-up no kreisās puses.',
    who:'O1',to:P.llay,path:'M215 230 Q222 175 249 130',finish:true},
   {type:'dribble',label:'Apskrien 0 un finišē no otras puses',
    text:'Pēc pirmā metiena dodies apkārt 0 konusam uz soda līnijas un veic otro lay-up no labās puses.',
    who:'O1',to:P.rlay,path:'M249 130 C165 214 196 295 282 286 C363 278 384 193 313 130',finish:true},
   {type:'run',label:'Metiens kreisajā stūrī pie 3',
    text:'Pēc otrā lay-up dodies uz kreiso stūri, apstājies un izpildi metienu no 3. punkta.',
    who:'O1',to:P.lcorner,path:'M313 130 C210 122 139 123 70 143',finish:true},
   {type:'run',label:'Gar gala līniju no 3 uz 2',
    text:'No kreisā stūra skrien gar gala līniju zem groza uz labo stūri pie 2. punkta un met.',
    who:'O1',to:P.rcorner,path:'M70 143 C177 119 383 119 490 143',finish:true},
   {type:'run',label:'Metiens no 1 loka augšā',
    text:'Pēc metiena no labā stūra pārvietojies pie 1 konusa trīspunktu loka augšā un met.',
    who:'O1',to:P.arc,path:'M490 143 Q435 310 280 317',finish:true}
  ];
 }

 // Correct athlete counts and real roles for workouts previously collapsed by a generic category renderer.
 const A=(id,pos)=>({id,pos:typeof pos==='string'?core.at(pos):pos});
 const E=(type,label,who,to=null,extra={})=>({type,label,text:label,who,to,...extra});
 const setup=(people,events,marks=[])=>{base.people=people;base.events=events;base.marks=marks;base.approx=true;return base;};
 if(['s12','q036'].includes(d.id)){
  return setup([A('O1','arc'),A('O2','rcorner'),A('O3','under')],[
   E('dribble','O1 caurgājiens līdz soda laukumam','O1','rlay'),
   E('pass','O1 piespēlē stūrī esošajam O2','O1',null,{receiver:'O2'}),
   E('shoot','O2 met no stūra','O2'),
   E('practice','O3 savāc atlēkušo bumbu, mainiet lomas','O3')
  ]);
 }
 if(d.id==='s08'){
  return setup([A('O1','rwing'),A('O2','arc')],[
   E('pass','O2 piespēlē O1','O2',null,{receiver:'O1'}),
   E('live','O1 lasa brīvo vietu: met vai veic vienu driblu garām','O1')
  ]);
 }
 if(d.id==='q008'){
  return setup([A('O1','arc'),A('O2','lwing')],[
   E('pass','O2 piespēlē metējam O1','O2',null,{receiver:'O1'}),
   E('shoot','O1 nostabilizē pēdas un met bez dribla','O1'),
   E('practice','Pēc astoņiem metieniem mainiet lomas','O1')
  ]);
 }
 if(d.id==='q029'){
  return setup([A('O1','rwing'),A('X1',[392,216])],[
   E('dribble','O1 apiet pasīvo aizsargu ar driblu','O1',[335,178]),
   E('shoot','O1 met no brīvās pozīcijas','O1')
  ]);
 }
 if(['q045','q046','q048'].includes(d.id)){
  return setup([A('O1','rwing'),A('X1',[419,230])],[
   E('live','Uzbrucējs un aizsargs izspēlē aprakstīto situāciju','O1')
  ]);
 }
 if(d.id==='q050'){
  return setup([A('O1','arc'),A('O2','lwing'),A('X1',[279,269]),A('X2',[151,235])],[
   E('live','Divi uzbrucēji veido metienu 8 sekundēs pret diviem aizsargiem','O1'),
   E('practice','Pēc uzbrukuma mainiet uzbrukuma un aizsardzības lomas','O1')
  ]);
 }
 if(d.id==='q053'){
  return setup([A('O1','lwing'),A('O2',[160,168]),A('O3','rwing'),A('O4',[395,168])],[
   E('shoot','Pirmais pāris: O1 met, O2 vāc bumbu','O1'),
   E('shoot','Otrais pāris: O3 met, O4 vāc bumbu','O3'),
   E('practice','Pēc 10 metieniem pāros mainiet metēju un bumbas vācēju','O1')
  ]);
 }
 if(d.id==='q057'){
  return setup([A('O1','lwing'),A('O2',[160,170]),A('O3','rwing'),A('O4',[400,170])],
   [E('practice','Divi pāri sāk vienādos četros metienu punktos','O1'),
    ...[1,2,3,4].map(i=>E('shoot','Abi pāri cenšas trāpīt 3 reizes no '+i+'. punkta','O1'))],
   [P.lcorner,P.lwing,P.rwing,P.rcorner].map((pos,i)=>({n:String(i+1),pos,kind:'point'})));
 }
 if(d.id==='p03'){
  return setup([A('O1','lwing'),A('O2','rwing'),A('X1','ft')],[
   E('pass','O1 piespēlē O2, lai saglabātu bumbu','O1',null,{receiver:'O2'}),
   E('live','Aizsargs mēģina pārķert piespēles, uzbrucēji meklē brīvu leņķi 20 sekundes','X1')
  ]);
 }
 if(d.id==='p07'){
  return setup([A('O1',[130,490]),A('O2',[130,340]),A('O3',[430,490]),A('O4',[430,340])],[
   E('pass','Kreisais pāris piespēlē kustībā','O1',null,{receiver:'O2'}),
   E('pass','Labais pāris piespēlē kustībā','O3',null,{receiver:'O4'}),
   E('practice','Abi pāri turpina kustību pa saviem koridoriem','O1')
  ]);
 }
 if(d.id==='p09'){
  return setup([A('O1','lwing'),A('X1','ft')],[
   E('practice','O1 ar plecu un skatienu māna vienā virzienā','O1'),
   E('live','O1 izvēlas brīvo piespēles virzienu pret partnera izstieptajām rokām','O1')
  ]);
 }
 if(d.id==='r04'||d.id==='r05'){
  const n=d.id==='r04'?2:3;
  const z=['llay','rlay','arc'];
  const people=[];
  for(let i=0;i<n;i++){const p=core.at(z[i]);people.push(A('O'+(i+1),p),A('X'+(i+1),[p[0]+18,p[1]+42]));}
  return setup(people,[
   E('rebound','Visi pāri ieņem atlēkušās bumbas pozīcijas','O1'),
   E('live',d.id==='r04'?'Cīnieties 2 pret 2 par atlēkušo bumbu':'3 pret 3 uzbrukums turpinās tikai pēc savas atlēkušās','O1')
  ]);
 }
 if(d.id==='a06'){
  return setup([A('O1',[280,43]),A('O2','llay'),A('O3','rwing')],[
   E('screen','O2 nostājas nekustīgā aizsegā','O2',[369,240]),
   E('run','O3 izskrien līdz metiena vietai','O3',[424,286]),
   E('pass','O1 ievada bumbu O3','O1',null,{receiver:'O3'})
  ]);
 }
 if(d.id==='a07'){
  const places=['arc','lwing','rwing','lcorner'];
  const p=[];
  places.forEach((where,i)=>{const pt=core.at(where);p.push(A('O'+(i+1),pt),A('X'+(i+1),[pt[0]+(pt[0]<280?19:-19),pt[1]-40]));});
  return setup(p,[
   E('pass','O1 piespēlē O2','O1',null,{receiver:'O2'}),
   E('screen','O3 veido nekustīgu aizsegu bez bumbas','O3',[387,232]),
   E('live','Pēc katras nākamās piespēles atkārtojiet aizsegu bez bumbas','O1')
  ]);
 }
 if(d.id==='q017'){
  const a=base.events.find(e=>e.type==='run');
  if(a)a.path='M280 144 C348 122 433 120 490 143';
 }

 // No fixed path for a live read-and-react drill. Keep setup and options visible instead.
 if(/^(g|d|a)/.test(d.id)&&base.events.some(e=>e.type==='live'))base.approx=true;
 return base;
};
const actionWords={
 run:'Pārvietošanās bez bumbas',dribble:'Pārvietošanās ar driblu',
 pass:'Piespēle',shoot:'Metiens',spot:'Metiens norādītā vietā',
 def:'Aizsarga kustība',screen:'Aizsegs',finish:'Finišs pie groza',
 rebound:'Atlēkušās bumbas izcīnīšana',practice:'Tehnikas izpilde',
 live:'Spēles situācija bez obligāta maršruta',reset:'Pozīcijas maiņa'
};
const steps=d=>{
 const s=scene(d);
 const info=[{
  label:'SĀKUMS',
  title:'Spēlētāju un inventāra izvietojums',
  text:d.setup||'Sagatavo vingrinājuma sākuma izvietojumu.',
  extra:'Zilais O apzīmē uzbrucēju, sarkanais X aizsargu. Oranžie trijstūri apzīmē konusus.'
 }];
 s.events.forEach((e,i)=>{
  let detail=e.text||e.label||d.action;
  if((detail===e.label||!detail)&&e.type!=='live'&&e.type!=='practice')detail=d.action||e.label;
  if(e.type==='live')detail='Brīvā spēles situācija: '+(d.action||e.label)+'. Nav vienas iepriekš noteiktas pareizās kustības.';
  if(e.type==='practice')detail=d.action||'Atkārto tehnikas uzdevumu uz vietas.';
  let context=actionWords[e.type]||'Kustība';
  if(e.type==='pass'&&e.receiver)context+=': '+(e.who||'spēlētājs')+' → '+e.receiver;
  else if(e.who)context+=': '+e.who;
  if(e.finish&&e.type!=='finish')context+='; darbības beigās metiens pie groza vai no norādītās vietas';
  info.push({
   label:(i+1)+'. DARBĪBA',
   title:e.label||actionWords[e.type]||'Turpinājums',
   text:detail,
   extra:context
  });
 });
 info.push({label:'TRENERA UZSVARS',title:'Kvalitāte un atkārtojumi',
  text:(d.goal?'Mērķis: '+d.goal+'. ':'')+(d.coach||'Atkārto vingrinājumu atbilstoši norādītajam uzdevumam.'),
  extra:'Ja nav doti precīzi attālumi vai ceļi, zīmējums ir paraugs.'});
 return info;
};
function draw(d,index,mini=false){
 const s=scene(d),events=s.events,phase=Math.max(0,Math.min(events.length+1,Number(index)||0));
 const history=Math.min(events.length,Math.max(0,phase-1));
 const full=!!s.full,uid='cb5'+(++serial),maxH=full?849:578;
 const positions=Object.fromEntries(s.people.map(p=>[p.id,[...p.pos]]));
 const advance=e=>{
  if(e&&e.to&&positions[e.who]&&['run','dribble','def','screen','reset','spot'].includes(e.type))positions[e.who]=[...loc(e.to)];
 };
 for(let i=0;i<history;i++)advance(events[i]);
 const e=phase>=1&&phase<=events.length?events[phase-1]:null;
 const from=e&&positions[e.who]?[...positions[e.who]]:null;
 if(e)advance(e);
 const end=e&&positions[e.who]?positions[e.who]:null;
 const pathFor=()=>{
  if(!e)return '';
  if(e.path)return e.path;
  if(e.type==='pass'){
   const a=positions[e.who],b=positions[e.receiver];
   return a&&b?'M'+fmt(a)+'L'+fmt(b):'';
  }
  if(['shoot','spot'].includes(e.type)){
   const a=positions[e.who];return a?'M'+fmt(a)+'Q'+Math.round((a[0]+280)/2)+' '+Math.round(Math.max(92,a[1]-74))+' 280 89':'';
  }
  if(e.type==='finish'&&from)return 'M'+fmt(from)+'L280 89';
  if(from&&end&&Math.hypot(from[0]-end[0],from[1]-end[1])>6){
   return 'M'+fmt(from)+'L'+fmt(end);
  }
  return '';
 };
 const path=pathFor(),mode=e?.type==='spot'?'shoot':(COL[e?.type]?e.type:'run'),color=COL[mode];
 const labels=Object.entries(COL).map(([id,c])=>
  '<marker id="'+uid+id+'" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="'+c+'" stroke-width="2.3"/></marker>').join('');
 const floor='<rect x="24" y="14" width="512" height="'+maxH+'" rx="13" fill="#f3e3c7" stroke="#b28c57" stroke-width="3"/>'+
 Array.from({length:Math.ceil(maxH/25)},(_,i)=>'<path d="M26 '+(30+i*25)+'H534" fill="none" stroke="#e8d4b2" stroke-width="1"/>').join('')+
 '<g stroke="#b18d5d" fill="none" stroke-width="3"><path d="M75 143V177A225 225 0 0 0 485 177V143"/>'+
 '<rect x="213" y="18" width="134" height="212"/><path d="M213 230A67 67 0 0 0 347 230"/>'+
 '<circle cx="280" cy="230" r="65" stroke-dasharray="5 7"/></g>'+
 '<path d="M258 61H302" stroke="#26404d" stroke-width="6"/><circle cx="280" cy="89" r="13" fill="none" stroke="#da7726" stroke-width="6"/>'+
 (full?'<path d="M25 420H535" stroke="#b18d5d" stroke-width="3"/><circle cx="280" cy="420" r="54" fill="none" stroke="#b18d5d" stroke-width="3"/>'+
 '<g stroke="#b18d5d" stroke-width="3" fill="none"><path d="M75 685V655 A225 225 0 0 1 485 655V685"/><rect x="213" y="637" width="134" height="226"/><path d="M213 637A67 67 0 0 1 347 637"/></g>'+
 '<path d="M258 771H302" stroke="#26404d" stroke-width="6"/><circle cx="280" cy="749" r="13" fill="none" stroke="#da7726" stroke-width="6"/>':'');
 const marks=(s.marks||[]).map(m=>{
  const [x,y]=m.pos;
  if(m.kind==='point')return '<g><circle cx="'+x+'" cy="'+y+'" r="19" fill="#fff9ec" stroke="#cf8b2c" stroke-width="3"/><text x="'+x+'" y="'+(y+5)+'" font-weight="900" font-size="14" text-anchor="middle" fill="#62401c">'+escape(m.n)+'</text></g>';
  return '<g><path d="M'+x+' '+(y-15)+'l16 29h-32z" fill="#f39c35" stroke="#994f1c" stroke-width="2.6"/><text x="'+x+'" y="'+(y+9)+'" fill="#472408" font-size="14" text-anchor="middle" font-weight="900">'+escape(m.n)+'</text></g>';
 }).join('');
 let movement='';
 if(path){
  movement='<path d="'+escape(path)+'" stroke="#ffffff" fill="none" stroke-width="12" opacity=".9" stroke-linecap="round"/>'+
   '<path d="'+escape(path)+'" stroke="'+color+'" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"'+
    (mode==='dribble'?' stroke-dasharray="4 9"':mode==='pass'?' stroke-dasharray="12 8"':'')+' marker-end="url(#'+uid+mode+')"/>';
  if(e.finish&&end)movement+='<path d="M'+fmt(end)+' L280 89" fill="none" stroke="#d58021" stroke-width="3" stroke-dasharray="5 7"/>';
 }
 // Ghost start marker remains visible after moving, so the direction is unambiguous.
 const ghost=from&&end&&Math.hypot(from[0]-end[0],from[1]-end[1])>6?
  '<g opacity=".72"><circle cx="'+from[0]+'" cy="'+from[1]+'" r="17" fill="#fff" stroke="'+color+'" stroke-dasharray="5 4" stroke-width="3"/>'+
  '<text x="'+from[0]+'" y="'+(from[1]+5)+'" text-anchor="middle" fill="'+color+'" font-size="12" font-weight="900">S</text></g>':'';
 const actors=s.people.map(a=>{
  const [x,y]=positions[a.id],isdef=a.id.startsWith('X'),fill=isdef?'#c74742':'#126bb3';
  return '<g><circle cx="'+x+'" cy="'+y+'" r="23" fill="#fff"/><circle cx="'+x+'" cy="'+y+'" r="20" fill="'+fill+'"/>'+
   '<text x="'+x+'" y="'+(y+5)+'" font-size="15" text-anchor="middle" fill="#fff" font-weight="900">'+escape(a.id)+'</text></g>';
 }).join('');
 const owner=()=>{
  let id=s.people.find(p=>p.id.startsWith('O'))?.id;
  for(let i=0;i<Math.min(phase,events.length);i++){
   const z=events[i];
   if(z.type==='pass'&&z.receiver)id=z.receiver;
   else if(z.type==='dribble'&&z.who)id=z.who;
  }
  return id;
 };
 const b=positions[owner()];
 const ball=d.minBalls&&b?'<g transform="translate('+(b[0]+20)+' '+(b[1]-18)+')"><circle r="10" fill="#e99634" stroke="#fff" stroke-width="2"/>'+
  '<path d="M-10 0H10M0-10V10M-8-7Q4 0-8 7M8-7Q-4 0 8 7" stroke="#824411" stroke-width="1.2" fill="none"/></g>':'';
 const badge='<rect x="39" y="37" width="175" height="38" rx="11" fill="#153048"/>'+
  '<text x="126" y="62" fill="#f5fcff" text-anchor="middle" font-size="15" font-weight="900">'+
  (phase===0?'STARTA VIETAS':phase>events.length?'TRENERA UZSVARS':'DARBĪBA '+phase+' / '+events.length)+'</text>';
 const certainty=s.approx?'<text x="281" y="'+(maxH-18)+'" fill="#927b5c" font-size="12" text-anchor="middle" font-weight="700">SHĒMISKS PIEMĒRS</text>':'';
 return '<svg class="tm-coach-v5-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+escape(d.title+': '+(e?.label||'sākuma izvietojums'))+'" viewBox="0 0 560 '+(maxH+17)+'"><defs>'+labels+'</defs>'+
 floor+marks+movement+ghost+actors+ball+badge+certainty+'</svg>';
}
const legend='<div class="tm-v5-legend"><span><b class="tm-v5-badge offense">O</b> Uzbrucējs</span><span><b class="tm-v5-badge defense">X</b> Aizsargs</span>'+
 '<span><b class="tm-v5-cone">▲</b> Konuss</span><span><i class="tm-v5-line run"></i> Skrējiens</span><span><i class="tm-v5-line dribble"></i> Dribls</span>'+
 '<span><i class="tm-v5-line pass"></i> Piespēle</span><span><i class="tm-v5-line shot"></i> Metiens</span></div>';
function status(d){
 const s=scene(d),isGame=s.events.some(e=>e.type==='live');
 return isGame?['SPĒLES SITUĀCIJA','Iespējamo lēmumu piemērs, nevis iepriekš noteikta izspēle.']:
   s.approx?['PARAUGA SHĒMA','Sākuma pozīciju attālumi un trajektorijas var atšķirties, ja nav konkrēti noteiktas.']:
   ['KONKRĒTA SECĪBA','Attēlotā kustības secība izveidota pēc lietotāja precizētā uzdevuma.'];
}
function frame(d,step,mini=false){
 return '<div class="tm-v5-frame'+(mini?' tm-v5-mini':'')+'">'+draw(d,step,mini)+'</div>';
}
tmVisualSteps=function(d){return steps(d);};
tmCoachPreview=function(d){return frame(d,0,true);};
tmCoachStepThumb=function(d,index){return frame(d,index,true);};
tmCoachMain=function(d,index){
 const st=status(d);
 return '<div class="tm-v5-main"><div class="tm-v5-status"><strong>'+st[0]+'</strong><span>'+st[1]+'</span></div>'+
 frame(d,index)+legend+
 '<div class="tm-v5-under"><div><strong>Kur sākt un kā izvietoties?</strong><p>'+escape(d.setup||'Sagatavo treniņu.')+'</p></div>'+
 '<div><strong>Ko darīt?</strong><p>'+escape(d.action||'Skaties trenera norādījumus.')+'</p></div>'+
 '<div><strong>Trenera uzsvars</strong><p>'+escape(d.coach||'Izpildi kustību kontrolēti.')+'</p></div></div></div>';
};
// Expose read-only diagnostics for GitHub Actions and Codex review.
window.TeamCoachAuditV5={
 drills:()=>TEAM_DRILLS.map(d=>({
  id:d.id,title:d.title,category:d.category,
  steps:steps(d).length,cones:scene(d).marks.filter(m=>m.kind==='cone').length,
  status:status(d)[0],svgOk:draw(d,0).startsWith('<svg') && draw(d,Math.max(1,scene(d).events.length)).endsWith('</svg>')
 })),
 render:(id,step)=>TEAM_BY_ID[id]?draw(TEAM_BY_ID[id],step):null,
 steps:id=>TEAM_BY_ID[id]?steps(TEAM_BY_ID[id]):null
};
})();