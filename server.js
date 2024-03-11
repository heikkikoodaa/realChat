const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const connectedUsers = new Map()

app.use(express.static('public'))

const getUserList = () => {
  const userArray = Array.from(connectedUsers.values())
  return userArray.map(user => user)
}

const updateUserlist = () => {
  const userlist = getUserList()
  io.emit('userlist', userlist)
}

io.on('connection', (socket) => {
  connectedUsers.set(socket.id, "")
  console.log('A user connected');

  updateUserlist()

  socket.on('updateUsername', name => {
    connectedUsers.set(socket.id, name)
    updateUserlist()
  })

  socket.emit('welcome', 'Welcome to the chat room!')

  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id)
    console.log('A user disconnected');
    updateUserlist()
  })

  socket.on('message', msg => {
    const username = msg.split(':')[0]
    connectedUsers.set(socket.id, username)
    console.log('list of users', connectedUsers)
    socket.broadcast.emit('message', msg)
    socket.emit('updateUsers', JSON.stringify(connectedUsers))
    updateUserlist()
  })

})

const PORT = process.env.PORT || 3002
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))