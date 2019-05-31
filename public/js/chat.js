/* eslint-disable no-undef */
const socket = io()
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#location')
const $messages = document.querySelector('#messages')

// Change Default Mustache Tags to avoid conflicts with handlebars
Mustache.tags = ["[[", "]]"];

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('welcome', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('location', (message) => {
    console.log(message)
    const html = Mustache.render(locationTemplate, {
        message: message.url,
        createdAt: moment(message.createdAt).format('hh:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})


$messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled')
    const clientMessage = document.getElementsByName('message')[0].value
    socket.emit('newMessage', clientMessage, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('The message was delivered') // ack
    })
    })

document.querySelector('#location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        // eslint-disable-next-line no-alert
        return alert('geolocation is not support by your Browser')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('share-location', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location Shared!')
        })

        $locationButton.removeAttribute('disabled')
    })
})

// socket.on('countUpdated', (count) => {
//     console.log('the count has been updated', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicking +1')
//     socket.emit('increment')
// })
