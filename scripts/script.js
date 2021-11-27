const socket = window.io();

const send = document.querySelector('#send');
const msgInput = document.querySelector('#textMessage');
const chatMessage = document.querySelector('#chatMessage');
const nick = document.querySelector('#nick');
const sendNick = document.querySelector('#sendNick');
const users = document.querySelector('#users');
const randomNick = `User-${Math.random().toString(20).substr(2, 11)}`;

send.addEventListener('click', () => {
  const user = sessionStorage.getItem('nickname');
  socket.emit('message', { nickname: user, chatMessage: msgInput.value });
  msgInput.value = '';

  return false;
});

sendNick.addEventListener('click', () => {
  socket.emit('changeNickname', nick.value);
  nick.value = '';

  return false;
});

socket.on('message', (message) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  chatMessage.appendChild(li);
});

socket.on('users', (online) => {
  users.innerHTML = '';
  const active = online.find((element) => element.id === socket.id);
  const filtered = online.filter((element) => element.id !== socket.id);
  
  filtered.unshift(active);
  filtered.forEach((element) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');

    if (element.id === socket.id) {
      sessionStorage.setItem('nickname', element.nickname);
    }
    li.innerText = element.nickname;
    users.appendChild(li);
  });
});

socket.emit('online', randomNick);
