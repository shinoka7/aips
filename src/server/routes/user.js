const express = require('express');
const router = express.Router();

const { body } = require('express-validator');
const validator = {};

const { User } = require('../../db/models');

module.exports = (aips) => {
    const middlewares = require('../middlewares')(aips);
    const { nextApp } = aips;

    const {
        async: asyncMiddleware,
        validate,
        csrfVerify: csrf,
    } = middlewares;

    // gets the user's page
    // GET /user
    router.get('/', asyncMiddleware(async(req, res) => {
        const id = req.session.user ? req.session.user.id : 0;

        const user = await User.findByPk(id);

        if (!user) {
            return res.redirect("/login");
        }

        const groups = await user.getGroups();

        nextApp.render(req, res, '/user/show', {
            user: user,
            groups: groups,
        });
    }));

    validator.update = [
        body('username').not().isEmpty().trim(),
        body('firstName').not().isEmpty().trim(),
        body('lastName').not().isEmpty().trim()
    ];

    // updates the user's info 
    // PUT /user/${id}/update
    router.put('/:id(\\d+)/update', csrf, validator.update, validate, asyncMiddleware(async(req, res) => {
        const { id } = req.params;
        // console.log(req.user);
        // const userId = req.user.id;
        // TODO add user to req

        const user = await User.findByPk(id);

        // userId !== Number(id) || 
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

    // router.post('', validate, asyncMiddleware(async(req, res) => {

    //     res.json({});
    // }));


    return router;
};