const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/', (req, res) => {
  res.send('Hello World!');
});
// Setting up the Model for the database schema and also setting up the routes
// 16May2022_A1
module.exports = router;