const Message = require('../models/message');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

exports.createMessage = async (req, res) => {
    const { message } = req.body;

    try {
        const newMessage = new Message({ message });
        await newMessage.save();
        res.status(201).json({ message: 'Message created successfully!' });

        // Forward the message to your Telegram bot
        const botToken = process.env.TOKEN;
        const chatId = process.env.CHAT_ID; // Update with your chat ID
        const botUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const botMessage = `New message: ${message}`;
        await axios.post(botUrl, { chat_id: chatId, text: botMessage });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to create message. Please try again.' });
    }
};
