/* MANS UZTURS ACTIVE - basketball coaching illustrations v3. */
/* Illustrations describe phases. The drill text remains the authoritative instruction. */
function tmVSafe(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function tmVMode(d){
 if(!d)return 'court';
 if(d.diagram==='dribble' && d.minPlayers<=2)return 'ballcontrol';
 if((d.diagram==='spot'||d.diagram==='freethrow') && d.minPlayers===1 && d.shotType!=='pressure')return 'shooting';
 return 'court';
}
function tmVLabel(type){return ({run:'Skrien bez bumbas',dribble:'Driblē ar bumbu',pass:'Piespēlē partnerim',shot:'Izpilda metienu',def:'Pārvietojas aizsardzībā',screen:'Uzliek aizsegu'})[type]||'Izpilda kustību';}
function tmVEvent(type,path,description){return {type,path,description:description||tmVLabel(type)};}
function tmVPathStart(path){let n=(String(path).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);return n.length>=2?[n[0],n[1]]:[185,160];}
function tmVPathEnd(path){let n=(String(path).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);return n.length>=2?n.slice(-2):[185,160];}
function tmVEvents(d){
 const mode=tmVMode(d);
 if(mode==='ballcontrol'){
  if(d.minBalls>1)return [[{type:'practice',description:'Driblē ar abām bumbām'}],[{type:'practice',description:'Maini dribla ritmu'}],[{type:'practice',description:'Saglabā bumbu kontroli'}]];
  if(/augst|zems|vidēj/i.test(d.action||''))return [[{type:'practice',description:'Zems dribls pie ceļiem'}],[{type:'practice',description:'Vidējs dribls pie gurniem'}],[{type:'practice',description:'Maini dribla augstumu un roku'}]];
  return [[{type:'practice',description:'Driblē ar vienu roku'}],[{type:'practice',description:'Pārliec bumbu otrā rokā'}]];
 }
 if(mode==='shooting')return [[{type:'practice',description:'Sagatavo pēdas un bumbu'}],[{type:'practice',description:'Iztaisno metošo roku'}],[{type:'practice',description:'Noturi plaukstu pēc metiena'}]];
 const sc=tmRoleScene(d),kind=d.diagram;
 const run=(sc.run||[]).map((p,i)=>tmVEvent((d.category==='handle'||['pullup','drive','finish','drivekick','cones'].includes(kind)||(['pnr','pnrbare','pnrgame'].includes(kind)&&i===0))&&d.minBalls?'dribble':'run',p));
 const pass=(sc.pass||[]).map(p=>tmVEvent('pass',p));
 const shot=(sc.shot||[]).map(p=>tmVEvent('shot',p));
 const def=(sc.def||[]).map(p=>tmVEvent('def',p));
 const pass2=(sc.pass2||[]).map(p=>tmVEvent('pass',p));
 const make=lists=>lists.filter(a=>a?.length).map(a=>a.slice(0,3));
 let groups;
 if(['shootpass','relocate','curl','drivekick','pullup','cut','givego'].includes(kind)){
  groups=kind==='drivekick'?make([run,pass,shot]):kind==='pullup'?make([run,shot]):kind==='givego'?make([pass.slice(0,1),run,pass.slice(1)]):kind==='cut'?make([pass,run,pass2]):kind==='relocate'||kind==='curl'?make([run,pass,shot]):make([pass,run,shot]);
 }else if(['triangle','diamond','weave'].includes(kind)){
  groups=make([pass.slice(0,1),run,pass.slice(1,2),[...pass.slice(2),...shot]]);
 }else if(['pnrbare','pnrgame','pnr'].includes(kind)){
  groups=make([run.slice(0,1),[...run.slice(1),...def],pass,shot]);
 }else if(['handoffbare','handoff'].includes(kind)){
  groups=make([run,pass,def]);
 }else if(['spot','freethrow','layup'].includes(kind)){
  groups=make([run.slice(0,1),shot,run.slice(1)]);
 }else if(['onevone','twovtwo','threevthree','fourvfour','fivevfive','threevtwo','fourvthree','twovone'].includes(kind)){
  groups=make([run,pass,[...shot,...def]]);
 }else if(['closeout','defslide','boxout','mirror'].includes(kind)){
  groups=make([def,run,shot]);
 }else if(['fourout','threeout','outlet','pairs','sprint','agility','cones','dribble'].includes(kind)){
  groups=make([pass,run,shot,def]);
 }else groups=make([run,pass,shot,def,pass2]);
 if(!groups.length)groups=[[{type:'practice',description:'Izpildi vingrinājumu'}]];
 if(groups.length>4)groups=[...groups.slice(0,3),groups.slice(3).flat()];
 return groups;
}
function tmVisualSteps(d){
 const groups=tmVEvents(d);
 const parts=[{label:'1. SOLIS',title:'Sākuma pozīcija',text:d.setup||'Sagatavojies vingrinājumam.',extra:tmRoleLabels(d).join(' | ')}];
 for(let i=0;i<groups.length;i++){
  let names=[...new Set(groups[i].map(x=>x.description))];
  let title=names.length===1?names[0]:names.join(' + ');
  parts.push({label:(i+2)+'. SOLIS',title,text:d.action||title,extra:'Attēlā izcelta tikai šī posma darbība. Spēlētāji ar O ir uzbrucēji, ar X ir aizsargi.'});
 }
 parts.push({label:(parts.length+1)+'. SOLIS',title:'Atkārto un maini lomas',text:(d.goal?'Mērķis: '+d.goal+'. ':'')+(d.coach||'Atkārto vingrinājumu.'),extra:'Izpildi arī no otras laukuma puses, ja vingrinājums to paredz.'});
 return parts;
}
let tmVUid=0;
function tmVCourtFloor(){
 let floor='<rect x="18" y="12" width="334" height="268" rx="15" fill="#f1eee4" stroke="#ccceb9" stroke-width="1.5"/>';
 for(let i=0;i<11;i++){const y=28+i*23;floor+='<path d="M19 '+y+'H351" stroke="#e3decd" stroke-width=".8"/>';}
 floor+='<g fill="none" stroke="#b0b7a8" stroke-width="1.9" stroke-linejoin="round"><path d="M43 26V79 M327 26V79 M43 79 A142 142 0 0 0 327 79"/><rect x="137" y="18" width="96" height="109"/><path d="M137 127A48 48 0 0 0 233 127"/><path d="M18 265H352"/><path d="M137 60H233"/><circle cx="185" cy="66" r="11"/></g><path d="M168 43H202" stroke="#334a49" stroke-width="4" stroke-linecap="round"/>';
 return floor;
}
function tmVCourtView(d,step,small){
 const sc=d?tmRoleScene(d):tmScene('threevthree'),groups=d?tmVEvents(d):[];
 const last=d?groups.length+1:0,phase=step<0?Math.max(0,groups.length-1):Math.max(0,Math.min(last,step));
 const offense=(sc.o||[]).map(p=>[...p]),defense=(sc.x||[]).map(p=>[...p]);
 const allBefore=groups.slice(0,Math.max(0,phase-1)).flat();
 const current=phase>0&&phase<=groups.length?groups[phase-1]:[];
 const used=step<0?groups.flat():allBefore;
 const nearest=(list,start,threshold=60)=>{
  let i=-1,min=threshold;list.forEach((p,j)=>{const dist=Math.hypot(p[0]-start[0],p[1]-start[1]);if(dist<min){i=j;min=dist;}});return i;
 };
 function moved(base,actions,type){const result=base.map(p=>[...p]);
  for(const a of actions){if(!a.path||!((type==='offense'&&['run','dribble'].includes(a.type))||(type==='defense'&&a.type==='def')))continue;
   const i=nearest(result,tmVPathStart(a.path),72);
   if(i>=0){const [x,y]=tmVPathEnd(a.path);result[i][0]=x;result[i][1]=y;}
  }return result;
 }
 const beforeO=moved(offense,used,'offense'),beforeX=moved(defense,used,'defense');
 const actualO=moved(beforeO,current,'offense'),actualX=moved(beforeX,current,'defense');
 const uid='tmvp'+(++tmVUid),colors={run:'#16936d',dribble:'#0685c3',pass:'#685ac3',shot:'#d68816',def:'#d5573f'};
 const labels={run:'SKRĒJIENS',dribble:'DRIBLS',pass:'PIESPĒLE',shot:'METIENS',def:'AIZSARDZĪBA'};
 const arrow=Object.keys(colors).map(k=>'<marker id="'+uid+k+'" orient="auto" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5"><path d="M0 0L7 3.5L0 7" fill="none" stroke="'+colors[k]+'" stroke-width="1.7"/></marker>').join('');
 let paths='';
 current.forEach((a,i)=>{
  if(!a.path)return;
  const kind=a.type in colors?a.type:'run';
  const end=tmVPathEnd(a.path);
  const stroke=kind==='run'?'':kind==='dribble'?'stroke-dasharray="3 7"':kind==='pass'?'stroke-dasharray="9 6"':kind==='shot'?'stroke-dasharray="3 6"':'stroke-dasharray="5 5"';
  paths+='<path d="'+tmVSafe(a.path)+'" fill="none" stroke="'+colors[kind]+'" stroke-width="4.2" '+stroke+' stroke-linejoin="round" stroke-linecap="round" marker-end="url(#'+uid+kind+')"/>';
  if(kind!=='shot')paths+='<circle cx="'+end[0]+'" cy="'+end[1]+'" r="8" fill="#ffffff" fill-opacity=".86" stroke="'+colors[kind]+'" stroke-width="2"/>';
 });
 const glyph=(p,type,dim)=>{
  const [x,y,n]=p,fill=type==='o'?'#125e70':'#b94c35',txt=type==='o'?'O':'X';
  return '<g'+(dim?' opacity=".25"':'')+'><circle cx="'+x+'" cy="'+y+'" r="'+(small?13.5:15.5)+'" fill="#ffffff" opacity=".9"/><circle cx="'+x+'" cy="'+y+'" r="'+(small?11.5:13.5)+'" fill="'+fill+'"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" fill="#ffffff" font-family="Arial,sans-serif" font-size="10" font-weight="800">'+txt+tmVSafe(n)+'</text></g>';
 };
 let people='';
 if(phase>0&&phase<=groups.length){people+=beforeO.map(p=>glyph(p,'o',true)).join('')+beforeX.map(p=>glyph(p,'x',true)).join('');}
 people+=actualO.map(p=>glyph(p,'o',false)).join('')+actualX.map(p=>glyph(p,'x',false)).join('');
 const cones=(sc.cones||[]).map(([x,y],i)=>'<g><path d="M'+x+' '+(y-9)+'l9 17h-18z" fill="#e79539" stroke="#a76b2c" stroke-width="1"/><text x="'+x+'" y="'+(y+5)+'" font-family="Arial" font-weight="700" font-size="9" fill="#5e3c14" text-anchor="middle">'+(i+1)+'</text></g>').join('');
 const screens=(sc.screen||sc.screens||[]).map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="22" fill="none" stroke="#e79539" stroke-width="2.5" stroke-dasharray="5 5"/>').join('');
 let ball=offense[0]||[185,185];
 const relevant=[...used,...current];
 const pathFirst=groups.flat().find(a=>a.path&&['dribble','pass','shot'].includes(a.type));
 if(pathFirst){const i=nearest(offense,tmVPathStart(pathFirst.path),130);if(i>=0)ball=offense[i];}
 if(phase===last&&d){for(const a of groups.flat()){if(['dribble','pass','shot'].includes(a.type)&&a.path)ball=tmVPathEnd(a.path);}}
 else if(phase>0){for(const a of relevant){if(['dribble','pass','shot'].includes(a.type)&&a.path)ball=tmVPathEnd(a.path);}}
 const ballSVG=d?.minBalls>0?'<g transform="translate('+(ball[0]+18)+' '+(ball[1]-16)+')"><circle r="9.5" fill="#f3a43e" stroke="#7d4b17" stroke-width="1.4"/><path d="M-8 0H8M0-8V8M-6-6Q2 0-6 6M6-6Q-2 0 6 6" stroke="#754014" fill="none" stroke-width="1.2"/></g>':'';
 const phaseLabel=step<0?'TRENIŅA SHĒMA':phase===0?'SĀKUMA VIETAS':phase===last?'ATKĀRTOJUMS':current.length===1?labels[current[0].type]||'DARBĪBA':'SECĪGAS DARBĪBAS';
 const tags=[...new Set(current.map(a=>labels[a.type]).filter(Boolean))].join(' + ');
 const label='<rect x="29" y="240" width="'+Math.min(315,Math.max(145,phaseLabel.length*8+32))+'" height="31" rx="9" fill="#18382f"/><text x="42" y="260" font-size="11" font-weight="900" fill="#ffffff" font-family="Arial,sans-serif">'+tmVSafe(phaseLabel)+'</text>';
 return '<svg class="tm-court-svg tm-court-pro '+(small?'tm-court-mini':'')+'" viewBox="0 0 370 289" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+tmVSafe((d?.title||'Basketbola shēma')+', '+phaseLabel.toLocaleLowerCase('lv-LV'))+'"><defs>'+arrow+'</defs>'+tmVCourtFloor()+paths+cones+screens+people+ballSVG+label+'</svg>';
}
function tmVPerson(x,y,shooting,late){
 const arm=shooting?late?'M153 135L176 78L190 49':'M151 141L170 113L164 85':'M154 148L172 163L185 145';
 return '<g fill="none" stroke="#163a43" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"><path d="M143 147L128 199L109 232M146 148L165 194L184 230"/><path d="M147 112L145 161"/><path d="M137 126L121 154L109 172"/><path d="'+arm+'"/></g><path d="M136 108Q147 100 160 110L157 157L134 157Z" fill="#17697a"/><path d="M137 124L154 124M139 134L153 134" stroke="#e7f2ef" stroke-width="3"/><circle cx="146" cy="89" r="19" fill="#d39a74" stroke="#163a43" stroke-width="2.5"/><path d="M129 84Q132 64 150 69Q167 70 164 85" fill="#193b40"/><path d="M107 232L94 240M184 230L199 240" stroke="#163a43" stroke-width="9" stroke-linecap="round"/>';
}
function tmVTechniqueView(d,step,small){
 const mode=tmVMode(d),groups=tmVEvents(d),last=groups.length+1;
 const phase=step<0?1:Math.min(last,Math.max(0,step));
 const shooting=mode==='shooting',ballX=shooting?(phase>=3?265:phase===2?177:167):phase===0?177:d.minBalls>1?204:phase===1?204:phase===2?198:181;
 const ballY=shooting?(phase>=3?72:phase===2?76:phase===1?126:149):phase===0?145:phase===1?219:phase===2?178:152;
 const uid='tmvt'+(++tmVUid),showArc=shooting&&phase>=3;
 const back='<rect x="18" y="12" width="334" height="268" rx="15" fill="#f1eee4" stroke="#ccceb9" stroke-width="1.5"/>'+
 '<circle cx="145" cy="142" r="104" fill="#e8eee9"/><path d="M25 247H345" stroke="#acb6a9" stroke-width="3"/>';
 const hoop=shooting?'<g><path d="M290 66H340V144" fill="none" stroke="#697975" stroke-width="5"/><path d="M289 112H332" stroke="#d58a20" stroke-width="4"/><path d="M294 114L298 146L311 154L324 146L327 114" fill="none" stroke="#809b91" stroke-width="2"/></g>':'';
 const ball=(x,y)=>'<g transform="translate('+x+' '+y+')"><circle r="16" fill="#ee9f39" stroke="#8b501a" stroke-width="2"/><path d="M-15 0H15M0-15V15M-11-11Q7 0-11 11M11-11Q-7 0 11 11" stroke="#91501c" stroke-width="1.8" fill="none"/></g>';
 let scene=back+hoop+tmVPerson(145,145,shooting,phase>=2)+ball(ballX,ballY);
 if(!shooting&&d.minBalls>1)scene+=ball(91,phase===1?220:phase===2?174:150);
 if(!shooting&&phase>0)scene+='<path d="M205 139Q244 180 205 215" stroke="#0685c3" stroke-width="4" stroke-dasharray="4 8" fill="none" marker-end="url(#'+uid+'dribble)"/>';
 if(showArc)scene+='<path d="M176 77Q223 15 294 110" stroke="#d68816" stroke-width="4" stroke-dasharray="6 5" fill="none" marker-end="url(#'+uid+'shot)"/>';
 scene+='<defs><marker id="'+uid+'dribble" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7" stroke="#0685c3" stroke-width="2" fill="none"/></marker><marker id="'+uid+'shot" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7" stroke="#d68816" stroke-width="2" fill="none"/></marker></defs>';
 const chip=shooting?phase===0?'SĀKUMA STĀJA':phase===1?'SAGATAVOJIES':phase===2?'METIENA KUSTĪBA':'METIENA NOSLĒGUMS':phase===0?'SĀKUMA STĀJA':phase===1?'ZEMS DRIBLS':phase===2?'VIDĒJS DRIBLS':'BUMBAS KONTROLE';
 scene+='<rect x="29" y="240" width="195" height="31" rx="9" fill="#18382f"/><text x="42" y="260" fill="#ffffff" font-size="11" font-weight="900" font-family="Arial,sans-serif">'+chip+'</text>';
 return '<svg class="tm-court-svg tm-court-pro '+(small?'tm-court-mini':'')+'" viewBox="0 0 370 289" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+tmVSafe(d.title+' - '+chip)+'">'+scene+'</svg>';
}
function tmCourt(diagram,small=false,guide=null){
 const d=guide?.drill;
 if(d&&tmVMode(d)!=='court')return tmVTechniqueView(d,guide.step??-1,small);
 return tmVCourtView(d||null,guide?.step??-1,small);
}
function tmLegend(){
 return '<div class="tm-legend tm-pro-legend" aria-label="Shēmu apzīmējumi"><span><b class="tm-dot offense">O</b> Uzbrucējs</span><span><b class="tm-dot defense">X</b> Aizsargs</span><span><b class="tm-vball-icon">●</b> Bumba</span><span><i class="tm-vline tm-vrun"></i> Skrien</span><span><i class="tm-vline tm-vdribble"></i> Driblē</span><span><i class="tm-vline tm-vpass"></i> Piespēlē</span><span><i class="tm-vline tm-vshot"></i> Met</span><span><i class="tm-vline tm-vdef"></i> Aizsargā</span></div>';
}
