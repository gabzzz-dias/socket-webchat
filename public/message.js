const moment = require('moment');
const { saveMessages } = require('../models/chat');

const newMessage = (nick, chat) => {
  const hour = moment().format('DD-MM-YYYY HH:mm:ss A');

  saveMessages({
    message: chat,
    nick,
    hour,
  });
  const messageFormat = `${hour} - ${nick}: ${chat}`;

  return messageFormat;
};

module.exports = { newMessage };
