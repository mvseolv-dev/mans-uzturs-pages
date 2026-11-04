/* Saprotamas baskebola terminu definīcijas, treniņu lomas un izpildes soļi. */
const TEAM_GLOSSARY=[["Closeout","Iziešana pie metēja","Aizsargs tuvojas spēlētājam ar bumbu, beigās piebremzē, paceļ roku un neļauj brīvi mest."],["Pick and roll / PNR","Aizsegs un nogriešanās pie groza","Viens spēlētājs nostājas aizsarga ceļā; driblētājs izmanto aizsegu, aizsega licējs pēc tam skrien pie groza."],["Pick and pop","Aizsegs un iziešana uz metienu","Pēc aizsega spēlētājs neiet pie groza, bet atkāpjas uz brīvu vietu metienam."],["Spain PNR","Trīs uzbrucēju aizsegu sadarbība","Viens uzliek aizsegu driblētājam, trešais uzliek papildu aizsegu aizsargam pie groza."],["Catch and shoot","Metiens uzreiz pēc piespēles","Saņem bumbu, nostabilizē pēdas un met bez dribla."],["Pull-up","Metiens pēc dribla","Driblē, apstājies uz stabilām pēdām un izpildi metienu."],["Spot shooting","Metieni no noteiktām vietām","Izvēlies vairākus punktus laukumā un met noteiktu metienu skaitu katrā."],["Rebound","Atlēkusī bumba","Pēc neprecīza metiena satver bumbu, kas atlēkusi no stīpas vai vairoga."],["Boxout","Pozīcijas ieņemšana pie groza","Pēc metiena ieņem vietu starp pretinieku un grozu, lai savāktu atlēkušo bumbu."],["Outlet","Pirmā piespēle ātrajā uzbrukumā","Pēc atlēkušās bumbas ātri piespēlē partnerim, kurš var iesākt ātro uzbrukumu."],["Drive and kick","Caurgājiens un piespēle ārā","Uzbrucējs ar driblu iet uz grozu, pēc tam piespēlē brīvam metējam perimetrā."],["Extra pass","Papildu piespēle","Bumbu atdod vēl brīvākam spēlētājam, lai iegūtu labāku metienu."],["Handoff","Bumbas nodošana rokās","Divi spēlētāji satuvojas, viens nodod bumbu tieši otra rokās."],["Backdoor","Nogriezšanās aiz aizsarga","Ja aizsargs nosedz piespēles līniju, uzbrucējs skrien viņam aiz muguras pie groza."],["Give and go","Piespēlē un skrien","Pēc piespēles tūlīt skrien pie groza, lai saņemtu atpakaļpiespēli."],["Weave","Piespēļu pīne","Trīs spēlētāji kustībā maina vietas, pēc piespēles skrienot aiz tās saņēmēja."],["Floater","Augsts, mīksts metiens","Metiens augstā lokā no neliela attāluma pāri aizsarga rokām."],["Eurostep","Divu soļu virziena maiņa","Dodoties uz grozu, pirmais solis vienā virzienā, otrais citā. Nepieļauj soļu kļūdu."],["Crossover","Bumbas maiņa priekšā","Ar vienu dribla kustību maini bumbu no vienas rokas uz otru ķermeņa priekšā."],["Retreat dribble","Atkāpšanās ar driblu","Ar bumbu atkāpies, lai iegūtu telpu jaunam uzbrukumam."],["Transition","Pārejas uzbrukums","Pēc bumbas iegūšanas ātri izmanto brīvo telpu uzbrukumā."],["Shell drill","Komandas aizsardzības izvietojums","Aizsargi kopā trenē palīdzību, pārbīdi un atgriešanos pie saviem spēlētājiem."],["Switch","Aizsargu maiņa","Pēc aizsega aizsargi samainās ar sedzamajiem spēlētājiem."],["Drop","Aizsargs paliek tuvāk grozam","Aizsardzības variants pret aizsegu, kur garais spēlētājs atkāpjas un sargā groza tuvumu."],["Clear 3x3","Bumbas izvešana aiz trīspunktu līnijas","3x3 spēlē pēc aizsardzības bumbas iegūšanas bumba jāizved aiz loka, lai varētu uzbrukt."],["Jab step","Īss māņu solis","Ar brīvo pēdu parādi uzbrukumu, atbalsta kāju nepārvietojot."],["Pivot","Pagrieziens uz atbalsta kājas","Pēda paliek uz grīdas, kamēr ar otru kāju sper soli un pagriezies."],["Contest","Metiena traucēšana","Aizsargs pietuvojas un paceļ roku, neizdarot neatļautu kontaktu."]];
const TEAM_SAY={"catch and shoot":"metiens uzreiz pēc piespēles","pick and roll":"aizsegs un nogriešanās pie groza","pick and pop":"aizsegs un metiens pēc atkāpšanās","PNR":"aizsegs un nogriešanās pie groza","closeout":"iziešana pie metēja","boxout":"pozīcijas ieņemšana pie groza","rebound":"atlēkusī bumba","outlet":"pirmā piespēle ātrajam uzbrukumam","drive and kick":"caurgājiens un piespēle ārā","handoff":"bumbas nodošana rokās","backdoor":"nogriezšanās aiz aizsarga","weave":"piespēļu pīne","pull-up":"metiens pēc dribla","floater":"augstais metiens tuvu grozam","eurostep":"divu soļu virziena maiņa","crossover":"bumbas maiņa priekšā","extra pass":"papildu piespēle","give and go":"piespēlē un skrien","retreat dribble":"atkāpšanās ar driblu","drop":"atkāpšanās tuvāk grozam"};
function tmFriendlyTitle(d){
 let title=String(d?.title||"");
 for(const [word,lv] of Object.entries(TEAM_SAY))title=title.replace(new RegExp(word,"gi"),lv);
 return title.charAt(0).toLocaleUpperCase("lv-LV")+title.slice(1);
}
function tmGlossaryTermsFor(d){
 const text=(d.title+" "+d.setup+" "+d.action+" "+d.coach).toLocaleLowerCase("lv-LV");
 return TEAM_GLOSSARY.filter(([word])=>word.split(" / ").some(w=>text.includes(w.toLocaleLowerCase("lv-LV")))).slice(0,5);
}
function tmRoleLabels(d){
 if(d.category==="shoot"){
  if(d.minPlayers===1)return ["O1 - metējs"];
  if(d.shotType==="pressure"){
   if(d.minPlayers===2)return ["O1 - metējs","X1 - aizsargs"];
   return ["O1, O2 - uzbrucēji","X1, X2 - aizsargi"];
  }
  if(d.minPlayers===2)return ["O1 - metējs","O2 - piespēlētājs vai bumbas vācējs"];
  if(d.minPlayers===3)return ["O1 - metējs","O2 - piespēlētājs","O3 - bumbas vācējs"];
  return ["O1, O2 - pirmais pāris","O3, O4 - otrais pāris"];
 }
 if(["onevone"].includes(d.diagram))return ["O1 - uzbrucējs","X1 - aizsargs"];
 if(d.diagram==="twovone")return ["O1 un O2 - uzbrucēji","X1 - aizsargs"];
 if(["twovtwo","pnrgame"].includes(d.diagram))return ["O1 un O2 - uzbrucēji","X1 un X2 - aizsargi"];
 if(d.diagram==="threevthree")return ["O1, O2 un O3 - uzbrucēji","X1, X2 un X3 - aizsargi"];
 if(d.minPlayers===1)return ["O1 - spēlētājs"];
 if(d.minPlayers===2)return ["O1 un O2 - partneri"];
 return ["O1, O2, O3... - dalībnieki","Pēc sērijas mainiet lomas"];
}
function tmStepInfo(d){
 return [
 {label:"1. SOLIS",title:"Kur nostāties?",text:d.setup,extra:tmRoleLabels(d).join(" | ")},
 {label:"2. SOLIS",title:"Kas katram jādara?",text:d.action,extra:"Zaļā līnija - kustība, oranžā - aizsarga pārvietošanās. Shēmā redzams paraugs."},
 {label:"3. SOLIS",title:"Kad beidzas un kam pievērst uzmanību?",text:(d.goal?"Mērķis: "+d.goal+". ":"")+d.coach,extra:"Baltā pārtrauktā līnija - piespēle, gaiši oranžā - metiena virziens. Pēc kārtas mainiet lomas."}
 ];
}
function tmRoleScene(d){
 const original=tmScene(d.diagram);
 const sc={...original,o:(original.o||[]).map(p=>[...p]),x:(original.x||[]).map(p=>[...p])};
 if(d.category==="shoot"){
  const n=d.minPlayers;
  if(["spot","freethrow"].includes(d.diagram)){
   if(d.shotType==="pressure"&&n===2){sc.o=[[265,170,"1"]];sc.x=[[205,128,"1"]]}
   else if(d.diagram==="freethrow"){sc.o=[[185,146,"1"]];if(n>1)sc.o.push([275,205,"2"]);sc.x=[];sc.shot=["M185 135 L185 56"]}
   else{sc.o=n===1?[[185,d.shotType==="three"?220:155,"1"]]:
    n===2?[[100,183,"1"],[275,199,"2"]]:n===3?[[91,187,"1"],[274,194,"2"],[183,130,"3"]]:
    [[85,184,"1"],[275,185,"2"],[102,223,"3"],[265,224,"4"]];
    sc.x=[];sc.shot=n>1?["M98 172 Q150 107 184 56"]:["M185 "+(d.shotType==="three"?207:143)+" L185 56"];
    sc.pass=n===2&&["catch","game"].includes(d.shotType)?["M263 194 L111 183"]:[];
    sc.run=[];
   }
  }else if(d.diagram==="shootpass"){
   sc.o=n===2?[[85,178,"1"],[270,194,"2"]]:[[85,178,"1"],[270,194,"2"],[187,108,"3"]];
   sc.x=[];sc.pass=["M260 186 L103 177"];sc.shot=["M90 166 Q135 90 183 56"];sc.run=n===3?["M185 118 L187 87"]:[];
  }else if(d.diagram==="curl"){
   sc.o=n===2?[[78,111,"1"],[265,199,"2"]]:[[78,111,"1"],[265,199,"2"],[187,98,"3"]];
   sc.x=[];sc.run=["M79 115 Q119 147 147 178"];sc.pass=["M254 193 L155 176"];sc.shot=["M151 161 Q177 105 185 56"];
  }else if(d.diagram==="relocate"){
   sc.o=[[95,174,"1"],[264,201,"2"]];sc.x=[];sc.run=["M97 162 Q62 123 77 85"];sc.pass=["M254 192 Q159 112 87 88"];sc.shot=["M80 81 L183 55"];
  }
 }
 const n=d.minPlayers;
 while(sc.o.length+sc.x.length>n&&sc.o.length>1)sc.o.pop();
 while(sc.o.length+sc.x.length>n&&sc.x.length)sc.x.pop();
 const free=[[83,229],[274,229],[85,114],[284,112],[176,210],[250,166],[118,167],[184,91],[183,242]];
 for(const [x,y] of free){
  if(sc.o.length+sc.x.length>=n)break;
  if([...sc.o,...sc.x].some(p=>Math.abs(p[0]-x)<24&&Math.abs(p[1]-y)<24))continue;
  sc.o.push([x,y,String(sc.o.length+1)]);
 }
 return sc;
}
