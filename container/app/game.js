const crypto = require('node:crypto');

const Max16BitInt = 65535; // 2 ** 16 -1
const DoTrueRandomShuffle = true;
const PlayerCount = 1;
const DeckCount = 1;
const MinimumCards = 50;  // How many cards left before a reshuffle. 
const DealerHold = 14;  // Dealer holds at 14

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

// const GameState = {
//     deck: [],
//     players: []
// }


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
// function trueRandomNumberBrowser() {
//     let uint16Array = new Uint16Array(1);
//     uint16Array = crypto.getRandomValues(uint16Array);
//     const random16bit = uint16Array[0];
//     const random = random16bit / Max16BitInt;

//     // console.log(`random: ${random}, random16bit: ${random16bit}`);
//     return random;
// }


// Returns between 0 and 1
function trueRandomNumberNode() {
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
            randomNumber = trueRandomNumberNode();
        } else {
            randomNumber = Math.random();
        }

        const j = Math.floor(randomNumber * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function newDeck(gameState) {
    gameState.deck = [];
    let deck = [];
    for (let deckNumber = 0; deckNumber < DeckCount; deckNumber++) {        
        const deckClone = structuredClone(Deck);
        for (const card of deckClone) {
            deck.push(card);
        }
    }
    gameState.deck = shuffle(deck);
    return gameState;
}


function start(playerCount) {
    let gameState = {
        deck: [],
        players: [],
        misc: {
            playerCount: playerCount,
            reshuffles: 0,
        }
    };
    gameState = newDeck(gameState);
    return gameState;
}


function draw(deck) {
    // console.log(`draw deck`);
    // console.dir(deck);
    const position = deck.length - 1;
    card = deck[position];
    deck.splice(position, 1);

    // console.log(`length ${deck.length}`);
    // console.log(`position ${position}`);
    // console.log(`card ${card}`);
    return card;
}


function deal(gameState) {
    const playerCount = gameState.misc.playerCount;
    for (let n = 0; n < playerCount; n++) {
        // console.log(`player n: ${n}`);
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


function countHand(upCards, downCards) {
    let aceCount = 0;
    let playerHandSum = 0;
    let cards = upCards.concat(downCards);
    
    for (const card of cards) {
        let value = 0;
        if      (card.face === "J") { value = 10; }
        else if (card.face === "Q") { value = 10; }
        else if (card.face === "K") { value = 10; }
        else if (card.face === "A") { aceCount++; }
        else { value = parseInt(card.face) } 
        playerHandSum = playerHandSum + value;
    }

    if ((aceCount > 0) && (playerHandSum + aceCount - 1 + 11 <= 21 )) {
        playerHandSum = playerHandSum + aceCount + 10;
    } 
    else {
        playerHandSum = playerHandSum + aceCount;
    }
    return playerHandSum;
}


function countHands(gameState) {
    playerCount = 0;
    for (const player of gameState.players) {
        const value = countHand(player.upCards, player.downCards);
        gameState.players[playerCount].value = value;
        playerCount++;
    }
    return gameState;
}


function getHandStatus(handValue) {
    let status;
    if (handValue < 21) {
        status = 'ready';
    } else if (handValue === 21) {
        status = 'blackjack';
    } else if (handValue > 21) {
        status = 'bust';
    }
    return status;
}


function updatePlayerStatus(gameState, playerNumber) {
    value = countHand(gameState.players[playerNumber].upCards, gameState.players[playerNumber].downCards);
    gameState.players[playerNumber].value = value;

    const status = getHandStatus(value);
    gameState.players[playerNumber].status = status;

    return gameState;
}


function dealerTurn(gameState) {
    console.log('dealer turn');
    let playerNumber = gameState.players.length - 1;
    gameState = updatePlayerStatus(gameState, playerNumber);

    let value = gameState.players[playerNumber].value;
    console.log(`playerNumber: ${playerNumber} value: ${value}`);

    let doHit = false;
    for (const player of gameState.players) {
        if ((player.name != 'dealer') && (player.status != 'bust') && (value < DealerHold)) {
            doHit = true;
       }
    }

    if (doHit) {
        console.log('Dealer is taking a hit.')
        card = draw(gameState.deck);
        gameState.players[playerNumber].upCards.push(card);
    }
    gameState = updatePlayerStatus(gameState, playerNumber);

    return gameState;
}


function endHand() {
    playerCount = 0;
    for (const player of gameState.players) {
        // todo        
        playerCount++;
    }

    if (gameState.deck.length < MinimumCards) {
        gameState.deck = newDeck(gameState);
        gameState.misc.reshuffles++; 
    }
}


function checkRoundEnd(gameState) {
    let doEnd = true;
    for (const player of gameState.players) {
        if (player.status == "wait") {
            doEnd = false;
        }
    }
    if (doEnd) {
        gameState = dealerTurn(gameState);
        // check for winner
        // check for reshuffle
    }
}


function hit(gameState, playerNumber) {
    const card = draw(gameState.deck);
    gameState.players[playerNumber].upCards.push(card);
    // gameState = countHands(gameState);
    gameState = updatePlayerStatus(gameState, playerNumber);
    
    gameState = checkRoundEnd(gameState);
    return gameState;
}


function hold(gameState, playerNumber) {
    gameState.players[playerNumber].status = 'ready';
    gameState = dealerTurn(gameState);
    gameState = checkRoundEnd(gameState);
    return gameState;
}


function test() {
    let deck = structuredClone(Deck);
    let gameState = { 
        deck: deck,
        players: []
    };

    // console.log('Debugging int parsing');
    // for (card of deck) {
    //     console.log(card);
    //     console.log(`Number: ${Number(card.face) + Number(5)}`);
    //     console.log(`paresing: ${parseInt(card.face) + parseInt(5)}`);
    // }

    // console.log('Test Print Deck')
    // printDeck(Deck);

    // console.log('Test trueRandomNumberNode')
    // let trueRandomNumbers = [];
    // for (let i = 0; i < 100; i++) {
    //     const result = trueRandomNumberNode()
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

    // console.log('Test making a new deck');
    // gameState = start();
    // gameState = newDeck(gameState);
    // console.dir(gameState.deck);

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
    // gameState = { 
    //     deck: deck,
    //     players: []
    // };
    deal(gameState, playerCount);
    console.dir(gameState);

    console.log('Test hit');
    gameState = hit(gameState, 0);
    for (const player of gameState.players) {
        console.dir(player);
    };

    console.log('Test Count hands');
    gameState = countHands(gameState);
    // console.dir(gameState);
    for (const player of gameState.players) {
        console.dir(player);
    };  
};


function main() {
    console.log('start');
    gameState = start(PlayerCount);
    
    console.log('newDeck');
    gameState = newDeck(gameState);
    console.dir(gameState, {depth: 10});
    
    console.log('deal');
    gameState = deal(gameState);
    console.dir(gameState, {depth: 10});

    console.log('hit');
    gameState = hit(gameState, 0);
    console.dir(gameState, {depth: 10});
};

// test();
// main();

module.exports = {
    printCard,
    printDeck,
    start,
    deal,
    hit,
    newDeck,
    hold,
}
