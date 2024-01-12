const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET = 'JWT_SECRET' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
