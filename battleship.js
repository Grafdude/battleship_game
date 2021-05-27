const gridBoard = document.querySelector('.grid-box');

const handleFireButton = () => {
  const guessInput = document.getElementById('guessInput');
  let guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = ''; //this line resets the form input element to be the empty string. That way you don't have to explicitly select the text and delete it before entering the next guess, which would be annoying.
};

// const handleGridClick = () {
//   const gridBoard = document.querySelectorAll('.grid-item');
//   for (const grid of gridBoard) {
//     grid.addEventListener('click', function () {
//       const guess = grid.id;
//       controller.processGuess(guess);
//     });
//   }
// };
gridBoard.addEventListener('click', function (e) {
  const clicked = e.target.closest('.grid-item');
  if (clicked) {
    console.log(clicked.getAttribute('id'));
  }
});

const handleKeyPress = (e) => {
  const fireButton = document.getElementById('fireButton');
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
};

const parseGuess = (guess) => {
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  if (guess === null) {
    return view.displayModal(
      'Soldier! Enter a valid letter and number that is on the board!'
    );
  } else {
    const guessArr = guess.split('').map((val) => {
      if (isNaN(Number(val))) return val.toUpperCase();
      return val;
    });
    const row = isNaN(Number(guessArr[0]))
      ? alphabet.indexOf(guessArr[0])
      : guessArr[0];
    const column = guessArr[1];
    console.log(row, column);

    if (isNaN(row) || isNaN(column)) {
      return view.displayModal(
        'That number is not on the board!. Get yourself together soldier!'
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
    console.log(row + column);
    return row + column;
  }
  return;
};

const init = () => {
  const fireButton = document.getElementById('fireButton');
  controller.guessHistory = [];
  fireButton.onclick = handleFireButton;
  const guessInput = document.getElementById('guessInput');
  guessInput.onkeypress = handleKeyPress;
  model.generateShipLocations();
  model.shipsSunk = 0;
  view.displaySunk(0);
  view.displayMessage(
    `Let's see what you're made of soldier... Go ahead, shoot!`
  );
  view.resetGrid();
};

const view = {
  displayMessage: function (msg) {
    let messageArea = document.querySelector('.panel__message-area');
    messageArea.textContent = msg;
  },

  displayHit: function (location) {
    document.getElementById(location).innerHTML =
      '<img src="img/ship.svg" class="hit" alt="ship">';
  },

  displayMiss: function (location) {
    if (location) {
      document.getElementById(location).innerHTML =
        '<img src="img/miss.svg" class="miss" alt="miss">';
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
  displaySunk: function (sunk) {
    let str = `${sunk} / ${model.numShips}`;
    document.querySelector('.is-sunken').textContent = str;
  },
  displayTopScore: function (score) {
    document.querySelector('.high-score').textContent = score;
  },
  resetGrid: function () {
    const grid = document.querySelectorAll('.grid-item');
    for (const el of grid) {
      if (el) {
        el.innerHTML = '';
      }
    }
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
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
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
        view.displayMessage('OUCH! That was a big hit soldier!');
        if (this.isSunk(ship)) {
          view.displayMessage('ARRRGHH! You sank one of my ships!');
          this.shipsSunk++;
          view.displaySunk(this.shipsSunk);
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
  topScore: 0,
  guesses: 0,
  guessHistory: [],
  processGuess: function (guess) {
    let location = parseGuess(guess);
    if (location) {
      for (let i = 0; i < this.guessHistory.length; i++) {
        if (location === this.guessHistory[i]) {
          return view.displayModal(
            `You already pick this location soldier, wake up and try again!`
          );
        }
      }
      this.guessHistory.push(location);
      this.guesses++;
      let hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        let score = (48 - this.guesses) * 14;
        if (score > this.topScore) {
          this.topScore = score;
          view.displayTopScore(score);
        }
        view.displayMessage(
          `You sank ${model.shipLength} ships in ${this.guesses} guesses
                     Your score is ${score}.
                    `
        );
        this.endGame();
      }
    }
  },
  endGame: function () {
    const messageArea = document.querySelector('.panel__message-area');
    messageArea.insertAdjacentHTML(
      'beforeend',
      '<button class="btn btn__play-again">Play Again?</button>'
    );
    const reset = document.querySelector('.btn__play-again');
    reset.addEventListener('click', init);
  },
};

window.onload = init;
