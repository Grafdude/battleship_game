const handleFireButton = () => {
    const guessInput = document.getElementById('guessInput');
    let guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = ''; //this line resets the form input element to be the empty string. That way you don't have to explicitly select the text and delete it before entering the next guess, which would be annoying.
};

const handleKeyPress = (e) => {
    const fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
};

const parseGuess = (guess) => {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess === null || guess.length !== 2) {
        return view.displayModal(
            "Soldier! Enter a valid letter and number that's on the board!"
        );
    } else {
        firstChar = guess.charAt(0);
        firstChar = firstChar.toUpperCase();
        let row = alphabet.indexOf(firstChar); //searches for a match in array then returns the index of match
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            return view.displayModal(
                'That number is not on the board soldier!. Get yourself together soldier!'
            );
        } else if (
            row < 0 ||
            row >= model.boardSize ||
            column < 0 ||
            column >= model.boardSize
        ) {
            return view.displayModal(
                'That is off the board! You can shoot better than that soldier!'
            );
        }
        return row + column;
    }
    return;
};

const init = () => {
    const fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    const guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
};

const view = {
    //this method takes a string message and displays it on the screen
    displayMessage: function (msg) {
        let messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
    },

    displayMiss: function (location) {
        if (location) {
            let cell = document.getElementById(location);
            cell.setAttribute('class', 'miss');
        }
    },

    displayModal: function (msg) {
        const modal = document.querySelector('.modal');
        modal.addEventListener('click', function () {
            modal.classList.remove('modal--show');
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' || 'Enter') {
                modal.classList.remove('modal--show');
            }
        });
        const modalTxt = document.querySelector('.modal-msg');
        modalTxt.textContent = msg;
        modal.classList.toggle('modal--show');
    },
};

const model = {
    generateShipLocations: function () {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    collision: function (locations) {
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

    generateShip: function () {
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(
                Math.random() * (this.boardSize - this.shipLength)
            );
        } else {
            row = Math.floor(
                Math.random() * (this.boardSize - this.shipLength)
            );
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + i));
            } else {
                newShipLocations.push(row + i + '' + col);
            }
        }
        return newShipLocations;
    },

    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        { locations: ['0', '0', '0'], hits: ['', '', ''] },
        { locations: ['0', '0', '0'], hits: ['', '', ''] },
        { locations: ['0', '0', '0'], hits: ['', '', ''] },
    ],

    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('OUCH! That was a big HIT soldier!');
                if (this.isSunk(ship)) {
                    view.displayMessage(
                        'OH NO! You sank one of my battlships!'
                    );
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed!');
        return false;
    },

    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    },
};

const controller = {
    topScore: [],
    guesses: 0,
    guessHistory: [],
    processGuess: function (guess) {
        let location = parseGuess(guess);
        if (location) {
            for (let i = 0; i < this.guessHistory.length; i++) {
                if (location === this.guessHistory[i]) {
                    view.displayModal(
                        'You already pick this location soldier! Wake up and try again.'
                    );
                    return;
                }
            }
            this.guessHistory.push(location);
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(
                    'You sank all my ships in ' + this.guesses + ' guesses!'
                );
            }
        }
    },
};

window.onload = init;
