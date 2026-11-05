# Codex uzdevums: profesionāla basketbola vingrinājumu bibliotēka

## Lētākais praktiskais Codex režīms
Izvēlies **GPT-6 Luna** ar **Light / zemāko pieejamo domāšanas līmeni**.
Palaid vienu fokusētu uzdevumu, nevis daudz paralēlu aģentu. Nelieto Ultra.
Ja izmanto CLI: `codex -m gpt-6-luna`.
Ja izmanto Codex lietotni, izvēlies GPT-6 Luna modelī un zemāko pieejamo effort.

## Repozitorijs un darba robežas
- Repo: `mvseolv-dev/mans-uzturs-pages`
- Pamatzars: `main`
- Darba zars: `codex-drill-guide-v5`
- Maini tikai basketbola treniņu bibliotēku, shēmas, testus un precizējumu dokumentāciju.
- Nepārraksti uztura sadaļu, treniņu plānu saglabāšanu, profilus vai navigāciju.
- Saglabā lokālos datus, favorītus, treniņu ģeneratoru un PWA atjaunināšanas mehānismu.

## Galvenais mērķis
170 basketbola vingrinājumi ar saprotamu spēlētāju izvietojumu un secīgām norādēm.
Katram vingrinājumam atsevišķi norādi:
1. Inventāru, konusu skaitu un novietojumu, ja tie zināmi.
2. Spēlētāju un aizsargu skaitu un sākuma vietas.
3. Bumbas turētāju sākumā.
4. Vienu darbību katrā secīgajā kadrā, parādot sākuma un beigu pozīciju.
5. Īsu, konkrētu skaidrojumu zem katra kadra.
6. Lomu maiņu un atkārtojumu mērķi, tikai kad tas ir norādīts.
7. Trenera norādi par kļūdām un tehniku.

## Stingri precizitātes ierobežojumi
- Nekad neizdomā konusus, aizsargus, spēlētāju lomas vai maršrutus, kas nav avota vingrinājumā.
- Ja avots saka "3 pret 3", parādi trīs uzbrucējus un trīs aizsargus.
- Ja avots saka "spēles situācija", nerādi vienu kustību kā obligātu izspēli.
- Nenovirzi metiena punkta "loka augša" atrašanās vietu ārpus faktiskā trīspunktu loka.
- Atšķir sprints, dribls, piespēle, metiens, aizsegs un aizsardzība.
- Neapgalvo "apstiprināts" bez trenera vai skaidra video pierādījuma.
- Ja apraksts nepasaka precīzas distances, rādi "PARAUGA SHĒMA".
- Izvairies no vienādu kategorijas attēlu atkārtošanas atšķirīgiem uzdevumiem.
- Katrā kļūdā izlabo avota modeļa konkrēto drillu, nevis universāli mākslīgi deformē visus.
- Visi 170 vingrinājumi jāizvērtē INDIVIDUĀLI. Automātiska ģenerēšana ir tikai sākums.

## Svarīga, lietotāja precizēta secība
Drills `s54321` ir četru konusu variācija:
- 0 pie soda metiena līnijas.
- 1 pie trīspunktu loka augšas.
- 3 kreisajā stūrī, 2 labajā stūrī.
- Starts no soda līnijas kreisā sāna ar lay-up, NEVIS pie 0 konusa.
- Apkārt 0, lay-up no otras puses.
- No 3 kreisā stūra metiens.
- No 3 uz 2 skrien gar gala līniju zem groza, NEVIS gar trīspunktu līniju.
- Metiens no 2, pēc tam no 1.
Šī variācija balstīta lietotāja precizējumos. Nepārraksti to uz sešu konusu versiju no citām lapām.

## Pašreizējais koda stāvoklis
- `team-visuals-v4.js`: iepriekšējais shēmu avots ar 170 vingrinājumiem.
- `team-visuals-v5.js`: jauns, vizuāli skaidrāks renderētājs, piemēriem ir precizitātes statuss.
- `team-visuals-v5.css`: vizuālā sistēma.
- `tests/coachboard-v5.test.cjs`: automātiskās validācijas.
- `index.html` un `sw.js`: jaunie faili pieslēgti izstrādes zarā.

Pirmajā auditā ir 1 lietotāja precizēta kustību secība, 134 shēmiski piemēri un 35 atvērtas spēles situācijas. Tās NAV 170 trenera apstiprinātas kustības. Tālākā darba mērķis ir pakāpeniski palielināt precīzi izstrādāto vingrinājumu skaitu.

## Testu protokols
Pēc katras 10-20 individuālo drillu korekciju grupas:
1. `node --test tests/coachboard-v5.test.cjs`
2. Pārbaudi mobilo skatu, sākuma un beigu punktu, bumbas turētāju.
3. Vismaz 1 kadrs no katras tēmas: metieni, dribls, piespēles, finiši, aizsardzība, atlēkušās bumbas, aizsegi, ātrie uzbrukumi, fiziskā sagatavotība.
4. Pārliecinies, ka diagrammā visi spēlētāji ir redzami un to skaits sakrīt ar aprakstu.
5. Pārbaudi pilno maršrutu, ne tikai pirmo un pēdējo soli.
6. Mainītā faila pilno kodu saglabā kā versētu atsevišķu commitu.
7. Neapvieno ar `main`, kamēr konkrētās shēmas nav vizuāli pārbaudītas.

## Lēta izstrādes secība
- Vispirms `s54321` un kritiskie kļūdu piemēri `s12`, `q036`, `q057`, `p03`, `a07`.
- Tad 71 metienu drills, sadalot 10-20 vingrinājumu grupās.
- Tad dribls un finiši.
- Tad piespēles, aizsegi un atlēkušās.
- Tad aizsardzība, pārejas uzbrukumi, 3x3/5x5 un fiziskā sagatavotība.
- Neizsauc AI attēlu ģeneratoru katram kadram: precīzi aprakstītas SVG koordinātas ir lētāk pārbaudāmas.
- Tikai tad, kad specifikācijas ir korektas, veic vizuālo spodrināšanu.

## Gatavības kritērijs
Neviena vizuāla pārbaude nedrīkst būt aizstāta ar "SVG ģenerējas". Autorizēts zara apvienojums tikai pēc pārskatīta treniņu katalogu audita un komandas/lietotāja vizuālās apstiprināšanas.
