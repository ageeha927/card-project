const express = require('express')
const axios = require('axios')
const router = express.Router()

let deckId
let playerHand = []
let dealerHand = []
let gameStatus = 'playing'
let playerScore = 0
let dealerScore = 0
let round = 1

router.get('/', async (req, res) => {
    if (!deckId) {
        deckId = await shuffleDeck()
    }
    await dealCards()
    res.render('blackjack', { playerHand, dealerHand, gameStatus, playerScore, dealerScore, round })
})

async function shuffleDeck() {
    const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/')
    return response.data.deck_id
}

async function dealCards() {
    playerHand = await drawCards(2)
    dealerHand = await drawCards(2)
}

async function drawCards(count) {
    const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`)
    return response.data.cards
}

function calculateScore(hand) {
    let score = 0
    let aces = 0
    hand.forEach(card => {
        if (card.value === 'KING' || card.value === 'QUEEN' || card.value === 'JACK') {
            score += 10
        } else if (card.value === 'ACE') {
            score += 11
            aces++
        } else {
            score += parseInt(card.value)
        }
    })
    while (score > 21 && aces) {
        score -= 10
        aces--
    }
    return score
}

router.post('/hit', async (req, res) => {
    if (gameStatus === 'playing') {
        const card = await drawCards(1)
        playerHand.push(card[0])
        const score = calculateScore(playerHand)
        if (score > 21) {
            gameStatus = 'bust'
        }
    }
    res.render('blackjack', { playerHand, dealerHand, gameStatus, playerScore, dealerScore, round })
})

router.post('/stand', async (req, res) => {
    try {
        gameStatus = 'stand'
        const playerFinalScore = calculateScore(playerHand)
        let dealerFinalScore = calculateScore(dealerHand)

        // Dealer's turn: keep drawing cards until score is at least 17
        while (dealerFinalScore < 17) {
            const newCard = await drawCards(1)
            dealerHand.push(newCard[0])
            dealerFinalScore = calculateScore(dealerHand)
        }

        // Determine the outcome
        if (dealerFinalScore > 21 || playerFinalScore > dealerFinalScore) {
            gameStatus = 'win'
            playerScore++
        } else if (playerFinalScore < dealerFinalScore) {
            gameStatus = 'lose'
            dealerScore++
        } else {
            gameStatus = 'push'
        }

        round++
        const isFinal = round > 5 // Check if the game has reached its end

        if (isFinal) {
            return res.render('blackjack', { 
                playerHand, 
                dealerHand, 
                gameStatus, 
                playerScore, 
                dealerScore, 
                round, 
                final: true 
            })
        }
        
        res.render('blackjack', { 
            playerHand, 
            dealerHand, 
            gameStatus, 
            playerScore, 
            dealerScore, 
            round, 
            final: false 
        })
    } catch (error) {
        console.error("Error during stand operation:", error)
        res.status(500).send("Internal Server Error")
    }
})



router.post('/reset', (req, res) => {
    deckId = null
    playerHand = []
    dealerHand = []
    gameStatus = 'playing'
    playerScore = 0
    dealerScore = 0
    round = 1
    res.redirect('/blackjack')
})

module.exports = router