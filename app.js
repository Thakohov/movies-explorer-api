require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes');
const handleError = require('./middlewares/HandleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();
app.use(cors());

mongoose.connect(DB_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);
app.use(helmet());

app.use(requestLogger);
app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT);
