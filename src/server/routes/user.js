const express = require('express');
const router = express.Router();

const logger = require('../../services/logger');
const { body } = require('express-validator');
const validator = {};
const fs = require('fs');

const { User, Notification, Group, Event } = require('../../db/models');

module.exports = (aips) => {
    const middlewares = require('../middlewares')(aips);
    const { nextApp, csrf } = aips;

    const {
        async: asyncMiddleware,
        validateBody,
    } = middlewares;

    // gets the user's page
    // GET /user
    router.get('/', csrf, asyncMiddleware(async(req, res) => {
        const id = req.session.user ? req.session.user.id : 0;

        const user = await User.findByPk(id);

        if (!user) {
            return res.redirect("/login");
        }

        const groups = await user.getGroups();

        // let events = [];
        // THIS IS FOR ALL EVENTS THAT ARE MADE BY ALL GROUPS YOU'RE IN
        // groups.forEach(async(group) => {
        //     const groupEvents = await Event.findAll({
        //         where: {
        //             groupId: group.id,
        //         },
        //         include: [{
        //             model: Group,
        //         }],
        //     });
        //     events = await events.concat(groupEvents);
        // });

        const events = await user.getEvents({
            include: [{
                model: Group,
            }],
        });

        const images = [];
        fs.readdir('./resources/img/buildings', (err, files) => {
            if (err) {
                return console.log('Unable to scan directory:' + err);
            }
            files.forEach((file) => {
                images.push(file);
            })
        });

        const notifications = await Notification.findAll({
            where: {
                userId: user.id,
            },
            include: [{
                model: Group,
            }],
        });

        nextApp.render(req, res, '/user/show', {
            user: user,
            notifications: notifications,
            csrfToken: req.csrfToken(),
            events: events,
            groups: groups || [],
            images: images,
        });
    }));

    validator.update = [
        body('username').not().isEmpty().trim(),
        body('firstName').not().isEmpty().trim(),
        body('lastName').not().isEmpty().trim()
    ];

    // updates the user's info 
    // PUT /user/${id}/update
    router.put('/update', csrf, validator.update, validateBody, asyncMiddleware(async(req, res) => {
        const id = req.session.user ? req.session.user.id : 0;
        let user = await User.findByPk(id);
      
        if (!user) {
            return res.status(404).send({ error: 'Something went wrong...' });
        }
        
        user = await user.update(req.body);
        req.session.user = user;

        res.json({ user });
    }));

    router.put('/update/notifications', csrf, asyncMiddleware(async(req, res) => {
        const id = req.session.user ? req.session.user.id : 0;
        const user = await User.findByPk(id);
      
        if (!user) {
            return res.status(404).send({ error: 'Something went wrong...' });
        }

        const notification = await Notification.findByPk(req.body.notificationId);
        if (req.body.notifyPosts !== null) {
            await notification.update({ notifyPosts: req.body.notifyPosts });
        }

        if (req.body.notifyEvents !== null) {
            await notification.update({ notifyEvents: req.body.notifyEvents });
        }
        
        res.json({ notification });
    }));

    router.get('/isGoing/:eventId(\\d+)', asyncMiddleware(async(req, res) => {
        const userId = req.session.user ? req.session.user.id : 0;
        const eventId = req.params.eventId;
        let user = await User.findByPk(userId);
        const event = await Event.findByPk(eventId);
        if (!user) {
            return res.json({ userIsGoing: true, user: {} });
        }

        const userIsGoing = await user.hasEvent(event);

        res.json({ userIsGoing, user });
    }));

    return router;
};