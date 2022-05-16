const router = require('express').Router();
const { verifyTokenAndAdmin } = require('../routes/jwt');

const Products = require('../models/Products');

router.get('/', async (req, res) => {
  const { limit, skip, category } = req.query;

  try {
    let products;

    if (category) {
      products = await Products.find({
        categories: { $in: [category] },
      }).sort({ createdAt: -1 }).limit(limit || 0).skip(skip || 0);
    } else {
      products = await Products.find().sort({ createdAt: -1 }).limit(limit || 0).skip(skip || 0);
    }

    res.status(200).json({ status: true, data: products });
  } catch (error) {
    res.status(404).json({ status: false, error });
  }
});

router.get('/d/:_id', async (req, res) => {
  try {
    const product = await Products.findById(req.params._id);
    res.status(200).json({ status: true, data: product })
  } catch (error) {
    res.status(404).json({ status: false, error });
  }
});

router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const product = new Products(req.body);

  try {
    const savedProduct = await product.save();
    res.status(200).json({ status: true, product: savedProduct })
  } catch (error) {
    res.status(401).json({ status: false, error })
  }
});

router.patch('/u/:_id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Products.findByIdAndUpdate(req.params._id, {
      $set: req.body,
    }, { new: true });

    res.status(200).json({ status: true, data: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: false, error });
  }
});

router.delete('/d/:_id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedProduct = await Products.findByIdAndDelete(req.params._id);
    res.status(200).json({ status: true, data: deletedProduct });
  } catch (error) {
    res.status(400).json({ status: false, error });
  }
});

module.exports = router;