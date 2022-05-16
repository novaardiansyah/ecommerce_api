const router = require('express').Router();
const { verifyTokenAndVerification } = require('../routes/jwt');

// * Models (Start)
const User = require('../models/users');
// * Models (End)

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/', (req, res) => {
  let username = req.body.username;
  res.send('Hello ' + username);
});

router.put('/:_id', verifyTokenAndVerification, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_PREFIX).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params._id, {
      $set: req.body,
    }, { new: true });

    const { password, ...others } = updatedUser.toObject();

    res.status(200).json({ status: true, message: 'User updated successfully', data: others });
  } catch (error) {
    res.status(400).json({ status: false, message: 'User not updated', error });
  }
});

module.exports = router;