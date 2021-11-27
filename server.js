const app = require('express')();
const http = require('http').createServer(app);
const { instrument } = require('@socket.io/admin-ui');
const cors = require('cors');
require('dotenv').config();
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:3000', 'https://admin.socket.io/'],
    methods: ['GET', 'POST'],
  },
});
const { clearChat, getMessages } = require('./models/chat');
const { newMessage } = require('./controllers/message');

instrument(io, { auth: false });

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());

clearChat();

app.get('/', async (_, res) => {
  const chatHistory = await getMessages();

  res.render('chat', { chatHistory });
});

const users = [];

io.on('connection', (socket) => {
  socket.on('message', ({ nickname, chatMessage }) => {
    io.emit('message', newMessage(nickname, chatMessage));
  });

  socket.on('online', (user) => {
    users.push({ id: socket.id, nickname: user });
    io.emit('users', users);
  });

  socket.on('changeNickname', (nick) => {
    const i = users.findIndex((e) => e.id === socket.id);

    if (i !== -1) users.splice(i, 1);
    users.push({ id: socket.id, nickname: nick });
    io.emit('users', users);
  });

  socket.on('disconnect', () => {
    const i = users.findIndex((e) => e.id === socket.id);

    if (i !== -1) users.splice(i, 1);
    io.emit('users', users);
  });
});

http.listen(PORT, () => {
  console.log(`Listening at port ${PORT}!`);
});

// Agradecimentos especiais ao meu colega de turma Luiz Paulo Lima, da turma 10-B, que me ajudou com dúvidas que estavam me impedindo de evoluir no projeto e me direcionou, com ajuda de seu PR. Valeu, Luiz!
// PR do Luiz: https://github.com/tryber/sd-010-b-project-webchat/pull/82
