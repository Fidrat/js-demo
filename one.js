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
const familyIdGenerator = idMaker(); // ! adding a new id generator to ensure we have separate id chains

// Orcish family manager
function OrcFamily(){
    const id = familyIdGenerator.next().value;
    const name = setOrcName();

    this.getId = () => id; // getter for "private id"
    this.getName = () => name; // getter for "private name"
}

// Orc obj constructor
function Orc(lastName){
    const id = idGenerator.next().value;

    this.firstName = setOrcName();
    this.lastName = lastName ? lastName : setOrcName();

    this.getFullName = () => this.firstName + ' ' + this.lastName;
    this.getId = () => id; // getter for "private id"

    var speechGenerator = orcSpeech(this);

    // Finite generator exemple
    function* orcSpeech(orc){
        yield "Ur house will burn in the name of the " + orc.lastName + " clan.";
        yield "Hungry! Lunch yet?";
        yield orc.firstName + " will chew ur eyes!";
    }

    // Make an orc talk
    this.talk = (target, next = speechGenerator.next()) =>{
        console.log(next);

        if(!next.done){
            target.innerHTML = this.getFullName() + " say:<br>- ";
            let text = next.value;
            let timer = 0;

            //! We can use for ... of loop on a string since it is an iterable object in js
            for(let char of text){
                setTimeout( () => {
                   target.innerHTML += char;
                }, 50*(timer++) );
            }

            setTimeout( () => {
                this.talk(target, speechGenerator.next());
            }, 3000 );
        }else{
            target.innerHTML = '';
            speechGenerator = orcSpeech(this); // Reinstantiate generator so we can have the same orc talk again
        }
    };
};


// MAIN
function main(){
    // ! Creating a map filled with the orcish families
    var orcVillage = new Map();
    var orcArmy = [];

    for(let i = 0; i < orcishFamilyNumber; i++ ){
        let orcFamily = new OrcFamily();
        orcVillage.set( orcFamily.getId(), orcFamily);
    }

    // ! using Map.size property as we would use array.length
    content += '<p>The orc village consist of ' + orcVillage.size + ' orcish families</p>';

    // ! we can use forEach loops on maps
    orcVillage.forEach(function(value, key) {
        content += 'Orcish family #' + key + ' generated -> ' + value.getName() + '<br>';
    });

    content += '<hr><p> List of Orcish individuals : </p>';

    for(let i=0; i < armySize; i++){
        let orc = orcArmy[i] = new Orc(orcVillage.get( getRandomInt( orcVillage.size ) ).getName() );
        content += '#' + orc.getId() + ': ' + orc.getFullName() + '<br>';
    }

    // Write content to the browser
    document.getElementById('content').innerHTML = content;

     /************** events ***************/
    var btn = document.getElementById('dynamicContent2-trigger');
    btn.addEventListener('click', function() {
        orcArmy[getRandomInt(orcArmy.length,1)].talk(document.getElementById('dynamicContent2') ) ;
    });

}
// END OF MAIN

// Equivalent to jQuery $(document).ready() in vanilla js
document.addEventListener("DOMContentLoaded", function() {
     main();
});







/************** utils ***************/
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
