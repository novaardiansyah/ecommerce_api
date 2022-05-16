const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/', (req, res) => {
  let username = req.body.username;
  res.send('Hello ' + username);
});

module.exports = router;