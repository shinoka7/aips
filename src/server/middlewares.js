const { validationResult } = require('express-validator');

const middlewares = {};

middlewares.csrfKeyGenerator = function() {
    return function(req, res, next) {
        const csrfKey = (req.session && req.session.id) || 'anon';

        if (req.csrfToken === null) {
            req.csrfToken = crowi.getTokens().create(csrfKey);
        }

        next();
    };
};

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

module.exports = middlewares;