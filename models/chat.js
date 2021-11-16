const connection = require('./connection');

const clearChat = async () =>
  connection().then((db) => db.collection('messages').deleteMany({}));

const saveMessage = async (message) => {
  connection().then((db) => db.collection('messages').insertOne(message));
};

const getMessages = async () =>
  connection().then((db) => db.collection('messages').find().toArray());

module.exports = {
  clearChat,
  saveMessage,
  getMessages,
};
