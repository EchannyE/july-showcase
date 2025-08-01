import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get logged-in user profile
// @route   GET /api/profile
// @access  Private
// controllers/userController.js

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get profile' });
  }
};

// @desc    Update user profile
export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { name, email, password, phone } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;

  if (password) {
    user.password = password; // ensure password is hashed in model pre-save
  }

  const updatedUser = await user.save();
  res.json({
    message: 'Profile updated successfully',
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
    },
  });
};

// @desc    Delete user account
// @route   DELETE /api/profile
// @access  Private
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found for deletion' });
    }

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Failed to delete user account', error: err.message });
  }
};

