/* MANS UZTURS ACTIVE | Drill Board 4.0
   Original vector diagrams, not generated photographs. Movement shown only when supported
   by drill setup/action; free-play decisions are not presented as fixed routes. */
(function(){
'use strict';
const PT={basket:[280,89],ft:[280,230],arc:[280,331],lcorner:[70,143],rcorner:[490,143],
 lwing:[110,267],rwing:[450,267],lelbow:[214,228],relbow:[346,228],
 llay:[249,130],rlay:[313,130],under:[280,144],mid:[280,435],
 backL:[135,520],backR:[425,520]};
const INK={run:'#1571bf',dribble:'#0877b4',pass:'#7256b6',shoot:'#d9871d',def:'#d34e44',screen:'#ad791f'};
const at=p=>typeof p==='string'?(PT[p]||PT.arc):p;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const event=(type,label,text,who,to,extra={})=>({type,label,text,who,to,...extra});
const go=(label,who,to,type='run',extra={})=>event(type,label,label,who,to,extra);
const pass=(label,a,b)=>event('pass',label,label,a,null,{receiver:b});
const shoot=(label,who='O1')=>event('shoot',label,label,who,null);
const scene=(drill)=>{
 const d=drill, kind=d.diagram, cat=d.category, source=(d.title+' '+d.setup+' '+d.action).toLowerCase(), action=d.action||'';
 const s={people:[],marks:[],events:[],full:false,approx:true};
 const A=(id,pos)=>s.people.push({id,pos:at(pos)}),M=(n,pos,kind='cone')=>s.marks.push({n,pos:at(pos),kind}),E=(...a)=>s.events.push(...a);
 const has=re=>re.test(source);
 const defaultShot=()=>{A('O1',/1 metru|tuvu groz|vairogu|soda laukumā/.test(d.setup.toLowerCase())?'llay':/soda metienu līnij/.test(source)?'ft':'rwing');if(d.minPlayers>=2)A('O2','arc');if(d.minPlayers>=3)A('O3','under');E(shoot('Metiens no sākuma punkta'));};
 // User-verified four-cone 5-4-3-2-1 variation. The route 3 -> 2 uses the baseline.
 if(d.id==='s54321'){
  s.approx=false;A('O1',[215,230]);M('0','ft');M('1','arc');M('2','rcorner');M('3','lcorner');
  E(event('dribble','1. Lay-up no soda līnijas sāna','Sākums pie soda līnijas sāna, caurgājiens no kreisās puses.','O1','llay',{path:'M215 230 Q227 160 249 130',finish:true}),
    event('dribble','2. Apkārt konusam 0, otrais lay-up','Apskrien 0 un veic caurgājienu no otras puses.','O1','rlay',{path:'M249 130 C170 220 206 286 280 283 C360 280 376 182 313 130',finish:true}),
    event('run','3. Kreisais stūris, metiens','Pārvietojies pie 3 konusa un met.','O1','lcorner',{path:'M313 130 Q175 105 70 143',finish:true}),
    event('run','4. Gar gala līniju no 3 uz 2','No kreisā stūra uz labo skrien pa gala līniju, tad met.','O1','rcorner',{path:'M70 143 L70 51 L490 51 L490 143',finish:true}),
    event('run','5. Metiens no loka augšas','No 2 dodies pie 1 un met pēdējo metienu.','O1','arc',{path:'M490 143 Q444 310 280 331',finish:true}));
  return s;
 }
 // Warm-up descriptions require their own physical setup rather than a generic court.
 if(d.id==='w01'){
  A('O1',[160,490]);E(go('Viegls skrējiens','O1',[160,280]),go('Sānu soļi','O1',[385,280]));return s;
 }
 if(d.id==='w02'){
  A('O1',[280,400]);[[175,400],[385,400],[280,300],[280,510]].forEach((p,i)=>M(i+1,p,'point'));
  E(go('Uz priekšu','O1',[280,300]),go('Sānis pēc signāla','O1',[385,400]),go('Atpakaļ','O1',[280,510]),go('Pa diagonāli','O1',[175,400]));return s;
 }
 if(d.id==='w05'){
  A('O1','llay');['llay',[280,162],'rlay'].forEach((p,i)=>{M(i+1,p,'point');E(event('spot','Metieni no '+(i+1)+'. tuvās pozīcijas',action,'O1',p));});return s;
 }
 if(d.id==='w06'){
  A('O1',[215,375]);A('O2',[345,375]);E(go('Pirmais vada sānu soli','O1',[155,375]),go('Partneris atkārto','O2',[285,375]));return s;
 }
 // Exercises that change bounce height or stance, not court position.
 if(/dribla augstuma|zems - vidējs - augsts|divu bumbu koordinācij|spoguļdribl|redzes signāli/.test(source)){
  A('O1','mid');if(d.minPlayers>=2)A('O2',[385,435]);
  E(event('practice','Dribla darbība uz vietas',action,'O1',null));return s;
 }
 // Five/three shooting spots. They are locations, never invented cones.
 if(cat==='shoot'&&/pieciem punkt|piecas viet|pieci metienu|trīspunktnieki no pieciem|no abiem stūriem|no trim punktiem|trīs metienu punkt|trīs tuvajām pozīcij|četros punktos/.test(source)){
  const spots=/pieci|piecas/.test(source)?['lcorner','lwing','arc','rwing','rcorner']:
   /abiem stūriem/.test(source)?['lcorner','rcorner']:/četros/.test(source)?['lcorner','lwing','rwing','rcorner']:['lwing','arc','rwing'];
  A('O1',spots[0]);if(d.minPlayers>=2)A('O2','under');
  spots.forEach((p,i)=>{M(i+1,p,'point');E(event('spot','Metieni no '+(i+1)+'. punkta',action,'O1',p));});return s;
 }
 if(kind==='freethrow'||(cat==='shoot'&&/soda metien/.test(source))){
  A('O1','ft');if(d.minPlayers>=2)A('O2','rwing');E(shoot('Soda metiens'));
  if(/sānu līnij|noej/.test(source))E(go('Aizej līdz sānu līnijai','O1',[495,392]),go('Atgriezies pie soda līnijas','O1','ft'));return s;
 }
 if(cat==='shoot'&&/dribl|crossover|starp kājām|pirmā soļa māns|pa kreisi|pa labi/.test(source)){
  const start=/spārnā/.test(source)?PT.rwing:PT.arc;A('O1',start);
  const delta=/pa labi/.test(action)?75:/pa kreisi/.test(action)?-75:/atkāp/.test(action)?0:-60;
  const end=[start[0]+delta,start[1]+(/atkāp/.test(action)?60:-75)];
  E(go('Dribls un apstāšanās','O1',end,'dribble'),shoot('Metiens pēc dribla'));return s;
 }
 if(cat==='shoot'&&/izskrējien|izskrien|pārvietošan|atkāpjas uz stūri|gar gala līniju|no groza apakšas|nogriezies/.test(source)){
  const start=/zem groza|groza apakš/.test(d.setup)?'under':/stūr/.test(d.setup)?'lcorner':'lwing';
  const end=/stūr|gar gala līniju/.test(action)?'rcorner':/elkoni/.test(action)?'relbow':/soda metienu līnij/.test(action)?'ft':'rwing';
  A('O1',start);A('O2','arc');if(d.minPlayers>=3)A('O3','under');
  E(go('Izskrējiens bez bumbas','O1',end,'run',/gar gala līniju/.test(action)?{path:'M280 144 L280 55 L490 55 L490 143'}:{}),pass('Piespēle metējam','O2','O1'),shoot('Metiens pēc saņemšanas'));return s;
 }
 if(cat==='shoot'&&/piespēl|saņem/.test(source)){
  A('O1',/centr|augšā/.test(d.setup)?'arc':'rwing');A('O2','lwing');if(d.minPlayers>=3)A('O3','under');
  E(pass('Piespēle metējam','O2','O1'),shoot('Metiens bez lieka dribla'));return s;
 }
 if(cat==='shoot'){defaultShot();return s;}
 // Visible cones only for drills that explicitly ask for them.
 if(cat==='handle'||kind==='cones'){
  A('O1','mid');if(/pieci konus/.test(source))[[220,415],[350,360],[220,310],[350,260],[220,208]].forEach((p,i)=>M(i+1,p));
  else if(/trīs konus|trīs kontrolpunkt|trīs atzīme/.test(source))[[220,400],[350,310],[220,220]].forEach((p,i)=>M(i+1,p,/konus/.test(source)?'cone':'point'));
  if(/aizsarg|1 pret 1/.test(source))A('X1','rwing');else if(d.minPlayers>=2)A('O2','rwing');
  if(s.marks.length){s.marks.forEach((p,i)=>E(go('Dribls pie '+(i+1)+'. punkta','O1',[p.pos[0]+(i%2? -27:27),p.pos[1]-10],'dribble')));
   if(/caurgājien|finiš/.test(source))E(go('Finišs pie groza','O1','rlay','dribble',{finish:true}));}
  else if(/retreat|atkāp/.test(source))E(go('Atkāpies ar bumbu','O1',[280,505],'dribble'),go('Uzbrūc grozam','O1','rlay','dribble',{finish:true}));
  else E(event('practice','Bumbas kontrole',action,'O1',null));return s;
 }
 if(cat==='finish'||kind==='layup'){
  if(kind==='pnrbare')return screens(d,s);
  A('O1',/elkoni/.test(d.setup)?'relbow':/zem groza/.test(d.setup)?'under':'rwing');
  if(/divi konus/.test(source)){M(1,[245,180]);M(2,[317,151]);}
  if(d.minPlayers>=2)A(/aizsarg/.test(source)?'X1':'O2','lwing');
  if(/reverse|zem vairoga/.test(source))E(go('Finišs otrā pusē zem vairoga','O1','llay','dribble',{finish:true}));
  else if(/abām|divām pusēm/.test(source))E(go('Caurgājiens no labās puses','O1','rlay','dribble',{finish:true}),event('reset','Maini pusi','Atgriezies uz pretējo spārnu.','O1','lwing'),go('Caurgājiens no kreisās puses','O1','llay','dribble',{finish:true}));
  else E(go('Finišs pie groza','O1','rlay','dribble',{finish:true}));return s;
 }
 if(cat==='pass'||['pairs','triangle','diamond','cut','outlet','drivekick'].includes(kind)){
  if(kind==='drivekick')return drivekick(s,d);
  if(/trijstūr|trīs perimetra/.test(source)||kind==='triangle'){
   A('O1','lwing');A('O2','rwing');A('O3','arc');E(pass('Piespēle uz otru pozīciju','O1','O2'),pass('Piespēle trešajam','O2','O3'));
   if(/seko piespēl/.test(source))E(go('Seko piespēlei','O1','rwing'));return s;
  }
  if(kind==='outlet'||/outlet|atlēkušo/.test(source)){A('O1','under');A('O2','rwing');E(event('rebound','Savāc atlēkušo bumbu',action,'O1'),pass('Outlet piespēle','O1','O2'));return s;}
  if(kind==='cut'||/backdoor/.test(source)){A('O1','arc');A('O2','rwing');if(/aizsarg/.test(source))A('X1',[425,232]);E(go('Grieziens aiz aizsarga','O2','rlay'),pass('Piespēle kustībā','O1','O2'));return s;}
  A('O1','lwing');A('O2','rwing');if(d.minPlayers>=3)A('O3','arc');
  if(/aizsarg/.test(source))A('X1','ft');E(pass('Piespēle partnerim','O1','O2'));
  if(/atlecoš|krūšu|apmaiņ|desmit/.test(source))E(pass('Atpakaļpiespēle','O2','O1'));return s;
 }
 if(cat==='screen'||/^(pnr|handoff)/.test(kind))return screens(d,s);
 if(cat==='def'||cat==='rebound'){
  if(/sānu soļ|spogul|drop step/.test(source)){A('X1','mid');if(d.minPlayers>=2)A('O1',[280,355]);
   if(/konus/.test(source)){M(1,[180,420]);M(2,[380,420]);}else{M(1,[180,420],'point');M(2,[380,420],'point');}
   E(go('Sānu kustība','X1',[180,420],'def'),go('Virziena maiņa','X1',[380,420],'def'));return s;}
  if(/closeout/.test(source)){A('O1','rwing');A('X1','under');E(go('Aizsargs iziet pie metēja','X1',[430,260],'def'));if(/boxout/.test(source))E(event('practice','Ieņem pozīciju atlēkušajai bumbai',action,'X1'));return s;}
  if(cat==='rebound'){A('O1','llay');if(d.minPlayers>=2)A('X1','rlay');
   E(event('rebound','Savāc atlēkušo bumbu',action,'O1'));if(/outlet/.test(source)){A('O2','rwing');E(pass('Piespēle uz sānu','O1','O2'));}return s;}
  return game(d,s);
 }
 if(cat==='tactics'&&d.id==='a06'){
  A('O1',[280,31]);A('O2',[220,164]);A('O3',[430,260]);
  E(go('O2 veido aizsegu','O2',[390,235],'screen'),go('O3 izskrien metiena vietā','O3','rwing'),pass('Iemetiens no gala līnijas','O1','O3'));return s;
 }
 if(cat==='small'||cat==='tactics'){
  if(/give and go|pass - cut|nogriezien/.test(source)&&!/3 pret 3|4 pret 4/.test(source)){
   A('O1','arc');A('O2','lwing');if(d.minPlayers>=3)A('O3','rwing');
   E(pass('Piespēle partnerim','O1','O2'),go('Grieziens uz grozu','O1','llay'),pass('Atpakaļpiespēle','O2','O1'));return s;}
  if(/3x3 clear/.test(source)){A('O1','under');A('O2','lwing');A('O3','rwing');E(go('Izved bumbu aiz trīspunktu līnijas','O1','arc','dribble'));return s;}
  return game(d,s);
 }
 if(cat==='transition'){
  s.full=true;
  if(d.id==='t05'){A('O1',[280,719]);A('O2',[432,632]);E(event('rebound','Atlēkusī bumba pie sava groza',action,'O1'),pass('Outlet piespēle','O1','O2'),go('Sprints uz pretējo grozu','O2',[310,136],'dribble',{finish:true}));return s;}
  if(d.id==='t07'){A('X1',[280,435]);A('O1',[420,236]);E(go('Aizsargs atgriežas starp bumbu un grozu','X1',[320,180],'def'));return s;}
  if(['t03','t04','t06','t08'].includes(d.id)){
   const n=d.id==='t03'?[2,1]:d.id==='t04'?[3,2]:d.id==='t06'?[4,3]:[3,3];
   const sx=[95,225,345,465],dx=[150,280,410];
   for(let i=0;i<n[0];i++)A('O'+(i+1),[sx[i],685]);
   for(let i=0;i<n[1];i++)A('X'+(i+1),[dx[i],250]);
   E(go('Pāreja uzbrukumā','O1',[220,360]),event('live','Izvēlies piespēli vai finišu pēc aizsargu izvietojuma',action,'O1'));return s;
  }
 }
 if(cat==='transition'||kind==='weave'){
  s.full=true;A('O1',[135,705]);A('O2',[420,705]);if(d.minPlayers>=3)A('O3',[280,705]);
  if(/weave/.test(source))E(pass('Pirmā piespēle','O1','O3'),go('Apskrien saņēmēju','O1',[375,520]),pass('Piespēle tālāk','O3','O2'),go('Maini joslu','O3',[155,340]));
  else if(/aizsardz/.test(source))E(go('Atgriezies starp bumbu un grozu','O1',[280,255],'def'));
  else E(go('Sprints uzbrukumā','O1',[270,230]),/piespēl|outlet/.test(source)?pass('Piespēle partnerim','O1','O2'):event('live','Lēmums spēles situācijā',action,'O1'));return s;
 }
 if(cat==='fitness'&&d.id!=='k03'){
  if(d.id==='k01'){A('O1',[220,470]);M(1,[220,470],'point');M(2,[220,285],'point');E(go('Sprints uz otro atzīmi','O1',[220,285]));return s;}
  if(d.id==='k02'){A('O1',[200,425]);M(1,[200,425],'point');M(2,[355,425],'point');M(3,[355,290],'point');E(go('Sānu soļi','O1',[355,425]),go('Sprints pēc signāla','O1',[355,290]));return s;}
  if(d.id==='k04'){A('O1',[220,430]);A('O2',[360,430]);E(go('Sprints pēc partnera signāla','O1',[220,290]));return s;}
  if(d.id==='k05'){A('O1','rwing');A('O2','under');M(1,[440,430],'point');E(shoot('Pirmais metiens'),go('Sprints līdz atzīmei','O1',[440,430]),go('Atgriezies uz metiena vietu','O1','rwing'),shoot('Otrais metiens'));return s;}
  if(d.id==='k06'){A('O1',[220,375]);A('X1',[320,375]);E(event('live','Aizsardzības reakcija uz partneri',action,'X1'));return s;}
  if(d.id==='k07'){A('O1',[220,400]);E(go('Lēns dribls brīvā maršrutā','O1',[340,320],'dribble'));return s;}
 }
 if(cat==='fitness'){
  A('O1',[280,485]);if(/5-10-5/.test(source)){M(1,[190,445],'point');M(2,[280,445],'point');M(3,[370,445],'point');
   E(go('5 m pa labi','O1',[370,445]),go('10 m pa kreisi','O1',[190,445]),go('5 m atpakaļ','O1',[280,445]));}
  else if(/atzīm|līnij|konus|koridor|5-10 m|sprint/.test(source)){M(1,[280,300],'point');E(go('Pārvietošanās līdz atzīmei','O1',[280,300]));}
  else E(event('practice','Izpildi vingrinājumu pēc norādes',action,'O1'));return s;
 }
 A('O1','arc');E(event('live','Izpilde pēc uzdevuma',action,'O1'));return s;
};
function game(d,s){
 const type=d.diagram,dict={one:1,two:2,three:3,four:4,five:5};const match=type.match(/^(one|two|three|four|five)v(one|two|three|four|five)$/);
 const count=match?[dict[match[1]],dict[match[2]]]:/3 pret 3/.test(d.setup)?[3,3]:/2 pret 2/.test(d.setup)?[2,2]:[Math.max(1,Math.ceil(d.minPlayers/2)),Math.floor(d.minPlayers/2)];
 const spots=['arc','lwing','rwing','lcorner','rcorner'];
 spots.slice(0,count[0]).forEach((p,i)=>s.people.push({id:'O'+(i+1),pos:at(p)}));
 spots.slice(0,count[1]).forEach((p,i)=>{let q=at(p);s.people.push({id:'X'+(i+1),pos:[q[0]+(q[0]<280?27:q[0]>280?-27:0),q[1]-36]});});
 if(/aizseg|pick and roll|pnr/.test(d.action.toLowerCase()))return screens(d,{...s,people:[],events:[]});
 if(/piespēl/.test(d.action.toLowerCase())&&count[0]>=2)s.events.push(pass('Piespēle partnerim','O1','O2'));
 s.events.push(event('live','Situācija bez iepriekš noteikta maršruta',d.action,'O1'));
 return s;
}
function drivekick(s,d){s.people.push({id:'O1',pos:PT.arc},{id:'O2',pos:PT.rcorner});if(d.minPlayers>=3)s.people.push({id:'O3',pos:PT.under});
 s.events.push(go('Caurgājiens ar driblu','O1','rlay','dribble'),pass('Piespēle uz stūri','O1','O2'),shoot('Metiens no stūra','O2'));return s;}
function screens(d,s){const source=(d.title+' '+d.action).toLowerCase();
 s.people.push({id:'O1',pos:[410,345]},{id:'O2',pos:[355,258]});
 if(d.minPlayers>=3)s.people.push({id:'X1',pos:[381,303]});if(d.minPlayers>=4)s.people.push({id:'X2',pos:[317,208]});
 if(d.minPlayers>=5)s.people.push({id:'O3',pos:PT.lwing});
 if(/handoff/.test(source)){s.events.push(go('O2 tuvojas bumbas turētājam','O2',[395,310]),pass('Bumbas nodošana rokās','O1','O2'),go('O2 driblē uz grozu','O2',[320,221],'dribble'));return s;}
 s.events.push(go('O2 ieņem aizsega pozīciju','O2',[380,307],'screen'),go('O1 izmanto aizsegu','O1',[315,245],'dribble'));
 if(/pop/.test(source)){s.events.push(go('O2 atkāpjas metienam','O2',[443,245]),pass('Piespēle O2','O1','O2'),shoot('O2 met no distances','O2'));}
 else{s.events.push(go('O2 nogriežas uz grozu','O2','rlay'));
  if(/drop|switch/.test(source))s.events.push(event('live','Izvēle pret aizsardzību',d.action,'O1'));
  else s.events.push(pass('Piespēle O2','O1','O2'),event('finish','O2 finišs pie groza',d.action,'O2',null,{finish:true}));}
 return s;}
const pos=p=>at(p);
const allSteps=d=>{const s=scene(d),steps=[{label:'SĀKUMS',title:'Novietošanās',text:d.setup||'Sagatavo laukumu.',extra:'Sākuma izvietojums'}];
 s.events.forEach((a,i)=>steps.push({label:(i+1)+'. DARBĪBA',title:a.label,text:a.text||d.action,extra:d.action||''}));
 steps.push({label:'UZSVARS',title:'Ko ievērot?',text:(d.goal?'Mērķis: '+d.goal+'. ':'')+(d.coach||'Atkārto vingrinājumu.'),extra:'Kustību ceļi ir shēmiski; precīzus attālumus nosaka treniņa uzdevums.'});return steps;};
function court(full,compact=false){const h=full?812:compact?412:574;let s='<rect x="25" y="14" width="510" height="'+h+'" rx="14" fill="#f1e1c5" stroke="#bb9464" stroke-width="3"/>';
 for(let y=27;y<14+h;y+=23)s+='<path d="M28 '+y+'H532" stroke="#dfc8a4" stroke-width="1"/>';
 s+='<g fill="none" stroke="#a7885c" stroke-width="2.6"><path d="M75 144V177 A225 225 0 0 0 485 177V144"/>'+
 '<rect x="213" y="19" width="134" height="211"/><path d="M213 230A67 67 0 0 0 347 230"/><circle cx="280" cy="230" r="65" stroke-dasharray="5 7"/></g>'+
 '<path d="M258 61H302" stroke="#223d43" stroke-width="6"/><circle cx="280" cy="89" r="13" fill="none" stroke="#e2772b" stroke-width="6"/>';
 if(full)s+='<g fill="none" stroke="#a7885c" stroke-width="2.6"><path d="M75 678V644 A225 225 0 0 1 485 644V678"/><rect x="213" y="607" width="134" height="219"/><path d="M213 607A67 67 0 0 1 347 607"/><circle cx="280" cy="420" r="55"/><path d="M25 420H535"/></g><path d="M258 766H302" stroke="#223d43" stroke-width="6"/><circle cx="280" cy="750" r="13" fill="none" stroke="#e2772b" stroke-width="6"/>';
 return s;}
let counter=0;
function board(d,step,mini=false){
 const sc=scene(d),total=sc.events.length,phase=Math.max(0,Math.min(total+1,step)),history=Math.min(total,Math.max(0,phase-1));
 const players=Object.fromEntries(sc.people.map(p=>[p.id,[...p.pos]]));
 const advance=a=>{if(a.to&&players[a.who]&&['run','dribble','def','screen','reset','spot'].includes(a.type))players[a.who]=[...pos(a.to)];};
 for(let i=0;i<history;i++)advance(sc.events[i]);
 const active=phase>=1&&phase<=total?sc.events[phase-1]:null;
 const start=active&&players[active.who]?[...players[active.who]]:null;
 if(active)advance(active);
 const end=active&&players[active.who]?players[active.who]:null;
 const compact=!sc.full&&sc.people.every(p=>p.pos[1]<=385)&&sc.marks.every(m=>m.pos[1]<=385)&&sc.events.every(a=>!a.to||at(a.to)[1]<=385);
 const uid='tm4'+(++counter),height=sc.full?865:compact?466:626;
 const arrow=Object.entries(INK).map(([name,color])=>'<marker id="'+uid+name+'" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="'+color+'" stroke-width="2"/></marker>').join('');
 const marks=sc.marks.map(m=>{const [x,y]=m.pos;if(m.kind==='point')return '<g><circle cx="'+x+'" cy="'+y+'" r="16" fill="#fff8ef" stroke="#ce8329" stroke-width="3"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-size="14" fill="#71451c" font-weight="900">'+esc(m.n)+'</text></g>';
  return '<g><path d="M'+x+' '+(y-16)+'l15 27h-30z" fill="#e89127" stroke="#aa611e" stroke-width="2"/><text x="'+x+'" y="'+(y+7)+'" text-anchor="middle" font-size="13" font-weight="900" fill="#573012">'+esc(m.n)+'</text></g>';}).join('');
 let line='';if(active){let path=active.path||'';
  if(!path&&start&&end&&Math.hypot(start[0]-end[0],start[1]-end[1])>3)path='M'+start[0]+' '+start[1]+'L'+end[0]+' '+end[1];
  if(active.type==='pass'){const a=players[active.who],b=players[active.receiver];if(a&&b)path='M'+a[0]+' '+a[1]+'L'+b[0]+' '+b[1];}
  if(['shoot','spot'].includes(active.type)){const a=players[active.who];if(a)path='M'+a[0]+' '+a[1]+'Q'+Math.round((a[0]+280)/2)+' '+Math.max(98,a[1]-80)+' 280 89';}
  if(active.type==='finish'&&start)path='M'+start[0]+' '+start[1]+'L280 89';
  const type=active.type==='pass'?'pass':active.type==='dribble'?'dribble':active.type==='shoot'||active.type==='spot'||active.type==='finish'?'shoot':active.type==='screen'?'screen':active.type==='def'?'def':'run';
  if(path)line='<path d="'+esc(path)+'" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" opacity=".85"/><path d="'+esc(path)+'" fill="none" stroke="'+INK[type]+'" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" '+(type==='pass'?'stroke-dasharray="13 9"':type==='dribble'?'stroke-dasharray="5 9"':'')+' marker-end="url(#'+uid+type+')"/>';
  if(active.finish&&active.type!=='shoot'&&end)line+='<path d="M'+end[0]+' '+end[1]+'L280 89" fill="none" stroke="#e78a21" stroke-width="3" stroke-dasharray="5 6"/>';
 }
 const people=sc.people.map(p=>{const [x,y]=players[p.id],c=p.id.startsWith('X')?'#d24b3b':'#1466a3';return '<g><circle cx="'+x+'" cy="'+y+'" r="22" fill="#fff"/><circle cx="'+x+'" cy="'+y+'" r="19" fill="'+c+'"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" fill="#fff" font-size="14" font-weight="900">'+esc(p.id)+'</text></g>';}).join('');
 let holder=sc.events.find(a=>a.type==='pass')?.who||sc.people.find(p=>p.id.startsWith('O'))?.id;
 for(let i=0;i<Math.min(phase,sc.events.length);i++)if(sc.events[i].type==='pass')holder=sc.events[i].receiver;
 const bp=holder&&players[holder];const ball=d.minBalls>0&&bp?'<g transform="translate('+(bp[0]+18)+' '+(bp[1]-17)+')"><circle r="10" fill="#f5a037" stroke="#fff" stroke-width="2"/><path d="M-10 0H10M0-10V10M-8-6Q4 0-8 6M8-6Q-4 0 8 6" stroke="#8c4d19" fill="none"/></g>':'';
 const label=phase===0?'<rect x="40" y="38" width="118" height="34" rx="9" fill="#166cab"/><text x="99" y="61" font-size="15" fill="#fff" font-weight="900" text-anchor="middle">STARTS</text>':phase<=total?'<rect x="40" y="38" width="137" height="34" rx="9" fill="#162f45"/><text x="108" y="60" font-size="14" fill="#fff" font-weight="800" text-anchor="middle">SOLIS '+phase+' / '+total+'</text>':'';
 return '<svg class="tm-v4-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(d.title+' - '+(active?.label||'sākuma pozīcija'))+'" viewBox="0 0 560 '+height+'"><defs>'+arrow+'</defs>'+court(sc.full,compact)+marks+line+people+ball+label+'</svg>';
}
function display(d,step,small){return '<div class="tm-v4-frame'+(small?' tm-v4-mini':'')+'">'+board(d,step,small)+'</div>';}
const legend='<div class="tm-v4-legend"><span><b class="tm-v4-player">O</b> Uzbrucējs</span><span><b class="tm-v4-player tm-v4-def">X</b> Aizsargs</span><span><b>▲</b> Konuss</span><span><i></i> Kustība</span><span><i class="tm-v4-dash"></i> Dribls</span><span><i class="tm-v4-pass"></i> Piespēle</span></div>';
// Replace only the existing visual adapters. Generator, favorites, saved plans and data are unchanged.
tmVisualSteps=function(d){return allSteps(d);};
tmCoachPreview=function(d){return display(d,0,true);};
tmCoachStepThumb=function(d,step){return display(d,step,true);};
tmCoachMain=function(d,step){return '<div class="tm-v4-view">'+display(d,step,false)+legend+
 '<p class="tm-v4-note"><strong>Izvietojums:</strong> '+esc(d.setup)+'</p>'+
 '<p class="tm-v4-note"><strong>Uzdevums:</strong> '+esc(d.action)+'</p>'+
 '<small>Ja treniņā nav norādītas precīzas koordinātas, laukuma pozīcijas ir paraugs, nevis oficiāli noteikts maršruts. Brīvās spēles situācijas netiek attēlotas kā obligātas kustības.</small></div>';};
if(typeof TEAM_DRILLS!=='undefined'&&typeof TEAM_BY_ID!=='undefined'&&!TEAM_BY_ID.s54321){
 const extra={id:'s54321',title:'5-4-3-2-1 metienu secība',category:'shoot',shotType:'move',minPlayers:1,maxPlayers:16,intensity:'high',minutes:10,diagram:'custom-54321',minBalls:1,minHoops:1,phase:'main',
 setup:'Četri konusi: 0 uz soda metienu līnijas, 1 trīspunktu loka augšā, 3 kreisajā stūrī, 2 labajā stūrī. Starts soda līnijas kreisajā sāna pozīcijā.',
 action:'Caurgājiens no kreisās puses; apskrien 0 konusu; caurgājiens no labās puses; metiens no 3 kreisajā stūrī; skrien no 3 uz 2 gar gala līniju un met; metiens no 1 loka augšā.',
 coach:'Pārvietojies ar spēles tempu, ievēro kustības secību un nostabilizējies pirms metieniem.',goal:'2 lay-up un 3 distances metieni'};
 TEAM_DRILLS.push(extra);TEAM_BY_ID.s54321=extra;
}
})();