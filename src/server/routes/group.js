const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const validator = {};

const logger = require('../../services/logger');
const { User, Group, Notification, Event } = require('../../db/models');
const { Op } = require('sequelize');
const fs = require('fs');

module.exports = (aips) => {
    const middlewares = require('../middlewares')(aips);
    const { nextApp, csrf } = aips;

    const {
        async: asyncMiddleware,
        validateBody,
    } = middlewares;

    /**
     * GET groups page
     */
    router.get('/groups', csrf, asyncMiddleware(async(req, res) => {
        nextApp.render(req, res, '/groups/show', {
            csrfToken: req.csrfToken(),
        });
    }));

    /**
     * GET groups for page
     */
    router.get('/page/:num(\\d+)', asyncMiddleware(async(req, res) => {
        const num = Number(req.params.num);
        if (num <= 0) {
            return res.status(404).send({ error: 'page not found' });
        }

        let groups = [];
        let groupCount = 1;
        const limit = 8;
        const offset = (num - 1) * limit;
        await Group.findAndCountAll({
            offset,
            limit,
        }).then((result) => {
            groups = result.rows;
            groupCount = result.count;
        });

        res.json({ groups, totalPages: Math.ceil(groupCount/limit) });
    }));

    /**
     * GET all user's groups
     */
    router.get('/', asyncMiddleware(async(req, res) => {
        const id = req.session.user ? req.session.user.id : 0;
        
        if (id === 0) {
            return res.json({ groups: [] });
        }

        const user = await User.findByPk(id);
        const groups = await user.getGroups();
        
        return res.json({ groups });
    }));

    /**
     * GET group page by id /group/${id}
     */
    router.get('/:id(\\d+)', csrf, asyncMiddleware(async(req, res) => {
        const userId = req.session.user ? req.session.user.id : 0;
        const id = req.params.id;

        const user = await User.findByPk(userId);
        const group = await Group.findByPk(id);

        // CONSIDERING WHETHER TO USE DATE TYPE FOR DB
        // const date = new Date();
        // date.setMonth(date.getMonth() - 2);
        const events = await Event.findAll({
            where: {
                // endDate: {
                    // [Op.gte]: date,
                // },
                groupId: group.id,
            },
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

        let isUserInGroup = false;
        await group.getUsers().then((users) => {
            users.forEach((user) => {
                if (user.id === userId) {
                    isUserInGroup = true;
                }
            });
        });

        nextApp.render(req, res, '/group/show', {
            user: user || {},
            group: group || {},
            isUserInGroup: isUserInGroup,
            csrfToken: req.csrfToken(),
            events: events || [],
            images: images,
        });
    }));

    validator.create = [
        body('name').not().isEmpty().trim(),
        body('groupEmail').isEmail(),
        body('description').trim()
    ];

    /**
     * creates group
     */
    router.post('/create', csrf, validator.create, validateBody, asyncMiddleware(async(req, res) => {
        const { name, groupEmail, description } = req.body;
        const userId = req.session.user ? req.session.user.id : 0;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ error: 'user not found' });
        }

        const group = await Group.create({ name, adminUserId: userId, groupEmail, description });
        await group.addUser(user);

        await Notification.create({ userId: userId, groupId: group.id, notifyPosts: false, notifyEvents: false });
        
        res.json({ group });
    }));

    validator.update = [
        body('groupId').exists(),
        body('groupEmail').isEmail(),
        body('description').exists(),
        body('website').exists(),
        body('statement').exists(),
        body('meetingDay').exists(),
        body('meetingTime').exists(),
        body('meetingPlace').exists(),
    ];

    /** 
     * PUT /group/update UPDATES GROUP
    */
    router.put('/update', csrf, validator.update, validateBody, asyncMiddleware(async(req, res) => {
        const { groupId } = req.body;
        const userId = req.session.user ? req.session.user.id : 0;
        const user = await User.findByPk(userId);
        let group = await Group.findByPk(groupId);
        if (!group || !user) {
            return res.status(404).send({ error: 'user or group not found' });
        }

        const { groupEmail, description, website, statement, meetingDay, meetingTime, meetingPlace } = req.body;
        group = await group.update({
            groupEmail, description, website, statement, meetingDay, meetingTime, meetingPlace,
        });

        res.json({ group });
    }));

    /** 
     * DELETE /group DELETES GROUP
    */
    router.delete('/', asyncMiddleware(async(req, res) => {
        const { groupId } = req.body.data;
        const userId = req.session.user ? req.session.user.id : 0;
        const user = await User.findByPk(userId);
        let group = await Group.findByPk(groupId);
        if (!group || !user) {
            return res.status(404).send({ error: 'user or group not found' });
        }

        await user.removeGroup(group);

        const notifications = await Notification.findAll({
            where: {
                groupId: group.id,
            }
        });
        notifications.forEach(async(notification) => {
            await notification.destroy();
        });

        group = await group.destroy();
         res.json({ group });
    }));

    validator.addUser = [
        body('user').exists(),
        body('group').exists(),
    ];

    /**
     * add user to group
     */
    router.post('/addUser', csrf, validator.addUser, validateBody, asyncMiddleware(async(req, res) => {
        let { user, group } = req.body;
        user = await User.findByPk(user.id);
        group = await Group.findByPk(group.id);
        if (!user || !group) {
            return res.status(404).send({ error: 'user or group not found' });
        }

        await group.addUser(user);
        await Notification.create({ userId: user.id, groupId: group.id, notifyPosts: false, notifyEvents: false });

        res.json({ group });
    }));

    validator.deleteUser = [
        body('user').exists(),
        body('group').exists(),
    ];

    /** 
     * delete user from group
     */
    router.post('/deleteUser', csrf, validator.deleteUser, validateBody, asyncMiddleware(async(req, res) => {
        let { user, group } = req.body;
        user = await User.findByPk(user.id);
        group = await Group.findByPk(group.id);
        if (!user || !group) {
            return res.status(404).send({ error: 'user or group not found' });
        }
        
        // https://sequelize.org/master/class/lib/associations/belongs-to-many.js~BelongsToMany.html

        await group.removeUser(user);
        await Notification.destroy({
            where: {
                userId: user.id,
                groupId: group.id,
            }
        });

        res.json({ user });
    }));

    return router;
};