
const view = {
    //this method takes a string message and displays it on the screen
    displayMessage: function(msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        let cell = document.getElementById(location);
        cell.classList.add("hit");
    },

    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }

}

const model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        { locations: ["06", "16", "26"], hits: ["", "", ""] },
        { locations: ["24", "34", "44"], hits: ["", "", ""] },
        { locations: ["10", "11", "12"], hits: ["", "", ""] }
    ],

    fire: function(guess) {
        for(let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if(index >= 0) {
                //WE HAVE A HIT!
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("OUCH!! That was a big HIT!");
                if(this.isSunk(ship)) {
                    view.displayMessage("OHHHH NOOO!! You sank one of my battlships!");
                    this.shipsSunk++;
                }
                return true;
            } 
        }
        view.displayMiss(guess);
        view.displayMessage("You missed, hahahah!"); 
        return false;   
    },
    
    isSunk: function(ship) {
        for(var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    }
}

const controller = {
    guesses: 0,
    processGuesses: function(guess) {
        //code will go here
    },

}

function parseGuess(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if(guess === null || guess.length !== 2) {
        alert("Oops, please enter a valid letter and number on the board");
    } else {
        firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar); //searches for a match in array then returns the index of match
        let column = guess.charAt(1);
        
        if(isNaN(row) || isNaN(column)) {
            alert("Oops! that number is not on the board.");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("OOPS! That's off the board.");
        }
        return row + column;
    }
    return null; 
}


// function shipPosition() {
//     let arr = ["A", "B", "C", "D", "E", "F", "G"];
//     let ranLetter = Math.floor(Math.random() * (arr.length));
//     let ranNum = Math.floor(Math.random() * (arr.length));

//     let pos1 = arr[ranLetter] + ranNum;
//     let pos2;
//     if (ranNum < 6) {
//         pos2 = ranNum + 1;
//     } else {
//         pos2 = ranNum - 1;
//     }

//     return pos1 + pos2;
// }

