const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const cron = require('node-cron');

const userRouter = require('./router/userlogin'); 
const messageRouter = require('./router/message');
// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the express server
    app.listen(process.env.PORT, () => {
      console.log('Listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Initialize Telegram bot
const botToken = process.env.TOKEN;
const bot = new TelegramBot(botToken, { polling: true });

// Handle "/start" command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  // Prompt the user for their name
  await bot.sendMessage(chatId, `Hi ${username}, please enter your name:`);

  // Listen for the user's name
  bot.once('message', async (msg) => {
    const name = msg.text;

    // Prompt the user for their city
    await bot.sendMessage(chatId, 'Please enter your city name:');

    // Listen for the user's city
    bot.once('message', async (msg) => {
      const city = msg.text;

      // Prompt the user for their country
      await bot.sendMessage(chatId, 'Please enter your country name:');

      // Listen for the user's country
      bot.once('message', async (msg) => {
        const country = msg.text;

        // Validate the city and country
        const weatherData = await fetchWeatherByCityOrCountry(city, country);
        await bot.sendMessage(chatId, weatherData);

        // Save the user's information to MongoDB
        try {
          const response = await axios.post('http://localhost:4040/user/save', {
            userName: name,
            city,
            country,
          });
          console.log('User saved:', response.data);
          await bot.sendMessage(chatId, 'Thank you for providing your information.');
        } catch (error) {
          console.error('Failed to save user:', error);
          await bot.sendMessage(chatId, 'Failed to save your information. Please try again later.');
        }
      });
    });
  });
});


// Function to fetch weather data by city or country name
async function fetchWeatherByCityOrCountry(city, country) {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}`;
    const response = await axios.get(url);
    
    if (response.data.cod === '404') {
      return `City or country not found. Please check your input and try again.`;
    }

    const weather = response.data.weather[0].description;
    const temperature = response.data.main.temp;
    return `Weather in ${city}, ${country}: ${weather}, Temperature: ${temperature}°C`;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return 'Error fetching weather data. Please try again.';
  }
}


// Schedule a cron job to run every day at 1:00 PM
cron.schedule('0 13 * * *', async () => {
  try {
    console.log('Cron job started');
    // Fetch weather data for all users in the database
    const users = await User.find();
    for (const user of users) {
      const weatherData = await fetchWeatherByCityOrCountry(user.city, user.country);
      bot.sendMessage(user.chatId, weatherData);
    }
    console.log('Weather updates sent successfully');
  } catch (error) {
    console.error('Failed to send weather updates:', error);
  }
});


// Use the user router
app.use('/user', userRouter);
app.use('/message', messageRouter);
module.exports = app;
