const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) {
        res.status(403).json("Token is not valid.");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).send('Access Denied');
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      res.locals.token = token; // pass token to res.locals object
      next();
    } catch (error) {
      res.status(400).send('Invalid Token');
    }
  }
}


module.exports = verifyToken;
