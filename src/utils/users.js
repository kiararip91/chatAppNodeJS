/* eslint-disable no-param-reassign */
/* eslint-disable arrow-parens */
/* eslint-disable space-before-blocks */
const users = []

// add user
const addUser = ({ id, username, room }) => {
    // clean the data
    username = username.trim().toLowerCase()

    // validate the data
    if (!username || !room) {
        return {
            error: 'User and room are reuiqred!'
        }
    }

    // check for exisiting user
    const exisitingUser = users.find((user) => user.room === room && user.username === username)

    // validate username
    if (exisitingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // store user
    const user = { id, username, room }
    users.push(user)

    return { user }
}

// remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }

    return undefined
}

// get user
const getUser = (id) => users.find((user) => user.id === id)

// get users in room
const getUsersInRoom = (room) => users.filter((user) => user.room === room)

module.exports = {
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
}
