const express = require('express');
const { saveUser, getUserData, toggleUserStatus, deleteUser } = require('../controllers/userlogin');

const router = express.Router();

router.post('/save', async (req, res) => {
    console.log('Request Body:', req.body); // Log the request body
  
    try {
      const { userName, city, country } = req.body;
      await saveUser(userName, city, country);
      res.status(200).json({ message: 'User saved successfully' });
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ message: 'Failed to save user' });
    }
  });
  


router.get('/', getUserData);

router.put('/:userId', toggleUserStatus);

router.delete('/:userId', deleteUser);

module.exports = router;
