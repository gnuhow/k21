let GameState = {};

async function start() {
    console.log('Start pressed');
    try {
        const request = new Request('/start');

        const response = await fetch(request);
        if (!response.ok) {
            throw new Error(`Deal HTTP error, status: ${response.status}`);
        };

        GameState = await response.json();
        console.log(dealJson);
    } catch (error) {
        console.error('Deal error');
        console.error(error.message);
    };
    return GameState;
};


async function hit() {
    console.log('Hit pressed');
    try {
        const request = new Request('/hit', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify(GameState),
            }
        );

        const response = await fetch(request);
        if (!response.ok) {
            throw new Error(`Hit HTTP error, status: ${response.status}`);
        };

        const dealJson = await response.json();
        console.log(dealJson);
    } catch (error) {
        console.error('Hit error:');
        console.error(error.message);
    }
};


async function stand() {
    console.log('Stand pressed.');
    try {
        const request = new Request('/stand', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify(GameState),
            }
        )

        const response = await fetch(request);
        if (!response.ok) {
            throw new Error(`Stand HTTP error, status: ${response.status}`);
        };

        const dealJson = await response.json();
        console.log(dealJson);
    } catch (error) {
        console.error('Deal error');
        console.error(error.message);
    }
};
