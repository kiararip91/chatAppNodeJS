const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const path = require('path')

const publicFolderPath = path.join(__dirname, '../public')

const app = express()

// Setup static directory to serve
app.use(express.static(publicFolderPath))

const server = http.createServer(app)
const io = socketio(server)

module.exports = {
    app,
    server,
    io
}
