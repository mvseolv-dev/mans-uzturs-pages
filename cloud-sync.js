/* Mans uzturs cloud sync. Local-first, one authenticated account per profile.
 * Only a public Supabase publishable key is included. Access is enforced by RLS.
 * Passwords are never written to localStorage or repository.
 */
'use strict';
window.CloudSync=(()=>{
 const URL='https://teimdzagcrdoqrgrgwso.supabase.co';
 const PUBLIC_KEY='sb_publishable_aOAuwFFy5_gmVOnMABhtMQ_cP718W7O';
 const AUTH_KEY='mu-cloud-account-v1',PREFIX='mu-cloud-v1:';
 const legacy=p=>p==='liva'?'mans-uzturs-liva-v1':'mans-uzturs-v1';
 const parse=(raw)=>{try{return JSON.parse(raw)}catch{return null}};
 const read=k=>parse(localStorage.getItem(k));
 const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
 const validProfile=p=>p==='maris'||p==='liva';
 const validAccount=a=>a&&validProfile(a.profile)&&typeof a.uid==='string'&&/^[0-9a-f-]{36}$/i.test(a.uid);
 const getAccount=()=>{const a=read(AUTH_KEY);return validAccount(a)?a:null};
 const keyOf=a=>PREFIX+a.uid+':'+a.profile;
 const baseKey=a=>keyOf(a)+':base';
 const obj=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
 const valid=v=>obj(v)&&Array.isArray(v.weights)&&obj(v.config)&&obj(v.checks)&&obj(v.shopping);
 const stable=v=>{if(v===undefined)return 'undefined';if(Array.isArray(v))return '['+v.map(stable).join(',')+']';if(obj(v))return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}';return JSON.stringify(v)};
 const same=(a,b)=>stable(a)===stable(b);
 const cleanCopy=v=>v===undefined?undefined:JSON.parse(JSON.stringify(v));
 // Three-way merge protects independent edits; a workout for one date is atomic.
 // Simultaneous edits of the same field/date require user resolution.
 function merge3(base,local,remote,prefer=null){
  const conflicts=[];
  function merge(b,l,r,path){
   if(same(l,r))return cleanCopy(l);
   if(same(b,l))return cleanCopy(r);
   if(same(b,r))return cleanCopy(l);
   if(path==='weights'&&[b,l,r].every(Array.isArray)&&[b,l,r].every(a=>a.every(x=>obj(x)&&typeof x.date==='string'))){
    const map=a=>Object.fromEntries(a.map(x=>[x.date,x]));
    const result=merge(map(b),map(l),map(r),'weights_by_date');
    return Object.values(result).sort((a,z)=>a.date.localeCompare(z.date));
   }
   if(path==='programFavorites'||path==='exerciseFavorites'||path==='favorites'){
    if([b,l,r].every(a=>Array.isArray(a)&&a.every(x=>typeof x==='string'))){
     const values=[...new Set([...b,...l,...r])];
     return values.filter(v=>merge(b.includes(v),l.includes(v),r.includes(v),path+'.'+v));
    }
   }
   if(!/^customDayWorkouts\.[^.]+$/.test(path)&&!/^weights_by_date\.[^.]+$/.test(path)&&obj(l)&&obj(r)&&(obj(b)||b===undefined)){
    const result=Object.create(null);
    for(const k of new Set([...Object.keys(b||{}),...Object.keys(l),...Object.keys(r)])){
     if(['__proto__','constructor','prototype'].includes(k))continue;
     const val=merge(b?.[k],l[k],r[k],path?path+'.'+k:k);
     if(val!==undefined)result[k]=val;
    }
    return result;
   }
   conflicts.push(path||'profils');
   return cleanCopy(prefer==='remote'?r:l);
  }
  return {payload:merge(base,local,remote,''),conflicts};
 }
 let timer=null,busy=false,conflict=null,lastStatus='',lastKind='local',ready=false;
 const $=id=>document.getElementById(id);
 const connected=()=>navigator.onLine!==false;
 function label(text,kind='local'){
  lastStatus=text;lastKind=kind;
  const btn=$('cloud-open'),status=$('cloud-status'),a=getAccount();
  if(btn){btn.textContent=a?'Mākonis':'Pieslēgt kontu';btn.dataset.status=kind}
  if(status){status.textContent=text;status.dataset.status=kind}
  const bar=$('cloud-bar');if(bar)bar.hidden=!!a;
  const name=a?(a.profile==='liva'?'Līva':'Māris'):'';
  const account=$('cloud-account');if(account){account.hidden=!a;account.dataset.status=kind;account.title=name+' · '+text;account.setAttribute('aria-label',name+' · Konta izvēlne · '+text);}
  const nameNode=$('cloud-profile-name');if(nameNode)nameNode.textContent=name;
  const picker=$('local-profile-picker');if(picker)picker.hidden=!!a;
  const selector=$('profile-select');if(selector){selector.disabled=!!a;}
  const panel=$('cloud-panel');if(panel&&!panel.hidden)paintPanel();
 }
 function countText(p){return (p?.weights?.length||0)+' svara ieraksti · '+Object.keys(p?.homeSessions||{}).filter(k=>p.homeSessions[k]).length+' paveikti treniņi'}
 function dirty(a){const l=read(keyOf(a)),b=read(baseKey(a));return valid(l)&&(!b||!same(l,b.payload))}
 class HttpError extends Error{constructor(status){super('HTTP '+status);this.status=status}}
 async function request(path,{method='GET',token,body,headers={}}={}){
  const controller=new AbortController(),to=setTimeout(()=>controller.abort(),15000);
  try{
   const h={'apikey':PUBLIC_KEY,Accept:'application/json',...headers};
   if(token)h.Authorization='Bearer '+token;
   if(body!==undefined)h['Content-Type']='application/json';
   const res=await fetch(URL+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',signal:controller.signal});
   if(!res.ok)throw new HttpError(res.status);
   const text=await res.text();return text?JSON.parse(text):null;
  }finally{clearTimeout(to)}
 }
 const authRequest=(grant,body)=>request('/auth/v1/token?grant_type='+grant,{method:'POST',body});
 function sessionFrom(response){
  if(!response?.access_token||!response?.refresh_token||!response?.user?.id)throw new Error('Nederīga sesija.');
  return {uid:response.user.id,email:response.user.email||'',access:response.access_token,refresh:response.refresh_token,expires:Date.now()+Math.max(60,Number(response.expires_in)||3600)*1000};
 }
 function assertActive(a){const now=getAccount();if(!now||now.uid!==a.uid||now.profile!==a.profile)throw new Error('Konts mainīts.');return now}
 function locked(name,fn){return navigator.locks?.request?navigator.locks.request(name,fn):fn()}
 async function accessFor(a){
  return locked('mu-cloud-auth',async()=>{
   const now=assertActive(a);
   if(now.access&&now.expires>Date.now()+90000)return now.access;
   if(!now.refresh)throw new HttpError(401);
   const fresh=sessionFrom(await authRequest('refresh_token',{refresh_token:now.refresh}));
   if(fresh.uid!==now.uid)throw new HttpError(401);
   const current=assertActive(a);
   write(AUTH_KEY,{...current,...fresh});
   return fresh.access;
  });
 }
 const table='/rest/v1/training_profile_state';
 const filter=uid=>'?user_id=eq.'+encodeURIComponent(uid);
 const fields='user_id,profile,payload,revision,updated_at';
 async function pull(uid,token){
  const rows=await request(table+filter(uid)+'&select='+fields,{token});
  const r=rows?.[0]||null;
  if(r&&(!valid(r.payload)||!validProfile(r.profile)||!Number.isSafeInteger(Number(r.revision))))throw Error('Nederīga datu kopija.');
  return r;
 }
 async function createRow(session,profile,payload){
  const rows=await request(table+'?select='+fields,{method:'POST',token:session.access,body:{user_id:session.uid,profile,payload},headers:{Prefer:'return=representation'}});
  if(!rows?.[0])throw Error('Datubāze neatgrieza ierakstu.');
  return rows[0];
 }
 async function patchRow(a,token,revision,payload){
  const rows=await request(table+filter(a.uid)+'&revision=eq.'+Number(revision)+'&select='+fields,{method:'PATCH',token,body:{payload},headers:{Prefer:'return=representation'}});
  return rows?.[0]||null;
 }
 function saveBase(a,row){write(baseKey(a),{revision:Number(row.revision),payload:row.payload})}
 function updateApp(a){
  if(!ready||getAccount()?.uid!==a.uid||getAccount()?.profile!==a.profile)return;
  if(typeof load==='function'&&typeof render==='function'){
   state=load();
   // Do not remove a form that is currently being edited.
   const tag=document.activeElement?.tagName;
   if(!['INPUT','TEXTAREA','SELECT'].includes(tag))render();
  }
 }
 function showConflict(a,row,local,fields){
  conflict={uid:a.uid,revision:Number(row.revision),local:cleanCopy(local),remote:cleanCopy(row.payload),fields};
  label('Jāsaskaņo dati','conflict');
 }
 function storeBackup(a,local,remote){
  write(keyOf(a)+':conflict-backup',{date:new Date().toISOString(),local,remote});
 }
 async function syncNow(prefer=null){
  const a=getAccount();if(!a)return;
  if(busy)return;
  if(!connected()){label(dirty(a)?'Bezsaistē · gaida sinhronizāciju':'Bezsaistē','offline');return}
  const expected=prefer?conflict:null;
  busy=true;label('Sinhronizē…','busy');
  try{await locked('mu-cloud-sync-'+a.uid,async()=>{
   const token=await accessFor(a),row=await pull(a.uid,token);
   assertActive(a);
   if(!row||row.profile!==a.profile)throw Error('Konta profils nav pieejams.');
   const l=read(keyOf(a)),base=read(baseKey(a));
   if(!valid(l))throw Error('Lokālā kopija nav derīga.');
   if(same(l,row.payload)){saveBase(a,row);conflict=null;label('Sinhronizēts','ok');return}
   let merged,conflicts=[];
   if(base&&valid(base.payload)){const m=merge3(base.payload,l,row.payload,prefer);merged=m.payload;conflicts=m.conflicts}
   else {merged=prefer==='remote'?row.payload:l;conflicts=['profils']}
   if(conflicts.length){
    if(!prefer||!expected||expected.uid!==a.uid||expected.revision!==Number(row.revision)||!same(expected.local,l)){
     showConflict(a,row,l,conflicts);return;
    }
    storeBackup(a,l,row.payload);
   }
   if(!valid(merged))throw Error('Apvienotos datus neizdevās pārbaudīt.');
   if(same(merged,row.payload)){
    // Do not overwrite intervening local edits.
    if(!same(read(keyOf(a)),l)){queue();return}
    write(keyOf(a),merged);saveBase(a,row);updateApp(a);conflict=null;label('Sinhronizēts','ok');return;
   }
   const result=await patchRow(a,token,row.revision,merged);
   assertActive(a);
   if(!result){label('Gaida sinhronizāciju','pending');queue();return}
   // Edits made during the write are merged with the saved result, not discarded.
   const latest=read(keyOf(a));
   if(!same(latest,l)){
    const next=merge3(l,latest,result.payload);
    if(next.conflicts.length){showConflict(a,result,latest,next.conflicts);return}
    write(keyOf(a),next.payload);saveBase(a,result);updateApp(a);conflict=null;label('Gaida sinhronizāciju','pending');queue();return;
   }
   write(keyOf(a),result.payload);saveBase(a,result);if(!same(l,result.payload))updateApp(a);
   conflict=null;label('Sinhronizēts','ok');
  })}catch(e){
   if(getAccount()?.uid===a.uid){
    if(e.status===401||e.status===403){const current=getAccount();if(current?.uid===a.uid)write(AUTH_KEY,{...current,expires:0});label('Pieslēdzies vēlreiz','error');}
    else label(connected()?'Nav izdevies sinhronizēt · dati ierīcē':'Bezsaistē · dati ierīcē','offline');
   }
  }finally{busy=false;paintPanel()}
 }
 function queue(){clearTimeout(timer);timer=setTimeout(()=>syncNow(),800)}
 function changed(){const a=getAccount();if(!a)return;label(connected()?'Gaida sinhronizāciju':'Bezsaistē · dati ierīcē',connected()?'pending':'offline');queue()}
 function activate(session,row,useCache){
  const a={...session,profile:row.profile};
  if(!useCache){
   // Keep account information separate from the pre-existing local profile.
   write(keyOf(a),row.payload);saveBase(a,row);
  }
  write(AUTH_KEY,a);
  localStorage.setItem('mans-uzturs-active-profile',a.profile);
  activeProfile=a.profile;state=load();if(typeof lbResetProfile==='function')lbResetProfile();
  go('progress');conflict=null;label('Pieslēgts','ok');
  closePanel();queue();
 }
 function defaultFor(profile){
  const src=profile==='liva'?LIVA_DEFAULT:DEFAULT;return cleanCopy(src);
 }
 async function login(email,password,profile){
  if(busy)return;
  if(!connected()){label('Pirmajai pieslēgšanai vajag internetu','offline');return}
  busy=true;label('Pieslēdzas…','busy');
  try{
   const session=sessionFrom(await authRequest('password',{email,password}));
   const old=getAccount();
   if(old&&old.uid!==session.uid)throw Error('Vispirms izraksties no pašreizējā konta.');
   let row=await pull(session.uid,session.access);
   if(!row){
    if(!validProfile(profile))throw Error('Izvēlies profilu.');
    if(!confirm('Šo kontu sasaistīt ar '+(profile==='liva'?'Līvas':'Māra')+' profilu? Turpmāk kontā būs tikai šī profila dati.')){label('Nav pieslēgts','local');return}
    const local=read(legacy(profile)),canImport=valid(local);
    const useLocal=canImport&&confirm('Pārnest šī profila esošos ierīces datus uz kontu? '+countText(local)+'. Atcel, lai izveidotu tukšu profilu. Vecie dati ierīcē paliks.');
    const payload=useLocal?local:defaultFor(profile);
    try{row=await createRow(session,profile,payload)}
    catch(e){if(e.status!==409)throw e;row=await pull(session.uid,session.access);if(!row)throw e;}
   }
   const cached=read(keyOf({...session,profile:row.profile})),cacheExists=valid(cached);
   if(!old&&!cacheExists&&row.profile!==profile){
    if(!confirm('Šis konts pieder '+(row.profile==='liva'?'Līvas':'Māra')+' profilam. Atvērt to?')){label('Nav pieslēgts','local');return}
   }
   activate(session,row,cacheExists);
  }catch(e){
   const msg=e.status===400||e.status===401?'Neizdevās pieslēgties. Pārbaudi e-pastu, paroli un konta aktivizāciju.':e.status===429?'Pārāk daudz mēģinājumu. Mēģini vēlāk.':'Neizdevās pieslēgties. '+(e.status?'Pārbaudi savienojumu un kontu.':(e.message==='Vispirms izraksties no pašreizējā konta.'?e.message:'Dati ierīcē nav mainīti.'));
   label(msg,'error');
  }finally{busy=false;paintPanel()}
 }
 async function logout(){
  const a=getAccount();if(!a||busy)return;
  if(dirty(a)&&!confirm('Ir nesinhronizēti dati. Tie paliks šajā ierīcē līdz atkārtotai pieslēgšanai tam pašam kontam. Vai izrakstīties?'))return;
  if(!confirm('Izrakstīties no konta? Bezsaistes konta datu kopija paliks ierīcē.'))return;
  busy=true;
  try{if(connected()&&a.access)await request('/auth/v1/logout?scope=local',{method:'POST',token:a.access});}catch{}
  finally{
   localStorage.removeItem(AUTH_KEY);conflict=null;clearTimeout(timer);
   activeProfile=a.profile;state=load();if(typeof lbResetProfile==='function')lbResetProfile();
   go('progress');busy=false;label('Tikai šajā ierīcē','local');closePanel();
  }
 }
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function paintPanel(){
  const panel=$('cloud-panel');if(!panel||panel.hidden)return;
  const a=getAccount(),body=$('cloud-panel-body');if(!body)return;
  // Never rerender the password form while a user is typing.
  const editing=body.querySelector('form')&&body.contains(document.activeElement);
  const status=$('cloud-panel-status');if(status){status.textContent=lastStatus;status.dataset.status=lastKind;}
  if(editing){const submit=body.querySelector('button[type="submit"]');if(submit)submit.disabled=busy;return;}
  const title=a?(a.profile==='liva'?'Līvas':'Māra')+' mākonis':'Pieslēgt mākoņa kontu';
  $('cloud-panel-title').textContent=title;
  const conflictHtml=conflict&&a&&conflict.uid===a.uid?'<div class="cloud-conflict"><strong>Vienlaikus mainīti dati</strong><p>Ierīcē: '+esc(countText(conflict.local))+'<br>Mākonī: '+esc(countText(conflict.remote))+'</p><p>Neatkarīgās izmaiņas tiks apvienotas. Izvēlies, kuru versiju paturēt tikai konfliktējošajos laukos. Abu versiju rezerves kopija paliks ierīcē.</p><button type="button" data-cloud="local">Priekšroku ierīcei</button><button type="button" data-cloud="remote">Priekšroku mākonim</button></div>':'';
  const form='<form id="cloud-login"><label>E-pasts<input name="email" type="email" autocomplete="username" required value="'+esc(a?.email||'')+'"></label><label>Parole<input name="password" type="password" autocomplete="current-password" required></label>'+(!a?'<label>Datu profils (pirmajai pieslēgšanai)<select name="profile"><option value="maris" '+(activeProfile==='maris'?'selected':'')+'>Māris</option><option value="liva" '+(activeProfile==='liva'?'selected':'')+'>Līva</option></select></label>':'')+'<button type="submit" '+(busy?'disabled':'')+'>Pieslēgties</button></form>';
  if(!a)body.innerHTML='<p>Izmanto savu Supabase kontu. Līdz pieslēgšanai aplikācija saglabā datus tikai šajā ierīcē. Pirmajā reizē vari pārnest esošo profilu.</p>'+form;
  else body.innerHTML='<p>'+esc(a.email)+'<br>Dati tiek glabāti privāti tavā kontā. Bezsaistē izmaiņas paliek ierīcē.</p>'+conflictHtml+(lastKind==='error'?form:'')+'<div class="cloud-actions"><button data-cloud="sync" '+(busy?'disabled':'')+'>Sinhronizēt tagad</button><button data-cloud="logout" '+(busy?'disabled':'')+'>Izrakstīties</button></div>'+(read(keyOf(a)+':conflict-backup')?'<button class="cloud-download" data-cloud="backup">Lejupielādēt konflikta rezerves kopiju</button>':'');
 }
 function openPanel(){const panel=$('cloud-panel');if(!panel)return;panel.hidden=false;paintPanel();$('cloud-close')?.focus();}
 function closePanel(){const panel=$('cloud-panel');if(panel){panel.hidden=true;$('cloud-panel-body').innerHTML='';}}
 function saveConflictBackup(){const a=getAccount(),data=a&&read(keyOf(a)+':conflict-backup');if(!data)return;const url=globalThis.URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='mans-uzturs-konflikta-kopija.json';link.click();setTimeout(()=>globalThis.URL.revokeObjectURL(url),1000);}
 function init(){
  if(ready)return;ready=true;
  const a=getAccount();label(a?(connected()?'Gaida sinhronizāciju':'Bezsaistē'):'Tikai šajā ierīcē',a?'pending':'local');
  document.addEventListener('click',e=>{const b=e.target.closest('[data-cloud]');if(!b)return;const act=b.dataset.cloud;if(act==='open')openPanel();else if(act==='close')closePanel();else if(act==='sync')syncNow();else if(act==='logout')logout();else if(act==='local'||act==='remote')syncNow(act);else if(act==='backup')saveConflictBackup()});
  document.addEventListener('submit',e=>{if(e.target.id!=='cloud-login')return;e.preventDefault();const fd=new FormData(e.target),email=String(fd.get('email')||'').trim(),password=String(fd.get('password')||''),profile=String(fd.get('profile')||getAccount()?.profile||activeProfile);e.target.reset();login(email,password,profile)});
  window.addEventListener('online',()=>syncNow());window.addEventListener('offline',()=>{const a=getAccount();if(a)label(dirty(a)?'Bezsaistē · gaida sinhronizāciju':'Bezsaistē','offline')});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncNow()});
  window.addEventListener('storage',e=>{if(e.key===AUTH_KEY){const before=parse(e.oldValue),after=parse(e.newValue);if(before?.uid!==after?.uid||before?.profile!==after?.profile)location.reload()}const a=getAccount();if(a&&e.key===keyOf(a)){updateApp(a);queue()}});
  setInterval(()=>{if(!document.hidden&&getAccount()&&!busy&&!conflict)syncNow()},45000);
  if(a)queue();
 }
 document.addEventListener('DOMContentLoaded',init);
 return {profile:()=>getAccount()?.profile||null,key:p=>{const a=getAccount();return a?.profile===p?keyOf(a):null},changed,locked:()=>!!getAccount(),syncNow,merge3,login,logout};
})();
