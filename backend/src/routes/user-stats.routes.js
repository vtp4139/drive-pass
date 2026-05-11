const { Router } = require('express');
const userStatsController = require('../controllers/user-stats.controller');

const router = Router();

router.get('/:userId', userStatsController.getByUserId);
router.post('/:userId', userStatsController.save);

module.exports = router;
