const {app, server, io} = require('./app')
const port = process.env.PORT

//let count = 0

// server emit --> client receive (constUpdated)
// client emit --> server receive (increment)

io.on('connection', (socket) => {
    console.log('New web socket connection')
    socket.emit('welcome', 'Welcome!')

    socket.on('newMessage', (message) => {
        io.emit('message', message)
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
    console.log('App running on port ' + port)
})
