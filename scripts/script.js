const socket = window.io();
const sendMsgBtn = document.querySelector('#send-msg-btn');
const msgInput = document.querySelector('#msg-input');
const msgList = document.querySelector('#msg-list');
const nickInput = document.querySelector('#nick-input');
const sendNickBtn = document.querySelector('#send-nick-btn');
const userList = document.querySelector('#user-list');
const randomNickname = `User-${Math.random().toString(20).substr(2, 11)}`;

sendMsgBtn.addEventListener('click', () => {
  const user = sessionStorage.getItem('nickname');
  socket.emit('message', { nickname: user, chatMessage: msgInput.value });
  msgInput.value = '';

  return false;
});

sendNickBtn.addEventListener('click', () => {
  socket.emit('changeNickname', nickInput.value);
  nickInput.value = '';

  return false;
});

socket.on('message', (message) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  msgList.appendChild(li);
});

socket.on('users', (online) => {
  userList.innerHTML = '';
    const active = online.find((e) => e.id === socket.id);
    const filtered = online.filter((e) => e.id !== socket.id);
    filtered.unshift(active);
    filtered.forEach((e) => {
      const li = document.createElement('li');
      li.setAttribute('data-testid', 'online-user');

      if (e.id === socket.id) {
        sessionStorage.setItem('nickname', e.nickname);
      }

      li.innerText = e.nickname;
      userList.appendChild(li);
    });
  });

  socket.emit('online', randomNickname);
