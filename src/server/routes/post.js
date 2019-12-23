const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const validator = {};

const { Post, User, Group, Notification } = require('../../db/models');
const mailerService = require('../../services/mailer');

module.exports = (aips) => {
    const middlewares = require('../middlewares')(aips);
    const { nextApp, csrf } = aips;

    const {
        async: asyncMiddleware,
        validateBody,
    } = middlewares;
    
    /****************** */
    // TODO implement CRUD
    /****************** */

    // GET posts
    router.get('/', asyncMiddleware(async(req, res) => {
        const posts = await Post.findAll({
            limit: 10,
            order: [[ 'createdAt', 'DESC' ]],
            include: [{
                model: Group
            }]
        });

        res.json({ posts });
    }));

    // validation
    // https://express-validator.github.io/docs/validation-chain-api.html
    validator.create = [
        body('groupId').exists(),
        body('title').not().isEmpty().trim(),
        body('content').not().isEmpty().trim()
    ];

    // POST post
    router.post('/', csrf, validator.create, validateBody, asyncMiddleware(async(req, res) => {
        const { groupId, title, content } = req.body;
        const userId = req.session.user.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).send({ error: 'Group not found' });
        }

        const post = await Post.create({ userId, groupId, title, content });
        await post.setGroup(group);

        const notifications = await Notification.findAll({
            where: {
                groupId: group.id,
                notifyPosts: true,
            },
            include: [{
                model: User,
            }],
        });

        notifications.forEach((notification) => {
            const subject = `${group.name} made a post!`;
            mailerService.sendOne('post', notification.User, subject, post.title, post.content);
        });

        res.json({ post });
    }));


    return router;
};