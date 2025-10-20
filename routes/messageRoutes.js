const express = require('express');
const { isAuthenticated } = require('../middleware/authMiddleware');
const messageRoute = express.Router();
const messageController = require('../controllers/messageController')

messageRoute.get('/create-message', isAuthenticated, messageController.getNewMessage);

messageRoute.post('/create-message', isAuthenticated, messageController.postNewMessage);

messageRoute.post('/delete-message/:id', messageController.deleteMessage)

module.exports = messageRoute;