const welcomeText = document.querySelector('.user-welcome')
const chatUser = document.querySelector('.chat-username')
const chatWindow = document.querySelector('.chat')
const messageField = document.querySelector('.message-input-field')
const connectedUsers = document.querySelector('.connected-users')

messageField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()

    handleMessageSubmit(event.target.value)
  }
})

const username = generateRandomUsername()
const socket = io()

socket.on('connect', () => {
  console.log('Connected!')
  socket.emit('updateUsername', username)
})

socket.on('message', (msg) => {
  appendChatMessage(msg)
})

socket.on('userlist', userlist => {
  const listOfUsers = userlist.join(', ')
  connectedUsers.textContent = `Connected users: ${listOfUsers}`
})

welcomeText.textContent = `Welcome dear ${username}!`
chatUser.textContent = `Username: ${username}`

function appendChatMessage(msg) {
  if (!msg) return

  const p = document.createElement('p')

  p.textContent = msg

  chatWindow.appendChild(p)
}

function clearMessageField() {
  messageField.value = ''
}

function generateRandomUsername() {
  let randomLength = Math.floor(Math.random() * 4)

  if (!randomLength) {
    randomLength = 1
  }

  const wordList = ['Kiryu', 'Dragon', 'Majima', 'Tokyo', 'Sakura']
  const listLength = wordList.length

  let randomNumber = ''
  let username = ''

  for (let i = 0; i < randomLength; i++) {
    const randomIndex = Math.floor(Math.random() * listLength);
    randomNumber += randomIndex
    username += wordList[randomIndex]
  }

  username += `#${randomNumber}`

  return username
}

function sendMessage(msg) {
  socket.emit('message', msg)
}

function handleMessageSubmit(msg) {
  const userMessage = `${username}: ${msg}`
  clearMessageField()
  appendChatMessage(userMessage)
  sendMessage(userMessage)
}

socket.on('updateUsers', (data) => {
  console.log(data)
})
