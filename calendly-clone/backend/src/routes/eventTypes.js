const express = require('express');
const router = express.Router();
const eventTypeController = require('../controllers/eventTypeController');

router.get('/', eventTypeController.getAllEventTypes);
router.post('/', eventTypeController.createEventType);
router.put('/:id', eventTypeController.updateEventType);
router.delete('/:id', eventTypeController.deleteEventType);
router.get('/:slug', eventTypeController.getEventTypeBySlug);

module.exports = router;
