const express = require('express')
const app = express()
const blackjackRoutes = require('./routes/blackjack')
const heartsRoutes = require('./routes/hearts')
const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use('/blackjack', blackjackRoutes)
app.use('/hearts', heartsRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to Card Games! Visit /blackjack or /hearts')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})