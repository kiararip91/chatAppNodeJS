const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const path = require('path')
const hbs = require('hbs')

const publicFolderPath = path.join(__dirname, '../public')
const partialsFolderPath = path.join(__dirname, '../templates/partials')

const app = express()

// Setup handleBars engine and views location
app.set('view engine', 'hbs')
app.set('views', 'templates/views')
hbs.registerPartials(partialsFolderPath)

// Setup static directory to serve
app.use(express.static(publicFolderPath))
app.use(express.json())

const server = http.createServer(app)
const io = socketio(server)

module.exports = {
    app,
    server,
    io
}
