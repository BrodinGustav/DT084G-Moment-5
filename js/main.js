// Denna fil ska innehålla din lösning till uppgiften (moment 5).

"use strict";

/*  Delar till ej obligatorisk funktionalitet, som kan ge poäng för högre betyg
*   Radera rader för funktioner du vill visa på webbsidan. */
document.getElementById("player").style.display = "none";      // Radera denna rad för att visa musikspelare
document.getElementById("shownumrows").style.display = "none"; // Radera denna rad för att visa antal träffar


/* Här under börjar du skriva din JavaScript-kod */

window.onload = init; //Applikation kör igång

//Global array-variabel
const clickableChannels = [132, 163, 164, 213, 223, 205, 210, 212, 220, 200]; //Array som lagras Kanal-id för respektive radiokanal

function init() { //Laddar in radiokanalerna
    loadRadioPrograms();
}

//Hämtar data från webbtjänsten
function loadRadioPrograms(channelId) {
    const url = "https://api.sr.se/api/v2/channels?format=json&size=10"; //Hämtar 10 st radiopragram genom size från SR Radios API. Önskar Json-format.

    //Anropar webbtjänsten
    fetch(url)
        .then(response => response.json()) //Konverterar json-svaret till javascript-objekt
        .then(data => {
            displayRadioPrograms(data.channels, channelId); //Sparar svaret från API i variabeln data och skickar med till funktionen displayRadioPrograms
        })
        .catch(error => console.log(error));
}

//Tar emot och skriver ut radiokanaler
function displayRadioPrograms(channels) {
    const mainnavlistEl = document.getElementById("mainnavlist"); //Hämtar HTML-elementet för utskrift

    //loopa igenom och skriv ut till DOM
    channels.forEach(channel => { //channel representerar varje radiokanal vid loopen av channels


        //Utskriftformat
        let newListEl = document.createElement("li");//Skapar nytt <li>-element
        let newText = document.createTextNode(channel.name); //namnet på varje radiokanal hämtas som sträng. Strängen används vid skapandet av ny textnode som läggs till i <li> som läggs till i DOM.
        newListEl.appendChild(newText); //Slår ihop <li>"Radiokanal"</li>


        // Title-attributet för att visa mer information om kanalen vid hover
        newListEl.setAttribute("title", `Kanal: ${channel.name}\nBeskrivning: ${channel.tagline}`); //"title" = title-attributet, tagline = beskrivning av kanalen, name = namnet på kanalen


        //Händelsehanterare för tablå
        newListEl.addEventListener("click", function () { //Funktion för att läsa in tablåer
            loadProgramTablet(channel.id);
        });

        //Slår ihop utskrift-elementet med det nya list-elementet. Skrivs ut till DOM
        mainnavlistEl.appendChild(newListEl);

    });
}

// Läser in tablå för radiokanal
function loadProgramTablet(channelid) {
    if (clickableChannels.includes(channelid)) { //Kontrollerar ifall array med kanal-id överensstämmer med parametern channelid
        const url = `https://api.sr.se/api/v2/scheduledepisodes?channelid=${channelid}&format=json&size=150`;  //lagrar URL för API i variabel. Kopplar URL till variablen url för registrering av vilken radiokanal som klickas.

        // Tömmer utskrift för tablå vid klick av radiokanal så aktuell tablå kan visas
        const infoEl = document.getElementById("info");
        infoEl.innerHTML = "";

        fetch(url)
            .then(response => response.json()) // Konvertera JSON-svaret till ett JavaScript-objekt
            .then(data => {
                showRadioTablet(data.schedule);
            })
            .catch(error => {
                console.error('Fel:', error);
            });
    }

}

function showRadioTablet(schedule) {
    const infoEl = document.getElementById("info"); //Utskriftfält hämtat från HTML
    const nowInMs = Date.now();
    if (Array.isArray(schedule)) { //Kontroll ifall datan innehåller array

        // Loopa igenom varje program i tablån
        schedule.forEach(program => {
            const startInMs = convertJSONDateToJSDate(program.starttimeutc).getTime();
            const endInMs = convertJSONDateToJSDate(program.endtimeutc).getTime();

            //Kontrollerar ifall starttid eller sluttid för aktuellt program är senare än nuvarande tid
            if (startInMs > nowInMs
                || endInMs > nowInMs) {
                let newArticleEl = createInfo(program);
                //Skriv ut till DOM
                infoEl.appendChild(newArticleEl);
            }

        });

    } else {
        infoEl.innerHTML = "<p>Ingen tablå att visa</p>";
    }

//Tar emot och skriver ut tablå
function createInfo(program) {
    //Utskriftsform <article><h3><h4><h5><p></p></h5></h4></h3></article>
    let newArticleEl = document.createElement("article");

    //Överskrift Titel på programmet
    let newHeadingEl = document.createElement("h3");
    let newHeadingText = document.createTextNode(program.title); //Hämtar från API
    newHeadingEl.appendChild(newHeadingText);

    //Överskrift Undertitel
    let newSecondHeadingEl = document.createElement("h4");
    //Ifsats konstrollerar ifall subtitle finns, om ja så skapas textnode och slås ihop med <h4>-elementet.
    if (program.subtitle) {
        let newSecondHeadingText = document.createTextNode(program.subtitle);//Hämtar från API
        newSecondHeadingEl.appendChild(newSecondHeadingText);
    }

    //Överskrift Start- och sluttid för programmet
    let newThirdHeadingEl = document.createElement("h5");
    if (program.starttimeutc && program.endtimeutc) { //Kontroll ifall värdena är giltiga
        const timeString = convertTime(program.starttimeutc, program.endtimeutc); //Anropar funktion convertTime med parametrarna som argument.
        let newTimeText = document.createTextNode(timeString); //Skapar en variabel som innehåller (timeString)
        newThirdHeadingEl.appendChild(newTimeText); //Lägger till textnoden från newTimeText till <h5>-elementet.
    }

    //Text beskrivning
    let newTextNode = document.createElement("p");
    let newTextNodeText = document.createTextNode(program.description);//Hämtar från API
    newTextNode.appendChild(newTextNodeText);

    //Slå ihop
    newArticleEl.appendChild(newHeadingEl);
    newArticleEl.appendChild(newSecondHeadingEl);
    newArticleEl.appendChild(newThirdHeadingEl);
    newArticleEl.appendChild(newTextNode);
    return newArticleEl;
}

}

/*Tiderna från API är i JSON-format (/Date(1698620400000). Med substr(6) tar jag bort allt från index 0 - 5.
På så vis kan jag använda siffrorna från JSON-formatet och formatera de till JS för att kunna använda .parse.*/
function convertJSONDateToJSDate(jsonDate) {
    return new Date(parseInt(jsonDate.substring(6)));
}

// Funktion för att konvertera tid från JSON-format till läsbart format
function convertTime(startTimeString, endTimeString) {
    const startTime = convertJSONDateToJSDate(startTimeString);
    const endTime = convertJSONDateToJSDate(endTimeString);

    //Konvertera till date.objekt
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    //Hämtar min&timmar från värdet i startDate, omvandlar till sträng och använder padstart för att fylla med nollor till vänster
    const startTimeMinutes = startDate.getMinutes().toString().padStart(2, "0");
    const startTimeHours = startDate.getHours().toString().padStart(2, "0");
    const endTimeHours = endDate.getHours().toString().padStart(2, "0");
    const endTimeMinutes = endDate.getMinutes().toString().padStart(2, "0");

    //Sätter ihop timmar och minuter för starttid, samt lika för sluttid
    const startTimeConverted = `${startTimeHours}:${startTimeMinutes}`;
    const endTimeConverted = `${endTimeHours}:${endTimeMinutes}`;

    return `${startTimeConverted} - ${endTimeConverted}`;

}
