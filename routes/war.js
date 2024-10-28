const express = require('express')
const axios = require('axios')
const router = express.Router()

let deckId
let playerCard = null
let dealerCard = null
let playerScore = 0
let dealerScore = 0
let round = 1
let gameStatus = 'playing'

router.get('/', async (req, res) => {
    if (!deckId) {
        deckId = await shuffleDeck()
    }
    await playRound()
    res.render('war', { playerCard, dealerCard, playerScore, dealerScore, round, gameStatus })
})

async function shuffleDeck() {
    const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    return response.data.deck_id
}

async function drawCard() {
    const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    return response.data.cards
}

async function playRound() {
    const [playerCardDraw, dealerCardDraw] = await drawCard()
    playerCard = playerCardDraw
    dealerCard = dealerCardDraw

    const playerCardValue = getCardValue(playerCard.value)
    const dealerCardValue = getCardValue(dealerCard.value)

    if (playerCardValue > dealerCardValue) {
        playerScore++
    } else if (dealerCardValue > playerCardValue) {
        dealerScore++
    }

    round++

    if (round > 26 || playerScore === 13 || dealerScore === 13) { // end game conditions
        gameStatus = playerScore > dealerScore ? 'Player wins!' : 'Dealer wins!'
    }
}

function getCardValue(value) {
    if (['JACK', 'QUEEN', 'KING'].includes(value)) return 11
    if (value === 'ACE') return 14
    return parseInt(value)
}

router.post('/next', async (req, res) => {
    if (gameStatus === 'playing') {
        await playRound()
    }
    res.render('war', { playerCard, dealerCard, playerScore, dealerScore, round, gameStatus })
})

router.post('/reset', async (req, res) => {
    deckId = await shuffleDeck()
    playerCard = null
    dealerCard = null
    playerScore = 0
    dealerScore = 0
    round = 1
    gameStatus = 'playing'
    res.redirect('/war')
})

module.exports = router