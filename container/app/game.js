const Max16BitInt = 65535; // 2 ** 16 -1
const DoTrueRandomShuffle = true;
const PlayerCount = 1;
const DeckCount = 1;
const MininumCards = 20;  // How low the deck will get before a reshuffle. 

const Deck = [
        { face: "2",    suit: "spade",      color: "black"  },
        { face: "2",    suit: "heart",      color: "red"    },
        { face: "2",    suit: "diamond",    color: "red"    },
        { face: "2",    suit: "club",       color: "black"  },

        { face: "3",    suit: "spade",      color: "black"  },
        { face: "3",    suit: "heart",      color: "red"    },
        { face: "3",    suit: "diamond",    color: "red"    },
        { face: "3",    suit: "club",       color: "black"  },

        { face: "4",    suit: "spade",      color: "black"  },
        { face: "4",    suit: "heart",      color: "red"    },
        { face: "4",    suit: "diamond",    color: "red"    },
        { face: "4",    suit: "club",       color: "black"  },

        { face: "5",    suit: "spade",      color: "black"  },
        { face: "5",    suit: "heart",      color: "red"    },
        { face: "5",    suit: "diamond",    color: "red"    },
        { face: "5",    suit: "club",       color: "black"  },

        { face: "6",    suit: "spade",      color: "black"  },
        { face: "6",    suit: "heart",      color: "red"    },
        { face: "6",    suit: "diamond",    color: "red"    },
        { face: "6",    suit: "club",       color: "black"  },

        { face: "7",    suit: "spade",      color: "black"  },
        { face: "7",    suit: "heart",      color: "red"    },
        { face: "7",    suit: "diamond",    color: "red"    },
        { face: "7",    suit: "club",       color: "black"  },
        
        { face: "8",    suit: "spade",      color: "black"  },
        { face: "8",    suit: "heart",      color: "red"    },
        { face: "8",    suit: "diamond",    color: "red"    },
        { face: "8",    suit: "club",       color: "black"  },

        { face: "9",    suit: "spade",      color: "black"  },
        { face: "9",    suit: "heart",      color: "red"    },
        { face: "9",    suit: "diamond",    color: "red"    },
        { face: "9",    suit: "club",       color: "black"  },

        { face: "10",   suit: "spade",      color: "black"  },
        { face: "10",   suit: "heart",      color: "red"    },
        { face: "10",   suit: "diamond",    color: "red"    },
        { face: "10",    suit: "club",       color: "black"  },

        { face: "J",    suit: "spade",      color: "black"  },
        { face: "J",    suit: "heart",      color: "red"    },
        { face: "J",    suit: "diamond",    color: "red"    },
        { face: "J",    suit: "club",       color: "black"  },

        { face: "Q",    suit: "spade",      color: "black"  },
        { face: "Q",    suit: "heart",      color: "red"    },
        { face: "Q",    suit: "diamond",    color: "red"    },
        { face: "Q",    suit: "club",       color: "black"  },

        { face: "K",    suit: "spade",      color: "black"  },
        { face: "K",    suit: "heart",      color: "red"    },
        { face: "K",    suit: "diamond",    color: "red"    },
        { face: "K",    suit: "club",       color: "black"  },

        { face: "A",    suit: "spade",      color: "black"  },
        { face: "A",    suit: "heart",      color: "red"    },
        { face: "A",    suit: "diamond",    color: "red"    },
        { face: "A",    suit: "club",       color: "black"  }
    ];

let GameState = {
    deck: [],
    players: []
}


function printCard(card) {
    let printStr;

    if (card.suit === "spade") {
        printStr = `${card.face}♠`;
    } else if (card.suit === "heart") {
        printStr = `${card.face}♥`;
    } else if (card.suit === "diamond") {
        printStr = `${card.face}♦`;
    } else if (card.suit === "club") {
        printStr = `${card.face}♣`;
    };

    return printStr;
}


function printDeck(deck) {
    let resultDeck = [];
    for (const card of deck) {
        resultDeck.push(printCard(card));
    }
    console.dir(resultDeck);
}


// Returns between 0 and 1
function trueRandomNumber() {
    let uint16Array = new Uint16Array(1);
    uint16Array = crypto.getRandomValues(uint16Array);
    const random16bit = uint16Array[0];
    const random = random16bit / Max16BitInt;

    // console.log(`random: ${random}, random16bit: ${random16bit}`);
    return random;
}



// Fisher-Yates shuffle
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        let randomNumber;
        if (DoTrueRandomShuffle) {
            randomNumber = trueRandomNumber();
        } else {
            randomNumber = Math.floor();
        }

        const j = Math.floor(randomNumber * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function newDeck(gameState) {
    gameState.deck = [];
    for (let deckNumber = 0; deckNumber < DeckCount; deckNumber++) {
        let deck = structuredClone(Deck);
        deck = shuffle(deck);
        gameState.deck.push(deck);
    }
    return gameState;
}


function draw(deck) {
    const position = deck.length - 1;
    card = deck[position];
    deck.splice(position, 1);
    return card;
}


function deal(gameState, playerCount) {
    for (let n = 0; n < playerCount; n++) {
        gameState.players.push({ 
            name: `Player${n}`,
            upCards: [draw(gameState.deck)]
        });
    }
    gameState.players.push({
        name: "Dealer",
        upCards: [draw(gameState.deck)]
    });
        
    for (let n = 0; n < playerCount; n++) {
        gameState.players[n].downCards = [draw(gameState.deck)];
    }
    gameState.players[playerCount].downCards = [draw(gameState.deck)];
    return gameState;
}


function countHand(gameState) {
    let playerCount = 0;
    for (const player of gameState.players) {
        let aceCount = 0;
        let playerHandSum = 0;
        let cards = player.upCards.concat(player.downCards)
        
        for (const card of cards) {
            let value = 0;
            if      (card.face === "J") { value = 10; }
            else if (card.face === "Q") { value = 10; }
            else if (card.face === "K") { value = 10; }
            else if (card.face === "A") { aceCount++; }
            else { value = Number(card.face) }
            playerHandSum = playerHandSum + value;
        }

        if (playerHandSum + aceCount - 1 + 11 <= 21 ) {
            playerHandSum = playerHandSum + aceCount + 10;
        } 
        else {
            playerHandSum = playerHandSum + aceCount;
        }
        gameState.players[playerCount].value = playerHandSum;
        playerCount++;
    }
    return gameState;
}


function hit(gameState, playerNumber) {
    card = draw(gameState.deck);
    gameState.players[playerNumber].upCards.push(card);
    return gameState;
}


function test() {
    let deck = structuredClone(Deck);
    let gameState = { 
        deck: deck,
        players: []
    };

    // console.log('Test Print Deck')
    // printDeck(Deck);

    // console.log('Test trueRandomNumber')
    // let trueRandomNumbers = [];
    // for (let i = 0; i < 100; i++) {
    //     const result = trueRandomNumber()
    //     if (!((result >= 0) && (result <= 1))) {
    //         console.error(`bad trueRandomNumber: ${result}`)
    //     }
    //     trueRandomNumbers.push(result);
    // }
    // console.log(trueRandomNumbers);

    deck = structuredClone(Deck);
    deck = shuffle(deck);
    console.log('Test deck shuffling')
    printDeck(deck);

    console.log('Test making a new deck');
    gameState = {};
    gameState = newDeck(gameState);
    console.dir(gameState);

    // console.log('Test drawing cards')
    // drawDeck = structuredClone(Deck);
    // results = [];
    // for (let i = 0; i < 51; i ++) { 
    //     const drawCard = draw(drawDeck);
    //     const bottomCard = printCard(drawDeck[drawDeck.length - 1]);
    //     // console.log(`drawn card: ${printCard(drawCard)}, bottom card: ${bottomCard}`)
    //     results.push(`drawn card: ${printCard(drawCard)}, bottom card: ${bottomCard}`)
    // }
    // console.dir(results);
    // console.log('Cards left in deck:');
    // console.dir(drawDeck);

    console.log('Test deal cards');
    let playerCount = PlayerCount;
    gameState = { 
        deck: deck,
        players: []
    };
    deal(gameState, playerCount);
    console.dir(gameState);

    console.log('Test hit');
    gameState = hit(gameState, 0);
    console.dir(gameState);

    console.log('Test Count hands');
    gameState = countHand(gameState);
    console.dir(gameState);
}

test();
