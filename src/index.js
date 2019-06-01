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

const {
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
} = require('./utils/users')

const port = process.env.PORT

//let count = 0

// server emit --> client receive (constUpdated)
// client emit --> server receive (increment)

io.on('connection', (socket) => {
    socket.on('join', ({ username, room }, callback) => {
         
         const { error, user } = addUser({ id: socket.id, username, room })
         
         if (error) {
            return callback(error)
         }

         socket.join(user.room) //definisce una room
         //socket.to.emit --> manda il messaggio a una specifica room
        // Manda il mess solo alla socket
        socket.emit('welcome', generateMessage('Admin', 'Welcome!'))
        // Manda il mess a tutti (nella room) tranne alla socket connessa
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    // eslint-disable-next-line consistent-return
    socket.on('newMessage', (message, callback) => {
        const filter = new Filter()

        const user = getUser(socket.id)

        if (!user) {
            return callback('Invaid user')
        }

        if (filter.isProfane(message)) {
            return callback('Profanity in not allowed')
        }
        // Manda il mess a tutti gli utenti della room
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('share-location', (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('location', generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
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
