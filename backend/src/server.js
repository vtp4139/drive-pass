// ===== SERVER BOOTSTRAP =====
const { createApp } = require('./app');
const { env, assertRequired } = require('./config/env');
const { closePool } = require('./database/pool');

assertRequired();

const app = createApp();

const server = app.listen(env.PORT, () => {
    console.log(`🚀 Backend đang chạy tại http://localhost:${env.PORT}`);
    console.log(`📊 API endpoint: http://localhost:${env.PORT}/api`);
});

function shutdown(signal) {
    console.log(`\n${signal} received. Đang tắt server...`);
    server.close(async () => {
        await closePool();
        process.exit(0);
    });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
