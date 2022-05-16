const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (!authHeader) {
    return res.status(401).json({ error: 'no token provided.' });
  } else {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_PREFIX, (err, user) => {
      if (err) res.status(401).json({ error: 'invalid token.' });
      req.user = user;
      next();
    });
  }
}

const verifyTokenAndVerification = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params._id || req.user.isAdmin) {
      next();
    } else {
      res.status(401).json({ status: false, error: 'you are not authenticated.' });
    }
  });
}

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(401).json({ status: false, error: 'you are not authenticated.' });
    }
  });
}

module.exports = { verifyToken, verifyTokenAndVerification, verifyTokenAndAdmin };