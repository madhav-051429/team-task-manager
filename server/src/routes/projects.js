const express = require('express');
const { getAll, getById, create, update, remove } = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const router = express.Router();

router.get('/', authenticate, getAll);
router.post('/', authenticate, requireRole('ADMIN'), create);
router.get('/:id', authenticate, getById);
router.put('/:id', authenticate, requireRole('ADMIN'), update);
router.delete('/:id', authenticate, requireRole('ADMIN'), remove);

module.exports = router;
