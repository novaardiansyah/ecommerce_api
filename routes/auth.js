const router = require('express').Router();
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// * Models (Start)
const User = require('../models/users');
// * Models (End)

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    !user && res.status(401).json({ status: false, message: 'invalid credentials.' });

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_PREFIX).toString(CryptoJS.enc.Utf8);

    req.body.password !== hashedPassword && res.status(401).json({ status: false, message: 'invalid credentials.' });

    const { password, ...others } = user.toObject();

    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin,
    }, process.env.SECRET_PREFIX, { expiresIn: '7d' });

    res.status(200).json({ status: true, message: 'valid credentials.', data: others, token: accessToken });
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const newUser = new User({
    username,
    email,
    password: CryptoJS.AES.encrypt(password, process.env.SECRET_PREFIX).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.json({ message: 'User created successfully', user: savedUser });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;