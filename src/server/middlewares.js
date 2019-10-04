const { validationResult } = require('express-validator');

module.exports = (aips) => {
    const middlewares = {};

    middlewares.csrfKeyGenerator = (() => {
        return (req, res, next) => {
            const csrfKey = (req.session.user && req.session.user.id) || 'anon';
            if (req.csrfToken === null) {
                req.csrfToken = aips.tokens.create(csrfKey);
            }
            next();
        };
    });

    middlewares.csrfVerify = ((req, res, next) => {
        const token = req.body._csrf || null;
        const csrfKey = (req.session.user && req.session.user.id) || 'anon';

        if (aips.tokens.verify(csrfKey, token)) {
            console.log('csrf successfully verified');
            return next();
        }

        console.log('csrf verification failed. return 403', csrfKey, token);
        return res.sendStatus(403);
    });

    middlewares.async = ((func) => {
        return (req, res, next) => {
            Promise.resolve(func(req, res, next))
                .catch(next);
        };
    });

    middlewares.validate = ((req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        return next();
    });

    return middlewares;
}