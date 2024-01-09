import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      username === '' ||
      email === '' ||
      password === ''
    ) {
      res.status(400).json({
        status: 'fail',
        data: {
          message: 'All fields are required',
        },
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: 'success',
      data: {
        newUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      data: {
        name: error.name,
        message: error.message,
      },
    });
  }
};
