const express = require('express');
const { create, updateStatus, update, remove } = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const router = express.Router();

router.post('/', authenticate, requireRole('ADMIN'), create);
router.put('/:id/status', authenticate, updateStatus);
router.put('/:id', authenticate, requireRole('ADMIN'), update);
router.delete('/:id', authenticate, requireRole('ADMIN'), remove);

module.exports = router;
