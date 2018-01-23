"use strict";

// constants
const consonant = ['b', 'd', 'f', 'g', 'k', 't', 'p', 'z'];
const vowel = ['a', 'e', 'i', 'o', 'u', 'y'];
const orcishFamilyNumber = 3;
const armySize = 10;

var content = '';

// Return an auto incremented id
function* idMaker() {
    var index = 0;
    while(true)
        yield index++;
}

const idGenerator = idMaker();
const familyIdGenerator = idMaker();

// Orcish family manager
function OrcFamily(){
    const id = familyIdGenerator.next().value;
    const name = setOrcName();

    this.getId = () => id; // getter for "private id"
    this.getName = () => name; // getter for "private name"
}; // end of OrcFamily

/**
* Orc obj constructor
* @param orcFamily object optionnal. Orc will be orphan if orcFamily is ommited.
*/
function Orc(orcFamily = null){
    // Utils
    const id = idGenerator.next().value;
    var speechGenerator = orcSpeech(this);
    // Properties
    var talking = false;
    var firstName = setOrcName();
    var family = orcFamily;

    // Getters
    this.getFirstName = () => firstName;
    this.getFamily = () => orcFamily;
    this.getLastName = () => orcFamily ? this.getFamily().getName() : '';
    this.isTalking = () => talking;
    this.getFullName = () => this.getFirstName() + ' ' + this.getLastName();
    this.getId = () => id;

    // Finite generator exemple
    function* orcSpeech(orc){
        if(orc.getFamily()){ // we skip the first sentence if the Orc is an orphan
            yield "Ur house will burn in the name of the " + orc.getLastName() + " clan.";
        }else{
            yield orc.getFirstName() + " don't need a family.";
        }
        yield "Hungry! Lunch yet?";
        yield orc.getFirstName() + " will chew ur eyes!";
    };

    // Make an orc talk
    this.talk = (target, next = speechGenerator.next()) => {
        talking = true;

        if(!next.done){
            target.innerHTML = "";
            let text = next.value;
            let timer = 0;

            for(let char of text){
                setTimeout( () => { target.innerHTML += char; }, 50*(timer++) );
            }
            setTimeout( () => { this.talk(target, speechGenerator.next()); }, 3000 );

        }else{ // Talkin's done
            talking = false; // ! Orc is ready to talk again
            target.remove(); // ! Equivalent of jQuery .remove()
            speechGenerator = orcSpeech(this); // Reinstantiate generator so we can have the same orc talk again
        }
    };
}; // end of Orc


/********************* MAIN ********************/
function main(){
    var orcVillage = new Map(); // a map of the Orcish individuals
    var orcArmy = new Map(); // a map of Orcish families

    for(let i = 0; i < orcishFamilyNumber; i++ ){
        let orcFamily = new OrcFamily();
        orcVillage.set( orcFamily.getId(), orcFamily);
    }

    content += '<p>The Orc village consist of ' + orcVillage.size + ' orcish families</p>';

    orcVillage.forEach(function(value, key) {
        content += 'Orcish family #' + key + ' generated -> ' + value.getName() + '<br>';
    });

    content += '<hr><p> List of clickable orcish individuals : </p>';

    // Generate Orcs and associate them a random family
    for(let i=0; i < armySize; i++){
        let orc = new Orc(orcVillage.get( getRandomInt( orcVillage.size ) ) );
        orcArmy.set(orc.getId(), orc);
        content += '<a class="orc" data-id="' + orc.getId() + '"><u>#' + orc.getId() + ': ' + orc.getFullName() + '</u></a><br>';
    }

    // Adding an Orc orphan to the orcArmy array
    let orc = new Orc();
    orcArmy.set(orc.getId(), orc);
    content += '<a class="orc" data-id="' + orc.getId() + '"><u>#' + orc.getId() + ': ' + orc.getFullName() + '</u></a><br>';

    // Write content to the browser
    document.getElementById('content').innerHTML = content;

    // ! equivalent to jQuery class (.) selector
    var elems = document.getElementsByClassName('orc');
    for(let elem of elems){ // ! kind of jQuery .each()
        // ! Avoiding jQuery css()
        elem.style.cssText = "color: blue"; // ! Will overwrite the inline style attribute
        elem.style.cursor = "pointer"; // ! Will write in inline style attribute, overwriting "cursor" only
    }

     /************** events ***************/
    for(let elem of elems){
        elem.addEventListener('click', function() { // ! avoiding jQuery .on()
            let orc = orcArmy.get( parseInt( elem.getAttribute('data-id') ) );

            if( orc.isTalking() ){ // ! Ensuring an orc can only talk when he's not already talking
                return;
            }
            // ! create a <p> on the fly after the clicked element
            let target = elem.parentNode.insertBefore(document.createElement('p'), elem.nextSibling);
            orc.talk( target ) ;
        });
    }

}; /***************** END OF MAIN ********************/

// Equivalent to jQuery $(document).ready() in vanilla js
document.addEventListener("DOMContentLoaded", function() {
     main();
});







/************** utils ***************/
// return a random int from min (included) to max (exluded)
function getRandomInt(max, min=0){
    return Math.floor(Math.random() * (max - min)) + min;
};

function getConsonantVowelPair(){
    return consonant[ getRandomInt(consonant.length) ] + vowel[ getRandomInt(vowel.length) ];
};

// Return a random name
var setOrcName = (m = getRandomInt(5,2)) => {
    let name = '';
    for(let i=0; i < m; i++){
        name += getConsonantVowelPair();
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
};
