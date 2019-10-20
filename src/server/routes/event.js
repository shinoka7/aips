const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const validator = {};

module.exports = (aips) => {
    const middlewares = require('../middlewares')(aips);
    const { nextApp, csrf } = aips;

    const {
        async: asyncMiddleware,
        validateBody,
    } = middlewares;

    validator.create = [
        body('groupId').exists(),
        body('start').isISO8601().toDate(),
        body('end').isISO8601().toDate(),
        body('name').not().isEmpty().trim(),
        body('description').not().isEmpty().trim(),
    ];

    // POST event
    router.post('/', csrf, validator.create, validateBody, asyncMiddleware(async(req, res) => {
        const {
            groupId, start, end, name, description
        } = req.body;
        const userId = req.session.user.id;
        const user = await user.findByPk(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).send({ error: 'Group not found' });
        }

        const event = await Event.create({ groupId, startAt: start, endAt: end, name, description });
        await event.setGroup(group);

        res.json({ event });
    }));

    return router;
};