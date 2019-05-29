/* eslint-disable no-undef */
const socket = io()

socket.on('welcome', (message) => {
    console.log(message)
})

socket.on('message', (message) => {
    console.log(message)
})


document.querySelector('#btn').addEventListener('click', (event) => {
    event.preventDefault();
    const clientMessage = document.getElementsByName('message')[0].value
    socket.emit('newMessage', clientMessage)
    })

// socket.on('countUpdated', (count) => {
//     console.log('the count has been updated', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicking +1')
//     socket.emit('increment')
// })
