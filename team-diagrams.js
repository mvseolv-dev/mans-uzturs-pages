/* Profesionālas basketbola puslaukuma shēmas. O = uzbrucējs, X = aizsargs. */
function tmScene(kind){
 const extra={
 pnrbare:{o:[[274,210,"1"],[218,152,"2"]],run:["M270 200 Q241 163 213 147","M214 147 L191 83"],pass:["M241 173 L193 85"]},
 pnrgame:{o:[[274,210,"1"],[218,152,"2"]],x:[[248,175,"1"],[194,113,"2"]],run:["M268 198 Q236 165 209 142","M214 141 L190 86"],pass:["M239 170 L194 89"],def:["M195 113 L187 93"]},
 handoffbare:{o:[[92,185,"1"],[259,181,"2"]],run:["M97 175 Q164 152 228 169"],pass:["M118 174 L231 172"]},
 fourout:{o:[[185,219,"1"],[77,166,"2"],[283,163,"3"],[79,81,"4"]],pass:["M175 210 L93 173"],run:["M284 151 L260 113"]},
 threeout:{o:[[185,218,"1"],[76,151,"2"],[281,150,"3"]],run:["M185 207 L184 174"],pass:["M172 210 L91 154"]},
 givego:{o:[[264,197,"1"],[85,180,"2"]],pass:["M252 191 L100 184","M100 174 Q164 105 188 79"],run:["M256 181 Q244 116 194 81"]},
 fourvthree:{o:[[82,220,"1"],[184,227,"2"],[283,220,"3"],[83,131,"4"]],x:[[144,147,"1"],[230,143,"2"],[184,104,"3"]],run:["M81 208 Q115 141 150 87","M279 207 Q241 139 222 91"],pass:["M105 214 L177 215"]}
 };
 const t={
 warm:{o:[[82,206,"1"],[174,222,"2"],[281,206,"3"]],run:["M82 196 Q88 140 120 111","M174 211 Q202 161 241 112","M279 195 Q267 145 246 118"]},
 agility:{o:[[90,222,"1"]],cones:[[90,193],[150,170],[209,141],[267,113]],run:["M90 211 L90 193 L150 170 L209 141 L267 113"]},
 dribble:{o:[[184,205,"1"]],run:["M184 194 Q164 168 184 142 Q205 116 184 91"]},
 triangle:{o:[[92,178,"1"],[270,178,"2"],[184,94,"3"]],pass:["M106 176 L251 176","M258 168 L195 107","M177 109 L103 166"],run:["M89 162 Q115 109 174 102"]},
 spot:{o:[[85,189,"1"],[274,185,"2"],[184,213,"3"]],shot:["M88 181 Q131 119 181 58","M268 179 Q219 106 187 57","M184 196 L184 58"]},
 mirror:{o:[[125,183,"1"]],x:[[214,180,"1"]],run:["M125 170 L92 145 L152 120","M214 164 L183 141 L241 118"]},
 layup:{o:[[267,184,"1"],[92,184,"2"]],run:["M263 174 Q241 109 190 66","M96 173 Q121 107 178 66"],shot:["M200 77 L185 54"]},
 cones:{o:[[184,224,"1"]],cones:[[155,189],[205,156],[155,122],[205,91]],run:["M182 211 Q127 183 176 155 Q228 136 168 120 Q135 102 193 80"]},
 shootpass:{o:[[277,195,"1"],[91,197,"2"],[190,145,"3"]],pass:["M106 188 L263 188"],shot:["M267 182 Q228 100 186 55"],run:["M190 136 Q191 111 185 83"]},
 pullup:{o:[[255,207,"1"]],cones:[[234,151]],run:["M253 196 Q221 163 214 132"],shot:["M211 129 Q195 91 185 55"]},
 relocate:{o:[[98,191,"1"],[184,220,"2"]],run:["M98 182 Q68 127 77 83"],pass:["M182 209 Q127 126 84 88"],shot:["M81 81 L180 55"]},
 curl:{o:[[90,201,"1"],[269,204,"2"]],run:["M89 187 Q126 123 171 129"],pass:["M253 199 Q219 154 177 137"],shot:["M174 128 L184 57"]},
 closeout:{o:[[255,171,"1"]],x:[[184,99,"1"]],run:["M188 107 Q224 127 240 157"],shot:["M248 161 L188 56"]},
 drivekick:{o:[[186,214,"1"],[70,108,"2"],[267,177,"3"]],run:["M184 201 L183 130"],pass:["M181 128 Q115 93 79 103"],shot:["M76 100 L183 56"]},
 freethrow:{o:[[185,145,"1"]],shot:["M185 133 L185 56"]},
 drive:{o:[[270,210,"1"]],x:[[230,152,"1"]],run:["M265 197 Q208 171 224 130 Q205 97 190 73"]},
 finish:{o:[[269,166,"1"]],x:[[198,106,"1"]],run:["M264 153 Q229 126 205 81"],shot:["M201 78 L185 55"]},
 pairs:{o:[[87,192,"1"],[276,190,"2"]],pass:["M103 188 L260 188"]},
 twovone:{o:[[95,204,"1"],[272,204,"2"]],x:[[185,120,"1"]],run:["M101 190 Q125 124 163 73"],pass:["M115 197 Q190 165 260 194"]},
 diamond:{o:[[94,210,"1"],[272,212,"2"],[184,110,"3"],[184,214,"4"]],pass:["M106 202 L173 119","M196 119 L258 200"],run:["M182 196 L184 125"]},
 outlet:{o:[[178,87,"1"],[283,206,"2"]],pass:["M193 92 Q253 133 277 188"],run:["M282 194 L290 135"]},
 cut:{o:[[95,200,"1"],[270,195,"2"],[185,124,"3"]],pass:["M110 194 L256 194"],run:["M268 179 Q235 122 186 77"],pass2:["M107 193 L169 90"]},
 defslide:{x:[[95,204,"1"]],cones:[[96,185],[177,167],[259,149]],def:["M96 194 L177 158 L259 140"]},
 onevone:{o:[[275,199,"1"]],x:[[240,144,"1"]],run:["M270 187 Q218 127 189 75"],def:["M241 133 Q210 108 200 83"]},
 twovtwo:{o:[[273,201,"1"],[92,165,"2"]],x:[[243,157,"1"],[118,130,"2"]],run:["M270 187 L238 127"],pass:["M256 194 Q158 175 104 164"],def:["M120 119 L99 152"]},
 threevthree:{o:[[185,222,"1"],[75,152,"2"],[285,157,"3"]],x:[[185,179,"1"],[105,130,"2"],[263,131,"3"]],run:["M186 210 L207 145"],pass:["M172 213 L91 159"],def:["M259 125 L245 112"]},
 fourvfour:{o:[[184,216,"1"],[80,148,"2"],[282,148,"3"],[86,70,"4"]],x:[[183,177,"1"],[116,137,"2"],[243,137,"3"],[106,80,"4"]],pass:["M169 209 L95 155"],run:["M276 139 L251 99"]},
 fivevfive:{o:[[185,229,"1"],[72,165,"2"],[286,164,"3"],[79,78,"4"],[279,77,"5"]],x:[[185,185,"1"],[108,151,"2"],[249,148,"3"],[112,90,"4"],[244,90,"5"]],pass:["M171 220 L88 170"],run:["M285 158 Q249 119 228 86"]},
 boxout:{o:[[187,112,"1"]],x:[[188,155,"1"]],run:["M185 100 L185 75"],def:["M185 145 Q151 128 171 116"]},
 rebound:{o:[[185,144,"1"]],shot:["M185 129 L185 55"],run:["M187 130 Q202 103 198 81"]},
 pnr:{o:[[265,208,"1"],[215,147,"2"],[70,107,"3"]],x:[[251,162,"1"],[196,111,"2"]],run:["M264 196 Q229 164 203 138","M212 138 L186 82"],pass:["M232 176 L188 88"],screen:[[215,147]]},
 handoff:{o:[[92,185,"1"],[257,180,"2"]],x:[[201,137,"1"],[126,145,"2"]],run:["M93 176 Q165 150 232 165"],pass:["M119 171 L229 171"]},
 weave:{o:[[88,224,"1"],[185,224,"2"],[285,224,"3"]],pass:["M98 217 L176 217","M192 211 L271 205"],run:["M89 212 Q153 154 184 119","M281 212 Q221 150 182 110"]},
 threevtwo:{o:[[85,216,"1"],[186,223,"2"],[274,217,"3"]],x:[[143,133,"1"],[231,130,"2"]],run:["M84 206 Q95 139 150 93","M273 203 Q252 127 211 85"],pass:["M105 211 L176 210"]},
 sprint:{o:[[186,222,"1"]],cones:[[185,180],[185,121],[185,81]],run:["M185 209 L185 94"]}
 };
 return extra[kind]||t[kind]||t.spot;
}
function tmCourt(diagram,small=false,guide=null){
 const sc=guide?.drill?tmRoleScene(guide.drill):tmScene(diagram),step=guide?.step??-1,safePath=str=>String(str).replace(/"/g,"&quot;");
 const drawPaths=(lines,type,marker)=> (lines||[]).map(path=>'<path d="'+safePath(path)+'" fill="none" class="tm-route tm-'+type+'"'+(marker?' marker-end="url(#tm-'+type+'-arrow)"':'')+'/>').join('');
 const players=(arr,type)=>(arr||[]).map(([x,y,n])=>'<g class="tm-person tm-'+type+'"><circle cx="'+x+'" cy="'+y+'" r="'+(small?12:14)+'"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle">'+(type==='defense'?'X':'')+n+'</text></g>').join('');
 const cones=(sc.cones||[]).map(([x,y])=>'<path d="M'+x+' '+(y-7)+' l7 13 h-14z" fill="#ffc884" stroke="#322d1c" stroke-width="1.2"/>').join('');
 const rings=(sc.screens||[]).map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="21" fill="none" stroke="#ffc884" stroke-dasharray="5 3" stroke-width="2"/>').join('');
 return '<svg class="tm-court-svg '+(small?'tm-court-mini':'')+'" viewBox="0 0 370 289" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Puslaukuma shēma: zaļie O ir uzbrucēji, oranžie X ir aizsargi; līnijas rāda kustību un piespēles">'+
 '<defs><marker id="tm-run-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="#c7fa39" stroke-width="1.2"/></marker>'+
 '<marker id="tm-pass-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="#f7f5e7" stroke-width="1.2"/></marker>'+
 '<marker id="tm-def-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="#ff9b7e" stroke-width="1.2"/></marker></defs>'+
 '<rect x="23" y="12" width="324" height="268" rx="12" fill="#172720" stroke="#43594a" stroke-width="2"/>'+
 '<g stroke="#53705e" stroke-width="1.5" fill="none"><path d="M42 17V76 M328 17V76 M42 76 A143 143 0 0 0 328 76"/>'+
 '<rect x="139" y="16" width="92" height="113"/><path d="M139 129 A46 46 0 0 0 231 129 M23 268 H347"/>'+
 '<path d="M139 57 H231" stroke="#6e8d73"/><circle cx="185" cy="63" r="10" stroke="#a2c8a0"/><path d="M167 42H203" stroke="#e5f0db" stroke-width="3"/></g>'+
 (step===0?'':step===1?(drawPaths((sc.run||[]).length?sc.run:sc.pass,'run',true)+drawPaths(sc.def,'def',true)):drawPaths(sc.run,'run',true)+drawPaths(sc.pass,'pass',true)+drawPaths(sc.def,'def',true)+drawPaths(sc.shot,'shot',false)+drawPaths(sc.pass2,'pass',true))+cones+rings+
 players(sc.o,'offense')+players(sc.x,'defense')+'<text x="32" y="273" fill="#8cae8f" font-size="10" font-weight="700">PUSLAUKUMS</text></svg>';
}
function tmLegend(){
 return '<div class="tm-legend"><span><b class="tm-dot offense">O</b> Uzbrucējs</span><span><b class="tm-dot defense">X</b> Aizsargs</span><span><i class="tm-route-key"></i> Kustība</span><span><i class="tm-pass-key"></i> Piespēle</span></div>';
}
