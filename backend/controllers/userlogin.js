const User = require('../models/userlogin');

const saveUser = async (userName, city, country) => {
    try {
        const newUser = new User({
            userName,
            city,
            country,
            status: 1 // Set to 1 for active, 0 for inactive
        });
        await newUser.save();
        console.log('User saved successfully:', newUser);
        return newUser;
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
};

const getUserData = async (req, res) => {
    try {
        const userData = await User.find();
        res.json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Error fetching user data' });
    }
};

const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle the status field
        user.status = user.status === 1 ? 0 : 1;
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    saveUser,
    getUserData,
    toggleUserStatus,
    deleteUser
};
