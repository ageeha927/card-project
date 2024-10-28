# Card Games Project

This project is a web-based implementation of two classic card games: Blackjack and War. It's built using Node.js with Express.js for the backend, and HTML/CSS for the frontend.

## How to Play

### Blackjack

1. Visit the `/blackjack` route to start a game of Blackjack.
2. You'll be dealt two cards, and the dealer will have one card face up.
3. Your goal is to get as close to 21 points as possible without going over.
4. You can choose to "hit" (take another card) or "stand" (keep your current hand).
5. After you stand, the dealer will reveal their hidden card and hit until they have at least 17 points.
6. If your hand is closer to 21 than the dealer's, or if the dealer busts (goes over 21), you win!

### War

1. Visit the `/war` route to start a game of War.
2. You and the computer will each be dealt 26 cards.
3. Each round, both players reveal the top card of their deck.
4. The player with the higher card wins the round and takes both cards.
5. If there's a tie, a "war" is declared, and each player puts down three face-down cards and one face-up card. The player with the higher face-up card wins all the cards played in that round.
6. The game continues until one player has all the cards and is declared the winner.

## Game Logic

### Blackjack

- The game uses a standard 52-card deck.
- Face cards (Jack, Queen, King) are worth 10 points.
- Aces can be worth 1 or 11 points, whichever is more favorable to the player.
- The dealer must hit on 16 and stand on 17.

### War

- The game uses a standard 52-card deck, equally divided between two players.
- Card values are compared using their rank (2 is lowest, Ace is highest).
- In case of a tie, a "war" is initiated.

## Development Challenges

1. **Deck Management**: Implementing a system to shuffle, deal, and manage the deck of cards for both games.

2. **Game State**: Keeping track of the game state, including player hands, scores, and the current stage of the game.

3. **Asynchronous Gameplay**: Handling user interactions and updating the game state asynchronously, especially for the War game where multiple rounds are played.

4. **User Interface**: Creating an intuitive and responsive interface that works well for  desktop.

5. **Game Logic**: Implementing the correct rules for each game, including special cases like "wars" in the War game and the dual nature of Aces in Blackjack.

6. **Error Handling**: Ensuring the games can handle unexpected user actions or server errors gracefully.

## Technologies Used

- Node.js
- Express.js
- EJS (for view templating)
- HTML/CSS for frontend styling

