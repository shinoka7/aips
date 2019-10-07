const { validationResult } = require('express-validator');

const { User } = require('../db/models');

module.exports = (aips) => {
    const middlewares = {};

    middlewares.validateUser = (async(req, res, next) => {
        const userId = req.session.user ? req.session.user.id : 0;
        const user = await User.findByPk(userId);
        if (!user) {
            console.log('Invalid User');
            return res.sendStatus(403);
        }
        next();
    });

    /*********************************************************/
    /** WILL APPLY USER AUTH EVERY POST/PUT/DELETE METHOD ****/
    /*********************************************************/
    // middlewares.csrfKeyGenerator = (() => {
    //     return (req, res, next) => {
    //         const csrfKey = (req.session.user && req.session.user.id) || 'anon';
    //         if (req.csrfToken === null) {
    //             //https://github.com/iaincollins/next-auth
    //             console.log('CSRF Token created');
    //             req.csrfToken = aips.getTokens().create(csrfKey);
    //         }
    //         next();
    //     };
    // });

    // middlewares.csrfVerify = ((req, res, next) => {
    //     const token = req.body._csrf || null;
    //     const csrfKey = (req.session.user && req.session.user.id) || 'anon';

    //     if (aips.getTokens().verify(csrfKey, token)) {
    //         console.log('csrf successfully verified');
    //         return next();
    //     }

    //     console.log('csrf verification failed. return 403', csrfKey, token);
    //     return res.sendStatus(403);
    // });

    middlewares.async = ((func) => {
        return (req, res, next) => {
            Promise.resolve(func(req, res, next))
                .catch(next);
        };
    });

    middlewares.validateBody = ((req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        return next();
    });

    return middlewares;
}