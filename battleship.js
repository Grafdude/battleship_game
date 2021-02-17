
const view = {
    //this method takes a string message and displays it on the screen
    displayMessage: function(msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }

}

const model = {

    generateShipLocations: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    collision: function(locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false; //if no collision
    },

    generateShip: function() {
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));    
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        { locations: ["0", "0", "0"], hits: ["", "", ""] },
        { locations: ["0", "0", "0"], hits: ["", "", ""] },
        { locations: ["0", "0", "0"], hits: ["", "", ""] }
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
    guessHistory: [],
    processGuess: function(guess) {    
        let location = parseGuess(guess);
        if (location) {
            for(let i = 0; i < this.guessHistory.length; i++) {
                if (location === this.guessHistory[i]) {
                    alert("You already pick this location, try again.")
                    return;
                }
            }
            this.guessHistory.push(location)
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my ships in " + this.guesses + " guesses!!");
            }
        }
    }
}

function parseGuess(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if(guess === null || guess.length !== 2) {
        alert("Oops, please enter a valid letter and number on the board");
    } else {
        firstChar = guess.charAt(0);
        firstChar = firstChar.toUpperCase();
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

function handleFireButton() {
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = "";    //this line resets the form input element to be the empty string. That way you don't have to explicitly select the text and delete it before entering the next guess, which would be annoying.
}

function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;

function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}


