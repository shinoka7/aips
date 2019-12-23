const express = require('express');
const router = express.Router();

const { body } = require('express-validator');
const { Event, User, Group, Notification } = require('../../db/models');

const mailerService = require('../../services/mailer');

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
        body('startDate').not().isEmpty().trim(),
        body('startTime').not().isEmpty().trim(),
        body('endDate').not().isEmpty().trim(),
        body('endTime').not().isEmpty().trim(),
        body('name').not().isEmpty().trim(),
        body('description').not().isEmpty().trim(),
    ];

    // POST event
    router.post('/', csrf, validator.create, validateBody, asyncMiddleware(async(req, res) => {
        const {
            groupId, startDate, startTime, endDate, endTime, name, description, image
        } = req.body;
        const userId = req.session.user.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).send({ error: 'Group not found' });
        }

        const event = await Event.create({ groupId, startDate: startDate, startTime: startTime, endDate: endDate, endTime: endTime, name, description, image });
        await event.setGroup(group);

        const notifications = await Notification.findAll({
            where: {
                groupId: group.id,
                notifyEvents: true,
            },
            include: [{
                model: User,
            }],
        });

        notifications.forEach((notification) => {
            const subject = `${group.name} created an event!`;
            mailerService.sendOne('event', notification.User, subject, event.name, event.description);
        });

        res.json({ event });
    }));

    return router;
};