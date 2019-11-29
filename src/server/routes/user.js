const express = require('express');
const router = express.Router();

const logger = require('../../services/logger');
const { body } = require('express-validator');
const validator = {};

const { User, Notification, Group } = require('../../db/models');

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
        const user = await User.findByPk(id);
      
        if (!user) {
            return res.status(404).send({ error: 'Something went wrong...' });
        }

        try {
            await user.update(req.body);
        }
        catch (err) {
            console.log(err);
            return res.status(500).send({ error: "User info update failed" });
        }

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

    return router;
};