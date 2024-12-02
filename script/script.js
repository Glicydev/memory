/*
    Exercice: memory
    Details: détials
    Auteur: Auer Aymon Ludovic
    Date: 02.12.2024
*/

// Initialisation
const game = document.querySelector(".memory-game");
const tentativesP = document.getElementById("tentatives");
const PoneP = document.getElementById("pOne");
const PtwoP = document.getElementById("pTwo");
const bestP = document.getElementById("best");
const playerH3 = document.querySelector("h3");

let actualPlayer = "p1";

let isTimeOut = false;
let tentatives = 0;
let bestTry = 0;

let p1Found = 0;
let p2Found = 0;
let p1Points = 0;
let p2Points = 0;

const cardsArray = [
  { name: "Nerd", symbol: "🤓☝" },
  { name: "Python-charlie", symbol: "🐍" },
  { name: "Big-Dog", symbol: "🐕" },
  { name: "Chat-noir", symbol: "🐈" },
  { name: "Pates-bolo", symbol: "🍝" },
  { name: "Hazbin-hotel", symbol: "🏘" },
];

// Get 2 of each cards and put it in an random order
const allCards = [...cardsArray, ...cardsArray];
allCards.sort(() => 0.5 - Math.random());

function buildCards() {
  allCards.forEach((card) => {
    const cardDiv = document.createElement("div");

    cardDiv.classList.add(card.name);
    cardDiv.setAttribute("name", card.name);

    cardDiv.classList.add("memory-card");
    cardDiv.textContent = "?";

    // Handle click
    cardDiv.addEventListener("click", async() => {
      if (!isTimeOut) {
        if (!cardDiv.getAttribute("flip")) {
          cardDiv.classList.add("flip");
          cardDiv.setAttribute("flipped", true);
          cardDiv.textContent = card.symbol;

          const flipped = document.querySelectorAll(".flip");

          // Check only if there can be a pair
          if (flipped.length % 2 === 0) {
            await checkFound(flipped);

            // Switch the actual player
            actualPlayer = actualPlayer === "p1" ? "p2" : "p1";
            const playerAsTest =
              actualPlayer === "p1" ? "Player 1's" : "Player 2's";
            playerH3.textContent = playerAsTest + " turn";
          }
        }
      }
    });

    game.appendChild(cardDiv);
  });
}

function updateTries() {
  tentatives++;
  tentativesP.textContent = "Tentative(s): " + tentatives;
}

function checkFound(flipped) {
  // If the number is pair, so there can be a winner
  isTimeOut = true;

  // Beacause of the timeout it will change, so stock it
  const stockedActualPlayer = actualPlayer

  updateTries();

  // Wait 1 second before do
  setTimeout(() => {
    // Initialisation
    let namesFlipped = [];
    let flippedNotChecked = [];

    // Get all the flipped cards that hasn't already been found
    flipped.forEach((theCard) => {
      if (!theCard.getAttribute("found")) flippedNotChecked.push(theCard);
    });

    // Get all the name if the flipped cards that hasn't been found into namesFlipped
    flippedNotChecked.forEach((card) =>
      namesFlipped.push(card.getAttribute("name"))
    );

    // Try for each names
    cardsArray.forEach((card) => {
      const name = card.name;

      // Nb of flipped cards that has the actual name
      const nbCardsFlipped = namesFlipped.filter(
        (name) => name === card.name
      ).length;

      // If there is more than one, so one pair has just been found
      if (nbCardsFlipped > 1) {
        document.querySelectorAll("." + name).forEach((foundCard) => {
          foundCard.setAttribute("found", true);
          foundCard.classList.add(stockedActualPlayer)
        });
        checkEndGame();
      } else {
        // Flip back all the flipped cards
        document.querySelectorAll("." + name).forEach((cardToFlip) => {
          if (!cardToFlip.getAttribute("found")) {
            cardToFlip.setAttribute("flipped", false);
            cardToFlip.classList.remove("flip");
            cardToFlip.textContent = "?";
          }
        });
      }
    });
    isTimeOut = false;
  }, 1000);
}

function getBestTry() {
  bestTry = localStorage.getItem("best") ? localStorage.getItem("best") : 0;
  if (bestTry) {
    bestP.textContent = "Meilleure run: " + bestTry;
  }
}

function getPoints() {
  p1Points = localStorage.getItem("pOnePoints")
    ? localStorage.getItem("pOnePoints")
    : 0;
  p2Points = localStorage.getItem("pTwoPoints")
    ? localStorage.getItem("pTwoPoints")
    : 0;
  updatePoints();
}

function savePoints() {
  localStorage.setItem("pOnePoints", p1Points);
  localStorage.setItem("pTwoPoints", p2Points);
}

function checkEndGame() {
  let isFull = true;

  game.querySelectorAll(".memory-card").forEach((div) => {
    if (!div.getAttribute("found")) {
      isFull = false;
    }
  });

  if (isFull) {
    if (bestTry > 0) {
      if (tentatives < bestTry) {
        localStorage.setItem("best", tentatives);
        alert("You just finished the game in " + tentatives + " try !");
      }
    } else {
      localStorage.setItem("best", tentatives);
    }

    bestP.textContent = "Meilleure run: " + bestTry;

    // Update the points and save it
    if (p1Found > p2Found) {
      p1Points++;
    } else {
      p2Points++;
    }

    savePoints();
    updatePoints();

    getBestTry();
    reset();
  }
}

function reset() {
  game.querySelectorAll("div").forEach((div) => div.remove());
  allCards.sort(() => 0.5 - Math.random());
  buildCards();

  tentatives = 0;
  updateTries();
}

function updatePoints() {
  PoneP.textContent = "Player one: " + p1Points;
  PtwoP.textContent = "Player two: " + p2Points;
  p1Found = 0;
  p2Found = 0;
}

buildCards();

getBestTry();

getPoints();
