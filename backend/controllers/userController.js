// backend/controllers/userController.js - User controller for AI Financial Assistant

import User from '../models/User.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const updates = (({ name, phone, preferences }) => ({ name, phone, preferences }))(req.body);
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user profile', error: error.message });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete user account', error: error.message });
  }
};
