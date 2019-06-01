/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const socket = io()
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#location')
const $messages = document.querySelector('#messages')

// Change Default Mustache Tags to avoid conflicts with handlebars
Mustache.tags = ['[[', ']]'];

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
// eslint-disable-next-line no-restricted-globals
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('welcome', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('location', (message) => {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        message: message.url,
        createdAt: moment(message.createdAt).format('hh:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
        const html = Mustache.render(sideBarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
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

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

// socket.on('countUpdated', (count) => {
//     console.log('the count has been updated', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicking +1') 
//     socket.emit('increment')
// })
