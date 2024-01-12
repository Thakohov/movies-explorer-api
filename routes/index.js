const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');
const { login, createUser } = require('../controllers/users');
const { validateCreateUser, validateLoginUser } = require('../middlewares/validation');

router.post('/signin', validateLoginUser, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => next(new NotFound('Ресурс не найден')));

module.exports = router;
