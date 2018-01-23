"use strict";

// constants
const consonant = ['b', 'd', 'f', 'g', 'k', 't', 'p', 'z'];
const vowel = ['a', 'e', 'i', 'o', 'u', 'y'];
const armySize = 10;

var content = '';

// Return an auto incremented id
function* idMaker() {
    var index = 0;
    while(true)
        yield index++;
}

const idGenerator = idMaker();

// Orc obj constructor
function Orc(lastName){
    // ! Here we are using the arrow syntax to avoid holding the value of this as a property.
    //var me = this;

    const id = idGenerator.next().value;

    this.firstName = setOrcName();
    this.lastName = lastName ? lastName : setOrcName();

    this.getFullName = () => this.firstName + ' ' + this.lastName;
    this.getId = () => id; // getter for "private id"

    var speechGenerator = orcSpeech(this);

    // ! Finite generator exemple we added an orc object parameter since we can't use the arrow annotation with generators
    function* orcSpeech(orc){
        yield "Ur house will burn in the name of the " + orc.lastName + " clan.";
        yield "Hungry! Lunch yet?";
        yield orc.firstName + " will chew ur eyes!";
    }

    // ! With the arrow syntax, the this is not redefined and is still set to the parent Orc object
    this.talk = (target, next = speechGenerator.next()) =>{
        console.log(next);

        if(!next.done){
            target.innerHTML = this.getFullName() + " say:<br>- ";
            let text = next.value;
            let timer = 0;

            //! We can use for ... of loop on a string since it is an iterable object in js
            for(let char of text){
                setTimeout( function(){
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


// Return a random name
var setOrcName = (m = getRandomInt(5,2)) => {
    let name = '';
    for(let i=0; i < m; i++){
        name += getConsonantVowelPair();
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
};


// MAIN
function main(){
    var orcArmy = [];

    for(let i=0; i < armySize; i++){
        orcArmy[i] = new Orc();
    }

    // for ... of simple loop : The for...of statement creates a loop iterating over iterable objects
    for(let orc of orcArmy){
        content += '#' + orc.getId() + ': ' + orc.getFullName() + '<br>';
    }

    orcArmy[0].talk( document.getElementById('dynamicContent') ) ;
    //console.log(orcArmy);

    // Write content to the browser
    document.getElementById('content').innerHTML = content;

     /************** events ***************/
    var btn = document.getElementById('dynamicContent2-trigger');
    btn.addEventListener('click', function() {
        //orcArmy[getRandomInt(orcArmy.length,1)].talk(document.getElementById('dynamicContent2') ) ;
        orcArmy[3].talk(document.getElementById('dynamicContent2') ) ;
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
