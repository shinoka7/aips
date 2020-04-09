const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const validator = {};

const logger = require('../../services/logger');
const { User, Group, Notification, Event, Category, Pending } = require('../../db/models');
const { Op } = require('sequelize');
const fs = require('fs');
const mailerService = require('../../services/mailer');
//
const url = require('url');
const querystring = require('querystring');

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
        const categories = await Category.findAll();

        nextApp.render(req, res, '/groups/show', {
            categories: categories || [],
            csrfToken: req.csrfToken(),
        });
    }));

    /**
     * GET groups for page
     */
    router.get('/page/:categoryId(\\d+)/:num(\\d+)', asyncMiddleware(async(req, res) => {
        const userId = req.session.user ? req.session.user.id : 0;
        const user = await User.findByPk(userId);
        const num = Number(req.params.num);
        const categoryId = Number(req.params.categoryId);
        const searchString = req.query.searchString;
        if (num <= 0) {
            return res.status(404).send({ error: 'page not found' });
        }
        let groups = [];
        let groupCount = 1;
        const limit = 8;
        const offset = (num - 1) * limit;
        /* If the search bar is empty and category is 'all',
        return all groups. */
        if (categoryId === 0 && !searchString)
        {
            await Group.findAndCountAll({
                offset,
                limit,
                include: [{
                    model: Category,
                }],
            }).then((result) => {
                groups = result.rows;
                groupCount = result.count;
            });
        }
        /* If the search bar is non-empty and category is 'all',
        return groups containing the substring searched for. */
        else if (categoryId === 0)
        {
            await Group.findAndCountAll({
            offset,
            limit,
            where: {
                name : {
                    [Op.substring]: searchString
                }
            },
            include: [{
                model: Category,
            }],
            }).then((result) => {
                groups = result.rows;
                groupCount = result.count;
            });
        }
        /* If the search bar is empty and category is
        specified, return groups based on categoryID. */
        else if (categoryId != 0 && !searchString)
        {
            await Group.findAndCountAll({
                offset,
                limit,
                where: {
                    categoryId,
                },
                include: [{
                    model: Category,
                }],
            }).then((result) => {
                groups = result.rows;
                groupCount = result.count;
            });
        }
        /* If the search bar is non-empty and category is specified,
        return groups within the specified category,
        containing the substring searched for. */
        else
        { 
            await Group.findAndCountAll({
            offset,
            limit,
            where: {
                categoryId,
                name : {
                    [Op.substring]: searchString
                }
            },
            include: [{
                model: Category,
            }],
            }).then((result) => {
                groups = result.rows;
                groupCount = result.count;
            });
           
        }
        res.json({ groups, totalPages: Math.ceil(groupCount/limit), user: user || {} });
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

        if (!group) {
            return res.status(404).send({ error: 'group not found' });
        }

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

        const category = await Category.findByPk(group.categoryId);

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

        const pendingUsers = await Pending.findAll({
            where: {
                groupId: group.id,
            },
            include: [{
                model: User,
            }],
        });

        nextApp.render(req, res, '/group/show', {
            user: user || {},
            group: group,
            category: category || {},
            isUserInGroup: isUserInGroup,
            csrfToken: req.csrfToken(),
            events: events || [],
            images: images,
            pendingUsers: pendingUsers || [],
        });
    }));

    validator.create = [
        body('name').not().isEmpty().trim(),
        body('groupEmail').isEmail(),
        body('description').trim(),
        body('categoryId').exists(),
    ];

    /**
     * creates group
     */
    router.post('/create', csrf, validator.create, validateBody, asyncMiddleware(async(req, res) => {
        const { name, groupEmail, description, categoryId } = req.body;
        const userId = req.session.user ? req.session.user.id : 0;
        let user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ error: 'user not found' });
        }

        const group = await Group.create({ name, adminUserId: userId, groupEmail, description, categoryId, statement: "" });
        user = await user.update({ groupsCreated: user.groupsCreated + 1 });
        await group.addUser(user);

        const category = await Category.findByPk(categoryId);
        await group.setCategory(category);

        await Notification.create({ userId: userId, groupId: group.id, notifyPosts: false, notifyEvents: false });
        
        res.json({ group });
    }));

    validator.updateInfo = [
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
     * PUT /group/update/info UPDATES GROUP INFO
    */
    router.put('/update/info', csrf, validator.updateInfo, validateBody, asyncMiddleware(async(req, res) => {
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


    validator.updateSettings = [
        body('groupId').exists(),
        body('mailingList').isEmail(),
    ];

    /**
     * PUT /group/update/settings UPDATES GROUP SETTINGS
    */
    router.put('/update/settings', csrf, validator.updateSettings, validateBody, asyncMiddleware(async(req, res) => {
        const { groupId, mailingList } = req.body;
        const userId = req.session.user ? req.session.user.id : 0;
        const user = await User.findByPk(userId);
        let group = await Group.findByPk(groupId);
        if (!group || !user) {
            return res.status(404).send({ error: 'user or group not found' });
        }

        group = await group.update({
            mailingList,
        });

        res.json({ group });
    }));

    /** 
     * DELETE /group DELETES GROUP
     * BAD STYLE ***USE CSRF***
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
        body('userId').exists(),
        body('groupId').exists(),
    ];

    /**
     * add user to group (user will be added to pending list)
     * 
     * [BUG]
     *  What is supposed to happen:
     *      - A user can leave a group and then (send a request to) join back in
     *      - A user can join a group on a different account, after logging out of 1 and logging in on another
     *          (This technically shouldn't be allowed ***no multiple accounts***)
     *  What currently happens: 
     *      - When a user leaves a group and joins it, the request returns 500
     *      - When a user logs out of an account and logs into another, joining a group shows the same
     *        error as above
     *  Potential Problem:
     *      - Session isn't correctly killed after login/logout (csrf validation problem)
     */
    router.post('/addUser', csrf, validator.addUser, validateBody, asyncMiddleware(async(req, res) => {
        const { userId, groupId } = req.body;
        const user = await User.findByPk(userId);
        const group = await Group.findByPk(groupId);
        if (!user || !group) {
            return res.status(404).send({ error: 'user or group not found' });
        }

        await Pending.findOrCreate({
            where: {
                userId: user.id,
                groupId: group.id,
            }
        })
        .spread(async(pending, created) => {
            if (created) {
                await pending.addUser(user);
            }
        });

        res.json({ user });
    }));

    validator.deleteUser = [
        body('userId').exists(),
        body('groupId').exists(),
    ];

    /** 
     * delete user from group
     */
    router.post('/deleteUser', csrf, validator.deleteUser, validateBody, asyncMiddleware(async(req, res) => {
        const { userId, groupId } = req.body;
        const user = await User.findByPk(userId);
        const group = await Group.findByPk(groupId);
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

    validator.acceptUser = [
        body('userId').exists(),
        body('groupId').exists(),
    ];

    /** 
     * approve user to group
    */
    router.post('/acceptUser', csrf, validator.acceptUser, validateBody, asyncMiddleware(async(req, res) => {
        const { userId, groupId } = req.body;
        const user = await User.findByPk(userId);
        const group = await Group.findByPk(groupId);
        if (!user || !group) {
            return res.status(404).send({ error: 'user or group not found' });
        }

        // DONE ON APPROVAL
        await group.addUser(user);
        await Notification.create({ userId: user.id, groupId: group.id, notifyPosts: false, notifyEvents: false });
        await Pending.destroy({
            where: {
                userId: user.id,
                groupId: group.id,
            }
        });

        // Thinking of adding approval notifications...
        // => problem is whether the user wants to be randomly contacted

        res.json({ user });
    }));

    validator.rejectUser = [
        body('userId').exists(),
        body('groupId').exists(),
    ];

    /** 
     * reject user from group
    */
    router.post('/rejectUser', csrf, validator.rejectUser, validateBody, asyncMiddleware(async(req, res) => {
        const { userId, groupId } = req.body;
        const user = await User.findByPk(userId);
        const group = await Group.findByPk(groupId);
        if (!user || !group) {
            return res.status(404).send({ error: 'user or group not found' });
        }

        await Pending.destroy({
            where: {
                userId: user.id,
                groupId: group.id,
            }
        });

        res.json({ user });
    }));

    return router;
};