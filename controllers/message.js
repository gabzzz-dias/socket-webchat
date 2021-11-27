const moment = require('moment');
const { saveMessage } = require('../models/chat');

const newMessage = (nickname, chat) => {
  const time = moment().format('DD-MM-YYYY HH:mm:ss A');
  saveMessage({ message: chat, nickname, time });
  const msg = `${time} - ${nickname}: ${chat}`;

  return msg;
};

module.exports = { newMessage };
