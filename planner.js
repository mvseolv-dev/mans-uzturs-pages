/* MANS UZTURS ACTIVE - editable basketball and workout planner, 2026. */
let plannerEditor=null;
const PLAN_TYPES=['Basketbols','Spēle','Pastaiga','Mājas treniņš','Cits'];
const plannerDailyNames=['Pirmdiena','Otrdiena','Trešdiena','Ceturtdiena','Piektdiena','Sestdiena','Svētdiena'];
function plannerRecords(){return Array.isArray(state.trainingEntries)?state.trainingEntries:[]}
function plannerTime(t){return /^\d{2}:\d{2}$/.test(t||'')?t:'99:99'}
function plannerKey(item){return item.custom?'custom:'+item.id+'@'+item.date:item.date}
function plannerWithOverrides(base){
 const overrides=state.trainingOverrides||{},skips=state.trainingSkips||{};
 const idWeek='week:'+base.day,idDate='date:'+base.date;
 if(skips[idWeek]||skips[idDate])return null;
 if(base.type==='Atcelts')return null;
 const weekly=overrides[idWeek]||{},dated=overrides[idDate]||{};
 return {...base,...weekly,...dated,custom:false,logKey:base.date};
}
function plannerDaySessions(day,offset=fitWeekOffset){
 const base=sportItems(offset)[day],date=base.date;
 const list=[];const preset=plannerWithOverrides(base);
 if(preset)list.push(preset);
 for(const entry of plannerRecords()){
  if(!entry||!entry.id)continue;
  if(entry.repeat==='weekly'?(entry.weekday===day&&date>=(entry.startDate||'0000-01-01')):entry.date===date){
   list.push({custom:true,id:entry.id,day,date,name:plannerDailyNames[day],title:entry.title,type:entry.type,time:entry.time||'',place:entry.place||'',minutes:Number(entry.minutes)||60,repeat:entry.repeat,logKey:'custom:'+entry.id+'@'+date});
  }
 }
 return list.sort((a,b)=>plannerTime(a.time).localeCompare(plannerTime(b.time))||(a.custom?1:-1));
}
function plannerSessions(offset=fitWeekOffset){return Array.from({length:7},(_,i)=>plannerDaySessions(i,offset)).flat()}
function plannerLog(s){return state.sportLog?.[plannerKey(s)]||null}
fitDone=function(s){return !!plannerLog(s)?.done};
fitPossible=function(s){return !!s&&s.type!=='Atcelts'&&s.type!=='Iespējams'&&(!(!s.custom&&s.day===6&&!s.choice))};
fitSummary=function(sessions){
 const firstDate=sessions?.[0]?.date||sportDate(0,fitWeekOffset);
 const weekOffset=Math.round((Date.parse(firstDate+'T12:00:00Z')-Date.parse(sportDate(0,0)+'T12:00:00Z'))/604800000);
 const items=plannerSessions(weekOffset);
 const included=items.filter(fitPossible),completed=items.filter(fitDone);
 const minutes=completed.reduce((sum,x)=>sum+(Number(plannerLog(x)?.minutes)||x.minutes||0),0);
 const low=sportDate(0,weekOffset),high=sportDate(6,weekOffset);
 const home=Object.entries(state.homeSessions||{}).filter(([k,v])=>v&&k.slice(0,10)>=low&&k.slice(0,10)<=high).length;
 return {planned:included.length,done:completed.length,minutes,home};
};
fitNext=function(){
 const current=fitToday();
 const choices=[...plannerSessions(0),...plannerSessions(1),...plannerSessions(2)].filter(s=>fitPossible(s)&&!fitDone(s)&&s.date>=current);
 return choices.sort((a,b)=>a.date.localeCompare(b.date)||plannerTime(a.time).localeCompare(plannerTime(b.time)))[0]||{date:current,name:'Nav plānots',title:'Pievieno aktivitāti',time:'',place:'',minutes:0,type:'Atcelts'};
};
function plannerHeading(type){return type==='Pastaiga'?'PASTAIGA':type==='Spēle'?'SPĒLE':type==='Mājas treniņš'?'MĀJĀS':type==='Basketbols'||type==='BUKI'?'BASKETBOLS':'AKTIVITĀTE'}
function plannerChip(s){
 const done=fitDone(s);
 return '<article class="ap-planner-card"><div class="ap-planner-card-head"><span class="ap-planner-category">'+plannerHeading(s.type)+(s.custom?' · MANS':'')+'</span>'+activeTag(done?'PAVEIKTS':s.type==='Iespējams'?'JĀPRECIZĒ':'PLĀNĀ',done?'lime':'')+'</div>'+
 '<h3>'+safe(s.title)+'</h3><p class="ap-planner-detail">'+(s.time?safe(s.time)+' · ':'')+(s.place?safe(s.place)+' · ':'')+s.minutes+' min</p>'+
 ((!s.custom&&s.day===3)?'<div class="ap-location-toggle"><button type="button" data-ap-choice="garden" data-date="'+s.date+'" class="'+(s.choice!=='veterans'?'selected':'')+'">Gardene<small>19:00</small></button><button type="button" data-ap-choice="veterans" data-date="'+s.date+'" class="'+(s.choice==='veterans'?'selected':'')+'">Veterānu treniņš<small>19:00</small></button></div>':'')+
 ((!s.custom&&s.day===6)?'<div class="ap-planner-sunday">'+fitChoice(s)+'</div>':'')+
 '<div class="ap-planner-card-actions"><button type="button" data-plan="toggle" data-key="'+safe(plannerKey(s))+'">'+(done?'✓ Atcelt paveikto':'✓ Atzīmēt paveiktu')+'</button><button type="button" data-plan="edit" data-id="'+safe(s.custom?s.id:'')+'" data-date="'+s.date+'" data-day="'+s.day+'">Rediģēt</button><button type="button" class="ap-planner-danger" data-plan="delete" data-id="'+safe(s.custom?s.id:'')+'" data-date="'+s.date+'" data-day="'+s.day+'">Dzēst</button></div></article>';
}
function plannerStartDate(day=fitSelectedDay){
 return sportDate(day===null?(rigaToday().getUTCDay()+6)%7:day,fitWeekOffset);
}
function plannerShowEditor(mode,day,date,id){
 const target=mode==='edit'?(id?plannerRecords().find(e=>e.id===id):plannerDaySessions(day).find(e=>!e.custom&&e.date===date)):null;
 const key=date||plannerStartDate(day);
 const recurring=!!target&&(target.repeat==='weekly'||(!!target.custom===false&&!!state.trainingOverrides?.['date:'+key]));
 plannerEditor={mode,id:id||'',date:key,day:day??(new Date(key+'T12:00:00Z').getUTCDay()+6)%7,title:target?.title||'',type:target?.type==='BUKI'?'Basketbols':target?.type||'Basketbols',time:target?.time&&/^\d{2}:\d{2}$/.test(target.time)?target.time:'19:00',place:target?.place||'',minutes:target?.minutes||90,repeat:recurring,base:!!target&&!target.custom};
 render();
 const el=document.getElementById('planner-form');
 if(el&&typeof el.scrollIntoView==='function')el.scrollIntoView({behavior:'smooth',block:'center'});
}
function plannerEditForm(){
 if(!plannerEditor)return '';
 const e=plannerEditor;
 return '<form id="planner-form" class="ap-planner-form">'+
 '<div class="ap-planner-form-head"><div><small>'+(e.mode==='edit'?'REDIĢĒŠANA':'JAUNA AKTIVITĀTE')+'</small><h3>'+(e.mode==='edit'?'Rediģēt treniņu':'Pievienot treniņu')+'</h3></div><button type="button" data-plan="cancel" aria-label="Aizvērt">×</button></div>'+
 '<div class="ap-planner-fields">'+
 '<label class="ap-field-wide">Nosaukums<input name="title" maxlength="90" value="'+safe(e.title)+'" placeholder="Piemēram, basketbola treniņš" required></label>'+
 '<label>Aktivitāte<select name="type">'+PLAN_TYPES.map(t=>'<option value="'+t+'"'+(e.type===t?' selected':'')+'>'+t+'</option>').join('')+'</select></label>'+
 '<label>Datums<input type="date" name="date" value="'+e.date+'"'+(e.base?' readonly':'')+' required></label>'+
 '<label>Laiks<input name="time" type="time" value="'+e.time+'" required></label>'+
 '<label>Ilgums (min)<input name="minutes" type="number" min="5" max="300" value="'+e.minutes+'" required></label>'+
 '<label class="ap-field-wide">Vieta<input name="place" maxlength="100" value="'+safe(e.place)+'" placeholder="Piemēram, Dobeles sporta centrs"></label>'+
 '<label class="ap-field-wide ap-repeat"><input name="repeat" type="checkbox" '+(e.repeat?'checked':'')+'><span>Atkārtot katru nedēļu šajā nedēļas dienā</span></label>'+
 '</div><p class="ap-planner-help">'+(e.base?'Saglabājot varēsi mainīt šo vienu datumu vai attiecīgo treniņu visās nedēļās.':'Ja atzīmēsi atkārtošanu, treniņš parādīsies arī nākamajās nedēļās.')+'</p>'+
 '<button type="submit" class="ap-planner-save">Saglabāt aktivitāti ↗</button>'+(e.base?'<button type="button" class="ap-planner-stop" data-plan="skip-week" data-day="'+e.day+'">Noņemt šo treniņu no visām nedēļām</button>':'')+'</form>';
}
function plannerEmpty(date){return '<div class="ap-planner-empty"><span>◌</span><h3>Šajā dienā treniņš nav ieplānots</h3><p>Atpūties vai pievieno jaunu aktivitāti, kad būs zināms grafiks.</p><button data-plan="new" data-date="'+date+'">+ Pievienot treniņu</button></div>'}
renderFitnessSchedule=function(){
 if(fitSelectedDay===null)fitSelectedDay=(rigaToday().getUTCDay()+6)%7;
 const week=sportItems(fitWeekOffset),date=week[fitSelectedDay]?.date||plannerStartDate(),selected=plannerDaySessions(fitSelectedDay),all=plannerSessions(),summary=fitSummary(week);
 const days=week.map((d,i)=>{const items=plannerDaySessions(i),done=items.some(fitDone),n=Number(d.date.slice(-2));return '<button class="'+(i===fitSelectedDay?'now ':'')+(done?'marked':'')+'" data-fit="day" data-day="'+i+'" aria-pressed="'+(i===fitSelectedDay?'true':'false')+'"><span>'+d.name.slice(0,2)+'</span><b>'+n+'</b><small>'+(done?'✓':items.length?String(items.length):'·')+'</small></button>'}).join('');
 const listing=all.filter(x=>x.day!==fitSelectedDay).map(s=>'<button class="ap-planner-list-row" data-fit="day" data-day="'+s.day+'"><span>'+s.name.slice(0,2)+'</span><div><strong>'+safe(s.title)+'</strong><small>'+safe(s.time||'Laiks jāprecizē')+(s.place?' · '+safe(s.place):'')+'</small></div>'+activeTag(fitDone(s)?'PAVEIKTS':'PLĀNĀ',fitDone(s)?'lime':'')+'</button>').join('');
 return '<div class="ap-screen ap-planner">'+activeTitle("TRAINING PLANNER","Treniņu grafiks","Pievieno, rediģē un atzīmē savas aktivitātes. Trešdiena pašlaik ir brīva.")+
 '<button class="ap-planner-add" data-plan="new" data-date="'+date+'">+ Pievienot aktivitāti <span>↗</span></button>'+
 '<div class="ap-week-header"><div><span>TAVA NEDĒĻA</span><h2>'+fitD(week[0].date)+' - '+fitD(week[6].date)+'</h2></div><div><button data-fit="week-prev" aria-label="Iepriekšējā nedēļa">‹</button><button data-fit="week-next" aria-label="Nākamā nedēļa">›</button></div></div>'+
 '<div class="ap-day-strip">'+days+'</div>'+
 '<div class="ap-stats"><div><span>PLĀNĀ</span><strong>'+summary.planned+'</strong><em>aktivitātes</em></div><div><span>PAVEIKTS</span><strong>'+summary.done+'</strong><em>aktivitātes</em></div><div><span>KUSTĪBĀ</span><strong>'+summary.minutes+'<small> min</small></strong><em>atzīmētais laiks</em></div></div>'+
 plannerEditForm()+
 activeSection("IZVĒLĒTĀ DIENA",plannerDailyNames[fitSelectedDay]+' · '+fitD(date),activeTag(selected.length+' aktivit.',"lime"))+
 (selected.length?'<div class="ap-planner-selected-list">'+selected.map(plannerChip).join('')+'</div>':plannerEmpty(date))+
 ((state.trainingSkips?.['date:'+date]||state.trainingSkips?.['week:'+fitSelectedDay])?'<button class="ap-planner-restore" data-plan="restore" data-date="'+date+'" data-day="'+fitSelectedDay+'">Atjaunot noklusēto treniņu</button>':'')+
 activeSection("NEDĒĻAS AKTIVITĀTES","Pārējie treniņi")+'<div class="ap-planner-list">'+(listing||'<p class="ap-planner-none">Šonedēļ nav citu ieplānotu aktivitāšu.</p>')+'</div>'+
 '<p class="ap-planner-note">Visas izmaiņas glabājas tavā telefonā, nevis publiskajā GitHub repozitorijā. Lai datus nepazaudētu, regulāri eksportē rezerves kopiju sadaļā Progress.</p></div>';
};
function plannerResetCheck(s){
 const key=plannerKey(s);if(state.sportLog?.[key])delete state.sportLog[key];
}
function plannerSave(form){
 const fd=new FormData(form),title=String(fd.get('title')||'').trim(),type=String(fd.get('type')||''),date=String(fd.get('date')||''),time=String(fd.get('time')||''),place=String(fd.get('place')||'').trim(),minutes=Number(fd.get('minutes')),weekly=fd.has('repeat');
 if(!title||title.length>90||!PLAN_TYPES.includes(type)||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time)||!Number.isInteger(minutes)||minutes<5||minutes>300||place.length>100){toast('Pārbaudi aktivitātes laukus.');return false}
 const day=(new Date(date+'T12:00:00Z').getUTCDay()+6)%7;
 if(plannerEditor?.base){
  const key=(weekly?'week:'+plannerEditor.day:'date:'+plannerEditor.date);
  state.trainingOverrides??={};
  state.trainingOverrides[key]={title,type,time,place,minutes};
  if(state.trainingSkips)delete state.trainingSkips[key];
 }else{
  state.trainingEntries??=[];
  const existing=plannerEditor?.id?state.trainingEntries.find(e=>e.id===plannerEditor.id):null;
  const id=existing?.id||'custom-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
  const value={id,title,type,time,place,minutes,repeat:weekly?'weekly':'once',date,weekday:day,startDate:existing?.startDate||date};
  if(existing)Object.assign(existing,value);else state.trainingEntries.push(value);
 }
 fitSelectedDay=day;
 const monday=Date.parse(sportDate(0,0)+'T12:00:00Z');
 const selectedMonday=Date.parse(date+'T12:00:00Z')-day*86400000;
 fitWeekOffset=Math.round((selectedMonday-monday)/604800000);
 plannerEditor=null;save();render();toast('Aktivitāte saglabāta.');return true;
}
document.addEventListener('click',event=>{
 const b=event.target.closest('[data-plan]');if(!b)return;
 const action=b.dataset.plan;
 if(action==='cancel'){plannerEditor=null;render();return}
 if(action==='new'){const date=b.dataset.date||plannerStartDate();const day=(new Date(date+'T12:00:00Z').getUTCDay()+6)%7;plannerShowEditor('new',day,date,null);return}
 if(action==='edit'){plannerShowEditor('edit',Number(b.dataset.day),b.dataset.date,b.dataset.id||null);return}
 if(action==='skip-week'){const day=Number(b.dataset.day);if(!confirm('Noņemt noklusēto treniņu no visām nedēļām?'))return;state.trainingSkips??={};state.trainingSkips['week:'+day]=true;plannerEditor=null;save();render();return}
 if(action==='restore'){state.trainingSkips??={};delete state.trainingSkips['date:'+b.dataset.date];delete state.trainingSkips['week:'+b.dataset.day];save();render();return}
 if(action==='toggle'){
  const key=b.dataset.key,items=plannerSessions(),item=items.find(x=>plannerKey(x)===key);if(!item)return;
  state.sportLog??={};if(state.sportLog[key]?.done)delete state.sportLog[key];
  else state.sportLog[key]={done:true,minutes:item.minutes};save();render();return;
 }
 if(action==='delete'){
  const id=b.dataset.id,date=b.dataset.date,day=Number(b.dataset.day);
  if(id){const entry=plannerRecords().find(x=>x.id===id);if(!entry)return;
   if(!confirm(entry.repeat==='weekly'?'Dzēst šo treniņu no visām nākamajām nedēļām?':'Dzēst šo treniņu?'))return;
   state.trainingEntries=plannerRecords().filter(x=>x.id!==id);save();render();return;
  }
  if(!confirm('Noņemt šo ieplānoto treniņu no '+date+'?'))return;
  state.trainingSkips??={};state.trainingSkips['date:'+date]=true;
  if(state.sportLog)delete state.sportLog[date];
  save();render();return;
 }
});
document.addEventListener('submit',event=>{
 if(event.target?.id!=='planner-form')return;
 event.preventDefault();plannerSave(event.target);
});

render();
