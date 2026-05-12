// ===== API ROUTER AGGREGATOR =====
const { Router } = require('express');
const authRoutes = require('./auth.routes');
const healthController = require('../controllers/health.controller');
const questionRoutes = require('./question.routes');
const userStatsRoutes = require('./user-stats.routes');

const router = Router();

router.get('/health', healthController.health);
router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);
router.use('/stats', userStatsRoutes);

module.exports = router;
