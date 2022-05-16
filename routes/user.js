const router = require('express').Router();
const { verifyTokenAndVerification, verifyTokenAndAdmin } = require('../routes/jwt');

const User = require('../models/users');

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const { limit, skip } = req.query;

  try {
    const user = await User.find().sort({ _id: -1 }).limit(limit || 0).skip(skip || 0);

    user.map(user => {
      return user.password = undefined;
    });

    res.status(200).json({ status: true, data: user });
  } catch (error) {
    res.status(404).json({ status: false, error });
  }
});

router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' }
        },
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({ status: true, data });
  } catch (error) {
    res.status(404).json({ status: false, error });
  }
});

router.get('/:_id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    const { password, ...others } = user.toObject();

    res.status(200).json({ status: true, data: others });
  } catch (error) {
    res.status(404).json({ status: false, error });
  }
});

router.patch('/:_id', verifyTokenAndVerification, async (req, res) => {
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

router.delete('/:_id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params._id);
    const { password, ...others } = deleteUser.toObject();

    res.status(200).json({ status: true, data: others });
  } catch (error) {
    res.status(400).json({ status: false, error });
  }
});

module.exports = router;