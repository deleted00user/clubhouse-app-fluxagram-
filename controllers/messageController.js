const { newMessage, deleteMessage: deleteMessageFromDB } = require("../models/messageQueries");

function getNewMessage (req, res) {
    res.render('create-message')
}

async function postNewMessage (req, res) {
    try{
        const { title, text } = req.body;
        const userId = req.user.id;
        await newMessage(title, text, userId);
        res.redirect('/')
    } catch (error) {
        console.error('Error creating new message: ', error);
        res.status(500).send('Error creating new message')
    }
};

async function deleteMessage(req, res) {
    try{
        if(!req.user || !req.user.admin){
            return res.status(403).send('Unauthorized')
        } 
        
        await deleteMessageFromDB(req.params.id); 
        res.redirect('/')
        
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).send('Error deleting message');
    }
}

module.exports = {
    getNewMessage,
    postNewMessage,
    deleteMessage
}