// ===== EXPRESS APP FACTORY =====
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const { env } = require('./config/env');
const apiRouter = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error-handler');

function createApp() {
    const app = express();
    const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
    const frontendIndexPath = path.join(frontendDistPath, 'index.html');
    const hasFrontendBuild = fs.existsSync(frontendIndexPath);

    app.use(cors({ origin: env.CORS_ORIGIN }));
    app.use(express.json({ limit: '1mb' }));

    app.use('/api', apiRouter);

    if (hasFrontendBuild) {
        app.use(express.static(frontendDistPath));

        app.get('*', (req, res, next) => {
            if (req.path.startsWith('/api')) return next();
            return res.sendFile(frontendIndexPath);
        });
    }

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}

module.exports = { createApp };
