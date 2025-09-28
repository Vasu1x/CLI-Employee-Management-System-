const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// --- In-Memory Data Store (MATCHES Expected Output Screenshot) ---
let cards = [
    // Note: The suits/values are reordered here to match the GET /cards screenshot
    { id: 1, suit: 'Hearts', value: 'Ace' }, 
    { id: 2, suit: 'Spades', value: 'King' },
    { id: 3, suit: 'Diamonds', value: 'Queen' }
];
let nextId = 4; // Counter for new cards (matches the ID of the POSTed card)

// --- API Endpoints ---

// 1. GET /cards - List all cards
app.get('/cards', (req, res) => {
    // Expected Status: 200 OK
    res.status(200).json(cards);
});

// 2. GET /cards/:id - Retrieve a specific card by ID
app.get('/cards/:id', (req, res) => {
    const cardId = parseInt(req.params.id);
    const card = cards.find(c => c.id === cardId);

    if (card) {
        // Expected Status: 200 OK
        res.status(200).json(card);
    } else {
        // Expected Status: 404 Not Found
        res.status(404).json({ message: `Card with ID ${cardId} not found.` });
    }
});

// 3. POST /cards - Add a new card
app.post('/cards', (req, res) => {
    const { value, suit } = req.body;

    // Basic validation
    if (!value || !suit) {
        return res.status(400).json({ message: 'Missing required properties: value and suit.' });
    }

    // Create the new card object
    const newCard = {
        id: nextId++,
        value: value,
        suit: suit
    };

    cards.push(newCard);

    // Expected Status: 201 Created
    // Expected Body: Returns the newly created card
    res.status(201).json(newCard); // Matches the screenshot returning only the card object
});

// 4. DELETE /cards/:id - Delete a card by ID
app.delete('/cards/:id', (req, res) => {
    const cardId = parseInt(req.params.id);
    const index = cards.findIndex(c => c.id === cardId);

    if (index === -1) {
        // Card not found: return 404 Not Found
        return res.status(404).json({ message: `Card with ID ${cardId} not found.` });
    }

    // Remove the card and capture the removed object
    const removedCard = cards.splice(index, 1)[0];

    // Expected Status: 200 OK
    // Expected Body: Returns a message AND the removed card object
    res.status(200).json({ 
        "message": `Card with ID ${cardId} removed`,
        "card": removedCard
    });
});

// --- Server Startup ---

app.listen(PORT, () => {
    console.log(`\n🎉 REST API Server is running on http://localhost:${PORT}`);
    console.log('Use a tool like Postman or Insomnia to test the API.\n');
});