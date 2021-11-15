require('dotenv').config();
const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:3000', 'https://admin.socket.io/'],
    methods: ['GET', 'POST'],
  },
});
const { instrument } = require('@socket.io/admin-ui');
const { clearChat, getAllConversation } = require('./models/chat');
const { newMessage } = require('./public/message');

instrument(io, { auth: false });

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './public/views');
app.use(cors());

clearChat();

app.get('/', async (_, res) => {
  const chatHistory = await getAllConversation();

  res.render('room', { chatHistory });
});

const users = [];

io.on('connection', (socket) => {
  socket.on('online', (user) => {
    users.push({ id: socket.id, nickname: user });

    io.emit('users', users);
  });

  socket.on('message', ({ nick, chatMessage }) => {
    io.emit('message', newMessage(nick, chatMessage));
  });

  socket.on('changeNick', (nick) => {
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
