// ===== EXPRESS APP FACTORY =====
const express = require('express');
const cors = require('cors');

const { env } = require('./config/env');
const apiRouter = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error-handler');

function createApp() {
    const app = express();

    app.use(cors({ origin: env.CORS_ORIGIN }));
    app.use(express.json({ limit: '1mb' }));

    app.use('/api', apiRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}

module.exports = { createApp };
