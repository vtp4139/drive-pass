// ===== HEALTH CONTROLLER =====
const health = (req, res) => {
    res.json({ status: 'OK', message: 'Server đang chạy', uptime: process.uptime() });
};

module.exports = { health };
