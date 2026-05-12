const { Router } = require('express');
const examHistoryController = require('../controllers/exam-history.controller');

const router = Router();

router.get('/:userId', examHistoryController.getByUserId);
router.post('/:userId', examHistoryController.save);

module.exports = router;
