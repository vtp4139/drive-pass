const { Router } = require('express');
const questionController = require('../controllers/question.controller');

const router = Router();

router.get('/', questionController.getAll);
router.post('/', questionController.create);
router.get('/category/:category', questionController.getByCategory);
router.get('/:id', questionController.getById);

module.exports = router;
