const express = require('express')
const axios = require('axios')
const router = express.Router()

let deckId
let playerHands = [[], [], []] // Three players
let scores = [0, 0, 0]
let currentTrick = []
let trickWinner = null
let round = 1
let heartsBroken = false

router.get('/', async (req, res) => {
    if (!deckId) {
        deckId = await shuffleDeck()
        await dealCards()
    }
    res.render('hearts', { playerHands, scores, currentTrick, trickWinner, round, heartsBroken })
})

async function shuffleDeck() {
    const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/')
    return response.data.deck_id
}

async function dealCards() {
    for (let i = 0; i < 3; i++) {
        playerHands[i] = await drawCards(13)
    }
}

async function drawCards(count) {
    const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`)
    return response.data.cards
}

router.post('/play', (req, res) => {
    const playerIndex = parseInt(req.body.playerIndex)
    const cardIndex = parseInt(req.body.cardIndex)
    const playedCard = playerHands[playerIndex].splice(cardIndex, 1)[0]

    if (playedCard.suit === 'HEARTS') {
        heartsBroken = true
    }

    currentTrick.push({ playerIndex, card: playedCard })

    if (currentTrick.length === 3) {
        trickWinner = determineTrickWinner(currentTrick)
        scores[trickWinner] += calculatePoints(currentTrick)
        currentTrick = []
        round++
    }

    res.render('hearts', { playerHands, scores, currentTrick, trickWinner, round, heartsBroken })
})

function determineTrickWinner(trick) {
    const ledSuit = trick[0].card.suit
    let winningCard = trick[0].card
    let winnerIndex = trick[0].playerIndex

    for (const play of trick) {
        if (play.card.suit === ledSuit) {
            if (compareCards(play.card, winningCard) > 0) {
                winningCard = play.card
                winnerIndex = play.playerIndex
            }
        }
    }
    return winnerIndex
}

function compareCards(card1, card2) {
    const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE']
    const rank1 = rankOrder.indexOf(card1.value)
    const rank2 = rankOrder.indexOf(card2.value)
    return rank1 - rank2
}

function calculatePoints(trick) {
    return trick.reduce((points, play) => {
        if (play.card.suit === 'HEARTS') {
            return points + 1
        }
        if (play.card.value === 'QUEEN' && play.card.suit === 'SPADES') {
            return points + 13
        }
        return points
    }, 0)
}

router.post('/reset', (req, res) => {
    deckId = null
    playerHands = [[], [], []]
    scores = [0, 0, 0]
    currentTrick = []
    trickWinner = null
    round = 1
    heartsBroken = false
    res.redirect('/hearts')
})

module.exports = router