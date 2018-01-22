"use strict";

// constants
const consonant = ['b', 'd', 'f', 'g', 'k', 't', 'p', 'z'];
const vowel = ['a', 'e', 'i', 'o', 'u', 'y'];
const armySize = 10;

var content = '';


// Orc obj constructor
function Orc(lastName){  
    this.firstName = setOrcName();
    this.lastName = lastName ? lastName : setOrcName();
    
    // ! Arrow syntax 1 : Shorter syntax
    this.getFullName = () => this.firstName + ' ' + this.lastName; 
    // Non arrow equivalent
    // this.getFullName = function(){
    //     return this.firstName + ' ' + this.lastName;
    // };
    
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
    
    // Instantiating the variable "orc" with let
    let orc = orcArmy[0];
    
    // Reusing the same let variable "orc" to loop through orcs -- let limits this "orc" variable scope's to this block
    // for ... of simple loop : The for...of statement creates a loop iterating over iterable objects 
    for(let orc of orcArmy){
        content += orc.getFullName() + '<br>';
    }

    // The orc variable is still containing the first orc of the orcArmy array.
    content += "<br> The first orc is : " + orc.getFullName();

    // Write content to the browser
    document.getElementById('content').innerHTML = content;
}

// Equivalent to jQuery $(document).ready() in vanilla js
document.addEventListener("DOMContentLoaded", function() {
     main();
});



/************** utils ***************/
/**
 * ! Functions and variables are hoisted : 
 * Hoisting is a JavaScript mechanism where variables and function declarations are moved to the top of their scope before code execution.
 */

function getRandomInt(max, min=0){
    return Math.floor(Math.random() * (max - min)) + min;
};

function getConsonantVowelPair(){
    return consonant[ getRandomInt(consonant.length) ] + vowel[ getRandomInt(vowel.length) ];
};








