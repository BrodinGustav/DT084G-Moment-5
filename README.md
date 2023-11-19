# DT084G-Moment-5
SR API
# Labbgrund till Moment 5 i kursen DT084G, Introduktion till programmering i JavaScript
Använd dessa filer som grund till din laboration.

OBS: Uppdatera texten i denna README-fil så att den beskriver din labb, samt inkludera ditt namn och student-id.

Student: Gustav Brodin
Student-id: gueb0900

Startade applikationen vid fönsterladdning (window.onload) och funktionen loadRadioPrograms startar 
loadRadioPrograms hämtar de första 10 radiokanalerna från SR Radio API i JSON-format (const url ="http://api.sr.se/api/v2/channels?format=json&size=10";)
Funktionen displayRadioPrograms anropas och loopar igenom listan av kanaler, skapar list-element och lägger till de till "mainnavlist" i DOM

Lägger till händelsehanterare med "click" och anrop för funktion loadProgramTable för radiokanalerna som visas i "mainnavlist".
loadProgramTable hämtar radiotablåer från "http://api.sr.se/api/v2/scheduledepisodes/rightnow?format=json&size=10"
Funktionen showRadioTablet anropas och hämtar HTML-elementet "info" för utskrift av tablå
showRadioTablet loopar igenom samtliga kanaler från "mainnalist"
För varje program skapas <article>, <h3>
if-sats kontrollerar ifall program finns för kanal
Om program finns skapas <h4>, <h5> och <p> för varje kanal.
Om program ej finns skrivs "Ingen information är tillgänglig" ut.
Lägger till artikeln till HTML-elementet "info" för utskrift 

Problem uppstår vid testkörning: Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'forEach')
    at showRadioTablet (main.js:70:22)  at main.js:58:27

Ändrat struktur i JS. If sats skapad som kontrollerar ifall channels är fler än 0. Om ja så loopar showRadioTablet igenom kanalerna från "mainnavlist"
och för varje kanal skapas nytt <article>,<h3>,<h4>,<h5> och <p> för utskrift. Till vardera element hämtas relevant fakta från API, ex channels.title för h3.
Nya elementen slås ihop och skrivs ut till DOM.

Inget felmeddelande, men utskriften saknar text. Endast tomma rader syns. 

Slagit ihop tidigare missade element som skrivs ut till dom. Utskrift säger nu undefined på samtliga nya element. Hämtat från fel API kanske? 

Lagt till global variabel, let currentChannelId = null;, som håller koll på vald radiokanal
Ändrat URL för att hämta API för tv-tablåer, `http://api.sr.se/api/v2/scheduledepisodes?channelid=${currentChannelId}&format=json`, kopplat till globala variablen
Anropar webbtjänsten och lagrar konverterade json-värdet i variabeln data som i sin tur används i funktionen showRadioTablet vilken hämtar in information från schedule i API.
Anropar funktionen showRadioTablet vilken loopar igenom programtablåerna via parametern schedule och skriver ut nya element som hämtas ut från program i API 

Lagt in funktion, const infoEl = document.getElementById("info"); infoEl.innerHTML = "";, till loadProgramTablet som visar aktuell tablå för klickad kanal. 
Tidigare tablå rensas nu bort och aktuell tablå visas istället.

Lagt till ifsats till funktion loadProgramTablet som kontrollerar ifall subtitle finns till aktuell tablå. Om inte så skrivs inte längre "undefined" ut.

Skapat funktion som konverterar hämtad tid i JSON-format från API till JS-format.
Skapat funktion som modifierar tider från API till format HH:HH - HH:MM och skriver ut till DOM
Fel API är hämtad då utskrift för tid blir från 00.00 - 05.00

Har ännu en gång ändrat URL för API, nu till `http://api.sr.se/api/v2/scheduledepisodes/rightnow?channelid=${currentChannelId}&format=json`
Hämtar hem data.channel från API och lagrar det i funktion showRadioTablet.
Anropar funktionen med argumentet channel eftersom current & nextscheduledepisodes finns i objektet
Skapat if-sats som kontrollerar ifall channel.currentscheduledepisode returnerar data vid anrop
Lagrar värdena från currentscheduledepisode och nextscheduledepisode i variabel currentProgram, och nextProgram
Skapar if-sats som kontrollerar ifall currentProgram sänder program, om ja så skrivs nya element ut för utskrift till DOM.
Samma if-sats och utskrift till DOM görs sedan för nextscheduledepisode

Lagt till "title"-attribut vid hover av <li>-element för vänsternavigeringen av kanaler. Till title-attributet är kanalnamn & tagline hämtar från API.

Jag har upptäckt att tablån bara visar aktuellt program och nästkommande program. Funktion för att skriva ut samtliga program från aktuell tid fram till midnatt behövs.
Ändrat om fetch så att hela data-objektet skickas till funktionen showRadioTablet.
If-sats gjord som kontrollerar att data innehåller previousscheduledepisode, currentscheduledepisode och nextscheduledepisode, samt lagrat dessa som array i variabel scheduleEpisodes.
Hämtat in aktuella timmar för att senare kunna läsa ut tablån från aktuell timma fram till midnatt.
Skapat for-loop som itererar igenom variabeln scheduleEpisodes från aktuell timma och hela arrayens längd. Lagrar varje program som finns i arrayen i variabeln program.
If-sats med parametern program konverterar starttiden för program från JSON till JS-Dateobjekt.
Sedan körs If-sats som kontrollerar om starttiden för aktuellt program är mer eller lika med aktuell timma, samt mindre än timma 24.
Om ja så lagras information kring radikanalen i variabel programInfo som i sin tur skrivs ut till DOM via utskriftselementet infoEl. 

OBS! Koder för rad 58 - 65 löste inte problematiken med utskrift av tablå från aktuell tid till midnatt. Åter tillbaka till tidigare kod där aktuell tablå, samt nästa program skrivs ut.

Skapat ny funktion, "createInfo", dit skapandet av samtliga element läggs. Gjort för en bättre struktur och mer tydlighet för koden.
Funktion "showRadioTablet" kopplas till utskriftsfält, "info", samt nestlas en if-sats i funktionen som kontrollerar ifall datan "schedule" innehåller en array. 
forEach-loop nestlas in i funktionen som loopar igenom varje program i tablån och kontrollerar klockslag för programmen.    
If-sats skapas som kontrollerar ifall starttiden är senare än aktuell tid och ifall sluttiden för programmet är senare än aktuell tid. Om ja så skrivs element ut till tablån.

Justerat URL, `http://api.sr.se/api/v2/scheduledepisodes?channelid=${currentChannelId}&format=json`, för att hämta API för tv-tablåer. Lagt till size=150 för att hämta in fler program än 10 som gäller för generella parametrar. Nu visas utskrift av tablån. 
