const router = require('express').Router();
const { verifyTokenAndAdmin, verifyToken, verifyTokenAndVerification } = require('../routes/jwt');

const Carts = require('../models/Carts');

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const { limit, skip } = req.query;

  try {
    let carts = await Carts.find().sort({ createdAt: -1 }).limit(limit || 0).skip(skip || 0);
    res.status(200).json({ status: true, data: carts });
  } catch (error) {
    res.status(404).json({ status: false, error });
  }
});

router.get('/d/:_id', verifyTokenAndVerification, async (req, res) => {
  try {
    const cart = await Carts.findOne({ userId: req.params._id });
    res.status(200).json({ status: true, data: cart })
  } catch (error) {
    res.status(404).json({ status: false, error });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const cart = new Carts(req.body);

  try {
    const savedCart = await cart.save();
    res.status(200).json({ status: true, data: savedCart })
  } catch (error) {
    res.status(401).json({ status: false, error })
  }
});

router.patch('/u/:_id', verifyTokenAndVerification, async (req, res) => {
  try {
    const updatedCart = await Carts.findByIdAndUpdate(req.params._id, {
      $set: req.body,
    }, { new: true });

    res.status(200).json({ status: true, data: updatedCart });
  } catch (error) {
    res.status(400).json({ status: false, error });
  }
});

router.delete('/d/:_id', verifyTokenAndVerification, async (req, res) => {
  try {
    const deletedCart = await Carts.findByIdAndDelete(req.params._id);
    res.status(200).json({ status: true, data: deletedCart });
  } catch (error) {
    res.status(400).json({ status: false, error });
  }
});

module.exports = router;