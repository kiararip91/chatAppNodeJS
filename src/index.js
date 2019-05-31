const Filter = require('bad-words')
const {
    app,
    server,
    io
} = require('./app')
const {
    generateMessage,
    generateLocationMessage
} = require('./utils/messages')

const port = process.env.PORT

//let count = 0

// server emit --> client receive (constUpdated)
// client emit --> server receive (increment)

io.on('connection', (socket) => {
    console.log('New web socket connection')
    // Manda il mess solo alla socket
    socket.emit('welcome', generateMessage('Welcome!'))
    // Manda il mess a tutti tranne alla socket connessa
    socket.broadcast.emit('message', generateMessage('A new User has joined'))

    // eslint-disable-next-line consistent-return
    socket.on('newMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity in not allowed')
        }
        // Manda il mess a tutti
        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('share-location', (location, callback) => {
        io.emit('location', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'))
    })
    //socket.emit('countUpdated', count)

    /*socket.on('increment', () => {
        count++
        // Emette un evento all singola connessione
        //socket.emit('countUpdated', count)
        // Emette l'evento a TUTTE le connessioni
        io.emit('countUpdated', count)
    })*/
})

app.get('', (req, res) => {
    res.render('index')
})

server.listen(port, () => {
    console.log('App running on port ', port)
})
