const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const validator = {};

const { User, Group, Notification } = require('../../db/models');

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

        nextApp.render(req, res, '/group/show', {
            user: user || {},
            group: group || {},
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

    return router;
};