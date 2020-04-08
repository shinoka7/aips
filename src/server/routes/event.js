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
        body('description').exists().trim(),
        body('repeats').not().isEmpty().trim(),
    ];

    // POST event
    router.post('/', csrf, validator.create, validateBody, asyncMiddleware(async(req, res) => {
        const {
            groupId, startDate, startTime, endDate, endTime, name, description, image, repeats
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

    validator.delete = [
        body('eventId').exists(),
    ];

    router.post('/delete', csrf, validator.delete, validateBody, asyncMiddleware(async(req, res) => {
        const { eventId } = req.body;
        const userId = req.session.user.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const event = await Event.findByPk(eventId);
        if (event) {
            await event.destroy();
        }

        res.json({ event });
    }));

    validator.going = [
        body('eventId').exists(),
    ];

    router.post('/going', csrf, validator.going, validateBody, asyncMiddleware(async(req, res) => {
        const { eventId } = req.body;
        const userId = req.session.user ? req.session.user.id : 0;
        const user = await User.findByPk(userId);
        let event = await Event.findByPk(eventId);
        if (!user || !event) {
            return res.status(404).send({ error: 'Event or User not found' });
        }

        event = await event.update({ goingCount: event.goingCount + 1 });
        await user.addEvent(event);

        res.json({ event });
    }));

    return router;
};