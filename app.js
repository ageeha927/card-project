const express = require('express')
const app = express()
const blackjackRoutes = require('./routes/blackjack')
const warRoutes = require('./routes/war')
const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use('/blackjack', blackjackRoutes)
app.use('/war', warRoutes)

app.get('/', (req, res) => {
    res.sendFile('home.html', { root: './public' })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})