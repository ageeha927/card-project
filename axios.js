// Step 1: Import necessary modules
const express = require('express');
// Optional
const axios = require('axios'); // Axios to make API requests

// Step 2: Initialize the Express app
const app = express();

// Step 3: Create a GET route to handle API request
app.get('/api/randomhand', async (req, res) => {
    try {
        // Step 4: Make an API request to fetch random users
        // const response = await axios.get('https://www.deckofcardsapi.com/api/deck/wc118ugnmhei/draw/?count=2');
        // OR
        const response = await fetch('https://www.deckofcardsapi.com/api/deck/wc118ugnmhei/draw/?count=2')
            .then(response => response.json())
        
        console.log(response.cards)
        // Step 5: Send the data back as a response
        res.json({
            success: true,
            message: 'Random user data fetched successfully!',
            data: response.cards
            // data:response.data
        });
    } catch (error) {
        // Step 6: Handle any errors that occur during the request
        res.status(500).json({
            success: false,
            message: 'Failed to fetch data from the API',
            error: error.message
        });
    }
});

// Step 7: Set up the server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});