const Movie = require('../models/movie');

const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const NoPermission = require('../errors/NoPermission');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные при создании карточки фильма'),
        );
        return;
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      next(new NotFound('Карточка фильма по данному id не найдена'));
    })
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Карточка фильма с указанным _id не найдена');
      }

      if (movie.owner.toString() !== req.user._id) {
        throw new NoPermission('Нет прав на удаление чужой карточки фильма');
      }

      Movie.findByIdAndDelete(req.params._id).then(() => res.send({ message: 'Карточка фильма удалена' })).catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный id карточки фильма'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
