const connection = require('./connection');

const getAllConversation = async () => {
  connection()
    .then((db) => {
      db.collection('messages').find().toArray();
    });
};

const clearChat = async () =>
  connection()
    .then((db) => {
      db.collection('messages').deleteMany({});
    });

const saveMessages = async (message) => {
  connection()
    .then((db) => {
      db.collection('messages').insertOne(message);
    });
};

module.exports = {
  clearChat,
  saveMessages,
  getAllConversation,
};
